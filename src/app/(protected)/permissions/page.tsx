import PageHeader from "@/components/custom/page-header.tsx/page-header"
import {PiKey} from "react-icons/pi"

const Page = () => {
    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Permissions" description="Manage permissions" icon={<PiKey />} />
        </div>
    )
}

export default Page
