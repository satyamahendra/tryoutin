"use client"

import AnimDiv from "@/components/custom/anim-div"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {PiCalendarDots, PiChatCentered, PiFlag, PiX} from "react-icons/pi"
import {getReport} from "../services/get-report"
import {Badge} from "@/components/ui/badge"
import {normalizeString} from "@/utils/helpers/normalize-string"
import {format} from "date-fns"
import {ScrollArea} from "@/components/ui/scroll-area"
import MessageForm from "./message-form"
import MarkPopover from "./mark-popover"
import {reportStatusOptions, reportTypeOptions} from "@/utils/constants/report"
import {authClient} from "@/lib/auth-client"
import {useQuery} from "@tanstack/react-query"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {useScreenSize} from "@/utils/hooks/useScreenSize"
import {cn} from "@/lib/utils"
import {Loader2} from "lucide-react"

const ReportDetailDrawer = () => {
    const {setParams, getParam} = useQueryParams()
    const {isMobile} = useScreenSize()
    const {data: session} = authClient.useSession()

    const view = getParam("view") || ""

    const {data: reportData, isLoading} = useQuery({
        queryKey: ["report", view],
        queryFn: () => getReport(view),
    })

    const report = reportData?.data

    const thisStatus = reportStatusOptions.find((option) => option.value === report?.status)
    const thisType = reportTypeOptions.find((option) => option.value === report?.type)

    const displayData = [
        {label: "Type", value: normalizeString(report?.type || "-"), icon: thisType?.icon},
        {label: "Status", value: normalizeString(report?.status || "-"), icon: thisStatus?.icon},
        {
            label: "Created At",
            value: report?.created_at ? `Created at ${format(report?.created_at, "dd MMM yyyy")}` : "-",
            icon: <PiCalendarDots />,
        },
        {
            label: "Resolved At",
            value: report?.resolved_at ? `Solved at ${format(report?.resolved_at, "dd MMM yyyy")}` : "-",
            icon: <PiCalendarDots />,
        },
    ]

    return (
        <Drawer swipeDirection={isMobile ? "down" : "right"} open={!!view} onOpenChange={(open) => !open && setParams({view: ""})}>
            <DrawerContent aria-describedby="report-detail" className={cn(isMobile ? "h-[80vh]" : "h-full")}>
                <DrawerHeader className="flex flex-col items-center justify-center">
                    <DrawerTitle className="flex items-center gap-2">
                        <PiFlag />
                        Report Details
                    </DrawerTitle>
                    <DrawerDescription>View and respond to the report.</DrawerDescription>
                </DrawerHeader>

                <div className="p-6 flex-1 flex flex-col min-h-0 overflow-auto-y">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-20">
                            <Loader2 className="animate-spin text-primary" />
                        </div>
                    ) : !reportData?.success && !!view ? (
                        <Empty>
                            <EmptyHeader>
                                <EmptyMedia variant="icon">
                                    <PiX />
                                </EmptyMedia>
                                <EmptyTitle>Failed to fetch report</EmptyTitle>
                                <EmptyDescription>Failed to fetch report. Please try again.</EmptyDescription>
                            </EmptyHeader>
                        </Empty>
                    ) : (
                        <AnimDiv className="flex flex-col h-full gap-8">
                            <div>
                                <div className="flex">
                                    <div className="flex gap-2 items-center">
                                        <Avatar className="w-10 h-10">
                                            <AvatarImage src={report?.user.image || undefined} />
                                            <AvatarFallback>{report?.user.name ? report?.user.name[0].toUpperCase() : "U"}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <div className="font-semibold text-lg">{report?.user.name}</div>
                                            <div className="text-muted-foreground">{report?.user.email}</div>
                                        </div>
                                    </div>
                                    <div className="ml-auto space-x-2">{report && <MarkPopover report={report} />}</div>
                                </div>

                                <ul className="flex gap-2 mt-2 flex-wrap">
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
                                <div className="font-bold">{report?.title}</div>
                                <div className="">{report?.description}</div>
                            </div>

                            <ScrollArea className="flex-1 h-full min-h-0 bg-muted/50 rounded-xl">
                                <div className="flex flex-col gap-2 p-4">
                                    {report?.messages && report?.messages?.length > 0 ? (
                                        report?.messages?.map((message, index) => {
                                            const isMine = message.sender.id === session?.user.id
                                            const nextMessage = report?.messages?.[index + 1]
                                            const isLastInMinute = !nextMessage || format(message.created_at, "HH:mm") !== format(nextMessage.created_at, "HH:mm")

                                            return (
                                                <AnimDiv key={message.id} className={`flex flex-col gap-0.5 ${isMine ? "items-end" : "items-start"}`}>
                                                    <div
                                                        className={`text-sm px-3.5 py-2 rounded-2xl max-w-[70%] ${
                                                            isMine ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-background text-foreground rounded-tl-sm"
                                                        }`}>
                                                        {message.message}
                                                    </div>
                                                    {isLastInMinute && (
                                                        <span className="text-[11px] text-muted-foreground px-1">{format(message.created_at, "HH:mm")}</span>
                                                    )}
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

                            {report && <MessageForm report={report} />}
                        </AnimDiv>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default ReportDetailDrawer
