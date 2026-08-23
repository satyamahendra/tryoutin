"use server"

import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"
import {rankSessions, type LeaderboardUser} from "./leaderboard-rank"
import {computeExamSessionsScores} from "@/utils/helpers/compute-session-scores"

export type LeaderboardDetail = {
    examId: string
    title: string
    category: string | null
    users: LeaderboardUser[]
}

export async function getLeaderboard(examId: string): Promise<ServerResult<LeaderboardDetail>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const exam = await prisma.exam.findFirst({
            where: {id: examId, is_active: true},
            select: {id: true, title: true, category: true},
        })
        if (!exam) throw new Error("Tryout not found")

        const sessions = await prisma.examSession.findMany({
            where: {exam_id: exam.id, status: "completed", total_score: {not: null}, type: "simulation"},
            select: {
                id: true,
                user_id: true,
                submitted_at: true,
                user: {select: {id: true, name: true, image: true}},
            },
        })

        const scores = await computeExamSessionsScores(
            exam.id,
            sessions.map((s) => s.id),
        )
        const users = rankSessions(
            sessions.map((s) => ({
                ...s,
                score: scores.get(s.id)?.mcScore ?? null,
                normalizedScaled: scores.get(s.id)?.normalizedScaledScore ?? null,
            })),
        )

        return {success: true, message: "Leaderboard fetched successfully", data: {examId: exam.id, title: exam.title, category: exam.category, users}}
    } catch (error) {
        return handleServerError(error)
    }
}
