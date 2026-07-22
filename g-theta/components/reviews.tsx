"use client"

import { motion } from "motion/react"
import { Star } from "lucide-react"

// Fictional customers, written for G Theta.
const reviews = [
  {
    name: "Aarav Mehta",
    role: "Product designer, Bengaluru",
    text: "The weight, the drape, the hood structure — nothing in my closet comes close. It reads minimal but feels engineered.",
    from: "#4f7cff",
    to: "#a855f7",
  },
  {
    name: "Zoya Khan",
    role: "Filmmaker, Mumbai",
    text: "Wore it on a red-eye and straight into a pitch meeting. Both rooms approved. The fabric doesn't crease, doesn't quit.",
    from: "#a855f7",
    to: "#d7d9e0",
  },
  {
    name: "Ravi Teja",
    role: "Founder, Hyderabad",
    text: "Naa favourite hoodie idi. Full class, full comfort — and the blank front is the whole point. It says everything.",
    from: "#d7d9e0",
    to: "#4f7cff",
  },
  {
    name: "Ishaan Verma",
    role: "Athlete, Delhi",
    text: "Trained in it, travelled in it, slept in it on a bus to Manali. Zero pilling after months. This is the one.",
    from: "#4f7cff",
    to: "#16267a",
  },
]

export function Reviews() {
  return (
    <section className="relative mx-auto max-w-3xl px-6 py-28">
      <div className="mb-16 flex flex-col gap-3 text-center">
        <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-electric">06 — Reviews</p>
        <h2 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-6xl">
          Worn. Approved.
        </h2>
      </div>

      <div className="flex flex-col gap-8">
        {reviews.map((review, i) => (
          <motion.figure
            key={review.name}
            initial={{ opacity: 0, y: 60, rotate: i % 2 ? 2.5 : -2.5, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, rotate: i % 2 ? 1 : -1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 240, damping: 24 }}
            whileHover={{ rotate: 0, scale: 1.02 }}
            className="glass group sticky rounded-[var(--radius)] p-8"
            style={{ top: `${7 + i * 1.5}rem` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex gap-1 text-electric">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={15} fill="currentColor" />
                ))}
              </div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Verified buyer</span>
            </div>
            <blockquote className="text-lg leading-relaxed text-foreground/90">“{review.text}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <motion.span
                aria-hidden
                initial={{ scale: 0, rotate: -30 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.2 }}
                className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                style={{ background: `linear-gradient(140deg, ${review.from}, ${review.to})` }}
              >
                {review.name[0]}
              </motion.span>
              <span>
                <span className="block text-sm font-semibold">{review.name}</span>
                <span className="block text-xs text-muted-foreground">{review.role}</span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  )
}
