"use client"

import {useTheme} from "next-themes"
import {Button} from "@/components/ui/button"
import {PiMoon, PiSun} from "react-icons/pi"
import {useEffect, useState} from "react"

export default function ThemeToggle() {
    const {setTheme, theme} = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-8 w-8" />
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 cursor-pointer rounded-lg text-muted-foreground hover:text-foreground"
            aria-label="Toggle theme"
        >
            {theme === "dark" ? <PiSun className="h-4 w-4" /> : <PiMoon className="h-4 w-4" />}
        </Button>
    )
}
