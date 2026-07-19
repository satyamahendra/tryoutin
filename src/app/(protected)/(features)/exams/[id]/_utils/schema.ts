import {z} from "zod"

const MAX_IMAGE_BYTES = 50 * 1024

function imageUnder50kb(val: string | null | undefined): boolean {
    if (!val) return true
    const base64 = val.includes(",") ? val.split(",")[1] : val
    const bytes = Math.ceil((base64.length * 3) / 4)
    return bytes <= MAX_IMAGE_BYTES
}

const imageField = z.string().nullable().refine(imageUnder50kb, {error: "Image must be smaller than 50KB"})

export const optionSchema = z.object({
    option_text: z.string().min(1, {error: "Option text is required"}),
    option_image: imageField,
    score: z.number().nullable(),
    is_correct: z.boolean().nullable(),
    order_index: z.number().nullable(),
})

export const questionSchema = z
    .object({
        type: z.enum(["multiple_choice", "single_choice", "scaled_choice", "essay"]).nullable(),
        question_text: z.string().min(1, {error: "Question text is required"}),
        question_image: imageField,
        explanation: z.string().nullable(),
        explanation_image: imageField,
        order_index: z.number().nullable(),
        options: z.array(optionSchema).min(1, {error: "At least 1 option is required"}),
    })
    .superRefine((question, ctx) => {
        const options = question.options ?? []

        if (question.type === null) {
            ctx.addIssue({code: "custom", error: "Question type is required", path: ["type"]})
        }

        if (question.type === "multiple_choice") {
            if (options.length < 2) {
                ctx.addIssue({code: "custom", error: "At least 2 options are required for multiple choice", path: ["options"]})
            }
            const correctCount = options.filter((o) => o.is_correct).length
            if (correctCount < 1) {
                ctx.addIssue({code: "custom", error: "At least 1 correct option is required", path: ["options"]})
            }
        }

        if (question.type === "single_choice") {
            const correctCount = options.filter((o) => o.is_correct).length
            if (correctCount !== 1) {
                ctx.addIssue({code: "custom", error: "Exactly 1 correct option is required for single choice", path: ["options"]})
            }
        }

        if (question.type === "scaled_choice") {
            for (let i = 0; i < options.length; i++) {
                if (options[i].score == null) {
                    ctx.addIssue({code: "custom", error: "Score is required for each option", path: ["options", i, "score"]})
                }
            }
        }
    })

export const partSchema = z.object({
    name: z.string().min(1, {error: "Part name is required"}),
    order_index: z.number().nullable(),
    passing_score: z.number().min(0, {error: "Passing score is required"}).nullable(),
    duration_minutes: z.number().nullable(),
    questions: z.array(questionSchema).min(1, {error: "At least 1 question is required"}),
})

export const examSchema = z.object({
    id: z.string(),
    title: z.string().min(1, {error: "Title is required"}),
    description: z.string().nullable(),
    category: z.string().min(1, {error: "Category is required"}),
    duration_minutes: z.number().min(1, {error: "Duration is required"}).nullable(),
    product_id: z.object({value: z.string(), label: z.string()}).nullable(),
    parts: z.array(partSchema).min(1, {error: "At least 1 part is required"}),
})

export type ExamSchema = z.infer<typeof examSchema>

export type PartNamePath = `parts.${number}.name`
export type PartOrderIndexPath = `parts.${number}.order_index`
export type PartPassingScorePath = `parts.${number}.passing_score`
export type PartDurationMinutesPath = `parts.${number}.duration_minutes`
export type PartQuestionsArrayPath = `parts.${number}.questions`

export type QuestionTypePath = `parts.${number}.questions.${number}.type`
export type QuestionTextPath = `parts.${number}.questions.${number}.question_text`
export type QuestionImagePath = `parts.${number}.questions.${number}.question_image`
export type QuestionExplanationPath = `parts.${number}.questions.${number}.explanation`
export type QuestionExplanationImagePath = `parts.${number}.questions.${number}.explanation_image`
export type QuestionOrderIndexPath = `parts.${number}.questions.${number}.order_index`
export type QuestionOptionsArrayPath = `parts.${number}.questions.${number}.options`

export type OptionTextPath = `parts.${number}.questions.${number}.options.${number}.option_text`
export type OptionImagePath = `parts.${number}.questions.${number}.options.${number}.option_image`
export type OptionScorePath = `parts.${number}.questions.${number}.options.${number}.score`
export type OptionIsCorrectPath = `parts.${number}.questions.${number}.options.${number}.is_correct`
export type OptionOrderIndexPath = `parts.${number}.questions.${number}.options.${number}.order_index`
