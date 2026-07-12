"use client"

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
        <div className="bg-muted hover:bg-muted/50 duration-200 p-2 rounded-xl border">
            <div className="flex gap-2">
                <div>
                    {product.is_active ? (
                        <div className="text-green-500 flex items-center gap-1">
                            <PiCircleFill className="text-lg" />
                        </div>
                    ) : (
                        <div className="text-muted-foreground flex items-center gap-1">
                            <PiCircle className="text-lg" />
                        </div>
                    )}
                </div>
                <div>
                    <div>{product.name}</div>
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
                </div>
                <div className="ml-auto">
                    <Button className="rounded-lg" onClick={() => setParams({view: product.id})} size={"icon-sm"} variant="outline">
                        <PiPencil />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProductItem
