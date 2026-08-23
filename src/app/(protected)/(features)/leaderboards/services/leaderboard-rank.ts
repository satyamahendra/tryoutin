export type LeaderboardUser = {
    userId: string
    name: string
    image: string | null
    score: number
    rank: number
}

type RankInput = {
    user_id: string
    score: number | null // mc_score 0-100
    normalizedScaled: number | null // scaled_score / scaled_max * 100
    submitted_at: Date | null
    user: {id: string; name: string; image: string | null}
}

// ponytail: composite = (mcScore + normalizedScaled) / 2; earlier submit breaks ties
export function rankSessions(sessions: RankInput[]): LeaderboardUser[] {
    const best = new Map<string, {name: string; image: string | null; score: number; submittedAt: number}>()
    for (const s of sessions) {
        if (s.score == null) continue
        const composite =
            s.normalizedScaled == null ? s.score : Math.round((s.score + s.normalizedScaled) / 2)
        const cur = best.get(s.user_id)
        if (!cur || composite > cur.score) {
            best.set(s.user_id, {
                name: s.user.name,
                image: s.user.image,
                score: composite,
                submittedAt: s.submitted_at?.getTime() ?? 0,
            })
        }
    }
    return [...best.entries()]
        .sort((a, b) => b[1].score - a[1].score || a[1].submittedAt - b[1].submittedAt)
        .map(([userId, u], i) => ({userId, name: u.name, image: u.image, score: u.score, rank: i + 1}))
}
