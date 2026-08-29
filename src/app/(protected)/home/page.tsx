import Link from "next/link"
import type {Metadata} from "next"
import {format, startOfDay, subDays} from "date-fns"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Card, CardContent} from "@/components/ui/card"
import {ScrollArea} from "@/components/ui/scroll-area"
import {authServer} from "@/lib/auth-server"
import {getMySessions} from "@/app/(protected)/(features)/my-sessions/services/get-my-sessions"
import {getMyTryouts} from "@/app/(protected)/(features)/my-tryouts/services/get-my-tryouts"
import {calcStreak, calcWeeklyInsight, dayKey} from "./lib/dashboard-stats"
import AnimDiv from "@/components/custom/anim-div"
import YourTryouts from "./components/your-tryouts"
import LeaderboardSpotlight from "./components/leaderboard-spotlight"
import NewTryouts from "./components/new-tryouts"
import {
    PiArrowRight,
    PiCalendarCheck,
    PiCheckCircle,
    PiClock,
    PiFire,
    PiListChecks,
    PiPlay,
    PiPlayCircle,
    PiStorefront,
    PiTrendUp,
    PiTrophy,
} from "react-icons/pi"

const SectionHeader = ({title, href, cta}: {title: string; href: string; cta: string}) => (
    <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{title}</h2>
        <Button variant="ghost" size="sm" asChild className="text-xs">
            <Link href={href}>
                {cta}
                <PiArrowRight className="ml-1 h-3 w-3" />
            </Link>
        </Button>
    </div>
)

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Your tryoutin dashboard — streak, recent results, and what to tackle next.",
}

