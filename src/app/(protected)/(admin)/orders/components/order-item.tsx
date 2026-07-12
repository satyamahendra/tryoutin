"use client"

import {Item, ItemContent, ItemMedia, ItemTitle, ItemActions} from "@/components/ui/item"
import {GetOrder} from "../services/get-orders"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {format} from "date-fns"
import {Badge} from "@/components/ui/badge"
import {normalizeString} from "@/utils/helpers/normalize-string"
import {Separator} from "@/components/ui/separator"
import {PiCalendarDots, PiCircle, PiCircleFill, PiEye} from "react-icons/pi"
import {Button} from "@/components/ui/button"

type OrderItemProps = {
    order: GetOrder
}

const OrderItem = ({order}: OrderItemProps) => {
    const {setParams} = useQueryParams()

    const isSuccess = order.status === "success" || order.status === "settlement"

    return (
        <Item className="bg-muted hover:bg-background duration-200">
            <ItemMedia variant="icon">{isSuccess ? <PiCircleFill className="text-green-500" /> : <PiCircle className="text-muted-foreground" />}</ItemMedia>
            <ItemContent>
                <ItemTitle>{order.user.email}</ItemTitle>
                <div className="flex gap-2 text-muted-foreground text-sm">
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
            <ItemActions>
                <Button className="rounded-lg" onClick={() => setParams({view: order.id})} size={"icon-sm"} variant="outline">
                    <PiEye />
                </Button>
            </ItemActions>
        </Item>
    )
}

export default OrderItem
