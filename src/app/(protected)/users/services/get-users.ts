"use server"

import prisma from "@/lib/prisma/client"

const PAGE_SIZE = 10

export type UsersPage = {
    users: {
        id: string
        name: string | null
        email: string
        image: string | null
        createdAt: Date
    }[]
    pagination: {
        total: number
        page: number
        pageCount: number
    }
}

export async function getUsers(page: number = 1): Promise<UsersPage> {
    const skip = (page - 1) * PAGE_SIZE

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            skip,
            take: PAGE_SIZE,
            orderBy: {createdAt: "desc"},
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
            },
        }),
        prisma.user.count(),
    ])

    return {
        users,
        pagination: {
            page,
            total,
            pageCount: Math.ceil(total / PAGE_SIZE),
        },
    }
}
