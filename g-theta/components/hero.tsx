"use client"

import { useRef } from "react"
import dynamic from "next/dynamic"
import { motion, useScroll, useTransform } from "motion/react"
import { ArrowDown } from "lucide-react"
import { Magnetic } from "@/components/magnetic"
import { RippleButton } from "@/components/ripple-button"
import { SplitChars } from "@/components/split-text"
import { AuroraField, DustField } from "@/components/background-fx"
import { usePreloaderDone } from "@/components/preloader"
import { scrollToId } from "@/components/smooth-scroll"

const HeroCanvas = dynamic(() => import("@/components/three/hero-canvas").then((m) => m.HeroCanvas), {
  ssr: false,
})

const EASE = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const done = usePreloaderDone()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 180])
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 1.25])

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden">
      {/* atmosphere */}
      <AuroraField />
      <div aria-hidden className="light-rays absolute inset-0" />
      <DustField count={30} />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 60%, transparent 30%, rgba(5,5,7,0.85) 90%)" }}
      />

      {/* 3D hoodie */}
      <motion.div style={{ scale: canvasScale, opacity: contentOpacity }} className="absolute inset-0">
        {done && <HeroCanvas />}
      </motion.div>

      {/* copy */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 flex flex-col items-center gap-7 px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7, ease: EASE }}
          className="glass flex items-center gap-2.5 rounded-full px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-electric" />
          G Theta — Drop 001
        </motion.p>

        <h1 className="font-display uppercase leading-[0.94] tracking-tight">
          <span className="block text-5xl sm:text-7xl lg:text-8xl">
            <SplitChars text="THE FUTURE" trigger={done} delay={0.35} charClassName="text-chrome" />
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-8xl">
            <SplitChars text="OF STREETWEAR" trigger={done} delay={0.75} stagger={0.03} charClassName="text-foreground" />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
          animate={done ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ delay: 1.35, duration: 0.8, ease: EASE }}
          className="max-w-md text-balance text-muted-foreground"
        >
          Engineered for comfort. Built for movement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={done ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.55, duration: 0.8, ease: EASE }}
        >
          <Magnetic strength={0.35}>
            <RippleButton
              onClick={() => scrollToId("#collection")}
              className="group rounded-full border border-electric/40 bg-electric/10 px-9 py-4 font-semibold text-foreground backdrop-blur-md transition-all duration-500 hover:border-electric hover:bg-electric/20 hover:px-11 hover:shadow-[0_0_40px_rgba(79,124,255,0.45)]"
            >
              Explore Collection
              <ArrowDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </RippleButton>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={done ? { opacity: 1 } : {}}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-muted-foreground"
      >
        Scroll
        <span className="relative block h-10 w-px overflow-hidden bg-white/10">
          <motion.span
            className="absolute left-0 top-0 h-4 w-px bg-gradient-to-b from-electric to-transparent"
            animate={{ y: [-16, 40] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  )
}
