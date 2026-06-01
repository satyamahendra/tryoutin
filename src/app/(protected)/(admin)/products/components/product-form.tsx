"use client"

import {Controller, useFieldArray, useForm} from "react-hook-form"
import {Product, ProductItem} from "../services/get-product"
import {ProductFormSchema, productSchema} from "../utils/schema"
import {Field, FieldError, FieldGroup, FieldLabel} from "@/components/ui/field"
import {Input} from "@/components/ui/input"
import {Button} from "@/components/ui/button"
import {PiPlus, PiTrash} from "react-icons/pi"
import {Label} from "@/components/ui/label"
import {getProducts, ProductList} from "../services/get-products"
import {InfiniteCombobox} from "@/components/custom/combobox"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {createUpdateProduct} from "../services/create-update-product"
import {toast} from "sonner"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {Loader2} from "lucide-react"
import {useTransition} from "react"
import {Separator} from "@/components/ui/separator"
import {deleteProduct} from "../services/delete-product"
import {Switch} from "@/components/ui/switch"
import {zodResolver} from "@hookform/resolvers/zod"

type ProductFormProps = {
    product?: Product
}

const ProductForm = ({product}: ProductFormProps) => {
    const queryClient = useQueryClient()
    const {setParams} = useQueryParams()
    const [isPending, startTransition] = useTransition()

    const form = useForm<ProductFormSchema>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            id: product?.id ?? "",
            name: product?.name ?? "",
            price_alternate: product?.price_alternate ?? 0,
            price_actual: product?.price_actual ?? 0,
            type: product?.type ?? "single",
            is_active: product?.is_active ?? true,
            bundle_items:
                product?.bundle_items?.map((item) => ({
                    product_id: {value: item.product.id, label: item.product.name},
                })) ?? [],
        },
    })

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "bundle_items",
    })

    const {mutate} = useMutation({
        mutationFn: createUpdateProduct,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            startTransition(() => {
                !product && setParams({detail: ""})
                !product && form.reset()
                queryClient.invalidateQueries({queryKey: ["products"]})
            })
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const {mutate: mutateDelete} = useMutation({
        mutationFn: (id: string) => deleteProduct(id),
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            startTransition(() => {
                setParams({detail: ""})
                queryClient.invalidateQueries({queryKey: ["products"]})
            })
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    function onSubmit(data: ProductFormSchema) {
        mutate(data)
    }

    return (
        <>
            <div className="font-semibold text-xl flex justify-between items-center">
                <div>{product ? "Edit Product" : "Create Product"}</div>
                {product && (
                    <Button disabled={isPending} onClick={() => mutateDelete(product.id)} variant={"destructive"}>
                        <PiTrash /> {isPending ? <Loader2 /> : "Delete"}
                    </Button>
                )}
            </div>
            <Separator className="my-4" />
            <form id="product-form" onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                    <div className="flex gap-4">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="name">Name</FieldLabel>
                                    <Input {...field} id="name" aria-invalid={fieldState.invalid} placeholder="Product Name" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="type"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="type">Type</FieldLabel>
                                    <InfiniteCombobox
                                        value={field.value ? {value: field.value, label: field.value === "single" ? "Single" : "Bundle"} : null}
                                        onChange={(opt) => field.onChange(opt?.value ?? null)}
                                        placeholder="Select product type"
                                        options={[
                                            {value: "single", label: "Single"},
                                            {value: "bundle", label: "Bundle"},
                                        ]}
                                    />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>
                    <div className="flex gap-4">
                        <Controller
                            name="price_actual"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="price_actual">Price Actual</FieldLabel>
                                    <Input {...field} id="price_actual" aria-invalid={fieldState.invalid} placeholder="Price Actual" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                        <Controller
                            name="price_alternate"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="price_alternate">Price Alternate</FieldLabel>
                                    <Input {...field} id="price_alternate" aria-invalid={fieldState.invalid} placeholder="Price Alternate" />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    <div>
                        <Controller
                            name="is_active"
                            control={form.control}
                            render={({field, fieldState}) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="is_active">Is active?</FieldLabel>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} id="is_active" aria-invalid={fieldState.invalid} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <Label>Bundle Items</Label>
                            <Button size="icon-xs" type="button" onClick={() => append({product_id: {label: "", value: ""}})} variant="outline">
                                <PiPlus />
                            </Button>
                        </div>
                        {fields.map((_, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <Controller
                                    name={`bundle_items.${index}.product_id`}
                                    control={form.control}
                                    render={({field, fieldState}) => {
                                        const error = form.formState.errors.bundle_items?.[index]?.product_id?.value
                                        return (
                                            <Field data-invalid={fieldState.invalid} className="w-full">
                                                <div className="flex gap-4 items-center">
                                                    <InfiniteCombobox
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        placeholder="Select a product"
                                                        queryKey={["products"]}
                                                        invalid={fieldState.invalid}
                                                        queryFn={(page, search) => getProducts(page, search)}
                                                        getItems={(page) =>
                                                            page.data?.products.map((p) => ({
                                                                value: p.id,
                                                                label: `${p.name}`,
                                                            })) ?? []
                                                        }
                                                        getNextPage={(page) => {
                                                            if (!page.data) return undefined
                                                            const {page: current, pageCount} = page.data.pagination
                                                            return current < pageCount ? current + 1 : undefined
                                                        }}
                                                    />
                                                    <Button variant="destructive" type="button" size="icon" onClick={() => remove(index)}>
                                                        <PiTrash />
                                                    </Button>
                                                </div>
                                                {fieldState.invalid && <FieldError errors={[error]} />}
                                            </Field>
                                        )
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </FieldGroup>
                <div className="mt-4 flex justify-end">
                    <Button disabled={isPending} type="submit" form="product-form">
                        {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default ProductForm
