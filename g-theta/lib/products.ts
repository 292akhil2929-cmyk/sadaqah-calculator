export type Product = {
  id: string
  name: string
  code: string
  price: number
  colorFrom: string
  colorTo: string
  sizes: string[]
  specs: { weight: string; fabric: string; fit: string }
}

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]

const specs = { weight: "480 GSM", fabric: "Brushed loopback cotton", fit: "Relaxed / drop shoulder" }

export const products: Product[] = [
  { id: "gt-shadow",   name: "Shadow",   code: "GΘ-001", price: 4999, colorFrom: "#1b1b20", colorTo: "#08080a", sizes: SIZES, specs },
  { id: "gt-ghost",    name: "Ghost",    code: "GΘ-002", price: 4999, colorFrom: "#f2f2f4", colorTo: "#b9bac2", sizes: SIZES, specs },
  { id: "gt-graphite", name: "Graphite", code: "GΘ-003", price: 4999, colorFrom: "#5a5b64", colorTo: "#2b2c33", sizes: SIZES, specs },
  { id: "gt-cobalt",   name: "Cobalt",   code: "GΘ-004", price: 5499, colorFrom: "#3f6bff", colorTo: "#16267a", sizes: SIZES, specs },
  { id: "gt-sand",     name: "Sand",     code: "GΘ-005", price: 5499, colorFrom: "#d8c9ae", colorTo: "#8f8264", sizes: SIZES, specs },
  { id: "gt-olive",    name: "Olive",    code: "GΘ-006", price: 5499, colorFrom: "#6b7451", colorTo: "#33381f", sizes: SIZES, specs },
]

// Configurator colorways for the 3D viewer
export type Colorway = {
  name: string
  hex: string
  colorFrom: string
  colorTo: string
}

export const COLORWAYS: Colorway[] = [
  { name: "Black", hex: "#17171b", colorFrom: "#1b1b20", colorTo: "#08080a" },
  { name: "White", hex: "#e8e8ea", colorFrom: "#f2f2f4", colorTo: "#b9bac2" },
  { name: "Gray",  hex: "#7a7a82", colorFrom: "#5a5b64", colorTo: "#2b2c33" },
  { name: "Blue",  hex: "#2f5bff", colorFrom: "#3f6bff", colorTo: "#16267a" },
  { name: "Beige", hex: "#cfc0a8", colorFrom: "#d8c9ae", colorTo: "#8f8264" },
  { name: "Olive", hex: "#5d6647", colorFrom: "#6b7451", colorTo: "#33381f" },
  { name: "Red",   hex: "#b3242c", colorFrom: "#d03038", colorTo: "#5c1216" },
]

export function colorwayToProduct(c: Colorway, price = 5999): Product {
  return {
    id: `gt-hoodie-${c.name.toLowerCase()}`,
    name: `Theta One — ${c.name}`,
    code: "GΘ-X",
    price,
    colorFrom: c.colorFrom,
    colorTo: c.colorTo,
    sizes: SIZES,
    specs,
  }
}
