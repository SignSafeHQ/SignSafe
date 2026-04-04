function WalletGroupIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="8" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 8V6a5 5 0 0110 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="15" r="2" fill="currentColor" />
    </svg>
  );
}

function SimulateIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline
        points="22 12 18 12 15 21 9 3 6 12 2 12"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PrivacyIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M7 11V7a5 5 0 0110 0v4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="12" cy="16" r="1.5" fill="currentColor" />
    </svg>
  );
}

function OpenSourceIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const features = [
  {
    icon: <WalletGroupIcon />,
    title: "Works with all wallets",
    description:
      "Works automatically with Phantom, Solflare, Backpack, and any Solana wallet — no configuration needed for each one.",
    color: "#2b6fff",
    bg: "rgba(43, 111, 255, 0.08)",
  },
  {
    icon: <SimulateIcon />,
    title: "On-chain simulation",
    description:
      "Real RPC simulation shows the exact SOL and token balance changes before a single signature is submitted.",
    color: "#7c3aed",
    bg: "rgba(124, 58, 237, 0.08)",
  },
  {
    icon: <PrivacyIcon />,
    title: "Private by design",
    description:
      "Only your API key, stored locally in Chrome. Transactions are never logged or sent anywhere beyond OpenAI and Solana RPC.",
    color: "#0a5c35",
    bg: "rgba(10, 92, 53, 0.08)",
  },
  {
    icon: <OpenSourceIcon />,
    title: "Open source",
    description:
      "Inspect every line on GitHub. No hidden network calls, no telemetry, no analytics. What you see is what runs.",
    color: "#c2410c",
    bg: "rgba(194, 65, 12, 0.08)",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 px-5 sm:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "#0f1f35" }}
          >
            What SignSafe does with your data
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#536277" }}>
            No analytics. No telemetry. No hidden network calls. Here&apos;s exactly what happens.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex gap-5 rounded-card p-7 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
              style={{
                background: "rgba(255,255,255,0.75)",
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 2px 20px rgba(15,31,53,0.06)",
              }}
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: feature.bg, color: feature.color }}
              >
                {feature.icon}
              </div>
              <div>
                <h3
                  className="text-base font-bold mb-2"
                  style={{ color: "#0f1f35" }}
                >
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#536277" }}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div
          className="mt-10 rounded-card-lg p-8 sm:p-10 text-center"
          style={{
            background: "linear-gradient(135deg, #1a2d5a, #0f1f35)",
          }}
        >
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
            style={{ background: "linear-gradient(135deg, #2b6fff, #1a4fcc)" }}
          >
            <span className="text-3xl leading-none" aria-hidden="true">
              🛡️
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Stay safe on Solana
          </h3>
          <p className="text-base mb-7" style={{ color: "rgba(255,255,255,0.6)" }}>
            Add SignSafe to Chrome in seconds. It takes less than a minute to set up.
          </p>
          <a
            href="#install"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-btn-lg text-base font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:-translate-y-0.5"
            style={{ background: "#2b6fff" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                fill="white"
                fillOpacity="0.2"
              />
              <path
                d="M8 12l4 4 4-4M12 8v8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Add to Chrome — it&apos;s free
          </a>
        </div>
      </div>
    </section>
  );
}
