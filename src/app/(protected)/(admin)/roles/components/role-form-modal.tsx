"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {Controller, useForm} from "react-hook-form"
import {PiCardholder, PiPlus} from "react-icons/pi"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field"
import {RoleFormSchema, roleSchema} from "../utils/schemas"
import {createUpdateRole} from "../services/create-update-role"
import {toast} from "sonner"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {Loader2} from "lucide-react"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {getRole} from "../services/get-role"
import {useEffect} from "react"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {Checkbox} from "@/components/ui/checkbox"
import {getPermissions} from "@/utils/services/get-permissions"
import {Switch} from "@/components/ui/switch"
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer"
import {useScreenSize} from "@/utils/hooks/useScreenSize"
import {cn} from "@/lib/utils"

const RoleFormModal = () => {
    const queryClient = useQueryClient()
    const {getParam, setParams} = useQueryParams()
    const {isMobile} = useScreenSize()

    const view = getParam("view")

    const {
        data: roleData,
        refetch: refetchRole,
        isLoading,
    } = useQuery({
        queryKey: ["role", view],
        queryFn: () => getRole(view!),
        enabled: !!view && view !== "create",
    })

    const {data: permissionsData} = useQuery({
        queryKey: ["permissions", view],
        queryFn: () => getPermissions(),
    })

    const form = useForm<RoleFormSchema>({
        resolver: zodResolver(roleSchema),
        defaultValues: {
            name: "",
            name_before: "",
            is_active: true,
        },
    })

    const {mutate, isPending} = useMutation({
        mutationFn: createUpdateRole,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            queryClient.invalidateQueries({queryKey: ["roles"]})
            form.reset()
            setParams({view: ""})
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (data: RoleFormSchema) => {
        mutate(data)
    }

    useEffect(() => {
        if (view === "create") {
            form.reset({name: "", name_before: "", permissions: [], is_active: true})
            return
        }

        refetchRole()

        if (roleData?.success && roleData.data) {
            form.reset({
                name: roleData.data.name,
                name_before: roleData.data.name,
                permissions: roleData.data.permissions.map((permission) => permission.permission_name),
                is_active: roleData.data.is_active,
            })
        }
    }, [view, roleData, form, refetchRole])

    return (
        <Drawer direction={isMobile ? "bottom" : "right"} open={!!view} onOpenChange={(e) => (e ? setParams({view: "create"}) : setParams({view: ""}))}>
            <DrawerTrigger asChild>
                <Button>
                    <PiPlus /> Create Role
                </Button>
            </DrawerTrigger>
            <DrawerContent aria-describedby="role-form" className={cn(isMobile ? "h-[80vh]" : "")}>
                <DrawerHeader>
                    <DrawerTitle className="flex items-center gap-4">{view !== "create" ? "Edit" : "Create"} Role</DrawerTitle>
                    <DrawerDescription className="flex items-center gap-4">
                        {view !== "create" ? "Edit" : "Create"} a custom role for your organization.
                    </DrawerDescription>
                </DrawerHeader>

                <div className="px-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-20">
                            <Loader2 className="animate-spin text-primary" />
                        </div>
                    ) : !roleData?.success && view !== "create" && !!view ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <PiCardholder />
                                </EmptyMedia>
                                <EmptyTitle>Failed to fetch role</EmptyTitle>
                                <EmptyDescription>Failed to fetch role. Please try again.</EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <>
                            <form id="role-form" onSubmit={form.handleSubmit(onSubmit)} className={isPending ? "pointer-events-none opacity-50" : ""}>
                                <FieldGroup>
                                    <Controller
                                        name="name"
                                        control={form.control}
                                        render={({field, fieldState}) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor={field.name}>Role Name</FieldLabel>
                                                <Input {...field} id={field.name} aria-invalid={fieldState.invalid} placeholder="Admin" autoComplete="off" />
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="permissions"
                                        control={form.control}
                                        render={({field, fieldState}) => (
                                            <FieldSet>
                                                <FieldLegend variant="label">Permissions</FieldLegend>
                                                <FieldDescription>Define the permissions for this role.</FieldDescription>
                                                <FieldGroup data-slot="checkbox-group">
                                                    {permissionsData?.success &&
                                                        permissionsData.data.map((permission) => (
                                                            <Field key={permission.name} orientation="horizontal" data-invalid={fieldState.invalid}>
                                                                <Checkbox
                                                                    id={`form-rhf-checkbox-${permission.name}`}
                                                                    name={field.name}
                                                                    aria-invalid={fieldState.invalid}
                                                                    value={permission.name}
                                                                    checked={field.value?.includes(permission.name)}
                                                                    onCheckedChange={(checked) => {
                                                                        const newValue = checked
                                                                            ? [...(field.value ?? []), permission.name]
                                                                            : (field.value ?? []).filter((value) => value !== permission.name)
                                                                        field.onChange(newValue)
                                                                    }}
                                                                />
                                                                <FieldLabel htmlFor={`form-rhf-checkbox-${permission.name}`} className="font-normal">
                                                                    {permission.name}
                                                                </FieldLabel>
                                                            </Field>
                                                        ))}
                                                </FieldGroup>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </FieldSet>
                                        )}
                                    />

                                    <Controller
                                        name="is_active"
                                        control={form.control}
                                        render={({field}) => (
                                            <Field>
                                                <FieldLabel htmlFor="is_active">is active?</FieldLabel>
                                                <Switch id="is_active" checked={field.value} onCheckedChange={field.onChange} />
                                            </Field>
                                        )}
                                    />
                                </FieldGroup>
                            </form>
                        </>
                    )}
                </div>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline" className="w-full">
                            Cancel
                        </Button>
                    </DrawerClose>
                    <Button disabled={isPending} type="submit" form="role-form">
                        {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default RoleFormModal
