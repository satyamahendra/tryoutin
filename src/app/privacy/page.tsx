import type {Metadata} from "next"
import Link from "next/link"
import LegalShell from "@/components/custom/legal-shell/legal-shell"

export const metadata: Metadata = {
    title: {absolute: "Privacy Policy — Svtyv"},
    description: "How Svtyv collects, uses, and protects your data.",
}

const PrivacyPage = () => {
    return (
        <LegalShell title="Privacy Policy" description="Last updated: January 1, 2026. How Svtyv handles your information.">
            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Introduction</h2>
                <p>
                    Svtyv (&quot;we&quot;, &quot;us&quot;) helps you prepare for exams through practice and simulation tryouts. This policy explains what
                    data we collect, why we collect it, and the choices you have. By using Svtyv you agree to the practices described here.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Information we collect</h2>
                <ul className="list-disc space-y-1 pl-5">
                    <li>Account data you provide: name, email, and authentication details.</li>
                    <li>Activity data: tryouts attempted, answers, scores, and study history used to show your performance.</li>
                    <li>Payment data: handled by our payment processor (see Payments below) — we do not store full card details.</li>
                    <li>Device &amp; usage data: basic analytics that help us operate and improve the app.</li>
                </ul>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">How we use your information</h2>
                <p>
                    To operate your account, grade your attempts, generate leaderboards and performance insights, process payments, and communicate with
                    you about your account. We do not sell your personal data.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Payments</h2>
                <p>
                    Payments are processed by Midtrans. When you purchase a product, relevant billing information is collected and stored by Midtrans under
                    their own privacy policy, not by Svtyv.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Your rights</h2>
                <p>
                    Depending on your location, you may have the right to access, correct, or delete your personal data, and to object to certain processing.
                    To exercise these rights, contact us at <Link href="/contact" className="text-primary hover:underline">our contact page</Link>.
                </p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Data retention</h2>
                <p>We keep your account and activity data while your account is active, and for a limited period afterward as needed to meet legal or operational obligations.</p>
            </section>

            <section className="space-y-2">
                <h2 className="text-base font-semibold text-foreground">Changes</h2>
                <p>We may update this policy from time to time. Material changes will be reflected by the &quot;Last updated&quot; date above.</p>
            </section>
        </LegalShell>
    )
}

export default PrivacyPage
