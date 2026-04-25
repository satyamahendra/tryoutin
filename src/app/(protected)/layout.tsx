import AuthGuard from "@/components/custom/auth-guard"

type LayoutProps = {
    children: React.ReactNode
    params: Promise<{[key: string]: string}>
}

const Layout = ({children}: LayoutProps) => {
    return <AuthGuard>{children}</AuthGuard>
}

export default Layout
