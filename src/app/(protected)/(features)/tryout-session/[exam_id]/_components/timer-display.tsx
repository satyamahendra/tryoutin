"use client"

import {useEffect, useState, useRef, useCallback} from "react"
import {cn} from "@/lib/utils"

type TimerDisplayProps = {
    endsAt: string | null
    onExpire: () => void
}

const TimerDisplay = ({endsAt, onExpire}: TimerDisplayProps) => {
    const [remaining, setRemaining] = useState<number>(0)
    const expiredRef = useRef(false)

    const calcRemaining = useCallback(() => {
        if (!endsAt) return 0
        return Math.max(0, new Date(endsAt).getTime() - Date.now())
    }, [endsAt])

    useEffect(() => {
        expiredRef.current = false
        setRemaining(calcRemaining())

        const interval = setInterval(() => {
            const r = calcRemaining()
            setRemaining(r)
            if (r <= 0 && !expiredRef.current) {
                expiredRef.current = true
                clearInterval(interval)
                onExpire()
            }
        }, 1000)

        return () => clearInterval(interval)
    }, [endsAt, calcRemaining, onExpire])

    if (!endsAt) return null

    const totalSecs = Math.ceil(remaining / 1000)
    const mins = Math.floor(totalSecs / 60)
    const secs = totalSecs % 60
    const hours = Math.floor(mins / 60)
    const displayMins = mins % 60

    const isUrgent = remaining < 5 * 60 * 1000
    const isCritical = remaining < 60 * 1000

    const format = () => {
        if (hours > 0) return `${hours}:${String(displayMins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    }

    return (
        <div
            className={cn(
                "font-mono text-lg font-bold tabular-nums transition-colors",
                isCritical ? "text-red-500 animate-pulse" : isUrgent ? "text-amber-500" : "text-foreground",
            )}>
            {format()}
        </div>
    )
}

export default TimerDisplay
