// components/custom/combobox.tsx
"use client"

import {useEffect, useRef, useState} from "react"
import {useInfiniteQuery} from "@tanstack/react-query"
import {Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList} from "@/components/ui/combobox"
import {useDebounce} from "@/utils/hooks/useDebounce"
import {cn} from "@/lib/utils"

export type ComboboxOption = {
    label: string
    value: string
}

type StaticProps = {
    options: ComboboxOption[]
    queryKey?: never
    queryFn?: never
    getItems?: never
}

type DynamicProps<TPage> = {
    options?: never
    queryKey: string[]
    queryFn: (page: number, search: string) => Promise<TPage>
    getItems: (page: TPage) => ComboboxOption[]
    getNextPage: (page: TPage) => number | undefined
}

type InfiniteComboboxProps<TPage> = {
    value: ComboboxOption | null | undefined
    onChange: (value: ComboboxOption | null) => void
    placeholder?: string
    invalid?: boolean
} & (StaticProps | DynamicProps<TPage>)

export function InfiniteCombobox<TPage>({value, onChange, placeholder = "Select...", ...props}: InfiniteComboboxProps<TPage>) {
    const [search, setSearch] = useState("")
    const debouncedSearch = useDebounce(search, 300)
    const sentinelRef = useRef<HTMLDivElement>(null)
    const isStatic = "options" in props && !!props.options
    const [open, setOpen] = useState(false)

    const {data, fetchNextPage, hasNextPage, isFetchingNextPage} = useInfiniteQuery({
        queryKey: [...(props.queryKey ?? []), debouncedSearch],
        queryFn: ({pageParam}) => (props as DynamicProps<TPage>).queryFn(pageParam as number, debouncedSearch),
        initialPageParam: 1,
        getNextPageParam: (page) => (props as DynamicProps<TPage>).getNextPage(page),
        select: (data) => ({
            ...data,
            pages: data.pages.map((p) => ({
                items: (props as DynamicProps<TPage>).getItems(p),
            })),
        }),
        enabled: !isStatic,
    })

    const fetchedOptions = data?.pages.flatMap((p) => p.items) ?? []
    const options = isStatic ? props.options.filter((o) => o.label.toLowerCase().includes(debouncedSearch.toLowerCase())) : fetchedOptions

    useEffect(() => {
        if (isStatic) return
        const el = sentinelRef.current
        if (!el) return
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage()
        })
        observer.observe(el)
        return () => observer.disconnect()
    }, [isStatic, hasNextPage, isFetchingNextPage, fetchNextPage])

    return (
        <Combobox
            value={value ?? null}
            items={options}
            open={open}
            onOpenChange={(nextOpen) => {
                setOpen(nextOpen)
                if (nextOpen) {
                    setSearch("")
                }
            }}
            itemToStringValue={(o) => o.label}
            onInputValueChange={setSearch}
            onValueChange={(newValue) => {
                onChange(newValue)
                setSearch("")
            }}>
            <ComboboxInput
                placeholder={placeholder}
                aria-invalid={props.invalid}
                className={cn(
                    "w-full",
                    props.invalid &&
                        "rounded-4xl border border-destructive bg-input/30 text-base transition-colors outline-none ring-[3px] ring-destructive/20 dark:border-destructive/50 dark:ring-destructive/40",
                )}
            />
            <ComboboxContent className="p-0">
                <ComboboxEmpty>{isFetchingNextPage ? "Loading..." : "No results found."}</ComboboxEmpty>
                <ComboboxList>
                    {(option) => (
                        <ComboboxItem key={option.value} value={option}>
                            {option.label}
                        </ComboboxItem>
                    )}
                </ComboboxList>
                {!isStatic && (
                    <div ref={sentinelRef} className="py-2 text-center text-xs text-muted-foreground">
                        {isFetchingNextPage && "Loading more..."}
                    </div>
                )}
            </ComboboxContent>
        </Combobox>
    )
}
