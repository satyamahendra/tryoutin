"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

const reviewSelect = Prisma.validator<Prisma.ExamSessionSelect>()({
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
            description: true,
            category: true,
            duration_minutes: true,
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
            score_awarded: true,
            is_flagged: true,
        },
    },
})

export type ReviewData = Prisma.ExamSessionGetPayload<{select: typeof reviewSelect}>

export async function getReviewData(sessionId: string): Promise<ServerResult<ReviewData>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const data = await prisma.examSession.findFirst({
            select: reviewSelect,
            where: {id: sessionId, user_id: session.user.id},
        })

        if (!data) throw new Error("Session not found")

        return {success: true, message: "Review data fetched successfully", data}
    } catch (error) {
        return handleServerError(error)
    }
}
