import {z} from "zod"
import {TYPE_VALUES} from "@/utils/types/report"

const reportModalSchema = z.object({
    title: z.string().min(5, "Judul minimal 5 karakter"),
    description: z.string().min(10, "Deskripsi minimal 10 karakter"),
    type: z.enum(TYPE_VALUES, `Tipe harus salah satu dari: ${TYPE_VALUES.join(", ")}`),
    order_id: z.string().optional().nullable(),
})

type ReportModalSchema = z.infer<typeof reportModalSchema>

export {reportModalSchema, type ReportModalSchema}
