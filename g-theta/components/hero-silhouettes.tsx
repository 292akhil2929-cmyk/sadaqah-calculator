// Original generic "mass hero" archetype icons — silhouettes only, not depicting
// or resembling any specific real person. Drawn fresh for G Theta.

export type SilhouetteId = "mass-entry" | "folded-hands" | "local-don" | "swag-walk"

function MassEntry({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} fill="currentColor">
      <circle cx="50" cy="22" r="14" />
      <rect x="34" y="16" width="32" height="8" rx="2" opacity="0.85" />
      <path d="M50 36c-16 0-26 12-28 34-1 10 4 16 12 16h32c8 0 13-6 12-16-2-22-12-34-28-34z" />
      <path d="M22 66c-8 4-14 12-16 24l8 4c3-10 7-16 14-20z" />
      <path d="M78 66c8 4 14 12 16 24l-8 4c-3-10-7-16-14-20z" />
      <rect x="38" y="94" width="10" height="24" rx="3" />
      <rect x="52" y="94" width="10" height="24" rx="3" />
    </svg>
  )
}

function FoldedHands({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} fill="currentColor">
      <circle cx="50" cy="20" r="13" />
      <path d="M50 34c-14 0-22 10-24 28-1 9 3 14 10 14h28c7 0 11-5 10-14-2-18-10-28-24-28z" />
      <path d="M50 60c-6 0-10 6-10 14v18c0 3 2 5 5 5h10c3 0 5-2 5-5V74c0-8-4-14-10-14z" />
      <rect x="40" y="94" width="8" height="24" rx="3" />
      <rect x="52" y="94" width="8" height="24" rx="3" />
    </svg>
  )
}

function LocalDon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} fill="currentColor">
      <circle cx="46" cy="20" r="13" />
      <rect x="34" y="14" width="24" height="7" rx="2" opacity="0.85" />
      <path d="M46 33c-14 0-22 11-24 30-1 9 3 14 10 14h30c7 0 11-5 10-14-2-19-12-30-26-30z" />
      <path d="M70 44l20-6-4 10-14 6z" />
      <rect x="34" y="92" width="9" height="26" rx="3" />
      <rect x="48" y="92" width="9" height="26" rx="3" />
    </svg>
  )
}

function SwagWalk({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} fill="currentColor">
      <circle cx="52" cy="20" r="13" />
      <path d="M52 33c-13 0-20 9-22 26l30 4c4-1 6-4 5-8-2-12-6-22-13-22z" />
      <path d="M60 33c11 2 17 12 18 27-1 4-4 6-8 5l-12-3z" />
      <rect x="30" y="90" width="9" height="28" rx="3" transform="rotate(-8 34 104)" />
      <rect x="55" y="90" width="9" height="28" rx="3" transform="rotate(10 59 104)" />
    </svg>
  )
}

const map: Record<SilhouetteId, (props: { className?: string }) => React.ReactElement> = {
  "mass-entry": MassEntry,
  "folded-hands": FoldedHands,
  "local-don": LocalDon,
  "swag-walk": SwagWalk,
}

export function HeroSilhouette({ id, className }: { id: SilhouetteId; className?: string }) {
  const Icon = map[id]
  return <Icon className={className} />
}
