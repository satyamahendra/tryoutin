"use server"

import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"

export type GetTryoutHero = {
    tryoutCount: number
    questionCount: number
    learnerCount: number
}

export async function getTryoutHero(): Promise<GetTryoutHero> {
    const session = await authServer()
    if (!session) throw new Error("Unauthorized")

    const where = {
        is_active: true,
        product: {isNot: null},
    }

    const [tryoutCount, questionCount, learnerCount] = await Promise.all([
        prisma.exam.count({where}),
        prisma.question.count({where: {part: {exam: where}}}),
        prisma.entitlement.count({where: {product: {exam: {is: where}}}}),
    ])

    return {tryoutCount, questionCount, learnerCount}
}
