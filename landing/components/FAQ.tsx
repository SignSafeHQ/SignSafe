"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Does SignSafe see my private keys?",
    a: "No. SignSafe never touches private keys. It only receives the already-constructed transaction bytes that your wallet prepared — the same bytes you would have signed. Your seed phrase and private key stay inside your wallet.",
  },
  {
    q: "What data is sent to OpenAI?",
    a: "Only the serialized transaction and the Solana simulation output — the on-chain effects, program names, and balance changes. No wallet addresses, no personal data, no browsing history.",
  },
  {
    q: "Does it work on mainnet?",
    a: "Yes. SignSafe simulates on the same network the transaction targets. It reads the RPC endpoint from the transaction context, so mainnet, devnet, and testnet all work correctly.",
  },
  {
    q: "Will it slow down my transactions?",
    a: "The analysis typically completes in 2–4 seconds. The wallet popup is held until you approve or block, so you always stay in control of the timing.",
  },
  {
    q: "What if SignSafe is wrong?",
    a: "AI analysis significantly reduces risk but is not a guarantee. The overlay always shows you the raw simulation facts — SOL deltas, token changes, programs called — so you can verify independently before deciding.",
  },
  {
    q: "Is my API key safe?",
    a: "Your OpenAI key is stored in Chrome's local extension storage and never leaves your browser except to call OpenAI directly. SignSafe has no backend server. We recommend using a project-scoped key with a spend limit.",
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
        transition: "transform 220ms ease",
        flexShrink: 0,
      }}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        borderBottom: "1px solid rgba(15,31,53,0.08)",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left transition-colors hover:opacity-80"
        aria-expanded={open}
        style={{ background: "none", border: "none", cursor: "pointer", padding: "18px 0" }}
      >
        <span className="text-base font-semibold" style={{ color: "#0f1f35" }}>
          {q}
        </span>
        <span style={{ color: "#536277" }}>
          <ChevronIcon open={open} />
        </span>
      </button>

      <div
        style={{
          maxHeight: open ? 300 : 0,
          overflow: "hidden",
          transition: "max-height 280ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <p
          className="text-sm leading-relaxed pb-5"
          style={{ color: "#536277" }}
        >
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQ() {
  return (
    <section id="faq" className="py-20 px-5 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: "#0f1f35" }}
          >
            Common questions
          </h2>
          <p className="text-lg" style={{ color: "#536277" }}>
            Everything you need to know before installing.
          </p>
        </div>

        <div
          className="rounded-card-lg px-8"
          style={{
            background: "rgba(255,255,255,0.8)",
            border: "1px solid rgba(255,255,255,0.9)",
            boxShadow: "0 2px 20px rgba(15,31,53,0.06)",
          }}
        >
          {faqs.map((faq, i) => (
            <FAQItem key={i} q={faq.q} a={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
}
