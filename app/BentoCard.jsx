"use client";

import { useRef, useCallback, useEffect } from "react";
import { gsap } from "gsap";
import "./BentoCard.css";

const DEFAULT_PARTICLE_COUNT = 8;

const createParticleElement = (x, y, color) => {
  const el = document.createElement("div");
  el.className = "bento-particle";
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${color};
    box-shadow: 0 0 6px ${color};
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

export default function BentoCard({ children, className = "", style = {}, glowColor = "58, 160, 218", particleCount = DEFAULT_PARTICLE_COUNT, clickEffect = true }) {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach((particle) => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: "back.in(1.7)",
        onComplete: () => particle.parentNode?.removeChild(particle),
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();

    Array.from({ length: particleCount }).forEach((_, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const particle = createParticleElement(Math.random() * width, Math.random() * height, `rgb(${glowColor})`);
        cardRef.current.appendChild(particle);
        particlesRef.current.push(particle);

        gsap.fromTo(particle, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
        gsap.to(particle, {
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 60,
          duration: 1.5 + Math.random(),
          ease: "none",
          repeat: -1,
          yoyo: true,
        });
      }, index * 90);
      timeoutsRef.current.push(timeoutId);
    });
  }, [glowColor, particleCount]);

  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
    };
    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
    };
    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const relX = ((e.clientX - rect.left) / rect.width) * 100;
      const relY = ((e.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty("--glow-x", `${relX}%`);
      element.style.setProperty("--glow-y", `${relY}%`);
      element.style.setProperty("--glow-intensity", "1");
    };
    const handleClick = (e) => {
      if (!clickEffect) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.35) 0%, rgba(${glowColor}, 0.15) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
      `;
      element.appendChild(ripple);
      gsap.fromTo(
        ripple,
        { scale: 0, opacity: 1 },
        { scale: 1, opacity: 0, duration: 0.7, ease: "power2.out", onComplete: () => ripple.remove() }
      );
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`bento-card ${className}`}
      style={{ "--glow-color": glowColor, ...style }}
    >
      {children}
    </div>
  );
}
