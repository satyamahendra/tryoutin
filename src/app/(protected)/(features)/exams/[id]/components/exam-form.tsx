"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {examSchema, type ExamSchema} from "../utils/schema"
import ExamGeneralForm from "./exam-general-form"
import {makeExam} from "../utils/initials"
import {Button} from "@/components/ui/button"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {getExam} from "../services/get-exam"
import {upsertExam} from "../services/upsert-exam"
import {toast} from "sonner"
import {Loader2} from "lucide-react"
import {useEffect, useTransition, useState} from "react"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {PiX} from "react-icons/pi"
import {handleClientError} from "@/utils/helpers/handle-client-errors"
import type {GetExam} from "../services/get-exam"

type ExamFormTypes = {
    id: string
}

// ponytail: flatten nested RHF errors into readable messages for a submit-time banner
const collectErrors = (obj: unknown, path: string[] = [], out: string[] = []): string[] => {
    if (!obj || typeof obj !== "object") return out
    const node = obj as Record<string, unknown>
    const message = (node.root as {message?: string} | undefined)?.message ?? (typeof node.message === "string" ? node.message : undefined)
    if (message) out.push(message)
    for (const key of Object.keys(node)) {
        if (key === "root" || key === "message" || key === "ref" || key === "type") continue
        const child = node[key]
        if (child && typeof child === "object") collectErrors(child, [...path, key], out)
    }
    return out
}

// Map a loaded exam into the form's flat structure (avoids `values` controlled mode,
// which drops never-mounted/collapsed fields to `undefined` at submit time).
// Exported so the export button can reuse the exact Import-compatible shape.
export const buildExamValues = (e: GetExam): ExamSchema => ({
    id: e.id ?? null,
    title: e.title ?? "",
    description: e.description ?? null,
    category: e.category ?? "",
    product_id: e.product_id ? {value: e.product_id, label: e.product?.name ?? ""} : null,
    tags: e.tags?.map((t) => ({value: t.tag.id, label: t.tag.name})) ?? [],
    parts: e.parts?.map((p) => ({
        id: p.id || null,
        name: p.name ?? "",
        order_index: p.order_index ?? null,
        passing_score: p.passing_score ?? 0,
        duration_minutes: p.duration_minutes ?? 0,
        questions:
            p.questions?.map((q) => ({
                id: q.id || null,
                type: q.type ?? null,
                question_text: q.question_text ?? "",
                question_image: q.question_image ?? null,
                explanation: q.explanation ?? null,
                explanation_image: null,
                order_index: q.order_index ?? null,
                options:
                    q.options?.map((o, i) => ({
                        id: o.id || null,
                        option_text: o.option_text ?? "",
                        option_image: o.option_image ?? null,
                        score: o.score ?? 0,
                        is_correct: o.is_correct ?? null,
                        order_index: o.order_index ?? i,
                    })) ?? [],
            })) ?? [],
    })) ?? [makeExam().parts[0]],
})

const ExamForm = ({id}: ExamFormTypes) => {
    const isNew = id === "new"
    const queryClient = useQueryClient()
    const [isPending, startTransition] = useTransition()
    const [showErrors, setShowErrors] = useState(false)

    const {
        data: examData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["exam", id],
        queryFn: () => getExam(id),
        enabled: !isNew,
    })

    const exam = examData?.data

    const form = useForm<ExamSchema>({
        resolver: zodResolver(examSchema),
        defaultValues: makeExam(),
    })

    useEffect(() => {
        if (exam) form.reset(buildExamValues(exam))
    }, [exam, form])

    const {errors: formErrors} = form.formState

    const {mutate, isPending: isMutating} = useMutation({
        mutationFn: upsertExam,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            startTransition(() => {
                queryClient.invalidateQueries({queryKey: ["exams"]})
            })
        },
        onError: (error) => {
            toast.error(handleClientError(error))
        },
    })

    const onSubmit = (data: ExamSchema) => {
        mutate(data)
    }

    const onInvalid = () => {
        setShowErrors(true)
        const messages = collectErrors(formErrors)
        if (messages.length) toast.error(`Please fix ${messages.length} issue${messages.length === 1 ? "" : "s"} before saving.`)
    }

    if (!isNew && isLoading) {
        return (
            <div className="flex items-center justify-center h-40">
                <Loader2 className="animate-spin w-6 h-6 text-primary" />
            </div>
        )
    }

    if (!isNew && error) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PiX />
                    </EmptyMedia>
                    <EmptyTitle>Failed to fetch exam</EmptyTitle>
                    <EmptyDescription>{error.message || "Please try again."}</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <form id="exam-form" onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="flex flex-col gap-6 pb-8">
            {showErrors && formErrors && Object.keys(formErrors).length > 0 && (
                <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                    <p className="font-medium mb-1">Cannot save yet &mdash; please fix:</p>
                    <ul className="list-disc pl-5 space-y-0.5">
                        {collectErrors(formErrors).map((m, i) => (
                            <li key={i}>{m}</li>
                        ))}
                    </ul>
                </div>
            )}
            <ExamGeneralForm form={form} />
            <div className="flex justify-end sticky bottom-0 bg-background pt-4 pb-2">
                <Button type="submit" form="exam-form" disabled={isMutating || isPending}>
                    {isMutating || isPending ? (
                        <>
                            <Loader2 className="animate-spin" />
                            Saving...
                        </>
                    ) : (
                        "Save Exam"
                    )}
                </Button>
            </div>
        </form>
    )
}

export default ExamForm
