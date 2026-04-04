type RiskLevel = "safe" | "review" | "danger";

const riskConfig: Record<
  RiskLevel,
  { bg: string; ink: string; border: string; label: string; dot: string }
> = {
  safe: {
    bg: "#d6f5e3",
    ink: "#0a5c35",
    border: "#0a5c35",
    label: "SAFE",
    dot: "#16a34a",
  },
  review: {
    bg: "#fff0c2",
    ink: "#7a4c00",
    border: "#d97706",
    label: "REVIEW",
    dot: "#d97706",
  },
  danger: {
    bg: "#ffe4e3",
    ink: "#991f1c",
    border: "#991f1c",
    label: "DANGER",
    dot: "#dc2626",
  },
};

interface Scenario {
  risk: RiskLevel;
  name: string;
  tag: string;
  summary: string;
  actions: string[];
}

const scenarios: Scenario[] = [
  {
    risk: "safe",
    name: "Jupiter Swap",
    tag: "DEX · Aggregator",
    summary:
      "Swaps 1.5 SOL → 142.3 USDC via Jupiter aggregator using the best available route across Raydium and Orca liquidity pools.",
    actions: [
      "Debit 1.5 SOL from your wallet",
      "Credit 142.3 USDC to your wallet",
    ],
  },
  {
    risk: "review",
    name: "NFT Mint",
    tag: "Metaplex · NFT",
    summary:
      "Mints 1 NFT for 0.5 SOL via Metaplex. Collection authority is verified but verify the collection before proceeding.",
    actions: [
      "Debit 0.5 SOL mint fee",
      "Create new NFT token account in your wallet",
    ],
  },
  {
    risk: "danger",
    name: "Wallet Drainer",
    tag: "Unknown program",
    summary:
      "Transfers all token accounts to an unknown wallet. This matches a known drain pattern used in phishing attacks.",
    actions: [
      "Transfer USDC token authority to Dr41n...3rX9",
      "Transfer all SOL to Dr41n...3rX9",
    ],
  },
];

function RiskBadge({ risk }: { risk: RiskLevel }) {
  const cfg = riskConfig[risk];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
      style={{ background: cfg.bg, color: cfg.ink }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: cfg.dot }}
      />
      {cfg.label}
    </span>
  );
}

function CheckIcon({ risk }: { risk: RiskLevel }) {
  const colors: Record<RiskLevel, string> = {
    safe: "#16a34a",
    review: "#d97706",
    danger: "#dc2626",
  };
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className="flex-shrink-0 mt-0.5"
    >
      <circle cx="12" cy="12" r="10" fill={colors[risk]} fillOpacity="0.15" />
      <path
        d="M9 12l2 2 4-4"
        stroke={colors[risk]}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Scenarios() {
  return (
    <section
      id="scenarios"
      className="py-20 px-5 sm:px-8"
      style={{
        background:
          "linear-gradient(180deg, transparent, rgba(255,255,255,0.4), transparent)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "#0f1f35" }}
          >
            Real-world scenarios
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#536277" }}>
            SignSafe handles everything from routine swaps to sophisticated
            phishing attacks.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {scenarios.map((scenario, i) => {
            const cfg = riskConfig[scenario.risk];
            return (
              <div
                key={i}
                className="flex flex-col rounded-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 2px 20px rgba(15,31,53,0.06)",
                  borderTop: `3px solid ${cfg.border}`,
                }}
              >
                <div className="p-6 flex flex-col gap-4 flex-1">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3
                        className="text-base font-bold leading-tight mb-1"
                        style={{ color: "#0f1f35" }}
                      >
                        {scenario.name}
                      </h3>
                      <span
                        className="text-xs font-medium"
                        style={{ color: "#8fa3bb" }}
                      >
                        {scenario.tag}
                      </span>
                    </div>
                    <RiskBadge risk={scenario.risk} />
                  </div>

                  {/* Summary */}
                  <p className="text-sm leading-relaxed" style={{ color: "#536277" }}>
                    {scenario.summary}
                  </p>

                  {/* Divider */}
                  <div
                    className="h-px"
                    style={{ background: "rgba(15,31,53,0.07)" }}
                  />

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <p
                      className="text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "#8fa3bb" }}
                    >
                      Detected actions
                    </p>
                    {scenario.actions.map((action, j) => (
                      <div key={j} className="flex items-start gap-2">
                        <CheckIcon risk={scenario.risk} />
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "#536277" }}
                        >
                          {action}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
