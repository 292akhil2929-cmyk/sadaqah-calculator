"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "motion/react"

type Ripple = { id: number; x: number; y: number }

let rippleId = 0

export function RippleButton({
  children,
  className = "",
  onClick,
  id,
}: {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  id?: string
}) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  return (
    <button
      id={id}
      className={`relative overflow-hidden ${className}`}
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const r = { id: ++rippleId, x: e.clientX - rect.left, y: e.clientY - rect.top }
        setRipples((prev) => [...prev, r])
        setTimeout(() => setRipples((prev) => prev.filter((p) => p.id !== r.id)), 700)
        onClick?.(e)
      }}
    >
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-white/30"
            style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%" }}
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: 320, height: 320, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
    </button>
  )
}
