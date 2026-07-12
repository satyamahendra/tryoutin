"use client"

import {GetOrder} from "../services/get-orders"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {format} from "date-fns"
import {Badge} from "@/components/ui/badge"
import {normalizeString} from "@/utils/helpers/normalize-string"
import {Separator} from "@/components/ui/separator"
import {PiArrowsClockwise, PiCalendarDots, PiCircle, PiCircleFill, PiEye} from "react-icons/pi"
import {Button} from "@/components/ui/button"
import {useQuery, useQueryClient} from "@tanstack/react-query"
import axios from "axios"
import {toast} from "sonner"
import {useRouter} from "next/navigation"
import {Loader2} from "lucide-react"

type OrderItemProps = {
    order: GetOrder
}

const OrderItem = ({order}: OrderItemProps) => {
    const {setParams} = useQueryParams()
    const queryClient = useQueryClient()
    const router = useRouter()

    const isSuccess = order.status === "success" || order.status === "settlement"

    const {refetch: refetchOrder, isLoading} = useQuery({
        queryKey: ["orders", order.id],
        queryFn: async () => await axios.get(`/api/midtrans/status?order_id=${order.midtrans_order_id}`),
        staleTime: 0,
        enabled: false,
    })

    const handleCheckOrderStatus = async () => {
        const res = await refetchOrder()
        if (!res?.isSuccess) return toast.error("Failed to fetch order status")
        queryClient.invalidateQueries({queryKey: ["orders"]})
        router.refresh()
        return toast.success("Order status updated successfully")
    }

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
                <div className="ml-auto flex gap-2">
                    <Button className="rounded-lg" disabled={isLoading} onClick={handleCheckOrderStatus} size={"icon-sm"} variant="outline">
                        {isLoading ? <Loader2 className="animate-spin" /> : <PiArrowsClockwise />}
                    </Button>
                    <Button className="rounded-lg" onClick={() => setParams({view: order.id})} size={"icon-sm"} variant="outline">
                        <PiEye />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default OrderItem
