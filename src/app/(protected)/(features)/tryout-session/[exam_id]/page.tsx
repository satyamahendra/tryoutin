import type {Metadata} from "next"
import TryoutSessionPage from "./tryout-session"

export const metadata: Metadata = {
    title: "Sesi Tryout",
    description: "Ikuti simulasi berbatas waktu atau berlatih mengerjakan tryout dengan umpan balik instan.",
}

const Page = () => <TryoutSessionPage />

export default Page