"use client"

import { useMotionValue, useMotionValueEvent, useScroll } from "motion/react"
import type { RefObject } from "react"

// motion v12 promotes scroll-linked transforms to WAAPI ViewTimeline animations;
// partial-range keyframes then interpolate back to the underlying style instead of
// clamping. Mirroring through a plain MotionValue keeps everything on the JS path.
export function useMirroredScrollProgress(
  target: RefObject<HTMLElement | null>,
  offset: NonNullable<Parameters<typeof useScroll>[0]>["offset"]
) {
  const { scrollYProgress } = useScroll({ target, offset })
  const progress = useMotionValue(0)
  useMotionValueEvent(scrollYProgress, "change", (v) => progress.set(v))
  return progress
}
