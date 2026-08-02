"use server"

import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

export type SaveAnswerInput = {
    sessionId: string
    questionId: string
    optionIds: string[]
    answerText?: string
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

        const question = await prisma.question.findUnique({
            where: {id: input.questionId},
            select: {
                id: true,
                type: true,
                part_id: true,
                options: {
                    select: {id: true, option_text: true, score: true, question_id: true},
                },
            },
        })

        if (!question) throw new Error("Invalid question")

        const partSession = await prisma.examSessionPart.findFirst({
            where: {session_id: input.sessionId, part_id: question.part_id},
            select: {status: true},
        })
        if (!partSession || partSession.status !== "in_progress") throw new Error("Part is not active")

        if (question.type === "essay") {
            const text = input.answerText ?? ""
            await prisma.$transaction(async (tx) => {
                const existing = await tx.userAnswer.findMany({
                    where: {session_id: input.sessionId, question_id: input.questionId},
                    select: {is_flagged: true},
                    take: 1,
                })
                const flagged = existing[0]?.is_flagged ?? false

                await tx.userAnswer.deleteMany({
                    where: {session_id: input.sessionId, question_id: input.questionId},
                })

                if (text.trim()) {
                    // ponytail: simple keyword match — answer containing an option's value scores that option
                    const match = question.options.find((o) => o.option_text && text.toLowerCase().includes(o.option_text.toLowerCase()))
                    await tx.userAnswer.create({
                        data: {
                            session_id: input.sessionId,
                            question_id: input.questionId,
                            answer_text: text,
                            score_awarded: match ? match.score : 0,
                            is_flagged: flagged,
                        },
                    })
                }
            })
            return {success: true, message: "Answer saved", data: {id: input.questionId}}
        }

        const requested = new Set(input.optionIds)
        const allowed = new Set(question.options.filter((o) => o.question_id === input.questionId).map((o) => o.id))
        if (question.type === "single_choice" && requested.size > 1) throw new Error("Only one option allowed")
        for (const id of requested) {
            if (!allowed.has(id)) throw new Error("Invalid option")
        }

        await prisma.$transaction(async (tx) => {
            const existing = await tx.userAnswer.findMany({
                where: {session_id: input.sessionId, question_id: input.questionId},
                select: {is_flagged: true, answer_text: true},
                take: 1,
            })
            const flagged = existing[0]?.is_flagged ?? false
            const answerText = existing[0]?.answer_text ?? null

            await tx.userAnswer.deleteMany({
                where: {session_id: input.sessionId, question_id: input.questionId},
            })

            if (requested.size > 0) {
                await tx.userAnswer.createMany({
                    data: question.options
                        .filter((o) => requested.has(o.id))
                        .map((o) => ({
                            session_id: input.sessionId,
                            question_id: input.questionId,
                            option_id: o.id,
                            answer_text: answerText,
                            score_awarded: o.score,
                            is_flagged: flagged,
                        })),
                })
            }
        })

        return {success: true, message: "Answer saved", data: {id: input.questionId}}
    } catch (error) {
        return handleServerError(error)
    }
}
