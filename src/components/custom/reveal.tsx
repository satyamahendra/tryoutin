"use client"

import {motion, type HTMLMotionProps} from "framer-motion"

type RevealProps = HTMLMotionProps<"div"> & {
    delay?: number
}

const Reveal = ({delay = 0, className, ...props}: RevealProps) => {
    return (
        <motion.div
            initial={{opacity: 0, y: 16}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: "-60px"}}
            transition={{duration: 0.5, delay, ease: "easeOut"}}
            className={className}
            {...props}
        />
    )
}

export default Reveal
