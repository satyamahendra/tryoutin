import Link from "next/link"
import {PiLightning} from "react-icons/pi"

const Footer = () => {
    const year = new Date().getFullYear()
    return (
        <footer className="border-t border-foreground/10">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-foreground/60 sm:flex-row">
                <span className="flex items-center gap-2">
                    tryoutin
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
                <span>© {year} tryoutin. All rights reserved.</span>
            </div>
        </footer>
    )
}

export default Footer
