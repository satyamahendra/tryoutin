"use server"

import {Permission, Role} from "@/generated/index"
import prisma from "@/lib/prisma/client"
import {ActionResult} from "@/utils/types/server-action"

export async function getPermissionsAndRoles(): Promise<ActionResult<{permissions: Permission[]; roles: Role[]}>> {
    try {
        const permissions = await prisma.permission.findMany({
            select: {name: true},
        })

        const roles = await prisma.role.findMany({
            select: {name: true},
        })

        return {success: true, data: {permissions, roles}}
    } catch (error) {
        return {success: false, error: "Failed to fetch permissions"}
    }
}
