"use client"

import { motion } from "motion/react"

const EASE = [0.22, 1, 0.36, 1] as const

/**
 * Character-by-character reveal. `trigger` gates the animation (e.g. preloader
 * done for the hero); omit it to animate when scrolled into view.
 */
export function SplitChars({
  text,
  className = "",
  charClassName = "",
  delay = 0,
  stagger = 0.035,
  trigger,
}: {
  text: string
  className?: string
  charClassName?: string
  delay?: number
  stagger?: number
  trigger?: boolean
}) {
  const words = text.split(" ")
  let charIndex = 0
  const useInView = trigger === undefined

  return (
    <span className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden whitespace-nowrap pb-[0.1em] align-top">
          {word.split("").map((ch, ci) => {
            const i = charIndex++
            const anim = { y: "0%", rotate: 0, opacity: 1, filter: "blur(0px)" }
            const init = { y: "115%", rotate: 6, opacity: 0, filter: "blur(6px)" }
            return (
              <motion.span
                key={ci}
                className={`inline-block will-change-transform ${charClassName}`}
                initial={init}
                {...(useInView
                  ? { whileInView: anim, viewport: { once: true, margin: "-80px" } }
                  : { animate: trigger ? anim : init })}
                transition={{ delay: delay + i * stagger, duration: 0.8, ease: EASE }}
              >
                {ch}
              </motion.span>
            )
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}
