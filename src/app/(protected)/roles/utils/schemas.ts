import z from "zod"

export const roleSchema = z.object({
    name: z.string().min(1, "Name is required"),
    name_before: z.string().optional(),
    permissions: z.array(z.string()),
})

export type RoleFormSchema = z.infer<typeof roleSchema>
