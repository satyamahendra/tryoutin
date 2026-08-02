"use client"

import {useQuery} from "@tanstack/react-query"
import {useMemo} from "react"
import {useRouter, useSearchParams} from "next/navigation"
import {getMySessions} from "../services/get-my-sessions"
import {PiTimer, PiWarning, PiNotebook, PiGameController} from "react-icons/pi"
import {Loader2} from "lucide-react"
import AnimDiv from "@/components/custom/anim-div"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {cn} from "@/lib/utils"
import MySessionCard from "./my-session-card"

type FilterType = "simulation" | "practice" | "all"

const FILTERS: {value: FilterType; label: string; icon: React.ReactNode}[] = [
    {value: "simulation", label: "Simulation", icon: <PiTimer className="w-3.5 h-3.5" />},
    {value: "practice", label: "Practice", icon: <PiGameController className="w-3.5 h-3.5" />},
    {value: "all", label: "All", icon: <PiNotebook className="w-3.5 h-3.5" />},
]

const MySessionList = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const filter = (searchParams.get("type") as FilterType) ?? "simulation"

    const {data, isLoading, isError} = useQuery({
        queryKey: ["my-sessions"],
        queryFn: getMySessions,
    })

    const filteredSessions = useMemo(() => {
        if (!data?.success || !data.data) return []
        if (filter === "all") return data.data.sessions
        return data.data.sessions.filter((s) => s.type === filter)
    }, [data, filter])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-20">
                <Loader2 className="animate-spin text-primary" />
            </div>
        )
    }

    if (isError || (data && !data.success)) {
        return (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 py-12">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PiWarning />
                        </EmptyMedia>
                        <EmptyTitle>Something Went Wrong</EmptyTitle>
                        <EmptyDescription>{data?.message ?? "An unexpected error occurred"}. Please try again later.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        )
    }

    if (!data?.data || data.data.sessions.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-border py-16">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PiTimer />
                        </EmptyMedia>
                        <EmptyTitle>No Sessions Yet</EmptyTitle>
                        <EmptyDescription>
                            Start a tryout from your collection to see your sessions here.
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        )
    }

    return (
        <AnimDiv className="flex flex-col gap-4">
            <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 w-fit">
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => router.push(f.value === "simulation" ? "/my-sessions" : `/my-sessions?type=${f.value}`)}
                        className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                            filter === f.value
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground",
                        )}>
                        {f.icon}
                        {f.label}
                    </button>
                ))}
            </div>

            {filteredSessions.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border py-12">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiTimer />
                            </EmptyMedia>
                            <EmptyTitle>No {filter === "simulation" ? "Simulation" : filter === "practice" ? "Practice" : ""} Sessions</EmptyTitle>
                            <EmptyDescription>
                                {filter === "simulation"
                                    ? "Start a tryout simulation from your collection."
                                    : filter === "practice"
                                      ? "Try a practice session from your collection."
                                      : "Start a tryout from your collection to see your sessions here."}
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            ) : (
                <div className="overflow-hidden space-y-2">
                    {filteredSessions.map((session) => (
                        <MySessionCard key={session.id} session={session} />
                    ))}
                </div>
            )}
        </AnimDiv>
    )
}

export default MySessionList

