import assert from "node:assert/strict"
import {calcStreak, calcWeeklyInsight, dayKey} from "./dashboard-stats"

const day = (offset: number) => {
    const dt = new Date()
    dt.setDate(dt.getDate() - offset)
    return dayKey(dt)
}

assert.equal(calcStreak(new Set([day(0), day(1), day(2), day(4)])), 3, "gap breaks the streak")
assert.equal(calcStreak(new Set([day(1), day(3), day(4)])), 1, "today missing -> count from yesterday")
assert.equal(calcStreak(new Set([day(3)])), 0, "no session today or yesterday -> zero")

const now = new Date()
const d = (offset: number) => {
    const dt = new Date(now)
    dt.setDate(dt.getDate() - offset)
    return dt
}
const mk = (category: string, submitted_at: Date, answered: number, correct: number) => ({
    exam: {category},
    status: "completed",
    submitted_at,
    total_score: 0,
    mc_score: 0,
    objective_answered: answered,
    sc_earned: correct,
    sc_max: answered,
    mc_earned: 0,
    mc_max: 0,
})

const insight = calcWeeklyInsight([
    mk("TWK", d(1), 10, 9),
    mk("TWK", d(8), 10, 6),
    mk("TWK", d(20), 10, 9),
])
assert.ok(insight, "insight needs data in both this-week and last-week windows")
assert.equal(insight!.category, "TWK")
assert.equal(insight!.delta, 30, "90% this week vs 60% last week")

assert.equal(calcWeeklyInsight([mk("TWK", d(1), 10, 9)]), null, "no prior week -> no insight")

console.log("dashboard-stats: ok")
