import AnimDiv from "@/components/custom/anim-div"
import {Suspense} from "react"
import {Loader2} from "lucide-react"
import TryoutSidebar from "./_components/tryout-sidebar"
import TryoutList from "./_components/tryout-list"
import TryoutDetailModal from "./_components/tryout-detail-modal"
import {getTryoutCategories} from "./_services/get-tryout-categories"
import {getTryoutTags} from "./_services/get-tryout-tags"
import {PiFlask, PiLightning, PiStorefront, PiTrophy} from "react-icons/pi"

type PageProps = {
    searchParams: Promise<{
        search?: string
        category?: string
        tags?: string
    }>
}

const Page = async ({searchParams}: PageProps) => {
    const {search, category, tags} = await searchParams

    const [categoriesData, tagsData] = await Promise.all([getTryoutCategories(), getTryoutTags()])
    const categories = categoriesData.success ? categoriesData.data!.categories : []
    const allTags = tagsData.success ? tagsData.data!.tags : []

    return (
        <AnimDiv className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary/70 text-primary-foreground px-6 pb-5 pt-6 md:px-8 md:pt-8 md:pb-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08),transparent_40%)]" />
                <div className="relative flex flex-col gap-3">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-primary-foreground/70 text-sm font-medium">
                            <PiStorefront className="w-4 h-4" />
                            Marketplace
                        </div>
                        <h1 className="text-xl font-bold md:text-2xl">Find Your Perfect Tryout</h1>
                        <p className="text-primary-foreground/80 text-sm max-w-md leading-relaxed">
                            Practice with real exam simulations. Choose from various categories and start your preparation journey today.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-primary-foreground/80">
                        <div className="flex items-center gap-1.5">
                            <PiLightning className="w-4 h-4 text-primary-foreground" />
                            <span>{categories.length} Categories</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <PiFlask className="w-4 h-4 text-primary-foreground" />
                            <span>{allTags.length} Tags</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-52 shrink-0 md:border-r md:border-border/60 md:pr-6">
                    <TryoutSidebar categories={categories} tags={allTags} />
                </div>
                <div className="flex-1 min-w-0 pt-1 md:pt-0">
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
            </div>
            <TryoutDetailModal />
        </AnimDiv>
    )
}

export default Page
