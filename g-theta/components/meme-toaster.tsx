"use client"

import { AnimatePresence, motion } from "motion/react"
import { useCart } from "@/components/cart-context"

export function MemeToaster() {
  const { toasts } = useCart()

  return (
    <div className="pointer-events-none fixed left-1/2 top-5 z-[90] flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -40, scale: 0.85, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 40, scale: 0.85, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 380, damping: 24 }}
            className={`glass rounded-full px-5 py-2.5 text-sm font-medium shadow-lg ${
              toast.kind === "add"
                ? "border-electric/40 text-foreground shadow-[0_0_30px_rgba(79,124,255,0.25)]"
                : "border-red-400/40 text-red-200 shadow-[0_0_30px_rgba(232,70,47,0.2)]"
            }`}
          >
            {toast.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
