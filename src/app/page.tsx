import type {Metadata} from "next"
import Link from "next/link"
import {authServer} from "@/lib/auth-server"
import Reveal from "@/components/custom/reveal"
import Footer from "@/components/custom/footer/footer"
import ThemeToggle from "@/components/custom/theme-toggle"
import {PiArrowRight} from "react-icons/pi"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tryoutin.svtyv.com"

export const metadata: Metadata = {
    title: {
        absolute: "Tryout Online Gratis — Lulus CPNS, Masuk PTN, & TOEFL",
    },
    description:
        "Latihan soal tryout online gratis buat lulus CPNS, UTBK, masuk PTN & BUMN, seleksi kedinasan, dan TOEFL. Timer seperti ujian asli, skor instan, pembahasan per soal. Mulai gratis sekarang.",
    keywords: [
        "tryout online",
        "tryout gratis",
        "tryout cpns",
        "tryout utbk",
        "tryout sbmptn",
        "tryout kedinasan",
        "latihan soal cpns",
        "latihan soal utbk",
        "simulasi toefl",
        "latihan soal",
        "simulasi ujian",
        "belajar cpns",
        "persiapan utbk",
        "masuk ptn",
        "masuk bumn",
    ],
    openGraph: {
        title: "tryoutin — Lulus CPNS, Masuk PTN, Lolos BUMN & Kedinasan",
        description:
            "Latihan soal realistis dengan timer ujian asli, skor instan, dan pembahasan per soal. Persiapan terbaik buat lulus CPNS, masuk PTN & BUMN, kedinasan, dan TOEFL. Mulai gratis.",
    },
    alternates: {
        canonical: siteUrl,
    },
}

const features = [
    {
        title: "Mode simulasi",
        description:
            "Tryout full-length dengan kondisi seperti ujian asli. Timer per bagian, tanpa jeda, tanpa jalan pintas. Latihan di hari latihan, bukan di hari H.",
    },
    {
        title: "Mode latihan",
        description:
            "Latihan soal per bagian dengan kecepatanmu sendiri. Jawab, langsung tahu benar atau salah, sambil materinya masih ada di layar.",
    },
    {
        title: "Skor per bagian",
        description:
            "Skor objektif dan skor TKP dipecah per bagian dan per soal. Lihat persis di mana posisimu dan bagian mana yang harus dinaikkan.",
    },
    {
        title: "Pembahasan mendalam",
        description:
            "Setiap jawaban dijelaskan setelah waktu habis. Pelajari ulang soal yang kamu ragukan dan cari tahu di mana nilai bocor.",
    },
]

const steps = [
    {
        title: "Buat akunmu",
        description: "Gratis dalam semenit. Tanpa kartu, tanpa komitmen.",
    },
    {
        title: "Pilih tryoutmu",
        description: "Dari latihan per bidang sampai simulasi penuh. Sekali kamu memilikinya, tersedia selamanya.",
    },
    {
        title: "Kerjakan, langsung dinilai",
        description: "Skor instan, peringkat per bagian, dan pembahasan lengkap begitu kamu submit.",
    },
]

// ponytail: static JSON-LD for rich results; only claims things the product actually does
const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "tryoutin",
    url: siteUrl,
    description:
        "Latihan soal tryout online gratis untuk lulus CPNS, masuk PTN & BUMN, seleksi kedinasan, dan TOEFL. Timer seperti ujian asli, skor instan, dan pembahasan per soal.",
    applicationCategory: "EducationalApplication",
    inLanguage: "id",
    offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
    },
}

const RegMark = ({className = ""}: {className?: string}) => (
    <span aria-hidden className={`pointer-events-none absolute flex items-center justify-center ${className}`}>
        <span className="h-px w-6 bg-primary/50" />
        <span className="absolute h-6 w-px bg-primary/50" />
    </span>
)

