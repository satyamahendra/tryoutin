import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {getExams} from "../_services/get-exams"
import {PiFileText} from "react-icons/pi"
import AnimDiv from "@/components/custom/anim-div"
import {format} from "date-fns"
import Link from "next/link"
import ExamItem from "./exam-item"

type ExamListProps = {
    search?: string
}

const ExamList = async ({search}: ExamListProps) => {
    const data = await getExams({search})

    if (!data.success) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <PiFileText />
                    </EmptyMedia>
                    <EmptyTitle>Something Went Wrong</EmptyTitle>
                    <EmptyDescription>{data?.message}, Please try again later.</EmptyDescription>
                </EmptyHeader>
            </Empty>
        )
    }

    return (
        <AnimDiv className="flex flex-col gap-4">
            {data.data && data.data?.exams.length > 0 ? (
                <div className="overflow-hidden space-y-2">
                    {data.data.exams.map((exam) => (
                        <ExamItem key={exam.id} exam={exam} />
                    ))}
                </div>
            ) : (
                <div className="rounded-xl border border-dashed border-border py-12">
                    <Empty>
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <PiFileText />
                            </EmptyMedia>
                            <EmptyTitle>No Exams Found</EmptyTitle>
                            <EmptyDescription>There are no exams found</EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                </div>
            )}
        </AnimDiv>
    )
}

export default ExamList
