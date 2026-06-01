import AnimDiv from "@/components/custom/anim-div"
import {getOrder} from "../services/get-order"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {PiArrowSquareOut, PiCalendarDots, PiCheckCircle, PiCheckCircleLight, PiCoin, PiHandshake, PiLink, PiMoney, PiTicket} from "react-icons/pi"
import {format} from "date-fns"

type OrderDetail = {
    detail: string
}

const OrderDetail = async ({detail}: OrderDetail) => {
    const data = await getOrder(detail)

    if (!data.success)
        return (
            <AnimDiv>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PiTicket />
                        </EmptyMedia>
                        <EmptyTitle>Something Went Wrong</EmptyTitle>
                        <EmptyDescription>{data.message}, Please try again later.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </AnimDiv>
        )

    const {order} = data?.data || {}

    if (!order)
        return (
            <AnimDiv>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PiTicket />
                        </EmptyMedia>
                        <EmptyTitle>Order Not Found</EmptyTitle>
                        <EmptyDescription>The requested order could not be found.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </AnimDiv>
        )

    const displayData = [
        {label: "Order ID", value: order.midtrans_order_id, icon: <PiTicket />},
        {label: "Status", value: order.status, icon: <PiCheckCircle />},
        {label: "Order Created Date", value: format(order.created_at, "dd MMM yyyy HH:mm"), icon: <PiCalendarDots />},
        {label: "Order Paid Date", value: order.paid_at ? format(order.paid_at, "dd MMM yyyy HH:mm") : "-", icon: <PiHandshake />},
        {label: "Redirect Url", value: order?.midtrans_redirect || "-", icon: <PiLink />},
        {label: "Token", value: order?.midtrans_token || "-", icon: <PiCoin />},
        {label: "Gross Amount", value: order.gross_amount, icon: <PiMoney />},
    ]

    return (
        <AnimDiv>
            <div className="flex flex-col items-center justify-center ">
                <Avatar className="w-10 h-10 mb-2">
                    <AvatarImage src={order.user.image || undefined} />
                    <AvatarFallback>{order.user.name ? order.user.name[0].toUpperCase() : "U"}</AvatarFallback>
                </Avatar>
                <div className="font-semibold text-lg">{order.user.name}</div>
                <div className="text-muted-foreground">{order.user.email}</div>
            </div>

            <ul className="space-y-4 mt-4">
                {displayData.map((d, index) => {
                    return (
                        <li className="text-sm flex items-center gap-4" key={index}>
                            <div className="text-lg bg-muted w-7 h-7 rounded-sm flex items-center justify-center">{d.icon}</div>
                            <div>
                                <div>{d.label}</div>
                                <div className="text-muted-foreground">{d.value}</div>
                            </div>
                        </li>
                    )
                })}
            </ul>
        </AnimDiv>
    )
}

export default OrderDetail
