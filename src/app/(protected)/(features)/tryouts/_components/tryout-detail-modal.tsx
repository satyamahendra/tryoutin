"use client"

import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {PiCheck, PiClock, PiListChecks, PiPackage, PiTag, PiTrophy} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {useQuery, useMutation} from "@tanstack/react-query"
import {getTryoutDetail} from "../_services/get-tryout-detail"
import {calculateDiscount} from "@/utils/helpers/calculate-discount"
import axios from "axios"
import {toast} from "sonner"
import {handleClientError} from "@/utils/helpers/handle-client-errors"
import {Loader2} from "lucide-react"
import {useScreenSize} from "@/utils/hooks/useScreenSize"
import {cn} from "@/lib/utils"

const TryoutDetailModal = () => {
    const {getParam, setParams} = useQueryParams()
    const {isMobile} = useScreenSize()
    const view = getParam("view")

    const {
        data: tryoutData,
        isLoading,
    } = useQuery({
        queryKey: ["tryout-detail", view],
        queryFn: () => getTryoutDetail(view!),
        enabled: !!view,
    })

    const tryout = tryoutData?.data

    const {mutate, isPending} = useMutation({
        mutationFn: async (data: {id_product: string}) => await axios.post("/api/midtrans/token", data),
        onSuccess: (data) => {
            window.snap.pay(data.data.data.token, {
                onSuccess: () => {
                    toast.success("Payment successful!")
                    setParams({view: ""})
                },
                onError: () => toast.error("Payment was unsuccessful."),
            })
        },
        onError: (error) => {
            toast.error(handleClientError(error))
        },
    })

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(price)
    }

    const product = tryout?.product
    const totalQuestions = tryout?.parts.reduce((sum, part) => sum + part._count.questions, 0) ?? 0
    const discount = product ? calculateDiscount(product.price_actual, product.price_alternate) : 0
    const hasDiscount = discount > 0

    return (
        <Drawer swipeDirection={isMobile ? "down" : "right"} open={!!view} onOpenChange={(open) => !open && setParams({view: ""})}>
            <DrawerContent aria-describedby="tryout-detail" className={cn(isMobile ? "h-[85vh]" : "h-full")}>
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
                    </div>
                ) : !tryout ? (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Tryout not found.</div>
                ) : (
                    <>
                        <div className="relative bg-gradient-to-br from-primary/90 via-primary to-primary/70 text-primary-foreground px-6 py-8">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
                            <div className="relative flex flex-col gap-3">
                                <DrawerHeader className="p-0 gap-2 text-left">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex flex-col gap-2">
                                            <DrawerTitle className="text-xl font-bold text-primary-foreground leading-snug">{tryout.title}</DrawerTitle>
                                            {tryout.description && <DrawerDescription className="text-primary-foreground/80 text-sm leading-relaxed">{tryout.description}</DrawerDescription>}
                                        </div>
                                        {tryout.category && (
                                            <Badge variant="secondary" className="shrink-0 text-xs bg-white/20 text-primary-foreground border-white/30 hover:bg-white/30">
                                                {tryout.category}
                                            </Badge>
                                        )}
                                    </div>
                                    {tryout.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5">
                                            {tryout.tags.map((t) => (
                                                <Badge key={t.tag.id} variant="outline" className="text-[10px] font-normal bg-white/10 text-primary-foreground border-white/25">
                                                    {t.tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </DrawerHeader>
                                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-primary-foreground/90">
                                    <div className="flex items-center gap-1.5">
                                        <Badge variant="outline" className="p-0 aspect-square bg-white/15 border-white/25">
                                            <PiListChecks />
                                        </Badge>
                                        <span>
                                            {tryout._count.parts} {tryout._count.parts === 1 ? "Part" : "Parts"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Badge variant="outline" className="p-0 aspect-square bg-white/15 border-white/25">
                                            <PiListChecks />
                                        </Badge>
                                        <span>
                                            {totalQuestions} {totalQuestions === 1 ? "Question" : "Questions"}
                                        </span>
                                    </div>
                                    {tryout.duration_minutes && (
                                        <div className="flex items-center gap-1.5">
                                            <Badge variant="outline" className="p-0 aspect-square bg-white/15 border-white/25">
                                                <PiClock />
                                            </Badge>
                                            <span>{tryout.duration_minutes} min</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-5 px-6 py-6 overflow-y-auto flex-1">
                            <div className="flex flex-col gap-3">
                                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">What you will get</h3>
                                <div className="flex flex-col gap-2.5">
                                    {tryout.parts.map((part, i) => (
                                        <div key={part.id} className="flex items-start gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm font-bold shrink-0 mt-0.5">
                                                {i + 1}
                                            </div>
                                            <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                <span className="font-medium text-sm">{part.name}</span>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <PiListChecks className="w-3 h-3" />
                                                        {part._count.questions} {part._count.questions === 1 ? "question" : "questions"}
                                                    </span>
                                                    {part.duration_minutes && (
                                                        <span className="flex items-center gap-1">
                                                            <PiClock className="w-3 h-3" />
                                                            {part.duration_minutes} min
                                                        </span>
                                                    )}
                                                    {part.passing_score != null && part.passing_score > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <PiTrophy className="w-3 h-3" />
                                                            Pass: {part.passing_score}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <PiCheck className="w-4 h-4 text-primary shrink-0 mt-1" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {product && (
                            <div className="border-t bg-muted/30 px-6 py-5">
                                {tryout.owned ? (
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 flex flex-col">
                                            <span className="text-xs text-muted-foreground">Price</span>
                                            <span className="text-xl font-bold">{formatPrice(product.price_actual)}</span>
                                        </div>
                                        <Badge variant="default" className="gap-1.5 px-5 py-2.5 text-sm">
                                            <PiCheck /> You own this
                                        </Badge>
                                    </div>
                                ) : (
                                    <div className="flex items-end justify-between gap-4">
                                        <div className="flex flex-col">
                                            {hasDiscount && <span className="text-xs text-muted-foreground line-through">{formatPrice(product.price_alternate)}</span>}
                                            <span className="text-2xl font-bold">{formatPrice(product.price_actual)}</span>
                                            {hasDiscount && (
                                                <Badge variant="destructive" className="w-fit text-xs mt-1">
                                                    <PiTag className="mr-1" />
                                                    {discount}% OFF
                                                </Badge>
                                            )}
                                        </div>
                                        <Button size="lg" className="px-8 font-semibold" disabled={isPending} onClick={() => mutate({id_product: product.id})}>
                                            {isPending ? <Loader2 className="animate-spin mr-1.5" /> : <PiPackage className="mr-1.5" />}
                                            Buy Now
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                )}
            </DrawerContent>
        </Drawer>
    )
}

export default TryoutDetailModal
