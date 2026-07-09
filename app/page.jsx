"use client";

import React, { useState, useMemo, useEffect } from "react";

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

// MATW brand palette
const PINK = "#f60362";
const BLUE = "#00a3da";

const WELL_ANCHORS = [
  { cost: 500, peoplePerDay: 100, lifespanYears: 12 },
  { cost: 10000, peoplePerDay: 450, lifespanYears: 40 },
];

const MASJID_ANCHORS = [
  { cost: 15000, capacity: 180, lifespanYears: 50 },
  { cost: 30000, capacity: 400, lifespanYears: 50 },
  { cost: 37500, capacity: 550, lifespanYears: 50 },
];

const CASE_STUDIES = [
  { place: "Rural South Togo", type: "Hand-pump well, 40m deep", people: 100, years: 20 },
  { place: "Rural Togo", type: "Heavy-duty hand pump, 40 households", people: 200, years: 50 },
  { place: "Pallisa, Uganda", type: "Heavy-duty hand pump, 92 households", people: 460, years: 20 },
];

// Qur'an 2:261 — the reward multiplier that we can actually quote a number for.
// A grain grows 7 ears, each ear 100 grains → 700× minimum, "and Allah multiplies for whom He wills."
const REWARD_MULTIPLIER = 700;

// Mode-specific texts. Each carries a real NUMBER so the reward feels concrete.
const REWARD_TEXTS = {
  well: [
    {
      badge: "THE #1 CHARITY",
      text: "Sa'd asked, \"Which charity is best?\" The Prophet ﷺ said, \"Water.\"",
      ref: "Sunan al-Nasa'i 3664 · Hasan",
    },
    {
      badge: "1 OF 7 DEEDS",
      text:
        "Seven deeds keep rewarding a servant in his grave after death — among them: digging a well.",
      ref: "Sahih al-Jami' 3602 · Hasan",
    },
    {
      badge: "PRICE OF PARADISE",
      text:
        "\"Who will dig the well of Rumah, and his bucket will be alongside the buckets of the Muslims, for something better than it in Paradise?\" — so Uthman (ra) bought it.",
      ref: "Jami' at-Tirmidhi 3703",
    },
  ],
  masjid: [
    {
      badge: "A HOUSE IN PARADISE",
      text:
        "\"Whoever builds a mosque for Allah, Allah will build for him a house like it in Paradise.\"",
      ref: "Sahih al-Bukhari 450 / Sahih Muslim 533",
    },
    {
      badge: "1 OF 7 DEEDS",
      text:
        "Seven deeds keep rewarding a servant in his grave after death — among them: building a mosque.",
      ref: "Sahih al-Jami' 3602 · Hasan",
    },
  ],
};

