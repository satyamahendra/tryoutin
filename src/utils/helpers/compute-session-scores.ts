import prisma from "@/lib/prisma/client"
import {scoreAnswers, type SessionScores, type ScoreQuestion, type ScoreAnswer} from "./score-parts"

const SCORE_ANSWER_SELECT = {
    question_id: true,
    option_id: true,
    score_awarded: true,
} as const

const SCORE_QUESTION_SELECT = {
    id: true,
    part_id: true,
    part: {select: {name: true}},
    type: true,
    options: {select: {id: true, is_correct: true, score: true}},
} as const

export async function computeSessionScores(sessionId: string): Promise<SessionScores> {
    const answers = await prisma.userAnswer.findMany({
        where: {session_id: sessionId, score_awarded: {not: null}},
        select: SCORE_ANSWER_SELECT,
    })

    const questionIds = [...new Set(answers.map((a) => a.question_id))]
    if (questionIds.length === 0)
        return {
            totalScore: 0,
            scaledScore: 0,
            scaledMax: 0,
            normalizedScaledScore: null,
            correctCount: 0,
            objectiveAnswered: 0,
            parts: [],
            mcScore: null,
            totalScEarned: 0,
            totalScMax: 0,
            totalMcEarned: 0,
            totalMcMax: 0,
        }

    const questions = await prisma.question.findMany({
        where: {id: {in: questionIds}},
        select: SCORE_QUESTION_SELECT,
    })

    return scoreAnswers(
        answers as ScoreAnswer[],
        questions.map((q) => ({...q, part_name: q.part?.name})) as ScoreQuestion[],
    )
}

// Re-exports so existing server imports keep working
export {scoreAnswers} from "./score-parts"
export type {SessionScores, PartScore, ScoreAnswer, ScoreQuestion} from "./score-parts"

// ponytail: batch-computes 0-100 MC/SC + separate scaled per session for ONE exam.
// Used by leaderboards so aggregated lists show the same scoring as the detail views.
export async function computeExamSessionsScores(examId: string, sessionIds: string[]): Promise<Map<string, SessionScores>> {
    const result = new Map<string, SessionScores>()
    if (sessionIds.length === 0) return result

    const questions = await prisma.question.findMany({
        where: {part: {exam_id: examId}},
        select: {
            id: true,
            part_id: true,
            part: {select: {name: true}},
            type: true,
            options: {select: {id: true, is_correct: true, score: true}},
        },
    })

    const answers = await prisma.userAnswer.findMany({
        where: {session_id: {in: sessionIds}, score_awarded: {not: null}},
        select: {session_id: true, question_id: true, option_id: true, score_awarded: true},
    })

    const bySession = new Map<string, ScoreAnswer[]>()
    for (const a of answers) {
        const arr = bySession.get(a.session_id) ?? []
        arr.push({question_id: a.question_id, option_id: a.option_id, score_awarded: a.score_awarded})
        bySession.set(a.session_id, arr)
    }

    for (const sid of sessionIds) {
        result.set(
            sid,
            scoreAnswers(
                bySession.get(sid) ?? [],
                questions.map((q) => ({...q, part_name: q.part?.name})) as ScoreQuestion[],
            ),
        )
    }
    return result
}
