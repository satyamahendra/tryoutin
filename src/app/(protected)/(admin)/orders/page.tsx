import PageHeader from "@/components/custom/page-header/page-header"
import {PiTicket} from "react-icons/pi"
import {hasPermissions} from "@/utils/helpers/has-ability-server"
import {redirect} from "next/navigation"
import AnimDiv from "@/components/custom/anim-div"
import SearchParams from "@/components/custom/search-params"
import {Suspense} from "react"
import {Loader2} from "lucide-react"
import OrderList from "./components/order-list"
import {Separator} from "@/components/ui/separator"
import OrderDetail from "./components/order-detail"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import PaginationParams from "@/components/custom/pagination-params"
import {ScrollArea} from "@/components/ui/scroll-area"

type PageProps = {
    searchParams: Promise<{
        page?: string
        search?: string
        detail?: string
    }>
}

const Page = async ({searchParams}: PageProps) => {
    const hasPerm = await hasPermissions(["read orders"])
    if (!hasPerm) return redirect("/home")

    const {page, search, detail} = await searchParams
    const pageNum = page ? parseInt(page) : 1

    return (
        <AnimDiv className="flex flex-col gap-4 h-full">
            <PageHeader title="Orders" description="Manage orders" icon={<PiTicket />} />
            <SearchParams className="w-48" />

            <div className="w-full flex gap-2 h-full min-h-0">
                <div className="w-1/3 flex flex-col h-full min-h-0">
                    <ScrollArea className="flex-1 h-full min-h-0">
                        <Suspense
                            key={`${page}-${search}`}
                            fallback={
                                <AnimDiv className="flex items-center justify-center h-20">
                                    <span className="text-muted-foreground">
                                        <Loader2 className="animate-spin text-primary" />
                                    </span>
                                </AnimDiv>
                            }>
                            <OrderList page={pageNum} search={search} />
                        </Suspense>
                    </ScrollArea>
                    <PaginationParams pageCount={pageNum} className="w-fit mt-4" />
                </div>
                <Separator orientation="vertical" className="mx-4" />
                <div className="w-2/3">
                    {detail ? (
                        <Suspense
                            key={`${detail}`}
                            fallback={
                                <AnimDiv className="flex items-center justify-center h-20">
                                    <span className="text-muted-foreground">
                                        <Loader2 className="animate-spin text-primary" />
                                    </span>
                                </AnimDiv>
                            }>
                            <OrderDetail detail={detail} />
                        </Suspense>
                    ) : (
                        <AnimDiv>
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <PiTicket />
                                    </EmptyMedia>
                                    <EmptyTitle>Select an Order</EmptyTitle>
                                    <EmptyDescription>Select an order to view its details.</EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </AnimDiv>
                    )}
                </div>
            </div>
        </AnimDiv>
    )
}

export default Page
