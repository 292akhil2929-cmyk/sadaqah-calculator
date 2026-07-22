"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValueEvent, useScroll } from "motion/react"
import { ShoppingBag } from "lucide-react"
import { Logo } from "@/components/logo"
import { useCart } from "@/components/cart-context"
import { scrollToId } from "@/components/smooth-scroll"

const links = [
  { href: "#collection", label: "Collection" },
  { href: "#configure", label: "Configure" },
  { href: "#fabric", label: "Fabric" },
  { href: "#gallery", label: "Gallery" },
]

export function FloatingNav() {
  const { totalCount, openCart } = useCart()
  const { scrollY } = useScroll()
  const [shrunk, setShrunk] = useState(false)
  const [active, setActive] = useState("")

  useMotionValueEvent(scrollY, "change", (y) => setShrunk(y > 80))

  useEffect(() => {
    const sections = links
      .map((l) => document.querySelector(l.href))
      .filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return (
    <motion.header
      className="fixed inset-x-0 top-4 z-40 flex justify-center px-4"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 2.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.div
        className="glass flex w-full max-w-3xl items-center justify-between rounded-full pl-5 pr-2"
        animate={{ paddingTop: shrunk ? 6 : 10, paddingBottom: shrunk ? 6 : 10, scale: shrunk ? 0.96 : 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 28 }}
      >
        <button onClick={() => scrollToId("#top")} aria-label="G Theta home" className="flex items-center">
          <Logo className="h-7 w-auto" />
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollToId(link.href)}
              className={`relative rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                active === link.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              {active === link.href && (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-electric to-neon"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          ))}
        </nav>

        <button
          id="nav-cart"
          onClick={openCart}
          className="relative flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-2 text-sm font-medium transition hover:border-electric/60 hover:text-electric"
        >
          <ShoppingBag size={16} />
          <span className="hidden sm:inline">Cart</span>
          {totalCount > 0 && (
            <motion.span
              key={totalCount}
              initial={{ scale: 0.3 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-electric text-xs font-bold text-white shadow-[0_0_12px_rgba(79,124,255,0.7)]"
            >
              {totalCount}
            </motion.span>
          )}
        </button>
      </motion.div>
    </motion.header>
  )
}
