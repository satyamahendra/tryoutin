"use client"

import {Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {DialogClose} from "@radix-ui/react-dialog"
import {Controller, useForm} from "react-hook-form"
import {reportModalSchema, ReportModalSchema} from "./utils/schema"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {createReport} from "./services/create-report"
import {toast} from "sonner"
import {Textarea} from "@/components/ui/textarea"
import {InfiniteCombobox} from "../combobox"
import {TYPE_VALUES} from "@/utils/types/report"
import {normalizeString} from "@/utils/helpers/normalize-string"
import {PiFlag} from "react-icons/pi"
import {zodResolver} from "@hookform/resolvers/zod"
import {useState} from "react"
import {ReportType} from "@/generated/index"

type ReportModalProps = {
    order_id?: string
}

const ReportModal = ({order_id}: ReportModalProps) => {
    const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false)

    const form = useForm<ReportModalSchema>({
        resolver: zodResolver(reportModalSchema),
        defaultValues: {
            title: "",
            description: "",
            type: "" as ReportType,
            order_id: null,
        },
    })

    const {mutate, isPending} = useMutation({
        mutationFn: createReport,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            queryClient.invalidateQueries({queryKey: ["reports"]})
            form.reset()
            setIsOpen(false)
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (data: ReportModalSchema) => {
        mutate({...data, order_id})
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <PiFlag /> Report
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center text-xl">
                            <PiFlag />
                        </div>
                        <div>Sent a Report</div>
                    </DialogTitle>
                    <DialogDescription className="text-center">Please fill in the form below to send a report</DialogDescription>
                </DialogHeader>
                <form id="create-report-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="title"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                                    <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Title" autoComplete="off" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="description"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                    <Textarea {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="What happened?" className="h-40" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="type"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="type">Type</FieldLabel>
                                    <InfiniteCombobox
                                        invalid={fieldState.invalid}
                                        value={field.value ? {label: normalizeString(field.value), value: field.value} : null}
                                        onChange={(opt) => field.onChange(opt?.value ?? null)}
                                        placeholder="Select report type"
                                        options={TYPE_VALUES.map((type) => ({label: normalizeString(type), value: type}))}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button disabled={isPending} type="submit" form="create-report-form">
                        Send Report
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ReportModal
