"use client"

import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Controller, useFieldArray, useWatch, type UseFormReturn} from "react-hook-form"
import ExamOptionForm from "./exam-option.form"
import {Button} from "@/components/ui/button"
import {examOptionInitialValues} from "../_utils/initials"
import {PiImage, PiListMagnifyingGlass, PiMinus, PiPlus, PiTrash, PiX} from "react-icons/pi"
import {useRef, useState} from "react"
import {fileToBase64} from "@/utils/helpers/file-to-base64"
import {Input} from "@/components/ui/input"
import type {
    ExamSchema,
    QuestionTypePath,
    QuestionTextPath,
    QuestionImagePath,
    QuestionExplanationPath,
    QuestionExplanationImagePath,
    QuestionOptionsArrayPath,
} from "../_utils/schema"

type ExamQuestionFormProps = {
    partIndex: number
    questionIndex: number
    form: UseFormReturn<ExamSchema>
    onRemove: () => void
}

const questionTypes = [
    {value: "multiple_choice", label: "Multiple Choice"},
    {value: "single_choice", label: "Single Choice"},
    {value: "scaled_choice", label: "Scaled Choice"},
    {value: "essay", label: "Essay"},
]

const typeBadgeColors: Record<string, string> = {
    multiple_choice: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    single_choice: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    scaled_choice: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
    essay: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
}

const ExamQuestionForm = ({partIndex, questionIndex, form, onRemove}: ExamQuestionFormProps) => {
    const basePath = `parts.${partIndex}.questions.${questionIndex}` as const
    const [isOpen, setIsOpen] = useState(false)

    const questionText = useWatch({control: form.control, name: `${basePath}.question_text` as QuestionTextPath})
    const questionType = useWatch({control: form.control, name: `${basePath}.type` as QuestionTypePath})
    const questionImage = useWatch({control: form.control, name: `${basePath}.question_image` as QuestionImagePath})

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: `${basePath}.options` as QuestionOptionsArrayPath,
    })

    const questionImageRef = useRef<HTMLInputElement>(null)
    const explanationImageRef = useRef<HTMLInputElement>(null)

    const truncatedText = questionText ? (questionText.length > 60 ? questionText.substring(0, 60) + "..." : questionText) : "Untitled question"
    const typeLabel = questionTypes.find((t) => t.value === questionType)?.label ?? "No type"

    return (
        <div className="rounded-lg border bg-card">
            <button type="button" className="flex items-center gap-3 w-full p-3 text-left hover:bg-muted/50 transition-colors" onClick={() => setIsOpen(!isOpen)}>
                <span className="flex items-center justify-center w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold shrink-0">{questionIndex + 1}</span>
                {questionType && (
                    <span
                        className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full shrink-0 ${typeBadgeColors[questionType] ?? "bg-muted text-muted-foreground"}`}>
                        {typeLabel}
                    </span>
                )}
                <span className="text-sm text-muted-foreground truncate flex-1">{truncatedText}</span>
                <Button type="button" variant="destructive" size="icon" className="" onClick={onRemove}>
                    <PiTrash />
                </Button>
                <PiMinus className={`w-4 h-4 text-muted-foreground transition-transform shrink-0 ${isOpen ? "" : "rotate-45"}`} />
            </button>

            {isOpen && (
                <div className="p-4 border-t">
                    <FieldGroup>
                        <Controller
                            name={`${basePath}.type` as QuestionTypePath}
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel>Question Type</FieldLabel>
                                    <Select value={field.value ?? ""} onValueChange={field.onChange}>
                                        <SelectTrigger aria-invalid={fieldState.invalid}>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {questionTypes.map((t) => (
                                                <SelectItem key={t.value} value={t.value}>
                                                    {t.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name={`${basePath}.question_text` as QuestionTextPath}
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor={`${basePath}.question_text`}>Question Text</FieldLabel>
                                    <Textarea
                                        {...field}
                                        id={`${basePath}.question_text`}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter the question"
                                        value={field.value ?? ""}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name={`${basePath}.question_image` as QuestionImagePath}
                            control={form.control}
                            render={({field}) => (
                                <Field className="hidden">
                                    <Input
                                        {...field}
                                        type="file"
                                        ref={questionImageRef}
                                        id={`${basePath}.question_image`}
                                        value={""}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return
                                            const base64 = await fileToBase64(file)
                                            field.onChange(base64)
                                        }}
                                    />
                                </Field>
                            )}
                        />
                        <div className="flex gap-4">
                            <Controller
                                name={`${basePath}.explanation` as QuestionExplanationPath}
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid} className="flex-1">
                                        <FieldLabel htmlFor={`${basePath}.explanation`}>Explanation</FieldLabel>
                                        <Textarea
                                            {...field}
                                            id={`${basePath}.explanation`}
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Explain the correct answer"
                                            value={field.value ?? ""}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>
                        <Controller
                            name={`${basePath}.explanation_image` as QuestionExplanationImagePath}
                            control={form.control}
                            render={({field}) => (
                                <Field className="hidden">
                                    <Input
                                        {...field}
                                        type="file"
                                        ref={explanationImageRef}
                                        id={`${basePath}.explanation_image`}
                                        value={""}
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0]
                                            if (!file) return
                                            const base64 = await fileToBase64(file)
                                            field.onChange(base64)
                                        }}
                                    />
                                </Field>
                            )}
                        />
                    </FieldGroup>

                    <div className="flex items-center gap-2 mt-3 mb-3">
                        <Button type="button" variant={questionImage ? "default" : "outline"} className="h-8 gap-1.5" onClick={() => questionImageRef.current?.click()}>
                            <PiImage />
                            {questionImage ? "Change Image" : "Add Image"}
                        </Button>
                        {questionImage && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => {
                                    form.setValue(`${basePath}.question_image` as QuestionImagePath, null)
                                }}>
                                <PiX />
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                                <PiListMagnifyingGlass className="w-3.5 h-3.5" />
                                Options ({fields.length})
                            </h5>
                            <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={() => append(examOptionInitialValues)}>
                                <PiPlus className="w-3 h-3" /> Add
                            </Button>
                        </div>

                        {fields.map((optionField, index) => (
                            <div key={optionField.id}>
                                <ExamOptionForm partIndex={partIndex} questionIndex={questionIndex} optionIndex={index} form={form} remove={remove} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExamQuestionForm
