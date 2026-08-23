import type {Metadata} from "next"
import {PiEnvelope, PiPaperPlane, PiClock} from "react-icons/pi"
import LegalShell from "@/components/custom/legal-shell/legal-shell"

export const metadata: Metadata = {
    title: "Contact — Svtyv",
    description: "Get in touch with the Svtyv team.",
}

// ponytail: placeholder support address — replace with the real one (or NEXT_PUBLIC_SUPPORT_EMAIL)
const SUPPORT_EMAIL = "hello@svtyv.com"

const ContactPage = () => {
    return (
        <LegalShell title="Contact" description="Questions, feedback, or account help? We're listening.">
            <section className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <PiEnvelope className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">Email us</span>
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
                        <span className="text-sm font-medium text-foreground">Response time</span>
                        <span className="text-sm">We usually reply within 1–2 business days.</span>
                    </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border bg-card p-4">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <PiPaperPlane className="h-5 w-5" />
                    </span>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground">Before you write</span>
                        <span className="text-sm">
                            Account or billing questions? Include the email on your account so we can help faster. For legal requests, see our{" "}
                            <a href="/privacy" className="text-primary hover:underline">
                                Privacy Policy
                            </a>{" "}
                            and{" "}
                            <a href="/terms" className="text-primary hover:underline">
                                Terms
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
