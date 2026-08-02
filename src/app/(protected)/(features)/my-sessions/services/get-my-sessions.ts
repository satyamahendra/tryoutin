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
    ends_at: true,
    submitted_at: true,
    total_score: true,
    exam: {
        select: {
            id: true,
            title: true,
            category: true,
            duration_minutes: true,
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
    sessions: (GetMySession & {correct_count: number})[]
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

        const sessionIds = sessions.map((s) => s.id)

        const correctCounts = await prisma.userAnswer.groupBy({
            by: ["session_id"],
            where: {
                session_id: {in: sessionIds},
                option: {is_correct: true},
            },
            _count: {id: true},
        })
        const countMap = new Map(correctCounts.map((c) => [c.session_id, c._count.id]))

        const sessionsToFix = sessions.filter((s) => s.status === "completed" && s.total_score == null)
        if (sessionsToFix.length > 0) {
            await prisma.$transaction(
                sessionsToFix.map((s) =>
                    prisma.examSession.update({
                        where: {id: s.id},
                        data: {total_score: countMap.get(s.id) ?? 0},
                    }),
                ),
            )
        }

        const sessionsWithCount = sessions.map((s) => ({
            ...s,
            correct_count: countMap.get(s.id) ?? 0,
            total_score: s.status === "completed" && s.total_score == null ? (countMap.get(s.id) ?? 0) : s.total_score,
        }))

        return {
            success: true,
            message: "Sessions fetched successfully",
            data: {sessions: sessionsWithCount},
        }
    } catch (error) {
        return handleServerError(error)
    }
}
