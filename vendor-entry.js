/**
 * Build: npx esbuild vendor-entry.js --bundle --format=iife --platform=browser --outfile=vendor/solana-web3.iife.js
 * Exposes namespace for MV3 service worker importScripts.
 */
import * as SolanaWeb3 from "@solana/web3.js";

const g = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : {};
g.SolanaWeb3 = SolanaWeb3;
