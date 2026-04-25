import PageHeader from "@/components/custom/page-header.tsx/page-header"
import {PiCardholder, PiHouse} from "react-icons/pi"

const Page = () => {
    return (
        <div className="flex flex-col gap-4">
            <PageHeader title="Roles" description="Manage roles" icon={<PiCardholder />} />
        </div>
    )
}

export default Page
