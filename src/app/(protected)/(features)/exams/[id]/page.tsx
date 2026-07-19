import PageHeader from "@/components/custom/page-header/page-header"
import {PiTicket} from "react-icons/pi"
import {hasPermissions} from "@/utils/helpers/has-ability-server"
import {redirect} from "next/navigation"
import AnimDiv from "@/components/custom/anim-div"
import ExamForm from "./_components/exam-form"
import {ScrollArea} from "@/components/ui/scroll-area"

type PageProps = {
    params: Promise<{id: string}>
}

const Page = async ({params}: PageProps) => {
    const hasPerm = await hasPermissions(["read exams", "manage exams"])
    if (!hasPerm) return redirect("/home")

    const {id} = await params

    return (
        <AnimDiv className="flex flex-col h-full gap-4">
            <PageHeader title="Exam detail" description="Manage exam detail" icon={<PiTicket />} />
            <ScrollArea className="overflow-y-hidden pr-4">
                <ExamForm id={id} />
            </ScrollArea>
        </AnimDiv>
    )
}

export default Page
