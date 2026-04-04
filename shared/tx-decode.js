/**
 * Layer 1: deserialize legacy / v0 transactions and normalize instructions (shadow-only in Phase 1).
 * Requires ../../vendor/solana-web3.iife.js (sets global SolanaWeb3) before this script in importScripts order.
 */
(function initSignSafeTxDecode(root) {
  const globalRoot = root || globalThis;
  const shared = globalRoot.SIGNSAFE_SHARED || (globalRoot.SIGNSAFE_SHARED = {});

  function base64ToUint8Array(b64) {
    const trimmed = String(b64 || "").trim();
    const binary = atob(trimmed);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function getSolanaWeb3() {
    return globalRoot.SolanaWeb3 || globalThis.SolanaWeb3 || null;
  }

  /**
   * VersionedTransaction.deserialize accepts both v0 and legacy wire formats.
   * Legacy wire still yields a VersionedTransaction wrapper with message.version === "legacy".
   * @returns {{ ok: true, tx: object } | { ok: false, error: string }}
   */
  function deserializeBase64Transaction(base64) {
    const SolanaWeb3 = getSolanaWeb3();
    if (!SolanaWeb3 || !SolanaWeb3.VersionedTransaction || !SolanaWeb3.Transaction) {
      return { ok: false, error: "SolanaWeb3_vendor_missing" };
    }
    let bytes;
    try {
      bytes = base64ToUint8Array(base64);
    } catch (e) {
      return { ok: false, error: `invalid_base64: ${e?.message || String(e)}` };
    }

    try {
      const vtx = SolanaWeb3.VersionedTransaction.deserialize(bytes);
      return { ok: true, tx: vtx };
    } catch (_first) {
      try {
        const legacy = SolanaWeb3.Transaction.from(bytes);
        return { ok: true, tx: legacy };
      } catch (e2) {
        return { ok: false, error: e2?.message || String(e2) };
      }
    }
  }

  function toUint8Data(data) {
    if (!data) return new Uint8Array(0);
    if (data instanceof Uint8Array) return data;
    if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(data)) {
      return new Uint8Array(data);
    }
    return new Uint8Array(data);
  }

  function listNormalizedInstructionsLegacy(tx) {
    const instructions = tx.instructions || [];
    return instructions.map((ix, index) => ({
      index,
      programId: ix.programId ? ix.programId.toBase58() : null,
      accountKeys: Array.isArray(ix.keys) ? ix.keys.map((k) => (k.pubkey ? k.pubkey.toBase58() : null)) : [],
      data: toUint8Data(ix.data),
      encoding: "legacy",
      accountUnresolved: false
    }));
  }

  function listFromLegacyCompiledMessage(msg) {
    const accountKeys = msg.getAccountKeys();
    const compiled = msg.compiledInstructions || [];
    const out = [];
    for (let i = 0; i < compiled.length; i++) {
      const ix = compiled[i];
      const data = new Uint8Array(ix.data);
      const pidKey = accountKeys.get(ix.programIdIndex);
      const programId = pidKey ? pidKey.toBase58() : null;
      const idxArr = ix.accountKeyIndexes || ix.accounts;
      const accounts = [];
      for (let j = 0; j < idxArr.length; j++) {
        const byteIdx = idxArr[j];
        const k = accountKeys.get(byteIdx);
        accounts.push(k ? k.toBase58() : null);
      }
      out.push({
        index: i,
        programId,
        accountKeys: accounts,
        data,
        encoding: "legacy",
        accountUnresolved: !programId || accounts.some((a) => a === null)
      });
    }
    return out;
  }

  function listFromV0Message(msg) {
    let accountKeys = null;
    let accountKeysError = null;
    try {
      accountKeys = msg.getAccountKeys();
    } catch (e) {
      accountKeysError = e?.message || String(e);
    }

    const out = [];
    const compiled = msg.compiledInstructions || [];
    for (let i = 0; i < compiled.length; i++) {
      const ix = compiled[i];
      const data = new Uint8Array(ix.data);
      if (accountKeys) {
        const pidKey = accountKeys.get(ix.programIdIndex);
        const programId = pidKey ? pidKey.toBase58() : null;
        const accounts = [];
        const idxArr = ix.accountKeyIndexes || ix.accounts;
        for (let j = 0; j < idxArr.length; j++) {
          const byteIdx = idxArr[j];
          const k = accountKeys.get(byteIdx);
          accounts.push(k ? k.toBase58() : null);
        }
        out.push({
          index: i,
          programId,
          accountKeys: accounts,
          data,
          encoding: "v0",
          accountUnresolved: false
        });
      } else {
        const staticKeys = msg.staticAccountKeys || [];
        const programId =
          ix.programIdIndex < staticKeys.length ? staticKeys[ix.programIdIndex].toBase58() : null;
        const idxArr = ix.accountKeyIndexes || ix.accounts;
        const accounts = Array.from(idxArr || []).map((byteIdx) => {
          if (byteIdx < staticKeys.length) return staticKeys[byteIdx].toBase58();
          return null;
        });
        out.push({
          index: i,
          programId,
          accountKeys: accounts,
          data,
          encoding: "v0",
          accountUnresolved: accounts.some((a) => a === null) || programId === null,
          accountKeysError
        });
      }
    }

    return { instructions: out, accountKeysError };
  }

  /**
   * @param {object} tx — VersionedTransaction or legacy Transaction
   */
  function listNormalizedInstructions(tx) {
    if (Array.isArray(tx.instructions) && tx.instructions.length > 0) {
      return listNormalizedInstructionsLegacy(tx);
    }
    const msg = tx.message;
    if (!msg) {
      return [];
    }
    if (msg.version === "legacy") {
      return listFromLegacyCompiledMessage(msg);
    }
    if (msg.version === 0) {
      return listFromV0Message(msg).instructions;
    }
    return [];
  }

  function peekMessageHeader(tx) {
    const msg = tx.message;
    if (msg && msg.version === "legacy") {
      return {
        version: "legacy",
        header: msg.header ? { ...msg.header } : null,
        accountKeysCount: msg.staticAccountKeys?.length ?? msg.accountKeys?.length ?? 0,
        compiledInstructionsCount: msg.compiledInstructions?.length ?? 0
      };
    }
    if (msg && msg.version === 0) {
      return {
        version: 0,
        header: msg.header ? { ...msg.header } : null,
        staticAccountKeysCount: msg.staticAccountKeys?.length ?? 0,
        addressTableLookupsCount: msg.addressTableLookups?.length ?? 0,
        compiledInstructionsCount: msg.compiledInstructions?.length ?? 0
      };
    }

    if (typeof tx.compileMessage === "function") {
      try {
        const compiled = tx.compileMessage();
        return {
          version: "legacy",
          header: compiled.header ? { ...compiled.header } : null,
          accountKeysCount: compiled.accountKeys?.length ?? 0,
          instructionsCount: compiled.instructions?.length ?? 0
        };
      } catch (_e) {
        return {
          version: "legacy",
          instructionsCount: tx.instructions?.length ?? 0,
          compileError: "compileMessage_failed"
        };
      }
    }

    return { version: "unknown", instructionsCount: tx.instructions?.length ?? 0 };
  }

  function attachSemantics(normalized) {
    const enrich = shared.ixSemantics?.enrichInstructionSemantics;
    if (typeof enrich !== "function") {
      return normalized.map((ix) => ({ ...ix, semantic: null }));
    }
    return normalized.map((ix) => ({
      ...ix,
      semantic: enrich(ix.programId, ix.data)
    }));
  }

  function decodeTransactionShadow(base64Tx) {
    const deserialized = deserializeBase64Transaction(base64Tx);
    if (!deserialized.ok) {
      return { ok: false, error: deserialized.error };
    }

    const { tx } = deserialized;
    let normalized = [];
    let accountKeysError = null;

    if (Array.isArray(tx.instructions) && tx.instructions.length > 0) {
      normalized = listNormalizedInstructionsLegacy(tx);
    } else if (tx.message) {
      if (tx.message.version === "legacy") {
        normalized = listFromLegacyCompiledMessage(tx.message);
      } else if (tx.message.version === 0) {
        const v = listFromV0Message(tx.message);
        normalized = v.instructions;
        accountKeysError = v.accountKeysError || null;
      }
    }

    const programIds = [...new Set(normalized.map((n) => n.programId).filter(Boolean))];
    const semantics = attachSemantics(normalized);
    const header = peekMessageHeader(tx);

    return {
      ok: true,
      kind: tx.message ? (tx.message.version === 0 ? "versioned" : "legacy") : "legacy",
      instructionCount: normalized.length,
      programIds,
      normalizedInstructions: normalized,
      semantics,
      header,
      accountKeysError
    };
  }

  shared.txDecode = Object.freeze({
    deserializeBase64Transaction,
    listNormalizedInstructions,
    peekMessageHeader,
    decodeTransactionShadow
  });
})(typeof globalThis !== "undefined" ? globalThis : self);