export default async function Home() {
    const session = await authServer()
    const primaryHref = session ? "/home" : "/auth"
    const primaryLabel = session ? "Ke dashboard" : "Mulai latihan gratis"

    const cta = (extra = "") =>
        `group relative inline-flex items-center justify-center gap-2 bg-primary px-8 py-3 text-sm font-bold tracking-wide text-primary-foreground uppercase transition-transform hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary after:absolute after:inset-0 after:bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.18)_0px,rgba(0,0,0,0.18)_7px,transparent_7px,transparent_14px)] after:opacity-0 after:transition-opacity after:duration-300 group-hover:after:opacity-100 ${extra}`

    return (
        <main className="relative flex min-h-screen flex-col overflow-x-clip bg-background font-sans text-foreground selection:bg-primary/40">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                }}
            />

            {/* Screen-print background field */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent_0px,transparent_26px,color-mix(in_oklab,var(--primary)_5%,transparent)_26px,color-mix(in_oklab,var(--primary)_5%,transparent)_27px),repeating-linear-gradient(135deg,transparent_0px,transparent_34px,rgba(249,115,22,0.04)_34px,rgba(249,115,22,0.04)_35px)]" />
                <div className="absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_9%,transparent),transparent_70%)]" />
            </div>

            <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                        <span className="text-lg font-bold tracking-wide uppercase">tryoutin</span>
                    </Link>
                    <div className="hidden items-center gap-7 text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase sm:flex">
                        <Link href="#features" className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                            Fitur
                        </Link>
                        <Link href="#how" className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary">
                            Cara kerja
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        {!session && (
                            <Link
                                href="/auth"
                                className="hidden text-[11px] font-bold tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:inline-block"
                            >
                                Masuk
                            </Link>
                        )}
                        <Link href={primaryHref} className={cta("px-4 py-2 text-[11px]")}>
                            {primaryLabel}
                            <PiArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Hero — the shouting word */}
            <section className="relative mx-auto flex min-h-[80vh] w-full max-w-6xl flex-col items-center justify-center px-4 py-24 text-center">
                <RegMark className="left-2 top-20 md:left-6 md:top-28" />
                <RegMark className="right-2 top-20 md:right-6 md:top-28" />
                <RegMark className="bottom-2 left-2 md:bottom-8 md:left-6" />
                <RegMark className="bottom-2 right-2 md:bottom-8 md:right-6" />

                <Reveal>
                    <p className="text-[10px] font-bold tracking-[0.35em] text-primary uppercase">
                        Lulus ujian · Masuk PTN · Lolos BUMN & CPNS
                    </p>
                </Reveal>

                <Reveal delay={0.08}>
                    <h1 className="mt-6 text-6xl font-black leading-none tracking-tight text-foreground uppercase sm:text-8xl">
                        <span className="block">Lulus</span>
                        <span className="block text-primary">Ujian</span>
                    </h1>
                    <p className="mt-3 text-sm font-bold tracking-[0.3em] text-foreground/70 uppercase">
                        Masuk PTN. Lolos CPNS, BUMN &amp; kedinasan
                    </p>
                </Reveal>

                <Reveal delay={0.16}>
                    <p className="mx-auto mt-8 max-w-md text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
                        Latihan soal dengan simulasi yang persis ujian aslinya —
                        timer, skor instan, dan pembahasan per soal. Dari tryout CPNS,
                        UTBK, kedinasan, sampai TOEFL, semua dikerjakan dari rumah,
                        gratis. Format latihanmu hari ini, lulus di hari H.
                    </p>
                </Reveal>

                <Reveal delay={0.24}>
                    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                        <Link href={primaryHref} className={cta()}>
                            {primaryLabel}
                            <PiArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="#how"
                            className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold tracking-wide text-foreground uppercase ring-1 ring-border transition-colors hover:ring-foreground/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            Lihat caranya
                        </Link>
                    </div>
                </Reveal>
            </section>

            {/* Features — dense catalog cells */}
            <section id="features" className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
                <Reveal>
                    <div className="mb-14 max-w-xl">
                        <h2 className="text-4xl font-black tracking-tight text-foreground uppercase sm:text-6xl">
                            Fitur unggulan
                        </h2>
                        <p className="mt-4 text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
                            Semua yang kamu butuhkan untuk lulus di hari H — 
                            dari skor instan sampai pembahasan tiap soal.
                        </p>
                    </div>
                </Reveal>

                <div className="grid gap-px bg-border sm:grid-cols-2">
                    {features.map((f, i) => (
                        <div key={f.title} className="group bg-card">
                            <Reveal delay={i * 0.05}>
                                <div className="relative h-full border border-border p-7 transition-colors duration-300 group-hover:border-primary/60 sm:p-9">
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-primary">
                                            F-0{i + 1}
                                        </span>
                                        <h3 className="text-xl font-extrabold tracking-tight text-foreground uppercase">
                                            {f.title}
                                        </h3>
                                        <p className="max-w-md text-sm font-normal leading-relaxed text-muted-foreground">
                                            {f.description}
                                        </p>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    ))}
                </div>
            </section>

            {/* How it works — sequence */}
            <section id="how" className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
                <Reveal>
                    <div className="mb-14 max-w-xl">
                        <h2 className="text-4xl font-black tracking-tight text-foreground uppercase sm:text-6xl">
                            Cara kerja
                        </h2>
                        <p className="mt-4 text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
                            Antara kamu dan bangku yang kamu incar (PTN, CPNS, BUMN) 
                            cuma tiga langkah latihan.
                        </p>
                    </div>
                </Reveal>

                <div className="grid gap-10 sm:grid-cols-3 sm:gap-6">
                    {steps.map((s, i) => (
                        <Reveal key={s.title} delay={i * 0.08}>
                            <div className="border-t-2 border-primary/70 pt-6">
                                <span className="text-5xl font-black text-foreground/15">0{i + 1}</span>
                                <h3 className="mt-4 text-base font-extrabold tracking-tight text-foreground uppercase">
                                    {s.title}
                                </h3>
                                <p className="mt-2 text-sm font-normal leading-relaxed text-muted-foreground">
                                    {s.description}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* CTA — flat panel */}
            <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
                <Reveal>
                    <div className="relative border-2 border-primary/70 bg-card p-8 text-center sm:p-16">
                        <RegMark className="left-3 top-3" />
                        <RegMark className="right-3 top-3" />
                        <RegMark className="bottom-3 left-3" />
                        <RegMark className="right-3 bottom-3" />
                        <h2 className="text-3xl font-black tracking-tight text-foreground uppercase sm:text-5xl">
                            Lulus ujianmu satu tryout lagi.
                        </h2>
                        <p className="mx-auto mt-5 max-w-md text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
                            Gabung dengan mereka yang masuk PTN, lolos CPNS, dan dapet kerja di BUMN 
                            karena latihan sebelum hari H. Mulai gratis, tanpa kartu kredit.
                        </p>
                        <Link href={primaryHref} className={`${cta()} mt-9`}>
                            {primaryLabel}
                            <PiArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </Reveal>
            </section>

            <Footer />
        </main>
    )
}