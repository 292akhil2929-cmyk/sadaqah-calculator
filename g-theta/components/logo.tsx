export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo-og inline-flex items-baseline ${className}`}>
      <span className="text-gtheta-gradient">G</span>
      <span className="logo-theta text-gtheta-gradient">
        θ<span className="logo-tail" />
      </span>
    </span>
  )
}
