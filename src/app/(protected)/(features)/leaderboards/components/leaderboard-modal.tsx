"use client"

import {Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle} from "@/components/ui/drawer"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {Badge} from "@/components/ui/badge"
import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {useQuery} from "@tanstack/react-query"
import {getLeaderboard} from "../services/get-leaderboard"
import {Loader2} from "lucide-react"
import {PiMagnifyingGlass, PiMedal, PiTrophy} from "react-icons/pi"
import {useState} from "react"
import {cn} from "@/lib/utils"
import {useScreenSize} from "@/utils/hooks/useScreenSize"

const rankColor = (rank: number) =>
    rank === 1 ? "text-amber-500" : rank === 2 ? "text-slate-400" : rank === 3 ? "text-orange-600" : "text-muted-foreground"

const LeaderboardModal = () => {
    const {getParam, setParams} = useQueryParams()
    const {isMobile} = useScreenSize()
    const view = getParam("view")
    const [search, setSearch] = useState("")

    const {data, isLoading} = useQuery({
        queryKey: ["leaderboard", view],
        queryFn: () => getLeaderboard(view!),
        enabled: !!view,
    })

    const users = data?.success ? data.data.users : []
    const filtered = search ? users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase())) : users

    return (
        <Drawer swipeDirection={isMobile ? "down" : "right"} open={!!view} onOpenChange={(open) => !open && setParams({view: ""})}>
            <DrawerContent aria-describedby={undefined} className={cn(isMobile ? "h-[85vh]" : "", "border-0")}>
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
                    </div>
                ) : !data?.success || !data.data ? (
                    <div className="flex items-center justify-center h-full text-sm text-muted-foreground">Leaderboard not found.</div>
                ) : (
                    <>
                        <div className="relative bg-gradient-to-br from-primary/90 via-primary to-primary/70 text-primary-foreground px-6 py-7">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
                            <DrawerHeader className="p-0 gap-2 text-left">
                                <div className="flex items-start justify-between gap-3">
                                    <DrawerTitle className="text-xl font-bold text-primary-foreground leading-snug flex items-center gap-2">
                                        <PiTrophy className="w-5 h-5" />
                                        {data.data.title}
                                    </DrawerTitle>
                                    {data.data.category && (
                                        <Badge variant="secondary" className="shrink-0 text-xs bg-white/20 text-primary-foreground border-white/30">
                                            {data.data.category}
                                        </Badge>
                                    )}
                                </div>
                                <DrawerDescription className="text-primary-foreground/80 text-sm">
                                    {users.length} {users.length === 1 ? "participant" : "participants"} ranked
                                </DrawerDescription>
                            </DrawerHeader>
                        </div>

                        <div className="flex flex-col gap-3 px-6 py-5 overflow-y-auto flex-1">
                            <InputGroup className="bg-background border-border/50">
                                <InputGroupInput placeholder="Search participants..." value={search} onChange={(e) => setSearch(e.target.value)} />
                                <InputGroupAddon>
                                    <PiMagnifyingGlass />
                                </InputGroupAddon>
                            </InputGroup>

                            {filtered.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
                                    {users.length === 0 ? "No scores yet." : "No participants match your search."}
                                </div>
                            ) : (
                                <ul className="flex flex-col gap-1">
                                    {filtered.map((u) => (
                                        <li
                                            key={u.userId}
                                            className={cn(
                                                "flex items-center gap-3 rounded-xl border bg-card px-3 py-2.5 transition-colors",
                                                u.rank <= 3 && "border-primary/20 bg-primary/5",
                                            )}>
                                            <span className={cn("flex items-center justify-center w-7 font-bold", rankColor(u.rank))}>
                                                {u.rank <= 3 ? <PiMedal className="w-5 h-5" /> : <span className="tabular-nums text-sm">{u.rank}</span>}
                                            </span>
                                            <Avatar className="w-9 h-9">
                                                <AvatarImage src={u.image || undefined} />
                                                <AvatarFallback>{u.name ? u.name[0].toUpperCase() : "U"}</AvatarFallback>
                                            </Avatar>
                                            <span className="flex-1 min-w-0 truncate font-medium text-sm">{u.name}</span>
                                            <span className="text-base font-bold tabular-nums text-primary">{u.score}</span>
                                            <span className="text-[10px] text-primary-foreground/70">/100</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    )
}

export default LeaderboardModal
