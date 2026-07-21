import type { SilhouetteId } from "@/components/hero-silhouettes"

export type Product = {
  id: string
  name: string
  tagline: string
  print: string
  silhouette: SilhouetteId
  category: "Oversized Tee" | "Hoodie" | "Cap" | "Sweatshirt"
  price: number
  colorFrom: string
  colorTo: string
}

// Original streetwear-style print lines and generic "mass hero" archetype icons —
// written and drawn fresh for G Theta. No real celebrity name, photo, or likeness
// is used anywhere: silhouettes are original archetypes (mass entry, folded-hands
// humble hero, local don, swag walk), not depictions of any specific person.
export const products: Product[] = [
  {
    id: "og-idli-power",
    name: "Idli Power Tee",
    tagline: "Breakfast of champions, mama.",
    print: "IDLI POWER 💪",
    silhouette: "mass-entry",
    category: "Oversized Tee",
    price: 899,
    colorFrom: "#f2c94c",
    colorTo: "#e8462f",
  },
  {
    id: "adhurs-attitude",
    name: "Full Local Hoodie",
    tagline: "Pakka local, full attitude.",
    print: "FULL LOCAL",
    silhouette: "local-don",
    category: "Hoodie",
    price: 1899,
    colorFrom: "#2f2f36",
    colorTo: "#e8462f",
  },
  {
    id: "chill-cheddam-tee",
    name: "Chill Cheddam Tee",
    tagline: "Tension enti mama, chill cheddam.",
    print: "CHILL CHEDDAM 😎",
    silhouette: "swag-walk",
    category: "Oversized Tee",
    price: 949,
    colorFrom: "#4c6ef2",
    colorTo: "#f2c94c",
  },
  {
    id: "bidda-cap",
    name: "Bidda Cap",
    tagline: "One word, full respect.",
    print: "BIDDA",
    silhouette: "folded-hands",
    category: "Cap",
    price: 599,
    colorFrom: "#111114",
    colorTo: "#f2c94c",
  },
  {
    id: "semma-scene-hoodie",
    name: "Semma Scene Hoodie",
    tagline: "Every day is a semma scene.",
    print: "SEMMA SCENE 🔥",
    silhouette: "mass-entry",
    category: "Hoodie",
    price: 1999,
    colorFrom: "#e8462f",
    colorTo: "#f7b733",
  },
  {
    id: "manaki-teliyadu-tee",
    name: "Manaki Teliyadu Tee",
    tagline: "We genuinely have no idea.",
    print: "MANAKI TELIYADU 🤷",
    silhouette: "swag-walk",
    category: "Oversized Tee",
    price: 899,
    colorFrom: "#8e44ec",
    colorTo: "#f2c94c",
  },
  {
    id: "office-nunchi-sweatshirt",
    name: "Office Nunchi Escape Sweatshirt",
    tagline: "5 PM state of mind.",
    print: "OFFICE NUNCHI ESCAPE",
    silhouette: "folded-hands",
    category: "Sweatshirt",
    price: 1699,
    colorFrom: "#1f6f5c",
    colorTo: "#f2c94c",
  },
  {
    id: "full-mass-cap",
    name: "Full Mass Cap",
    tagline: "Mass ga, class ga.",
    print: "FULL MASS",
    silhouette: "local-don",
    category: "Cap",
    price: 649,
    colorFrom: "#0a0a0c",
    colorTo: "#e8462f",
  },
]
