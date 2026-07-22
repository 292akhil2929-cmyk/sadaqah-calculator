"use client"

import { useRef } from "react"
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react"
import { Plus } from "lucide-react"
import { products, type Product } from "@/lib/products"
import { HoodieSvg } from "@/components/hoodie-svg"
import { SplitChars } from "@/components/split-text"
import { useCart } from "@/components/cart-context"

function ShowcaseCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart()
  const ref = useRef<HTMLDivElement>(null)

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [9, -9]), { stiffness: 220, damping: 18 })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-11, 11]), { stiffness: 220, damping: 18 })
  const lightX = useTransform(px, [-0.5, 0.5], [10, 90])
  const lightY = useTransform(py, [-0.5, 0.5], [10, 90])
  const light = useMotionTemplate`radial-gradient(420px circle at ${lightX}% ${lightY}%, rgba(79,124,255,0.14), transparent 55%)`

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.94, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.12 }}
    >
      <div className="border-anim transition-shadow duration-500 hover:shadow-[0_30px_80px_-20px_rgba(79,124,255,0.35)]">
        <motion.div
          ref={ref}
          onMouseMove={(e) => {
            const rect = ref.current?.getBoundingClientRect()
            if (!rect) return
            px.set((e.clientX - rect.left) / rect.width - 0.5)
            py.set((e.clientY - rect.top) / rect.height - 0.5)
          }}
          onMouseLeave={() => {
            px.set(0)
            py.set(0)
          }}
          style={{ rotateX, rotateY, transformPerspective: 900 }}
          className="border-anim-inner group relative overflow-hidden p-6"
        >
          <motion.div aria-hidden style={{ background: light }} className="pointer-events-none absolute inset-0" />
          {/* morphing backdrop */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background: `radial-gradient(ellipse at 50% 20%, ${product.colorFrom}22, transparent 65%)`,
            }}
          />

          <div className="relative flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
            <span>{product.code}</span>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="pulse-dot h-1 w-1 rounded-full bg-electric opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ animationDelay: `${i * 0.25}s` }}
                />
              ))}
            </span>
          </div>

          <div className="relative mx-auto my-4 w-40 transition-transform duration-700 ease-out group-hover:scale-110 sm:w-44">
            <HoodieSvg colorFrom={product.colorFrom} colorTo={product.colorTo} className="w-full drop-shadow-[0_20px_30px_rgba(0,0,0,0.45)]" />
          </div>

          <div className="relative flex items-end justify-between">
            <div>
              <h3 className="font-display text-xl font-bold uppercase tracking-wide">{product.name}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">₹{product.price.toLocaleString("en-IN")}</p>
            </div>
            <button
              onClick={() => addItem(product)}
              aria-label={`Add ${product.name} to cart`}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-white/5 transition duration-300 hover:rotate-90 hover:border-electric hover:bg-electric hover:text-white hover:shadow-[0_0_24px_rgba(79,124,255,0.5)]"
            >
              <Plus size={17} />
            </button>
          </div>

          {/* specs reveal */}
          <div className="relative grid grid-rows-[0fr] transition-all duration-500 ease-out group-hover:mt-4 group-hover:grid-rows-[1fr]">
            <div className="overflow-hidden">
              <ul className="flex flex-col gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                <li className="flex justify-between"><span>Weight</span><span className="text-foreground/80">{product.specs.weight}</span></li>
                <li className="flex justify-between"><span>Fabric</span><span className="text-foreground/80">{product.specs.fabric}</span></li>
                <li className="flex justify-between"><span>Fit</span><span className="text-foreground/80">{product.specs.fit}</span></li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export function Showcase() {
  return (
    <section id="collection" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
      <div className="mb-14 flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-electric">01 — Collection</p>
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
          <SplitChars text="THE COLLECTION" stagger={0.03} />
        </h2>
        <p className="max-w-md text-muted-foreground">
          Six colorways. One silhouette. Every piece cut from the same 480 GSM loopback cotton.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <ShowcaseCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </section>
  )
}
