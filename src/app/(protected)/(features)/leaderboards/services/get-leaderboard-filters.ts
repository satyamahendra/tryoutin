"use server"

import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"

export type LeaderboardFilters = {
    categories: {value: string; label: string; count: number}[]
    tags: {id: string; name: string; count: number}[]
}

// ponytail: leaderboards are platform-wide, so filters span all active exams (not owner-restricted)
export async function getLeaderboardFilters(): Promise<LeaderboardFilters> {
    const session = await authServer()
    if (!session) throw new Error("Unauthorized")

    const categoryCounts = await prisma.exam.groupBy({
        by: ["category"],
        where: {is_active: true, category: {not: ""}},
        _count: {id: true},
    })
    const categories = categoryCounts
        .filter((c) => c._count.id > 0)
        .map((c) => ({value: c.category, label: c.category, count: c._count.id}))

    const tagsWithCounts = await prisma.tag.findMany({
        select: {
            id: true,
            name: true,
            _count: {select: {exams: {where: {exam: {is_active: true}}}}},
        },
        orderBy: {name: "asc"},
    })
    const tags = tagsWithCounts
        .filter((t) => t._count.exams > 0)
        .map((t) => ({id: t.id, name: t.name, count: t._count.exams}))

    return {categories, tags}
}
