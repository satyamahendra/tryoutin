import Link from "next/link"
import {PiLightning} from "react-icons/pi"
import {authServer} from "@/lib/auth-server"
import Footer from "@/components/custom/footer/footer"
import {Button} from "@/components/ui/button"

type LegalShellProps = {
    title: string
    description: string
    children: React.ReactNode
}

const LegalShell = async ({title, description, children}: LegalShellProps) => {
    const session = await authServer()
    const primaryHref = session ? "/home" : "/auth"
    const primaryLabel = session ? "Go to dashboard" : "Sign in"

    return (
        <div className="flex min-h-screen flex-col font-sans">
            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
                <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-fuchsia-600 text-primary-foreground">
                            <PiLightning className="h-4 w-4" />
                        </span>
                        <span className="text-lg font-bold tracking-tight">Svtyv</span>
                    </Link>
                    <Button asChild>
                        <Link href={primaryHref}>{primaryLabel}</Link>
                    </Button>
                </nav>
            </header>

            <main className="flex-1">
                <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:py-16">
                    <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                    <article className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">{children}</article>
                </div>
            </main>

            <Footer />
        </div>
    )
}

export default LegalShell
