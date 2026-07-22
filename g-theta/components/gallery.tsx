"use client"

import { motion } from "motion/react"

type Tile = {
  caption: string
  sub: string
  h: string
  bg: string
}

const tiles: Tile[] = [
  {
    caption: "Studio 01",
    sub: "Shadow colorway",
    h: "h-72",
    bg: "radial-gradient(ellipse at 30% 20%, #26262e, #08080a 70%)",
  },
  {
    caption: "Macro",
    sub: "480 GSM loopback",
    h: "h-52",
    bg: "radial-gradient(ellipse at 70% 30%, rgba(79,124,255,0.5), #0a0a12 75%)",
  },
  {
    caption: "Night Drive",
    sub: "Campaign film still",
    h: "h-64",
    bg: "linear-gradient(160deg, #10101a, #1c1030 55%, #0a0a0e)",
  },
  {
    caption: "Motion Test 03",
    sub: "Fabric in 240 fps",
    h: "h-56",
    bg: "radial-gradient(ellipse at 50% 80%, rgba(168,85,247,0.45), #0b0b10 70%)",
  },
  {
    caption: "Chrome Study",
    sub: "Hardware detail",
    h: "h-64",
    bg: "linear-gradient(120deg, #34343c, #101014 45%, #3d3d47 90%)",
  },
  {
    caption: "Studio 02",
    sub: "Ghost colorway",
    h: "h-52",
    bg: "radial-gradient(ellipse at 40% 30%, #55555f, #16161a 75%)",
  },
  {
    caption: "Blueprint",
    sub: "Pattern drafting",
    h: "h-72",
    bg: "linear-gradient(200deg, #0d1428, #0a0a0e 60%), radial-gradient(circle at 70% 20%, rgba(79,124,255,0.35), transparent 60%)",
  },
  {
    caption: "After Hours",
    sub: "HYD rooftop",
    h: "h-56",
    bg: "linear-gradient(180deg, #191024, #08080a)",
  },
]

export function Gallery() {
  return (
    <section id="gallery" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-28">
      <div className="mb-14 flex flex-col gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-electric">07 — Gallery</p>
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
          In the wild.
        </h2>
      </div>

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {tiles.map((tile, i) => (
          <motion.figure
            key={tile.caption}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.08 }}
            className="group relative break-inside-avoid overflow-hidden rounded-[var(--radius)] border border-border"
            data-cursor
          >
            <div
              className={`${tile.h} w-full transition-transform duration-700 ease-out group-hover:scale-110`}
              style={{ background: tile.bg }}
            />
            {/* light sweep */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000 ease-out group-hover:left-[150%]"
            />
            {/* caption */}
            <figcaption className="absolute inset-x-0 bottom-0 flex translate-y-3 items-end justify-between p-5 opacity-0 backdrop-blur-[2px] transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
              <span>
                <span className="block font-display text-sm font-bold uppercase tracking-wide">{tile.caption}</span>
                <span className="block text-xs text-muted-foreground">{tile.sub}</span>
              </span>
              <span className="text-electric">↗</span>
            </figcaption>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[var(--radius)] border border-electric/0 transition-all duration-500 group-hover:border-electric/40"
            />
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
