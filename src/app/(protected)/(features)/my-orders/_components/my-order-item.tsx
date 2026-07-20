"use client"

import {GetMyOrder} from "../_services/get-my-orders"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {format} from "date-fns"
import {Badge} from "@/components/ui/badge"
import {normalizeString} from "@/utils/helpers/normalize-string"
import {Separator} from "@/components/ui/separator"
import {PiCalendarDots, PiEye, PiReceipt} from "react-icons/pi"
import {Button} from "@/components/ui/button"
import {cn} from "@/lib/utils"

type MyOrderItemProps = {
    order: GetMyOrder
}

const MyOrderItem = ({order}: MyOrderItemProps) => {
    const {setParams} = useQueryParams()
    const isSuccess = order.status === "success" || order.status === "settlement"

    return (
        <div
            className={cn(
                "bg-muted/50 hover:bg-muted duration-200 p-3 border border-l-6 rounded-md cursor-pointer transition-colors",
                isSuccess ? "border-l-primary" : "border-l-muted",
            )}
            onClick={() => setParams({view: order.id})}>
            <div className="flex items-center gap-3 ml-2">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 text-primary shrink-0">
                    <PiReceipt className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">
                        {order.entitlements.length > 0
                            ? order.entitlements.map((e) => e.product.name).join(", ")
                            : "Order"}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-0.5">
                        <span className="font-semibold">Rp. {order.gross_amount.toLocaleString("id-ID")}</span>
                        <Separator orientation="vertical" className="h-3" />
                        <span className="flex items-center gap-1">
                            <PiCalendarDots className="text-xs" />
                            {format(order.created_at, "dd MMM yyyy")}
                        </span>
                        <Separator orientation="vertical" className="h-3" />
                        <Badge
                            variant={"default"}
                            className={cn(
                                "text-[10px] px-1.5 py-0",
                                isSuccess ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-muted text-muted-foreground",
                            )}>
                            {normalizeString(order.status)}
                        </Badge>
                    </div>
                </div>
                <Button className="rounded-lg shrink-0" size="icon-sm" variant="outline" onClick={(e) => {
                    e.stopPropagation()
                    setParams({view: order.id})
                }}>
                    <PiEye />
                </Button>
            </div>
        </div>
    )
}

export default MyOrderItem
