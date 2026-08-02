"use server"

import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

export type SaveAnswerInput = {
    sessionId: string
    questionId: string
    optionId: string
}

export async function saveAnswer(input: SaveAnswerInput): Promise<ServerResult<{id: string}>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const examSession = await prisma.examSession.findFirst({
            where: {id: input.sessionId, user_id: session.user.id, status: "in_progress"},
            select: {id: true},
        })

        if (!examSession) throw new Error("Session not found or not in progress")

        const option = await prisma.questionOption.findUnique({
            where: {id: input.optionId},
            select: {score: true, question_id: true},
        })

        if (!option || option.question_id !== input.questionId) throw new Error("Invalid option")

        const answer = await prisma.userAnswer.upsert({
            where: {
                session_id_question_id: {
                    session_id: input.sessionId,
                    question_id: input.questionId,
                },
            },
            create: {
                session_id: input.sessionId,
                question_id: input.questionId,
                option_id: input.optionId,
                score_awarded: option.score,
            },
            update: {
                option_id: input.optionId,
                score_awarded: option.score,
                updated_at: new Date(),
            },
            select: {id: true},
        })

        return {success: true, message: "Answer saved", data: answer}
    } catch (error) {
        return handleServerError(error)
    }
}
