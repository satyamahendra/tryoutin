import AnimDiv from "@/components/custom/anim-div"
import {Suspense} from "react"
import {Loader2} from "lucide-react"
import {Button} from "@/components/ui/button"
import FilterSidebar from "@/components/custom/filter-sidebar/filter-sidebar"
import TryoutList from "./components/tryout-list"
import TryoutDetailModal from "./components/tryout-detail-modal"
import {getTryoutCategories} from "./services/get-tryout-categories"
import {getTryoutTags} from "./services/get-tryout-tags"
import {getTryoutHero} from "./services/get-tryout-hero"
import {PiArrowDown, PiFlask, PiListChecks, PiStorefront, PiUsers} from "react-icons/pi"

type PageProps = {
    searchParams: Promise<{
        search?: string
        category?: string
        tags?: string
    }>
}

const formatNumber = (n: number) => new Intl.NumberFormat("id-ID", {notation: "compact"}).format(n)

const Page = async ({searchParams}: PageProps) => {
    const {search, category, tags} = await searchParams

    const [{categories}, {tags: allTags}, hero] = await Promise.all([getTryoutCategories(), getTryoutTags(), getTryoutHero()])

    return (
        <AnimDiv className="flex flex-col gap-4 h-full min-h-0 overflow-hidden">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary/70 text-primary-foreground px-5 py-4 md:px-6 md:py-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08),transparent_40%)]" />
                <div className="relative flex flex-col gap-2.5">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-primary-foreground/80 text-xs font-medium md:text-sm">
                            <PiStorefront className="w-3.5 h-3.5" />
                            {categories.slice(0, 3).map((c) => c.label).join(" · ")}
                        </div>
                        <h1 className="text-lg font-bold md:text-xl tracking-tight">Practice Smarter. Pass With Confidence.</h1>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                        <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-primary-foreground/90">
                            <div className="flex items-center gap-1.5">
                                <PiFlask className="w-3.5 h-3.5 text-primary-foreground" />
                                <span><strong className="font-semibold">{formatNumber(hero.tryoutCount)}</strong> Tryouts</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <PiListChecks className="w-3.5 h-3.5 text-primary-foreground" />
                                <span><strong className="font-semibold">{formatNumber(hero.questionCount)}</strong> Questions</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <PiUsers className="w-3.5 h-3.5 text-primary-foreground" />
                                <span><strong className="font-semibold">{formatNumber(hero.learnerCount)}</strong> Learners</span>
                            </div>
                        </div>
                        <Button asChild size="sm" variant="secondary" className="font-semibold">
                            <a href="#tryout-list">
                                Browse Tryouts
                                <PiArrowDown className="!size-3.5" />
                            </a>
                        </Button>
                    </div>
                </div>
            </div>

            <FilterSidebar searchPlaceholder="Search tryouts..." categories={categories} tags={allTags} />

            <div className="flex flex-col flex-1 min-h-0">
                <Suspense
                    key={`${search}-${category}-${tags}`}
                    fallback={
                        <div className="flex items-center justify-center h-20">
                            <Loader2 className="animate-spin text-primary" />
                        </div>
                    }>
                    <TryoutList search={search} category={category} tags={tags} />
                </Suspense>
            </div>
            <TryoutDetailModal />
        </AnimDiv>
    )
}

export default Page

