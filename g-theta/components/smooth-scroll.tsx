"use client"

import { useEffect } from "react"
import Lenis from "lenis"
import { gsap, ScrollTrigger } from "@/lib/gsap"

declare global {
  interface Window {
    __lenis?: Lenis
  }
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true })
    window.__lenis = lenis

    lenis.on("scroll", ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      window.__lenis = undefined
    }
  }, [])

  return <>{children}</>
}

export function scrollToId(id: string) {
  const el = document.querySelector(id)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.4 })
  else el.scrollIntoView({ behavior: "smooth" })
}
