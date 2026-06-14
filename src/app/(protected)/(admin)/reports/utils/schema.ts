import {STATUS_VALUES} from "@/utils/types/report"
import z from "zod"

export const messageSchema = z.object({
    report_id: z.uuid(),
    message: z.string().min(3),
})

export type MessageFormSchema = z.infer<typeof messageSchema>

export const reportSchema = z.object({
    id: z.string().optional(),
    status: z.enum(STATUS_VALUES),
    resolved_at: z.date().optional(),
})

export type ReportFormSchema = z.infer<typeof reportSchema>
