"use client"

import {Item, ItemContent, ItemMedia, ItemTitle} from "@/components/ui/item"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {Product} from "../services/get-products"
import {PiCircle, PiCircleFill, PiCube, PiPackage} from "react-icons/pi"
import {Separator} from "@/components/ui/separator"
import {normalizeString} from "@/utils/helpers/normalize-string"

type ProductItemProps = {
    product: Product
}

const ProductItem = ({product}: ProductItemProps) => {
    const {setParams, getParam} = useQueryParams()
    const selected = getParam("detail")

    return (
        <Item
            onClick={() => setParams({detail: product.id})}
            className={`cursor-pointer hover:bg-muted duration-200 ${selected !== product.id ? "" : "bg-muted"}`}
            size={"xs"}>
            <ItemMedia variant="icon">{product.is_active ? <PiCircleFill className="text-green-500" /> : <PiCircle className="text-muted-foreground" />}</ItemMedia>
            <ItemContent>
                <ItemTitle className="flex justify-between w-full">
                    <span>{product.name}</span>
                </ItemTitle>
                <div className="flex gap-2 text-muted-foreground">
                    <span className="flex items-center font-bold gap-2">Rp. {product.price_actual}</span>
                    <Separator orientation="vertical" />
                    <span className="flex items-center gap-1">
                        <PiCube className="text-sm" />
                        {normalizeString(product.type)}
                    </span>
                    <Separator orientation="vertical" />
                    <span className="flex items-center gap-1">
                        <PiPackage className="text-sm" />
                        {product?.bundle_items?.length}
                    </span>
                </div>
            </ItemContent>
        </Item>
    )
}

export default ProductItem
