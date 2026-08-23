"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"

const marketplaceSelect = Prisma.validator<Prisma.ExamSelect>()({
    id: true,
    title: true,
    description: true,
    category: true,
    product: {
        select: {
            id: true,
            name: true,
            price_actual: true,
            price_alternate: true,
            type: true,
        },
    },
    parts: {
        select: {_count: {select: {questions: true}}},
    },
    _count: {select: {parts: true}},
})

export type HomeMarketplaceTryout = Prisma.ExamGetPayload<{select: typeof marketplaceSelect}> & {owned: boolean}

export type GetHomeMarketplace = {tryouts: HomeMarketplaceTryout[]}

// ponytail: newest live marketplace tryouts for the home "New arrivals" row
export async function getHomeMarketplace(limit = 6): Promise<GetHomeMarketplace> {
    const session = await authServer()
    if (!session) throw new Error("Unauthorized")

    const [tryouts, entitlements] = await Promise.all([
        prisma.exam.findMany({
            select: marketplaceSelect,
            where: {is_active: true, product: {isNot: null}},
            orderBy: {created_at: "desc"},
            take: limit,
        }),
        prisma.entitlement.findMany({where: {user_id: session.user.id}, select: {product_id: true}}),
    ])

    const ownedProductIds = new Set(entitlements.map((e) => e.product_id))

    return {
        tryouts: tryouts.map((t) => ({...t, owned: t.product ? ownedProductIds.has(t.product.id) : false})),
    }
}
