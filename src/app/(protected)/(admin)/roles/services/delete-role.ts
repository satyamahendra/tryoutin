"use server"

import prisma from "@/lib/prisma/client"
import {revalidatePath} from "next/cache"
import {ServerResult} from "@/utils/types/server-action"
import {Role} from "@/generated/index"
import {requireAbility} from "@/utils/helpers/has-ability-server"
import {handleServerError} from "@/utils/helpers/handle-server-errors"

export async function deleteRole(roleName: string): Promise<ServerResult<Role>> {
    try {
        await requireAbility(["manage roles"])

        const role = (await prisma.role.delete({
            where: {name: roleName},
            select: {name: true},
        })) as Role

        revalidatePath("/roles")
        return {success: true, data: role, message: `Role deleted successfully`}
    } catch (error) {
        return handleServerError(error)
    }
}
