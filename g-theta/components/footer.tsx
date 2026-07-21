import { Logo } from "@/components/logo"

export function Footer() {
  return (
    <footer id="about" className="border-t border-border bg-muted/40 px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo className="text-3xl" />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            G Theta is a clothing label built on Telugu banter — oversized tees, hoodies, and caps
            printed with original Tenglish one-liners. No copy-paste memes, just homegrown mass energy.
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-semibold text-foreground">Ee brand gurinchi</p>
          <p className="mt-2 max-w-xs">
            Prathi order oka funny caption to vastundi. Cart lo add chesina prathi sari, remove chesina
            prathi sari — nee screen meeda oka Tenglish reaction line kanipistundi.
          </p>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-6xl text-xs text-muted-foreground/70">
        © {new Date().getFullYear()} G Theta. Frontend demo storefront — no real payments processed.
      </p>
    </footer>
  )
}
