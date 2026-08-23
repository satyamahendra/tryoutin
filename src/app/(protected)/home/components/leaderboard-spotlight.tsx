import {getLeaderboardExams} from "@/app/(protected)/(features)/leaderboards/services/get-leaderboard-exams"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {PiCrown, PiTrophy, PiUsers} from "react-icons/pi"
import Link from "next/link"

const LeaderboardSpotlight = async () => {
    const {exams} = await getLeaderboardExams({limit: 4})

    if (exams.length === 0) return null

    return (
        <div className="flex flex-col gap-2">
            {exams.map((exam) => {
                const top = exam.topUsers[0]
                return (
                    <Link
                        key={exam.id}
                        href={`/leaderboards?view=${exam.id}`}
                        className="group flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5">
                        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <PiTrophy className="w-4 h-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="truncate font-medium text-sm">{exam.title}</span>
                                {exam.category && <Badge variant="outline" className="shrink-0 text-[10px] font-normal">{exam.category}</Badge>}
                            </div>
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <PiUsers className="w-3 h-3" />
                                {exam.participantCount} {exam.participantCount === 1 ? "participant" : "participants"}
                            </span>
                        </div>
                        {top ? (
                            <div className="flex shrink-0 items-center gap-2">
                                <Avatar className="w-7 h-7">
                                    <AvatarImage src={top.image || undefined} />
                                    <AvatarFallback>{top.name ? top.name[0].toUpperCase() : "U"}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col items-end leading-tight">
                                    <span className="flex items-center gap-1 text-xs font-semibold">
                                        <PiCrown className="w-3 h-3 text-amber-500" />
                                        {top.name.split(" ")[0]}
                                    </span>
                                    <span className="text-xs font-bold tabular-nums text-primary">{top.score}</span>
                                </div>
                            </div>
                        ) : (
                            <span className="shrink-0 text-xs text-muted-foreground">No scores</span>
                        )}
                    </Link>
                )
            })}
        </div>
    )
}

export default LeaderboardSpotlight
