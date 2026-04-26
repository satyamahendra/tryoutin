"use server"

import prisma from "@/lib/prisma/client"
import {revalidatePath} from "next/cache"
import {RoleFormSchema, roleSchema} from "../utils/schemas"
import {MutationResult} from "@/utils/types/server-action"
import {Role} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import {handleMutationError} from "@/utils/helpers/handle-action-errors"

export async function createUpdateRole(data: RoleFormSchema): Promise<MutationResult<Role>> {
    const parsed = roleSchema.safeParse(data)

    if (!parsed.success) {
        return {
            success: false,
            data: null as any,
            message: "Invalid data",
            errors: parsed.error.flatten<string>((issue) => issue.message).fieldErrors,
        }
    }

    try {
        const session = await authServer()

        if (!session) {
            return {success: false, data: null as any, message: "Unauthorized"}
        }

        const {name, name_before, permissions = []} = parsed.data

        let role: Role

        if (name_before) {
            role = await prisma.$transaction(async (tx) => {
                const updated = await tx.role.update({
                    where: {name: name_before},
                    data: {
                        name,
                        permissions: {
                            deleteMany: {},
                            create: permissions.map((permission_name) => ({permission_name})),
                        },
                    },
                    select: {name: true},
                })

                return updated as Role
            })
        } else {
            role = (await prisma.role.create({
                data: {
                    name,
                    permissions: {
                        create: permissions.map((permission_name) => ({permission_name})),
                    },
                },
                select: {name: true},
            })) as Role
        }

        revalidatePath("/roles")
        const action = name_before ? "updated" : "created"
        return {success: true, data: role, message: `Role ${action} successfully`}
    } catch (error) {
        return handleMutationError(error)
    }
}
