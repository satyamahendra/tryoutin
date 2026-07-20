"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {PiClock, PiEye, PiGameController, PiListChecks, PiPlay} from "react-icons/pi"
import {toast} from "sonner"
import {GetMyTryout} from "../_services/get-my-tryouts"
import {useQueryParams} from "@/utils/hooks/useQueryParams"

type MyTryoutCardProps = {
    tryout: GetMyTryout
}

const MyTryoutCard = ({tryout}: MyTryoutCardProps) => {
    const {setParams} = useQueryParams()
    const product = tryout.product
    const totalQuestions = tryout.parts.reduce((sum, part) => sum + part._count.questions, 0)

    const handleViewDetails = () => {
        if (product) setParams({view: product.id})
    }

    const handleStartTryout = () => {
        toast.info("Start Tryout feature coming soon!")
    }

    const handlePracticeMode = () => {
        toast.info("Practice Mode feature coming soon!")
    }

    return (
        <Card className="transition-all border border-l-6 border-l-primary hover:bg-muted/50 cursor-pointer group">
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

                <div className="flex items-center gap-2 pt-4 border-t flex-wrap">
                    <Button size="sm" variant="outline" onClick={handleViewDetails}>
                        <PiEye className="mr-1.5" />
                        View Details
                    </Button>
                    <Button size="sm" onClick={handleStartTryout}>
                        <PiPlay className="mr-1.5" />
                        Start Tryout
                    </Button>
                    <Button size="sm" variant="secondary" onClick={handlePracticeMode}>
                        <PiGameController className="mr-1.5" />
                        Practice Mode
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default MyTryoutCard
