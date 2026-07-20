"use server"

import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

export type GetMyTryoutCategories = {
    categories: {value: string; label: string; count: number}[]
}

export async function getMyTryoutCategories(): Promise<ServerResult<GetMyTryoutCategories>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const entitlements = await prisma.entitlement.findMany({
            where: {user_id: session.user.id},
            select: {product_id: true},
        })

        const ownedProductIds = entitlements.map((e) => e.product_id)

        if (ownedProductIds.length === 0) {
            return {success: true, message: "Categories fetched successfully", data: {categories: []}}
        }

        const categoryCounts = await prisma.exam.groupBy({
            by: ["category"],
            where: {
                is_active: true,
                product_id: {in: ownedProductIds},
                category: {not: ""},
            },
            _count: {id: true},
        })

        const categories = categoryCounts
            .filter((c) => c._count.id > 0)
            .map((c) => ({
                value: c.category,
                label: c.category,
                count: c._count.id ?? 0,
            }))

        return {success: true, message: "Categories fetched successfully", data: {categories}}
    } catch (error) {
        return handleServerError(error)
    }
}
