"use server"

import prisma from "@/lib/prisma/client"
import {revalidatePath} from "next/cache"
import {requireAbility} from "@/utils/helpers/has-ability-server"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {userSchema, UserFormSchema} from "../utils/schemas"
import {ServerResult} from "@/utils/types/server-action"
import {User} from "@/generated/index"

export async function updateUser(data: UserFormSchema): Promise<ServerResult<User>> {
    try {
        const parsed = userSchema.parse(data)

        await requireAbility(["manage users"])

        const {id, permissions = [], roles = []} = parsed

        const updated = await prisma.$transaction(async (tx) => {
            return tx.user.update({
                where: {id},
                data: {
                    roles: {
                        deleteMany: {},
                        create: roles.map((role_name) => ({role_name})),
                    },
                    permissions: {
                        deleteMany: {},
                        create: permissions.map((permission_name) => ({permission_name})),
                    },
                },
                select: {id: true, name: true, email: true, image: true, emailVerified: true, createdAt: true, updatedAt: true},
            })
        })

        revalidatePath("/")
        return {success: true, data: updated, message: "User updated successfully"}
    } catch (error) {
        return handleServerError(error)
    }
}
