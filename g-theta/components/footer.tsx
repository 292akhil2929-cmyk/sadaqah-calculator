"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Instagram, Twitter, Youtube } from "lucide-react"
import { Logo } from "@/components/logo"
import { AuroraField, DustField } from "@/components/background-fx"
import { useCart } from "@/components/cart-context"
import { randomOf, subscribeLines } from "@/lib/memes"

const socials = [
  { icon: Instagram, label: "Instagram" },
  { icon: Twitter, label: "X" },
  { icon: Youtube, label: "YouTube" },
]

export function Footer() {
  const { notify } = useCart()
  const [email, setEmail] = useState("")

  return (
    <footer className="relative overflow-hidden border-t border-border/60 px-6 pt-20">
      <AuroraField dim />
      <DustField count={16} />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 pb-16 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo className="h-12 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            G Theta engineers streetwear from Hyderabad for everywhere. One silhouette at a time,
            obsessively built, deliberately blank.
          </p>
          <div className="mt-6 flex gap-3">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href="#"
                aria-label={s.label}
                whileHover={{ y: -4, rotate: -6, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="glass flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-electric"
              >
                <s.icon size={17} />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="font-semibold uppercase tracking-[0.25em] text-foreground">Explore</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {["Collection", "Configure", "Fabric", "Gallery"].map((l) => (
              <li key={l}>
                <a href={`#${l.toLowerCase()}`} className="group relative transition hover:text-foreground">
                  {l}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-gradient-to-r from-electric to-neon transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em]">Early access</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Drop 002 is in the lab. Join the list — first dibs, no spam.
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              notify(randomOf(subscribeLines))
              setEmail("")
            }}
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@future.com"
              className="w-full rounded-full border border-border bg-white/5 px-4 py-2.5 text-sm outline-none transition-all duration-300 placeholder:text-muted-foreground/50 focus:border-electric focus:shadow-[0_0_24px_rgba(79,124,255,0.35)]"
            />
            <button
              type="submit"
              className="shrink-0 rounded-full bg-gradient-to-r from-electric to-neon px-5 py-2.5 text-sm font-semibold text-white transition hover:shadow-[0_0_28px_rgba(79,124,255,0.5)]"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <p className="relative mx-auto max-w-6xl pb-8 text-xs text-muted-foreground/60">
        © {new Date().getFullYear()} G Theta. Demo storefront — no real payments processed.
      </p>

      <div
        aria-hidden
        className="text-stroke-faint pointer-events-none relative select-none whitespace-nowrap text-center font-display text-[21vw] font-bold uppercase leading-[0.8] tracking-tight"
        style={{ marginBottom: "-0.24em" }}
      >
        G THETA
      </div>
    </footer>
  )
}
