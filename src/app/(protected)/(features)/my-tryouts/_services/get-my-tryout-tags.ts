"use server"

import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

export type GetMyTryoutTags = {
    tags: {id: string; name: string; count: number}[]
}

export async function getMyTryoutTags(): Promise<ServerResult<GetMyTryoutTags>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const entitlements = await prisma.entitlement.findMany({
            where: {user_id: session.user.id},
            select: {product_id: true},
        })

        const ownedProductIds = entitlements.map((e) => e.product_id)

        if (ownedProductIds.length === 0) {
            return {success: true, message: "Tags fetched successfully", data: {tags: []}}
        }

        const tagsWithCounts = await prisma.tag.findMany({
            select: {
                id: true,
                name: true,
                _count: {
                    select: {
                        exams: {
                            where: {
                                exam: {
                                    is_active: true,
                                    product_id: {in: ownedProductIds},
                                },
                            },
                        },
                    },
                },
            },
            orderBy: {name: "asc"},
        })

        const tags = tagsWithCounts
            .filter((t) => t._count.exams > 0)
            .map((t) => ({
                id: t.id,
                name: t.name,
                count: t._count.exams,
            }))

        return {success: true, message: "Tags fetched successfully", data: {tags}}
    } catch (error) {
        return handleServerError(error)
    }
}
