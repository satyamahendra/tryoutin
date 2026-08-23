import {getHomeMarketplace} from "../services/get-home-marketplace"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {PiCheck, PiClock, PiListChecks, PiStack} from "react-icons/pi"
import Link from "next/link"

const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {style: "currency", currency: "IDR", minimumFractionDigits: 0}).format(price)

const NewTryouts = async () => {
    const {tryouts} = await getHomeMarketplace(6)

    if (tryouts.length === 0) return null

    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {tryouts.map((tryout) => {
                const totalQuestions = tryout.parts.reduce((sum, p) => sum + p._count.questions, 0)
                const price = tryout.product?.price_actual ?? 0
                return (
                    <Card key={tryout.id} className="flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-base leading-snug">{tryout.title}</CardTitle>
                                {tryout.category && <Badge className="shrink-0 text-xs bg-primary text-primary-foreground">{tryout.category}</Badge>}
                            </div>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3 flex-1">
                            <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                    <PiStack className="w-4 h-4" />
                                    {tryout._count.parts} {tryout._count.parts === 1 ? "Part" : "Parts"}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <PiListChecks className="w-4 h-4" />
                                    {totalQuestions} Q
                                </span>
                            </div>
                            <div className="flex items-end justify-between pt-1 border-t mt-auto">
                                <span className="text-lg font-semibold">{price > 0 ? formatPrice(price) : "Free"}</span>
                                {tryout.owned ? (
                                    <Badge variant="default" className="gap-1 px-3 py-1.5">
                                        <PiCheck /> Owned
                                    </Badge>
                                ) : (
                                    <Button asChild size="sm" variant="outline">
                                        <Link href="/tryouts">
                                            <PiClock className="mr-1" />
                                            Start
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}

export default NewTryouts
