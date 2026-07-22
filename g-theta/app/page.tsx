import { Configurator } from "@/components/configurator"
import { Explosion } from "@/components/explosion"
import { Fabric } from "@/components/fabric"
import { Features } from "@/components/features"
import { Footer } from "@/components/footer"
import { Gallery } from "@/components/gallery"
import { Hero } from "@/components/hero"
import { Marquee } from "@/components/marquee"
import { Reviews } from "@/components/reviews"
import { Showcase } from "@/components/showcase"
import { Stats } from "@/components/stats"

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Showcase />
      <Configurator />
      <Fabric />
      <Explosion />
      <Features />
      <Stats />
      <Reviews />
      <Gallery />
      <Footer />
    </main>
  )
}
