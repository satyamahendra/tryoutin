"use client"

import { motion, type HTMLMotionProps } from "framer-motion";

type AnimDivProps = HTMLMotionProps<"div">;

export const fadeIn = {
  initial: {
    opacity: 0,
    y: 3,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  transition: {
    duration: 0.3,
  },
};

const AnimDiv = ({ children, ...props }: AnimDivProps) => {
  return (
    <motion.div {...fadeIn} {...props}>
      {children}
    </motion.div>
  );
};

export default AnimDiv;