const Page = async () => {
    const session = await authServer()

    const [sessionsRes, ownedRes] = await Promise.all([getMySessions(), getMyTryouts({})])
    const sessions = sessionsRes.success ? sessionsRes.data!.sessions : []
    const ownedTryouts = ownedRes.tryouts.slice(0, 3)

    const completed = sessions.filter((s) => s.status === "completed")
    const inProgress = sessions.filter((s) => s.status === "in_progress")

    const practiceDays = new Set(sessions.map((s) => dayKey(new Date(s.submitted_at ?? s.started_at))))
    const streak = calcStreak(practiceDays)
    const weekStart = subDays(startOfDay(new Date()), 6)
    const doneThisWeek = completed.filter((s) => s.submitted_at && new Date(s.submitted_at) >= weekStart).length

    const recent = [...completed]
        .sort((a, b) => new Date(b.submitted_at ?? 0).getTime() - new Date(a.submitted_at ?? 0).getTime())
        .slice(0, 3)

    const questionsAnswered = completed.reduce((n, s) => n + (s.objective_answered ?? 0), 0)
    const correct = completed.reduce((n, s) => n + (s.sc_earned ?? 0) + (s.mc_earned ?? 0), 0)
    const accuracy = questionsAnswered > 0 ? Math.round((correct / questionsAnswered) * 100) : null
    const bestScore = completed.length > 0 ? Math.max(...completed.map((s) => s.mc_score ?? 0)) : null
    const insight = calcWeeklyInsight(completed)

    const firstName = session?.user?.name?.split(" ")[0] ?? "there"

    // ponytail: hint row dropped — labels already carry the meaning; one less line per card
    const stats = [
        {icon: PiListChecks, label: "Questions answered", value: questionsAnswered, href: "/my-sessions"},
        {icon: PiPlayCircle, label: "In progress", value: inProgress.length, href: "/my-sessions"},
        {icon: PiCalendarCheck, label: "Done this week", value: doneThisWeek, href: "/my-sessions"},
        {icon: PiTrophy, label: "Best score", value: bestScore ?? "—", href: "/my-sessions"},
    ]

    return (
        <AnimDiv className="h-full min-h-0">
            <ScrollArea className="h-full min-h-0">
                <div className="flex flex-col gap-6 px-4 pb-4">
                    <header className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary/70 text-primary-foreground px-5 py-5 md:px-6 md:py-6">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.08),transparent_40%)]" />
                        <div className="relative flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl font-bold tracking-tight md:text-2xl">Welcome back, {firstName}.</h1>
                                {streak > 1 && (
                                    <Badge variant="secondary" className="gap-1 bg-white/20 text-primary-foreground border-white/30">
                                        <PiFire className="w-3.5 h-3.5" />
                                        {streak}-day streak
                                    </Badge>
                                )}
                            </div>
                            <p className="text-sm text-primary-foreground/85">
                                {inProgress.length > 0
                                    ? `${inProgress.length} tryout${inProgress.length > 1 ? "s" : ""} in progress. Momentum is a thing — don't lose it.`
                                    : streak > 1
                                      ? `${streak}-day streak. Keep the run going.`
                                      : accuracy !== null
                                        ? `You're averaging ${accuracy}% accuracy. A few more reps and that number climbs.`
                                        : "Pick a tryout and start your first rep."}
                            </p>
                            <div className="flex flex-wrap gap-2 pt-1">
                                <Button asChild size="sm" variant="secondary" className="font-semibold">
                                    <Link href="/tryouts">
                                        <PiStorefront className="mr-1.5" />
                                        Browse tryouts
                                    </Link>
                                </Button>
                                {inProgress.length > 0 && (
                                    <Button asChild size="sm" variant="outline" className="border-white/30 bg-white/10 text-primary-foreground hover:bg-white/20 hover:text-primary-foreground">
                                        <Link href={`/tryout-session/${inProgress[0].exam.id}?mode=${inProgress[0].type}`}>
                                            <PiPlay className="mr-1.5" />
                                            Continue
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {stats.map((s) => (
                            <Link key={s.label} href={s.href} className="group">
                                <Card size="sm" className="group relative overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5">
                                    <CardContent className="flex flex-col">
                                        <div className="flex items-start justify-between gap-2">
                                            <span className="text-2xl font-bold tabular-nums leading-none">{s.value}</span>
                                            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                                <s.icon className="h-4 w-4" />
                                            </span>
                                        </div>
                                        <span className="mt-2 text-xs text-muted-foreground">{s.label}</span>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>

            {insight && (
                <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="flex items-center gap-3">
                        <PiTrendUp className="h-5 w-5 shrink-0 text-primary" />
                        <p className="text-sm">
                            {insight.delta > 0
                                ? `Your ${insight.category} accuracy is up ${insight.delta}% this week.`
                                : insight.delta < 0
                                  ? `Your ${insight.category} accuracy dipped ${Math.abs(insight.delta)}% this week — one more rep closes the gap.`
                                  : `You're holding steady in ${insight.category}. Consistency wins.`}
                        </p>
                    </CardContent>
                </Card>
            )}

            {ownedTryouts.length > 0 && (
                <section>
                    <SectionHeader title="Your tryouts" href="/my-tryouts" cta="View all" />
                    <YourTryouts tryouts={ownedTryouts} sessions={sessions} />
                </section>
            )}

            <section>
                <SectionHeader title="Leaderboards" href="/leaderboards" cta="See all" />
                {/* ponytail: server component fetches its own data; no Suspense needed, page is dynamic */}
                <LeaderboardSpotlight />
            </section>

            <section>
                <SectionHeader title="New on the marketplace" href="/tryouts" cta="Browse" />
                <NewTryouts />
            </section>

            <section>
                <SectionHeader title="Recent results" href="/my-sessions" cta="View all" />
                {recent.length > 0 ? (
                    <div className="flex flex-col gap-3">
                        {recent.map((s) => {
                            const sCorrect = (s.sc_earned ?? 0) + (s.mc_earned ?? 0)
                            const sAccuracy = s.objective_answered > 0 ? Math.round((sCorrect / s.objective_answered) * 100) : 0
                            return (
                                <Link key={s.id} href={`/review-session/${s.id}`} className="group">
                                    <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/5">
                                        <CardContent className="flex items-center gap-4">
                                            <div className="flex size-14 shrink-0 flex-col items-center justify-center gap-0.5 rounded-xl bg-primary/10 text-primary">
                                                <span className="text-lg font-bold tabular-nums leading-none">{s.mc_score ?? 0}</span>
                                                <span className="mt-0.5 text-[9px] uppercase tracking-wide text-primary/70">/100</span>
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate font-medium">{s.exam.title}</span>
                                                    {s.exam.category && <Badge variant="secondary">{s.exam.category}</Badge>}
                                                </div>
                                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <PiClock className="h-3 w-3" />
                                                        {format(new Date(s.submitted_at ?? s.started_at ?? new Date()), "MMM d, h:mm a")}
                                                    </span>
                                                    <span className="font-medium tabular-nums">{sAccuracy}% correct</span>
                                                </div>
                                                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                                                    <div className="h-full rounded-full bg-primary transition-all" style={{width: `${sAccuracy}%`}} />
                                                </div>
                                            </div>
                                            <PiArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                                        </CardContent>
                                    </Card>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                            <PiCheckCircle className="h-8 w-8 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">No results yet. Your first score starts with one attempt.</p>
                            <Button size="sm" asChild>
                                <Link href="/my-tryouts">
                                    <PiPlay className="mr-1.5" />
                                    Take a tryout
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </section>
                </div>
            </ScrollArea>
        </AnimDiv>
    )
}

export default Page
