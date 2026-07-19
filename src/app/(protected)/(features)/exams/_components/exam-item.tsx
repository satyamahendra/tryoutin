import Link from "next/link"
import {GetExam} from "../_services/get-exams"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {PiCircle, PiClock, PiPackage} from "react-icons/pi"

type ExamItemProps = {
    exam: GetExam
}

const ExamItem = ({exam}: ExamItemProps) => {
    const isActive = exam.is_active

    return (
        <Link href={`/exams/${exam.id}`} className="block">
            <Card
                size="sm"
                className={`h-full my-0 transition-colors border border-l-6 hover:bg-muted/50 ${isActive ? "border-l-primary" : "border-l-muted-/50"} h-[130px]`}>
                <CardHeader>
                    <CardTitle className="line-clamp-2 text-sm">{exam.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{exam.description}</CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                    <div className="flex flex-col w-full gap-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <Badge variant="default" className="p-0 aspect-square">
                                <PiCircle className="rotate-45" />
                            </Badge>
                            {exam.parts.length} {exam.parts.length === 1 ? "Part" : "Parts"}
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="p-0 aspect-square">
                                <PiClock />
                            </Badge>
                            {exam.duration_minutes} min
                        </div>
                        {exam.product?.name && (
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="p-0 aspect-square">
                                    <PiPackage />
                                </Badge>
                                {exam.product?.name}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default ExamItem
