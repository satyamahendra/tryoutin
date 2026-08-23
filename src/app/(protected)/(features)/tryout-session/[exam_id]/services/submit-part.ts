"use server"

import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {computeSessionScores} from "@/utils/helpers/compute-session-scores"
import {ServerResult} from "@/utils/types/server-action"

export type SubmitPartResult = {
    completed: boolean
    nextPartId?: string
    nextPartQuestionId?: string
    sessionStatus?: string
}

export async function submitPart(sessionId: string, partId: string, expired = false): Promise<ServerResult<SubmitPartResult>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const examSession = await prisma.examSession.findFirst({
            where: {id: sessionId, user_id: session.user.id, status: "in_progress"},
            select: {
                id: true,
                exam: {
                    select: {
                        parts: {
                            orderBy: {order_index: "asc"},
                            select: {id: true, duration_minutes: true},
                        },
                    },
                },
                part_sessions: {
                    orderBy: {part: {order_index: "asc"}},
                    select: {id: true, part_id: true, status: true},
                },
            },
        })

        if (!examSession) throw new Error("Session not found or not in progress")

        const now = new Date()
        const parts = examSession.exam.parts
        const currentIndex = parts.findIndex((p) => p.id === partId)
        if (currentIndex === -1) throw new Error("Part not found")

        const partSession = examSession.part_sessions.find((ps) => ps.part_id === partId)
        if (!partSession) throw new Error("Part session not found")
        if (partSession.status !== "in_progress") throw new Error("Part is not the active part")

        const nextIndex = currentIndex + 1

        if (nextIndex >= parts.length) {
            const scores = await computeSessionScores(sessionId)

            await prisma.$transaction(async (tx) => {
                await tx.examSessionPart.update({
                    where: {id: partSession.id},
                    data: {
                        status: expired ? "expired" : "completed",
                        submitted_at: now,
                    },
                })

                await tx.examSession.update({
                    where: {id: sessionId},
                    data: {
                        status: "completed",
                        submitted_at: now,
                        total_score: scores.totalScore,
                        scaled_score: scores.scaledScore,
                        scaled_max: scores.scaledMax,
                        mc_score: scores.mcScore,
                        sc_earned: scores.totalScEarned,
                        sc_max: scores.totalScMax,
                        mc_earned: scores.totalMcEarned,
                        mc_max: scores.totalMcMax,
                        objective_answered: scores.objectiveAnswered,
                    },
                })
            })

            return {
                success: true,
                message: "All parts completed — " + scores.correctCount + " correct",
                data: {completed: true, sessionStatus: "completed"},
            }
        }

        const nextPart = parts[nextIndex]
        const nextPartSession = examSession.part_sessions.find((ps) => ps.part_id === nextPart.id)

        await prisma.$transaction(async (tx) => {
            await tx.examSessionPart.update({
                where: {id: partSession.id},
                data: {
                    status: expired ? "expired" : "completed",
                    submitted_at: now,
                },
            })

            if (nextPartSession) {
                await tx.examSessionPart.update({
                    where: {id: nextPartSession.id},
                    data: {
                        status: "in_progress",
                        started_at: now,
                        ends_at: nextPart.duration_minutes ? new Date(now.getTime() + nextPart.duration_minutes * 60000) : null,
                    },
                })
            }
        })

        const nextQuestion = await prisma.question.findFirst({
            where: {part_id: nextPart.id},
            orderBy: {order_index: "asc"},
            select: {id: true},
        })

        return {
            success: true,
            message: "Part submitted",
            data: {
                completed: false,
                nextPartId: nextPart.id,
                nextPartQuestionId: nextQuestion?.id,
            },
        }
    } catch (error) {
        return handleServerError(error)
    }
}
