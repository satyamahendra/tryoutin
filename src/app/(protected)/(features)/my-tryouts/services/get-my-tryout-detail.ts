"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"
import {PartScore} from "@/utils/helpers/score-parts" // Import PartScore
import {computeExamSessionsScores} from "@/utils/helpers/compute-session-scores"

const myTryoutDetailSelect = Prisma.validator<Prisma.ExamSelect>()({
    id: true,
    title: true,
    description: true,
    category: true,
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

export type GetMyTryoutDetail = Prisma.ExamGetPayload<{select: typeof myTryoutDetailSelect}> & {
    sessions: {
        id: string
        type: "simulation" | "practice"
        total_score: number | null
        mcScore: number | null
        scaledScore: number | null // Added scaledScore
        scaledMax: number | null // Added scaledMax
        normalizedScaledScore: number | null // Added normalizedScaledScore
        scEarned: number // Added scEarned
        scMax: number // Added scMax
        mcEarned: number // Added mcEarned
        mcMax: number // Added mcMax
        parts: PartScore[] // Added parts
        submitted_at: Date | null
    }[]
}

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

        const sessions = await prisma.examSession.findMany({
            where: {exam_id: exam.id, user_id: session.user.id, status: "completed"},
            orderBy: {submitted_at: "asc"},
            select: {id: true, type: true, total_score: true, submitted_at: true},
        })

        const scores = await computeExamSessionsScores(exam.id, sessions.map((s) => s.id))
        const sessionsWithScore = sessions.map((s) => {
            const sc = scores.get(s.id)
            return {
                ...s,
                mcScore: sc?.mcScore ?? null,
                scaledScore: sc?.scaledScore ?? null,
                scaledMax: sc?.scaledMax ?? null,
                normalizedScaledScore: sc?.normalizedScaledScore ?? null,
                scEarned: sc?.totalScEarned ?? 0,
                scMax: sc?.totalScMax ?? 0,
                mcEarned: sc?.totalMcEarned ?? 0,
                mcMax: sc?.totalMcMax ?? 0,
                parts: sc?.parts ?? [],
            }
        })

        return {
            success: true,
            message: "Tryout fetched successfully",
            data: {...exam, sessions: sessionsWithScore},
        }
    } catch (error) {
        return handleServerError(error)
    }
}
