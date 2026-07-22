"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { motion } from "motion/react"
import { Logo } from "@/components/logo"

const PreloaderContext = createContext(false)

export function usePreloaderDone() {
  return useContext(PreloaderContext)
}

export function PreloaderProvider({ children }: { children: React.ReactNode }) {
  const [done, setDone] = useState(false)
  const [exiting, setExiting] = useState(false)
  const [count, setCount] = useState(0)

  // if motion's exit animation can't run (throttled rAF), force completion
  useEffect(() => {
    if (!exiting || done) return
    const t = setTimeout(() => {
      document.body.style.overflow = ""
      setDone(true)
    }, 1400)
    return () => clearTimeout(t)
  }, [exiting, done])

  useEffect(() => {
    if (done) return
    document.body.style.overflow = "hidden"
    const start = performance.now()
    const duration = 1500
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      setCount(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
      else setExiting(true)
    }
    raf = requestAnimationFrame(tick)
    // rAF can be throttled to a halt in background/occluded tabs — force the exit
    const fallback = setTimeout(() => {
      setCount(100)
      setExiting(true)
    }, duration + 900)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(fallback)
      document.body.style.overflow = ""
    }
  }, [done])

  return (
    <PreloaderContext.Provider value={done}>
      {children}
      {!done && (
        <div className="fixed inset-0 z-[100]">
          {/* two staggered curtain panels */}
          <motion.div
            className="absolute inset-0 bg-[#0a0a0e]"
            animate={exiting ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
          />
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-8 bg-background"
            animate={exiting ? { y: "-100%" } : { y: 0 }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            onAnimationComplete={() => {
              if (exiting) {
                document.body.style.overflow = ""
                setDone(true)
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <Logo className="text-8xl sm:text-9xl" />
            </motion.div>
            <div className="flex w-56 flex-col items-center gap-3">
              <div className="h-px w-full overflow-hidden bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-electric to-neon"
                  style={{ width: `${count}%` }}
                />
              </div>
              <div className="flex w-full items-center justify-between text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span>Loading</span>
                <span className="font-display tabular-nums text-foreground">{count}%</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </PreloaderContext.Provider>
  )
}
