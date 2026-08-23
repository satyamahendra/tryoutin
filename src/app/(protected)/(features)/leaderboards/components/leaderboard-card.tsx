"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {PiCrown, PiTrophy, PiUsers} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {cn} from "@/lib/utils"
import type {LeaderboardExam} from "../services/get-leaderboard-exams"

const rankStyle = (rank: number) =>
    rank === 1 ? "text-amber-500" : rank === 2 ? "text-slate-400" : rank === 3 ? "text-orange-700" : "text-muted-foreground"

const LeaderboardCard = ({exam}: {exam: LeaderboardExam}) => {
    const {setParams} = useQueryParams()

    const open = () => setParams({view: exam.id})

    return (
        <Card
            className="h-full flex flex-col transition-all border border-l-6 border-l-primary hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5 cursor-pointer group"
            onClick={open}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{exam.title}</CardTitle>
                    {exam.category && <Badge className="shrink-0 text-xs bg-primary text-primary-foreground">{exam.category}</Badge>}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
                    <PiUsers className="w-3.5 h-3.5" />
                    {exam.participantCount} {exam.participantCount === 1 ? "participant" : "participants"}
                </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 flex-1">
                {exam.topUsers.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">No scores yet. Be the first!</p>
                ) : (
                    <ul className="flex flex-col gap-1.5">
                        {exam.topUsers.map((u) => (
                            <li key={u.userId} className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-muted/60 transition-colors">
                                <span className={cn("flex items-center justify-center w-5 text-sm font-bold", rankStyle(u.rank))}>
                                    {u.rank <= 3 ? <PiCrown /> : u.rank}
                                </span>
                                <Avatar className="w-7 h-7">
                                    <AvatarImage src={u.image || undefined} />
                                    <AvatarFallback>{u.name ? u.name[0].toUpperCase() : "U"}</AvatarFallback>
                                </Avatar>
                                <span className="flex-1 min-w-0 truncate text-sm font-medium">{u.name}</span>
                                <span className="text-sm font-bold tabular-nums text-primary">{u.score}</span>
                                <span className="text-[10px] text-muted-foreground">/100</span>
                            </li>
                        ))}
                    </ul>
                )}
                <button
                    onClick={(e) => {
                        e.stopPropagation()
                        open()
                    }}
                    className="mt-auto flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:underline pt-2">
                    <PiTrophy className="w-3.5 h-3.5" />
                    View full leaderboard
                </button>
            </CardContent>
        </Card>
    )
}

export default LeaderboardCard
