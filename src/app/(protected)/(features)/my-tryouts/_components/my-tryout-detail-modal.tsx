"use client"

import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {PiCheck, PiClock, PiGameController, PiListChecks, PiPlay, PiTrophy, PiX} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {useQuery} from "@tanstack/react-query"
import {getMyTryoutDetail} from "../_services/get-my-tryout-detail"
import {Loader2} from "lucide-react"
import {useScreenSize} from "@/utils/hooks/useScreenSize"
import {cn} from "@/lib/utils"
import {toast} from "sonner"

const MyTryoutDetailModal = () => {
    const {getParam, setParams} = useQueryParams()
    const {isMobile} = useScreenSize()
    const view = getParam("view")

    const {data: tryoutData, isLoading} = useQuery({
        queryKey: ["my-tryout-detail", view],
        queryFn: () => getMyTryoutDetail(view!),
        enabled: !!view,
    })

    const tryout = tryoutData?.data
    const totalQuestions = tryout?.parts.reduce((sum, part) => sum + part._count.questions, 0) ?? 0

    const handleStartTryout = () => {
        toast.info("Start Tryout feature coming soon!")
    }

    const handlePracticeMode = () => {
        toast.info("Practice Mode feature coming soon!")
    }

    return (
        <Drawer swipeDirection={isMobile ? "down" : "right"} open={!!view} onOpenChange={(open) => !open && setParams({view: ""})}>
            <DrawerContent aria-describedby="my-tryout-detail" className={cn(isMobile ? "h-[85vh]" : "h-full")}>
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
                    </div>
                ) : !tryout ? (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Tryout not found.</div>
                ) : (
                    <>
                        <div className="relative bg-gradient-to-br from-violet-600 via-violet-600 to-violet-500 text-primary-foreground px-6 py-8">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
                            <div className="relative flex flex-col gap-3">
                                <div className="flex items-start justify-end">
                                    <button
                                        onClick={() => setParams({view: ""})}
                                        className="rounded-full bg-white/15 p-1.5 text-primary-foreground/70 hover:bg-white/25 hover:text-primary-foreground transition-colors">
                                        <PiX className="w-4 h-4" />
                                    </button>
                                </div>
                                <DrawerHeader className="p-0 gap-2 text-left">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex flex-col gap-2">
                                            <DrawerTitle className="text-xl font-bold text-primary-foreground leading-snug">{tryout.title}</DrawerTitle>
                                            {tryout.description && (
                                                <DrawerDescription className="text-primary-foreground/80 text-sm leading-relaxed">{tryout.description}</DrawerDescription>
                                            )}
                                        </div>
                                        {tryout.category && (
                                            <Badge variant="secondary" className="shrink-0 text-xs bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30">
                                                {tryout.category}
                                            </Badge>
                                        )}
                                    </div>
                                    {tryout.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {tryout.tags.map((t) => (
                                                <Badge key={t.tag.id} variant="outline" className="text-[10px] font-normal bg-white/10 text-primary-foreground border-white/25">
                                                    {t.tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </DrawerHeader>
                                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-primary-foreground/90">
                                    <div className="flex items-center gap-1.5">
                                        <Badge variant="outline" className="p-0 aspect-square bg-white/15 border-white/25">
                                            <PiListChecks />
                                        </Badge>
                                        <span>
                                            {tryout._count.parts} {tryout._count.parts === 1 ? "Part" : "Parts"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Badge variant="outline" className="p-0 aspect-square bg-white/15 border-white/25">
                                            <PiListChecks />
                                        </Badge>
                                        <span>
                                            {totalQuestions} {totalQuestions === 1 ? "Question" : "Questions"}
                                        </span>
                                    </div>
                                    {tryout.duration_minutes && (
                                        <div className="flex items-center gap-1.5">
                                            <Badge variant="outline" className="p-0 aspect-square bg-white/15 border-white/25">
                                                <PiClock />
                                            </Badge>
                                            <span>{tryout.duration_minutes} min</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 px-6 py-6 overflow-y-auto flex-1">
                            <div className="flex flex-col gap-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">What you will get</h3>
                                <div className="flex flex-col gap-2.5">
                                    {tryout.parts.map((part, i) => (
                                        <div key={part.id} className="flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-violet-100 text-violet-700 text-sm font-bold shrink-0 mt-0.5 dark:bg-violet-900/30 dark:text-violet-400">
                                                {i + 1}
                                            </div>
                                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                <span className="font-medium text-sm">{part.name}</span>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <PiListChecks className="w-3 h-3" />
                                                        {part._count.questions} {part._count.questions === 1 ? "question" : "questions"}
                                                    </span>
                                                    {part.duration_minutes && (
                                                        <span className="flex items-center gap-1">
                                                            <PiClock className="w-3 h-3" />
                                                            {part.duration_minutes} min
                                                        </span>
                                                    )}
                                                    {part.passing_score != null && part.passing_score > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <PiTrophy className="w-3 h-3" />
                                                            Pass: {part.passing_score}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <PiCheck className="w-4 h-4 text-violet-500 shrink-0 mt-1" />
                                        </div>
                                    ))}
                </div>
                            </div>
                        </div>

                        <div className="border-t bg-muted/30 px-6 py-5">
                            <div className="flex items-center gap-3">
                                <Badge variant="default" className="gap-1.5 px-4 py-2 text-sm shrink-0">
                                    <PiCheck /> In Your Collection
                                </Badge>
                                <div className="flex gap-2 ml-auto flex-wrap">
                                    <Button size="sm" onClick={handleStartTryout}>
                                        <PiPlay className="mr-1.5" />
                                        Start Tryout
                                    </Button>
                                    <Button size="sm" variant="secondary" onClick={handlePracticeMode}>
                                        <PiGameController className="mr-1.5" />
                                        Practice Mode
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    )
}

export default MyTryoutDetailModal
