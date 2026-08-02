"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"

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

export async function getExams({search}: {search?: string}): Promise<GetExams> {
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

    return {exams}
}
