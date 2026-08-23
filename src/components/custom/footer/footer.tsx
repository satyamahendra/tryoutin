import Link from "next/link"
import {PiLightning} from "react-icons/pi"

const Footer = () => {
    const year = new Date().getFullYear()
    return (
        <footer className="border-t">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
                <span className="flex items-center gap-2">
                    <PiLightning className="h-4 w-4 text-primary" />
                    Svtyv
                </span>
                <nav className="flex items-center gap-4">
                    <Link href="/privacy" className="transition-colors hover:text-foreground">
                        Privacy
                    </Link>
                    <Link href="/terms" className="transition-colors hover:text-foreground">
                        Terms
                    </Link>
                    <Link href="/contact" className="transition-colors hover:text-foreground">
                        Contact
                    </Link>
                </nav>
                <span>© {year} Svtyv. All rights reserved.</span>
            </div>
        </footer>
    )
}

export default Footer
