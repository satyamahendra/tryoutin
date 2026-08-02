"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {handleServerError} from "@/utils/helpers/handle-server-errors"
import {ServerResult} from "@/utils/types/server-action"

const sessionPartSelect = Prisma.validator<Prisma.ExamSessionSelect>()({
    id: true,
    type: true,
    status: true,
    started_at: true,
    part_sessions: {
        include: {
            part: {
                select: {
                    id: true,
                    name: true,
                    order_index: true,
                    questions: {
                        orderBy: {order_index: "asc"},
                        select: {id: true},
                    },
                },
            },
        },
        orderBy: {part: {order_index: "asc"}},
    },
})

export type StartedSession = Prisma.ExamSessionGetPayload<{select: typeof sessionPartSelect}>

export async function startSession(examId: string, entitlementId?: string, sessionType: "simulation" | "practice" = "simulation"): Promise<ServerResult<StartedSession>> {
    try {
        const session = await authServer()
        if (!session) throw new Error("Unauthorized")

        const existing = await prisma.examSession.findFirst({
            select: sessionPartSelect,
            where: {
                user_id: session.user.id,
                exam_id: examId,
                type: sessionType,
                status: {in: ["in_progress"]},
            },
        })

        if (existing) {
            return {success: true, message: "Session resumed", data: existing}
        }

        const exam = await prisma.exam.findUnique({
            where: {id: examId, is_active: true},
            select: {
                id: true,
                parts: {
                    orderBy: {order_index: "asc"},
                    select: {id: true, duration_minutes: true},
                },
            },
        })

        if (!exam || exam.parts.length === 0) throw new Error("Exam not found")

        const now = new Date()
        const isPractice = sessionType === "practice"

        const newSession = await prisma.$transaction(async (tx) => {
            const created = await tx.examSession.create({
                data: {
                    user_id: session.user.id,
                    exam_id: examId,
                    type: sessionType,
                    entitlement_id: entitlementId ?? null,
                    status: "in_progress",
                    started_at: now,
                    ends_at: null,
                },
                select: sessionPartSelect,
            })

            for (let i = 0; i < exam.parts.length; i++) {
                const part = exam.parts[i]
                await tx.examSessionPart.create({
                    data: {
                        session_id: created.id,
                        part_id: part.id,
                        status: isPractice ? "in_progress" : (i === 0 ? "in_progress" : "not_started"),
                        started_at: now,
                        ends_at: isPractice ? null : (i === 0 && part.duration_minutes ? new Date(now.getTime() + part.duration_minutes * 60000) : null),
                    },
                })
            }

            const full = await tx.examSession.findUnique({
                where: {id: created.id},
                select: sessionPartSelect,
            })

            return full!
        })

        return {success: true, message: "Session started", data: newSession}
    } catch (error) {
        return handleServerError(error)
    }
}
