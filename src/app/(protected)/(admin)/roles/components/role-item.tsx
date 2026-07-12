"use client"

import {Button} from "@/components/ui/button"
import {PiCircle, PiCircleFill, PiPencil} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import DeleteButton from "./delete-button"
import {Badge} from "@/components/ui/badge"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {GetRole} from "../services/get-roles"

type RoleItemProps = {
    role: GetRole
}

const RoleItem = ({role}: RoleItemProps) => {
    const {setParams} = useQueryParams()

    const firstThreePermissions = role.permissions.slice(0, 2)
    const hasMore = role.permissions.length > 2
    const restPermissions = role.permissions.slice(2)

    return (
        <div className="bg-muted hover:bg-muted/50 duration-200 p-2 rounded-xl border">
            <div className="flex gap-2">
                <div>
                    {role.is_active ? (
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
                    <div>{role.name}</div>
                    <div className="space-x-1">
                        {firstThreePermissions.map((p) => (
                            <Badge variant={"outline"} className="text-muted-foreground" key={p.permission_name}>
                                {p.permission_name}
                            </Badge>
                        ))}
                        {hasMore && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Badge variant={"outline"} className="text-muted-foreground">
                                        +{restPermissions.length} more
                                    </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <div className="flex flex-col gap-1">
                                        {restPermissions.map((p) => (
                                            <span key={p.permission_name}>{p.permission_name}</span>
                                        ))}
                                    </div>
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </div>
                <div className="ml-auto flex gap-2">
                    <Button className="rounded-lg" onClick={() => setParams({view: role.name})} size={"icon-sm"} variant="outline">
                        <PiPencil />
                    </Button>
                    <DeleteButton role={role} />
                </div>
            </div>
        </div>
    )
}

export default RoleItem
