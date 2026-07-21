"use client"

import { AnimatePresence, motion } from "motion/react"
import { useCart } from "@/components/cart-context"

export function MemeToaster() {
  const { toasts } = useCart()

  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-[60] flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -40, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className={`rounded-full border px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-md ${
              toast.kind === "add"
                ? "border-gold/40 bg-gold/15 text-gold"
                : "border-chilli/40 bg-chilli/15 text-chilli"
            }`}
          >
            {toast.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
