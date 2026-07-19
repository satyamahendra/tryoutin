"use client"

import {Button} from "@/components/ui/button"
import {useState, useTransition} from "react"
import {PiFileText, PiPlus} from "react-icons/pi"
import {useMutation} from "@tanstack/react-query"
import {createExam} from "../_services/create-exam"
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

const CreateExamButton = () => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, startTransition] = useTransition()

    const {mutate} = useMutation({
        mutationFn: createExam,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            startTransition(() => {
                router.push(`/exams/${res?.data?.id}`)
            })
        },
        onError: (error) => {
            toast.error(handleClientError(error))
        },
    })

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button color="primary">
                    <PiPlus /> Create exam
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to create a new exam?</AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter className="justify-center gap-2">
                    <AlertDialogCancel asChild>
                        <Button variant="outline">Cancel</Button>
                    </AlertDialogCancel>
                    <Button onClick={() => mutate()} disabled={isPending}>
                        {isPending ? <Loader2 className="animate-spin" /> : "Create"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default CreateExamButton
