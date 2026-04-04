# SignSafe

SignSafe is a Chrome extension that intercepts Solana wallet signing requests, simulates each transaction on Solana RPC, applies deterministic risk heuristics, and (for successful simulations) asks the SignSafe API for a plain-English explanation before the wallet popup appears.

## Structure

- `src/background/` contains the MV3 service worker entry.
- `src/content/` contains the content-script bridge and overlay-session lifecycle.
- `src/page/` contains the page-world wallet interception hook.
- `src/overlay/` contains the overlay runtime script used by `overlay.html`.
- `src/demo/` and `src/options/` contain the extension page scripts.
- `shared/` contains cross-surface constants, fixtures, parsing, formatting, and helper logic.
- `vendor/solana-web3.iife.js` is a bundled `@solana/web3.js` build for Layer 1 instruction decode in the service worker. Regenerate from `extension/` with `npm run vendor:web3` (requires `npm install` once).
- Root HTML/CSS files remain extension entry documents referenced directly by Chrome.

## Load Unpacked

1. Open `chrome://extensions`.
2. Enable Developer Mode.
3. Click **Load unpacked** and select the `extension/` folder.
4. Open the SignSafe extension details and set your SignSafe API key through **Extension options** (optional for local/dev flows if your backend accepts anonymous requests).
5. Open a Solana dApp and trigger a wallet signature request.

## How Analysis Works

For transaction signatures (`signTransaction`, `signAllTransactions`, `sendTransaction`, `signAndSendTransaction`), SignSafe:

1. Simulates the transaction in the background worker.
2. Extracts structured facts (SOL/token deltas, touched programs, simulation status).
3. Applies deterministic heuristics to produce a baseline risk verdict.
4. Calls the SignSafe API (`/v1/analyze`) for user-facing explanation text when simulation succeeds.
5. Falls back to heuristic-only output when the API is unavailable or rate-limited.

For message signatures (`signMessage`), no on-chain simulation is possible, so SignSafe shows a dedicated blind-signature warning flow.

## Demo Page

Open `chrome-extension://<EXTENSION_ID>/demo.html` to preview the canned hackathon scenarios:

- Jupiter swap
- Wallet drainer
- Metaplex NFT mint
- Login signature

The demo page renders the same overlay used during live interception, but with bundled fixture verdicts instead of a real wallet call. The fixtures now include structured facts and a raw-message preview example so the richer overlay states stay testable without a live wallet.

## Local Test DApp

If you are using the multi-repo workspace (`SignSafe-Meta`), the local harness lives at `demo/test-dapp`.
Serve it from the meta root:

```bash
python3 -m http.server 8788 --directory demo/test-dapp
```

Then open `http://127.0.0.1:8788` and use the core buttons in order:

1. `Connect`
2. `Sign Message`
3. `Sign Transaction`
4. `Send Transaction`

The page also includes `Batch Sign All` and `Multi-Instruction Send` to exercise `signAllTransactions` and a multi-instruction transaction shape.

This page uses a 1-lamport self-transfer on devnet and is meant to trigger SignSafe on a controlled localhost origin instead of relying on third-party dApps.

## Licensing

This project is source-available under `BSL 1.1` with an Additional Use Grant.

- Main license: `LICENSE`
- Commercial terms: `COMMERCIAL_LICENSE.md`
- FAQ: `LICENSING_FAQ.md`
