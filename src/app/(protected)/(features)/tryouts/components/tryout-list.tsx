import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {ScrollArea} from "@/components/ui/scroll-area"
import AnimDiv from "@/components/custom/anim-div"
import {getTryouts} from "../services/get-tryouts"
import {PiMagnifyingGlass, PiPackage} from "react-icons/pi"
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
            <AnimDiv className="rounded-xl border border-dashed border-border py-16 flex-1 min-h-0 flex items-center justify-center">
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
            </AnimDiv>
        )
    }

    return (
        <AnimDiv id="tryout-list" className="flex flex-col gap-3 flex-1 min-h-0">
            <div className="flex items-center justify-between px-1">
                <h2 className="text-lg font-semibold tracking-tight">Explore Tryouts</h2>
                <span className="text-sm text-muted-foreground">
                    {data.tryouts.length} {data.tryouts.length === 1 ? "tryout" : "tryouts"} available
                </span>
            </div>
            <ScrollArea className="flex-1 min-h-0 pr-3">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {data.tryouts.map((tryout) => (
                        <TryoutCard key={tryout.id} tryout={tryout} featured={tryout.tags.some((t) => t.tag.name.toLowerCase() === "popular")} />
                    ))}
                </div>
            </ScrollArea>
        </AnimDiv>
    )
}

export default TryoutList

