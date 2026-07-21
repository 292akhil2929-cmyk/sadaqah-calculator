export type Product = {
  id: string
  name: string
  tagline: string
  print: string
  category: "Oversized Tee" | "Hoodie" | "Cap" | "Sweatshirt"
  price: number
  colorFrom: string
  colorTo: string
}

// Original streetwear-style print lines inspired by everyday Telugu banter —
// written fresh for G Theta, not copied from any existing meme, film, or show.
export const products: Product[] = [
  {
    id: "og-idli-power",
    name: "Idli Power Tee",
    tagline: "Breakfast of champions, mama.",
    print: "IDLI POWER 💪",
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
    category: "Cap",
    price: 649,
    colorFrom: "#0a0a0c",
    colorTo: "#e8462f",
  },
]
