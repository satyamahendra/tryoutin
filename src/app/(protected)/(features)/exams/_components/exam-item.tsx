import Link from "next/link"
import {GetExam} from "../_services/get-exams"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import {PiCircleFill, PiClock, PiPackage, PiQuestion} from "react-icons/pi"

type ExamItemProps = {
    exam: GetExam
}

const ExamItem = ({exam}: ExamItemProps) => {
    return (
        <Link href={`/exams/${exam.id}`} className="block">
            <Card size="sm" className="h-full my-0 transition-colors hover:bg-muted/50">
                <CardHeader>
                    <CardTitle className="line-clamp-2 text-sm">{exam.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{exam.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col w-full">
                        <ul>
                            {exam.parts.map((p) => {
                                return (
                                    <li key={p.id} className="flex items-center gap-2">
                                        <PiCircleFill size={4} />
                                        {p.name}
                                    </li>
                                )
                            })}
                        </ul>

                        <div className="flex gap-2 items-center mt-2">
                            {exam.duration_minutes && (
                                <Badge variant="outline" className="gap-1 text-[10px]">
                                    <PiClock className="size-2.5" />
                                    {exam.duration_minutes}m
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    )
}

export default ExamItem
