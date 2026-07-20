"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

const myTryoutDetailSelect = Prisma.validator<Prisma.ExamSelect>()({
    id: true,
    title: true,
    description: true,
    category: true,
    duration_minutes: true,
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

export type GetMyTryoutDetail = Prisma.ExamGetPayload<{select: typeof myTryoutDetailSelect}>

export async function getMyTryoutDetail(productId: string): Promise<ServerResult<GetMyTryoutDetail>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const exam = await prisma.exam.findFirst({
            select: myTryoutDetailSelect,
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

        if (!entitlement) throw new Error("You do not own this tryout")

        return {
            success: true,
            message: "Tryout fetched successfully",
            data: exam,
        }
    } catch (error) {
        return handleServerError(error)
    }
}
