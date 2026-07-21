export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo-og inline-flex items-baseline gap-0.5 font-black ${className}`}>
      <span className="text-gtheta-gradient">G</span>
      <span className="text-gtheta-gradient">θ</span>
    </span>
  )
}
