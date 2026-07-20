"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

const myOrderSelect = Prisma.validator<Prisma.OrderSelect>()({
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

export async function getMyOrder(id: string): Promise<ServerResult<GetMyOrder>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const order = await prisma.order.findFirst({
            select: myOrderSelect,
            where: {
                id,
                user_id: session.user.id,
            },
        })

        if (!order) throw new Error("Order not found")

        return {success: true, data: order, message: "Order fetched successfully"}
    } catch (error) {
        return handleServerError(error)
    }
}
