import type { Metadata } from "next"
import { Inter, Anton, Permanent_Marker } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart-context"
import { CartDrawer } from "@/components/cart-drawer"
import { MemeToaster } from "@/components/meme-toaster"
import { Navbar } from "@/components/navbar"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const anton = Anton({ subsets: ["latin"], weight: "400", variable: "--font-anton" })
const marker = Permanent_Marker({ subsets: ["latin"], weight: "400", variable: "--font-marker" })

export const metadata: Metadata = {
  title: "G Theta — Full Local Streetwear",
  description:
    "G Theta (Gθ) — a Telugu-humor streetwear brand. Oversized tees, hoodies, and caps with original Tenglish one-liner prints.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${anton.variable} ${marker.variable}`}>
      <body>
        <div className="grain" />
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden>
          <filter id="rough-ink" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.06" numOctaves="2" seed="7" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </svg>
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
