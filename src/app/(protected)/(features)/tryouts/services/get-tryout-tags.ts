"use server"

import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"

export type GetTryoutTags = {
    tags: {id: string; name: string; count: number}[]
}

export async function getTryoutTags(): Promise<GetTryoutTags> {
    const session = await authServer()
    if (!session) throw new Error("Unauthorized")

    const tagsWithCounts = await prisma.tag.findMany({
        select: {
            id: true,
            name: true,
            _count: {
                select: {
                    exams: {
                        where: {
                            exam: {
                                is_active: true,
                                product: {isNot: null},
                            },
                        },
                    },
                },
            },
        },
        orderBy: {name: "asc"},
    })

    const tags = tagsWithCounts
        .filter((t) => t._count.exams > 0)
        .map((t) => ({
            id: t.id,
            name: t.name,
            count: t._count.exams,
        }))

    return {tags}
}
