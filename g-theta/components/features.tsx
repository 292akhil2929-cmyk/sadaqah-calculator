"use client"

import { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react"
import { Feather, MoveDiagonal, ThermometerSnowflake, Droplets, type LucideIcon } from "lucide-react"

const features: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: ThermometerSnowflake,
    title: "Thermo-Regulating",
    text: "Loopback knit traps warmth without overheating — engineered for 8°C to 24°C.",
  },
  {
    icon: MoveDiagonal,
    title: "4-Way Stretch",
    text: "Mechanical stretch panels at the shoulders. Reach, ride, sprint — nothing pulls.",
  },
  {
    icon: Droplets,
    title: "Rain-Shrug Finish",
    text: "DWR-treated face fabric shrugs off drizzle and chai spills alike.",
  },
  {
    icon: Feather,
    title: "Zero-Label Feel",
    text: "Heat-pressed sizing, no neck tags, covered seams. Nothing between you and the fleece.",
  },
]

function FeatureCard({ feature, index }: { feature: (typeof features)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const Icon = feature.icon

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [8, -8]), { stiffness: 220, damping: 18 })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), { stiffness: 220, damping: 18 })
  const lx = useTransform(px, [-0.5, 0.5], [0, 100])
  const ly = useTransform(py, [-0.5, 0.5], [0, 100])
  const light = useMotionTemplate`radial-gradient(320px circle at ${lx}% ${ly}%, rgba(168,85,247,0.12), transparent 60%)`

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 46, rotate: index % 2 ? 2 : -2, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: (index % 4) * 0.1 }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect()
        if (!rect) return
        px.set((e.clientX - rect.left) / rect.width - 0.5)
        py.set((e.clientY - rect.top) / rect.height - 0.5)
      }}
      onMouseLeave={() => {
        px.set(0)
        py.set(0)
      }}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileHover={{ y: -8 }}
      className="glass group relative overflow-hidden rounded-[var(--radius)] p-7"
    >
      <motion.div aria-hidden style={{ background: light }} className="pointer-events-none absolute inset-0" />
      <div
        aria-hidden
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-electric/20 to-neon/20 blur-2xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
      />
      <motion.span
        className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-electric/30 bg-electric/10 text-electric"
        whileHover={{ rotate: [0, -12, 10, 0], scale: 1.1 }}
        transition={{ duration: 0.5 }}
      >
        <Icon size={22} />
      </motion.span>
      <h3 className="relative font-display text-lg font-bold uppercase tracking-wide">{feature.title}</h3>
      <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{feature.text}</p>
    </motion.div>
  )
}

export function Features() {
  return (
    <section className="relative mx-auto max-w-6xl px-6 py-28">
      <div className="mb-14 flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-electric">05 — Engineering</p>
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
          <span className="text-chrome">Built different.</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f, i) => (
          <FeatureCard key={f.title} feature={f} index={i} />
        ))}
      </div>
    </section>
  )
}
