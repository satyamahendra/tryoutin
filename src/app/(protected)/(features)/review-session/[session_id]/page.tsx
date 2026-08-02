"use client"

import {useParams, useRouter, useSearchParams} from "next/navigation"
import {useQuery} from "@tanstack/react-query"
import {useMemo, useState, useEffect} from "react"
import {Loader2, X, ArrowLeft} from "lucide-react"
import {PiCaretLeft, PiCaretRight, PiNotebook, PiCheckCircle} from "react-icons/pi"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {getReviewData} from "./_services/get-review-data"
import QuestionView from "../../tryout-session/[exam_id]/_components/question-view"
import NavigationSidebar from "../../tryout-session/[exam_id]/_components/navigation-sidebar"
import AnimDiv from "@/components/custom/anim-div"

const ReviewSessionPage = () => {
    const router = useRouter()
    const params = useParams()
    const searchParams = useSearchParams()
    const sessionId = params.session_id as string
    const partParam = searchParams.get("part")
    const questionParam = searchParams.get("question")

    const {
        data: reviewData,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["review", sessionId],
        queryFn: () => getReviewData(sessionId),
        enabled: !!sessionId,
    })

    const session = reviewData?.data
    const exam = session?.exam
    const parts = useMemo(() => exam?.parts || [], [exam])
    const answers = useMemo(() => session?.answers || [], [session])

    const [currentPartId, setCurrentPartId] = useState(partParam || "")
    const [currentQuestionId, setCurrentQuestionId] = useState(questionParam || "")

    useEffect(() => {
        if (parts.length > 0 && !currentPartId) {
            const first = parts[0]
            const firstQ = first.questions[0]
            setCurrentPartId(first.id)
            setCurrentQuestionId(firstQ?.id || "")
        }
    }, [parts, currentPartId])

    useEffect(() => {
        if (partParam) setCurrentPartId(partParam)
        if (questionParam) setCurrentQuestionId(questionParam)
    }, [partParam, questionParam])

    const currentPart = useMemo(() => parts.find((p) => p.id === currentPartId), [parts, currentPartId])
    const questions = useMemo(() => currentPart?.questions || [], [currentPart])
    const currentQuestion = useMemo(() => questions.find((q) => q.id === currentQuestionId), [questions, currentQuestionId])
    const currentIndex = useMemo(() => questions.findIndex((q) => q.id === currentQuestionId), [questions, currentQuestionId])

    const getSelectedOptionId = (questionId: string) => {
        return answers.find((a) => a.question_id === questionId)?.option_id || null
    }

    const handleNavigate = (partId: string, questionId: string) => {
        setCurrentPartId(partId)
        setCurrentQuestionId(questionId)
        router.replace(`/review-session/${sessionId}?part=${partId}&question=${questionId}`, {scroll: false})
    }

    const partNavData = useMemo(() => {
        return parts.map((p) => ({
            id: p.id,
            name: p.name,
            order_index: p.order_index,
            questionCount: p.questions.length,
        }))
    }, [parts])

    const questionNavMap = useMemo(() => {
        const map: Record<string, {id: string; order_index: number}[]> = {}
        for (const part of parts) {
            map[part.id] = part.questions.map((q) => ({id: q.id, order_index: q.order_index}))
        }
        return map
    }, [parts])

    const answeredQuestions = useMemo(() => {
        return new Set(answers.filter((a) => a.option_id).map((a) => a.question_id))
    }, [answers])

    const flaggedQuestions = useMemo(() => {
        return new Set(answers.filter((a) => a.is_flagged).map((a) => a.question_id))
    }, [answers])

    const totalQ = parts.reduce((sum, p) => sum + p.questions.length, 0)
    const answeredQ = answers.filter((a) => a.option_id).length
    const score = session?.total_score

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
                <p className="text-sm text-muted-foreground">Loading results...</p>
            </div>
        )
    }

    if (isError || !session) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-6">
                <div className="rounded-full bg-destructive/10 p-4">
                    <X className="w-8 h-8 text-destructive" />
                </div>
                <h2 className="text-lg font-semibold">Failed to Load Results</h2>
                <Button variant="outline" onClick={() => router.push("/my-sessions")}>
                    Back to My Sessions
                </Button>
            </div>
        )
    }

    return (
        <AnimDiv className="flex flex-col h-full">
            <header className="flex items-center gap-3 px-4 py-3 border-b shrink-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <PiNotebook className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="text-sm font-medium truncate">{exam?.title || "Review"}</span>
                    {currentPart && (
                        <>
                            <Separator orientation="vertical" className="h-4" />
                            <span className="text-xs text-muted-foreground truncate">{currentPart.name}</span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {score != null && (
                        <div className="flex items-center gap-1.5">
                            <PiCheckCircle className="w-4 h-4 text-primary" />
                            <span className="text-sm font-bold text-primary">{score}</span>
                            <span className="text-[10px] text-muted-foreground">pts</span>
                        </div>
                    )}
                    <Badge variant="secondary" className="text-xs shrink-0">
                        Review
                    </Badge>
                </div>
            </header>

            <div className="flex flex-1 min-h-0">
                <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                    <div className="flex-1 p-4 md:p-6">
                        {currentQuestion && (
                            <QuestionView
                                question={currentQuestion}
                                questionNumber={currentIndex + 1}
                                totalQuestions={questions.length}
                                selectedOptionId={getSelectedOptionId(currentQuestion.id)}
                                isFlagged={flaggedQuestions.has(currentQuestion.id)}
                                showResult={true}
                                onSelectOption={() => {}}
                                onToggleFlag={() => {}}
                            />
                        )}
                        {!currentQuestion && <div className="flex items-center justify-center h-full text-sm text-muted-foreground">No questions in this part.</div>}
                    </div>

                    <div className="flex items-center justify-between gap-2 px-4 md:px-6 py-3 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 shrink-0">
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    if (currentIndex > 0) handleNavigate(currentPartId, questions[currentIndex - 1].id)
                                }}
                                disabled={currentIndex <= 0}>
                                <PiCaretLeft className="w-4 h-4 mr-1" />
                                Previous
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    if (currentIndex < questions.length - 1) handleNavigate(currentPartId, questions[currentIndex + 1].id)
                                }}
                                disabled={currentIndex >= questions.length - 1}>
                                Next
                                <PiCaretRight className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                                {answeredQ}/{totalQ} answered
                            </span>
                            <Button size="sm" variant="outline" onClick={() => router.push("/my-sessions")}>
                                <ArrowLeft className="w-4 h-4 mr-1" />
                                Back
                            </Button>
                        </div>
                    </div>
                </div>

                <NavigationSidebar
                    parts={partNavData}
                    questionsByPart={questionNavMap}
                    currentPartId={currentPartId}
                    currentQuestionId={currentQuestionId}
                    answeredQuestions={answeredQuestions}
                    flaggedQuestions={flaggedQuestions}
                    mode="practice"
                    lockedParts={new Set()}
                    onNavigate={handleNavigate}
                />
            </div>
        </AnimDiv>
    )
}

export default ReviewSessionPage
