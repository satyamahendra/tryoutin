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
                        {isTimeUp ? "Waktu Habis!" : "Kumpulkan Bagian"}
                    </AlertDialogTitle>
                    <AlertDialogDescription asChild>
                        <div className="flex flex-col gap-2">
                            <p>
                                {isTimeUp
                                    ? `Waktu untuk "${partName}" telah habis.`
                                    : `Kamu akan mengumpulkan "${partName}".`}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Kamu menjawab {answeredCount} dari {totalCount} soal.
                                {answeredCount < totalCount && " Soal yang tidak dijawab akan dinilai 0."}
                            </p>
                            {!isLastPart && (
                                <p className="text-sm text-muted-foreground">
                                    {isTimeUp
                                        ? "Klik lanjut untuk melanjutkan ke bagian berikutnya."
                                        : "Setelah dikumpulkan, kamu tidak dapat kembali ke bagian ini."}
                                </p>
                            )}
                            {isLastPart && (
                                <p className="text-sm font-medium text-primary">
                                    Ini bagian terakhir. Mengumpulkan akan menyelesaikan tryoutmu.
                                </p>
                            )}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    {!isTimeUp && <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>}
                    <AlertDialogAction onClick={onConfirm} disabled={isSubmitting} className="gap-2">
                        {isSubmitting && <Loader2 className="animate-spin w-4 h-4" />}
                        {isSubmitting ? "Mengumpulkan..." : isLastPart ? "Selesaikan Tryout" : "Lanjutkan"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default SubmitPartModal
