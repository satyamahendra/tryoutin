import PageHeader from "@/components/custom/page-header/page-header"
import {PiTag} from "react-icons/pi"
import {hasPermissions} from "@/utils/helpers/has-ability-server"
import {redirect} from "next/navigation"
import AnimDiv from "@/components/custom/anim-div"
import {getTags} from "./_services/get-tags"
import TagList from "./_components/tag-list"

const Page = async () => {
    const hasPerm = await hasPermissions(["read tags", "manage tags"])
    if (!hasPerm) return redirect("/home")

    const data = await getTags()
    const tags = data.success ? data.data!.tags : []

    return (
        <AnimDiv className="flex flex-col gap-4">
            <PageHeader title="Tags" description="Manage exam tags" icon={<PiTag />} />
            <TagList tags={tags} />
        </AnimDiv>
    )
}

export default Page
