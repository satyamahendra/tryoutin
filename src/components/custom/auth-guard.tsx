"use client"

import {authClient} from "@/lib/auth-client"
import {redirect, usePathname} from "next/navigation"
import {PiCircleDashed} from "react-icons/pi"

type AuthGuardProps = {
    children: React.ReactNode
}

export const AuthGuard = ({children}: AuthGuardProps) => {
    const {data: session, isPending} = authClient.useSession()
    const pathname = usePathname()

    if (isPending)
        return (
            <div className="w-screen h-screen flex items-center justify-center">
                <PiCircleDashed className="animate-spin text-4xl text-muted-foreground" />
            </div>
        )

    if (!session) {
        return redirect(`/auth?callback=${pathname}`)
    }

    return <>{children}</>
}

export default AuthGuard
