"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { products, type Product } from "@/lib/products"
import { addLines, randomOf, removeLines } from "@/lib/memes"

export type CartLine = {
  product: Product
  size: string
  qty: number
}

export type MemeToast = {
  id: number
  text: string
  kind: "add" | "remove"
}

export const FREE_SHIPPING_AT = 7999

type CartContextValue = {
  lines: CartLine[]
  isOpen: boolean
  toasts: MemeToast[]
  orderPlaced: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (product: Product, size?: string, qty?: number) => void
  removeItem: (productId: string, size: string) => void
  incrementQty: (productId: string, size: string) => void
  decrementQty: (productId: string, size: string) => void
  checkout: () => void
  dismissOrder: () => void
  notify: (text: string, kind?: "add" | "remove") => void
  totalCount: number
  totalPrice: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = "gtheta-cart-v1"

let toastId = 0

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [toasts, setToasts] = useState<MemeToast[]>([])
  const hydrated = useRef(false)

  // Rehydrate from localStorage (ids + sizes only; product data stays canonical)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved: { id: string; size: string; qty: number }[] = JSON.parse(raw)
        const restored = saved
          .map((s) => {
            const product = products.find((p) => p.id === s.id)
            return product ? { product, size: s.size, qty: Math.max(1, s.qty) } : null
          })
          .filter(Boolean) as CartLine[]
        if (restored.length) setLines(restored)
      }
    } catch {}
    hydrated.current = true
  }, [])

  useEffect(() => {
    if (!hydrated.current) return
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(lines.map((l) => ({ id: l.product.id, size: l.size, qty: l.qty })))
      )
    } catch {}
  }, [lines])

  const pushToast = useCallback((text: string, kind: "add" | "remove") => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, text, kind }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2600)
  }, [])

  const addItem = useCallback(
    (product: Product, size?: string, qty: number = 1) => {
      const chosenSize = size ?? (product.sizes.includes("L") ? "L" : product.sizes[0])
      setLines((prev) => {
        const existing = prev.find((l) => l.product.id === product.id && l.size === chosenSize)
        if (existing) {
          return prev.map((l) =>
            l.product.id === product.id && l.size === chosenSize ? { ...l, qty: l.qty + qty } : l
          )
        }
        return [...prev, { product, size: chosenSize, qty }]
      })
      pushToast(randomOf(addLines), "add")
      setIsOpen(true)
    },
    [pushToast]
  )

  const removeItem = useCallback(
    (productId: string, size: string) => {
      setLines((prev) => prev.filter((l) => !(l.product.id === productId && l.size === size)))
      pushToast(randomOf(removeLines), "remove")
    },
    [pushToast]
  )

  const incrementQty = useCallback((productId: string, size: string) => {
    setLines((prev) =>
      prev.map((l) => (l.product.id === productId && l.size === size ? { ...l, qty: l.qty + 1 } : l))
    )
  }, [])

  const decrementQty = useCallback(
    (productId: string, size: string) => {
      setLines((prev) => {
        const target = prev.find((l) => l.product.id === productId && l.size === size)
        if (target && target.qty <= 1) {
          pushToast(randomOf(removeLines), "remove")
          return prev.filter((l) => !(l.product.id === productId && l.size === size))
        }
        return prev.map((l) =>
          l.product.id === productId && l.size === size ? { ...l, qty: l.qty - 1 } : l
        )
      })
    },
    [pushToast]
  )

  const checkout = useCallback(() => {
    setLines([])
    setIsOpen(false)
    setOrderPlaced(true)
  }, [])

  const dismissOrder = useCallback(() => setOrderPlaced(false), [])

  const notify = useCallback(
    (text: string, kind: "add" | "remove" = "add") => pushToast(text, kind),
    [pushToast]
  )

  const totalCount = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines])
  const totalPrice = useMemo(() => lines.reduce((sum, l) => sum + l.qty * l.product.price, 0), [lines])

  const value: CartContextValue = {
    lines,
    isOpen,
    toasts,
    orderPlaced,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    removeItem,
    incrementQty,
    decrementQty,
    checkout,
    dismissOrder,
    notify,
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
