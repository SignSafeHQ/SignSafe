# Monetization Strategy

> **Status:** Not yet implemented — this is a planning sketch for future reference.

## Why it makes sense

- Users lose real money to wallet drainers. They'll pay to avoid it.
- OpenAI API cost per transaction is real and scales with usage.
- The intercept + simulation layer (the hardest part) is already built.

---

## Monetization approaches

### 1. Freemium — most natural fit
- **Free:** Limited verdicts/day (e.g. 10), basic risk score + summary
- **Paid (~$8/mo):** Unlimited scans, full action breakdowns, history log, custom RPC endpoint

Works because value is per-transaction and users feel the limit right when they need it most.

### 2. One-time purchase / lifetime license
- Simpler. Chrome extensions have a strong one-time-buy culture.
- ~$25 lifetime. Less recurring revenue but lower churn risk.

### 3. B2B / wallet partnerships
- License the simulation + verdict layer to wallets (Phantom, Backpack, etc.).
- Much higher ACV, but requires a sales motion and likely open-sourcing the extension as a demo.

### 4. "Powered by SignSafe" API
- Expose simulation + verdict as an API. Charge dApps or wallet devs per-call.
- Positions SignSafe as infrastructure rather than a consumer product.

---

## Recommended first step: Proxied Verdict API with Tier Gating

Replace the current "bring your own OpenAI key" model with a SignSafe-hosted backend that holds the API key and enforces usage tiers.

### Architecture

```
[User installs extension]
         │
         ▼
[SignSafe account signup] ── Stripe checkout ──► [license key issued]
         │
         ▼
[Extension options page] ← user pastes license key (replaces OpenAI key flow)
         │
         ▼
[background.js] ── POST /api/analyze ──► [SignSafe Backend]
                    { tx, licenseKey }         │
                                               ├─ validate key
                                               ├─ check tier + usage quota
                                               ├─ call Solana RPC
                                               ├─ call OpenAI (server key)
                                               └─ return verdict JSON
```

### Backend endpoints

| Endpoint | Purpose |
|---|---|
| `POST /api/analyze` | Validate key, check quota, run simulation + OpenAI, return verdict |
| `POST /api/auth/signup` | Create account, trigger Stripe checkout |
| `GET /api/usage` | Let users see their scan count in the options page |

### Tier table

| Tier | Scans/day | Detail level | Price |
|---|---|---|---|
| Free | 10 | Risk score + summary only | $0 |
| Pro | Unlimited | Full `actions[]`, `risk_reasons[]` | $8/mo |
| Lifetime | Unlimited | Full | $25 once |

The backend strips `actions[]` and `risk_reasons[]` from the response for free-tier users — the overlay already renders those conditionally.

---

## Key design decisions

**License key, not OAuth** — simpler UX, no redirect flow inside an extension. One string in options, done.

**Server holds the OpenAI key** — users never need an OpenAI account. This is the main value unlock vs the current bring-your-own-key model.

**Quota is server-side** — the extension cannot enforce limits, so the backend counts and rejects at the API level.

**Free tier still works** — users get real verdicts, just truncated. A blocked drainer on the free tier is the best marketing.

---

## What changes in the extension

Minimal — only `background.js`:

- Remove direct OpenAI fetch
- Replace with `fetch("https://api.signsafe.xyz/analyze", { body: { tx, licenseKey } })`
- Handle `402` (quota exceeded) and `403` (invalid key) gracefully in the overlay UI

Everything else — the intercept layer, overlay rendering, simulation log parsing — stays identical.

---

## Before implementing: validate first

Collect usage data before committing to a model:
- How many users install and keep the extension?
- What percentage of scans return non-safe verdicts?
- Do users click Block when warned?

This shapes whether freemium, one-time, or API-as-a-service fits best.
