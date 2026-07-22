export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display inline-flex items-baseline gap-[0.06em] font-bold tracking-tight ${className}`}>
      <span className="text-chrome">G</span>
      <span className="text-electric-gradient">θ</span>
    </span>
  )
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold uppercase tracking-[0.35em] ${className}`}>
      G&thinsp;THETA
    </span>
  )
}
