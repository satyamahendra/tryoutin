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
    created_at: true,
    is_active: true,
    duration_minutes: true,
    product: {
        select: {
            name: true,
            price_actual: true,
            price_alternate: true,
        },
    },
    parts: {
        select: {
            id: true,
            name: true,
            duration_minutes: true,
            _count: {
                select: {questions: true},
            },
        },
    },
})

export type GetExam = Prisma.ExamGetPayload<{select: typeof examSelect}>

export type GetExams = {
    exams: GetExam[]
}

export async function getExams({search}: {search?: string}): Promise<ServerResult<GetExams>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const where: Prisma.ExamWhereInput = search
            ? {
                  OR: [
                      {title: {contains: search, mode: "insensitive"}},
                      {description: {contains: search, mode: "insensitive"}},
                      {product: {name: {contains: search, mode: "insensitive"}}},
                  ],
              }
            : {}

        const exams = await prisma.exam.findMany({
            select: examSelect,
            where,
        })

        return {
            success: true,
            message: "Exam fetched successfully",
            data: {exams},
        }
    } catch (error) {
        return handleServerError(error)
    }
}
