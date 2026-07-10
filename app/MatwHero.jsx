"use client";

// A lightweight replica of matwproject.org/sadaqah-jariyah's top section —
// nav bar, pink promo band, quick-donate bar, and hero — built from the exact
// brand values sampled off the live site (nav gradient #00a3da → #093484,
// promo/CTA pink #f60362, quick-donate section #00a3da, card bg #E4F8FF,
// page bg #e2eff3). Our calculator slots in directly beneath this, in the
// same spot MATW's own page puts its supporting content.
export default function MatwHero() {
  return (
    <div style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Nav */}
      <nav
        style={{
          background: "linear-gradient(to right, #00a3da, #093484)",
          padding: "14px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: "2px solid #fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              color: "#fff",
              fontWeight: 800,
              flexShrink: 0,
            }}
          >
            M
          </div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: "0.02em" }}>
            MATW PROJECT
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            color: "#fff",
            fontWeight: 700,
            fontSize: 12.5,
            flexWrap: "wrap",
          }}
        >
          <span>GIVE NOW</span>
          <span>ZAKAT</span>
          <span>ISLAMIC GIVING</span>
          <span>ABOUT US</span>
        </div>
        <span
          style={{
            background: "#f60362",
            color: "#fff",
            fontWeight: 800,
            fontSize: 12,
            padding: "9px 18px",
            borderRadius: 999,
          }}
        >
          DONATE
        </span>
      </nav>

      {/* Pink promo band */}
      <div
        style={{
          background: "#f60362",
          color: "#fff",
          textAlign: "center",
          padding: "10px 16px",
          fontSize: 13,
          fontWeight: 700,
        }}
      >
        Gaza: Rebuild What Was Lost — <span style={{ textDecoration: "underline" }}>Learn More</span>
      </div>

      {/* Quick-donate bar */}
      <div
        style={{
          background: "#00a3da",
          padding: "16px 20px",
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "#E4F8FF",
            borderRadius: 10,
            padding: "10px 16px",
            fontSize: 13,
            color: "#0d1b2a",
            fontWeight: 700,
          }}
        >
          Amount
        </div>
        {["$65", "$150", "$200", "$500"].map((v) => (
          <div
            key={v}
            style={{
              background: "#fff",
              color: "#f60362",
              fontWeight: 800,
              fontSize: 13,
              padding: "10px 16px",
              borderRadius: 10,
            }}
          >
            {v}
          </div>
        ))}
        <div
          style={{
            background: "#f60362",
            color: "#fff",
            fontWeight: 800,
            fontSize: 13,
            padding: "10px 22px",
            borderRadius: 10,
          }}
        >
          QUICK DONATE
        </div>
      </div>

      {/* Hero */}
      <div
        style={{
          background:
            "radial-gradient(ellipse 120% 100% at 30% 0%, #1a6b8f 0%, #0d3a52 55%, #062338 100%)",
          padding: "56px 24px 64px",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.25em",
              marginBottom: 14,
              color: "#bfeaff",
            }}
          >
            SADAQAH JARIYAH
          </div>
          <h1 style={{ fontSize: "clamp(34px, 8vw, 64px)", fontWeight: 900, lineHeight: 1.02, margin: 0 }}>
            Giving that
            <br />
            never stops.
          </h1>
          <p style={{ marginTop: 18, fontSize: 15, lineHeight: 1.6, color: "rgba(255,255,255,0.85)", maxWidth: 480 }}>
            A well, a mosque, a Qur'an handed down — one act of Sadaqah Jariyah keeps paying out
            reward long after you're gone. See exactly what your donation builds below.
          </p>
        </div>
      </div>
    </div>
  );
}
