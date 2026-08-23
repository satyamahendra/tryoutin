"use server"

import {Prisma} from "@/generated/index"
import {requireAbility} from "@/utils/helpers/has-ability-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

const roleSelect = Prisma.validator<Prisma.RoleSelect>()({
    name: true,
    is_active: true,
    permissions: {
        select: {
            permission_name: true,
        },
    },
})

export type GetRole = Prisma.RoleGetPayload<{select: typeof roleSelect}>

export async function getRole(name: string): Promise<ServerResult<GetRole>> {
    try {
        await requireAbility(["read roles", "manage roles"])

        const role = await prisma.role.findUnique({
            where: {name},
            select: roleSelect,
        })

        if (!role) throw new Error("Role not found")

        return {success: true, data: role, message: "Role fetched successfully"}
    } catch (error) {
        return handleServerError(error)
    }
}
