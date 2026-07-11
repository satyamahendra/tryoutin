"use client"

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Button} from "@/components/ui/button"
import {PiPencil} from "react-icons/pi"
import {User} from "../services/get-users"
import {Badge} from "@/components/ui/badge"
import {format} from "date-fns"
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip"
import {Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item"
import {useQueryParams} from "@/utils/hooks/useQueryParams"

type Props = {
    user: User
}

const UserItem = ({user}: Props) => {
    const {setParams} = useQueryParams()

    const firstThreeRoles = user.roles.slice(0, 3)
    const hasMore = user.roles.length > 3
    const restRoles = user.roles.slice(3)

    return (
        <Item className="bg-muted hover:bg-background duration-200">
            <ItemMedia variant="icon">
                <Avatar className="w-7 h-7">
                    <AvatarImage src={user.image || undefined} />
                    <AvatarFallback>{user.name ? user.name[0].toUpperCase() : "U"}</AvatarFallback>
                </Avatar>
            </ItemMedia>
            <ItemContent>
                <ItemTitle>{user.name ?? "-"}</ItemTitle>
                <ItemDescription className="space-x-2">
                    <span className="text-muted-foreground">{user.email}</span>
                    <span className="text-muted-foreground">&middot;</span>
                    <span className="text-muted-foreground">{format(new Date(user.createdAt), "dd MMM yyyy")}</span>
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
                </ItemDescription>
            </ItemContent>
            <ItemActions>
                <Button className="rounded-lg" onClick={() => setParams({id: user.id})} size={"icon-sm"} variant="outline">
                    <PiPencil />
                </Button>
            </ItemActions>
        </Item>
    )
}

export default UserItem
