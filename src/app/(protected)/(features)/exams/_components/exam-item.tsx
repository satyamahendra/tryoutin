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
            <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader>
                    <CardTitle className="line-clamp-2 text-base">{exam.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    {exam.description && <p className="line-clamp-2 text-sm text-muted-foreground">{exam.description}</p>}
                    <div className="flex flex-wrap items-center gap-2">
                        {exam.duration_minutes && (
                            <Badge variant="outline" className="gap-1">
                                <Clock className="size-3" />
                                {exam.duration_minutes} min
                            </Badge>
                        )}
                        {exam.parts.length > 0 && (
                            <Badge variant="outline" className="gap-1">
                                <FileText className="size-3" />
                                {exam.parts.length} parts
                            </Badge>
                        )}
                        {questionCount > 0 && (
                            <Badge variant="outline" className="gap-1">
                                <HelpCircle className="size-3" />
                                {questionCount} questions
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default ExamItem
