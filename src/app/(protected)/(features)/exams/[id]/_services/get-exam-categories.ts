"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {PAGE_SIZE} from "@/utils/constants/pagination"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {Pagination} from "@/utils/types/pagination"
import {ServerResult} from "@/utils/types/server-action"

const examCategorySelect = Prisma.validator<Prisma.ExamSelect>()({
    category: true,
})

export type GetExamCategories = {
    categories: {value: string; label: string}[]
    pagination: Pagination
}

export async function getExamCategories(page: number = 1, search = "", limit = PAGE_SIZE): Promise<ServerResult<GetExamCategories>> {
    const skip = (page - 1) * limit

    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const where: Prisma.ExamWhereInput = search
            ? {category: {contains: search, mode: "insensitive"}}
            : {}

        const [exams, total] = await Promise.all([
            prisma.exam.findMany({
                skip,
                take: limit,
                distinct: ["category"],
                select: {category: true},
                where: {...where, category: {not: ""}},
                orderBy: {category: "asc"},
            }),
            prisma.exam.count({where: {...where, category: {not: ""}}}),
        ])

        const categories = exams.map((e) => ({value: e.category, label: e.category}))

        return {
            success: true,
            message: "Categories fetched successfully",
            data: {
                categories,
                pagination: {
                    page,
                    total,
                    pageCount: Math.ceil(total / limit),
                },
            },
        }
    } catch (error) {
        return handleServerError(error)
    }
}
