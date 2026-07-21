import type { Product } from "@/lib/products"

export function ProductVisual({ product }: { product: Product }) {
  return (
    <div
      className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-[var(--radius)]"
      style={{
        background: `linear-gradient(150deg, ${product.colorFrom} 0%, ${product.colorTo} 100%)`,
      }}
    >
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-black/20 blur-2xl" />
      <span className="logo-og absolute left-4 top-4 text-lg font-black text-white/70">Gθ</span>
      <p className="relative px-6 text-center font-display text-2xl font-black uppercase leading-tight text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)] sm:text-3xl">
        {product.print}
      </p>
      <span className="absolute bottom-4 right-4 rounded-full bg-black/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/80">
        {product.category}
      </span>
    </div>
  )
}
