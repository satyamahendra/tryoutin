import {getOrders} from "../services/get-orders"
import {PiTicket} from "react-icons/pi"
import OrderItem from "./order-item"
import AnimDiv from "@/components/custom/anim-div"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {ScrollArea} from "@/components/ui/scroll-area"

type OrderListProps = {
    page?: number
    search?: string
}

const OrderList = async ({page, search}: OrderListProps) => {
    const data = await getOrders(page, search)

    if (!data.success) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PiTicket />
                    </EmptyMedia>
                    <EmptyTitle>Something Went Wrong</EmptyTitle>
                    <EmptyDescription>{data?.message}, Please try again later.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <AnimDiv>
            {data.data && data.data?.orders.length > 0 ? (
                <ul className="space-y-2 w-full">
                    {data.data.orders.map((order) => (
                        <li key={order.id}>
                            <OrderItem order={order} />
                        </li>
                    ))}
                </ul>
            ) : (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PiTicket />
                        </EmptyMedia>
                        <EmptyTitle>No Orders Found</EmptyTitle>
                        <EmptyDescription>There are no orders found</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}
        </AnimDiv>
    )
}

export default OrderList
