"use client"

import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {PiMagnifyingGlass, PiSquaresFour, PiTag, PiX} from "react-icons/pi"
import {cn} from "@/lib/utils"
import {useQueryParams} from "@/utils/hooks/useQueryParams"

type FilterSidebarProps = {
    searchPlaceholder: string
    categories: {value: string; label: string; count: number}[]
    tags: {id: string; name: string; count: number}[]
}

const FilterSidebar = ({searchPlaceholder, categories, tags}: FilterSidebarProps) => {
    const {getParam, setParams} = useQueryParams()
    const search = getParam("search") || ""
    const activeCategory = getParam("category") || ""
    const activeTags = getParam("tags")?.split(",").filter(Boolean) ?? []
    const hasFilters = !!activeCategory || activeTags.length > 0 || !!search

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParams({search: e.target.value}, {delay: 200})
    }

    const handleCategory = (value: string) => {
        setParams({category: value === "all" ? "" : value})
    }

    const handleTag = (name: string) => {
        const next = activeTags.includes(name) ? activeTags.filter((t) => t !== name) : [...activeTags, name]
        setParams({tags: next.length > 0 ? next.join(",") : ""})
    }

    const clearAll = () => {
        setParams({search: "", category: "", tags: ""})
    }

    return (
        <aside className="flex flex-wrap items-center gap-2 w-full rounded-2xl border border-border/60 bg-card/70 p-3 backdrop-blur-sm">
            <InputGroup className="bg-background/80 backdrop-blur-sm border-border/50 flex-1 min-w-[180px]">
                <InputGroupInput placeholder={searchPlaceholder} value={search} onChange={handleSearch} />
                <InputGroupAddon>
                    <PiMagnifyingGlass />
                </InputGroupAddon>
            </InputGroup>

            <Select value={activeCategory || "all"} onValueChange={handleCategory}>
                <SelectTrigger className="w-full md:w-[190px]">
                    <PiSquaresFour className="!size-4 text-muted-foreground" />
                    <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories ({categories.reduce((sum, c) => sum + c.count, 0)})</SelectItem>
                    {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                            {cat.label} ({cat.count})
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={activeTags.length > 0 ? "default" : "outline"} className="justify-start w-full md:w-auto">
                        <PiTag className="!size-4" />
                        Tags
                        {activeTags.length > 0 && (
                            <Badge variant="secondary" className="ml-0.5 text-[10px] px-1.5">
                                {activeTags.length}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64">
                    <div className="flex items-center justify-between px-1 pt-1">
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tags</span>
                        {activeTags.length > 0 && (
                            <button
                                onClick={clearAll}
                                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                                <PiX className="w-3 h-3" />
                                Reset
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag) => {
                            const isActive = activeTags.includes(tag.name)
                            return (
                                <Badge
                                    key={tag.id}
                                    variant={isActive ? "default" : "outline"}
                                    className={cn(
                                        "cursor-pointer transition-all text-xs px-2.5 py-1",
                                        isActive ? "shadow-sm shadow-primary/25" : "hover:bg-accent hover:border-primary/30",
                                    )}
                                    onClick={() => handleTag(tag.name)}>
                                    {tag.name}
                                    <span className="ml-1 text-[10px] opacity-70">{tag.count}</span>
                                </Badge>
                            )
                        })}
                    </div>
                </PopoverContent>
            </Popover>

            {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground">
                    <PiX className="!size-3.5" />
                    Clear
                </Button>
            )}
        </aside>
    )
}

export default FilterSidebar
