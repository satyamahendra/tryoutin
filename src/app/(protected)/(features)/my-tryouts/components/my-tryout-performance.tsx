"use client"

import {Bar, BarChart, CartesianGrid, XAxis, YAxis} from "recharts"
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from "@/components/ui/chart"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import AnimDiv from "@/components/custom/anim-div"
import {PiChartLineUp} from "react-icons/pi"
import {useMemo, useState} from "react"

type PerformanceSession = {
    id: string
    type: "simulation" | "practice"
    total_score: number | null
}

const MyTryoutPerformance = ({sessions}: {sessions: PerformanceSession[]}) => {
    const [mode, setMode] = useState<"simulation" | "practice">("simulation")

    const filtered = useMemo(() => sessions.filter((s) => s.type === mode), [sessions, mode])

    const scores = filtered.map((s) => s.total_score ?? 0)
    const best = scores.length ? Math.max(...scores) : 0
    const average = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

    const chartData = filtered.map((s, i) => ({
        attempt: `#${i + 1}`,
        score: s.total_score ?? 0,
    }))

    const chartConfig = {
        score: {label: "Score", color: "var(--chart-1)"},
    } satisfies ChartConfig

    return (
        <div className="flex flex-col gap-3">
            <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
                <TabsList>
                    <TabsTrigger value="simulation">Simulation</TabsTrigger>
                    <TabsTrigger value="practice">Practice</TabsTrigger>
                </TabsList>
            </Tabs>
            <AnimDiv key={mode} className="flex flex-col gap-3">
                {filtered.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border py-8 text-center">
                        <p className="text-sm text-muted-foreground">
                            {sessions.length === 0
                                ? "No attempts yet. Take this tryout to see your stats."
                                : `No ${mode} attempts yet.`}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                {label: "Attempts", value: filtered.length},
                                {label: "Best", value: best},
                                {label: "Average", value: average},
                            ].map((stat) => (
                                <div key={stat.label} className="rounded-xl border bg-card p-3 text-center">
                                    <span className="block text-lg font-bold text-primary tabular-nums">{stat.value}</span>
                                    <span className="block text-[10px] uppercase tracking-wide text-muted-foreground">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                        <ChartContainer config={chartConfig} className="min-h-[160px] w-full">
                            <BarChart data={chartData} accessibilityLayer>
                                <CartesianGrid vertical={false} />
                                <XAxis dataKey="attempt" tickLine={false} axisLine={false} tickMargin={8} />
                                <YAxis width={30} tickLine={false} axisLine={false} allowDecimals={false} />
                                <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                                <Bar dataKey="score" fill="var(--color-score)" radius={4} />
                            </BarChart>
                        </ChartContainer>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <PiChartLineUp className="w-3.5 h-3.5" />
                            {mode} score per completed attempt
                        </span>
                    </>
                )}
            </AnimDiv>
        </div>
    )
}

export default MyTryoutPerformance
