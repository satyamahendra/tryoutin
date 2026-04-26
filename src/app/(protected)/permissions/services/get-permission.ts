"use server"

import {Permission} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {ActionResult} from "@/utils/types/server-action"

type Response = Permission & {roles: {role_name: string}[]}

export async function getPermission(name: string): Promise<ActionResult<Response>> {
    try {
        const session = await authServer()

        if (!session) {
            return {success: false, error: "Unauthorized"}
        }

        const permission = await prisma.permission.findUnique({
            where: {name},
            include: {
                roles: {
                    select: {role_name: true},
                },
            },
        })

        if (!permission) {
            return {success: false, error: "Permission not found"}
        }

        return {success: true, data: permission as Response}
    } catch (error) {
        return {success: false, error: "Failed to fetch permission"}
    }
}
