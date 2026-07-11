"use client"

import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {useScreenSize} from "@/utils/hooks/useScreenSize"
import {cn} from "@/lib/utils"
import {PiPackage} from "react-icons/pi"

type ProductDetailDrawerProps = {
    children?: React.ReactNode
    hasDetail?: boolean
}

const ProductDetailDrawer = ({children, hasDetail}: ProductDetailDrawerProps) => {
    const {setParams} = useQueryParams()
    const {isMobile} = useScreenSize()

    return (
        <Drawer direction={isMobile ? "bottom" : "right"} open={!!hasDetail} onOpenChange={(open) => !open && setParams({detail: ""})}>
            <DrawerContent aria-describedby="product-detail" className={cn(isMobile ? "h-[80vh]" : "h-full")}>
                <DrawerHeader className="flex flex-col items-center justify-center">
                    <DrawerTitle className="flex items-center gap-2">
                        <PiPackage />
                        Product
                    </DrawerTitle>
                    <DrawerDescription>View and manage product details.</DrawerDescription>
                </DrawerHeader>

                <div className="p-6 overflow-y-auto flex-1">{children}</div>
            </DrawerContent>
        </Drawer>
    )
}

export default ProductDetailDrawer
