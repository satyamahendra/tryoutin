"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {PAGE_SIZE} from "@/utils/constants/pagination"
import {Pagination} from "@/utils/types/pagination"

const myOrderSelect = Prisma.validator<Prisma.OrderSelect>()({
    id: true,
    paid_at: true,
    created_at: true,
    gross_amount: true,
    status: true,
    midtrans_order_id: true,
    midtrans_token: true,
    midtrans_redirect: true,
    entitlements: {
        select: {
            id: true,
            product_id: true,
            product: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
})

export type GetMyOrder = Prisma.OrderGetPayload<{select: typeof myOrderSelect}>

export type GetMyOrders = {
    orders: GetMyOrder[]
    pagination: Pagination
}

export async function getMyOrders(page: number = 1, search = ""): Promise<GetMyOrders> {
    const skip = (page - 1) * PAGE_SIZE

    const session = await authServer()
    if (!session) throw new Error("Unauthorized")

    const where: Prisma.OrderWhereInput = {
        user_id: session.user.id,
        ...(search
            ? {
                  OR: [{midtrans_order_id: {contains: search, mode: "insensitive"}}],
              }
            : {}),
    }

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            skip,
            take: PAGE_SIZE,
            orderBy: {created_at: "desc"},
            select: myOrderSelect,
            where,
        }),
        prisma.order.count({where}),
    ])

    return {
        orders,
        pagination: {
            page,
            total,
            pageCount: Math.ceil(total / PAGE_SIZE),
        },
    }
}
