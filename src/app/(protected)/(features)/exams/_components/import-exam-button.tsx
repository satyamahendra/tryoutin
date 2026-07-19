"use client"

import {Button} from "@/components/ui/button"
import {useState, useRef} from "react"
import {PiFileArrowUp} from "react-icons/pi"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {upsertExam} from "../[id]/_services/upsert-exam"
import {examSchema, type ExamSchema} from "../[id]/_utils/schema"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {useRouter} from "next/navigation"
import {toast} from "sonner"
import {handleClientError} from "@/utils/helpers/handle-client-errors"
import {Loader2} from "lucide-react"

const ImportExamButton = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [fileName, setFileName] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const {mutate, isPending} = useMutation({
        mutationFn: upsertExam,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            setIsOpen(false)
            setFileName(null)
            queryClient.invalidateQueries({queryKey: ["exams"]})
            router.push(`/exams/${res.data.id}`)
        },
        onError: (error) => {
            toast.error(handleClientError(error))
        },
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.name.endsWith(".json")) {
            toast.error("Please select a JSON file")
            return
        }

        setFileName(file.name)

        const reader = new FileReader()
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result as string)
                const data = examSchema.parse({...parsed, id: ""})
                mutate(data)
            } catch (err) {
                if (err instanceof Error) {
                    toast.error(err.message)
                } else {
                    toast.error("Invalid JSON format")
                }
            }
        }
        reader.readAsText(file)
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open)
                if (!open) {
                    setFileName(null)
                    if (fileInputRef.current) fileInputRef.current.value = ""
                }
            }}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PiFileArrowUp /> Import
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import Exam</DialogTitle>
                    <DialogDescription>Select a JSON file formatted like the upsert-exam schema.</DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3">
                    <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" id="exam-file-input" />
                    <label
                        htmlFor="exam-file-input"
                        className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border p-8 text-center cursor-pointer transition-colors hover:bg-muted/50">
                        <PiFileArrowUp className="size-8 text-muted-foreground" />
                        {fileName ? (
                            <span className="text-sm font-medium">{fileName}</span>
                        ) : (
                            <span className="text-sm text-muted-foreground">Click to select a JSON file</span>
                        )}
                    </label>
                </div>

                <DialogFooter>
                    {isPending && (
                        <span className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="animate-spin size-4" /> Importing...
                        </span>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ImportExamButton
