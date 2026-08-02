"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {PiClock, PiGameController, PiListChecks, PiPlay, PiStack} from "react-icons/pi"
import {useRouter} from "next/navigation"
import {GetMyTryout} from "../services/get-my-tryouts"
import {useQueryParams} from "@/utils/hooks/useQueryParams"

type MyTryoutCardProps = {
    tryout: GetMyTryout
}

const MyTryoutCard = ({tryout}: MyTryoutCardProps) => {
    const router = useRouter()
    const {setParams} = useQueryParams()
    const product = tryout.product
    const totalQuestions = tryout.parts.reduce((sum, part) => sum + part._count.questions, 0)
const totalDuration = tryout.parts.reduce((sum, p) => sum + (p.duration_minutes || 0), 0)

    const handleStartTryout = (e: React.MouseEvent) => {
        e.stopPropagation()
        router.push(`/tryout-session/${tryout.id}?mode=simulation`)
    }

    const handlePracticeMode = (e: React.MouseEvent) => {
        e.stopPropagation()
        const firstPart = tryout.parts[0]
        if (firstPart) {
            router.push(`/tryout-session/${tryout.id}?mode=practice&part=${firstPart.id}`)
        }
    }

    return (
        <Card
            className="h-full transition-all border border-l-6 border-l-primary hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5 cursor-pointer group"
            onClick={() => product && setParams({view: product.id})}>
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{tryout.title}</CardTitle>
                    {tryout.category && (
                        <Badge className="shrink-0 text-xs bg-primary text-primary-foreground">{tryout.category}</Badge>
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
            <CardContent className="flex flex-col gap-4 flex-1">
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

                <div className="flex items-center justify-end gap-2 pt-4 border-t flex-wrap mt-auto">
                    <Button size="sm" variant="secondary" className="flex-1" onClick={handlePracticeMode}>
                        <PiGameController className="mr-1.5" />
                        Practice
                    </Button>
                    <Button size="sm" className="flex-1" onClick={handleStartTryout}>
                        <PiPlay className="mr-1.5" />
                        Start Tryout
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default MyTryoutCard

