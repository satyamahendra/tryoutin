import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {PiListChecks, PiPlay, PiStack, PiTarget} from "react-icons/pi"
import Link from "next/link"
import {calcExamStats, type CompletedSession} from "../lib/dashboard-stats"
import type {GetMyTryout} from "@/app/(protected)/(features)/my-tryouts/services/get-my-tryouts"

const YourTryouts = ({tryouts, sessions}: {tryouts: GetMyTryout[]; sessions: CompletedSession[]}) => {
    const inProgressExamIds = new Set(sessions.filter((s) => s.status === "in_progress").map((s) => s.exam.id))

    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {tryouts.map((tryout) => {
                const stats = calcExamStats(sessions, tryout.id)
                const totalQuestions = tryout.parts.reduce((sum, p) => sum + p._count.questions, 0)
                const continuing = inProgressExamIds.has(tryout.id)
                return (
                    <Card key={tryout.id} className="flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-base leading-snug">{tryout.title}</CardTitle>
                                {tryout.category && <Badge className="shrink-0 text-xs bg-primary text-primary-foreground">{tryout.category}</Badge>}
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 flex-1">
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <PiStack className="w-4 h-4" />
                                    {tryout._count.parts} {tryout._count.parts === 1 ? "Part" : "Parts"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <PiListChecks className="w-4 h-4" />
                                    {totalQuestions} Q
                                </span>
                            </div>

                            <div className="grid grid-cols-3 gap-2 rounded-xl border bg-muted/30 p-2.5 text-center">
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold tabular-nums">{stats.attempts}</span>
                                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Attempts</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold tabular-nums text-primary">{stats.best}</span>
                                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Best</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold tabular-nums">{stats.accuracy ?? "—"}</span>
                                    <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Accuracy</span>
                                </div>
                            </div>

                            <Button asChild size="sm" className="mt-auto w-full">
                                <Link href={`/tryout-session/${tryout.id}?mode=simulation`}>
                                    {continuing ? <PiPlay className="mr-1.5" /> : <PiTarget className="mr-1.5" />}
                                    {continuing ? "Continue" : "Start"}
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export default YourTryouts
