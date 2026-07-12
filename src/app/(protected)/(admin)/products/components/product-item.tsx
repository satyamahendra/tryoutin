"use client"

import {Item, ItemContent, ItemMedia, ItemTitle, ItemActions} from "@/components/ui/item"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {GetProduct} from "../services/get-products"
import {PiCircle, PiCircleFill, PiCube, PiPackage, PiPencil} from "react-icons/pi"
import {Separator} from "@/components/ui/separator"
import {normalizeString} from "@/utils/helpers/normalize-string"
import {Button} from "@/components/ui/button"

type ProductItemProps = {
    product: GetProduct
}

const ProductItem = ({product}: ProductItemProps) => {
    const {setParams} = useQueryParams()

    return (
        <Item className="bg-muted hover:bg-background duration-200">
            <ItemMedia variant="icon">{product.is_active ? <PiCircleFill className="text-green-500" /> : <PiCircle className="text-muted-foreground" />}</ItemMedia>
            <ItemContent>
                <ItemTitle>{product.name}</ItemTitle>
                <div className="flex gap-2 text-muted-foreground text-sm">
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
            <ItemActions>
                <Button className="rounded-lg" onClick={() => setParams({view: product.id})} size={"icon-sm"} variant="outline">
                    <PiPencil />
                </Button>
            </ItemActions>
        </Item>
    )
}

export default ProductItem
