import {z} from "zod"

const productOptionSchema = z.object({
label: z.string().min(1, "Pilih produk dulu, ya"),
        value: z.string().min(1, "Pilih produk dulu, ya"),
})

export const productSchema = z.object({
    id: z.string(),
    name: z.string().min(1, "Nama produk wajib diisi"),
    price_alternate: z.number().min(0),
    price_actual: z.number().min(0),
    type: z.enum(["single", "bundle"]),
    is_active: z.boolean(),
    bundle_items: z
        .array(
            z.object({
                product_id: productOptionSchema,
            }),
        )
        .optional(),
})

export type ProductFormSchema = z.input<typeof productSchema>
