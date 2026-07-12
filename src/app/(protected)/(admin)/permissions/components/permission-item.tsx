"use client"

import {Button} from "@/components/ui/button"
import {PiCircle, PiCircleFill, PiPencil} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import DeleteButton from "./delete-button"
import {GetPermission} from "../services/get-permissions"
import {Badge} from "@/components/ui/badge"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item"

type PermissionItemProps = {
    permission: GetPermission
}

const PermissionItem = ({permission}: PermissionItemProps) => {
    const {setParams} = useQueryParams()

    const firstThreeRoles = permission.roles.slice(0, 2)
    const hasMore = permission.roles.length > 2
    const restRoles = permission.roles.slice(2)

    return (
        <div className="bg-muted hover:bg-muted/50 duration-200 p-2 rounded-xl border">
            <div className="flex gap-2">
                <div>
                    {permission.is_active ? (
                        <div className="text-green-500 flex items-center gap-1">
                            <PiCircleFill className="text-lg" />
                        </div>
                    ) : (
                        <div className="text-muted-foreground flex items-center gap-1">
                            <PiCircle className="text-lg" />
                        </div>
                    )}
                </div>
                <div>
                    <div>{permission.name}</div>
                    <div className="space-x-1">
                        {firstThreeRoles.map((r) => (
                            <Badge variant={"outline"} className="text-muted-foreground" key={r.role_name}>
                                {r.role_name}
                            </Badge>
                        ))}
                        {hasMore && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant={"outline"} className="text-muted-foreground">
                                        +{restRoles.length} more
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="flex flex-col gap-1">
                                        {restRoles.map((r) => (
                                            <span key={r.role_name}>{r.role_name}</span>
                                        ))}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button className="rounded-lg" onClick={() => setParams({view: permission.name})} size={"icon-sm"} variant="outline">
                        <PiPencil />
                    </Button>
                    <DeleteButton permission={permission} />
                </div>
            </div>
        </div>
    )
}

export default PermissionItem
