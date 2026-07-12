"use client"

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
        <div className="bg-muted hover:bg-muted/50 duration-200 p-2 rounded-xl border">
            <div className="flex gap-2">
                <div>
                    {isSuccess ? (
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
                    <div>{order.user.email}</div>
                    <div className="flex gap-2 text-muted-foreground text-sm">
                        <span className="flex items-center font-bold gap-2">Rp. {order.gross_amount}</span>
                        <Separator orientation="vertical" />
                        <span className="flex items-center gap-1">
                            <PiCalendarDots className="text-sm" />
                            {format(order.created_at, "dd MMM yyyy")}
                        </span>
                        <Separator orientation="vertical" />
                        <span>
                            <Badge variant={"default"} className={`${isSuccess ? "bg-green-200 text-green-700" : "bg-muted text-muted-foreground"}`}>
                                {normalizeString(order.status)}
                            </Badge>
                        </span>
                    </div>
                </div>
                <div className="ml-auto">
                    <Button className="rounded-lg" onClick={() => setParams({view: order.id})} size={"icon-sm"} variant="outline">
                        <PiEye />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default OrderItem
