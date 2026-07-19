"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

const examSelect = Prisma.validator<Prisma.ExamSelect>()({
    id: true,
    title: true,
    description: true,
    category: true,
    duration_minutes: true,
    is_active: true,
    created_at: true,
    updated_at: true,
    parts: {
        orderBy: {order_index: "asc"},
        select: {
            id: true,
            name: true,
            order_index: true,
            passing_score: true,
            duration_minutes: true,
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

export type GetExam = Prisma.ExamGetPayload<{select: typeof examSelect}>

export async function getExam(id: string): Promise<ServerResult<GetExam>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const exam = await prisma.exam.findUnique({
            select: examSelect,
            where: {id},
        })

        if (!exam) throw new Error("Exam not found")

        return {success: true, data: exam, message: "Exam fetched successfully"}
    } catch (error) {
        return handleServerError(error)
    }
}
