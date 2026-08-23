import {format, startOfDay, subDays} from "date-fns"

export type CompletedSession = {
    exam: {id?: string; category: string | null}
    status: string
    submitted_at: Date | null
    total_score: number | null
    mc_score: number | null
    objective_answered: number
    sc_earned: number
    sc_max: number
    mc_earned: number
    mc_max: number
}

const correctOf = (s: CompletedSession) => s.sc_earned + s.mc_earned

export type ExamStat = {
    attempts: number
    best: number
    accuracy: number | null
}

// ponytail: one row per exam from the user's sessions — attempts, best score, accuracy
export const calcExamStats = (sessions: CompletedSession[], examId: string): ExamStat => {
    const own = sessions.filter((s) => s.exam.id === examId && s.status === "completed")
    if (own.length === 0) return {attempts: 0, best: 0, accuracy: null}
    const answered = own.reduce((n, s) => n + s.objective_answered, 0)
    const correct = own.reduce((n, s) => n + correctOf(s), 0)
    return {
        attempts: own.length,
        best: Math.max(...own.map((s) => s.mc_score ?? 0)),
        accuracy: answered > 0 ? Math.round((correct / answered) * 100) : null,
    }
}

export const dayKey = (d: Date) => format(d, "yyyy-MM-dd")

// ponytail: server-local day, not the user's timezone
export const calcStreak = (days: Set<string>): number => {
    let cursor = new Date()
    if (!days.has(dayKey(cursor))) cursor = subDays(cursor, 1)
    let streak = 0
    while (days.has(dayKey(cursor))) {
        streak += 1
        cursor = subDays(cursor, 1)
    }
    return streak
}

export const calcWeeklyInsight = (completed: CompletedSession[]): {category: string; delta: number} | null => {
    const now = startOfDay(new Date())
    const weekCutoff = subDays(now, 6).getTime()
    const prevCutoff = subDays(now, 13).getTime()
    const cats = new Map<string, {cur: {answered: number; correct: number}; prev: {answered: number; correct: number}}>()
    for (const s of completed) {
        if (!s.submitted_at || !s.exam.category) continue
        const t = new Date(s.submitted_at).getTime()
        const entry = cats.get(s.exam.category) ?? {cur: {answered: 0, correct: 0}, prev: {answered: 0, correct: 0}}
        if (t >= weekCutoff) {
            entry.cur.answered += s.objective_answered
            entry.cur.correct += correctOf(s)
        } else if (t >= prevCutoff) {
            entry.prev.answered += s.objective_answered
            entry.prev.correct += correctOf(s)
        }
        cats.set(s.exam.category, entry)
    }
    let best: {category: string; delta: number} | null = null
    for (const [category, {cur, prev}] of cats) {
        if (cur.answered === 0 || prev.answered === 0) continue
        const delta = Math.round((cur.correct / cur.answered - prev.correct / prev.answered) * 100)
        if (!best || Math.abs(delta) > Math.abs(best.delta)) best = {category, delta}
    }
    return best
}
