"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {computeSessionScores, SessionScores} from "@/utils/helpers/compute-session-scores"
import {ServerResult} from "@/utils/types/server-action"

const sessionSelect = Prisma.validator<Prisma.ExamSessionSelect>()({
    id: true,
    type: true,
    status: true,
    started_at: true,
    submitted_at: true,
    total_score: true,
    scaled_score: true,
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

        const scoresBySession = new Map<string, SessionScores>()
        const allScores = await Promise.all(sessionIds.map((id) => computeSessionScores(id)))
        sessionIds.forEach((id, i) => scoresBySession.set(id, allScores[i]))

        const updates = sessions
            .filter((s) => {
                if (s.status !== "completed") return false
                const sc = scoresBySession.get(s.id)!
                return s.total_score !== sc.totalScore || s.scaled_score !== sc.scaledScore
            })
            .map((s) => {
                const sc = scoresBySession.get(s.id)!
                return prisma.examSession.update({
                    where: {id: s.id},
                    data: {total_score: sc.totalScore, scaled_score: sc.scaledScore},
                })
            })
        // ponytail: skip no-op writes so @updatedAt (the list sort key) doesn't bump on every refresh
        if (updates.length > 0) {
            await prisma.$transaction(updates)
        }

        const sessionsWithCount = sessions.map((s) => {
            const sc = scoresBySession.get(s.id)!
            return {
                ...s,
                correct_count: s.status === "completed" ? sc.correctCount : 0,
                total_score: s.status === "completed" ? sc.totalScore : s.total_score,
            }
        })

        return {
            success: true,
            message: "Sessions fetched successfully",
            data: {sessions: sessionsWithCount},
        }
    } catch (error) {
        return handleServerError(error)
    }
}
