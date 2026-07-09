"use client";

import { useRef } from "react";
import "./GlowCard.css";

// One card template for both the stat cards and the quote cards, so every
// card on the page reads as the same family. CSS-only mouse-tracked border
// glow, inspired by Magic UI's MagicCard (ported to inline styles, no
// tailwind/next-themes/motion dependency).
export default function GlowCard({ children, className = "", style = {}, glowColor = "58, 160, 218" }) {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    cardRef.current.style.setProperty("--mx", `${x}px`);
    cardRef.current.style.setProperty("--my", `${y}px`);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`glow-card ${className}`}
      style={{ "--glow-color": glowColor, ...style }}
    >
      {children}
    </div>
  );
}
