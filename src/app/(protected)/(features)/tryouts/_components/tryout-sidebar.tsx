"use client"

import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group"
import {PiMagnifyingGlass, PiTag, PiX} from "react-icons/pi"
import {useQueryParams} from "@/utils/hooks/useQueryParams"
import {Badge} from "@/components/ui/badge"
import {cn} from "@/lib/utils"

type TryoutSidebarProps = {
    categories: {value: string; label: string; count: number}[]
    tags: {id: string; name: string; count: number}[]
}

const TryoutSidebar = ({categories, tags}: TryoutSidebarProps) => {
    const {getParam, setParams} = useQueryParams()
    const search = getParam("search") || ""
    const activeCategory = getParam("category") || ""
    const activeTags = getParam("tags")?.split(",").filter(Boolean) ?? []
    const hasFilters = !!activeCategory || activeTags.length > 0 || !!search

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParams({search: e.target.value}, {delay: 200})
    }

    const handleCategory = (value: string) => {
        setParams({category: activeCategory === value ? "" : value})
    }

    const handleTag = (name: string) => {
        const next = activeTags.includes(name) ? activeTags.filter((t) => t !== name) : [...activeTags, name]
        setParams({tags: next.length > 0 ? next.join(",") : ""})
    }

    const clearAll = () => {
        setParams({search: "", category: "", tags: ""})
    }

    return (
        <aside className="flex flex-col gap-5 w-full shrink-0">
            <div className="relative">
                <InputGroup className="bg-background/80 backdrop-blur-sm border-border/50">
                    <InputGroupInput placeholder="Search tryouts..." value={search} onChange={handleSearch} />
                    <InputGroupAddon>
                        <PiMagnifyingGlass />
                    </InputGroupAddon>
                </InputGroup>
            </div>

            {hasFilters && (
                <button onClick={clearAll} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-1 w-fit">
                    <PiX className="w-3 h-3" />
                    Clear all filters
                </button>
            )}

            <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1">Categories</span>
                <div className="flex flex-col gap-0.5">
                    <button
                        onClick={() => setParams({category: ""})}
                        className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left",
                            !activeCategory ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25" : "hover:bg-muted/80",
                        )}>
                        <span className={!activeCategory ? "font-medium" : ""}>All Categories</span>
                        <Badge variant={activeCategory ? "secondary" : "outline"} className="text-xs ml-2">
                            {categories.reduce((sum, c) => sum + c.count, 0)}
                        </Badge>
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => handleCategory(cat.value)}
                            className={cn(
                                "flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all text-left",
                                activeCategory === cat.value ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25" : "hover:bg-muted/80",
                            )}>
                            <span className={cn("truncate", activeCategory === cat.value && "font-medium")}>{cat.label}</span>
                            <Badge variant={activeCategory === cat.value ? "secondary" : "outline"} className="text-xs ml-2 shrink-0">
                                {cat.count}
                            </Badge>
                        </button>
                    ))}
                </div>
            </div>

            {tags.length > 0 && (
                <div className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-1 flex items-center gap-1.5">
                        <PiTag className="w-3 h-3" /> Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => {
                            const isActive = activeTags.includes(tag.name)
                            return (
                                <Badge
                                    key={tag.id}
                                    variant={isActive ? "default" : "outline"}
                                    className={cn(
                                        "cursor-pointer transition-all text-xs px-2.5 py-1",
                                        isActive ? "shadow-sm shadow-primary/25" : "hover:bg-muted/80 hover:border-primary/30",
                                    )}
                                    onClick={() => handleTag(tag.name)}>
                                    {tag.name}
                                    <span className="ml-1 text-[10px] opacity-70">{tag.count}</span>
                                </Badge>
                            )
                        })}
                    </div>
                </div>
            )}
        </aside>
    )
}

export default TryoutSidebar
