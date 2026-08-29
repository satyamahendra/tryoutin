import type {Metadata} from "next"
import ReviewSessionPage from "./review-session"

export const metadata: Metadata = {
    title: "Review Results",
    description: "Go through your tryout answers, flagged questions, and score breakdown.",
}

const Page = () => <ReviewSessionPage />

export default Page