import type {Metadata} from "next"
import Link from "next/link"
import {authServer} from "@/lib/auth-server"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card"
import Reveal from "@/components/custom/reveal"
import Footer from "@/components/custom/footer/footer"
import {PiArrowRight, PiBookOpen, PiChartLineUp, PiCheckCircle, PiLightning, PiMagnifyingGlass, PiPencilSimple, PiTimer, PiUserPlus} from "react-icons/pi"

export const metadata: Metadata = {
    title: "Svtyv — Score higher on exam day",
    description: "Realistic tryout simulations with scaled scoring and instant feedback. Train like it's already exam day.",
}

const features = [
    {
        icon: PiTimer,
        title: "Simulation mode",
        description: "Full-length exams under real conditions. Timed parts, no pausing, no shortcuts. You train the pressure before it counts.",
    },
    {
        icon: PiPencilSimple,
        title: "Practice mode",
        description: "Drill any part at your own pace. Instant feedback the moment you answer — you learn while the question is still on screen.",
    },
    {
        icon: PiChartLineUp,
        title: "Per-section scoring",
        description: "Objective and TKP-style points, broken down part by part and question by question. See exactly where you stand.",
    },
    {
        icon: PiBookOpen,
        title: "Deep review",
        description: "Every answer explained after the timer stops. Revisit your flagged questions and hunt down where marks slipped away.",
    },
]

const steps = [
    {
        icon: PiUserPlus,
        title: "Create your account",
        description: "Free in under a minute. No card, no commitment.",
    },
    {
        icon: PiMagnifyingGlass,
        title: "Pick your tryout",
        description: "From single-subject drills to full simulations. Own it and it's yours forever.",
    },
    {
        icon: PiCheckCircle,
        title: "Take it. Get graded.",
        description: "Instant score, per-section ranking, and a full review the second you submit.",
    },
]

export default async function Home() {
    const session = await authServer()
    const primaryHref = session ? "/home" : "/auth"
    const primaryLabel = session ? "Go to dashboard" : "Start training free"

    return (
        <main className="relative flex flex-1 flex-col font-sans">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-[500px] overflow-hidden" aria-hidden>
                <div className="absolute -top-40 left-1/2 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-fuchsia-500/10 to-transparent blur-3xl" />
            </div>

            <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur">
                <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-fuchsia-600 text-primary-foreground">
                            <PiLightning className="h-4 w-4" />
                        </span>
                        <span className="text-lg font-bold tracking-tight">Svtyv</span>
                    </Link>
                    <div className="hidden items-center gap-6 text-sm text-muted-foreground sm:flex">
                        <Link href="#features" className="transition-colors hover:text-foreground">
                            Features
                        </Link>
                        <Link href="#how" className="transition-colors hover:text-foreground">
                            How it works
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        {!session && (
                            <Button variant="ghost" asChild>
                                <Link href="/auth">Sign in</Link>
                            </Button>
                        )}
                        <Button asChild>
                            <Link href={primaryHref}>{primaryLabel}</Link>
                        </Button>
                    </div>
                </nav>
            </header>

            <section className="mx-auto flex max-w-5xl flex-col items-center px-4 pt-24 pb-16 text-center sm:pt-32">
                <Reveal>
                    <Badge variant="secondary" className="mb-6 gap-1.5 rounded-full px-3 py-1 text-xs">
                        <PiLightning className="h-3 w-3 text-primary" />
                        Your unfair advantage for exam day
                    </Badge>
                </Reveal>
                <Reveal delay={0.08}>
                    <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
                        <span className="bg-gradient-to-r from-primary via-fuchsia-500 to-primary bg-clip-text text-transparent">Score higher</span> on exam day.
                    </h1>
                </Reveal>
                <Reveal delay={0.16}>
                    <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                        Realistic simulations, scaled scoring, and instant per-question feedback. The closest thing to the real exam without leaving your desk.
                    </p>
                </Reveal>
                <Reveal delay={0.24}>
                    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
                        <Button size="lg" asChild className="gap-2 px-8 text-base">
                            <Link href={primaryHref}>
                                {primaryLabel}
                                <PiArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild className="px-8 text-base">
                            <Link href="#how">See how it works</Link>
                        </Button>
                    </div>
                </Reveal>
            </section>

            <section id="features" className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-12">
                <Reveal>
                    <div className="mb-10 text-center">
                        <p className="text-sm font-medium tracking-wide text-primary uppercase">The toolkit</p>
                        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">Everything you need to peak on exam day</h2>
                    </div>
                </Reveal>
                <div className="grid gap-4 sm:grid-cols-2">
                    {features.map((f, i) => (
                        <Reveal key={f.title} delay={i * 0.08}>
                            <Card className="group hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/5 transition-all">
                                <CardHeader>
                                    <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <f.icon className="h-5 w-5" />
                                    </span>
                                    <CardTitle className="text-lg">{f.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="leading-6">{f.description}</CardDescription>
                                </CardContent>
                            </Card>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section id="how" className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-12">
                <Reveal>
                    <div className="mb-10 text-center">
                        <p className="text-sm font-medium tracking-wide text-primary uppercase">How it works</p>
                        <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-4xl">Three steps between you and a better score</h2>
                    </div>
                </Reveal>
                <div className="grid gap-4 sm:grid-cols-3">
                    {steps.map((s, i) => (
                        <Reveal key={s.title} delay={i * 0.08}>
                            <Card className="relative text-left">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-fuchsia-600 text-primary-foreground">
                                            <s.icon className="h-5 w-5" />
                                        </span>
                                        <span className="text-4xl font-bold text-muted/70">0{i + 1}</span>
                                    </div>
                                    <CardTitle className="mt-4 text-lg">{s.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="leading-6">{s.description}</CardDescription>
                                </CardContent>
                            </Card>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="mx-auto w-full max-w-5xl px-4 py-16">
                <Reveal>
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary to-fuchsia-700 px-6 py-14 text-center text-primary-foreground sm:px-12">
                        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-3xl" aria-hidden />
                        <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">Your next score is one tryout away.</h2>
                        <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-primary-foreground/80 sm:text-base">
                            Join the ones who show up before exam day. Start free, no card required.
                        </p>
                        <Button size="lg" variant="secondary" asChild className="mt-8 gap-2 px-8 text-base">
                            <Link href={primaryHref}>
                                {primaryLabel}
                                <PiArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </Reveal>
            </section>

            <Footer />
        </main>
    )
}
