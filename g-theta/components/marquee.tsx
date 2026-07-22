const words = ["PREMIUM", "LIMITED", "LUXURY", "CRAFTED", "ESSENTIALS", "FUTURE"]

export function Marquee() {
  const loop = [...words, ...words, ...words, ...words]
  return (
    <div className="marquee-mask relative overflow-hidden border-y border-border/60 py-6">
      <div className="marquee-track items-baseline">
        {loop.map((word, i) => (
          <span key={i} className="mx-6 flex shrink-0 items-baseline gap-12">
            <span className="font-display text-4xl font-bold uppercase tracking-tight text-chrome sm:text-5xl">
              {word}
            </span>
            <span className="text-electric-gradient text-2xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
