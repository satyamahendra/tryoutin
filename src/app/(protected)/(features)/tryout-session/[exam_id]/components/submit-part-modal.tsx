"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogMedia,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {Loader2} from "lucide-react"
import {PiTimer, PiPaperPlaneTilt} from "react-icons/pi"
import {cn} from "@/lib/utils"

type SubmitPartModalProps = {
    open: boolean
    type: "time-up" | "submit"
    partName: string
    isLastPart: boolean
    isSubmitting: boolean
    answeredCount: number
    totalCount: number
    onConfirm: () => void
    onCancel: () => void
}

const SubmitPartModal = ({open, type, partName, isLastPart, isSubmitting, answeredCount, totalCount, onConfirm, onCancel}: SubmitPartModalProps) => {
    const isTimeUp = type === "time-up"

    return (
        <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogMedia
                        className={cn(
                            "size-12 rounded-xl ring-1 ring-inset",
                            isTimeUp
                                ? "bg-destructive/10 text-destructive ring-destructive/20"
                                : "bg-primary/10 text-primary ring-primary/20"
                        )}
                    >
                        {isTimeUp ? <PiTimer className="w-6 h-6" /> : <PiPaperPlaneTilt className="w-6 h-6" />}
                    </AlertDialogMedia>
                    <AlertDialogTitle className="text-lg">
                        {isTimeUp ? "Time's Up!" : "Submit Part"}
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="flex flex-col gap-2">
                            <p>
                                {isTimeUp
                                    ? `The time for "${partName}" has expired.`
                                    : `You are about to submit "${partName}".`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                You answered {answeredCount} of {totalCount} questions.
                                {answeredCount < totalCount && " Unanswered questions will be scored as 0."}
                            </p>
                            {!isLastPart && (
                                <p className="text-sm text-muted-foreground">
                                    {isTimeUp
                                        ? "Click continue to proceed to the next part."
                                        : "Once submitted, you cannot return to this part."}
                                </p>
                            )}
                            {isLastPart && (
                                <p className="text-sm font-medium text-primary">
                                    This is the last part. Submitting will complete your tryout.
                                </p>
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {!isTimeUp && <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>}
                    <AlertDialogAction onClick={onConfirm} disabled={isSubmitting} className="gap-2">
                        {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />}
                        {isSubmitting ? "Submitting..." : isLastPart ? "Complete Tryout" : "Continue"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default SubmitPartModal
