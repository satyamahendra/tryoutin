"use client"

import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Controller, useWatch, type UseFormReturn} from "react-hook-form"
import type {ExamSchema, OptionTextPath, OptionIsCorrectPath, OptionScorePath, QuestionTypePath} from "../_utils/schema"
import {Checkbox} from "@/components/ui/checkbox"
import {PiImage, PiPlus, PiTrash, PiX} from "react-icons/pi"
import {Button} from "@/components/ui/button"
import {useRef} from "react"
import {fileToBase64} from "@/utils/helpers/file-to-base64"

type ExamOptionFormProps = {
    partIndex: number
    questionIndex: number
    optionIndex: number
    form: UseFormReturn<ExamSchema>
    remove: any
}

const ExamOptionForm = ({partIndex, questionIndex, optionIndex, form, remove}: ExamOptionFormProps) => {
    const basePath = `parts.${partIndex}.questions.${questionIndex}.options.${optionIndex}` as const

    const questionType = useWatch({
        control: form.control,
        name: `parts.${partIndex}.questions.${questionIndex}.type` as QuestionTypePath,
    })

    const fileInputRef = useRef<HTMLInputElement>(null)
    const optionImage = useWatch({control: form.control, name: `${basePath}.option_image`})

    const handleSelectFile = () => {
        fileInputRef.current?.click()
    }

    return (
        <FieldGroup>
            <div className="flex gap-2">
                <Controller
                    name={`${basePath}.is_correct` as OptionIsCorrectPath}
                    control={form.control}
                    render={({field}) => (
                        <Field className="max-w-5 h-5 mt-1">
                            <Checkbox className="h-full w-full rounded-full" checked={field.value ?? false} onCheckedChange={field.onChange} />
                        </Field>
                    )}
                />
                <div className="flex-1 flex flex-col gap-2  ">
                    <div className="flex gap-2">
                        <Controller
                            name={`${basePath}.option_text` as OptionTextPath}
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid} className="flex-1">
                                    <Input
                                        {...field}
                                        id={`${basePath}.option_text`}
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Enter option text"
                                        value={field.value ?? ""}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        {questionType === "scaled_choice" && (
                            <Controller
                                name={`${basePath}.score` as OptionScorePath}
                                control={form.control}
                                render={({field, fieldState}) => (
                                    <Field data-invalid={fieldState.invalid} className="w-24">
                                        <Input
                                            {...field}
                                            id={`${basePath}.score`}
                                            type="number"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="Score"
                                            value={field.value ?? ""}
                                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : null)}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        )}
                        <Controller
                            name={`${basePath}.option_image` as OptionTextPath}
                            control={form.control}
                            render={({field}) => (
                                <Field className="hidden">
                                    <Input
                                        {...field}
                                        type="file"
                                        ref={fileInputRef}
                                        id={`${basePath}.option_image`}
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
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={handleSelectFile} variant={optionImage ? "default" : "outline"} type="button">
                            <PiImage />
                            {optionImage ? "Change Image" : "Add Image"}
                        </Button>
                        {optionImage && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => {
                                    form.setValue(`${basePath}.option_image`, null)
                                }}>
                                <PiX />
                            </Button>
                        )}
                    </div>
                </div>

                <Button onClick={() => remove(optionIndex)} size="icon-sm" variant="destructive" type="button">
                    <PiTrash />
                </Button>
            </div>
        </FieldGroup>
    )
}

export default ExamOptionForm
