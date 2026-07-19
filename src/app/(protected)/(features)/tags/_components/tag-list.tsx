"use client"

import {useState} from "react"
import {Badge} from "@/components/ui/badge"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "@/components/ui/alert-dialog"
import {PiPlus, PiX} from "react-icons/pi"
import {useMutation, useQueryClient} from "@tanstack/react-query"
import {createTag} from "../_services/create-tag"
import {updateTag} from "../_services/update-tag"
import {deleteTag} from "../_services/delete-tag"
import {toast} from "sonner"
import {handleClientError} from "@/utils/helpers/handle-client-errors"
import {GetTag} from "../_services/get-tags"
import {Loader2} from "lucide-react"

type TagListProps = {
    tags: GetTag[]
}

const TagList = ({tags}: TagListProps) => {
    const queryClient = useQueryClient()
    const [createValue, setCreateValue] = useState("")
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editingValue, setEditingValue] = useState("")
    const [deletingTag, setDeletingTag] = useState<GetTag | null>(null)

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

    const handleUpdate = (id: string) => {
        if (!editingValue.trim()) return
        mutateUpdate({id, name: editingValue})
    }

    const startEdit = (tag: GetTag) => {
        setEditingId(tag.id)
        setEditingValue(tag.name)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-2">
                <Input
                    placeholder="New tag name..."
                    value={createValue}
                    onChange={(e) => setCreateValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    disabled={isCreating}
                    className="max-w-xs"
                />
                <Button size="sm" onClick={handleCreate} disabled={isCreating || !createValue.trim()}>
                    {isCreating ? <Loader2 className="animate-spin" /> : <PiPlus />}
                    Add
                </Button>
            </div>

            <div className="flex flex-wrap gap-2">
                {tags.length === 0 && <p className="text-sm text-muted-foreground">No tags yet. Create one above.</p>}
                {tags.map((tag) => {
                    if (editingId === tag.id) {
                        return (
                            <div key={tag.id} className="flex items-center gap-1">
                                <Input
                                    autoFocus
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleUpdate(tag.id)
                                        if (e.key === "Escape") setEditingId(null)
                                    }}
                                    onBlur={() => handleUpdate(tag.id)}
                                    disabled={isUpdating}
                                    className="h-8 w-32 text-sm"
                                />
                                <Button variant="ghost" size="icon-xs" onClick={() => setEditingId(null)}>
                                    <PiX />
                                </Button>
                            </div>
                        )
                    }
                    return (
                        <Badge
                            key={tag.id}
                            variant="secondary"
                            className="gap-1.5 px-2.5 py-1 text-sm cursor-pointer hover:bg-secondary/80 transition-colors"
                            onClick={() => startEdit(tag)}>
                            {tag.name}
                            {tag._count.exams > 0 && (
                                <span className="text-xs text-muted-foreground">({tag._count.exams})</span>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setDeletingTag(tag)
                                }}
                                className="ml-0.5 text-muted-foreground hover:text-destructive transition-colors">
                                <PiX className="w-3 h-3" />
                            </button>
                        </Badge>
                    )
                })}
            </div>

            <AlertDialog open={!!deletingTag} onOpenChange={(open) => !open && setDeletingTag(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Tag</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{deletingTag?.name}</strong>?
                            {deletingTag && deletingTag._count.exams > 0 && (
                                <span className="block mt-1 text-destructive">
                                    This tag is used by {deletingTag._count.exams} exam(s). It will be removed from all exams.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction disabled={isDeleting} onClick={() => deletingTag && mutateDelete(deletingTag.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isDeleting ? <Loader2 className="animate-spin" /> : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

export default TagList
