import {z} from "zod"
import {TYPE_VALUES} from "@/utils/types/report"

const reportModalSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    type: z.enum(TYPE_VALUES, `Type must be one of ${TYPE_VALUES.join(", ")}`),
    order_id: z.string().optional().nullable(),
})

type ReportModalSchema = z.infer<typeof reportModalSchema>

export {reportModalSchema, type ReportModalSchema}
