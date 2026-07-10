"use client";

// A close replica of matwproject.org/sadaqah-jariyah's top section, built
// from content and assets pulled directly off the live page:
//  - Real logo: cdn.matwproject.org/images/general/logo-transparent.png
//  - Real hero photo (their actual builder.io asset)
//  - Real headline: "Give Sadaqah Jariyah And Let your deed live on."
//  - Real nav links (Donate, Give Zakat, Forgotten Ummah, Build a Water Well,
//    Build a Masjid, ...) with their real hrefs
//  - Exact brand colors sampled from computed styles: nav gradient
//    #00a3da → #093484, CTA/price pink #f60362 / #FE278C, link blue #00AEEF,
//    quick-donate bar #00a3da, card bg #E4F8FF
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
          gap: 14,
        }}
      >
        <a
          href="https://matwproject.org/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
        >
          <img
            src="https://cdn.matwproject.org/images/general/logo-transparent.png"
            alt="Muslim Charity MATW"
            style={{ width: 34, height: 34, objectFit: "contain" }}
          />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 13, letterSpacing: "0.02em" }}>
            MATW PROJECT
          </span>
        </a>
        <div
          style={{
            display: "flex",
            gap: 18,
            color: "#fff",
            fontWeight: 700,
            fontSize: 12,
            flexWrap: "wrap",
          }}
        >
          <a href="https://matwproject.org/zakat" target="_blank" rel="noopener noreferrer" style={navLink}>
            Give Zakat
          </a>
          <a href="https://matwproject.org/sadaqah-jariyah/build-a-water-well" target="_blank" rel="noopener noreferrer" style={navLink}>
            Build a Water Well
          </a>
          <a href="https://matwproject.org/sadaqah-jariyah/build-a-masjid" target="_blank" rel="noopener noreferrer" style={navLink}>
            Build a Masjid
          </a>
          <a href="https://matwproject.org/forgotten-ummah" target="_blank" rel="noopener noreferrer" style={navLink}>
            Forgotten Ummah
          </a>
        </div>
        <a
          href="https://matwproject.org/top-10"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: "#f60362",
            color: "#fff",
            fontWeight: 800,
            fontSize: 12,
            padding: "9px 18px",
            borderRadius: 999,
            textDecoration: "none",
          }}
        >
          DONATE
        </a>
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
        Gaza: Rebuild What Was Lost —{" "}
        <a href="https://matwproject.org/gaza-emergency" target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "underline" }}>
          Learn More
        </a>
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
        <div style={{ background: "#E4F8FF", borderRadius: 10, padding: "10px 16px", fontSize: 13, color: "#0d1b2a", fontWeight: 700 }}>
          Amount
        </div>
        {["£65", "£150", "£200", "£500"].map((v) => (
          <div key={v} style={{ background: "#fff", color: "#f60362", fontWeight: 800, fontSize: 13, padding: "10px 16px", borderRadius: 10 }}>
            {v}
          </div>
        ))}
        <div style={{ background: "#f60362", color: "#fff", fontWeight: 800, fontSize: 13, padding: "10px 22px", borderRadius: 10 }}>
          QUICK DONATE
        </div>
      </div>

      {/* Hero — real photo from the live page */}
      <div style={{ position: "relative", width: "100%", minHeight: 340, overflow: "hidden", background: "#0d3a52" }}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F32b8c354d4bc455dbf10fed3923dfae1%2F6afffbba407d4a17a7d40f88d63fff32"
          alt="MATW Sadaqah Jariyah"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(6,35,56,0.35) 0%, rgba(6,35,56,0.75) 100%)",
          }}
        />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto", padding: "64px 24px 56px", color: "#fff" }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.25em", marginBottom: 14, color: "#bfeaff" }}>
            SADAQAH JARIYAH
          </div>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 900, lineHeight: 1.08, margin: 0 }}>
            Give Sadaqah Jariyah
            <br />
            And let your deed live on.
          </h1>
          <div style={{ display: "flex", gap: 24, marginTop: 24, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 700, textTransform: "uppercase" }}>Total raised</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: "#f60362" }}>£65,362 GBP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const navLink = { color: "#fff", textDecoration: "none" };
