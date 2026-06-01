"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {PAGE_SIZE} from "@/utils/constants/pagination"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {Pagination} from "@/utils/types/pagination"
import {ServerResult} from "@/utils/types/server-action"

const orderSelect = Prisma.validator<Prisma.OrderSelect>()({
    id: true,
    paid_at: true,
    created_at: true,
    gross_amount: true,
    status: true,
    midtrans_order_id: true,
    midtrans_token: true,
    midtrans_request: true,
    midtrans_response: true,
    midtrans_redirect: true,
    user: {
        select: {
            name: true,
            email: true,
            image: true,
        },
    },
})

export type OrderWithUser = Prisma.OrderGetPayload<{select: typeof orderSelect}>

export type OrderList = {
    orders: OrderWithUser[]
    pagination: Pagination
}

export async function getOrders(page: number = 1, search = ""): Promise<ServerResult<OrderList>> {
    const skip = (page - 1) * PAGE_SIZE

    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const where: Prisma.OrderWhereInput = search
            ? {
                  OR: [
                      {user: {name: {contains: search, mode: "insensitive"}}},
                      {user: {email: {contains: search, mode: "insensitive"}}},
                      {midtrans_order_id: {contains: search, mode: "insensitive"}},
                  ],
              }
            : {}

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                skip,
                take: PAGE_SIZE,
                orderBy: {created_at: "asc"},
                select: orderSelect,
                where,
            }),
            prisma.order.count({
                where,
            }),
        ])

        return {
            success: true,
            message: "Order fetched successfully",
            data: {
                orders,
                pagination: {
                    page,
                    total,
                    pageCount: Math.ceil(total / PAGE_SIZE),
                },
            },
        }
    } catch (error) {
        return handleServerError(error)
    }
}
