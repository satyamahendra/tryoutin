import {PiTicket} from "react-icons/pi"
import AnimDiv from "@/components/custom/anim-div"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import ReportItem from "./report-item"
import {getReports} from "../services/get-reports"

type ReportListProps = {
    page?: number
    search?: string
}

const ReportList = async ({page, search}: ReportListProps) => {
    const data = await getReports(page, search)

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
            {data.data && data.data?.reports.length > 0 ? (
                <ul className="space-y-2 w-full">
                    {data.data.reports.map((report) => (
                        <li key={report.id}>
                            <ReportItem report={report} />
                        </li>
                    ))}
                </ul>
            ) : (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PiTicket />
                        </EmptyMedia>
                        <EmptyTitle>No Reports Found</EmptyTitle>
                        <EmptyDescription>There are no reports found</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}
        </AnimDiv>
    )
}

export default ReportList
