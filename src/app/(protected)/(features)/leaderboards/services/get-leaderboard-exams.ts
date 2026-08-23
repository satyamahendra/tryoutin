"use server"

import {Prisma} from "@/generated/index"
import {authServer} from "@/lib/auth-server"
import prisma from "@/lib/prisma/client"
import {rankSessions, type LeaderboardUser} from "./leaderboard-rank"
import {computeExamSessionsScores} from "@/utils/helpers/compute-session-scores"

const examListSelect = Prisma.validator<Prisma.ExamSelect>()({
    id: true,
    title: true,
    category: true,
    description: true,
    tags: {select: {tag: {select: {id: true, name: true}}}},
    _count: {select: {parts: true}},
})

export type LeaderboardExam = Prisma.ExamGetPayload<{select: typeof examListSelect}> & {
    topUsers: LeaderboardUser[]
    participantCount: number
}

export type GetLeaderboardExams = {exams: LeaderboardExam[]}

export async function getLeaderboardExams({search, category, tags, limit}: {search?: string; category?: string; tags?: string; limit?: number}): Promise<GetLeaderboardExams> {
    const session = await authServer()
    if (!session) throw new Error("Unauthorized")

    const where: Prisma.ExamWhereInput = {is_active: true}

    if (search) {
        where.OR = [
            {title: {contains: search, mode: "insensitive"}},
            {description: {contains: search, mode: "insensitive"}},
        ]
    }
    if (category) where.category = category
    if (tags) {
        const names = tags.split(",").filter(Boolean)
        if (names.length > 0) where.tags = {some: {tag: {name: {in: names}}}}
    }

    const exams = await prisma.exam.findMany({select: examListSelect, where, orderBy: {created_at: "desc"}, ...(limit ? {take: limit} : {})})
    if (exams.length === 0) return {exams: []}

    const examIds = exams.map((e) => e.id)
    const sessions = await prisma.examSession.findMany({
        where: {exam_id: {in: examIds}, status: "completed", total_score: {not: null}, type: "simulation"},
        select: {id: true, exam_id: true, user_id: true, total_score: true, submitted_at: true, user: {select: {id: true, name: true, image: true}}},
    })

    const byExam = new Map<string, typeof sessions>()
    for (const s of sessions) {
        const arr = byExam.get(s.exam_id)
        if (arr) arr.push(s)
        else byExam.set(s.exam_id, [s])
    }

    const examsWithRankings = await Promise.all(
        exams.map(async (e) => {
            const sess = byExam.get(e.id) ?? []
            const scores = await computeExamSessionsScores(e.id, sess.map((s) => s.id))
            const ranked = rankSessions(
                sess.map((s) => ({
                    ...s,
                    score: scores.get(s.id)?.mcScore ?? null,
                    normalizedScaled: scores.get(s.id)?.normalizedScaledScore ?? null,
                })),
            )
            return {...e, topUsers: ranked.slice(0, 5), participantCount: ranked.length}
        }),
    )

    return {exams: examsWithRankings}
}
