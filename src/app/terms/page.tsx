import type {Metadata} from "next"
import Link from "next/link"
import LegalShell from "@/components/custom/legal-shell/legal-shell"

export const metadata: Metadata = {
    title: {absolute: "Terms of Service — Svtyv"},
    description: "The terms that govern your use of Svtyv.",
}

const TermsPage = () => {
    return (
        <LegalShell title="Terms of Service" description="Last updated: January 1, 2026. The agreement between you and Svtyv.">
            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Acceptance of terms</h2>
                <p>
                    By creating an account or using Svtyv, you agree to these Terms. If you do not agree, do not use the service.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Accounts</h2>
                <p>
                    You are responsible for keeping your account credentials secure and for all activity under your account. You must provide accurate
                    information and be at least the minimum age required in your jurisdiction to use Svtyv.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Acceptable use</h2>
                <ul className="list-disc space-y-1 pl-5">
                    <li>Do not share, resell, or redistribute purchased tryout content.</li>
                    <li>Do not attempt to cheat, scrape, or disrupt the service or other users.</li>
                    <li>Do not use Svtyv for any unlawful purpose.</li>
                </ul>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Subscriptions &amp; payments</h2>
                <p>
                    Paid products are processed through Midtrans. Prices are shown at checkout. Except where required by law, payments are generally
                    non-refundable; refund requests are reviewed case by case — reach out via our <Link href="/contact" className="text-primary hover:underline">contact page</Link>.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Intellectual property</h2>
                <p>All tryout content, questions, and explanations are owned by Svtyv or its licensors. You receive a personal, limited license to use them for study.</p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Disclaimers &amp; liability</h2>
                <p>
                    Svtyv is provided &quot;as is&quot; for practice purposes. We do not guarantee any exam outcome. To the maximum extent permitted by law,
                    Svtyv is not liable for indirect or consequential damages arising from your use of the service.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Termination</h2>
                <p>We may suspend or terminate accounts that violate these Terms. You can stop using Svtyv and request deletion of your data at any time.</p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Changes &amp; governing law</h2>
                <p>We may update these Terms; continued use after changes means you accept them. These Terms are governed by the laws of your jurisdiction.</p>
            </section>
        </LegalShell>
    )
}

export default TermsPage
