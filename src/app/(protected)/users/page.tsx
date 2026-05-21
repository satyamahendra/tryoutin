import PageHeader from "@/components/custom/page-header.tsx/page-header"
import {Suspense} from "react"
import {PiUser} from "react-icons/pi"
import {UsersTable} from "./components/users-table"
import {Loader2} from "lucide-react"
import UserFormModal from "./components/user-form-modal"
import {hasPermissions} from "@/utils/helpers/has-ability-server"
import {redirect} from "next/navigation"
import AnimDiv from "@/components/custom/anim-div"

type PageProps = {
    searchParams: Promise<{
        page?: string
    }>
}

const Page = async ({searchParams}: PageProps) => {
    const hasPerm = await hasPermissions(["read users"])
    if (!hasPerm) return redirect("/home")

    const {page} = await searchParams
    const pageNum = page ? parseInt(page) : 1

    return (
        <AnimDiv className="flex flex-col gap-4">
            <PageHeader title="Users" description="Manage users" icon={<PiUser />} />
            <UserFormModal />
            <Suspense
                fallback={
                    <AnimDiv className="flex items-center justify-center h-20">
                        <span className="text-muted-foreground">
                            <Loader2 className="animate-spin text-primary" />
                        </span>
                    </AnimDiv>
                }>
                <UsersTable page={pageNum} />
            </Suspense>
        </AnimDiv>
    )
}

export default Page
