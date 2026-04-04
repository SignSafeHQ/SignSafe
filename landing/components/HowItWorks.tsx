function WalletIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="15" rx="3" stroke="currentColor" strokeWidth="1.8" fill="none" />
      <path d="M2 10h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="17" cy="15" r="1.5" fill="currentColor" />
    </svg>
  );
}

function ChainIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6L12 2z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="hidden md:block flex-shrink-0"
      style={{ color: "rgba(15,31,53,0.18)", marginBottom: "28px" }}
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const steps = [
  {
    number: "01",
    icon: <WalletIcon />,
    title: "SignSafe intercepts",
    description:
      "Before any popup appears, SignSafe catches the signing request in the background. The dApp never knows it&apos;s being analyzed.",
    color: "#2b6fff",
    bg: "rgba(43, 111, 255, 0.08)",
  },
  {
    number: "02",
    icon: <ChainIcon />,
    title: "Transaction simulated",
    description:
      "The transaction is replayed on Solana's RPC to predict exact token and SOL balance changes — before any real funds move.",
    color: "#7c3aed",
    bg: "rgba(124, 58, 237, 0.08)",
  },
  {
    number: "03",
    icon: <SparkleIcon />,
    title: "AI verdict delivered",
    description:
      "GPT gives you a plain-English summary of what this transaction actually does and flags risks — safe, review, or danger.",
    color: "#0a5c35",
    bg: "rgba(10, 92, 53, 0.08)",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-5 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "#0f1f35" }}
          >
            Three seconds of automatic protection
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#536277" }}>
            Everything happens in the background — you just see the verdict.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col">
              {/* Card */}
              <div
                className="relative flex flex-col rounded-card p-7 flex-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 2px 20px rgba(15,31,53,0.06)",
                }}
              >
                {/* Step number — large watermark */}
                <span
                  className="absolute top-4 right-5 font-bold tabular-nums select-none"
                  style={{ fontSize: "42px", lineHeight: 1, color: "rgba(15,31,53,0.05)" }}
                >
                  {step.number}
                </span>

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: step.bg, color: step.color }}
                >
                  {step.icon}
                </div>

                <h3 className="text-lg font-bold mb-2.5" style={{ color: "#0f1f35" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#536277" }}>
                  {step.description}
                </p>
              </div>

              {/* Connector arrow between cards — desktop only, not after last */}
              {i < steps.length - 1 && (
                <div className="hidden md:flex absolute" style={{ display: "none" }} />
              )}
            </div>
          ))}
        </div>

        {/* Mobile step connector dots */}
        <div className="flex justify-center gap-2 mt-8 md:hidden">
          {steps.map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: "rgba(15,31,53,0.18)" }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
