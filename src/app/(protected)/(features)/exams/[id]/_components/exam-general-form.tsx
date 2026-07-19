"use client"

import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Controller, useFieldArray, type UseFormReturn} from "react-hook-form"
import ExamPartForm from "./exam-part-form"
import {Button} from "@/components/ui/button"
import {examPartInitialValues} from "../_utils/initials"
import {PiClock, PiListNumbers, PiPlus, PiShoppingBag, PiTag, PiTextAa} from "react-icons/pi"
import {InfiniteCombobox} from "@/components/custom/combobox"
import type {ExamSchema} from "../_utils/schema"
import {getProducts} from "@/app/(protected)/(admin)/products/services/get-products"

type ExamGeneralFormProps = {
    form: UseFormReturn<ExamSchema>
}

const categoryOptions = [
    {value: "CPNS", label: "CPNS"},
    {value: "BUMN", label: "BUMN"},
    {value: "UTBK", label: "UTBK"},
    {value: "SBMPTN", label: "SBMPTN"},
    {value: "MANDIRI", label: "Mandiri"},
    {value: "OTHER", label: "Other"},
]

const ExamGeneralForm = ({form}: ExamGeneralFormProps) => {
    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "parts",
    })

    return (
        <>
            <FieldGroup>
                <Controller
                    name="title"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="title" className="flex items-center gap-1.5">
                                <PiTextAa className="w-4 h-4" /> Title
                            </FieldLabel>
                            <Input {...field} id="title" aria-invalid={fieldState.invalid} placeholder="Exam title" value={field.value ?? ""} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <Controller
                    name="description"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="description">Description</FieldLabel>
                            <Textarea {...field} id="description" aria-invalid={fieldState.invalid} placeholder="Exam description" value={field.value ?? ""} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
                <div className="flex gap-4">
                    <Controller
                        name="category"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid} className="flex-1">
                                <FieldLabel className="flex items-center gap-1.5">
                                    <PiTag className="w-4 h-4" /> Category
                                </FieldLabel>
                                <InfiniteCombobox
                                    value={field.value ? {value: field.value, label: field.value} : null}
                                    onChange={(opt) => field.onChange(opt?.value ?? "")}
                                    placeholder="Select category"
                                    options={categoryOptions}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    <Controller
                        name="duration_minutes"
                        control={form.control}
                        render={({field, fieldState}) => (
                            <Field data-invalid={fieldState.invalid} className="w-48">
                                <FieldLabel htmlFor="duration_minutes" className="flex items-center gap-1.5">
                                    <PiClock className="w-4 h-4" /> Duration (minutes)
                                </FieldLabel>
                                <Input
                                    {...field}
                                    id="duration_minutes"
                                    type="number"
                                    aria-invalid={fieldState.invalid}
                                    placeholder="e.g. 60"
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </div>
                <Controller
                    name="product_id"
                    control={form.control}
                    render={({field, fieldState}) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="flex items-center gap-1.5">
                                <PiShoppingBag className="w-4 h-4" /> Product (optional)
                            </FieldLabel>
                            <InfiniteCombobox
                                value={field.value}
                                onChange={field.onChange}
                                placeholder="Link a product"
                                queryKey={["products"]}
                                queryFn={(page, search) => getProducts(page, search)}
                                getItems={(page) =>
                                    page.data?.products.map((p) => ({
                                        value: p.id,
                                        label: p.name,
                                    })) ?? []
                                }
                                getNextPage={(page) => {
                                    if (!page.data) return undefined
                                    const {page: current, pageCount} = page.data.pagination
                                    return current < pageCount ? current + 1 : undefined
                                }}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />
            </FieldGroup>

            <div className="flex flex-col gap-4 mt-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                        <PiListNumbers className="w-4 h-4" />
                        Exam Parts ({fields.length})
                    </h3>
                    <Button type="button" variant="outline" size="sm" onClick={() => append(examPartInitialValues)}>
                        <PiPlus className="w-4 h-4" /> Add Part
                    </Button>
                </div>

                <div className="flex flex-col gap-4">
                    {fields.map((field, index) => (
                        <ExamPartForm key={field.id} partIndex={index} form={form} onRemove={() => remove(index)} />
                    ))}
                </div>
            </div>
        </>
    )
}

export default ExamGeneralForm
