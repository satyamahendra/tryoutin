import type {Metadata} from "next"
import {PiEnvelope, PiPaperPlane, PiClock} from "react-icons/pi"
import LegalShell from "@/components/custom/legal-shell/legal-shell"

export const metadata: Metadata = {
    title: {absolute: "Kontak — tryoutin"},
    description: "Hubungi tim tryoutin.",
}

// ponytail: placeholder support address — replace with the real one (or NEXT_PUBLIC_SUPPORT_EMAIL)
const SUPPORT_EMAIL = "hello@tryoutin.com"

const ContactPage = () => {
    return (
        <LegalShell title="Kontak" description="Ada pertanyaan, masukan, atau lagi butuh bantuan soal akun? Kita siap bantu.">
            <section className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <PiEnvelope className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">Email kami</span>
                        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm text-primary hover:underline">
                            {SUPPORT_EMAIL}
                        </a>
                    </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <PiClock className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">Waktu respons</span>
                        <span className="text-sm">Kita biasanya bales dalam 1–2 hari kerja.</span>
                    </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <PiPaperPlane className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">Sebelum chat kita</span>
                        <span className="text-sm">
                            Ada pertanyaan soal akun atau pembayaran? Sertain email akun kamu biar kita bisa bantu lebih cepet. Untuk permintaan hukum, cek kebijakan{" "}
                            <a href="/privacy" className="text-primary hover:underline">
                                Kebijakan Privasi
                            </a>{" "}
                            dan{" "}
                            <a href="/terms" className="text-primary hover:underline">
                                Ketentuan
                            </a>
                            .
                        </span>
                    </div>
                </div>
            </section>
        </LegalShell>
    )
}

export default ContactPage
