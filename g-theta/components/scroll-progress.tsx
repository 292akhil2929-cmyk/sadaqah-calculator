"use client"

import { motion, useScroll, useSpring } from "motion/react"

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 })

  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[85] h-[3px] origin-left rounded-r-full"
      style={{
        scaleX,
        background: "linear-gradient(90deg, #4f7cff, #a855f7, #d7d9e0)",
        boxShadow: "0 0 12px rgba(79,124,255,0.6), 0 0 28px rgba(168,85,247,0.35)",
      }}
    />
  )
}
