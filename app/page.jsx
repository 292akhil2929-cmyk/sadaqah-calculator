"use client";

import React, { useState, useMemo } from "react";
import ClickSpark from "./ClickSpark";
import GlowCard from "./GlowCard";
import ElasticSlider from "./ElasticSlider";
import ShinyButton from "./ShinyButton";
import InteractiveHoverButton from "./InteractiveHoverButton";

/**
 * Sadaqah Jariyah Impact Calculator — MATW brand theme (magenta #f60362 / blue #00a3da)
 * ------------------------------------------------------------------------------------
 * Anchor data points (published by MATW, Jul 2026):
 *  - Water well: hand pump ~$500 (5–20yr life, ~100 people/day),
 *    solar well ~$10,000 (40+yr life, larger communities)
 *  - Masjid: $15,000 (small village, Africa) / $30,000 (100–120sqm,
 *    ~400 people, Pakistan/Indonesia) / $37,500 (comprehensive, Yemen)
 *
 * The point of this component: worldly numbers (people, years, litres) CAN be
 * estimated — but the *eternal* reward of Sadaqah Jariyah cannot be counted by us.
 * So for the reward we quote the primary texts, which give real numbers:
 *  - Qur'an 2:261 — every act multiplied 7 ears × 100 grains = 700×, and Allah
 *    multiplies more for whom He wills. This is the multiplier we surface.
 *  - The "seven deeds" hadith literally lists digging a well AND building a mosque
 *    as deeds that keep rewarding you in your grave.
 *
 * Quotes verified word-for-word against primary sources (not paraphrased):
 *  - Qur'an 2:261 & 21:30, Sahih International translation
 *  - Sunan al-Nasa'i 3664 (Sa'd ibn 'Ubadah, ra) — Hasan
 *  - Sahih al-Jami' 3602 (seven deeds, Anas ibn Malik, ra) — Hasan
 *  - Jami' at-Tirmidhi 3703 (Uthman ibn Affan & the well of Rumah, ra)
 *  - Sahih al-Bukhari 450 / Sahih Muslim 533 (building a mosque)
 */

const CURRENCY = "$";

// MATW brand palette — sampled directly from the live site's blue nav + magenta band
const PINK = "#e6007e";
const BLUE = "#3aa0da";
const INK = "#0d1b2a";

// Where "Add to Cart" sends the donor. MATW's cart takes amount + a fund name as
// query params — swap this for the real product/cart endpoint when integrating.
const DONATE_BASE_URL = "https://matwproject.org/sadaqah-jariyah";
const FUND_SLUG = { well: "water-wells", masjid: "build-a-masjid" };

const WELL_ANCHORS = [
  { cost: 500, peoplePerDay: 100, lifespanYears: 12 },
  { cost: 10000, peoplePerDay: 450, lifespanYears: 40 },
];

const MASJID_ANCHORS = [
  { cost: 15000, capacity: 180, lifespanYears: 50 },
  { cost: 30000, capacity: 400, lifespanYears: 50 },
  { cost: 37500, capacity: 550, lifespanYears: 50 },
];

// Qur'an 2:261 — the reward multiplier that we can actually quote a number for.
// A grain grows 7 ears, each ear 100 grains → 700× minimum, "and Allah multiplies for whom He wills."
const REWARD_MULTIPLIER = 700;

// The ONE narration that speaks most specifically to each mode — shown as the
// headline proof inside the reward panel. Both come from the same hadith of
// Jabir ibn 'Abdullah (ra), which promises a distinct reward for each deed.
const FEATURED = {
  well: {
    badge: "EVERY SIP IS COUNTED",
    text:
      "Whoever digs a well — no thirsty being, jinn, human, or bird, drinks from it except that Allah rewards him for it on the Day of Resurrection.",
    ref: "Sunan Ibn Majah · Sahih Ibn Khuzaymah 1292",
  },
  masjid: {
    badge: "EVEN THE SMALLEST",
    text:
      "Whoever builds a mosque for Allah — even the size of a sandgrouse's nest, or smaller — Allah builds for him a house in Paradise.",
    ref: "Sunan Ibn Majah 738 · Sahih (al-Albani)",
  },
};

