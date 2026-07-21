const items = [
  "FULL LOCAL",
  "★",
  "SEMMA SCENE",
  "★",
  "CHILL CHEDDAM",
  "★",
  "IDLI POWER",
  "★",
  "MANAKI TELIYADU",
  "★",
  "FULL MASS",
  "★",
]

export function Marquee() {
  const loop = [...items, ...items]
  return (
    <div className="overflow-hidden border-y border-border bg-muted py-3">
      <div className="marquee-track">
        {loop.map((item, i) => (
          <span
            key={i}
            className={`mx-4 shrink-0 font-display text-sm font-bold uppercase tracking-widest ${
              item === "★" ? "text-gold" : "text-muted-foreground"
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
