"use server"

import {Role} from "@/generated/index"
import prisma from "@/lib/prisma/client"
import {ActionResult} from "@/utils/types/server-action"
import {authServer} from "@/lib/auth-server"

export async function getRoles(): Promise<ActionResult<Role[]>> {
    try {
        const session = await authServer()

        if (!session) {
            return {success: false, error: "Unauthorized"}
        }

        const roles = await prisma.role.findMany({
            select: {name: true},
        })

        if (!roles) {
            return {success: false, error: "Roles not found"}
        }

        return {success: true, data: roles as Role[]}
    } catch (error) {
        return {success: false, error: "Failed to fetch roles"}
    }
}
