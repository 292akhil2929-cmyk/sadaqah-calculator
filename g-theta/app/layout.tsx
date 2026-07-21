import type { Metadata } from "next"
import { Inter, Anton } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart-context"
import { CartDrawer } from "@/components/cart-drawer"
import { MemeToaster } from "@/components/meme-toaster"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" })

export const metadata: Metadata = {
  title: "G Theta — Full Local Streetwear",
  description:
    "G Theta (Gθ) — a Telugu-humor streetwear brand. Oversized tees, hoodies, and caps with original Tenglish one-liner prints.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable}`}>
      <body>
        <div className="grain" />
        <CartProvider>
          <Navbar />
          {children}
          <CartDrawer />
          <MemeToaster />
        </CartProvider>
      </body>
    </html>
  )
}
