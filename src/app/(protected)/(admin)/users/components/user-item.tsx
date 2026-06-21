"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {TableCell, TableRow} from "@/components/ui/table"
import {PiPencil} from "react-icons/pi"
import {User} from "../services/get-users"
import {Badge} from "@/components/ui/badge"
import {format} from "date-fns"
import {useRouter} from "next/navigation"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"

type Props = {
    user: User
    number: number
}

const UserItem = ({user, number}: Props) => {
    const router = useRouter()

    const firstThreeRoles = user.roles.slice(0, 3)
    const hasMore = user.roles.length > 3
    const restRoles = user.roles.slice(3)

    return (
        <TableRow key={user.id}>
            <TableCell>{number}</TableCell>
            <TableCell className="flex items-center gap-2">
                <Avatar className="w-7 h-7">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback>{user.name ? user.name[0].toUpperCase() : "U"}</AvatarFallback>
                </Avatar>
                <div>{user.name ?? "-"}</div>
            </TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{format(new Date(user.createdAt), "dd MMM yyyy")}</TableCell>
            <TableCell>
                <div className="flex flex-wrap gap-2">
                    {firstThreeRoles.map((role) => (
                        <Badge variant={"outline"} className="text-muted-foreground" key={role.role_name}>
                            {role.role_name}
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
            </TableCell>
            <TableCell>
                <Button onClick={() => router.push(`?id=${user.id}`)} className="rounded-lg" size={"icon-sm"} variant="outline">
                    <PiPencil />
                </Button>
            </TableCell>
        </TableRow>
    )
}

export default UserItem
