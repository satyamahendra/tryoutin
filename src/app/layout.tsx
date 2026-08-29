import {cn} from "@/lib/utils"
import type {Metadata} from "next"
import {Geist, Geist_Mono, Inter} from "next/font/google"
import "@/app/globals.css"
import {Providers} from "@/components/custom/providers/providers"
import Script from "next/script"

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://tryoutin.svtyv.com"),
    title: {
        default: "Tryout Online — CPNS, UTBK, Kedinasan & TOEFL",
        template: "%s | tryoutin",
    },
    description:
        "Tryout online untuk CPNS, UTBK, seleksi kedinasan, dan TOEFL. Simulasi ujian dengan timer, skor instan, dan pembahasan per soal. Mulai gratis, tanpa basa-basi.",
    keywords: [
        "tryout online",
        "tryout gratis",
        "tryout cpns",
        "tryout utbk",
        "tryout kedinasan",
        "simulasi toefl",
        "latihan soal",
        "simulasi ujian",
    ],
    applicationName: "tryoutin",
    openGraph: {
        siteName: "tryoutin",
        type: "website",
        locale: "id_ID",
    },
    twitter: {
        card: "summary",
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}>
            <body suppressHydrationWarning className="min-h-full flex flex-col">
                <div
                    aria-hidden
                    dangerouslySetInnerHTML={{
                        __html:
                            "<!--\nimpeccable:direction 39821024\nTHESIS: a landing page as an exam briefing printed in the info-noise idiom — dense official-looking registration marks, one enormous condensed shouting word, no soft-core SaaS hero.\nOWN-WORLD: absolute black screen-print ground, magenta + safety orange ink, hairline rules and registration crosshairs, heavy condensed display (Anton) over Inter, flat square surfaces, hazard-stripe hover on the primary action.\nSTORY: the visitor reads the page like a briefing doc: this is preparation, not a playground. Within seconds they know what it is and take the action.\nFIRST VIEWPORT: black field of faint screen-print rules; giant stacked SCORE/HIGHER display; primary fuchsia action with hazard-stripe hover; registration marks at the margins.\nFORM: challenger tdr-info-noise-sleeve, seed 39821024.\nFINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.\n-->",
                    }}
                />
                <Providers>{children}</Providers>
                <Script
                    src={`${process.env.NEXT_PUBLIC_MIDTRANS_URL}/snap/snap.js`}
                    data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
                    strategy="lazyOnload"
                />
            </body>
        </html>
    )
}
