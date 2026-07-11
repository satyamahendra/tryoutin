import PageHeader from "@/components/custom/page-header/page-header"
import {PiPackage} from "react-icons/pi"
import {hasPermissions} from "@/utils/helpers/has-ability-server"
import {redirect} from "next/navigation"
import AnimDiv from "@/components/custom/anim-div"
import {Suspense} from "react"
import {Loader2} from "lucide-react"
import SearchParams from "@/components/custom/search-params"
import ProductList from "./components/product-list"
import ProductDetailDrawer from "./components/product-detail-drawer"
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
        <AnimDiv className="flex flex-col gap-4">
            <PageHeader
                title="Products"
                description="Manage products"
                icon={<PiPackage />}
                subComponent={<CreateProductButton />}
            />
            <ProductDetailDrawer hasDetail={!!detail}>
                {detail === "create" ? (
                    <AnimDiv>
                        <ProductForm />
                    </AnimDiv>
                ) : detail ? (
                    <Suspense
                        key={detail}
                        fallback={
                            <AnimDiv className="flex items-center justify-center h-20">
                                <Loader2 className="animate-spin text-primary" />
                            </AnimDiv>
                        }>
                        <ProductDetail detail={detail} />
                    </Suspense>
                ) : null}
            </ProductDetailDrawer>
            <SearchParams className="w-48 self-end" />
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
        </AnimDiv>
    )
}

export default Page
