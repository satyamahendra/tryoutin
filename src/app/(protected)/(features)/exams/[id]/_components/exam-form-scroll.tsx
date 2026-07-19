"use client"

import {ScrollArea} from "@/components/ui/scroll-area"
import ExamForm from "./exam-form"

type ExamFormScrollProps = {
    id: string
}

const ExamFormScroll = ({id}: ExamFormScrollProps) => {
    return (
        <ScrollArea className="flex-1">
            <ExamForm id={id} />
        </ScrollArea>
    )
}

export default ExamFormScroll
