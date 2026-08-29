import type {Metadata} from "next"
import TryoutSessionPage from "./tryout-session"

export const metadata: Metadata = {
    title: "Tryout Session",
    description: "Take a timed simulation or practice your way through a tryout with instant feedback.",
}

const Page = () => <TryoutSessionPage />

export default Page