import AnimDiv from "@/components/custom/anim-div"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {PiCalendarDots, PiChatCentered, PiCheckCircleFill, PiCircle, PiSelection, PiTicket} from "react-icons/pi"
import {getReport} from "../services/get-report"
import {Badge} from "@/components/ui/badge"
import {normalizeString} from "@/utils/helpers/normalize-string"
import {format} from "date-fns"
import {ScrollArea} from "@/components/ui/scroll-area"
import MessageForm from "./message-form"
import {authServer} from "@/lib/auth-server"
import MarkPopover from "./mark-popover"
import {reportStatusOptions, reportTypeOptions} from "@/utils/constants/report"

type ReportDetailProps = {
    detail: string
}

const ReportDetail = async ({detail}: ReportDetailProps) => {
    const data = await getReport(detail)
    const session = await authServer()

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

    const {report} = data?.data || {}

    if (!report)
        return (
            <AnimDiv>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PiTicket />
                        </EmptyMedia>
                        <EmptyTitle>Report Not Found</EmptyTitle>
                        <EmptyDescription>The requested report could not be found.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </AnimDiv>
        )

    const thisStatus = reportStatusOptions.find((option) => option.value === report.status)
    const thisType = reportTypeOptions.find((option) => option.value === report.type)

    const displayData = [
        {label: "Type", value: normalizeString(report.type), icon: thisType?.icon},
        {label: "Status", value: normalizeString(report.status), icon: thisStatus?.icon},
        {label: "Created At", value: `Created at ${format(report.created_at, "dd MMM yyyy")}`, icon: <PiCalendarDots />},
        {label: "Resolved At", value: report.resolved_at ? `Solved at ${format(report.resolved_at, "dd MMM yyyy")}` : "Not Solved Yet", icon: <PiCalendarDots />},
    ]

    return (
        <AnimDiv className="flex flex-col h-full gap-8">
            <div>
                <div className="flex">
                    <div className="flex gap-2 items-center">
                        <Avatar className="w-10 h-10">
                            <AvatarImage src={report.user.image || undefined} />
                            <AvatarFallback>{report.user.name ? report.user.name[0].toUpperCase() : "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <div className="font-semibold text-lg">{report.user.name}</div>
                            <div className="text-muted-foreground">{report.user.email}</div>
                        </div>
                    </div>
                    <div className="ml-auto space-x-2">
                        <MarkPopover report={report} />
                    </div>
                </div>

                <ul className="flex gap-2 mt-2">
                    {displayData.map((d, index) => {
                        const className = d.label === "Status" ? thisStatus?.className : d.label === "Type" ? thisType?.className : undefined

                        return (
                            <li key={index}>
                                <Badge variant={"outline"} className={`flex items-center gap-1 p-3 ${className}`}>
                                    <div className="flex items-center gap-1 text-sm">
                                        <div className="text-md">{d.icon}</div>
                                    </div>
                                    {d.value}
                                </Badge>
                            </li>
                        )
                    })}
                </ul>
            </div>

            <div className="space-y-2">
                <div className="font-bold">{report.title}</div>
                <div className="">{report.description}</div>
            </div>

            <ScrollArea className="flex-1 h-full min-h-0 bg-muted/50 rounded-xl">
                <div className="flex flex-col gap-2 p-4">
                    {report.messages.length > 0 ? (
                        report.messages.map((message, index) => {
                            const isMine = message.sender.id === session?.user.id
                            const nextMessage = report.messages[index + 1]
                            const isLastInMinute = !nextMessage || format(message.created_at, "HH:mm") !== format(nextMessage.created_at, "HH:mm")

                            return (
                                <AnimDiv key={message.id} className={`flex flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}>
                                    <div
                                        className={`text-sm px-3.5 py-2 rounded-2xl max-w-[70%] ${
                                            isMine ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-background text-foreground rounded-tl-sm"
                                        }`}>
                                        {message.message}
                                    </div>
                                    {isLastInMinute && <span className="text-[11px] text-muted-foreground px-1">{format(message.created_at, "HH:mm")}</span>}
                                </AnimDiv>
                            )
                        })
                    ) : (
                        <AnimDiv>
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <PiChatCentered />
                                    </EmptyMedia>
                                    <EmptyTitle>Start a conversation</EmptyTitle>
                                    <EmptyDescription>Send a message to get started</EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </AnimDiv>
                    )}
                </div>
            </ScrollArea>

            <MessageForm report={report} />
        </AnimDiv>
    )
}

export default ReportDetail
