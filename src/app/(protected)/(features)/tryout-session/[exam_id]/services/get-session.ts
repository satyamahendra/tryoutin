"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

const sessionFullSelect = Prisma.validator<Prisma.ExamSessionSelect>()({
    id: true,
    type: true,
    user_id: true,
    exam_id: true,
    entitlement_id: true,
    status: true,
    started_at: true,
    submitted_at: true,
    total_score: true,
    scaled_score: true,
    exam: {
        select: {
            id: true,
            title: true,
            description: true,
            category: true,
            parts: {
                orderBy: {order_index: "asc"},
                select: {
                    id: true,
                    name: true,
                    order_index: true,
                    duration_minutes: true,
                    passing_score: true,
                    questions: {
                        orderBy: {order_index: "asc"},
                        select: {
                            id: true,
                            type: true,
                            question_text: true,
                            question_image: true,
                            explanation: true,
                            order_index: true,
                            options: {
                                orderBy: {order_index: "asc"},
                                select: {
                                    id: true,
                                    option_text: true,
                                    option_image: true,
                                    score: true,
                                    is_correct: true,
                                    order_index: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    part_sessions: {
        include: {
            part: {
                select: {
                    id: true,
                    name: true,
                    order_index: true,
                },
            },
        },
        orderBy: {part: {order_index: "asc"}},
    },
    answers: {
        select: {
            question_id: true,
            option_id: true,
            answer_text: true,
            score_awarded: true,
            is_flagged: true,
        },
    },
})

export type SessionFullData = Prisma.ExamSessionGetPayload<{select: typeof sessionFullSelect}>

export async function getSession(sessionId: string): Promise<ServerResult<SessionFullData>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const examSession = await prisma.examSession.findFirst({
            select: sessionFullSelect,
            where: {id: sessionId, user_id: session.user.id},
        })

        if (!examSession) throw new Error("Session not found")

        return {success: true, message: "Session fetched successfully", data: examSession}
    } catch (error) {
        return handleServerError(error)
    }
}
