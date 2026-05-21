import AnimDiv from "@/components/custom/anim-div"
import {Loader2} from "lucide-react"

export default function Loading() {
    return (
        <AnimDiv className="flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={24} />
        </AnimDiv>
    )
}
