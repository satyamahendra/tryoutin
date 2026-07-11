import PageHeader from "@/components/custom/page-header/page-header"
import {PiFlag} from "react-icons/pi"
import {hasPermissions} from "@/utils/helpers/has-ability-server"
import {redirect} from "next/navigation"
import AnimDiv from "@/components/custom/anim-div"
import {Suspense} from "react"
import {Loader2} from "lucide-react"
import SearchParams from "@/components/custom/search-params"
import ReportList from "./components/report-list"
import ReportDetailDrawer from "./components/report-detail-drawer"
import ReportDetail from "./components/report-detail"

type PageProps = {
    searchParams: Promise<{
        page?: string
        search?: string
        detail?: string
    }>
}

const Page = async ({searchParams}: PageProps) => {
    const hasPerm = await hasPermissions(["read products"])
    if (!hasPerm) return redirect("/home")

    const {page, search, detail} = await searchParams
    const pageNum = page ? parseInt(page) : 1

    return (
        <AnimDiv className="flex flex-col gap-4">
            <PageHeader title="Reports" description="Manage reports" icon={<PiFlag />} />
            <ReportDetailDrawer hasDetail={!!detail}>
                {detail && (
                    <Suspense
                        key={detail}
                        fallback={
                            <AnimDiv className="flex items-center justify-center h-20">
                                <Loader2 className="animate-spin text-primary" />
                            </AnimDiv>
                        }>
                        <ReportDetail detail={detail} />
                    </Suspense>
                )}
            </ReportDetailDrawer>
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
                <ReportList page={pageNum} search={search} />
            </Suspense>
        </AnimDiv>
    )
}

export default Page
