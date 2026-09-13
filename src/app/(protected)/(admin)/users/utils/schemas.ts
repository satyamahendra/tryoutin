import z from "zod"

export const userSchema = z.object({
    id: z.string().min(1, "ID wajib diisi"),
    permissions: z.array(z.string()),
    roles: z.array(z.string()),
})

export type UserFormSchema = z.infer<typeof userSchema>
