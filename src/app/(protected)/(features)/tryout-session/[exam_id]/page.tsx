"use client"

import {useParams, useRouter, useSearchParams} from "next/navigation"
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query"
import {useCallback, useEffect, useMemo, useRef, useState} from "react"
import {Loader2, CheckCircle, X} from "lucide-react"
import {PiNotebook, PiCaretLeft, PiCaretRight, PiListChecks, PiPlay} from "react-icons/pi"
import {toast} from "sonner"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {getSession} from "./services/get-session"
import {startSession} from "./services/start-session"
import {saveAnswer} from "./services/save-answer"
import {submitPart} from "./services/submit-part"
import TimerDisplay from "./components/timer-display"
import QuestionView from "./components/question-view"
import NavigationSidebar from "./components/navigation-sidebar"
import SubmitPartModal from "./components/submit-part-modal"
import AnimDiv from "@/components/custom/anim-div"

type PageState = "initializing" | "ready" | "submitting" | "completed" | "error"

const TryoutSessionPage = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const params = useParams()
    const searchParams = useSearchParams()
    const examId = params.exam_id as string
    const sessionId = searchParams.get("session")
    const partParam = searchParams.get("part")
    const questionParam = searchParams.get("question")
    const mode = (searchParams.get("mode") as "simulation" | "practice") || "simulation"

    const [pageState, setPageState] = useState<PageState>("initializing")
    const [answers, setAnswers] = useState<Record<string, string[]>>({})
    const [answerTexts, setAnswerTexts] = useState<Record<string, string>>({})
    const [flagged, setFlagged] = useState<Set<string>>(new Set())
    const [modalState, setModalState] = useState<{type: "time-up" | "submit"; partId: string} | null>(null)
    const [errorMsg, setErrorMsg] = useState("")
    const timerExpiredRef = useRef(false)
    const essaySaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const sessionQuery = useQuery({
        queryKey: ["session", sessionId],
        queryFn: () => getSession(sessionId!),
        enabled: !!sessionId,
    })

    const saveAnswerMut = useMutation({
        mutationFn: saveAnswer,
        onError: () => toast.error("Failed to save answer"),
    })

    const submitPartMut = useMutation({
        mutationFn: (data: {sessionId: string; partId: string; expired?: boolean}) =>
            submitPart(data.sessionId, data.partId, data.expired),
        onSuccess: (result) => {
            if (result.success) {
                if (result.data.completed) {
                    setPageState("completed")
                } else if (result.data.nextPartId && result.data.nextPartQuestionId) {
                    const {nextPartId} = result.data
                    queryClient.setQueryData<Awaited<ReturnType<typeof getSession>>>(["session", sessionId], (old) => {
                        if (!old?.success) return old
                        const now = new Date()
                        return {
                            ...old,
                            data: {
                                ...old.data,
                                part_sessions: old.data.part_sessions.map((ps) => {
                                    if (ps.part_id === currentPartId) return {...ps, status: "completed", submitted_at: now}
                                    if (ps.part_id === nextPartId) {
                                        const dur = old.data.exam.parts.find((p) => p.id === nextPartId)?.duration_minutes
                                        return {
                                            ...ps,
                                            status: "in_progress",
                                            started_at: now,
                                            ends_at: dur ? new Date(now.getTime() + dur * 60000) : null,
                                        }
                                    }
                                    return ps
                                }),
                            },
                        }
                    })
                    const url = `/tryout-session/${examId}?session=${sessionId}&part=${nextPartId}&question=${result.data.nextPartQuestionId}&mode=${mode}`
                    router.replace(url)
                    setPageState("ready")
                }
            } else {
                toast.error(result.message)
            }
        },
        onError: () => toast.error("Failed to submit part"),
    })

    const examData = useMemo(() => sessionQuery.data?.data?.exam, [sessionQuery.data])
    const partSessions = useMemo(() => sessionQuery.data?.data?.part_sessions || [], [sessionQuery.data])

    const parts = useMemo(() => examData?.parts || [], [examData])
    const activePartSession = mode === "simulation" ? partSessions.find((ps) => ps.status === "in_progress") : undefined
    const currentPartId = mode !== "simulation" ? partParam || parts[0]?.id || "" : activePartSession?.part_id || parts[0]?.id || ""
    const currentPart = useMemo(() => parts.find((p) => p.id === currentPartId), [parts, currentPartId])
    const questions = useMemo(() => currentPart?.questions || [], [currentPart])
    const currentQuestionId = useMemo(() => questionParam || questions[0]?.id || "", [questionParam, questions])
    const currentQuestion = useMemo(() => questions.find((q) => q.id === currentQuestionId), [questions, currentQuestionId])
    const currentQuestionIndex = useMemo(() => questions.findIndex((q) => q.id === currentQuestionId), [questions, currentQuestionId])

    const answeredCount = useMemo(
        () =>
            questions.filter((q) => {
                if ((answers[q.id]?.length ?? 0) > 0) return true
                return q.type === "essay" && (answerTexts[q.id] || "").trim().length > 0
            }).length,
        [questions, answers, answerTexts],
    )

    const isLastPart = useMemo(() => {
        const idx = parts.findIndex((p) => p.id === currentPartId)
        return idx === parts.length - 1
    }, [parts, currentPartId])

    const isLastQuestion = useMemo(() => currentQuestionIndex === questions.length - 1, [currentQuestionIndex, questions.length])

    const submitPartLabel = isLastPart ? "Complete Test" : isLastQuestion ? "Finish Part" : "Submit Part"

    const lockedParts = useMemo(() => {
        if (mode !== "simulation") return new Set<string>()
        const locked = new Set<string>()
        for (const p of parts) {
            if (p.id !== currentPartId) locked.add(p.id)
        }
        return locked
    }, [mode, parts, currentPartId])

    const currentPartSession = useMemo(() => {
        if (mode !== "simulation") return null
        return partSessions.find((ps) => ps.part_id === currentPartId) || null
    }, [mode, partSessions, currentPartId])

    const endsAt = useMemo(() => {
        if (mode !== "simulation") return null
        return currentPartSession?.ends_at?.toISOString() || null
    }, [mode, currentPartSession])

    const questionNavMap = useMemo(() => {
        const map: Record<string, {id: string; order_index: number}[]> = {}
        for (const part of parts) {
            map[part.id] = part.questions.map((q) => ({id: q.id, order_index: q.order_index}))
        }
        return map
    }, [parts])

    const partNavData = useMemo(() => {
        return parts.map((p) => ({
            id: p.id,
            name: p.name,
            order_index: p.order_index,
            questionCount: p.questions.length,
        }))
    }, [parts])

    useEffect(() => {
        if (sessionQuery.data?.success) {
            if (mode === "simulation" && sessionQuery.data.data.status === "completed") {
                setPageState("completed")
                return
            }
            const sessionAnswers = sessionQuery.data.data.answers
            const ans: Record<string, string[]> = {}
            const essay: Record<string, string> = {}
            const flg = new Set<string>()
            for (const a of sessionAnswers) {
                if (a.option_id) ans[a.question_id] = [...(ans[a.question_id] || []), a.option_id]
                if (a.answer_text) essay[a.question_id] = a.answer_text
                if (a.is_flagged) flg.add(a.question_id)
            }
            setAnswers(ans)
            setAnswerTexts(essay)
            setFlagged(flg)
            setPageState("ready")
        }
    }, [sessionQuery.data, mode])

    useEffect(() => {
        if (!sessionId && !sessionQuery.isLoading) {
            const initSession = async () => {
                try {
                    const result = await startSession(examId, undefined, mode)
                    if (result.success) {
                        const ps = result.data.part_sessions
                        const activePart = ps.find((p) => p.status === "in_progress") || ps[0]
                        const firstQ = activePart?.part.questions[0]
                        if (activePart && firstQ) {
                            router.replace(
                                `/tryout-session/${examId}?session=${result.data.id}&part=${activePart.part.id}&question=${firstQ.id}&mode=${mode}`,
                            )
                        } else {
                            setErrorMsg("Failed to initialize session")
                            setPageState("error")
                        }
                    } else {
                        setErrorMsg(result.message)
                        setPageState("error")
                    }
                } catch {
                    setErrorMsg("An unexpected error occurred")
                    setPageState("error")
                }
            }
            initSession()
        }
    }, [sessionId, sessionQuery.isLoading, examId, mode, router])

    const handleSelectOption = useCallback(
        (questionId: string, optionId: string) => {
            const question = questions.find((q) => q.id === questionId)
            const current = answers[questionId] || []
            let next: string[]
            if (question?.type === "multiple_choice") {
                next = current.includes(optionId) ? current.filter((o) => o !== optionId) : [...current, optionId]
            } else {
                next = [optionId]
            }
            setAnswers((prev) => ({...prev, [questionId]: next}))
            if (sessionId) {
                saveAnswerMut.mutate({sessionId, questionId, optionIds: next})
            }
        },
        [questions, answers, sessionId, saveAnswerMut],
    )

    const handleEssayChange = useCallback(
        (questionId: string, text: string) => {
            setAnswerTexts((prev) => ({...prev, [questionId]: text}))
            if (!sessionId) return
            if (essaySaveTimer.current) clearTimeout(essaySaveTimer.current)
            essaySaveTimer.current = setTimeout(() => {
                saveAnswerMut.mutate({sessionId, questionId, optionIds: [], answerText: text})
            }, 600)
        },
        [sessionId, saveAnswerMut],
    )

    const handleEssayBlur = useCallback(
        (questionId: string, text: string) => {
            if (!sessionId) return
            if (essaySaveTimer.current) {
                clearTimeout(essaySaveTimer.current)
                essaySaveTimer.current = null
            }
            saveAnswerMut.mutate({sessionId, questionId, optionIds: [], answerText: text})
        },
        [sessionId, saveAnswerMut],
    )

    const handleToggleFlag = useCallback((questionId: string) => {
        setFlagged((prev) => {
            const next = new Set(prev)
            if (next.has(questionId)) next.delete(questionId)
            else next.add(questionId)
            return next
        })
    }, [])

    const handleNavigate = useCallback(
        (partId: string, questionId: string) => {
            const isLocked = mode === "simulation" && lockedParts.has(partId)
            if (isLocked) return
            router.replace(`/tryout-session/${examId}?session=${sessionId}&part=${partId}&question=${questionId}&mode=${mode}`, {scroll: false})
        },
        [mode, lockedParts, examId, sessionId, router],
    )

    const handlePrevQuestion = useCallback(() => {
        if (currentQuestionIndex > 0) {
            const prev = questions[currentQuestionIndex - 1]
            handleNavigate(currentPartId, prev.id)
        }
    }, [currentQuestionIndex, questions, handleNavigate, currentPartId])

    const handleNextQuestion = useCallback(() => {
        if (currentQuestionIndex < questions.length - 1) {
            const next = questions[currentQuestionIndex + 1]
            handleNavigate(currentPartId, next.id)
        }
    }, [currentQuestionIndex, questions, handleNavigate, currentPartId])

    const handleRequestSubmit = useCallback(() => {
        setModalState({type: "submit", partId: currentPartId})
    }, [currentPartId])

    const handleCancelSubmit = useCallback(() => {
        setModalState(null)
    }, [])

    const handleConfirmSubmit = useCallback(() => {
        if (!modalState) return
        setModalState(null)
        if (sessionId) {
            setPageState("submitting")
            submitPartMut.mutate({
                sessionId,
                partId: modalState.partId,
                expired: modalState.type === "time-up",
            })
        }
    }, [modalState, sessionId, submitPartMut])

    const handleTimeUp = useCallback(() => {
        if (timerExpiredRef.current) return
        timerExpiredRef.current = true
        setModalState({type: "time-up", partId: currentPartId})
    }, [currentPartId])

    if (pageState === "initializing") {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
                <p className="text-sm text-muted-foreground">Preparing your tryout...</p>
            </div>
        )
    }

    if (pageState === "error") {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
                <div className="rounded-full bg-destructive/10 p-4">
                    <X className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-lg font-semibold">Something Went Wrong</h2>
                <p className="text-sm text-muted-foreground text-center max-w-md">{errorMsg}</p>
                <Button variant="outline" onClick={() => router.push("/my-tryouts")}>
                    Back to My Tryouts
                </Button>
            </div>
        )
    }

    if (pageState === "completed") {
        const totalQ = parts.reduce((sum, p) => sum + p.questions.length, 0)
        const answeredQ = Object.values(answers).filter((a) => a.length > 0).length
        const score = sessionQuery.data?.data?.total_score
        const scaledScore = sessionQuery.data?.data?.scaled_score
        return (
            <div className="flex flex-col items-center justify-center h-full gap-6 px-6">
                <div className="rounded-full bg-primary/10 p-4">
                    <CheckCircle className="w-10 h-10 text-primary" />
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-bold">Tryout Complete!</h2>
                    {score != null && (
                        <div className="mt-3 flex items-center justify-center gap-3">
                            <div>
                                <span className="text-4xl font-bold text-primary">{score}</span>
                                <span className="text-sm text-muted-foreground ml-1">points</span>
                            </div>
                            {scaledScore != null && (
                                <>
                                    <span className="text-2xl text-muted-foreground">+</span>
                                    <div>
                                        <span className="text-2xl font-semibold text-primary/80">{scaledScore}</span>
                                        <span className="text-xs text-muted-foreground ml-1">scaled</span>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                        You answered {answeredQ} of {totalQ} questions.
                    </p>
                </div>
                <div className="flex gap-2 flex-wrap justify-center">
                    {sessionId && (
                        <>
                            <Button variant="outline" onClick={() => router.push(`/review-session/${sessionId}`)}>
                                <CheckCircle className="mr-1.5 w-4 h-4" />
                                Review Results
                            </Button>
                            <Button variant="outline" onClick={() => router.push("/my-tryouts")}>
                                Back to My Tryouts
                            </Button>
                        </>
                    )}
                    <Button onClick={() => router.push(`/tryout-session/${examId}?mode=${mode === "practice" ? "practice" : "practice"}`)}>
                        <PiPlay className="mr-1.5" />
                        Practice Mode
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center gap-3 px-4 py-3 border-b shrink-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <PiNotebook className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium truncate">{examData?.title || "Tryout"}</span>
                    {currentPart && (
                        <>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="text-xs text-muted-foreground truncate">{currentPart.name}</span>
                        </>
                    )}
                </div>
                {mode === "simulation" && <TimerDisplay endsAt={endsAt} onExpire={handleTimeUp} />}
                <Badge variant="secondary" className="text-xs shrink-0">
                    {mode === "simulation" ? "Simulation" : "Practice"}
                </Badge>
            </header>

            <div className="flex flex-1 min-h-0">
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                    <div className="flex-1 p-4 md:p-6 flex flex-col gap-4">
                        {currentQuestion && (
                            <AnimDiv key={currentQuestion.id} className="flex-1 min-h-0">
                                <QuestionView
                                    question={currentQuestion}
                                    questionNumber={currentQuestionIndex + 1}
                                    totalQuestions={questions.length}
                                    selectedOptionIds={answers[currentQuestion.id] || []}
                                    answerText={answerTexts[currentQuestion.id] || ""}
                                    isFlagged={flagged.has(currentQuestion.id)}
                                    mode={mode}
                                    onSelectOption={handleSelectOption}
                                    onToggleFlag={handleToggleFlag}
                                    onAnswerTextChange={handleEssayChange}
                                    onAnswerTextBlur={handleEssayBlur}
                                />
                            </AnimDiv>
                        )}
                        {!currentQuestion && (
                            <div className="flex items-center justify-center flex-1 text-sm text-muted-foreground">
                                No questions in this part.
                            </div>
                        )}
                        {currentQuestion && (
                            <div className="flex items-center justify-between gap-2 shrink-0">
                                <span className="text-xs text-muted-foreground">
                                    <PiListChecks className="w-3 h-3 inline mr-1" />
                                    {answeredCount}/{questions.length}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-end gap-2 px-4 md:px-6 py-3 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shrink-0">
                        <Button size="sm" variant="outline" onClick={handlePrevQuestion} disabled={currentQuestionIndex <= 0}>
                            <PiCaretLeft className="w-4 h-4 mr-1" />
                            Previous
                        </Button>
                        {isLastQuestion ? (
                            <Button size="sm" onClick={handleRequestSubmit}>
                                {isLastPart ? "Finish Tryout" : "Submit & Continue"}
                            </Button>
                        ) : (
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleNextQuestion}
                                disabled={currentQuestionIndex >= questions.length - 1}>
                                Next
                                <PiCaretRight className="w-4 h-4 ml-1" />
                            </Button>
                        )}
                    </div>
                </div>

                <NavigationSidebar
                    parts={partNavData}
                    questionsByPart={questionNavMap}
                    currentPartId={currentPartId}
                    currentQuestionId={currentQuestionId}
                    answeredQuestions={new Set([
                        ...Object.entries(answers).filter(([, v]) => v.length > 0).map(([k]) => k),
                        ...Object.entries(answerTexts).filter(([, v]) => v.trim().length > 0).map(([k]) => k),
                    ])}
                    flaggedQuestions={flagged}
                    mode={mode}
                    lockedParts={lockedParts}
                    onNavigate={handleNavigate}
                    submitPartLabel={submitPartLabel}
                    onSubmitPart={handleRequestSubmit}
                />
            </div>

            <SubmitPartModal
                open={!!modalState}
                type={modalState?.type || "submit"}
                partName={currentPart?.name || ""}
                isLastPart={isLastPart}
                isSubmitting={pageState === "submitting"}
                answeredCount={answeredCount}
                totalCount={questions.length}
                onConfirm={handleConfirmSubmit}
                onCancel={handleCancelSubmit}
            />
        </div>
    )
}

export default TryoutSessionPage

