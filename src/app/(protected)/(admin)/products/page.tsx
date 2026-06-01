import PageHeader from "@/components/custom/page-header.tsx/page-header"
import {PiPackage, PiTicket} from "react-icons/pi"
import {hasPermissions} from "@/utils/helpers/has-ability-server"
import {redirect} from "next/navigation"
import AnimDiv from "@/components/custom/anim-div"
import {Suspense} from "react"
import {Loader2} from "lucide-react"
import PaginationParams from "@/components/custom/pagination-params"
import {Separator} from "@/components/ui/separator"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {ScrollArea} from "@/components/ui/scroll-area"
import SearchParams from "@/components/custom/search-params"
import ProductList from "./components/product-list"
import ProductDetail from "./components/product-detail"
import ProductForm from "./components/product-form"
import CreateProductButton from "./components/create-product-button"

type PageProps = {
    searchParams: Promise<{
        page?: string
        search?: string
        detail?: string
    }>
}

const Page = async ({searchParams}: PageProps) => {
    const hasPerm = await hasPermissions(["read products"])
    if (!hasPerm) return redirect("/home")

    const {page, search, detail} = await searchParams
    const pageNum = page ? parseInt(page) : 1

    return (
        <AnimDiv className="flex flex-col gap-4 h-full">
            <PageHeader title="Products" description="Manage products" icon={<PiPackage />} subComponent={<CreateProductButton />} />
            <SearchParams className="w-48" />

            <div className="w-full flex gap-2 h-full min-h-0">
                <div className="w-1/3 flex flex-col h-full min-h-0">
                    <ScrollArea className="flex-1 h-full min-h-0">
                        <Suspense
                            key={`${page}-${search}`}
                            fallback={
                                <AnimDiv className="flex items-center justify-center h-20">
                                    <span className="text-muted-foreground">
                                        <Loader2 className="animate-spin text-primary" />
                                    </span>
                                </AnimDiv>
                            }>
                            <ProductList page={pageNum} search={search} />
                        </Suspense>
                    </ScrollArea>
                    <PaginationParams pageCount={pageNum} className="w-fit mt-4" />
                </div>
                <Separator orientation="vertical" className="mx-4" />
                <div className="w-2/3">
                    {!detail ? (
                        <AnimDiv>
                            <Empty>
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <PiPackage />
                                    </EmptyMedia>
                                    <EmptyTitle>Select a Product</EmptyTitle>
                                    <EmptyDescription>Select a product to view its details.</EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        </AnimDiv>
                    ) : detail === "create" ? (
                        <AnimDiv key={`${detail}`}>
                            <ProductForm />
                        </AnimDiv>
                    ) : (
                        <Suspense
                            key={`${detail}`}
                            fallback={
                                <AnimDiv className="flex items-center justify-center h-20">
                                    <span className="text-muted-foreground">
                                        <Loader2 className="animate-spin text-primary" />
                                    </span>
                                </AnimDiv>
                            }>
                            <ProductDetail detail={detail} />
                        </Suspense>
                    )}
                </div>
            </div>
        </AnimDiv>
    )
}

export default Page
