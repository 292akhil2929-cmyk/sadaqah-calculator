"use client"

import { Plus } from "lucide-react"
import type { Product } from "@/lib/products"
import { ProductVisual } from "@/components/product-visual"
import { useCart } from "@/components/cart-context"

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()

  return (
    <div className="card-tilt group flex flex-col gap-3">
      <ProductVisual product={product} />
      <div className="flex items-start justify-between gap-2 px-1">
        <div>
          <h3 className="font-semibold leading-tight">{product.name}</h3>
          <p className="text-sm text-muted-foreground">{product.tagline}</p>
          <p className="mt-1 font-semibold text-gold">₹{product.price}</p>
        </div>
        <button
          onClick={() => addItem(product)}
          aria-label={`Add ${product.name} to cart`}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition hover:bg-gold hover:rotate-90 duration-300"
        >
          <Plus size={18} />
        </button>
      </div>
    </div>
  )
}
