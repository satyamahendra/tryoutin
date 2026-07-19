import Link from "next/link"
import {GetExam} from "../_services/get-exams"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {Clock, FileText, HelpCircle} from "lucide-react"

type ExamItemProps = {
    exam: GetExam
}

const ExamItem = ({exam}: ExamItemProps) => {
    const questionCount = exam.parts.reduce((sum, part) => sum + part._count.questions, 0)

    return (
        <Link href={`/exams/${exam.id}`} className="block">
            <Card size="sm" className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                    <CardTitle className="line-clamp-2 text-sm">{exam.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                        {exam.duration_minutes && (
                            <Badge variant="outline" className="gap-1 text-[10px]">
                                <Clock className="size-2.5" />
                                {exam.duration_minutes}m
                            </Badge>
                        )}
                        {exam.parts.length > 0 && (
                            <Badge variant="outline" className="gap-1 text-[10px]">
                                <FileText className="size-2.5" />
                                {exam.parts.length}
                            </Badge>
                        )}
                        {questionCount > 0 && (
                            <Badge variant="outline" className="gap-1 text-[10px]">
                                <HelpCircle className="size-2.5" />
                                {questionCount}
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default ExamItem
