"use client"

import {InputGroup, InputGroupAddon, InputGroupInput} from "@/components/ui/input-group"
import {PiMagnifyingGlass, PiTag} from "react-icons/pi"
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
    const activeTag = getParam("tag") || ""

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setParams({search: e.target.value}, {delay: 200})
    }

    const handleCategory = (value: string) => {
        setParams({category: activeCategory === value ? "" : value})
    }

    const handleTag = (id: string) => {
        setParams({tag: activeTag === id ? "" : id})
    }

    return (
        <aside className="flex flex-col gap-5 w-full shrink-0">
            <InputGroup>
                <InputGroupInput placeholder="Search tryouts..." value={search} onChange={handleSearch} />
                <InputGroupAddon>
                    <PiMagnifyingGlass />
                </InputGroupAddon>
            </InputGroup>

            <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-muted-foreground px-1">Categories</span>
                <button
                    onClick={() => setParams({category: ""})}
                    className={cn(
                        "flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors text-left",
                        !activeCategory ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                    )}>
                    <span>All</span>
                    <Badge variant={activeCategory ? "secondary" : "outline"} className="text-xs ml-2">
                        {categories.reduce((sum, c) => sum + c.count, 0)}
                    </Badge>
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.value}
                        onClick={() => handleCategory(cat.value)}
                        className={cn(
                            "flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-colors text-left",
                            activeCategory === cat.value ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                        )}>
                        <span className="truncate">{cat.label}</span>
                        <Badge variant={activeCategory === cat.value ? "secondary" : "outline"} className="text-xs ml-2 shrink-0">
                            {cat.count}
                        </Badge>
                    </button>
                ))}
            </div>

            {tags.length > 0 && (
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground px-1 flex items-center gap-1">
                        <PiTag className="w-3 h-3" /> Tags
                    </span>
                    <div className="flex flex-wrap gap-1.5 px-1">
                        {tags.map((tag) => (
                            <Badge
                                key={tag.id}
                                variant={activeTag === tag.id ? "default" : "outline"}
                                className={cn(
                                    "cursor-pointer transition-colors text-xs",
                                    activeTag === tag.id ? "" : "hover:bg-muted",
                                )}
                                onClick={() => handleTag(tag.id)}>
                                {tag.name}
                                <span className="ml-1 text-[10px] opacity-70">{tag.count}</span>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    )
}

export default TryoutSidebar
