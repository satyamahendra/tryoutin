import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {ScrollArea} from "@/components/ui/scroll-area"
import {PiMagnifyingGlass, PiTrophy} from "react-icons/pi"
import {getLeaderboardExams} from "../services/get-leaderboard-exams"
import LeaderboardCard from "./leaderboard-card"
import AnimDiv from "@/components/custom/anim-div"

const LeaderboardGrid = async ({search, category, tags}: {search?: string; category?: string; tags?: string}) => {
    const {exams} = await getLeaderboardExams({search, category, tags})

    if (exams.length === 0) {
        const hasFilters = search || category || tags
        return (
            <AnimDiv className="rounded-xl border border-dashed border-border py-16">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">{hasFilters ? <PiMagnifyingGlass /> : <PiTrophy />}</EmptyMedia>
                        <EmptyTitle>{hasFilters ? "No matching tryouts" : "No leaderboards yet"}</EmptyTitle>
                        <EmptyDescription>
                            {hasFilters ? "Try adjusting your filters to find what you're looking for." : "Tryouts will appear here once they go live."}
                        </EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </AnimDiv>
        )
    }

    return (
        <AnimDiv className="flex flex-col gap-3 flex-1 min-h-0">
            <span className="text-sm text-muted-foreground">
                {exams.length} {exams.length === 1 ? "tryout" : "tryouts"}
            </span>
            <ScrollArea className="flex-1 min-h-0 pr-3">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                    {exams.map((exam) => (
                        <LeaderboardCard key={exam.id} exam={exam} />
                    ))}
                </div>
            </ScrollArea>
        </AnimDiv>
    )
}

export default LeaderboardGrid
