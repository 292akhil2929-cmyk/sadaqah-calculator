"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"
import type { Product } from "@/lib/products"
import { addLines, randomOf, removeLines } from "@/lib/memes"

export type CartLine = {
  product: Product
  qty: number
}

export type MemeToast = {
  id: number
  text: string
  kind: "add" | "remove"
}

type CartContextValue = {
  lines: CartLine[]
  isOpen: boolean
  toasts: MemeToast[]
  openCart: () => void
  closeCart: () => void
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  incrementQty: (productId: string) => void
  decrementQty: (productId: string) => void
  totalCount: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

let toastId = 0

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [toasts, setToasts] = useState<MemeToast[]>([])

  const pushToast = useCallback((text: string, kind: "add" | "remove") => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, text, kind }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2600)
  }, [])

  const addItem = useCallback(
    (product: Product) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.product.id === product.id)
        if (existing) {
          return prev.map((l) => (l.product.id === product.id ? { ...l, qty: l.qty + 1 } : l))
        }
        return [...prev, { product, qty: 1 }]
      })
      pushToast(randomOf(addLines), "add")
      setIsOpen(true)
    },
    [pushToast]
  )

  const removeItem = useCallback(
    (productId: string) => {
      setLines((prev) => prev.filter((l) => l.product.id !== productId))
      pushToast(randomOf(removeLines), "remove")
    },
    [pushToast]
  )

  const incrementQty = useCallback((productId: string) => {
    setLines((prev) => prev.map((l) => (l.product.id === productId ? { ...l, qty: l.qty + 1 } : l)))
  }, [])

  const decrementQty = useCallback(
    (productId: string) => {
      setLines((prev) => {
        const target = prev.find((l) => l.product.id === productId)
        if (target && target.qty <= 1) {
          pushToast(randomOf(removeLines), "remove")
          return prev.filter((l) => l.product.id !== productId)
        }
        return prev.map((l) => (l.product.id === productId ? { ...l, qty: l.qty - 1 } : l))
      })
    },
    [pushToast]
  )

  const totalCount = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines])
  const totalPrice = useMemo(() => lines.reduce((sum, l) => sum + l.qty * l.product.price, 0), [lines])

  const value: CartContextValue = {
    lines,
    isOpen,
    toasts,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    removeItem,
    incrementQty,
    decrementQty,
    totalCount,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
