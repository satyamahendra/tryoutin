"use server"

import prisma from "@/lib/prisma/client"
import {revalidatePath} from "next/cache"
import {ServerResult} from "@/utils/types/server-action"
import {Tag} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import {handleServerError} from "@/utils/helpers/handle-server-errors"

export async function createTag(name: string): Promise<ServerResult<Tag>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        if (!name.trim()) throw new Error("Tag name is required")

        const tag = await prisma.tag.create({
            data: {name: name.trim()},
            select: {id: true, name: true, created_at: true},
        })

        revalidatePath("/tags")
        return {success: true, data: tag as Tag, message: "Tag created successfully"}
    } catch (error) {
        return handleServerError(error)
    }
}
