"use client"

import {Line, BarChart, CartesianGrid, XAxis, YAxis} from "recharts"
import {ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig} from "@/components/ui/chart"
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs"
import AnimDiv from "@/components/custom/anim-div"
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion"
import {ScrollArea} from "@/components/ui/scroll-area"
import {PartScore} from "@/utils/helpers/score-parts" // Import PartScore
import {PiChartLineUp, PiBooks} from "react-icons/pi"
import {useMemo, useState} from "react"

type PerformanceSession = {
    id: string
    type: "simulation" | "practice"
    mcScore: number | null
    scaledScore: number | null
    scaledMax: number | null
    normalizedScaledScore: number | null
    scEarned: number
    scMax: number
    mcEarned: number
    mcMax: number
    parts: PartScore[]
}

const MyTryoutPerformance = ({sessions}: {sessions: PerformanceSession[]}) => {
    const [mode, setMode] = useState<"simulation" | "practice">("simulation")

    const filtered = useMemo(() => sessions.filter((s) => s.type === mode), [sessions, mode])

    const hasObjective = useMemo(() => filtered.some((s) => s.mcMax > 0 || s.scMax > 0), [filtered])
    const hasScaled = useMemo(() => filtered.some((s) => s.scaledMax !== null && s.scaledMax > 0), [filtered])

    const best = useMemo(() => {
        if (!filtered.length) return 0
        if (hasObjective) {
            const objectiveScores = filtered.map((s) => s.mcScore ?? 0)
            return Math.max(...objectiveScores)
        } else {
            const scaledScores = filtered.map((s) => s.scaledScore ?? 0)
            return Math.max(...scaledScores)
        }
    }, [filtered, hasObjective])

    const average = useMemo(() => {
        if (!filtered.length) return 0
        if (hasObjective) {
            const objectiveScores = filtered.map((s) => s.mcScore ?? 0)
            return Math.round(objectiveScores.reduce((a, b) => a + b, 0) / objectiveScores.length)
        } else {
            const scaledScores = filtered.map((s) => s.scaledScore ?? 0)
            return Math.round(scaledScores.reduce((a, b) => a + b, 0) / scaledScores.length)
        }
    }, [filtered, hasObjective])

    const chartData = filtered.map((s, i) => ({
        attempt: `#${i + 1}`,
        score: s.mcScore !== null ? s.mcScore : (s.normalizedScaledScore ?? 0),
        mcScore: s.mcScore,
        scaledScore: s.scaledScore,
        scaledMax: s.scaledMax,
        scEarned: s.scEarned,
        scMax: s.scMax,
        mcEarned: s.mcEarned,
        mcMax: s.mcMax,
        parts: s.parts,
    }))

    const chartConfig = {
        score: {label: "Score /100", color: "var(--chart-1)"},
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
                                {label: hasObjective ? "Best" : "Best TKP", value: best},
                                {label: hasObjective ? "Average" : "Avg TKP", value: average},
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
                                 <YAxis width={30} tickLine={false} axisLine={false} allowDecimals={false} domain={[0, 100]} />
                                  <ChartTooltip
                                      content={({active, payload}) => {
                                          if (active && payload && payload.length) {
                                              const data = payload[0].payload
                                              const items = []
                                              if (data.mcScore !== null) {
                                                  items.push({
                                                      name: "Overall Score",
                                                      value: `${data.mcScore} /100`,
                                                      color: "var(--color-score)",
                                                      graphicalItemId: "score",
                                                  })
                                              }
                                              if (data.scaledScore !== null && data.scaledMax > 0) {
                                                  items.push({
                                                      name: "TKP Score",
                                                      value: `${data.scaledScore} / ${data.scaledMax}`,
                                                      color: "hsl(var(--primary))",
                                                      graphicalItemId: "scaledScore",
                                                  })
                                              }
                                              return (
                                                  <ChartTooltipContent
                                                      indicator="dot"
                                                      className="p-2"
                                                      payload={items}
                                                  >
                                                      {data.parts && data.parts.length > 0 && (
                                                          <div className="mt-2 text-xs text-muted-foreground border-t pt-2 space-y-1">
                                                              <p className="font-semibold mb-1">Part Scores:</p>
                                                              {data.parts.map((part: PartScore) => (
                                                                  <div key={part.partId} className="flex justify-between items-center text-xs">
                                                                      <span className="font-medium">{part.partName || part.partId}:</span>
                                                                      <span>
                                                                          {part.partScore !== null && `${part.partScore} /100`}
                                                                          {part.partScore !== null && part.scaledMax > 0 && " · "}
                                                                          {part.scaledMax > 0 && `${part.scaledEarned} / ${part.scaledMax} TKP`}
                                                                      </span>
                                                                  </div>
                                                              ))}
                                                          </div>
                                                      )}
                                                  </ChartTooltipContent>
                                              )
                                          }
                                          return null
                                      }}
                                  />
                                 <Line
                                      dataKey="score"
                                      stroke="var(--color-score)"
                                      strokeWidth={2}
                                      dot={{r: 4, fill: "var(--color-score)", strokeWidth: 2}}
                                      activeDot={{r: 6}}
                                      type="monotone"
                                  />
                             </BarChart>
                         </ChartContainer>
                         <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                             <PiChartLineUp className="w-3.5 h-3.5" />
                             {mode} score per completed attempt
                         </span>

                         <Accordion type="single" collapsible className="w-full">
                            {chartData.map((data, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="flex justify-between items-center text-sm font-medium py-2 px-3 hover:no-underline">
                                        <span>Attempt {data.attempt} Details</span>
                                        <div className="flex items-center gap-2">
                                            {data.mcScore !== null && (
                                                <span className="text-xs font-semibold text-primary">{data.mcScore}/100</span>
                                            )}
                                            {data.scaledScore !== null && data.scaledMax !== null && data.scaledMax > 0 && (
                                                <span className="text-xs font-semibold text-primary/80">+{data.scaledScore} TKP</span>
                                            )}
                                            <span className="text-muted-foreground text-xs font-normal">
                                                ({data.scMax > 0 && `SC ${data.scEarned}/${data.scMax}`}
                                                {data.mcMax > 0 && `${data.scMax > 0 ? " · " : ""}MC ${data.mcEarned}/${data.mcMax}`}
                                                {data.scaledMax !== null && data.scaledMax > 0 && ` · TKP ${data.scaledScore}/${data.scaledMax}`})
                                            </span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="p-3">
                                        {data.parts && data.parts.length > 0 ? (
                                            <ScrollArea className="max-h-60 w-full rounded-md border p-1">
                                                <div className="grid grid-cols-1 gap-2 p-1">
                                                    {data.parts.map((part: PartScore) => (
                                                        <div key={part.partId} className="flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm">
                                                            <div className="flex items-center justify-between gap-2 border-b pb-1.5">
                                                                <span className="font-semibold text-sm truncate">{part.partName || part.partId}</span>
                                                                {part.partScore !== null ? (
                                                                    <div className="flex items-baseline gap-0.5">
                                                                        <span className="font-bold text-sm text-primary">{part.partScore}</span>
                                                                        <span className="text-[10px] text-muted-foreground">/100</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-muted-foreground">-</span>
                                                                )}
                                                            </div>
                                                            <div className="space-y-1.5 text-[11px] text-muted-foreground">
                                                                {part.scMax > 0 && (
                                                                    <div className="flex justify-between gap-4">
                                                                        <span>Single Choice</span>
                                                                        <span className="font-medium text-foreground">{part.scEarned}/{part.scMax}</span>
                                                                    </div>
                                                                )}
                                                                {part.mcMax > 0 && (
                                                                    <div className="flex justify-between gap-4">
                                                                        <span>Multiple Choice</span>
                                                                        <span className="font-medium text-foreground">{part.mcEarned}/{part.mcMax}</span>
                                                                    </div>
                                                                )}
                                                                {part.scaledMax > 0 && (
                                                                    <div className="flex justify-between gap-4">
                                                                        <span>Scaled Score</span>
                                                                        <span className="font-medium text-foreground">{part.scaledEarned}/{part.scaledMax}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </ScrollArea>
                                        ) : (
                                            <p className="text-sm text-muted-foreground">No part details available for this attempt.</p>
                                        )}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </>
                )}
            </AnimDiv>
        </div>
    )
}

export default MyTryoutPerformance
