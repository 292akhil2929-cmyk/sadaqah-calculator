"use client";

import "./InteractiveHoverButton.css";

// Magic UI's Interactive Hover Button, ported to plain CSS (no tailwind/cn/lucide
// dependency): a solid fill sweeps left-to-right across the full button on
// hover, swapping the label for a white label + arrow.
export default function InteractiveHoverButton({
  as: Component = "button",
  className = "",
  style = {},
  accentColor = "#000",
  children,
  ...rest
}) {
  return (
    <Component
      className={`ihb ${className}`}
      style={{ "--ihb-accent": accentColor, ...style }}
      {...rest}
    >
      <span className="ihb-fill" />
      <span className="ihb-label">{children}</span>
      <span className="ihb-reveal">
        <span>{children}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </span>
    </Component>
  );
}
