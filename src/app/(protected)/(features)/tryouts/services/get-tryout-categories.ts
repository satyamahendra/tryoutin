"use server"

import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"

export type GetTryoutCategories = {
    categories: {value: string; label: string; count: number}[]
}

export async function getTryoutCategories(): Promise<GetTryoutCategories> {
    const session = await authServer()
    if (!session) throw new Error("Unauthorized")

    const exams = await prisma.exam.findMany({
        distinct: ["category"],
        select: {category: true},
        where: {
            is_active: true,
            product: {isNot: null},
            category: {not: ""},
        },
        orderBy: {category: "asc"},
    })

    const categoryCounts = await prisma.exam.groupBy({
        by: ["category"],
        where: {
            is_active: true,
            product: {isNot: null},
            category: {not: ""},
        },
        _count: {id: true},
    })

    const countMap = new Map(categoryCounts.map((c) => [c.category, c._count.id ?? 0]))

    const categories = exams.map((e) => ({
        value: e.category,
        label: e.category,
        count: countMap.get(e.category) ?? 0,
    }))

    return {categories}
}
