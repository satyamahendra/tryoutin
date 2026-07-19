import PageHeader from "@/components/custom/page-header/page-header"
import {PiFileText, PiTicket} from "react-icons/pi"
import {hasPermissions} from "@/utils/helpers/has-ability-server"
import {redirect} from "next/navigation"
import AnimDiv from "@/components/custom/anim-div"
import SearchParams from "@/components/custom/search-params"
import {Suspense} from "react"
import {Loader2} from "lucide-react"
import CreateExamButton from "./_components/create-exam-button"
import ImportExamButton from "./_components/import-exam-button"
import ExamList from "./_components/exam-list"

type PageProps = {
    searchParams: Promise<{
        search?: string
    }>
}

const Page = async ({searchParams}: PageProps) => {
    const hasPerm = await hasPermissions(["read exams", "manage exams"])
    if (!hasPerm) return redirect("/home")

    const {search} = await searchParams

    return (
        <AnimDiv className="flex flex-col gap-4">
            <PageHeader title="Exams" description="Manage exams" icon={<PiFileText />} subComponent={<div className="flex items-center gap-2"><ImportExamButton /><CreateExamButton /></div>} />
            <SearchParams className="w-48 self-end" />
            <Suspense
                key={`$${search}`}
                fallback={
                    <AnimDiv className="flex items-center justify-center h-20">
                        <span className="text-muted-foreground">
                            <Loader2 className="animate-spin text-primary" />
                        </span>
                    </AnimDiv>
                }>
                <ExamList search={search} />
            </Suspense>
        </AnimDiv>
    )
}

export default Page
