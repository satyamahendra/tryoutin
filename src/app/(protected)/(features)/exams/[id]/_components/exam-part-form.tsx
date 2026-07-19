"use client"

import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Controller, useFieldArray, useWatch, type UseFormReturn} from "react-hook-form"
import ExamQuestionForm from "./exam-question-form"
import {Button} from "@/components/ui/button"
import {examQuestionInitialValues} from "../_utils/initials"
import {PiClock, PiFileText, PiMinus, PiPlus, PiTrash} from "react-icons/pi"
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@/components/ui/collapsible"
import type {ExamSchema, PartNamePath, PartPassingScorePath, PartDurationMinutesPath, PartQuestionsArrayPath} from "../_utils/schema"

type ExamPartFormProps = {
    partIndex: number
    form: UseFormReturn<ExamSchema>
    onRemove: () => void
}

const ExamPartForm = ({partIndex, form, onRemove}: ExamPartFormProps) => {
    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: `parts.${partIndex}.questions` as PartQuestionsArrayPath,
    })

    const partName = useWatch({control: form.control, name: `parts.${partIndex}.name` as PartNamePath})

    return (
        <Collapsible>
            <div className="relative rounded-xl border bg-card ">
                <CollapsibleTrigger className="flex items-center gap-3 w-full p-4 text-left hover:bg-muted/50 transition-colors">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm font-bold shrink-0">
                        {partIndex + 1}
                    </span>
                    <div className="flex flex-col flex-1 min-w-0">
                        <span className="text-sm font-medium truncate">{partName || "Untitled Part"}</span>
                        <span className="text-xs text-muted-foreground">
                            {fields.length} question{fields.length !== 1 ? "s" : ""}
                        </span>
                    </div>
                    <Button type="button" variant="destructive" size="icon" onClick={onRemove}>
                        <PiTrash />
                    </Button>
                    <PiMinus className="w-4 h-4 text-muted-foreground transition-transform shrink-0 [[data-state=open]>&]:rotate-45" />
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <div className="p-4 border-t space-y-4">
                        <FieldGroup>
                            <div className="flex gap-4">
                                <Controller
                                    name={`parts.${partIndex}.name` as PartNamePath}
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid} className="flex-1">
                                            <FieldLabel htmlFor={`parts.${partIndex}.name`}>Part Name</FieldLabel>
                                            <Input
                                                {...field}
                                                id={`parts.${partIndex}.name`}
                                                aria-invalid={fieldState.invalid}
                                                placeholder="e.g. Reading Comprehension"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name={`parts.${partIndex}.passing_score` as PartPassingScorePath}
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid} className="w-36">
                                            <FieldLabel htmlFor={`parts.${partIndex}.passing_score`}>Passing Score</FieldLabel>
                                            <Input
                                                {...field}
                                                id={`parts.${partIndex}.passing_score`}
                                                type="number"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="e.g. 70"
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name={`parts.${partIndex}.duration_minutes` as PartDurationMinutesPath}
                                    control={form.control}
                                    render={({field, fieldState}) => (
                                        <Field data-invalid={fieldState.invalid} className="w-36">
                                            <FieldLabel htmlFor={`parts.${partIndex}.duration_minutes`} className="flex items-center gap-1">
                                                <PiClock className="w-3 h-3" /> Duration (min)
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id={`parts.${partIndex}.duration_minutes`}
                                                type="number"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="e.g. 30"
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                            />
                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                />
                            </div>
                        </FieldGroup>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                                    <PiFileText className="w-3.5 h-3.5" />
                                    Questions ({fields.length})
                                </h4>
                                <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => append(examQuestionInitialValues)}>
                                    <PiPlus className="w-3 h-3" /> Add
                                </Button>
                            </div>

                            {fields.map((questionField, index) => (
                                <ExamQuestionForm key={questionField.id} partIndex={partIndex} questionIndex={index} form={form} onRemove={() => remove(index)} />
                            ))}
                        </div>
                    </div>
                </CollapsibleContent>
            </div>
        </Collapsible>
    )
}

export default ExamPartForm
