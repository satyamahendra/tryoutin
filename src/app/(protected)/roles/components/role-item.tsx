"use client"

import {TableCell, TableRow} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {PiCheckCircleFill, PiCircle, PiPencil} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import DeleteButton from "./delete-button"
import {RoleWithPermissions} from "../services/get-roles"
import {Badge} from "@/components/ui/badge"

type RoleItemProps = {
    role: RoleWithPermissions
    number: number
}

const RoleItem = ({role, number}: RoleItemProps) => {
    const {setParams} = useQueryParams()

    return (
        <TableRow key={role.name}>
            <TableCell>{number}</TableCell>
            <TableCell className="font-medium">{role.name}</TableCell>
            <TableCell className="font-medium">
                <div className="flex flex-wrap gap-2">
                    {role.permissions.map((p) => (
                        <Badge variant={"outline"} className="text-muted-foreground" key={p.permission_name}>
                            {p.permission_name}
                        </Badge>
                    ))}
                </div>
            </TableCell>
            <TableCell>
                {role.is_active ? (
                    <div className="text-green-500 flex items-center gap-1">
                        <PiCheckCircleFill className="text-lg" />
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
