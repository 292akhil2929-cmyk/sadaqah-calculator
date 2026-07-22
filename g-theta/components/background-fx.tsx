"use client"

import { useEffect, useState } from "react"

type Dust = {
  left: number
  top: number
  size: number
  duration: number
  delay: number
  opacity: number
}

export function DustField({ count = 26 }: { count?: number }) {
  const [dust, setDust] = useState<Dust[]>([])

  useEffect(() => {
    setDust(
      Array.from({ length: count }).map(() => ({
        left: Math.random() * 100,
        top: 30 + Math.random() * 70,
        size: 1 + Math.random() * 2.2,
        duration: 9 + Math.random() * 14,
        delay: -Math.random() * 20,
        opacity: 0.15 + Math.random() * 0.4,
      }))
    )
  }, [count])

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {dust.map((d, i) => (
        <span
          key={i}
          className="dust"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animationDuration: `${d.duration}s`,
            animationDelay: `${d.delay}s`,
            ["--dust-o" as string]: d.opacity,
          }}
        />
      ))}
    </div>
  )
}

export function AuroraField({ dim = false }: { dim?: boolean }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${dim ? "opacity-60" : ""}`}>
      <div className="aurora aurora-a h-[34rem] w-[34rem] -left-40 top-[-10%]" />
      <div className="aurora aurora-b h-[30rem] w-[30rem] right-[-8%] top-[30%]" />
      <div className="aurora aurora-c h-[26rem] w-[26rem] left-[30%] bottom-[-12%]" />
    </div>
  )
}
