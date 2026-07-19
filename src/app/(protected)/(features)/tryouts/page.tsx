import PageHeader from "@/components/custom/page-header/page-header"
import {PiStorefront} from "react-icons/pi"
import AnimDiv from "@/components/custom/anim-div"
import {Suspense} from "react"
import {Loader2} from "lucide-react"
import TryoutSidebar from "./_components/tryout-sidebar"
import TryoutList from "./_components/tryout-list"
import {getTryoutCategories} from "./_services/get-tryout-categories"
import {getTryoutTags} from "./_services/get-tryout-tags"

type PageProps = {
    searchParams: Promise<{
        search?: string
        category?: string
        tag?: string
    }>
}

const Page = async ({searchParams}: PageProps) => {
    const {search, category, tag} = await searchParams

    const [categoriesData, tagsData] = await Promise.all([getTryoutCategories(), getTryoutTags()])
    const categories = categoriesData.success ? categoriesData.data!.categories : []
    const tags = tagsData.success ? tagsData.data!.tags : []

    return (
        <AnimDiv className="flex flex-col gap-4">
            <PageHeader title="Tryouts" description="Browse and purchase tryouts" icon={<PiStorefront />} />
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 shrink-0">
                    <TryoutSidebar categories={categories} tags={tags} />
                </div>
                <div className="flex-1 min-w-0">
                    <Suspense
                        key={`${search}-${category}-${tag}`}
                        fallback={
                            <div className="flex items-center justify-center h-20">
                                <Loader2 className="animate-spin text-primary" />
                            </div>
                        }>
                        <TryoutList search={search} category={category} tag={tag} />
                    </Suspense>
                </div>
            </div>
        </AnimDiv>
    )
}

export default Page
