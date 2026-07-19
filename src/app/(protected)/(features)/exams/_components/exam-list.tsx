import {Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle} from "@/components/ui/empty"
import {getExams} from "../_services/get-exams"
import {PiFileText} from "react-icons/pi"
import AnimDiv from "@/components/custom/anim-div"
import ExamItem from "./exam-item"
import {Badge} from "@/components/ui/badge"
import CategoryRow from "./category-row"

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

    if (!data.data || data.data.exams.length === 0) {
        return (
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
        )
    }

    const grouped = data.data.exams.reduce(
        (acc, exam) => {
            const key = exam.category || "Other"
            if (!acc[key]) acc[key] = []
            acc[key].push(exam)
            return acc
        },
        {} as Record<string, typeof data.data.exams>
    )

    const sortedCategories = Object.keys(grouped).sort()

    return (
        <AnimDiv className="flex flex-col gap-6">
            {sortedCategories.map((category) => (
                <div key={category} className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 px-1">
                        <h2 className="text-lg font-semibold">{category}</h2>
                        <Badge variant="secondary">{grouped[category].length}</Badge>
                    </div>
                    <CategoryRow>
                        {grouped[category].map((exam) => (
                            <div key={exam.id} className="min-w-[280px] shrink-0">
                                <ExamItem exam={exam} />
                            </div>
                        ))}
                    </CategoryRow>
                    <div className="hidden grid-cols-3 gap-4 md:grid">
                        {grouped[category].map((exam) => (
                            <div key={exam.id}>
                                <ExamItem exam={exam} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </AnimDiv>
    )
}

export default ExamList
