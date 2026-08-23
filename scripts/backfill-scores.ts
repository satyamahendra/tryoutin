import "dotenv/config"
import prisma from "@/lib/prisma/client"
import {computeExamSessionsScores} from "@/utils/helpers/compute-session-scores"

// ponytail: one-time backfill after the new scoring formula. Run once: npx tsx scripts/backfill-scores.ts
// Computes the new per-type breakdown + mcScore for every completed session and writes it.
async function main() {
    const sessions = await prisma.examSession.findMany({
        where: {status: "completed"},
        select: {id: true, exam_id: true},
    })
    if (sessions.length === 0) {
        console.log("No completed sessions to backfill.")
        return
    }

    const byExam = new Map<string, string[]>()
    for (const s of sessions) {
        const arr = byExam.get(s.exam_id) ?? []
        arr.push(s.id)
        byExam.set(s.exam_id, arr)
    }

    let updated = 0
    for (const [examId, sessionIds] of byExam) {
        const scores = await computeExamSessionsScores(examId, sessionIds)
        for (const id of sessionIds) {
            const sc = scores.get(id)
            if (!sc) continue
            await prisma.examSession.update({
                where: {id},
                data: {
                    total_score: sc.totalScore,
                    scaled_score: sc.scaledScore,
                    scaled_max: sc.scaledMax,
                    mc_score: sc.mcScore,
                    sc_earned: sc.totalScEarned,
                    sc_max: sc.totalScMax,
                    mc_earned: sc.totalMcEarned,
                    mc_max: sc.totalMcMax,
                    objective_answered: sc.objectiveAnswered,
                },
            })
            updated++
        }
    }
    console.log(`Backfilled ${updated} completed session(s).`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())
