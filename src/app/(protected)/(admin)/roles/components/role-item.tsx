"use client"

import {TableCell, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {PiCircle, PiCircleFill, PiPencil} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import DeleteButton from "./delete-button"
import {RoleWithPermissions} from "../services/get-roles"
import {Badge} from "@/components/ui/badge"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"

type RoleItemProps = {
    role: RoleWithPermissions
    number: number
}

const RoleItem = ({role, number}: RoleItemProps) => {
    const {setParams} = useQueryParams()

    const firstThreePermissions = role.permissions.slice(0, 3)
    const hasMore = role.permissions.length > 3
    const restPermissions = role.permissions.slice(3)

    return (
        <TableRow key={role.name}>
            <TableCell>{number}</TableCell>
            <TableCell className="font-medium">{role.name}</TableCell>
            <TableCell className="font-medium">
                <div className="flex flex-wrap gap-2">
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
            </TableCell>
            <TableCell>
                {role.is_active ? (
                    <div className="text-green-500 flex items-center gap-1">
                        <PiCircleFill className="text-lg" />
                        Active
                    </div>
                ) : (
                    <div className="text-muted-foreground flex items-center gap-1">
                        <PiCircle className="text-lg" />
                        Inactive
                    </div>
                )}
            </TableCell>
            <TableCell className="text-right space-x-2">
                <Button className="rounded-lg" onClick={() => setParams({view: role.name})} size={"icon-sm"} variant="outline">
                    <PiPencil />
                </Button>
                <DeleteButton role={role} />
            </TableCell>
        </TableRow>
    )
}

export default RoleItem
