"use client"

import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area"
import {ReactNode} from "react"

type CategoryRowProps = {
    children: ReactNode
}

const CategoryRow = ({children}: CategoryRowProps) => {
    return (
        <div className="md:hidden">
            <ScrollArea className="w-full">
                <div className="flex gap-4 pb-4 pr-4">{children}</div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}

export default CategoryRow
