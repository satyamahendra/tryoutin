import {Button} from "@/components/ui/button"
import Link from "next/link"
import {PiCaretLeft} from "react-icons/pi"
import GoogleItem from "./components/google-item"

const Page = () => {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="w-75 flex flex-col gap-4">
                <div className="font-bold">Tryoutin</div>
                <div>Masuk ke akunmu</div>
                <GoogleItem />
                <Link href="/" className="flex items-center gap-2 hover:cursor-pointer">
                    <Button variant="link">
                        <PiCaretLeft /> beranda
                    </Button>
                </Link>
            </div>
        </main>
    )
}

export default Page
