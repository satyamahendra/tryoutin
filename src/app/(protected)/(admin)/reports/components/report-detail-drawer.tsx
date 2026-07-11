"use client"

import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {useScreenSize} from "@/utils/hooks/useScreenSize"
import {cn} from "@/lib/utils"
import {PiFlag} from "react-icons/pi"

type ReportDetailDrawerProps = {
    children?: React.ReactNode
    hasDetail?: boolean
}

const ReportDetailDrawer = ({children, hasDetail}: ReportDetailDrawerProps) => {
    const {setParams} = useQueryParams()
    const {isMobile} = useScreenSize()

    return (
        <Drawer
            direction={isMobile ? "bottom" : "right"}
            open={!!hasDetail}
            onOpenChange={(open) => !open && setParams({detail: ""})}>
            <DrawerContent aria-describedby="report-detail" className={cn(isMobile ? "h-[80vh]" : "h-full")}>
                <DrawerHeader>
                    <DrawerTitle className="flex items-center gap-2">
                        <PiFlag />
                        Report Details
                    </DrawerTitle>
                    <DrawerDescription>View and respond to the report.</DrawerDescription>
                </DrawerHeader>

                <div className="px-6 flex-1 flex flex-col min-h-0 overflow-hidden">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default ReportDetailDrawer
