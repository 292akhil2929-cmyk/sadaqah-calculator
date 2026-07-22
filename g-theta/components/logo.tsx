"use client"

import { useId } from "react"

/**
 * Hand-brushed Gθ mark, recreated from the brand reference: rough brush "G"
 * with a drip tail, theta as a ring slashed through with a stroke that flies
 * out past the right edge. Renders in currentColor.
 */
export function Logo({ className = "" }: { className?: string }) {
  const uid = useId().replace(/:/g, "")
  const f = `brush-${uid}`

  return (
    <svg
      viewBox="0 0 250 140"
      className={className}
      role="img"
      aria-label="G Theta"
      fill="none"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id={f} x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.045 0.09" numOctaves="3" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="5" />
        </filter>
      </defs>
      <g filter={`url(#${f})`} stroke="currentColor" strokeLinecap="round">
        {/* G — main sweep */}
        <path d="M104 40 C82 20 40 26 30 62 C22 94 44 118 76 113 C90 110 97 102 98 91" strokeWidth="17" />
        {/* G — crossbar into the bowl */}
        <path d="M101 80 L60 84" strokeWidth="15" />
        {/* G — brush drip tail */}
        <path d="M77 106 L69 129" strokeWidth="9" />
        {/* G — top streak */}
        <path d="M97 34 L124 29" strokeWidth="5" />
        {/* θ — ring */}
        <path d="M170 26 C143 26 128 48 128 72 C128 97 144 118 170 118 C196 118 212 97 212 72 C212 48 197 26 170 26 Z" strokeWidth="16" />
        {/* θ — slash flying out the right edge */}
        <path d="M120 80 L232 62" strokeWidth="11" />
        <path d="M198 75 L244 67" strokeWidth="4" />
      </g>
    </svg>
  )
}
