import PageHeader from "@/components/custom/page-header/page-header"
import {PiTicket} from "react-icons/pi"
import {hasPermissions} from "@/utils/helpers/has-ability-server"
import {redirect} from "next/navigation"
import AnimDiv from "@/components/custom/anim-div"
import SearchParams from "@/components/custom/search-params"
import {Suspense} from "react"
import {Loader2} from "lucide-react"
import OrderList from "./components/order-list"
import OrderDetailDrawer from "./components/order-detail-drawer"
import OrderDetail from "./components/order-detail"

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
        <AnimDiv className="flex flex-col gap-4">
            <PageHeader title="Orders" description="Manage orders" icon={<PiTicket />} />
            <OrderDetailDrawer hasDetail={!!detail}>
                {detail && (
                    <Suspense
                        key={detail}
                        fallback={
                            <AnimDiv className="flex items-center justify-center h-20">
                                <Loader2 className="animate-spin text-primary" />
                            </AnimDiv>
                        }>
                        <OrderDetail detail={detail} />
                    </Suspense>
                )}
            </OrderDetailDrawer>
            <SearchParams className="w-48 self-end" />
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
        </AnimDiv>
    )
}

export default Page
