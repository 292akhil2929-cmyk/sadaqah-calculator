"use client"

import { AnimatePresence, motion } from "motion/react"
import { Minus, Plus, X } from "lucide-react"
import { useCart } from "@/components/cart-context"
import { emptyCartLines, randomOf } from "@/lib/memes"
import { useMemo } from "react"

export function CartDrawer() {
  const { lines, isOpen, closeCart, removeItem, incrementQty, decrementQty, totalPrice } = useCart()
  const emptyLine = useMemo(() => randomOf(emptyCartLines), [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-muted"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
          >
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="text-lg font-bold">Your Bag</h2>
              <button onClick={closeCart} aria-label="Close cart" className="rounded-full p-1 hover:bg-white/5">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
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
                        key={line.product.id}
                        layout
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40, scale: 0.9 }}
                        transition={{ duration: 0.35, ease: "easeInOut" }}
                        className="flex items-center gap-3 rounded-xl border border-border bg-background/40 p-3"
                      >
                        <div
                          className="h-16 w-14 shrink-0 rounded-lg"
                          style={{
                            background: `linear-gradient(150deg, ${line.product.colorFrom}, ${line.product.colorTo})`,
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{line.product.name}</p>
                          <p className="text-xs text-muted-foreground">₹{line.product.price}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button
                              onClick={() => decrementQty(line.product.id)}
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-border hover:border-gold"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-4 text-center text-sm">{line.qty}</span>
                            <button
                              onClick={() => incrementQty(line.product.id)}
                              className="flex h-6 w-6 items-center justify-center rounded-full border border-border hover:border-gold"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(line.product.id)}
                          aria-label={`Remove ${line.product.name}`}
                          className="rounded-full p-1.5 text-muted-foreground hover:bg-chilli/20 hover:text-chilli"
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
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="text-lg font-bold text-gold">₹{totalPrice}</span>
              </div>
              <button
                disabled={lines.length === 0}
                className="w-full rounded-full bg-gold py-3 text-center font-semibold text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
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
