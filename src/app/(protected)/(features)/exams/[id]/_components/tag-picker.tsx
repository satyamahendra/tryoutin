"use client"

import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {PiCheck, PiPlus, PiX} from "react-icons/pi"
import {useQuery} from "@tanstack/react-query"
import {getTags} from "@/app/(protected)/(features)/tags/_services/get-tags"
import {Loader2} from "lucide-react"
import {cn} from "@/lib/utils"
import {useState} from "react"

type TagPickerProps = {
    value: {value: string; label: string}[]
    onChange: (value: {value: string; label: string}[]) => void
}

const TagPicker = ({value, onChange}: TagPickerProps) => {
    const [open, setOpen] = useState(false)

    const {data, isLoading} = useQuery({
        queryKey: ["tags"],
        queryFn: getTags,
    })

    const tags = data?.success ? data.data!.tags : []
    const selectedIds = new Set(value.map((v) => v.value))

    const toggle = (tag: {id: string; name: string}) => {
        if (selectedIds.has(tag.id)) {
            onChange(value.filter((v) => v.value !== tag.id))
        } else {
            onChange([...value, {value: tag.id, label: tag.name}])
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                {value.length === 0 && <span className="text-xs text-muted-foreground">No tags selected</span>}
                {value.map((v) => (
                    <Badge key={v.value} variant="secondary" className="gap-1 text-xs">
                        {v.label}
                        <button onClick={() => onChange(value.filter((x) => x.value !== v.value))} className="ml-0.5 text-muted-foreground hover:text-foreground">
                            <PiX className="w-3 h-3" />
                        </button>
                    </Badge>
                ))}
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button type="button" variant="outline" size="sm" className="w-fit gap-1.5">
                        <PiPlus className="w-3 h-3" /> Add Tags
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-2" align="start">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="animate-spin w-4 h-4 text-muted-foreground" />
                        </div>
                    ) : tags.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No tags available. Create some in Admin &gt; Tags.</p>
                    ) : (
                        <div className="flex flex-col gap-0.5 max-h-60 overflow-y-auto">
                            {tags.map((tag) => {
                                const isSelected = selectedIds.has(tag.id)
                                return (
                                    <button
                                        key={tag.id}
                                        onClick={() => toggle(tag)}
                                        className={cn(
                                            "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-left transition-colors",
                                            isSelected ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                                        )}>
                                        <PiCheck className={cn("w-3 h-3 shrink-0", isSelected ? "opacity-100" : "opacity-0")} />
                                        <span className="truncate">{tag.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default TagPicker
