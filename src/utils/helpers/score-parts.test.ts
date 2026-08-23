import assert from "node:assert/strict"
import {scoreAnswers, type ScoreQuestion, type ScoreAnswer} from "./score-parts"

// Two parts, each: 5 single_choice, 5 multiple_choice, 5 scaled_choice (max 10 each)
const questions: ScoreQuestion[] = []
const answers: ScoreAnswer[] = []
for (const [partId, partName] of [
    ["p1", "Part 1"],
    ["p2", "Part 2"],
] as const) {
    for (let i = 1; i <= 5; i++) {
        const sc = `sc-${partId}-${i}`
        const mc = `mc-${partId}-${i}`
        const sc_o = `sc-o-${partId}-${i}`
        const mc_o = `mc-o-${partId}-${i}`
        questions.push(
            {id: sc, part_id: partId, part_name: partName, type: "single_choice", options: [{id: sc_o, is_correct: true, score: 1}]},
            {
                id: mc,
                part_id: partId,
                part_name: partName,
                type: "multiple_choice",
                options: [
                    {id: `mc-o1-${partId}-${i}`, is_correct: true, score: 1},
                    {id: `mc-o2-${partId}-${i}`, is_correct: true, score: 1},
                    {id: `mc-o3-${partId}-${i}`, is_correct: false, score: 0},
                ],
            },
        )
        answers.push({question_id: sc, option_id: sc_o, score_awarded: 1})
        answers.push({question_id: mc, option_id: "mc-o1-" + partId + "-" + i, score_awarded: 1})
        answers.push({question_id: mc, option_id: "mc-o2-" + partId + "-" + i, score_awarded: 1})
    }
    for (let i = 1; i <= 5; i++) {
        const tk = `tk-${partId}-${i}`
        const tk_o = `tk-o-${partId}-${i}`
        questions.push({id: tk, part_id: partId, part_name: partName, type: "scaled_choice", options: [{id: tk_o, is_correct: false, score: 10}]})
        answers.push({question_id: tk, option_id: tk_o, score_awarded: 10})
    }
}

const r = scoreAnswers(answers, questions)

assert.equal(r.mcScore, 100, "all MC/SC correct -> 100")
assert.equal(r.scaledScore, 100, "scaled earned = 5*10 per part * 2 = 100")
assert.equal(r.scaledMax, 100, "scaled max = 5*10 per part * 2 = 100")
assert.equal(r.correctCount, 20, "5 SC + 5 MC per part * 2 = 20")
assert.equal(r.objectiveAnswered, 20, "all objective questions answered")
assert.equal(r.parts.length, 2, "two parts")
for (const p of r.parts) {
    assert.equal(p.scEarned, 5)
    assert.equal(p.scMax, 5)
    assert.equal(p.mcEarned, 5)
    assert.equal(p.mcMax, 5)
    assert.equal(p.partScore, 100, `${p.partName} part score = 100`)
    assert.equal(p.scaledEarned, 50, `${p.partName} TKP = 50`)
}

// Mixed: a part with only scaled_choice -> no mcScore (null), only TKP
const scaledOnly: ScoreQuestion[] = [
    {id: "t", part_id: "sp", part_name: "TKP", type: "scaled_choice", options: [{id: "to", is_correct: false, score: 10}]},
]
const sr = scoreAnswers([{question_id: "t", option_id: "to", score_awarded: 10}], scaledOnly)
assert.equal(sr.mcScore, null, "scaled-only exam -> no MC score")
assert.equal(sr.parts[0].partScore, null, "scaled-only part -> partScore null")
assert.equal(sr.parts[0].scaledEarned, 10, "scaled earned = 10")

console.log("score-parts: ok")
