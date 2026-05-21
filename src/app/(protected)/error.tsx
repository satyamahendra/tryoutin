"use client"

import AnimDiv from "@/components/custom/anim-div"

type Props = {
    error: Error
    reset: () => void
}

export default function Error({error}: Props) {
    return (
        <AnimDiv className="flex items-center justify-center h-20">
            <span className="text-muted-foreground">{error.message}</span>
        </AnimDiv>
    )
}
