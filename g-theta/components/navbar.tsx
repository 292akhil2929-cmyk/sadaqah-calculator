"use client"

import { ShoppingBag } from "lucide-react"
import { Logo } from "@/components/logo"
import { useCart } from "@/components/cart-context"

export function Navbar() {
  const { totalCount, openCart } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Logo className="text-3xl" />
        <nav className="hidden gap-8 text-sm font-medium text-muted-foreground md:flex">
          <a href="#shop" className="transition hover:text-foreground">
            Shop
          </a>
          <a href="#about" className="transition hover:text-foreground">
            About
          </a>
        </nav>
        <button
          onClick={openCart}
          className="relative flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition hover:border-gold hover:text-gold"
        >
          <ShoppingBag size={18} />
          Cart
          {totalCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-chilli text-xs font-bold text-white">
              {totalCount}
            </span>
          )}
        </button>
      </div>
    </header>
  )
}
