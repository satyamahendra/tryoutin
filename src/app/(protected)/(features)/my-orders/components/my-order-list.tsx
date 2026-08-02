import {getMyOrders} from "../services/get-my-orders"
import {PiReceipt} from "react-icons/pi"
import MyOrderItem from "./my-order-item"
import AnimDiv from "@/components/custom/anim-div"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import PaginationParams from "@/components/custom/pagination-params"

type MyOrderListProps = {
    page?: number
    search?: string
}

const MyOrderList = async ({page, search}: MyOrderListProps) => {
    const data = await getMyOrders(page, search)

    return (
        <AnimDiv className="flex flex-col gap-4">
            {data.orders.length > 0 ? (
                <div className="overflow-hidden space-y-2">
                    {data.orders.map((order) => (
                        <MyOrderItem key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-border py-12">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiReceipt />
                            </EmptyMedia>
                            <EmptyTitle>No Orders Found</EmptyTitle>
                            <EmptyDescription>You haven&apos;t made any orders yet.</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            )}
            <div className="ml-auto">
                <PaginationParams className="w-fit" pageCount={data.pagination.pageCount} />
            </div>
        </AnimDiv>
    )
}

export default MyOrderList

