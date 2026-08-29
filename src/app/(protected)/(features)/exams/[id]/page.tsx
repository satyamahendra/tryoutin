import PageHeader from "@/components/custom/page-header/page-header"
import type {Metadata} from "next"
import {PiTicket} from "react-icons/pi"
import {hasPermissions} from "@/utils/helpers/has-ability-server"
import {redirect, notFound} from "next/navigation"
import AnimDiv from "@/components/custom/anim-div"
import ExamForm from "./components/exam-form"
import {ScrollArea} from "@/components/ui/scroll-area"
import ExamActions from "./components/exam-actions"
import {getExam} from "./services/get-exam"

type PageProps = {
    params: Promise<{id: string}>
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {id} = await params
    return {
        title: id === "new" ? "New Exam" : "Exam Detail",
    }
}

const Page = async ({params}: PageProps) => {
    const hasPerm = await hasPermissions(["read exams", "manage exams"])
    if (!hasPerm) return redirect("/home")

    const {id} = await params
    const isNew = id === "new"

    let isActive = true
    if (!isNew) {
        const exam = await getExam(id)
        if (!exam.success) return notFound()
        isActive = exam.data.is_active
    }

    return (
        <AnimDiv className="flex flex-col h-full gap-4">
            <PageHeader
                title="Exam detail"
                description="Manage exam detail"
                icon={<PiTicket />}
                subComponent={!isNew ? <ExamActions id={id} isActive={isActive} /> : undefined}
            />
            <ScrollArea className="overflow-y-hidden pr-4">
                <ExamForm id={id} />
            </ScrollArea>
        </AnimDiv>
    )
}

export default Page