// hex (#rrggbb) → "r, g, b" string, for use in rgba()/rgb() colors
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function fmt(n) {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(n % 1_000_000_000 === 0 ? 0 : 1) + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1) + "M";
  if (n >= 10_000) return (n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1) + "K";
  return Math.round(n).toLocaleString();
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function computeWellImpact(amount) {
  const [a, b] = WELL_ANCHORS;
  if (amount <= a.cost) {
    return { rate: a.peoplePerDay * (amount / a.cost), lifespanYears: a.lifespanYears };
  }
  if (amount >= b.cost) {
    const fullUnits = Math.floor(amount / b.cost);
    const remainderFraction = (amount - fullUnits * b.cost) / b.cost;
    return { rate: fullUnits * b.peoplePerDay + remainderFraction * b.peoplePerDay, lifespanYears: b.lifespanYears };
  }
  const t = (amount - a.cost) / (b.cost - a.cost);
  return { rate: lerp(a.peoplePerDay, b.peoplePerDay, t), lifespanYears: lerp(a.lifespanYears, b.lifespanYears, t) };
}

function computeMasjidImpact(amount) {
  const anchors = MASJID_ANCHORS;
  const first = anchors[0];
  const last = anchors[anchors.length - 1];
  if (amount <= first.cost) {
    return { rate: first.capacity * (amount / first.cost), lifespanYears: first.lifespanYears };
  }
  if (amount >= last.cost) {
    const fullUnits = Math.floor(amount / last.cost);
    const remainderFraction = (amount - fullUnits * last.cost) / last.cost;
    return { rate: fullUnits * last.capacity + remainderFraction * last.capacity, lifespanYears: last.lifespanYears };
  }
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (amount >= a.cost && amount <= b.cost) {
      const t = (amount - a.cost) / (b.cost - a.cost);
      return { rate: lerp(a.capacity, b.capacity, t), lifespanYears: lerp(a.lifespanYears, b.lifespanYears, t) };
    }
  }
  return { rate: first.capacity, lifespanYears: first.lifespanYears };
}

