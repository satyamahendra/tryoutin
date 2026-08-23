export type PartScore = {
    partId: string
    partName: string
    scEarned: number // single_choice questions correct
    scMax: number // single_choice questions in this part
    mcEarned: number // multiple_choice questions correct
    mcMax: number // multiple_choice questions in this part
    scaledEarned: number // raw TKP points earned
    scaledMax: number // max possible TKP points for this part
    scScore: number | null // 0-100, null if no single_choice questions
    mcScore: number | null // 0-100, null if no multiple_choice questions
    partScore: number | null // avg of scScore/mcScore present, 0-100, null if no MC/SC questions
}

export type SessionScores = {
    totalScore: number
    scaledScore: number
    scaledMax: number
    normalizedScaledScore: number | null // scaledScore / scaledMax * 100
    correctCount: number // single + multiple correct
    objectiveAnswered: number // single + multiple answered
    parts: PartScore[]
    mcScore: number | null // overall 0-100 (avg of part scores that have MC/SC)
    totalScEarned: number
    totalScMax: number
    totalMcEarned: number
    totalMcMax: number
}

export type ScoreAnswer = {
    question_id: string
    option_id: string | null
    score_awarded: number | null
}

export type ScoreQuestion = {
    id: string
    part_id?: string
    part_name?: string
    type: string
    options: {id: string; is_correct: boolean; score?: number | null}[]
}

const pct = (earned: number, max: number) => (max > 0 ? Math.round((earned / max) * 100) : null)

// ponytail: part score = avg of single_choice% and multiple_choice%, scaled kept separate.
// Overall = avg of part scores that contain MC/SC questions. Scaled never enters the /100.
export function scoreAnswers(answers: ScoreAnswer[], questions: ScoreQuestion[]): SessionScores {
    const questionById = new Map(questions.map((q) => [q.id, q]))

    let totalScore = 0
    let scaledScore = 0
    let scaledMax = 0
    const partMap = new Map<string, PartScore>()

    const getPart = (q: ScoreQuestion) => {
        const id = q.part_id ?? ""
        let p = partMap.get(id)
        if (!p) {
            p = {
                partId: id,
                partName: q.part_name ?? "",
                scEarned: 0,
                scMax: 0,
                mcEarned: 0,
                mcMax: 0,
                scaledEarned: 0,
                scaledMax: 0,
                scScore: null,
                mcScore: null,
                partScore: null,
            }
            partMap.set(id, p)
        }
        return p
    }

    for (const q of questions) {
        if (q.type === "scaled_choice") {
            scaledMax += Math.max(0, ...(q.options?.map((o) => o.score ?? 0) ?? [0]))
        }
    }

    for (const a of answers) {
        const q = questionById.get(a.question_id)
        if (!q) continue
        const pts = a.score_awarded ?? 0
        const part = getPart(q)
        if (q.type === "scaled_choice") {
            scaledScore += pts
            part.scaledEarned += pts
        }
        totalScore += pts
    }

    for (const q of questions) {
        const part = getPart(q)
        if (q.type === "single_choice") part.scMax += 1
        else if (q.type === "multiple_choice") part.mcMax += 1
        else if (q.type === "scaled_choice") {
            part.scaledMax += Math.max(0, ...(q.options?.map((o) => o.score ?? 0) ?? [0]))
        }
    }

    const selectedByQuestion = new Map<string, Set<string>>()
    for (const a of answers) {
        if (!a.option_id) continue
        const set = selectedByQuestion.get(a.question_id) || new Set<string>()
        set.add(a.option_id)
        selectedByQuestion.set(a.question_id, set)
    }

    let correct = 0
    let objectiveAnswered = 0
    for (const q of questions) {
        if (q.type === "scaled_choice") continue
        const selected = selectedByQuestion.get(q.id)
        if (!selected || selected.size === 0) continue
        objectiveAnswered++
        const correctOptions = new Set(q.options.filter((o) => o.is_correct).map((o) => o.id))
        if (correctOptions.size === 0) continue
        const isCorrect =
            q.type === "multiple_choice"
                ? selected.size === correctOptions.size && [...correctOptions].every((id) => selected.has(id))
                : [...selected].some((id) => correctOptions.has(id))
        if (isCorrect) {
            correct++
            const part = getPart(q)
            if (q.type === "single_choice") part.scEarned += 1
            else if (q.type === "multiple_choice") part.mcEarned += 1
        }
    }

    const parts = [...partMap.values()].map((p) => {
        const scScore = pct(p.scEarned, p.scMax)
        const mcScore = pct(p.mcEarned, p.mcMax)
        const present = [scScore, mcScore].filter((v): v is number => v !== null)
        const partScore = present.length > 0 ? Math.round(present.reduce((a, b) => a + b, 0) / present.length) : null
        return {...p, scScore, mcScore, partScore}
    })

    const scoredParts = parts.filter((p) => p.partScore !== null)
    const mcScore =
        scoredParts.length > 0
            ? Math.round(scoredParts.reduce((s, p) => s + (p.partScore as number), 0) / scoredParts.length)
            : null

    const totalScEarned = parts.reduce((s, p) => s + p.scEarned, 0)
    const totalScMax = parts.reduce((s, p) => s + p.scMax, 0)
    const totalMcEarned = parts.reduce((s, p) => s + p.mcEarned, 0)
    const totalMcMax = parts.reduce((s, p) => s + p.mcMax, 0)

    const normalizedScaledScore = scaledMax > 0 ? pct(scaledScore, scaledMax) : null

    return {
        totalScore,
        scaledScore,
        scaledMax,
        normalizedScaledScore,
        correctCount: correct,
        objectiveAnswered,
        parts,
        mcScore,
        totalScEarned,
        totalScMax,
        totalMcEarned,
        totalMcMax,
    }
}
