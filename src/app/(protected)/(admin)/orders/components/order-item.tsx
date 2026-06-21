"use client"

import {Item, ItemContent, ItemMedia, ItemTitle} from "@/components/ui/item"
import {OrderWithUser} from "../services/get-orders"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {format} from "date-fns"
import {Badge} from "@/components/ui/badge"
import {normalizeString} from "@/utils/helpers/normalize-string"
import {Separator} from "@/components/ui/separator"
import {PiCalendarDots, PiCircle, PiCircleFill} from "react-icons/pi"

type OrderItemProps = {
    order: OrderWithUser
}

const OrderItem = ({order}: OrderItemProps) => {
    const {setParams, getParam} = useQueryParams()
    const selected = getParam("detail")

    const isSuccess = order.status === "success" || order.status === "settlement"

    return (
        <Item
            onClick={() => setParams({detail: order.id})}
            className={`cursor-pointer ${selected !== order.id ? "" : "bg-muted"} hover:bg-muted duration-200`}
            size={"xs"}>
            <ItemMedia variant="icon">{isSuccess ? <PiCircleFill className="text-green-500" /> : <PiCircle className="text-muted-foreground" />}</ItemMedia>

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
                        <Badge variant={"default"} className={`${isSuccess ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"}`}>
                            {normalizeString(order.status)}
                        </Badge>
                    </span>
                </div>
            </ItemContent>
        </Item>
    )
}

export default OrderItem
