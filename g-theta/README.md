# Gθ — G THETA

**The future of streetwear.** A cinematic, animation-heavy landing page for the Theta One hoodie — engineered in Hyderabad, deliberately blank.

**Live:** https://g-theta-rho.vercel.app

## Highlights

- 🧥 **Procedural 3D hoodie** (React Three Fiber) — rotates in the hero, tilts with the mouse, drag it 360° in the configurator, and watch it explode into labeled parts on scroll
- 🌌 **Shader backgrounds** — Aurora ribbons in the hero, FaultyTerminal CRT glitch behind the stats (both via [reactbits.dev](https://reactbits.dev), rendered with `ogl`)
- 🖱️ **Micro-interactions everywhere** — morphing custom cursor with particle trail, magnetic buttons, ripples, white click-sparks on every click
- 📜 **Scroll cinematics** — Lenis smooth scroll, GSAP ScrollTrigger fabric macro-zoom, split-text reveals, stacked review cards, animated stat counters
- 🛒 **Working cart** — sizes, quantity, free-shipping meter, localStorage persistence, confetti checkout (demo — no real payments)

## Stack

Next.js 15 · React 19 · Tailwind CSS v4 · Motion (Framer Motion) · GSAP + ScrollTrigger · Lenis · Three.js / React Three Fiber / drei · ogl · Lucide

## Run it

```bash
npm install
npm run dev   # http://localhost:3020
```

## Deploy

```bash
npm run build
npx vercel --prod
```
