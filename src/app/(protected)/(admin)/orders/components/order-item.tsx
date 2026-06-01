"use client"

import {Item, ItemContent, ItemDescription, ItemMedia, ItemTitle} from "@/components/ui/item"
import {OrderWithUser} from "../services/get-orders"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {format} from "date-fns"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {normalizeString} from "@/utils/helpers/normalize-string"
import {Separator} from "@/components/ui/separator"
import {PiCalendarDot, PiCalendarDots, PiCube} from "react-icons/pi"

type OrderItemProps = {
    order: OrderWithUser
}

const OrderItem = ({order}: OrderItemProps) => {
    const {setParams, getParam} = useQueryParams()
    const selected = getParam("detail")

    return (
        <Item
            onClick={() => setParams({detail: order.id})}
            className={`cursor-pointer ${selected !== order.id ? "" : "bg-muted"} hover:bg-muted duration-200`}
            size={"xs"}>
            <ItemContent>
                <ItemTitle className="flex justify-between w-full">
                    <span>{order.user.email}</span>
                </ItemTitle>
                <div className="flex gap-2 text-muted-foreground">
                    <span className="flex items-center font-bold gap-2">Rp. {order.gross_amount}</span>
                    <Separator orientation="vertical" />
                    <span className="flex items-center gap-1">
                        <PiCalendarDots className="text-sm" />
                        {format(order.created_at, "dd MMM yyyy")}
                    </span>
                    <Separator orientation="vertical" />
                    <span>
                        <Badge
                            variant={"default"}
                            className={`${order.status === "success" || order.status === "settlement" ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                            {normalizeString(order.status)}
                        </Badge>
                    </span>
                </div>
            </ItemContent>
        </Item>
    )
}

export default OrderItem
