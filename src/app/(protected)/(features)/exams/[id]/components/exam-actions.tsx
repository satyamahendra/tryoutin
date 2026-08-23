"use client"

import {Button} from "@/components/ui/button"
import {useTransition} from "react"
import {PiArchive, PiArrowArcLeft, PiDownload, PiTrash} from "react-icons/pi"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {toggleArchiveExam} from "../services/toggle-archive-exam"
import {deleteExam} from "../services/delete-exam"
import {getExam} from "../services/get-exam"
import {buildExamValues} from "./exam-form"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {useRouter} from "next/navigation"
import {toast} from "sonner"
import {handleClientError} from "@/utils/helpers/handle-client-errors"
import {Loader2} from "lucide-react"
import {useState} from "react"

type ExamActionsProps = {
    id: string
    isActive: boolean
}

const ExamActions = ({id, isActive}: ExamActionsProps) => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [isExporting, setIsExporting] = useState(false)

    const handleExport = async () => {
        setIsExporting(true)
        try {
            const res = await getExam(id)
            if (!res.success) return toast.error(res.message)
            const blob = new Blob([JSON.stringify(buildExamValues(res.data), null, 2)], {type: "application/json"})
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = `${res.data.title || "exam"}.json`
            a.click()
            URL.revokeObjectURL(url)
            toast.success("Exam exported")
        } catch (error) {
            toast.error(handleClientError(error))
        } finally {
            setIsExporting(false)
        }
    }

    const {mutate: toggleArchive, isPending: isToggling} = useMutation({
        mutationFn: () => toggleArchiveExam(id),
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            startTransition(() => {
                queryClient.invalidateQueries({queryKey: ["exam", id]})
                queryClient.invalidateQueries({queryKey: ["exams"]})
            })
        },
        onError: (error) => {
            toast.error(handleClientError(error))
        },
    })

    const {mutate: deleteMutate, isPending: isDeleting} = useMutation({
        mutationFn: () => deleteExam(id),
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            startTransition(() => {
                queryClient.invalidateQueries({queryKey: ["exams"]})
                router.push("/exams")
            })
        },
        onError: (error) => {
            toast.error(handleClientError(error))
        },
    })

    const isLoading = isToggling || isDeleting || isPending || isExporting

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={isLoading}>
                {isExporting ? <Loader2 className="animate-spin" /> : <PiDownload />} Export
            </Button>

            <Button variant="outline" size="sm" onClick={() => toggleArchive()} disabled={isLoading}>
                {isToggling ? (
                    <Loader2 className="animate-spin" />
                ) : isActive ? (
                    <>
                        <PiArchive /> Archive
                    </>
                ) : (
                    <>
                        <PiArrowArcLeft /> Reactivate
                    </>
                )}
            </Button>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm" disabled={isLoading}>
                        <PiTrash /> Delete
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the exam and all its parts, questions, and options.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="justify-center gap-2">
                        <AlertDialogCancel asChild>
                            <Button variant="outline" disabled={isDeleting}>Cancel</Button>
                        </AlertDialogCancel>
                        <Button variant="destructive" onClick={() => deleteMutate()} disabled={isDeleting}>
                            {isDeleting ? <Loader2 className="animate-spin" /> : "Delete"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default ExamActions

