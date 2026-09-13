import {z} from "zod"

const MAX_IMAGE_BYTES = 50 * 1024

function imageUnder50kb(val: string | null | undefined): boolean {
    if (!val) return true
    const base64 = val.includes(",") ? val.split(",")[1] : val
    const bytes = Math.ceil((base64.length * 3) / 4)
    return bytes <= MAX_IMAGE_BYTES
}

const imageField = z.string().nullable().refine(imageUnder50kb, {error: "Gambar harus lebih kecil dari 50KB"})

export const optionSchema = z.object({
    id: z.string().nullable(),
    option_text: z.string().min(1, {error: "Teks opsi wajib diisi"}),
    option_image: imageField,
    score: z.number().nullable(),
    is_correct: z.boolean().nullable(),
    order_index: z.number().nullable(),
})

export const questionSchema = z
    .object({
        id: z.string().nullable(),
        type: z.enum(["multiple_choice", "single_choice", "scaled_choice"]).nullable(),
        question_text: z.string().min(1, {error: "Teks soal wajib diisi"}),
        question_image: imageField,
        explanation: z.string().nullable(),
        explanation_image: imageField,
        order_index: z.number().nullable(),
        options: z.array(optionSchema).min(1, {error: "Minimal 1 opsi wajib ada"}),
    })
    .superRefine((question, ctx) => {
        const options = question.options ?? []

        if (question.type === null) {
            ctx.addIssue({code: "custom", error: "Tipe soal wajib dipilih", path: ["type"]})
        }

        if (question.type === "multiple_choice") {
            if (options.length < 2) {
                ctx.addIssue({code: "custom", error: "Minimal 2 opsi wajib ada untuk pilihan ganda", path: ["options"]})
            }
            const correctCount = options.filter((o) => o.is_correct).length
            if (correctCount < 1) {
                ctx.addIssue({code: "custom", error: "Minimal 1 jawaban benar wajib ada", path: ["options"]})
            }
        }

        if (question.type === "single_choice") {
            const correctCount = options.filter((o) => o.is_correct).length
            if (correctCount !== 1) {
                ctx.addIssue({code: "custom", error: "Tepat 1 jawaban benar wajib ada untuk pilihan tunggal", path: ["options"]})
            }
        }

        if (question.type === "scaled_choice") {
            for (let i = 0; i < options.length; i++) {
                if (options[i].score == null) {
                    ctx.addIssue({code: "custom", error: "Skor wajib diisi untuk setiap opsi", path: ["options", i, "score"]})
                }
            }
        }
    })

export const partSchema = z.object({
    id: z.string().nullable(),
    name: z.string().min(1, {error: "Nama bagian wajib diisi"}),
    order_index: z.number().nullable(),
    passing_score: z.number({error: "Nilai kelulusan wajib diisi"}).min(0, {error: "Nilai kelulusan tidak boleh negatif"}).max(100, {error: "Nilai kelulusan harus antara 0 dan 100"}),
    duration_minutes: z.number({error: "Durasi wajib diisi"}).min(1, {error: "Durasi minimal 1 menit"}),
    questions: z.array(questionSchema).min(1, {error: "Minimal 1 soal wajib ada"}),
})

export const examSchema = z.object({
    id: z.uuid().nullable(),
    title: z.string().min(1, {error: "Judul wajib diisi"}),
    description: z.string().nullable(),
    category: z.string().min(1, {error: "Kategori wajib dipilih"}),
    product_id: z.object({value: z.string(), label: z.string()}).nullable(),
    tags: z.array(z.object({value: z.string(), label: z.string()})),
    parts: z.array(partSchema).min(1, {error: "Minimal 1 bagian wajib ada"}),
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

export const arrayErrorMessage = (err: {message?: string; root?: {message?: string}} | undefined): string | undefined =>
    err?.message ?? err?.root?.message
