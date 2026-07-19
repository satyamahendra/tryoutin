"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

const tryoutSelect = Prisma.validator<Prisma.ExamSelect>()({
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

export type GetTryout = Prisma.ExamGetPayload<{select: typeof tryoutSelect}>

export type GetTryouts = {
    tryouts: (GetTryout & {owned: boolean})[]
}

export async function getTryouts({search, category, tags}: {search?: string; category?: string; tags?: string}): Promise<ServerResult<GetTryouts>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const where: Prisma.ExamWhereInput = {
            is_active: true,
            product: {isNot: null},
        }

        if (search) {
            where.OR = [
                {title: {contains: search, mode: "insensitive"}},
                {description: {contains: search, mode: "insensitive"}},
                {product: {name: {contains: search, mode: "insensitive"}}},
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

        const [tryouts, entitlements] = await Promise.all([
            prisma.exam.findMany({
                select: tryoutSelect,
                where,
                orderBy: {created_at: "desc"},
            }),
            prisma.entitlement.findMany({
                where: {user_id: session.user.id},
                select: {product_id: true},
            }),
        ])

        const ownedProductIds = new Set(entitlements.map((e) => e.product_id))

        const tryoutsWithOwnership = tryouts.map((tryout) => ({
            ...tryout,
            owned: tryout.product ? ownedProductIds.has(tryout.product.id) : false,
        }))

        return {
            success: true,
            message: "Tryouts fetched successfully",
            data: {tryouts: tryoutsWithOwnership},
        }
    } catch (error) {
        return handleServerError(error)
    }
}
