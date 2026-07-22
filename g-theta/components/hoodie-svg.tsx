"use client"

import { useId } from "react"

/** Minimal blank hoodie illustration — deliberately free of any print or design. */
export function HoodieSvg({
  colorFrom,
  colorTo,
  className = "",
}: {
  colorFrom: string
  colorTo: string
  className?: string
}) {
  const id = useId().replace(/:/g, "")
  const grad = `hg-${id}`
  const dark = `hd-${id}`

  return (
    <svg viewBox="0 0 200 240" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={colorFrom} />
          <stop offset="100%" stopColor={colorTo} />
        </linearGradient>
        <linearGradient id={dark} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colorTo} />
          <stop offset="100%" stopColor={colorFrom} stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* sleeves */}
      <rect x="24" y="62" width="40" height="112" rx="19" fill={`url(#${dark})`} transform="rotate(9 44 70)" />
      <rect x="136" y="62" width="40" height="112" rx="19" fill={`url(#${dark})`} transform="rotate(-9 156 70)" />
      {/* cuffs */}
      <rect x="12" y="158" width="34" height="18" rx="8" fill={colorTo} transform="rotate(9 29 167)" />
      <rect x="154" y="158" width="34" height="18" rx="8" fill={colorTo} transform="rotate(-9 171 167)" />

      {/* body */}
      <path
        d="M58 64 C74 52 126 52 142 64 L148 188 C148 197 130 204 100 204 C70 204 52 197 52 188 Z"
        fill={`url(#${grad})`}
      />
      {/* hem band */}
      <path d="M52 184 L148 184 L148 190 C148 199 130 206 100 206 C70 206 52 199 52 190 Z" fill={colorTo} />

      {/* hood */}
      <path d="M68 60 C64 24 136 24 132 60 C120 48 80 48 68 60 Z" fill={`url(#${grad})`} />
      <ellipse cx="100" cy="54" rx="24" ry="12" fill="rgba(0,0,0,0.45)" />

      {/* drawstrings */}
      <path d="M93 62 C92 72 92 78 93 86" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
      <path d="M107 62 C108 72 108 78 107 86" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" />
      <circle cx="93" cy="88" r="2.4" fill="#c9ccd6" />
      <circle cx="107" cy="88" r="2.4" fill="#c9ccd6" />

      {/* kangaroo pocket */}
      <path
        d="M76 148 L124 148 C128 148 130 151 129 155 L124 180 C112 185 88 185 76 180 L71 155 C70 151 72 148 76 148 Z"
        fill="rgba(0,0,0,0.18)"
        stroke="rgba(255,255,255,0.08)"
      />

      {/* soft highlight */}
      <ellipse cx="82" cy="96" rx="30" ry="44" fill="rgba(255,255,255,0.05)" />
    </svg>
  )
}
