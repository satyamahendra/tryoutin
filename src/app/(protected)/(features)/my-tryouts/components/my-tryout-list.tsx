import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {ScrollArea} from "@/components/ui/scroll-area"
import AnimDiv from "@/components/custom/anim-div"
import {PiMagnifyingGlass, PiPackage} from "react-icons/pi"
import {getMyTryouts} from "../services/get-my-tryouts"
import MyTryoutCard from "./my-tryout-card"

type MyTryoutListProps = {
    search?: string
    category?: string
    tags?: string
}

const MyTryoutList = async ({search, category, tags}: MyTryoutListProps) => {
    const data = await getMyTryouts({search, category, tags})

    if (data.tryouts.length === 0) {
        const hasFilters = search || category || tags
        return (
            <AnimDiv className="rounded-xl border border-dashed border-border py-16">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            {hasFilters ? <PiMagnifyingGlass /> : <PiPackage />}
                        </EmptyMedia>
                        <EmptyTitle>{hasFilters ? "No matching tryouts" : "No tryouts in your collection"}</EmptyTitle>
                        <EmptyDescription>
                            {hasFilters ? "Try adjusting your filters to find what you're looking for." : "Browse the marketplace to add tryouts to your collection."}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </AnimDiv>
        )
    }

    return (
        <AnimDiv className="flex flex-col gap-3 flex-1 min-h-0">
            <div className="flex items-center justify-between px-1">
                <span className="text-sm text-muted-foreground">
                    {data.tryouts.length} {data.tryouts.length === 1 ? "tryout" : "tryouts"} in your collection
                </span>
            </div>
            <ScrollArea className="flex-1 min-h-0 pr-3">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {data.tryouts.map((tryout) => (
                        <MyTryoutCard key={tryout.id} tryout={tryout} />
                    ))}
                </div>
            </ScrollArea>
        </AnimDiv>
    )
}

export default MyTryoutList

