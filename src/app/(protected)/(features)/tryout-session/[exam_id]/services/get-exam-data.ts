"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

const examDataSelect = Prisma.validator<Prisma.ExamSelect>()({
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
})

export type ExamData = Prisma.ExamGetPayload<{select: typeof examDataSelect}>

export async function getExamData(examId: string): Promise<ServerResult<ExamData>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const exam = await prisma.exam.findFirst({
            select: examDataSelect,
            where: {id: examId, is_active: true},
        })

        if (!exam) throw new Error("Exam not found")

        return {success: true, message: "Exam fetched successfully", data: exam}
    } catch (error) {
        return handleServerError(error)
    }
}
