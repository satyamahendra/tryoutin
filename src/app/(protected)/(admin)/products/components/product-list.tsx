import {PiPackage} from "react-icons/pi"
import AnimDiv from "@/components/custom/anim-div"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {getProducts} from "../services/get-products"
import ProductItem from "./product-item"
import PaginationParams from "@/components/custom/pagination-params"

type ProductListProps = {
    page?: number
    search?: string
}

const ProductList = async ({page, search}: ProductListProps) => {
    const data = await getProducts(page, search)

    if (!data.success) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PiPackage />
                    </EmptyMedia>
                    <EmptyTitle>Terjadi Kesalahan</EmptyTitle>
                    <EmptyDescription>{data?.message}, Coba lagi nanti.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <AnimDiv className="flex flex-col gap-4">
            {data.data && data.data?.products.length > 0 ? (
                <div className="overflow-hidden space-y-2">
                    {data.data.products.map((product) => (
                        <ProductItem key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-border py-12">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiPackage />
                            </EmptyMedia>
                            <EmptyTitle>Tidak Ada Produk</EmptyTitle>
                            <EmptyDescription>Tidak ada produk yang ditemukan</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            )}
            <div className="ml-auto">
                <PaginationParams className="w-fit" pageCount={data.data?.pagination.pageCount ?? 1} />
            </div>
        </AnimDiv>
    )
}

export default ProductList
