import AnimDiv from "@/components/custom/anim-div"
import type {Metadata} from "next"
import {Suspense} from "react"
import {Loader2} from "lucide-react"
import {PiSquaresFour, PiTag, PiTrophy} from "react-icons/pi"
import PageHeader from "@/components/custom/page-header/page-header"
import FilterSidebar from "@/components/custom/filter-sidebar/filter-sidebar"
import LeaderboardGrid from "./components/leaderboard-grid"
import LeaderboardModal from "./components/leaderboard-modal"
import {getLeaderboardFilters} from "./services/get-leaderboard-filters"

export const metadata: Metadata = {
    title: "Leaderboards",
    description: "See who tops each tryout across the platform.",
}

type PageProps = {
    searchParams: Promise<{
        search?: string
        category?: string
        tags?: string
    }>
}

const Page = async ({searchParams}: PageProps) => {
    const {search, category, tags} = await searchParams
    const {categories, tags: allTags} = await getLeaderboardFilters()

    return (
        <AnimDiv className="flex flex-col gap-4 h-full min-h-0 overflow-hidden">
            <PageHeader
                icon={<PiTrophy />}
                title="Leaderboards"
                description="See who tops each tryout across the platform."
                subComponent={
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <PiSquaresFour className="w-3.5 h-3.5" />
                            {categories.length} Categories
                        </span>
                        <span className="flex items-center gap-1">
                            <PiTag className="w-3.5 h-3.5" />
                            {allTags.length} Tags
                        </span>
                    </div>
                }
            />

            <FilterSidebar searchPlaceholder="Search tryouts..." categories={categories} tags={allTags} />

            <div className="flex flex-col flex-1 min-h-0">
                <Suspense
                    key={`${search}-${category}-${tags}`}
                    fallback={
                        <div className="flex items-center justify-center h-20">
                            <Loader2 className="animate-spin text-primary" />
                        </div>
                    }>
                    <LeaderboardGrid search={search} category={category} tags={tags} />
                </Suspense>
            </div>
            <LeaderboardModal />
        </AnimDiv>
    )
}

export default Page
