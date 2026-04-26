"use server"

import {Prisma} from "@/generated/index"
import prisma from "@/lib/prisma/client"

const PAGE_SIZE = 10

const userSelect = Prisma.validator<Prisma.UserSelect>()({
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

export type User = Prisma.UserGetPayload<{select: typeof userSelect}>

export type UsersPage = {
    users: User[]
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
            select: userSelect,
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
