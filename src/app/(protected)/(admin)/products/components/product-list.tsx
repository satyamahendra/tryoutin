import {PiTicket} from "react-icons/pi"
import AnimDiv from "@/components/custom/anim-div"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {getProducts} from "../services/get-products"
import ProductItem from "./product-item"

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
                        <PiTicket />
                    </EmptyMedia>
                    <EmptyTitle>Something Went Wrong</EmptyTitle>
                    <EmptyDescription>{data?.message}, Please try again later.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <AnimDiv>
            {data.data && data.data?.products.length > 0 ? (
                <ul className="space-y-2 w-full">
                    {data.data.products.map((product) => (
                        <li key={product.id}>
                            <ProductItem product={product} />
                        </li>
                    ))}
                </ul>
            ) : (
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PiTicket />
                        </EmptyMedia>
                        <EmptyTitle>No Products Found</EmptyTitle>
                        <EmptyDescription>There are no products found</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            )}
        </AnimDiv>
    )
}

export default ProductList
