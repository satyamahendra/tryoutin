import prisma from "@/lib/prisma/client"

export type SessionScores = {
    totalScore: number
    scaledScore: number
    correctCount: number
}

export type ScoreAnswer = {
    question_id: string
    option_id: string | null
    score_awarded: number | null
}

export type ScoreQuestion = {
    id: string
    type: string
    options: {id: string; is_correct: boolean}[]
}

export function scoreAnswers(answers: ScoreAnswer[], questions: ScoreQuestion[]): SessionScores {
    const questionById = new Map(questions.map((q) => [q.id, q]))

    let totalScore = 0
    let scaledScore = 0
    for (const a of answers) {
        const q = questionById.get(a.question_id)
        if (!q) continue
        const points = a.score_awarded ?? 0
        if (q.type === "scaled_choice") scaledScore += points
        else totalScore += points
    }

    const selectedByQuestion = new Map<string, Set<string>>()
    for (const a of answers) {
        if (!a.option_id) continue
        const set = selectedByQuestion.get(a.question_id) || new Set<string>()
        set.add(a.option_id)
        selectedByQuestion.set(a.question_id, set)
    }

    let correct = 0
    for (const q of questions) {
        if (q.type === "scaled_choice") continue
        const selected = selectedByQuestion.get(q.id)
        if (!selected || selected.size === 0) continue

        const correctOptions = new Set(q.options.filter((o) => o.is_correct).map((o) => o.id))
        if (q.type === "multiple_choice") {
            const exact = selected.size === correctOptions.size && [...correctOptions].every((id) => selected.has(id))
            if (correctOptions.size > 0 && exact) correct++
        } else {
            if ([...selected].some((id) => correctOptions.has(id))) correct++
        }
    }

    return {totalScore, scaledScore, correctCount: correct}
}

export async function computeSessionScores(sessionId: string): Promise<SessionScores> {
    const answers = await prisma.userAnswer.findMany({
        where: {session_id: sessionId, is_graded: true, score_awarded: {not: null}},
        select: {question_id: true, option_id: true, score_awarded: true},
    })

    const questionIds = [...new Set(answers.map((a) => a.question_id))]
    if (questionIds.length === 0) return {totalScore: 0, scaledScore: 0, correctCount: 0}

    const questions = await prisma.question.findMany({
        where: {id: {in: questionIds}},
        select: {
            id: true,
            type: true,
            options: {select: {id: true, is_correct: true}},
        },
    })

    return scoreAnswers(answers, questions)
}

if (process.argv[1]?.endsWith("compute-session-scores.ts")) {
    const qs: ScoreQuestion[] = [
        {
            id: "sc",
            type: "scaled_choice",
            options: [
                {id: "sc-o0", is_correct: false},
                {id: "sc-o1", is_correct: false},
            ],
        },
        {
            id: "s1",
            type: "single_choice",
            options: [
                {id: "s1-o0", is_correct: true},
                {id: "s1-o1", is_correct: false},
            ],
        },
        {
            id: "s2",
            type: "single_choice",
            options: [
                {id: "s2-o0", is_correct: true},
                {id: "s2-o1", is_correct: false},
            ],
        },
        {
            id: "mc",
            type: "multiple_choice",
            options: [
                {id: "mc-o0", is_correct: true},
                {id: "mc-o1", is_correct: true},
                {id: "mc-o2", is_correct: false},
            ],
        },
    ]

    const r = scoreAnswers(
        [
            {question_id: "sc", option_id: "sc-o0", score_awarded: 4},
            {question_id: "sc", option_id: "sc-o1", score_awarded: 1},
            {question_id: "s1", option_id: "s1-o0", score_awarded: 5},
            {question_id: "s2", option_id: "s2-o1", score_awarded: 0},
            {question_id: "mc", option_id: "mc-o0", score_awarded: 3},
            {question_id: "mc", option_id: "mc-o2", score_awarded: 0},
            {question_id: "es", option_id: null, score_awarded: null},
        ],
        qs,
    )

    console.assert(r.scaledScore === 5, "scaled sums selected scaled options")
    console.assert(r.totalScore === 8, "total sums non-scaled options (5 + 3)")
    console.assert(r.correctCount === 1, "correct = 1 (s1 only; mc not exact, s2 wrong)")
    console.assert(r.totalScore + r.scaledScore === 13, "scores stay separate")
    console.log("compute-session-scores self-check OK:", r)
}
