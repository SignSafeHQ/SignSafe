"use client";

// Faithful replica of the real overlay panel — light card, same tokens
function MockOverlayCard() {
  return (
    <div className="relative">
      {/* Dark backdrop — shows context that this appears over a dApp */}
      <div
        className="absolute inset-0 rounded-card-lg"
        style={{
          background: "rgba(5, 10, 23, 0.78)",
          borderRadius: 24,
          transform: "scale(1.06)",
          zIndex: 0,
        }}
      />

      {/* Light panel — matches real overlay exactly */}
      <div
        className="relative w-full max-w-sm mx-auto rounded-card-lg"
        style={{
          zIndex: 1,
          background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(247,246,243,0.99))",
          border: "1px solid rgba(255,255,255,0.65)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.32)",
          padding: "24px",
        }}
      >
        {/* Eyebrow watermark */}
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(83,98,119,0.45)",
            marginBottom: 16,
          }}
        >
          SignSafe
        </div>

        {/* Risk stamp */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-extrabold uppercase"
            style={{
              fontSize: 13,
              letterSpacing: "0.07em",
              background: "#ffe4e3",
              color: "#991f1c",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
            Danger
          </span>
          <span
            className="inline-flex items-center px-2.5 py-1 rounded-full"
            style={{ fontSize: 11, fontWeight: 600, background: "rgba(15,31,53,0.07)", color: "#536277" }}
          >
            Method: sendTransaction
          </span>
        </div>

        {/* Summary headline */}
        <h3
          style={{
            margin: "0 0 8px",
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.2,
            color: "#0f1f35",
          }}
        >
          This transaction drains your wallet.
        </h3>

        {/* Verdict callout */}
        <p
          style={{
            margin: "0 0 14px",
            padding: "9px 12px",
            borderLeft: "3px solid #d63b37",
            borderRadius: "0 8px 8px 0",
            background: "rgba(15,31,53,0.03)",
            fontSize: 13,
            lineHeight: 1.6,
            color: "#536277",
          }}
        >
          Do not sign this unless you independently trust every destination address.
        </p>

        {/* Actions */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.13em",
            textTransform: "uppercase",
            color: "#991f1c",
            marginBottom: 6,
          }}
        >
          Risk flags
        </div>
        <div
          style={{
            background: "#ffe4e3",
            borderRadius: 12,
            padding: "0 14px",
            marginBottom: 18,
          }}
        >
          {["Bulk token movement to an unverified address.", "Transaction does not match a normal swap or mint flow."].map(
            (item, i, arr) => (
              <div
                key={i}
                style={{
                  padding: "9px 0 9px 20px",
                  borderBottom: i < arr.length - 1 ? "1px solid rgba(15,31,53,0.08)" : "none",
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: "#0f1f35",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    color: "#991f1c",
                    fontWeight: 800,
                    fontSize: 13,
                  }}
                >
                  !
                </span>
                {item}
              </div>
            )
          )}
        </div>

        {/* Buttons — danger layout: block primary */}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 10 }}>
          <button
            style={{
              minHeight: 46,
              borderRadius: 14,
              border: "none",
              cursor: "default",
              fontSize: 14,
              fontWeight: 700,
              background: "linear-gradient(135deg, #d63b37, #9d2220)",
              color: "white",
              boxShadow: "0 2px 12px rgba(153,31,28,0.30)",
            }}
          >
            Block
          </button>
          <button
            style={{
              minHeight: 46,
              borderRadius: 14,
              border: "none",
              cursor: "default",
              fontSize: 13,
              fontWeight: 600,
              background: "rgba(15,31,53,0.06)",
              color: "#536277",
            }}
          >
            Proceed anyway
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 12,
            fontSize: 11,
            color: "#8fa3bb",
            lineHeight: 1.5,
          }}
        >
          🔒 AI analysis helps spot risk, but it is not a guarantee.
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="pt-32 pb-20 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
              style={{
                background: "rgba(43, 111, 255, 0.1)",
                color: "#2b6fff",
                border: "1px solid rgba(43,111,255,0.2)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z" />
              </svg>
              Free Chrome Extension · Solana
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#0f1f35" }}
            >
              Know what you&apos;re signing{" "}
              <span style={{ color: "#2b6fff" }}>before you sign it</span>
            </h1>

            <p
              className="text-lg sm:text-xl leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              style={{ color: "#536277" }}
            >
              SignSafe intercepts every Solana wallet request, simulates the
              transaction on-chain, and shows you an AI-powered plain-English
              verdict — before the popup appears.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <a
                href="#install"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-btn-lg text-base font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: "#2b6fff" }}
              >
                {/* Chrome puzzle-piece / extension icon */}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.2" />
                  <circle cx="12" cy="12" r="4" fill="white" />
                  <path d="M12 2C6.48 2 2 6.48 2 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M22 12c0-5.52-4.48-10-10-10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 22c5.52 0 10-4.48 10-10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M2 12c0 5.52 4.48 10 10 10" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Install free — it&apos;s free
              </a>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-btn-lg text-base font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  color: "#0f1f35",
                  background: "rgba(255,255,255,0.7)",
                  border: "1.5px solid rgba(15,31,53,0.12)",
                }}
              >
                See how it works
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            </div>

            <p className="mt-5 text-sm" style={{ color: "#8fa3bb" }}>
              Works with Phantom, Solflare, Backpack, and any window.solana wallet
            </p>
          </div>

          {/* Right: faithful overlay mock */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm animate-fade-in">
              <MockOverlayCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
