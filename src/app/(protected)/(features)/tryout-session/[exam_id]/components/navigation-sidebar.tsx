"use client"

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import {Drawer, DrawerContent, DrawerDescription, DrawerTitle} from "@/components/ui/drawer"
import {Button} from "@/components/ui/button"
import {cn} from "@/lib/utils"
import {PiGridFour, PiListChecks, PiLock, PiFlagFill} from "react-icons/pi"
import {useState} from "react"

type PartNav = {
    id: string
    name: string
    order_index: number
    questionCount: number
}

type QuestionNav = {
    id: string
    order_index: number
}

type NavigationSidebarProps = {
    parts: PartNav[]
    questionsByPart: Record<string, QuestionNav[]>
    currentPartId: string
    currentQuestionId: string
    answeredQuestions: Set<string>
    flaggedQuestions: Set<string>
    correctQuestions?: Set<string>
    mode: "simulation" | "practice"
    lockedParts: Set<string>
    onNavigate: (partId: string, questionId: string) => void
    submitPartLabel?: string
    onSubmitPart?: () => void
}

const DesktopSidebar = (props: NavigationSidebarProps) => {
    const {parts, questionsByPart, currentPartId, currentQuestionId, answeredQuestions, flaggedQuestions, correctQuestions, mode, lockedParts, onNavigate, submitPartLabel, onSubmitPart} = props

    return (
        <div className="w-64 shrink-0 border-l border-border/60 h-full overflow-y-auto p-3 hidden md:block">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-1">Questions</h3>
            <Accordion type="multiple" defaultValue={[currentPartId]}>
                {parts.map((part) => {
                    const isLocked = mode === "simulation" && lockedParts.has(part.id)
                    const questions = questionsByPart[part.id] || []
                    const answeredCount = questions.filter((q) => answeredQuestions.has(q.id)).length

                    return (
                        <AccordionItem key={part.id} value={part.id} className="border-b-0">
                            <AccordionTrigger
                                disabled={isLocked}
                                className={cn(
                                    "py-2 text-sm hover:no-underline",
                                    part.id === currentPartId && "text-primary font-medium",
                                    isLocked && "text-muted-foreground cursor-not-allowed",
                                )}>
                                <span className="flex items-center gap-2 text-xs">
                                    {isLocked ? <PiLock className="w-3 h-3" /> : <PiListChecks className="w-3 h-3" />}
                                    <span className="truncate">{part.name}</span>
                                    <span className="text-[10px] text-muted-foreground ml-auto">
                                        {answeredCount}/{questions.length}
                                    </span>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid grid-cols-5 gap-1.5 pt-1 p-0.5">
                                    {questions.map((q) => {
                                        const isCurrent = q.id === currentQuestionId
                                        const isAnswered = answeredQuestions.has(q.id)
                                        const isCorrect = correctQuestions?.has(q.id)
                                        const isFlagged = flaggedQuestions.has(q.id)
                                        const isClickable = !isLocked

                                        return (
                                            <button
                                                key={q.id}
                                                onClick={() => isClickable && onNavigate(part.id, q.id)}
                                                disabled={!isClickable}
                                                className={cn(
                                                    "relative flex items-center justify-center w-full aspect-square rounded-md text-xs font-medium transition-all",
                                                    isCurrent && "ring-2 ring-primary",
                                                    isCorrect
                                                        ? "bg-green-500 text-white"
                                                        : isAnswered
                                                          ? "bg-primary text-primary-foreground"
                                                          : "bg-muted text-muted-foreground hover:bg-muted/80",
                                                    !isClickable && "opacity-40 cursor-not-allowed",
                                                )}>
                                                {q.order_index + 1}
                                                {isFlagged && (
                                                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-white dark:bg-gray-900 shadow-sm">
                                                        <PiFlagFill className="w-3 h-3 text-amber-500" />
                                                    </span>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                                {part.id === currentPartId && onSubmitPart && (
                                    <Button size="sm" className="mt-3 w-full" onClick={onSubmitPart}>
                                        {submitPartLabel}
                                    </Button>
                                )}
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    )
}

const MobileDrawer = (props: NavigationSidebarProps) => {
    const {parts, questionsByPart, currentPartId, currentQuestionId, answeredQuestions, flaggedQuestions, correctQuestions, mode, lockedParts, onNavigate, submitPartLabel, onSubmitPart} = props
    const [open, setOpen] = useState(false)

    const handleNavigate = (partId: string, questionId: string) => {
        onNavigate(partId, questionId)
        setOpen(false)
    }

    return (
        <div className="md:hidden">
            <button
                onClick={() => setOpen(true)}
                className="fixed right-3 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all">
                <PiGridFour className="w-5 h-5" />
            </button>
            <Drawer swipeDirection="right" open={open} onOpenChange={setOpen}>
                <DrawerContent className="w-[280px]">
                    <div className="flex flex-col h-full">
                        <div className="px-4 py-4 border-b">
                            <DrawerTitle className="text-sm font-semibold">Questions</DrawerTitle>
                            <DrawerDescription className="text-xs text-muted-foreground">
                                {answeredQuestions.size} of {Object.values(questionsByPart).flat().length} answered
                            </DrawerDescription>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3">
                            <Accordion type="multiple" defaultValue={[currentPartId]}>
                                {parts.map((part) => {
                                    const isLocked = mode === "simulation" && lockedParts.has(part.id)
                                    const questions = questionsByPart[part.id] || []

                                    return (
                                        <AccordionItem key={part.id} value={part.id} className="border-b-0">
                                            <AccordionTrigger
                                                disabled={isLocked}
                                                className={cn(
                                                    "py-2 text-sm hover:no-underline",
                                                    part.id === currentPartId && "text-primary font-medium",
                                                    isLocked && "text-muted-foreground cursor-not-allowed",
                                                )}>
                                                <span className="flex items-center gap-2 text-xs">
                                                    {isLocked ? <PiLock className="w-3 h-3" /> : <PiListChecks className="w-3 h-3" />}
                                                    <span className="truncate">{part.name}</span>
                                                </span>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="grid grid-cols-5 gap-1.5 pt-1 p-0.5">
                                                    {questions.map((q) => {
                                                        const isCurrent = q.id === currentQuestionId
                                                        const isAnswered = answeredQuestions.has(q.id)
                                                        const isCorrect = correctQuestions?.has(q.id)
                                                        const isFlagged = flaggedQuestions.has(q.id)
                                                        const isClickable = !isLocked

                                                        return (
                                                            <button
                                                                key={q.id}
                                                                onClick={() => isClickable && handleNavigate(part.id, q.id)}
                                                                disabled={!isClickable}
                                                                className={cn(
                                                                    "relative flex items-center justify-center w-full aspect-square rounded-md text-xs font-medium transition-all",
                                                                    isCurrent && "ring-2 ring-primary",
                                                                    isCorrect
                                                                        ? "bg-green-500 text-white"
                                                                        : isAnswered
                                                                          ? "bg-primary text-primary-foreground"
                                                                          : "bg-muted text-muted-foreground hover:bg-muted/80",
                                                                    !isClickable && "opacity-40 cursor-not-allowed",
                                                                )}>
                                                                {q.order_index + 1}
                                                                {isFlagged && (
                                                                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center w-4 h-4 rounded-full bg-white dark:bg-gray-900 shadow-sm">
                                                                        <PiFlagFill className="w-3 h-3 text-amber-500" />
                                                                    </span>
                                                                )}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                                {part.id === currentPartId && onSubmitPart && (
                                                    <Button size="sm" className="mt-3 w-full" onClick={onSubmitPart}>
                                                        {submitPartLabel}
                                                    </Button>
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

const NavigationSidebar = (props: NavigationSidebarProps) => {
    return (
        <>
            <DesktopSidebar {...props} />
            <MobileDrawer {...props} />
        </>
    )
}

export default NavigationSidebar
