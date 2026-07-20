import PageHeader from "@/components/custom/page-header/page-header"
import {PiReceipt} from "react-icons/pi"
import AnimDiv from "@/components/custom/anim-div"
import SearchParams from "@/components/custom/search-params"
import {Suspense} from "react"
import {Loader2} from "lucide-react"
import MyOrderList from "./_components/my-order-list"
import MyOrderDetailDrawer from "./_components/my-order-detail-drawer"

type PageProps = {
    searchParams: Promise<{
        page?: string
        search?: string
    }>
}

const Page = async ({searchParams}: PageProps) => {
    const {page, search} = await searchParams
    const pageNum = page ? parseInt(page) : 1

    return (
        <AnimDiv className="flex flex-col gap-4">
            <PageHeader title="My Orders" description="View your order history" icon={<PiReceipt />} />
            <MyOrderDetailDrawer />
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
                <MyOrderList page={pageNum} search={search} />
            </Suspense>
        </AnimDiv>
    )
}

export default Page
