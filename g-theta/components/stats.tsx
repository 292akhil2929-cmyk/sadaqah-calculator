"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "motion/react"

const stats = [
  { value: 500000, format: (n: number) => `${Math.round(n).toLocaleString("en-IN")}+`, label: "Customers" },
  { value: 4.9, format: (n: number) => `${n.toFixed(1)}★`, label: "Rating" },
  { value: 98, format: (n: number) => `${Math.round(n)}%`, label: "Recommended" },
]

function Counter({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  const [display, setDisplay] = useState(format(0))

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const duration = 2000
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setDisplay(format(value * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, format])

  return (
    <span
      ref={ref}
      className="font-display text-5xl font-bold tabular-nums tracking-tight sm:text-7xl"
      style={{ textShadow: "0 0 30px rgba(79,124,255,0.45), 0 0 80px rgba(168,85,247,0.25)" }}
    >
      {display}
    </span>
  )
}

export function Stats() {
  return (
    <section className="relative overflow-hidden border-y border-border/60 py-24">
      {/* moving background lines */}
      {[18, 52, 84].map((top, i) => (
        <motion.div
          key={top}
          aria-hidden
          className="absolute h-px w-1/2"
          style={{
            top: `${top}%`,
            background: "linear-gradient(90deg, transparent, rgba(79,124,255,0.35), rgba(168,85,247,0.3), transparent)",
          }}
          animate={{ x: ["-60vw", "120vw"] }}
          transition={{ duration: 9 + i * 3, repeat: Infinity, ease: "linear", delay: i * 1.6 }}
        />
      ))}

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-14 px-6 text-center sm:grid-cols-3">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 36, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.15 }}
            className="flex flex-col items-center gap-2"
          >
            <Counter value={stat.value} format={stat.format} />
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              {stat.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
