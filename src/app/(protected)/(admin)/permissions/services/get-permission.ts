"use server"

import {Prisma} from "@/generated/index"
import {requireAbility} from "@/utils/helpers/has-ability-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

const permissionSelect = Prisma.validator<Prisma.PermissionSelect>()({
    name: true,
    is_active: true,
    roles: {
        select: {
            role_name: true,
        },
    },
})

export type GetPermission = Prisma.PermissionGetPayload<{select: typeof permissionSelect}>

export async function getPermission(name: string): Promise<ServerResult<GetPermission>> {
    try {
        await requireAbility(["read permissions", "manage permissions"])

        const permission = await prisma.permission.findUnique({
            where: {name},
            select: permissionSelect,
        })

        if (!permission) throw new Error("Permission not found")

        return {success: true, data: permission, message: "Permission fetched successfully"}
    } catch (error) {
        return handleServerError(error)
    }
}
