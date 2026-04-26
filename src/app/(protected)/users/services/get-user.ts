"use server"

import {Permission, Prisma, Role} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {ActionResult} from "@/utils/types/server-action"

const selectUser = Prisma.validator<Prisma.UserSelect>()({
    id: true,
    name: true,
    email: true,
    image: true,
    createdAt: true,
    roles: {
        select: {role_name: true},
    },
    permissions: {
        select: {permission_name: true},
    },
})

type Response = Prisma.UserGetPayload<{select: typeof selectUser}>

export async function getUser(id: string): Promise<ActionResult<Response>> {
    try {
        const session = await authServer()

        if (!session) {
            return {success: false, error: "Unauthorized"}
        }

        const user = await prisma.user.findUnique({
            where: {id: id},
            select: selectUser,
        })

        if (!user) {
            return {success: false, error: "User not found"}
        }

        return {success: true, data: user}
    } catch (error) {
        return {success: false, error: "Failed to fetch role"}
    }
}
