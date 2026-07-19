"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {examSchema, type ExamSchema} from "../_utils/schema"
import ExamGeneralForm from "./exam-general-form"
import {examInitialValues} from "../_utils/initials"
import {Button} from "@/components/ui/button"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {getExam} from "../_services/get-exam"
import {upsertExam} from "../_services/upsert-exam"
import {toast} from "sonner"
import {Loader2} from "lucide-react"
import {useTransition} from "react"
import {useRouter} from "next/navigation"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {PiX} from "react-icons/pi"
import {handleClientError} from "@/utils/helpers/handle-client-errors"

type ExamFormTypes = {
    id: string
}

const ExamForm = ({id}: ExamFormTypes) => {
    const isNew = id === "new"
    const queryClient = useQueryClient()
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

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
        values: isNew
            ? examInitialValues
            : {
                  id: exam?.id ?? "",
                  title: exam?.title ?? "",
                  description: exam?.description ?? null,
                  category: exam?.category ?? "",
                  duration_minutes: exam?.duration_minutes ?? null,
                  product_id: exam?.product_id ? {value: exam.product_id, label: exam.product?.name ?? ""} : null,
                  parts: exam?.parts?.map((p) => ({
                      name: p.name ?? "",
                      order_index: p.order_index ?? null,
                      passing_score: p.passing_score ?? null,
                      duration_minutes: p.duration_minutes ?? null,
                      questions:
                          p.questions?.map((q) => ({
                              type: q.type ?? null,
                              question_text: q.question_text ?? null,
                              question_image: q.question_image ?? null,
                              explanation: q.explanation ?? null,
                              explanation_image: null,
                              order_index: q.order_index ?? null,
                              options:
                                  q.options?.map((o) => ({
                                      option_text: o.option_text ?? null,
                                      option_image: o.option_image ?? null,
                                      score: o.score ?? null,
                                      is_correct: o.is_correct ?? null,
                                      order_index: o.order_index ?? null,
                                  })) ?? [],
                          })) ?? [],
                  })) ?? [examInitialValues.parts[0]],
              },
    })

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
        <form id="exam-form" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6 pb-8">
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
