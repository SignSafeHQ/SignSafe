# Phase 1 transaction decode regression matrix

This folder is for optional **static base64 fixtures** (recorded from a devnet wallet after running each harness button). Phase 1 ships with **decode-at-runtime** verification via the extension background worker; fixtures are optional CI/local checks.

## How to record a fixture

1. Load the extension unpacked and open [`demo/test-dapp`](../../../demo/test-dapp) (local server).
2. Connect a devnet wallet and run the scenario button once.
3. With SignSafe debug enabled (`localStorage` key `signsafe-debug` = `1` or `window.__SIGNSAFE_DEBUG__`), trigger the same action and copy the serialized transaction from wallet/extension logs if available, **or** add a temporary `console.log` in the page harness to print `transaction.serialize().toString('base64')` before sign.
4. Save as `scenarioId.txt` (single line base64) in this directory.

## Harness scenario IDs (must decode without throwing)

| scenarioId | Source in `demo/test-dapp (see `scenarios/`)` | Phase 1 notes |
|------------|-----------------------------------|---------------|
| `safe_baseline_self_transfer` | `buildSelfTransferTransaction` | Legacy; 1× System transfer |
| `hidden_injection_memo_plus_transfer` | `buildHiddenInjectionMemoTransaction` | Memo + System transfer |
| `hidden_injection_swap_leg_plus_transfer` | `buildHiddenInjectionSwapTransaction` | Jupiter legacy + appended transfer, or degraded memo |
| `stmt_lite_multi_asset_bundle` | `buildStmtLiteDrainTransaction` | Many SPL + System ixs |
| `alt_bootstrap_devnet_lut` | `buildAltBootstrapTransaction` | Address lookup table program ixs |
| `sol_drain_single_recipient` | `buildBulkDrainTransaction` | 1× System transfer |
| `sol_drain_multi_recipient` | `buildMultiRecipientDrainTransaction` | N× System transfer |
| `spl_delegate_approve_checked` | `buildSplDelegateTransaction` | SPL ApproveChecked + setup |
| `spl_authority_mint_transfer` | `buildSplAuthorityTakeoverTransaction` | SPL SetAuthority + setup |
| `system_assign_auxiliary_account` | `buildAssignAuxiliaryAccountTransaction` | System create + assign |
| `system_assign_bait_memo_plus_aux` | `buildAssignBaitTransaction` | Memo + create + assign |
| `system_assign_primary_wallet` | `buildAssignWalletTakeoverTransaction` | System assign (wallet) |
| `durable_nonce_time_bomb` | `buildDurableNonceRiskTransaction` | Nonce create **or** advance + transfer |
| `versioned_v0_alt` | `buildVersionedAltTransaction` | v0; ALT unresolved if LUT not resolved |
| `close_account_rent_redirect` | `buildCloseAccountRentRedirectTransaction` | SPL close + setup |
| `token2022_permanent_delegate_risk` | `buildToken2022PermanentDelegateTransaction` | Token-2022 init + extension |

## Shadow decode (implemented)

Background analysis calls `SIGNSAFE_SHARED.txDecode.decodeTransactionShadow(base64Tx)` when debug logging is enabled. Check the service worker console for `tx_decode_shadow` lines: instruction count and program id count.

## Vendor rebuild

From `extension/`:

```bash
npm run vendor:web3
```

This regenerates [`vendor/solana-web3.iife.js`](../vendor/solana-web3.iife.js) from `@solana/web3.js`.
