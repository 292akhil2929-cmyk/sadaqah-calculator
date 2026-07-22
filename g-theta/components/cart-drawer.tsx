"use client"

import { AnimatePresence, motion } from "motion/react"
import { Minus, Plus, X, Truck } from "lucide-react"
import { FREE_SHIPPING_AT, useCart } from "@/components/cart-context"
import { emptyCartLines, randomOf } from "@/lib/memes"
import { useMemo } from "react"

export function CartDrawer() {
  const { lines, isOpen, closeCart, removeItem, incrementQty, decrementQty, totalPrice, checkout } =
    useCart()
  const emptyLine = useMemo(() => randomOf(emptyCartLines), [isOpen])
  const shippingProgress = Math.min(totalPrice / FREE_SHIPPING_AT, 1)
  const remaining = FREE_SHIPPING_AT - totalPrice

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-border bg-[#0b0b0f]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-display text-lg font-bold uppercase tracking-wide">Your Cart</h2>
              <button onClick={closeCart} aria-label="Close cart" className="rounded-full p-1.5 transition hover:bg-white/5">
                <X size={20} />
              </button>
            </div>

            {lines.length > 0 && (
              <div className="border-b border-border px-6 py-4">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Truck size={14} className={shippingProgress >= 1 ? "text-electric" : ""} />
                    {shippingProgress >= 1
                      ? "Free shipping unlocked"
                      : `₹${remaining.toLocaleString("en-IN")} away from free shipping`}
                  </span>
                  <span className="text-muted-foreground">₹{FREE_SHIPPING_AT.toLocaleString("en-IN")}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-electric to-neon"
                    animate={{ width: `${shippingProgress * 100}%` }}
                    transition={{ type: "spring", stiffness: 200, damping: 26 }}
                  />
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-4" data-lenis-prevent>
              {lines.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-10 text-center text-sm text-muted-foreground"
                >
                  {emptyLine}
                </motion.p>
              ) : (
                <ul className="flex flex-col gap-4">
                  <AnimatePresence initial={false}>
                    {lines.map((line) => (
                      <motion.li
                        key={`${line.product.id}-${line.size}`}
                        layout
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40, scale: 0.9 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="glass flex items-center gap-3 rounded-2xl p-3"
                      >
                        <div
                          className="h-16 w-14 shrink-0 rounded-xl border border-white/10"
                          style={{
                            background: `linear-gradient(150deg, ${line.product.colorFrom}, ${line.product.colorTo})`,
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{line.product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Size {line.size} · ₹{line.product.price.toLocaleString("en-IN")}
                          </p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => decrementQty(line.product.id, line.size)}
                              aria-label="Decrease quantity"
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-border transition hover:border-electric"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-4 text-center text-sm">{line.qty}</span>
                            <button
                              onClick={() => incrementQty(line.product.id, line.size)}
                              aria-label="Increase quantity"
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-border transition hover:border-electric"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(line.product.id, line.size)}
                          aria-label={`Remove ${line.product.name}`}
                          className="rounded-full p-1.5 text-muted-foreground transition hover:bg-red-500/15 hover:text-red-300"
                        >
                          <X size={16} />
                        </button>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            <div className="border-t border-border px-6 py-5">
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-display text-lg font-bold">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <p className="mb-4 text-xs text-muted-foreground">
                {shippingProgress >= 1 ? "Shipping: free" : "Shipping calculated at checkout"}
              </p>
              <button
                onClick={checkout}
                disabled={lines.length === 0}
                className="w-full rounded-full bg-gradient-to-r from-electric to-neon py-3.5 text-center font-semibold text-white transition hover:shadow-[0_0_40px_rgba(79,124,255,0.45)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Checkout
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
