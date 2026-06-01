import AnimDiv from "@/components/custom/anim-div"
import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {PiTicket} from "react-icons/pi"
import {getProduct} from "../services/get-product"
import ProductForm from "./product-form"

type OrderDetailProps = {
    detail: string
}

const ProductDetail = async ({detail}: OrderDetailProps) => {
    const data = await getProduct(detail)

    if (!data.success)
        return (
            <AnimDiv>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PiTicket />
                        </EmptyMedia>
                        <EmptyTitle>Something Went Wrong</EmptyTitle>
                        <EmptyDescription>{data.message}, Please try again later.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </AnimDiv>
        )

    const {product} = data?.data || {}

    if (!product)
        return (
            <AnimDiv>
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <PiTicket />
                        </EmptyMedia>
                        <EmptyTitle>Order Not Found</EmptyTitle>
                        <EmptyDescription>The requested order could not be found.</EmptyDescription>
                    </EmptyHeader>
                </Empty>
            </AnimDiv>
        )

    return (
        <AnimDiv>
            <ProductForm product={product} />
        </AnimDiv>
    )
}

export default ProductDetail
