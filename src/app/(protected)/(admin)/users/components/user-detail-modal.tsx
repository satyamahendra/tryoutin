"use client"

import {Controller, useForm} from "react-hook-form"
import {PiUser} from "react-icons/pi"
import {Button} from "@/components/ui/button"
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet} from "@/components/ui/field"
import {Loader2} from "lucide-react"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {Checkbox} from "@/components/ui/checkbox"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {getPermissionsAndRoles} from "../services/get-permissions-roles"
import {getUser} from "../services/get-user"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {updateUser} from "../services/update-user"
import {toast} from "sonner"
import {UserFormSchema} from "../utils/schemas"
import {useScreenSize} from "@/utils/hooks/useScreenSize"
import {cn} from "@/lib/utils"

const UserDetailModal = () => {
    const queryClient = useQueryClient()
    const {getParam, setParams} = useQueryParams()
    const {isMobile} = useScreenSize()

    const view = getParam("view")

    const {data: userData, isLoading} = useQuery({
        queryKey: ["user", view],
        queryFn: () => getUser(view!),
        enabled: !!view,
    })

    const form = useForm<UserFormSchema>({
        values:
            view === "create"
                ? {
                      id: "",
                      roles: [],
                      permissions: [],
                  }
                : {
                      id: userData?.data?.id ?? "",
                      roles: userData?.data?.roles?.map((r: {role_name: string}) => r.role_name) ?? [],
                      permissions: userData?.data?.permissions?.map((p: {permission_name: string}) => p.permission_name) ?? [],
                  },
    })

    const {data: permissionsAndRoles} = useQuery({
        queryKey: ["permissions", "roles"],
        queryFn: () => getPermissionsAndRoles(),
    })

    const {mutate, isPending} = useMutation({
        mutationFn: updateUser,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            queryClient.invalidateQueries({queryKey: ["users"]})
            setParams({view: ""})
        },
        onError: (error) => {
            toast.error(error.message)
        },
    })

    const onSubmit = (data: UserFormSchema) => {
        mutate(data)
    }

    return (
        <Drawer repositionInputs={false} direction={isMobile ? "bottom" : "right"} open={!!view} onOpenChange={(open) => !open && setParams({view: ""})}>
            <DrawerContent aria-describedby="user-form" className={cn(isMobile ? "h-[80vh]" : "")}>
                <DrawerHeader className="flex flex-col items-center justify-center">
                    <DrawerTitle className="flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={userData?.success && userData?.data?.image ? userData.data.image : undefined} />
                            <AvatarFallback>{userData?.success && userData?.data?.name ? userData.data.name[0].toUpperCase() : "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col justify-center">
                            <p className="text-lg font-medium">{userData?.success && userData?.data?.name}</p>
                            <p className="text-sm text-muted-foreground">{userData?.success && userData?.data?.email}</p>
                        </div>
                    </DrawerTitle>
                    <DrawerDescription className="sr-only">User form modal</DrawerDescription>
                </DrawerHeader>

                <div className="p-6 flex-1 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-20">
                            <Loader2 className="animate-spin text-primary" />
                        </div>
                    ) : !permissionsAndRoles?.success && !!view ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <PiUser />
                                </EmptyMedia>
                                <EmptyTitle>Failed to fetch user data</EmptyTitle>
                                <EmptyDescription>Failed to fetch user data. Please try again.</EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <>
                            <form id="user-form" onSubmit={form.handleSubmit(onSubmit)} className={isPending ? "pointer-events-none opacity-50" : ""}>
                                <FieldGroup>
                                    <Controller
                                        name="roles"
                                        control={form.control}
                                        render={({field, fieldState}) => (
                                            <FieldSet>
                                                <FieldLegend variant="label">Roles</FieldLegend>
                                                <FieldDescription>Define the roles for this user.</FieldDescription>
                                                <FieldGroup data-slot="checkbox-group">
                                                    {permissionsAndRoles?.success &&
                                                        permissionsAndRoles.data.roles.map((role) => (
                                                            <Field key={role.name} orientation="horizontal" data-invalid={fieldState.invalid}>
                                                                <Checkbox
                                                                    id={`form-rhf-checkbox-${role.name}`}
                                                                    name={field.name}
                                                                    aria-invalid={fieldState.invalid}
                                                                    value={role.name}
                                                                    checked={field.value?.includes(role.name)}
                                                                    onCheckedChange={(checked) => {
                                                                        const newValue = checked
                                                                            ? [...(field.value ?? []), role.name]
                                                                            : (field.value ?? []).filter((value: string) => value !== role.name)
                                                                        field.onChange(newValue)
                                                                    }}
                                                                />
                                                                <FieldLabel htmlFor={`form-rhf-checkbox-${role.name}`} className="font-normal">
                                                                    {role.name}
                                                                </FieldLabel>
                                                            </Field>
                                                        ))}
                                                </FieldGroup>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </FieldSet>
                                        )}
                                    />

                                    <Controller
                                        name="permissions"
                                        control={form.control}
                                        render={({field, fieldState}) => (
                                            <FieldSet>
                                                <FieldLegend variant="label">Permissions</FieldLegend>
                                                <FieldDescription>Define the permissions for this user.</FieldDescription>
                                                <FieldGroup data-slot="checkbox-group">
                                                    {permissionsAndRoles?.success &&
                                                        permissionsAndRoles.data.permissions.map((permission) => (
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
                                                                            : (field.value ?? []).filter((value: string) => value !== permission.name)
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
                    <Button disabled={isPending} type="submit" form="user-form">
                        {isPending ? <Loader2 className="animate-spin" /> : "Submit"}
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

export default UserDetailModal
