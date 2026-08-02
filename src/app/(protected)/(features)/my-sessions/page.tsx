import {Suspense} from "react"
import PageHeader from "@/components/custom/page-header/page-header"
import {PiClock} from "react-icons/pi"
import AnimDiv from "@/components/custom/anim-div"
import MySessionList from "./_components/my-session-list"

const Page = async () => {
    return (
        <AnimDiv className="flex flex-col gap-4">
            <PageHeader
                icon={<PiClock />}
                title="My Sessions"
                description="View and continue your tryout sessions."
            />
            <Suspense fallback={null}>
                <MySessionList />
            </Suspense>
        </AnimDiv>
    )
}

export default Page
