import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {getTryouts} from "../services/get-tryouts"
import {PiMagnifyingGlass, PiPackage} from "react-icons/pi"
import AnimDiv from "@/components/custom/anim-div"
import TryoutCard from "./tryout-card"

type TryoutListProps = {
    search?: string
    category?: string
    tags?: string
}

const TryoutList = async ({search, category, tags}: TryoutListProps) => {
    const data = await getTryouts({search, category, tags})

    if (data.tryouts.length === 0) {
        const hasFilters = search || category || tags
        return (
            <div className="rounded-xl border border-dashed border-border py-16">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            {hasFilters ? <PiMagnifyingGlass /> : <PiPackage />}
                        </EmptyMedia>
                        <EmptyTitle>{hasFilters ? "No matching tryouts" : "No tryouts yet"}</EmptyTitle>
                        <EmptyDescription>
                            {hasFilters ? "Try adjusting your filters to find what you're looking for." : "Check back later for new tryouts."}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        )
    }

    return (
        <AnimDiv className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
                <span className="text-sm text-muted-foreground">
                    {data.tryouts.length} {data.tryouts.length === 1 ? "tryout" : "tryouts"} available
                </span>
            </div>
            {data.tryouts.map((tryout) => (
                <TryoutCard key={tryout.id} tryout={tryout} />
            ))}
        </AnimDiv>
    )
}

export default TryoutList

