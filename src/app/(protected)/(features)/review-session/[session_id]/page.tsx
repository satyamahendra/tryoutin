import type {Metadata} from "next"
import ReviewSessionPage from "./review-session"

export const metadata: Metadata = {
    title: "Hasil Tinjauan",
    description: "Periksa jawaban tryoutmu, soal yang ditandai, dan rincian skor.",
}

const Page = () => <ReviewSessionPage />

export default Page