export default function DonationImpactCalculator() {
  const [mode, setMode] = useState("well");
  const [amount, setAmount] = useState(500);
  const [hasInteracted, setHasInteracted] = useState(false);

  const min = 25;
  const max = mode === "well" ? 12000 : 45000;

  const impact = useMemo(() => (mode === "well" ? computeWellImpact(amount) : computeMasjidImpact(amount)), [mode, amount]);

  // litres of clean water delivered (WHO baseline ~20L/person/day) — well only
  const litres = impact.rate * 20 * 365 * impact.lifespanYears;
  // acts of worship facilitated (5 daily prayers) — masjid only
  const actsOfWorship = impact.rate * 5 * 365 * impact.lifespanYears;

  // "Acts of ongoing charity" credited to the donor over the lifetime of the project.
  // Well: every person served, every day. Masjid: every prayer prayed inside.
  const lifetimeActs = mode === "well" ? impact.rate * 365 * impact.lifespanYears : actsOfWorship;
  // The reward we can actually put a number on — multiplied ≥700× per Qur'an 2:261.
  const multipliedReward = lifetimeActs * REWARD_MULTIPLIER;

  function switchMode(next) {
    setMode(next);
    setAmount(next === "well" ? 500 : 15000);
    setHasInteracted(true);
  }

  function changeAmount(next) {
    setAmount(next);
    setHasInteracted(true);
  }

  const accent = mode === "well" ? BLUE : PINK;
  const accentRgb = hexToRgb(accent);
  const featured = FEATURED[mode];
  const cartUrl = `${DONATE_BASE_URL}?fund=${FUND_SLUG[mode]}&amount=${amount}`;

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        .sjc-root { font-family: 'Manrope', sans-serif; }
        .sjc-mono { font-family: 'JetBrains Mono', monospace; }
      `}</style>

      <div className="sjc-root" style={styles.wrap}>
        <h1 style={styles.h1}>See what your Sadaqah builds</h1>
        <p style={styles.sub}>
          Some of your impact can be measured. The rest — the reward — is promised in the
          Qur'an and Sunnah, and it never stops.
        </p>

        {/* Mode toggle */}
        <div style={styles.modeRow}>
          <ShinyButton
            style={mode === "well" ? modeBtnActive(BLUE) : styles.modeBtn}
            onClick={() => switchMode("well")}
          >
            💧 Water Well
          </ShinyButton>
          <ShinyButton
            style={mode === "masjid" ? modeBtnActive(PINK) : styles.modeBtn}
            onClick={() => switchMode("masjid")}
          >
            🕌 Masjid
          </ShinyButton>
        </div>

        {/* Slider — front and center */}
        <div style={styles.sliderBlock}>
          <div style={styles.sliderLabelRow}>
            <span style={styles.sliderLabel}>Your donation</span>
            <span className="sjc-mono" style={styles.amountDisplay}>
              {CURRENCY}
              {amount.toLocaleString()}
            </span>
          </div>
          <ElasticSlider
            value={amount}
            onChange={changeAmount}
            min={min}
            max={max}
            step={mode === "well" ? 25 : 250}
            accentColor={accent}
          />
          <div style={styles.sliderMinMax}>
            <span>{CURRENCY}{min}</span>
            <span>{CURRENCY}{max.toLocaleString()}</span>
          </div>
        </div>

        {/* Worldly impact — three across */}
        <div style={styles.resultsGrid}>
          <GlowCard glowColor={accentRgb} style={styles.resultCard}>
            <div className="sjc-mono" style={resultNumber(accent)}>
              {fmt(impact.rate)}
            </div>
            <div style={styles.resultLabel}>
              {mode === "well" ? "people given clean water daily" : "worshippers the space holds"}
            </div>
          </GlowCard>
          <GlowCard glowColor={accentRgb} style={styles.resultCard}>
            <div className="sjc-mono" style={resultNumber(accent)}>
              {impact.lifespanYears.toFixed(0)}
            </div>
            <div style={styles.resultLabel}>years it keeps serving the community</div>
          </GlowCard>
          <GlowCard glowColor={accentRgb} style={styles.resultCard}>
            <div className="sjc-mono" style={resultNumber(accent)}>
              {mode === "well" ? fmt(litres) : fmt(actsOfWorship)}
            </div>
            <div style={styles.resultLabel}>
              {mode === "well" ? "litres of clean water, lifetime" : "acts of worship made possible, lifetime"}
            </div>
          </GlowCard>
        </div>

        {/* CTA — appears only after the donor has actually engaged with the calculator */}
        {hasInteracted && (
          <div style={{ marginBottom: 20 }}>
            <ClickSpark sparkColor={[PINK, BLUE]} sparkCount={10} sparkRadius={22} duration={500}>
              <InteractiveHoverButton
                as="a"
                href={cartUrl}
                target="_blank"
                rel="noopener noreferrer"
                accentColor={accent}
                style={{ padding: "16px 20px", fontSize: 15, fontWeight: 700 }}
              >
                Add to Cart — Donate {CURRENCY}{amount.toLocaleString()} Now
              </InteractiveHoverButton>
            </ClickSpark>
          </div>
        )}

        <div style={styles.disclaimer}>
          Figures are reasonable estimates from MATW's published pricing and completed
          projects — actual numbers are confirmed once your project is assigned.
        </div>

        {/* ─── THE ETERNAL REWARD — the "impact parameter" that can't be counted ─── */}
        <div style={styles.rewardPanel}>
          <div style={styles.rewardTopRow}>
            <span style={styles.rewardEyebrow}>YOUR REWARD WITH ALLAH</span>
            <span style={styles.rewardMultBadge}>≥ {REWARD_MULTIPLIER}× MULTIPLIER</span>
          </div>

          <div className="sjc-mono" style={styles.rewardNumber}>
            {fmt(multipliedReward)}
          </div>
          <div style={styles.rewardNumberLabel}>
            {mode === "well"
              ? "acts of ongoing charity, multiplied — credited to you for every person who drinks, every day it flows"
              : "rewards of worship, multiplied — credited to you for every prayer prayed inside it"}
          </div>

          {/* The single most specific promise for THIS deed */}
          <GlowCard glowColor={accentRgb} style={quoteCardStyle(accent)}>
            <span style={featuredBadge(accent)}>{featured.badge}</span>
            <p style={styles.featuredText}>“{featured.text}”</p>
            <span style={styles.featuredRef}>— {featured.ref}</span>
          </GlowCard>

          {/* The multiplier verse — same card template, same accent, so both read as one family */}
          <GlowCard glowColor={accentRgb} style={quoteCardStyle(accent, 0)}>
            <span style={featuredBadge(accent)}>THE MULTIPLIER</span>
            <p style={styles.featuredText}>
              "The example of those who spend their wealth in the way of Allah is like a seed
              which grows <b style={{ color: INK }}>seven ears</b>, in each ear{" "}
              <b style={{ color: INK }}>a hundred grains</b>. And Allah multiplies for whom
              He wills."
            </p>
            <span style={styles.featuredRef}>— Qur'an 2:261 · Sahih International</span>
            <div style={styles.rewardMathNote}>
              7 ears × 100 grains = <b style={{ color: INK }}>700× the reward</b> as a floor —
              applied to every{" "}
              {mode === "well" ? "person-day of water this well provides" : "prayer prayed inside this masjid"}
              {" "}over its lifetime. Allah multiplies without limit for whom He wills.
            </div>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}

// ── style helpers that depend on the active accent — flat, plain, no glow/gradient ──
// Same card template for both quote blocks so they read as one uniform family.
function quoteCardStyle(color, marginBottom = 12) {
  return {
    background: "#FFFFFF",
    border: "1px solid #E4E9F0",
    borderLeft: `4px solid ${color}`,
    borderRadius: 12,
    padding: "16px 18px",
    marginBottom,
  };
}
function featuredBadge(color) {
  return {
    display: "inline-block",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    letterSpacing: "0.12em",
    fontWeight: 700,
    color: "#fff",
    background: color,
    borderRadius: 4,
    padding: "4px 11px",
    marginBottom: 12,
  };
}
function modeBtnActive(color) {
  return {
    flex: 1,
    padding: "13px 16px",
    borderRadius: 10,
    border: `1px solid ${color}`,
    background: color,
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  };
}
function resultNumber(color) {
  return {
    fontSize: "clamp(17px, 4vw, 24px)",
    color,
    marginBottom: 6,
    fontWeight: 700,
    display: "inline-block",
  };
}
const styles = {
  page: {
    background: "#FFFFFF",
    color: INK,
  },
  wrap: {
    maxWidth: 720,
    margin: "0 auto",
    padding: "40px 20px 48px",
  },
  h1: {
    fontSize: "clamp(24px, 5vw, 40px)",
    fontWeight: 800,
    margin: "0 0 12px",
    lineHeight: 1.15,
    color: INK,
  },
  sub: {
    fontSize: 14.5,
    lineHeight: 1.55,
    color: "#5A6B7A",
    margin: "0 0 24px",
    maxWidth: 560,
  },
  h2: {
    fontSize: "clamp(17px, 3vw, 21px)",
    fontWeight: 700,
    margin: "0 0 12px",
    color: INK,
  },
  modeRow: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  modeBtn: {
    flex: 1,
    padding: "13px 16px",
    borderRadius: 10,
    border: "1px solid #D8DEE6",
    background: "#F5F7FA",
    color: "#5A6B7A",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  sliderBlock: {
    background: "#F5F7FA",
    border: "1px solid #E4E9F0",
    borderRadius: 14,
    padding: "22px 20px",
    marginBottom: 16,
  },
  sliderLabelRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 14,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#5A6B7A",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 600,
  },
  amountDisplay: {
    fontSize: 28,
    color: INK,
    fontWeight: 700,
    display: "inline-block",
  },
  sliderMinMax: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 10.5,
    color: "#8A97A5",
    marginTop: 8,
  },
  resultsGrid: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  resultCard: {
    flex: 1,
    minWidth: 0,
    background: "#F5F7FA",
    border: "1px solid #E4E9F0",
    borderRadius: 12,
    padding: "16px 8px",
    textAlign: "center",
  },
  resultLabel: {
    fontSize: 10.5,
    lineHeight: 1.35,
    color: "#5A6B7A",
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "#8A97A5",
    marginBottom: 22,
  },

  // ── Eternal reward panel — flat two-tone block, no gradients/glow ──
  rewardPanel: {
    borderRadius: 14,
    padding: "22px 20px 20px",
    marginBottom: 16,
    background: "#F5F7FA",
    border: "1px solid #E4E9F0",
  },
  rewardTopRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  rewardEyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.14em",
    color: INK,
    fontWeight: 700,
  },
  rewardMultBadge: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "#fff",
    background: PINK,
    borderRadius: 4,
    padding: "4px 11px",
  },
  rewardNumber: {
    fontSize: "clamp(38px, 11vw, 66px)",
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: "-0.02em",
    display: "inline-block",
    marginTop: 4,
    color: PINK,
  },
  rewardNumberLabel: {
    fontSize: 12.5,
    lineHeight: 1.5,
    color: "#5A6B7A",
    marginTop: 10,
    marginBottom: 18,
    maxWidth: 520,
  },
  rewardMathNote: {
    fontSize: 12,
    lineHeight: 1.5,
    color: "#5A6B7A",
    marginTop: 12,
  },
  featuredText: {
    fontSize: 16,
    lineHeight: 1.55,
    fontWeight: 600,
    fontStyle: "italic",
    color: INK,
    margin: "0 0 10px",
  },
  featuredRef: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11.5,
    color: "#5A6B7A",
  },
};
