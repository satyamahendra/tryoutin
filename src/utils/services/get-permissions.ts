"use server"

import {Permission} from "@/generated/index"
import prisma from "@/lib/prisma/client"
import {ActionResult} from "@/utils/types/server-action"

export async function getPermissions(): Promise<ActionResult<Permission[]>> {
    try {
        const permissions = await prisma.permission.findMany({
            select: {name: true},
        })

        if (!permissions) {
            return {success: false, error: "Permissions not found"}
        }

        return {success: true, data: permissions}
    } catch (error) {
        return {success: false, error: "Failed to fetch permissions"}
    }
}
