"use client"

import { useMemo } from "react"
import { AnimatePresence, motion } from "motion/react"
import { Logo } from "@/components/logo"
import { useCart } from "@/components/cart-context"
import { checkoutLines, randomOf } from "@/lib/memes"

const confettiColors = ["#4f7cff", "#a855f7", "#d7d9e0", "#ffffff"]

function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2.2 + Math.random() * 1.6,
        rotate: 240 + Math.random() * 480,
        size: 6 + Math.random() * 8,
        color: confettiColors[i % confettiColors.length],
        round: Math.random() > 0.5,
      })),
    []
  )

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute top-[-4%]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.round ? p.size : p.size * 0.45,
            backgroundColor: p.color,
            borderRadius: p.round ? "999px" : "2px",
          }}
          initial={{ y: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", rotate: p.rotate, opacity: [1, 1, 0.6] }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeIn" }}
        />
      ))}
    </div>
  )
}

export function CheckoutOverlay() {
  const { orderPlaced, dismissOrder } = useCart()
  const line = useMemo(() => randomOf(checkoutLines), [orderPlaced])

  return (
    <AnimatePresence>
      {orderPlaced && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ConfettiBurst />
          <motion.div
            className="glass relative flex max-w-md flex-col items-center gap-5 rounded-3xl border-electric/25 p-10 text-center shadow-[0_0_80px_rgba(79,124,255,0.2)]"
            initial={{ scale: 0.7, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.85, y: 20, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <motion.div
              initial={{ rotate: -12, scale: 0.6 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.15 }}
            >
              <Logo className="h-16 w-auto" />
            </motion.div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
              <span className="text-electric-gradient">Order confirmed</span>
            </h2>
            <p className="text-foreground/90">{line}</p>
            <p className="text-xs text-muted-foreground">
              Demo store — no real money moved. Your wallet is safe. 😌
            </p>
            <button
              onClick={dismissOrder}
              className="mt-2 rounded-full bg-gradient-to-r from-electric to-neon px-7 py-3 font-semibold text-white transition hover:shadow-[0_0_36px_rgba(79,124,255,0.5)]"
            >
              Continue shopping
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
