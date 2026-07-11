"use client"

import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {useScreenSize} from "@/utils/hooks/useScreenSize"
import {cn} from "@/lib/utils"
import {PiTicket} from "react-icons/pi"

type OrderDetailDrawerProps = {
    children?: React.ReactNode
    hasDetail?: boolean
}

const OrderDetailDrawer = ({children, hasDetail}: OrderDetailDrawerProps) => {
    const {setParams} = useQueryParams()
    const {isMobile} = useScreenSize()

    return (
        <Drawer
            direction={isMobile ? "bottom" : "right"}
            open={!!hasDetail}
            onOpenChange={(open) => !open && setParams({detail: ""})}>
            <DrawerContent aria-describedby="order-detail" className={cn(isMobile ? "h-[80vh]" : "")}>
                <DrawerHeader>
                    <DrawerTitle className="flex items-center gap-2">
                        <PiTicket />
                        Order Details
                    </DrawerTitle>
                    <DrawerDescription>View order information and payment details.</DrawerDescription>
                </DrawerHeader>

                <div className="px-6 overflow-y-auto flex-1">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default OrderDetailDrawer
