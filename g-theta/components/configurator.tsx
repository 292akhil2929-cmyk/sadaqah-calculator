"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { AnimatePresence, motion } from "motion/react"
import { Rotate3d, ShoppingBag, Sun, ZoomIn } from "lucide-react"
import { COLORWAYS, SIZES, colorwayToProduct } from "@/lib/products"
import { Magnetic } from "@/components/magnetic"
import { RippleButton } from "@/components/ripple-button"
import { SplitChars } from "@/components/split-text"
import { useCart } from "@/components/cart-context"

const ViewerCanvas = dynamic(
  () => import("@/components/three/viewer-canvas").then((m) => m.ViewerCanvas),
  { ssr: false }
)

type Particle = { id: number; x: number; y: number; dx: number; dy: number; color: string }
type Flyer = { id: number; from: { x: number; y: number }; to: { x: number; y: number } }

let fxId = 0

export function Configurator() {
  const { addItem } = useCart()
  const [colorway, setColorway] = useState(COLORWAYS[0])
  const [size, setSize] = useState("L")
  const [zoom, setZoom] = useState(3.4)
  const [light, setLight] = useState(1)
  const [particles, setParticles] = useState<Particle[]>([])
  const [flyers, setFlyers] = useState<Flyer[]>([])

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    const burst: Particle[] = Array.from({ length: 14 }).map(() => {
      const angle = Math.random() * Math.PI * 2
      const dist = 50 + Math.random() * 90
      return {
        id: ++fxId,
        x: cx,
        y: cy,
        dx: Math.cos(angle) * dist,
        dy: Math.sin(angle) * dist,
        color: Math.random() > 0.5 ? "#4f7cff" : "#a855f7",
      }
    })
    setParticles((prev) => [...prev, ...burst])
    setTimeout(() => setParticles((prev) => prev.filter((p) => !burst.some((b) => b.id === p.id))), 900)

    const cart = document.getElementById("nav-cart")
    if (cart) {
      const cr = cart.getBoundingClientRect()
      const flyer = { id: ++fxId, from: { x: cx, y: cy }, to: { x: cr.left + cr.width / 2, y: cr.top + cr.height / 2 } }
      setFlyers((prev) => [...prev, flyer])
      setTimeout(() => setFlyers((prev) => prev.filter((f) => f.id !== flyer.id)), 900)
      setTimeout(() => addItem(colorwayToProduct(colorway), size), 650)
    } else {
      addItem(colorwayToProduct(colorway), size)
    }
  }

  return (
    <section id="configure" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
      {/* flying dot + particles rendered at viewport level */}
      {flyers.map((f) => (
        <motion.span
          key={f.id}
          className="pointer-events-none fixed z-[75] h-4 w-4 rounded-full bg-electric shadow-[0_0_18px_rgba(79,124,255,0.8)]"
          style={{ left: 0, top: 0 }}
          initial={{ x: f.from.x - 8, y: f.from.y - 8, scale: 1, opacity: 1 }}
          animate={{
            x: [f.from.x - 8, (f.from.x + f.to.x) / 2 - 8, f.to.x - 8],
            y: [f.from.y - 8, Math.min(f.from.y, f.to.y) - 130, f.to.y - 8],
            scale: [1, 0.9, 0.3],
            opacity: [1, 1, 0.8],
          }}
          transition={{ duration: 0.75, ease: "easeInOut" }}
        />
      ))}
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="pointer-events-none fixed z-[75] h-2 w-2 rounded-full"
          style={{ left: 0, top: 0, backgroundColor: p.color }}
          initial={{ x: p.x - 4, y: p.y - 4, scale: 1, opacity: 1 }}
          animate={{ x: p.x - 4 + p.dx, y: p.y - 4 + p.dy, scale: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}

      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        {/* viewer */}
        <motion.div
          initial={{ opacity: 0, x: -40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="border-anim"
        >
          <div className="border-anim-inner relative h-[26rem] overflow-hidden sm:h-[32rem]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: `radial-gradient(ellipse at 50% 45%, ${colorway.hex}26, transparent 70%)` }}
            />
            <ViewerCanvas colorHex={colorway.hex} zoom={zoom} light={light} />
            <span className="glass pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              <Rotate3d size={13} className="text-electric" />
              Drag · 360°
            </span>

            <div className="absolute inset-x-4 bottom-4 flex items-center gap-4">
              <label className="glass flex flex-1 items-center gap-2.5 rounded-full px-3.5 py-2">
                <ZoomIn size={14} className="shrink-0 text-electric" />
                <input
                  type="range"
                  min={2.4}
                  max={4.6}
                  step={0.05}
                  value={4.6 + 2.4 - zoom}
                  onChange={(e) => setZoom(4.6 + 2.4 - parseFloat(e.target.value))}
                  aria-label="Zoom"
                  className="w-full accent-[#4f7cff]"
                />
              </label>
              <label className="glass flex flex-1 items-center gap-2.5 rounded-full px-3.5 py-2">
                <Sun size={14} className="shrink-0 text-neon" />
                <input
                  type="range"
                  min={0.3}
                  max={2}
                  step={0.05}
                  value={light}
                  onChange={(e) => setLight(parseFloat(e.target.value))}
                  aria-label="Lighting"
                  className="w-full accent-[#a855f7]"
                />
              </label>
            </div>
          </div>
        </motion.div>

        {/* controls */}
        <motion.div
          initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="flex flex-col gap-7"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-electric">02 — Configure</p>
            <h2 className="mt-2 font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
              <SplitChars text="THETA ONE" stagger={0.04} />
            </h2>
            <p className="mt-3 max-w-md text-muted-foreground">
              One silhouette, obsessively engineered. Pick your colorway, rotate it in real time, and
              make it yours.
            </p>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-bold">₹5,999</span>
            <span className="text-sm text-muted-foreground line-through">₹7,499</span>
            <span className="rounded-full bg-electric/15 px-2.5 py-1 text-xs font-semibold text-electric">Launch price</span>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              Colorway — <span className="text-foreground">{colorway.name}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {COLORWAYS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setColorway(c)}
                  aria-label={`Color ${c.name}`}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full"
                >
                  {colorway.name === c.name && (
                    <motion.span
                      layoutId="color-ring"
                      className="absolute inset-0 rounded-full border-2 border-electric shadow-[0_0_16px_rgba(79,124,255,0.5)]"
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}
                  <span
                    className="h-8 w-8 rounded-full border border-white/15 transition-transform duration-300 hover:scale-110"
                    style={{ background: `linear-gradient(140deg, ${c.colorFrom}, ${c.colorTo})` }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Size</p>
            <div className="flex flex-wrap gap-2.5">
              {SIZES.map((s) => (
                <motion.button
                  key={s}
                  onClick={() => setSize(s)}
                  whileTap={{ scale: 0.82 }}
                  transition={{ type: "spring", stiffness: 500, damping: 12 }}
                  className={`relative min-w-12 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                    size === s
                      ? "border-electric bg-electric/15 text-foreground shadow-[0_0_20px_rgba(79,124,255,0.35)]"
                      : "border-border text-muted-foreground hover:border-electric/50 hover:px-5 hover:text-foreground"
                  }`}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </div>

          <Magnetic strength={0.25} className="self-start">
            <RippleButton
              onClick={handleAdd}
              className="rounded-full bg-gradient-to-r from-electric to-neon px-10 py-4 font-semibold text-white transition-all duration-500 hover:px-12 hover:shadow-[0_0_50px_rgba(79,124,255,0.55)]"
            >
              <ShoppingBag size={18} />
              Add to Cart — ₹5,999
            </RippleButton>
          </Magnetic>

          <p className="text-xs text-muted-foreground">
            Free shipping over ₹7,999 · 30-day returns · Ships worldwide from HYD
          </p>
        </motion.div>
      </div>
    </section>
  )
}
