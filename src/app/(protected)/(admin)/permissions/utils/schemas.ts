import z from "zod"
import {VALID_PREFIXES} from "./constants"

export const permissionSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .transform((val) => val.toLowerCase())
        .refine((val) => VALID_PREFIXES.some((prefix) => val.startsWith(prefix)), {message: `Name must start with: ${VALID_PREFIXES.join(", ")}`}),
    name_before: z.string().optional(),
    roles: z.array(z.string()),
    is_active: z.boolean(),
})

export type PermissionFormSchema = z.infer<typeof permissionSchema>
