"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {PiCheck, PiClock, PiEye, PiListChecks, PiStack, PiTag, PiTrophy} from "react-icons/pi"
import {GetTryout} from "../services/get-tryouts"
import {calculateDiscount} from "@/utils/helpers/calculate-discount"
import {useQueryParams} from "@/utils/hooks/useQueryParams"

type TryoutCardProps = {
    tryout: GetTryout & {owned: boolean}
    featured?: boolean
}

const TryoutCard = ({tryout, featured}: TryoutCardProps) => {
    const {setParams} = useQueryParams()
    const product = tryout.product
    const totalQuestions = tryout.parts.reduce((sum, part) => sum + part._count.questions, 0)
    const totalDuration = tryout.parts.reduce((sum, p) => sum + (p.duration_minutes || 0), 0)
    const discount = product ? calculateDiscount(product.price_actual, product.price_alternate) : 0
    const hasDiscount = discount > 0

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(price)
    }

    return (
        <Card
            className="h-full transition-all border border-l-6 border-l-primary hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5 cursor-pointer"
            onClick={() => product && setParams({view: product.id})}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{tryout.title}</CardTitle>
                    <div className="flex items-center gap-1.5 shrink-0">
                        {featured && (
                            <Badge className="text-[10px] gap-1 bg-amber-500 text-white">
                                <PiTrophy className="!size-3" />
                                Popular
                            </Badge>
                        )}
                        {tryout.category && (
                            <Badge className="text-xs bg-primary text-primary-foreground">
                                {tryout.category}
                            </Badge>
                        )}
                    </div>
                </div>
                {tryout.description && <p className="text-sm text-muted-foreground line-clamp-1">{tryout.description}</p>}
            </CardHeader>
            <CardContent className="flex flex-col gap-3 flex-1">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <PiStack className="w-4 h-4" />
                        {tryout._count.parts} {tryout._count.parts === 1 ? "Part" : "Parts"}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <PiListChecks className="w-4 h-4" />
                        {totalQuestions} {totalQuestions === 1 ? "Question" : "Questions"}
                    </span>
                    {totalDuration > 0 && (
                        <span className="flex items-center gap-1.5">
                            <PiClock className="w-4 h-4" />
                            {totalDuration} min
                        </span>
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
                    <div className="flex items-end justify-between pt-2 border-t mt-auto">
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

