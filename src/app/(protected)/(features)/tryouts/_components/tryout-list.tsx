import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {getTryouts} from "../_services/get-tryouts"
import {PiMagnifyingGlass, PiPackage, PiWarning} from "react-icons/pi"
import AnimDiv from "@/components/custom/anim-div"
import TryoutCard from "./tryout-card"

type TryoutListProps = {
    search?: string
    category?: string
    tags?: string
}

const TryoutList = async ({search, category, tags}: TryoutListProps) => {
    const data = await getTryouts({search, category, tags})

    if (!data.success) {
        return (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 py-12">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PiWarning />
                        </EmptyMedia>
                        <EmptyTitle>Something Went Wrong</EmptyTitle>
                        <EmptyDescription>{data?.message}. Please try again later.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </div>
        )
    }

    if (!data.data || data.data.tryouts.length === 0) {
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
                    {data.data.tryouts.length} {data.data.tryouts.length === 1 ? "tryout" : "tryouts"} available
                </span>
            </div>
            {data.data.tryouts.map((tryout) => (
                <TryoutCard key={tryout.id} tryout={tryout} />
            ))}
        </AnimDiv>
    )
}

export default TryoutList
