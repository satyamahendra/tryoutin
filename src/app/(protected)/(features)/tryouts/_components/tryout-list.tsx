import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {getTryouts} from "../_services/get-tryouts"
import {PiMagnifyingGlass, PiPackage} from "react-icons/pi"
import AnimDiv from "@/components/custom/anim-div"
import TryoutCard from "./tryout-card"

type TryoutListProps = {
    search?: string
    category?: string
    tag?: string
}

const TryoutList = async ({search, category, tag}: TryoutListProps) => {
    const data = await getTryouts({search, category, tag})

    if (!data.success) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PiPackage />
                    </EmptyMedia>
                    <EmptyTitle>Something Went Wrong</EmptyTitle>
                    <EmptyDescription>{data?.message}. Please try again later.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    if (!data.data || data.data.tryouts.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-border py-12">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PiMagnifyingGlass />
                        </EmptyMedia>
                        <EmptyTitle>No Tryouts Found</EmptyTitle>
                        <EmptyDescription>{search || category || tag ? "Try adjusting your filters." : "No tryouts available yet."}</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        )
    }

    return (
        <AnimDiv className="flex flex-col gap-3">
            {data.data.tryouts.map((tryout) => (
                <TryoutCard key={tryout.id} tryout={tryout} />
            ))}
        </AnimDiv>
    )
}

export default TryoutList
