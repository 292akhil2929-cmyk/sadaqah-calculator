import { Logo } from "@/components/logo"
import { Marquee } from "@/components/marquee"
import { ProductCard } from "@/components/product-card"
import { Footer } from "@/components/footer"
import { products } from "@/lib/products"

export default function Home() {
  return (
    <main>
      <section className="relative flex flex-col items-center gap-6 overflow-hidden px-6 pb-20 pt-20 text-center sm:pt-28">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-gold/20 blur-[100px]" />
        <p className="rounded-full border border-border px-4 py-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Full Local Streetwear
        </p>
        <Logo className="text-7xl sm:text-8xl" />
        <h1 className="max-w-2xl text-balance text-2xl font-bold sm:text-3xl">
          Original Tenglish one-liners. Loud prints. Zero copy-paste memes.
        </h1>
        <p className="max-w-xl text-muted-foreground">
          Every add-to-cart, every remove, every empty bag — G Theta talks back to you in Telugu-English
          banter written just for this brand.
        </p>
        <a
          href="#shop"
          className="rounded-full bg-gold px-6 py-3 font-semibold text-black transition hover:brightness-110"
        >
          Shop the drop
        </a>
      </section>

      <Marquee />

      <section id="shop" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-black uppercase tracking-wide">The Drop</h2>
          <span className="text-sm text-muted-foreground">{products.length} designs</span>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
