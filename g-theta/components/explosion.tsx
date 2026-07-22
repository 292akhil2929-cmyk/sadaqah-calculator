"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"
import { motion, useTransform } from "motion/react"
import { useMirroredScrollProgress } from "@/lib/use-mirrored-scroll"

const ExplosionCanvas = dynamic(
  () => import("@/components/three/explosion-canvas").then((m) => m.ExplosionCanvas),
  { ssr: false }
)

const labels = [
  { text: "Hood", pos: "left-1/2 top-[12%] -translate-x-1/2" },
  { text: "Zipper", pos: "right-[8%] top-[42%] sm:right-[16%]" },
  { text: "Pocket", pos: "right-[12%] bottom-[18%] sm:right-[22%]" },
  { text: "Cotton", pos: "left-[6%] top-[38%] sm:left-[14%]" },
  { text: "Stitching", pos: "left-[10%] bottom-[22%] sm:left-[18%]" },
]

export function Explosion() {
  const ref = useRef<HTMLElement>(null)
  const progress = useMirroredScrollProgress(ref, ["start start", "end end"])
  // labels live while the hoodie is apart (partial ranges — mirrored MV keeps this on the JS path)
  const labelOpacity = useTransform(progress, [0.18, 0.3, 0.7, 0.82], [0, 1, 1, 0])
  const labelY = useTransform(progress, [0.18, 0.3], [24, 0])
  const titleOpacity = useTransform(progress, [0, 0.08, 0.16], [0, 1, 1])

  return (
    <section ref={ref} className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center overflow-hidden">
        <motion.div style={{ opacity: titleOpacity }} className="relative z-10 mt-24 flex flex-col items-center gap-3 px-6 text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-electric">04 — Anatomy</p>
          <h2 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
            Deconstructed.
          </h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            Scroll to pull the Theta One apart — and put it back together.
          </p>
        </motion.div>

        <div className="absolute inset-0">
          <ExplosionCanvas progress={progress} />
        </div>

        {labels.map((label) => (
          <motion.div
            key={label.text}
            style={{ opacity: labelOpacity, y: labelY }}
            className={`glass absolute ${label.pos} z-10 flex items-center gap-2.5 rounded-full px-4 py-2`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
            <span className="text-sm font-semibold">{label.text}</span>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
