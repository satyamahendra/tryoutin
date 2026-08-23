"use client"

import {cn} from "@/lib/utils"
import {PiFlag, PiFlagFill, PiLightbulb, PiCheck} from "react-icons/pi"
import {Badge} from "@/components/ui/badge"
import {useState} from "react"

type Option = {
    id: string
    option_text: string | null
    option_image: string | null
    score: number
    is_correct: boolean
    order_index: number
}

type Question = {
    id: string
    type: string
    question_text: string
    question_image: string | null
    explanation: string | null
    order_index: number
    options: Option[]
}

type QuestionViewProps = {
    question: Question
    questionNumber: number
    totalQuestions: number
    selectedOptionIds: string[]
    isFlagged: boolean
    mode?: "simulation" | "practice"
    showResult?: boolean
    onSelectOption: (questionId: string, optionId: string) => void
    onToggleFlag: (questionId: string) => void
}

const typeLabel: Record<string, {label: string; color: string}> = {
    single_choice: {label: "Single Choice", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"},
    scaled_choice: {label: "Scaled Choice", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"},
    multiple_choice: {label: "Multiple Choice", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"},
}

const QuestionView = ({question, questionNumber, totalQuestions, selectedOptionIds, isFlagged, mode, showResult, onSelectOption, onToggleFlag}: QuestionViewProps) => {
    const info = typeLabel[question.type] || {label: question.type, color: "bg-muted text-muted-foreground"}
    const [showHint, setShowHint] = useState(false)

    const isPractice = mode === "practice"
    const isMultiple = question.type === "multiple_choice"

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                            Question {questionNumber} of {totalQuestions}
                        </span>
                        <Badge className={cn("text-[10px] font-normal px-1.5 py-0", info.color)}>{info.label}</Badge>
                    </div>
                    <p className="text-base leading-relaxed">{question.question_text}</p>
                    {isMultiple && !showResult && (
                        <span className="text-xs text-muted-foreground">Select all that apply.</span>
                    )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                    {isPractice && question.explanation && (
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className={cn(
                                "p-1.5 rounded-md transition-colors",
                                showHint ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30" : "text-muted-foreground hover:text-amber-500 hover:bg-amber-50/50 dark:hover:bg-amber-950/20",
                            )}
                            title={showHint ? "Hide hint" : "Show hint"}>
                            <PiLightbulb className={cn("w-4 h-4", showHint && "fill-amber-500")} />
                        </button>
                    )}
                    <button
                        onClick={() => onToggleFlag(question.id)}
                        className={cn(
                            "p-1.5 rounded-md transition-colors",
                            isFlagged ? "text-amber-500 hover:text-amber-600" : "text-muted-foreground hover:text-foreground",
                        )}
                        title={isFlagged ? "Unflag" : "Flag for review"}>
                        {isFlagged ? <PiFlagFill className="w-4 h-4" /> : <PiFlag className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {question.question_image && (
                <div className="rounded-lg border bg-muted/30 p-3 flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={question.question_image} alt="Question" className="max-w-full max-h-64 object-contain rounded" />
                </div>
            )}

            <div className="flex flex-col gap-2">
                {question.options.map((option) => {
                    const isSelected = selectedOptionIds.includes(option.id)
                    const isCorrect = option.is_correct
                    const showAsCorrect = showResult && isCorrect
                    const showAsWrong = showResult && isSelected && !isCorrect

                    return (
                        <button
                            key={option.id}
                            onClick={() => !showResult && onSelectOption(question.id, option.id)}
                            disabled={showResult}
                            className={cn(
                                "flex items-start gap-3 rounded-xl border p-4 text-left transition-all",
                                !showResult && isSelected && "border-primary bg-primary/5 ring-1 ring-primary",
                                !showResult && !isSelected && "border-border bg-card hover:bg-muted/50 hover:border-primary/30",
                                showAsCorrect && "border-green-500 bg-green-50 dark:bg-green-950/20 ring-1 ring-green-500",
                                showAsWrong && "border-red-500 bg-red-50 dark:bg-red-950/20 ring-1 ring-red-500",
                                showResult && !isSelected && !isCorrect && "border-border opacity-70",
                            )}>
                            <div
                                className={cn(
                                    "flex items-center justify-center w-5 h-5 border-2 shrink-0 mt-0.5 transition-colors",
                                    isMultiple ? "rounded" : "rounded-full",
                                    isSelected && !showResult && "border-primary bg-primary",
                                    showAsCorrect && "border-green-500 bg-green-500",
                                    showAsWrong && "border-red-500 bg-red-500",
                                    !isSelected && !showResult && "border-muted-foreground/40",
                                    showResult && !isSelected && !isCorrect && "border-muted-foreground/20",
                                )}>
                                {isMultiple ? (
                                    (isSelected || showAsCorrect) && <PiCheck className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                                ) : (
                                    (isSelected || showAsCorrect) && <div className="w-2 h-2 rounded-full bg-white" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <span className="text-sm leading-relaxed">{option.option_text}</span>
                                {option.option_image && (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={option.option_image} alt="Option" className="mt-2 max-w-full max-h-32 object-contain rounded" />
                                    </>
                                )}
                                {question.type === "scaled_choice" && (
                                    <span className="block text-[10px] text-muted-foreground mt-1">Score: {option.score}</span>
                                )}
                                {showResult && isCorrect && (
                                    <span className="block text-[10px] font-medium text-green-600 dark:text-green-400 mt-1">Correct answer</span>
                                )}
                                {showAsWrong && (
                                    <span className="block text-[10px] font-medium text-red-600 dark:text-red-400 mt-1">Your answer</span>
                                )}
                            </div>
                        </button>
                    )
                })}
            </div>

            {(showHint || showResult) && question.explanation && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
                        <PiLightbulb className="w-3.5 h-3.5" />
                        Explanation
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{question.explanation}</p>
                </div>
            )}
        </div>
    )
}

export default QuestionView
