import {z} from "zod"

export const tagSchema = z.object({
    id: z.string().optional(),
    name: z.string().min(1, {error: "Name is required"}),
})

export type TagFormSchema = z.infer<typeof tagSchema>
