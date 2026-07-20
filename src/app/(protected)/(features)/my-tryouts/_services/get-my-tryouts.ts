"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

const myTryoutSelect = Prisma.validator<Prisma.ExamSelect>()({
    id: true,
    title: true,
    description: true,
    category: true,
    duration_minutes: true,
    product: {
        select: {
            id: true,
            name: true,
            price_actual: true,
            price_alternate: true,
            type: true,
        },
    },
    parts: {
        select: {
            id: true,
            name: true,
            duration_minutes: true,
            _count: {
                select: {questions: true},
            },
        },
    },
    tags: {
        select: {
            tag: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
    _count: {
        select: {parts: true},
    },
})

export type GetMyTryout = Prisma.ExamGetPayload<{select: typeof myTryoutSelect}>
export type GetMyTryouts = {tryouts: GetMyTryout[]}

export async function getMyTryouts({search, category, tags}: {search?: string; category?: string; tags?: string}): Promise<ServerResult<GetMyTryouts>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const entitlements = await prisma.entitlement.findMany({
            where: {user_id: session.user.id},
            select: {product_id: true},
        })

        const ownedProductIds = entitlements.map((e) => e.product_id)

        if (ownedProductIds.length === 0) {
            return {success: true, message: "My tryouts fetched successfully", data: {tryouts: []}}
        }

        const where: Prisma.ExamWhereInput = {
            is_active: true,
            product_id: {in: ownedProductIds},
        }

        if (search) {
            where.OR = [
                {title: {contains: search, mode: "insensitive"}},
                {description: {contains: search, mode: "insensitive"}},
            ]
        }

        if (category) {
            where.category = category
        }

        if (tags) {
            const tagNames = tags.split(",").filter(Boolean)
            if (tagNames.length > 0) {
                where.tags = {some: {tag: {name: {in: tagNames}}}}
            }
        }

        const tryouts = await prisma.exam.findMany({
            select: myTryoutSelect,
            where,
            orderBy: {created_at: "desc"},
        })

        return {success: true, message: "My tryouts fetched successfully", data: {tryouts}}
    } catch (error) {
        return handleServerError(error)
    }
}
