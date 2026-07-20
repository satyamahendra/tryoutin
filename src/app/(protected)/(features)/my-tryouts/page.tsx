import AnimDiv from "@/components/custom/anim-div"
import {Suspense} from "react"
import {Loader2} from "lucide-react"
import {PiFlask, PiLightning, PiNotebook, PiTrophy} from "react-icons/pi"
import PageHeader from "@/components/custom/page-header/page-header"
import MyTryoutSidebar from "./_components/my-tryout-sidebar"
import MyTryoutList from "./_components/my-tryout-list"
import MyTryoutDetailModal from "./_components/my-tryout-detail-modal"
import {getMyTryoutCategories} from "./_services/get-my-tryout-categories"
import {getMyTryoutTags} from "./_services/get-my-tryout-tags"

type PageProps = {
    searchParams: Promise<{
        search?: string
        category?: string
        tags?: string
    }>
}

const Page = async ({searchParams}: PageProps) => {
    const {search, category, tags} = await searchParams

    const [categoriesData, tagsData] = await Promise.all([getMyTryoutCategories(), getMyTryoutTags()])
    const categories = categoriesData.success ? categoriesData.data!.categories : []
    const allTags = tagsData.success ? tagsData.data!.tags : []

    return (
        <AnimDiv className="flex flex-col gap-6">
            <PageHeader
                icon={<PiNotebook />}
                title="Your Tryout Collection"
                description="Browse and manage all the tryouts you own."
                subComponent={
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <PiLightning className="w-3.5 h-3.5" />
                            {categories.length} Categories
                        </span>
                        <span className="flex items-center gap-1">
                            <PiFlask className="w-3.5 h-3.5" />
                            {allTags.length} Tags
                        </span>
                    </div>
                }
            />

            <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-52 shrink-0 md:border-r md:border-border/60 md:pr-6">
                    <MyTryoutSidebar categories={categories} tags={allTags} />
                </div>
                <div className="flex-1 min-w-0 pt-1 md:pt-0">
                    <Suspense
                        key={`${search}-${category}-${tags}`}
                        fallback={
                            <div className="flex items-center justify-center h-20">
                                <Loader2 className="animate-spin text-primary" />
                            </div>
                        }>
                        <MyTryoutList search={search} category={category} tags={tags} />
                    </Suspense>
                </div>
            </div>
            <MyTryoutDetailModal />
        </AnimDiv>
    )
}

export default Page
