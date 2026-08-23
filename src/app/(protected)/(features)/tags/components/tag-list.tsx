"use client"

import {useMemo, useState} from "react"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {PiPlus, PiX, PiPencilSimple, PiMagnifyingGlass, PiTag, PiTrash} from "react-icons/pi"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {createTag} from "../services/create-tag"
import {updateTag} from "../services/update-tag"
import {deleteTag} from "../services/delete-tag"
import {toast} from "sonner"
import {handleClientError} from "@/utils/helpers/handle-client-errors"
import {GetTag} from "../services/get-tags"
import {Loader2} from "lucide-react"

type TagListProps = {
    tags: GetTag[]
}

const Stat = ({icon, value, label}: {icon: React.ReactNode; value: number; label: string}) => (
    <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
        <span className="text-muted-foreground">{icon}</span>
        <span className="font-heading text-lg leading-none font-semibold tabular-nums">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
    </div>
)

const TagList = ({tags}: TagListProps) => {
    const queryClient = useQueryClient()
    const [createValue, setCreateValue] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingValue, setEditingValue] = useState("")
    const [deletingTag, setDeletingTag] = useState<GetTag | null>(null)
    const [search, setSearch] = useState("")

    const stats = useMemo(() => {
        const used = tags.filter((t) => t._count.exams > 0).length
        return {total: tags.length, used, unused: tags.length - used}
    }, [tags])

    const visible = useMemo(() => {
        const q = search.trim().toLowerCase()
        return [...tags]
            .filter((t) => !q || t.name.toLowerCase().includes(q))
            .sort((a, b) => b._count.exams - a._count.exams || a.name.localeCompare(b.name))
    }, [tags, search])

    const {mutate: mutateCreate, isPending: isCreating} = useMutation({
        mutationFn: createTag,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            setCreateValue("")
            queryClient.invalidateQueries({queryKey: ["tags"]})
        },
        onError: (error) => toast.error(handleClientError(error)),
    })

    const {mutate: mutateUpdate, isPending: isUpdating} = useMutation({
        mutationFn: ({id, name}: {id: string; name: string}) => updateTag(id, name),
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            setEditingId(null)
            queryClient.invalidateQueries({queryKey: ["tags"]})
        },
        onError: (error) => toast.error(handleClientError(error)),
    })

    const {mutate: mutateDelete, isPending: isDeleting} = useMutation({
        mutationFn: deleteTag,
        onSuccess: (res) => {
            if (!res.success) return toast.error(res.message)
            toast.success(res.message)
            setDeletingTag(null)
            queryClient.invalidateQueries({queryKey: ["tags"]})
        },
        onError: (error) => toast.error(handleClientError(error)),
    })

    const handleCreate = () => {
        if (!createValue.trim()) return
        mutateCreate(createValue)
    }

    const startEdit = (tag: GetTag) => {
        setEditingId(tag.id)
        setEditingValue(tag.name)
    }

    const handleUpdate = (tag: GetTag) => {
        // ponytail: only hit the API when the name actually changed
        const next = editingValue.trim()
        if (!next || next === tag.name) return setEditingId(null)
        mutateUpdate({id: tag.id, name: next})
    }

    return (
        <Card className="ring-0 overflow-visible bg-transparent p-0">
            <CardContent className="flex flex-col gap-5 p-0">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <PiMagnifyingGlass className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search tags..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="New tag name..."
                            value={createValue}
                            onChange={(e) => setCreateValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            disabled={isCreating}
                            className="h-8 w-40"
                        />
                        <Button size="sm" onClick={handleCreate} disabled={isCreating || !createValue.trim()}>
                            {isCreating ? <Loader2 className="animate-spin" /> : <PiPlus />}
                            Add
                        </Button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <Stat icon={<PiTag className="size-4" />} value={stats.total} label="tags" />
                    <Stat icon={<PiTag className="size-4 text-primary" />} value={stats.used} label="in use" />
                    <Stat icon={<PiX className="size-4 text-muted-foreground" />} value={stats.unused} label="unused" />
                </div>

                {visible.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border py-12 text-center">
                        <PiTag className="size-7 text-muted-foreground/60" />
                        <p className="text-sm font-medium">
                            {tags.length === 0 ? "No tags yet" : "No tags match your search"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {tags.length === 0
                                ? "Create your first tag using the field above."
                                : "Try a different keyword."}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-2 overflow-hidden">
                        {visible.map((tag) => {
                            if (editingId === tag.id) {
                                return (
                                    <div key={tag.id} className="flex items-center gap-1">
                                        <Input
                                            autoFocus
                                            value={editingValue}
                                            onChange={(e) => setEditingValue(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") handleUpdate(tag)
                                                if (e.key === "Escape") setEditingId(null)
                                            }}
                                            onBlur={() => handleUpdate(tag)}
                                            disabled={isUpdating}
                                            className="h-8 w-36 text-sm"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={() => setEditingId(null)}
                                            disabled={isUpdating}>
                                            <PiX />
                                        </Button>
                                    </div>
                                )
                            }

                            const unused = tag._count.exams === 0
                            return (
                                <div
                                    key={tag.id}
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => startEdit(tag)}
                                    onKeyDown={(e) => e.key === "Enter" && startEdit(tag)}
                                    className={`group/tag flex cursor-pointer items-center gap-1.5 rounded-4xl border px-3 py-1.5 text-sm transition-all hover:border-primary/40 hover:bg-primary/[0.04] focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 ${
                                        unused
                                            ? "border-dashed border-border text-muted-foreground"
                                            : "border-border bg-background"
                                    }`}>
                                    <span className="truncate font-medium">{tag.name}</span>
                                    <Badge
                                        variant={unused ? "outline" : "secondary"}
                                        className="tabular-nums">
                                        {tag._count.exams}
                                    </Badge>
                                    <span className="hidden items-center gap-0.5 group-hover/tag:flex">
                                        <button
                                            type="button"
                                            aria-label="Edit tag"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                startEdit(tag)
                                            }}
                                            className="text-muted-foreground transition-colors hover:text-foreground">
                                            <PiPencilSimple className="size-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Delete tag"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setDeletingTag(tag)
                                            }}
                                            className="text-muted-foreground transition-colors hover:text-destructive">
                                            <PiX className="size-3.5" />
                                        </button>
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </CardContent>

            <AlertDialog open={!!deletingTag} onOpenChange={(open) => !open && setDeletingTag(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{deletingTag?.name}</strong>?
                            {deletingTag && deletingTag._count.exams > 0 && (
                                <span className="mt-1 block text-destructive">
                                    This tag is used by {deletingTag._count.exams} exam(s). It will be removed from
                                    all exams.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isDeleting}
                            onClick={() => deletingTag && mutateDelete(deletingTag.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isDeleting ? <Loader2 className="animate-spin" /> : <PiTrash />}
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    )
}

export default TagList
