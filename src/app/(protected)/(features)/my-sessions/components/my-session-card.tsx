"use client"

import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Separator} from "@/components/ui/separator"
import {PiClock, PiPlay, PiArrowRight, PiCheckCircle, PiTimer, PiWarningCircle, PiEye} from "react-icons/pi"
import {useRouter} from "next/navigation"
import {format} from "date-fns"
import {cn} from "@/lib/utils"
import type {GetMySession} from "../services/get-my-sessions"

type MySessionCardProps = {
    session: GetMySession
}

const MySessionCard = ({session}: MySessionCardProps) => {
    const router = useRouter()
    const exam = session.exam
    const totalParts = exam._count.parts
    const completedParts = session.part_sessions.filter((ps) => ps.status === "completed" || ps.status === "expired").length
    const totalQuestions = session.part_sessions.reduce((sum, ps) => sum + ps.part._count.questions, 0)
    const answeredCount = session._count.answers

    const isCompleted = session.status === "completed"
    const isExpired = session.status === "expired"
    const isInProgress = session.status === "in_progress"
    const isPractice = session.type === "practice"

    const statusLabel = isCompleted ? "Finished" : isExpired ? "Not Finished" : "In Progress"
    const statusColor = isCompleted
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        : isExpired
          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"

    const statusIcon = isCompleted ? <PiCheckCircle /> : isExpired ? <PiWarningCircle /> : <PiTimer />

    return (
        <div
            className={cn(
                "bg-muted/50 hover:bg-muted duration-200 p-3 border border-l-6 rounded-md cursor-pointer transition-colors",
                isPractice ? "border-l-muted" : "border-l-primary",
            )}
            onClick={() => isCompleted && router.push(`/review-session/${session.id}`)}>
            <div className="flex items-start gap-3 ml-2">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{exam.title}</span>
                        <Badge className={cn("shrink-0 text-[10px] gap-1 px-1.5 py-0", statusColor)}>
                            {statusIcon}
                            {statusLabel}
                        </Badge>
                        <Badge variant="outline" className="shrink-0 text-[10px] px-1.5 py-0">
                            {isPractice ? "Practice" : "Simulation"}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                            <PiClock className="w-3 h-3" />
                            {format(session.started_at, "dd MMM yyyy")}
                        </span>
                        <Separator orientation="vertical" className="h-3" />
                        <span>{completedParts}/{totalParts} parts</span>
                        <Separator orientation="vertical" className="h-3" />
                        <span>{answeredCount}/{totalQuestions} questions</span>
                        {isCompleted && (
                            <>
                                {session.mc_score != null && (
                                    <>
                                        <Separator orientation="vertical" className="h-3" />
                                        <span className="font-medium text-primary">{session.mc_score}</span>
                                        <span className="text-[10px] text-primary/70">/100</span>
                                    </>
                                )}
                                {session.scaled_score != null && (
                                    <span className="font-medium text-primary/70">+{session.scaled_score} TKP</span>
                                )}
                                <Separator orientation="vertical" className="h-3" />
                                <span className="font-medium text-foreground">
                                    SC {session.sc_earned}/{session.sc_max} · MC {session.mc_earned}/{session.mc_max}
                                    {session.scaled_max ? ` · TKP ${session.scaled_score}/${session.scaled_max}` : ""}
                                </span>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    {isCompleted && (
                        <Button size="sm" variant="outline" className="rounded-lg" onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/review-session/${session.id}`)
                        }}>
                            <PiEye className="mr-1" />
                            Review
                        </Button>
                    )}
                    {isInProgress && (
                        <Button size="sm" className="rounded-lg" onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/tryout-session/${exam.id}?session=${session.id}&mode=${isPractice ? "practice" : "simulation"}`)
                        }}>
                            <PiPlay className="mr-1" />
                            Continue
                        </Button>
                    )}
                    {isExpired && (
                        <Button size="sm" variant="outline" className="rounded-lg" onClick={(e) => {
                            e.stopPropagation()
                            router.push(`/tryout-session/${exam.id}?mode=simulation`)
                        }}>
                            <PiArrowRight className="mr-1" />
                            Try Again
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MySessionCard

