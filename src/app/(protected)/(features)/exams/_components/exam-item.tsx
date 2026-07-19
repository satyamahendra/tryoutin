import Link from "next/link"
import {GetExam} from "../_services/get-exams"
import {format} from "date-fns"

type ExamItemProps = {
    exam: GetExam
}

const ExamItem = ({exam}: ExamItemProps) => {
    return (
        <Link href={`/exams/${exam.id}`}>
            {exam.title} - {format(new Date(exam.created_at), "PPP")}
        </Link>
    )
}

export default ExamItem
