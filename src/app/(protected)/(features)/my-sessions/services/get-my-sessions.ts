"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

const sessionSelect = Prisma.validator<Prisma.ExamSessionSelect>()({
    id: true,
    type: true,
    status: true,
    started_at: true,
    submitted_at: true,
    total_score: true,
    scaled_score: true,
    scaled_max: true,
    mc_score: true,
    sc_earned: true,
    sc_max: true,
    mc_earned: true,
    mc_max: true,
    objective_answered: true,
    exam: {
        select: {
            id: true,
            title: true,
            category: true,
            _count: {
                select: {parts: true},
            },
        },
    },
    part_sessions: {
        select: {
            id: true,
            status: true,
            part: {
                select: {
                    id: true,
                    name: true,
                    order_index: true,
                    _count: {
                        select: {questions: true},
                    },
                },
            },
        },
        orderBy: {part: {order_index: "asc"}},
    },
    _count: {
        select: {answers: true},
    },
})

export type GetMySession = Prisma.ExamSessionGetPayload<{select: typeof sessionSelect}>

export type GetMySessions = {
    sessions: (GetMySession & {sc_earned: number; sc_max: number; mc_earned: number; mc_max: number})[]
}

export async function getMySessions(): Promise<ServerResult<GetMySessions>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const sessions = await prisma.examSession.findMany({
            select: sessionSelect,
            where: {user_id: session.user.id},
            orderBy: {updated_at: "desc"},
        })

        if (sessions.length === 0) {
            return {
                success: true,
                message: "Sessions fetched successfully",
                data: {sessions: []},
            }
        }

        return {
            success: true,
            message: "Sessions fetched successfully",
            data: {sessions},
        }
    } catch (error) {
        return handleServerError(error)
    }
}
