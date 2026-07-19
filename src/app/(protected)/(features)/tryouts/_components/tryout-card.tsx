"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {PiCheck, PiClock, PiEye, PiListChecks, PiTag} from "react-icons/pi"
import {GetTryout} from "../_services/get-tryouts"
import {calculateDiscount} from "@/utils/helpers/calculate-discount"
import {useQueryParams} from "@/utils/hooks/useQueryParams"

type TryoutCardProps = {
    tryout: GetTryout & {owned: boolean}
}

const TryoutCard = ({tryout}: TryoutCardProps) => {
    const {setParams} = useQueryParams()
    const product = tryout.product
    const totalQuestions = tryout.parts.reduce((sum, part) => sum + part._count.questions, 0)
    const discount = product ? calculateDiscount(product.price_actual, product.price_alternate) : 0
    const hasDiscount = discount > 0

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(price)
    }

    return (
        <Card
            className="transition-colors border border-l-6 border-l-primary hover:bg-muted/50 cursor-pointer"
            onClick={() => product && setParams({view: product.id})}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{tryout.title}</CardTitle>
                    {tryout.category && (
                        <Badge className="shrink-0 text-xs bg-primary text-primary-foreground">
                            {tryout.category}
                        </Badge>
                    )}
                </div>
                {tryout.description && <p className="text-sm text-muted-foreground line-clamp-2">{tryout.description}</p>}
                {tryout.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                        {tryout.tags.map((t) => (
                            <Badge key={t.tag.id} className="text-[10px] font-normal bg-muted text-muted-foreground">
                                {t.tag.name}
                            </Badge>
                        ))}
                    </div>
                )}
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <Badge variant="default" className="p-0 aspect-square">
                            <PiListChecks />
                        </Badge>
                        <span>
                            {tryout._count.parts} {tryout._count.parts === 1 ? "Part" : "Parts"}
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="p-0 aspect-square">
                            <PiListChecks />
                        </Badge>
                        <span>
                            {totalQuestions} {totalQuestions === 1 ? "Question" : "Questions"}
                        </span>
                    </div>
                    {tryout.duration_minutes && (
                        <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="p-0 aspect-square">
                                <PiClock />
                            </Badge>
                            <span>{tryout.duration_minutes} min</span>
                        </div>
                    )}
                </div>

                {tryout.parts.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {tryout.parts.map((part) => (
                            <Badge key={part.id} className="text-xs font-normal bg-muted text-muted-foreground">
                                {part.name}
                                {part.duration_minutes ? ` (${part.duration_minutes}m)` : ""}
                            </Badge>
                        ))}
                    </div>
                )}

                {product && (
                    <div className="flex items-end justify-between pt-2 border-t">
                        <div className="flex flex-col">
                            {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price_alternate)}</span>}
                            <span className="text-lg font-semibold">{formatPrice(product.price_actual)}</span>
                            {hasDiscount && (
                                <Badge variant="destructive" className="w-fit text-xs mt-0.5">
                                    <PiTag className="mr-1" />
                                    {discount}% OFF
                                </Badge>
                            )}
                        </div>
                        {tryout.owned ? (
                            <Badge variant="default" className="gap-1 px-3 py-1.5">
                                <PiCheck /> Owned
                            </Badge>
                        ) : (
                            <Button size="sm" variant="outline" onClick={(e) => {
                                e.stopPropagation()
                                setParams({view: product.id})
                            }}>
                                <PiEye className="mr-1" />
                                View Details
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default TryoutCard