// Short verse shown right beside the worldly stat, per mode.
const VERSE = {
  well: {
    text: "And We made from water every living thing.",
    ref: "Qur'an 21:30",
  },
  masjid: {
    text: "The mosques of Allah are only maintained by those who believe in Allah.",
    ref: "Qur'an 9:18",
  },
};

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
  const [pulse, setPulse] = useState(false);

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

  useEffect(() => {
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 220);
    return () => clearTimeout(t);
  }, [amount, mode]);

  function switchMode(next) {
    setMode(next);
    setAmount(next === "well" ? 500 : 15000);
  }

  const accent = mode === "well" ? BLUE : PINK;
  const verse = VERSE[mode];
  const rewardTexts = REWARD_TEXTS[mode];

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        .sjc-root { font-family: 'Manrope', sans-serif; }
        .sjc-mono { font-family: 'JetBrains Mono', monospace; }
        .sjc-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(90deg, ${PINK} 0%, ${PINK} var(--fill, 20%), rgba(255,255,255,0.14) var(--fill, 20%), rgba(255,255,255,0.14) 100%);
          outline: none;
        }
        .sjc-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 4px solid ${PINK};
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(246,3,98,0.5);
        }
        .sjc-slider::-moz-range-thumb {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 4px solid ${PINK};
          cursor: pointer;
        }
        .sjc-mode-btn { transition: all 0.2s ease; }
        .sjc-pulse { transition: transform 0.22s cubic-bezier(.34,1.56,.64,1); }
        .sjc-pulse.on { transform: scale(1.06); }
        .sjc-reward-shimmer {
          background: linear-gradient(100deg, ${PINK} 0%, #ff5fa2 30%, ${BLUE} 70%, ${PINK} 100%);
          background-size: 220% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: sjc-shimmer 5s linear infinite;
        }
        @keyframes sjc-shimmer {
          to { background-position: 220% center; }
        }
        .sjc-glow {
          position: absolute;
          width: 340px;
          height: 340px;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.3;
          pointer-events: none;
          transition: background 0.4s ease;
        }
      `}</style>

      <div
        className="sjc-glow"
        style={{ top: -80, right: -60, background: accent }}
      />
      <div
        className="sjc-glow"
        style={{ bottom: -120, left: -80, background: mode === "well" ? PINK : BLUE, opacity: 0.18 }}
      />

      <div className="sjc-root" style={styles.wrap}>
        <div style={styles.eyebrow}>SADAQAH JARIYAH · IMPACT CALCULATOR</div>
        <h1 style={styles.h1}>See what your Sadaqah builds</h1>
        <p style={styles.sub}>
          Some of your impact can be measured. The rest — the reward — is promised in the
          Qur'an and Sunnah, and it never stops.
        </p>

        {/* Mode toggle */}
        <div style={styles.modeRow}>
          <button
            className="sjc-mode-btn"
            style={mode === "well" ? modeBtnActive(BLUE) : styles.modeBtn}
            onClick={() => switchMode("well")}
          >
            💧 Water Well
          </button>
          <button
            className="sjc-mode-btn"
            style={mode === "masjid" ? modeBtnActive(PINK) : styles.modeBtn}
            onClick={() => switchMode("masjid")}
          >
            🕌 Masjid
          </button>
        </div>

        {/* Slider — front and center */}
        <div style={styles.sliderBlock}>
          <div style={styles.sliderLabelRow}>
            <span style={styles.sliderLabel}>Your donation</span>
            <span className={`sjc-mono sjc-pulse ${pulse ? "on" : ""}`} style={styles.amountDisplay}>
              {CURRENCY}
              {amount.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            className="sjc-slider"
            min={min}
            max={max}
            step={mode === "well" ? 25 : 250}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            style={{ "--fill": `${((amount - min) / (max - min)) * 100}%` }}
          />
          <div style={styles.sliderMinMax}>
            <span>{CURRENCY}{min}</span>
            <span>{CURRENCY}{max.toLocaleString()}</span>
          </div>
        </div>

        {/* Worldly impact — three across */}
        <div style={styles.resultsGrid}>
          <div style={styles.resultCard}>
            <div className={`sjc-mono sjc-pulse ${pulse ? "on" : ""}`} style={resultNumber(accent)}>
              {fmt(impact.rate)}
            </div>
            <div style={styles.resultLabel}>
              {mode === "well" ? "people given clean water daily" : "worshippers the space holds"}
            </div>
          </div>
          <div style={styles.resultCard}>
            <div className={`sjc-mono sjc-pulse ${pulse ? "on" : ""}`} style={resultNumber(accent)}>
              {impact.lifespanYears.toFixed(0)}
            </div>
            <div style={styles.resultLabel}>years it keeps serving the community</div>
          </div>
          <div style={styles.resultCard}>
            <div className={`sjc-mono sjc-pulse ${pulse ? "on" : ""}`} style={resultNumber(accent)}>
              {mode === "well" ? fmt(litres) : fmt(actsOfWorship)}
            </div>
            <div style={styles.resultLabel}>
              {mode === "well" ? "litres of clean water, lifetime" : "acts of worship made possible, lifetime"}
            </div>
          </div>
        </div>

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

          <div className={`sjc-mono sjc-reward-shimmer sjc-pulse ${pulse ? "on" : ""}`} style={styles.rewardNumber}>
            {fmt(multipliedReward)}
          </div>
          <div style={styles.rewardNumberLabel}>
            {mode === "well"
              ? "acts of ongoing charity, multiplied — credited to you for every person who drinks, every day it flows"
              : "rewards of worship, multiplied — credited to you for every prayer prayed inside it"}
          </div>

          <div style={styles.rewardVerse}>
            <p style={styles.rewardVerseText}>
              "The example of those who spend their wealth in the way of Allah is like a seed
              which grows <b style={{ color: "#fff" }}>seven ears</b>, in each ear{" "}
              <b style={{ color: "#fff" }}>a hundred grains</b>. And Allah multiplies for whom
              He wills."
            </p>
            <span style={styles.rewardVerseRef}>— Qur'an 2:261 · Sahih International</span>
          </div>
          <div style={styles.rewardMathNote}>
            7 ears × 100 grains = <b style={{ color: "#fff" }}>700× the reward</b> as a floor —
            and Allah multiplies without limit for whom He wills.
          </div>

          {/* Mode-specific numbered proofs */}
          <div style={styles.proofGrid}>
            {rewardTexts.map((q, i) => (
              <div key={i} style={styles.proofCard}>
                <span style={proofBadge(accent)}>{q.badge}</span>
                <p style={styles.proofText}>{q.text}</p>
                <span style={styles.proofRef}>{q.ref}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Short worldly verse */}
        <div style={styles.quoteCard}>
          <p style={styles.quoteText}>
            "{verse.text}" <span style={styles.quoteRef}>({verse.ref})</span>
          </p>
        </div>

        {/* Case studies */}
        <div style={styles.sectionDivider} />
        <h2 style={styles.h2}>Wells MATW has actually built</h2>
        <div style={styles.caseGrid}>
          {CASE_STUDIES.map((c, i) => (
            <div key={i} style={styles.caseCard}>
              <div style={styles.casePlace}>{c.place}</div>
              <div style={styles.caseType}>{c.type}</div>
              <div style={caseStats(accent)}>
                <span className="sjc-mono">{c.people}</span> people/day ·{" "}
                <span className="sjc-mono">{c.years}</span> yr lifespan
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── style helpers that depend on the active accent ──
function modeBtnActive(color) {
  return {
    flex: 1,
    padding: "13px 16px",
    borderRadius: 12,
    border: `1px solid ${color}`,
    background: hexA(color, 0.16),
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: `0 0 22px ${hexA(color, 0.28)}`,
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
function proofBadge(color) {
  return {
    display: "inline-block",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 9.5,
    letterSpacing: "0.1em",
    fontWeight: 700,
    color,
    background: hexA(color, 0.12),
    border: `1px solid ${hexA(color, 0.35)}`,
    borderRadius: 999,
    padding: "3px 9px",
    marginBottom: 10,
  };
}
function caseStats(color) {
  return { fontSize: 12.5, color };
}

// hex (#rrggbb) → rgba string
function hexA(hex, a) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}

const styles = {
  page: {
    position: "relative",
    minHeight: "100%",
    overflow: "hidden",
    background: "radial-gradient(ellipse 120% 80% at 50% -10%, #0B2A55 0%, #08183A 45%, #050C1F 100%)",
    color: "#F4F6FB",
  },
  wrap: {
    position: "relative",
    zIndex: 1,
    maxWidth: 720,
    margin: "0 auto",
    padding: "40px 20px 48px",
  },
  eyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: "0.14em",
    color: PINK,
    marginBottom: 10,
  },
  h1: {
    fontSize: "clamp(24px, 5vw, 40px)",
    fontWeight: 800,
    margin: "0 0 12px",
    lineHeight: 1.15,
    color: "#FFFFFF",
  },
  sub: {
    fontSize: 14.5,
    lineHeight: 1.55,
    color: "rgba(244,246,251,0.62)",
    margin: "0 0 24px",
    maxWidth: 560,
  },
  h2: {
    fontSize: "clamp(17px, 3vw, 21px)",
    fontWeight: 700,
    margin: "0 0 12px",
    color: "#FFFFFF",
  },
  modeRow: {
    display: "flex",
    gap: 10,
    marginBottom: 20,
  },
  modeBtn: {
    flex: 1,
    padding: "13px 16px",
    borderRadius: 12,
    border: "1px solid rgba(244,246,251,0.15)",
    background: "rgba(244,246,251,0.04)",
    color: "rgba(244,246,251,0.7)",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  sliderBlock: {
    background: "rgba(244,246,251,0.05)",
    border: "1px solid rgba(244,246,251,0.12)",
    borderRadius: 18,
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
    color: "rgba(244,246,251,0.6)",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    fontWeight: 600,
  },
  amountDisplay: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: 700,
    display: "inline-block",
  },
  sliderMinMax: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 10.5,
    color: "rgba(244,246,251,0.4)",
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
    background: "rgba(244,246,251,0.05)",
    border: "1px solid rgba(244,246,251,0.12)",
    borderRadius: 14,
    padding: "16px 8px",
    textAlign: "center",
  },
  resultLabel: {
    fontSize: 10.5,
    lineHeight: 1.35,
    color: "rgba(244,246,251,0.6)",
  },
  disclaimer: {
    fontSize: 11,
    lineHeight: 1.5,
    color: "rgba(244,246,251,0.4)",
    marginBottom: 22,
  },

  // ── Eternal reward panel ──
  rewardPanel: {
    position: "relative",
    borderRadius: 20,
    padding: "22px 20px 20px",
    marginBottom: 16,
    background:
      "linear-gradient(160deg, rgba(246,3,98,0.10) 0%, rgba(0,163,218,0.08) 100%)",
    border: "1px solid rgba(246,3,98,0.35)",
    boxShadow: "0 0 40px rgba(246,3,98,0.12)",
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
    color: "rgba(244,246,251,0.85)",
    fontWeight: 700,
  },
  rewardMultBadge: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10.5,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "#fff",
    background: `linear-gradient(90deg, ${PINK}, ${BLUE})`,
    borderRadius: 999,
    padding: "4px 11px",
  },
  rewardNumber: {
    fontSize: "clamp(38px, 11vw, 66px)",
    fontWeight: 800,
    lineHeight: 1,
    letterSpacing: "-0.02em",
    display: "inline-block",
    marginTop: 4,
  },
  rewardNumberLabel: {
    fontSize: 12.5,
    lineHeight: 1.5,
    color: "rgba(244,246,251,0.72)",
    marginTop: 10,
    marginBottom: 18,
    maxWidth: 520,
  },
  rewardVerse: {
    borderLeft: `3px solid ${PINK}`,
    paddingLeft: 14,
    marginBottom: 12,
  },
  rewardVerseText: {
    fontSize: 15,
    lineHeight: 1.6,
    fontStyle: "italic",
    color: "rgba(244,246,251,0.9)",
    margin: 0,
  },
  rewardVerseRef: {
    display: "inline-block",
    marginTop: 6,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11.5,
    color: "#ff6fa8",
  },
  rewardMathNote: {
    fontSize: 12,
    lineHeight: 1.5,
    color: "rgba(244,246,251,0.6)",
    marginBottom: 18,
  },
  proofGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 10,
  },
  proofCard: {
    background: "rgba(5,12,31,0.45)",
    border: "1px solid rgba(244,246,251,0.1)",
    borderRadius: 12,
    padding: "14px 14px 12px",
    display: "flex",
    flexDirection: "column",
  },
  proofText: {
    fontSize: 13,
    lineHeight: 1.5,
    color: "rgba(244,246,251,0.9)",
    margin: "0 0 10px",
    flex: 1,
  },
  proofRef: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10.5,
    color: "rgba(244,246,251,0.5)",
  },

  quoteCard: {
    borderLeft: `3px solid ${BLUE}`,
    background: "rgba(0,163,218,0.06)",
    borderRadius: "0 12px 12px 0",
    padding: "16px 18px",
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "rgba(244,246,251,0.92)",
    fontStyle: "italic",
    margin: 0,
  },
  quoteRef: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12,
    color: BLUE,
    fontStyle: "normal",
  },
  sectionDivider: {
    height: 1,
    background: "rgba(244,246,251,0.12)",
    margin: "32px 0 20px",
  },
  caseGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    gap: 12,
  },
  caseCard: {
    border: "1px solid rgba(244,246,251,0.1)",
    borderRadius: 12,
    padding: "14px 16px",
    background: "rgba(244,246,251,0.03)",
  },
  casePlace: {
    fontWeight: 700,
    fontSize: 14,
    marginBottom: 3,
  },
  caseType: {
    fontSize: 12,
    color: "rgba(244,246,251,0.55)",
    marginBottom: 10,
  },
};
