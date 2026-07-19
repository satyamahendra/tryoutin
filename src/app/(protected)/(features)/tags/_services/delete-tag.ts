"use server"

import prisma from "@/lib/prisma/client"
import {revalidatePath} from "next/cache"
import {ServerResult} from "@/utils/types/server-action"
import {Tag} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import {handleServerError} from "@/utils/helpers/handle-server-errors"

export async function deleteTag(id: string): Promise<ServerResult<Tag>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const tag = await prisma.tag.delete({
            where: {id},
            select: {id: true, name: true, created_at: true},
        })

        revalidatePath("/tags")
        return {success: true, data: tag as Tag, message: "Tag deleted successfully"}
    } catch (error) {
        return handleServerError(error)
    }
}
