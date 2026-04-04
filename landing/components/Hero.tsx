"use client";

function MockOverlayCard() {
  return (
    <div
      className="w-full max-w-sm mx-auto rounded-card-lg overflow-hidden shadow-overlay"
      style={{ background: "#1a2332", border: "1px solid rgba(255,255,255,0.08)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 pt-5 pb-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="flex items-center justify-center rounded-xl flex-shrink-0"
          style={{
            width: 36,
            height: 36,
            background: "linear-gradient(135deg, #2b6fff, #1a4fcc)",
            borderRadius: 10,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L3 6v6c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V6L12 2z"
              fill="white"
            />
          </svg>
        </div>
        <div>
          <p className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>
            SignSafe Analysis
          </p>
          <p className="text-sm font-semibold" style={{ color: "rgba(255,255,255,0.9)" }}>
            Transaction Review
          </p>
        </div>
        <div className="ml-auto">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
            style={{ background: "#ffe4e3", color: "#991f1c" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            DANGER
          </span>
        </div>
      </div>

      {/* Summary */}
      <div className="px-5 py-4">
        <p
          className="text-sm font-medium leading-relaxed"
          style={{ color: "rgba(255,255,255,0.85)" }}
        >
          This transaction transfers all your token accounts to an unknown wallet. This is a known wallet drain pattern.
        </p>
      </div>

      {/* Actions list */}
      <div className="px-5 pb-4 flex flex-col gap-2">
        <div
          className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <span
            className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs"
            style={{ background: "#ffe4e3", color: "#991f1c" }}
          >
            !
          </span>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
            Transfer authority of USDC token account to{" "}
            <span className="font-mono" style={{ color: "#ff9a9a" }}>
              Dr41n...3rX9
            </span>
          </p>
        </div>
        <div
          className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <span
            className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-xs"
            style={{ background: "#ffe4e3", color: "#991f1c" }}
          >
            !
          </span>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
            Transfer authority of SOL account to{" "}
            <span className="font-mono" style={{ color: "#ff9a9a" }}>
              Dr41n...3rX9
            </span>
          </p>
        </div>
      </div>

      {/* Risk reasons */}
      <div
        className="mx-5 mb-4 px-3 py-3 rounded-xl"
        style={{ background: "rgba(153, 31, 28, 0.15)", border: "1px solid rgba(153,31,28,0.3)" }}
      >
        <p className="text-xs font-semibold mb-1" style={{ color: "#ff9a9a" }}>
          Why this is risky
        </p>
        <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
          Signing this gives a third party full control over your assets. You will not be able to recover them.
        </p>
      </div>

      {/* Buttons */}
      <div
        className="flex gap-3 px-5 pb-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "16px" }}
      >
        <button
          className="flex-1 py-2.5 rounded-btn-lg text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ background: "#991f1c", color: "white" }}
        >
          Block
        </button>
        <button
          className="flex-1 py-2.5 rounded-btn-lg text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            background: "rgba(255,255,255,0.07)",
            color: "rgba(255,255,255,0.55)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          Proceed anyway
        </button>
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
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"
                    fill="white"
                    fillOpacity="0.2"
                  />
                  <path
                    d="M12 8v8M8 12l4 4 4-4"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Add to Chrome — it&apos;s free
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

          {/* Right: mock overlay card */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              {/* Glow behind card */}
              <div
                className="absolute inset-0 rounded-card-lg blur-3xl opacity-20"
                style={{ background: "#991f1c", transform: "scale(0.9) translateY(8%)" }}
              />
              <div className="relative animate-fade-in">
                <MockOverlayCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
