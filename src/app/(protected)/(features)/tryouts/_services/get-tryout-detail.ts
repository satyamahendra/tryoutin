"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

const tryoutDetailSelect = Prisma.validator<Prisma.ExamSelect>()({
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
            bundle_items: {
                select: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price_actual: true,
                        },
                    },
                },
            },
        },
    },
    parts: {
        orderBy: {order_index: "asc"},
        select: {
            id: true,
            name: true,
            duration_minutes: true,
            passing_score: true,
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

export type GetTryoutDetail = Prisma.ExamGetPayload<{select: typeof tryoutDetailSelect}>

export async function getTryoutDetail(productId: string): Promise<ServerResult<GetTryoutDetail & {owned: boolean}>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const exam = await prisma.exam.findFirst({
            select: tryoutDetailSelect,
            where: {
                product_id: productId,
                is_active: true,
            },
        })

        if (!exam) throw new Error("Tryout not found")

        const entitlement = await prisma.entitlement.findFirst({
            where: {
                user_id: session.user.id,
                product_id: productId,
            },
            select: {id: true},
        })

        return {
            success: true,
            message: "Tryout fetched successfully",
            data: {...exam, owned: !!entitlement},
        }
    } catch (error) {
        return handleServerError(error)
    }
}
