"use client"

import { useEffect, useRef } from "react"
import { gsap } from "@/lib/gsap"

const labels = [
  { text: "Breathable", pos: "left-[8%] top-[22%]" },
  { text: "Ultra Soft", pos: "right-[10%] top-[28%]" },
  { text: "Premium Cotton", pos: "left-[12%] bottom-[26%]" },
  { text: "Water Resistant", pos: "right-[8%] bottom-[20%]" },
]

export function Fabric() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ref.current,
          start: "top top",
          end: "+=1800",
          scrub: 1,
          pin: true,
        },
      })
      tl.fromTo(".fabric-weave", { scale: 1, opacity: 0.4 }, { scale: 7, opacity: 1, ease: "power2.inOut", duration: 4 })
        .to(".fabric-title", { opacity: 0, y: -80, scale: 0.9, filter: "blur(8px)", duration: 1.2 }, 0.4)
        .fromTo(".fabric-micro", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 1.5 }, 1.4)
        .fromTo(
          ".fabric-label",
          { opacity: 0, y: 40, scale: 0.85, filter: "blur(6px)" },
          { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", stagger: 0.55, duration: 0.9, ease: "power3.out" },
          1.6
        )
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="fabric" ref={ref} className="relative h-screen overflow-hidden">
      <div className="fabric-weave weave absolute inset-[-40%] origin-center" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 25%, rgba(5,5,7,0.9) 85%)" }}
      />

      {/* microscope fibers */}
      <div className="fabric-micro absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 opacity-0 sm:h-96 sm:w-96">
        <svg viewBox="0 0 200 200" className="h-full w-full">
          <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(79,124,255,0.4)" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="78" fill="rgba(79,124,255,0.04)" />
          <path d="M30 90 C60 70 90 110 130 88 C150 78 165 92 175 84" stroke="rgba(215,217,224,0.5)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M25 110 C65 95 85 130 125 110 C150 98 160 115 178 106" stroke="rgba(215,217,224,0.35)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M35 130 C70 118 95 148 135 128 C155 118 168 130 175 126" stroke="rgba(168,85,247,0.35)" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M40 70 C75 60 100 85 140 68 C158 60 168 70 176 64" stroke="rgba(79,124,255,0.3)" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <div className="fabric-title absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-electric">03 — Material</p>
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
          <span className="text-chrome">Engineered fabric.</span>
          <br />
          Zoom closer.
        </h2>
        <p className="max-w-sm text-muted-foreground">Keep scrolling — down to the fiber.</p>
      </div>

      {labels.map((label) => (
        <div key={label.text} className={`fabric-label glass absolute ${label.pos} flex items-center gap-2.5 rounded-full px-5 py-2.5 opacity-0`}>
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-electric" />
          <span className="text-sm font-semibold">{label.text}</span>
        </div>
      ))}
    </section>
  )
}
