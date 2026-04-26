"use server"

import {Permission, Role} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {ActionResult} from "@/utils/types/server-action"

type Response = Role & {permissions: {permission_name: string}[]}

export async function getRole(name: string): Promise<ActionResult<Response>> {
    try {
        const session = await authServer()

        if (!session) {
            return {success: false, error: "Unauthorized"}
        }

        const role = await prisma.role.findUnique({
            where: {name},
            include: {
                permissions: {
                    select: {permission_name: true},
                },
            },
        })

        if (!role) {
            return {success: false, error: "Role not found"}
        }

        return {success: true, data: role}
    } catch (error) {
        return {success: false, error: "Failed to fetch role"}
    }
}
