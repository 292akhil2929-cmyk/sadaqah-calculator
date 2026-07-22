"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

type Trail = { id: number; x: number; y: number }

let trailId = 0

export function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [pressed, setPressed] = useState(false)
  const [trail, setTrail] = useState<Trail[]>([])
  const lastSpawn = useRef(0)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const ringX = useSpring(x, { stiffness: 380, damping: 34, mass: 0.55 })
  const ringY = useSpring(y, { stiffness: 380, damping: 34, mass: 0.55 })
  // stretch from velocity
  const scaleX = useMotionValue(1)
  const scaleY = useMotionValue(1)
  const rotate = useMotionValue(0)

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return
    setEnabled(true)
    document.body.classList.add("has-cursor")

    let prevX = 0
    let prevY = 0

    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const vx = e.clientX - prevX
      const vy = e.clientY - prevY
      prevX = e.clientX
      prevY = e.clientY
      const speed = Math.min(Math.hypot(vx, vy), 40)
      const stretch = 1 + speed * 0.012
      scaleX.set(stretch)
      scaleY.set(1 / stretch)
      rotate.set((Math.atan2(vy, vx) * 180) / Math.PI)

      const now = performance.now()
      if (speed > 6 && now - lastSpawn.current > 40) {
        lastSpawn.current = now
        const t = { id: ++trailId, x: e.clientX, y: e.clientY }
        setTrail((prev) => [...prev.slice(-7), t])
        setTimeout(() => setTrail((prev) => prev.filter((p) => p.id !== t.id)), 500)
      }
    }
    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      setHovering(!!target?.closest("a, button, [role='button'], [data-cursor]"))
    }
    const down = () => setPressed(true)
    const up = () => setPressed(false)

    window.addEventListener("mousemove", move, { passive: true })
    window.addEventListener("mouseover", over, { passive: true })
    window.addEventListener("mousedown", down)
    window.addEventListener("mouseup", up)
    return () => {
      document.body.classList.remove("has-cursor")
      window.removeEventListener("mousemove", move)
      window.removeEventListener("mouseover", over)
      window.removeEventListener("mousedown", down)
      window.removeEventListener("mouseup", up)
    }
  }, [x, y, scaleX, scaleY, rotate])

  if (!enabled) return null

  return (
    <>
      {trail.map((t) => (
        <motion.span
          key={t.id}
          className="pointer-events-none fixed left-0 top-0 z-[94] h-1.5 w-1.5 rounded-full bg-electric"
          style={{ x: t.x, y: t.y, translateX: "-50%", translateY: "-50%" }}
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: 0, scale: 0.2 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      ))}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] h-2 w-2 rounded-full bg-foreground"
        style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[95] rounded-full border border-electric/70"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%", scaleX, scaleY, rotate }}
        animate={{
          width: hovering ? 56 : 34,
          height: hovering ? 56 : 34,
          scale: pressed ? 0.75 : 1,
          backgroundColor: hovering ? "rgba(79, 124, 255, 0.14)" : "rgba(79, 124, 255, 0)",
          boxShadow: hovering ? "0 0 24px rgba(79,124,255,0.35)" : "0 0 0px rgba(79,124,255,0)",
        }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
      />
    </>
  )
}
