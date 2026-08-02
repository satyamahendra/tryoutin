"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"

const tagSelect = Prisma.validator<Prisma.TagSelect>()({
    id: true,
    name: true,
    created_at: true,
    _count: {
        select: {exams: true},
    },
})

export type GetTag = Prisma.TagGetPayload<{select: typeof tagSelect}>

export type GetTags = {
    tags: GetTag[]
}

export async function getTags(): Promise<GetTags> {
    const session = await authServer()
    if (!session) throw new Error("Unauthorized")

    const tags = await prisma.tag.findMany({
        select: tagSelect,
        orderBy: {name: "asc"},
    })

    return {tags}
}
