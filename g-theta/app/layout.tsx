import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart-context"
import { ClickSpark } from "@/components/fx/click-spark"
import { CartDrawer } from "@/components/cart-drawer"
import { CheckoutOverlay } from "@/components/checkout-overlay"
import { Cursor } from "@/components/cursor"
import { FloatingNav } from "@/components/floating-nav"
import { MemeToaster } from "@/components/meme-toaster"
import { PreloaderProvider } from "@/components/preloader"
import { ScrollProgress } from "@/components/scroll-progress"
import { SmoothScroll } from "@/components/smooth-scroll"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk" })

export const metadata: Metadata = {
  title: "G THETA — The Future of Streetwear",
  description:
    "G Theta (Gθ) — engineered streetwear from Hyderabad. The Theta One hoodie: 480 GSM loopback cotton, one silhouette, deliberately blank.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" id="top" className={`${inter.variable} ${grotesk.variable}`}>
      <body>
        <div className="grain" />
        <CartProvider>
          <PreloaderProvider>
            <SmoothScroll>
              <ScrollProgress />
              <FloatingNav />
              {children}
              <CartDrawer />
              <MemeToaster />
              <CheckoutOverlay />
              <ClickSpark
                sparkColor="#ffffff"
                sparkSize={21}
                sparkRadius={15}
                sparkCount={8}
                duration={400}
                easing="ease-out"
                extraScale={1}
              />
              <Cursor />
            </SmoothScroll>
          </PreloaderProvider>
        </CartProvider>
      </body>
    </html>
  )
}
