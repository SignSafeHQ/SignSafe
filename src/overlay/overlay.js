(function bootstrapSignSafeOverlay() {
  const CONSTANTS = globalThis.SIGNSAFE_SHARED?.constants || {};
  const HELPERS = globalThis.SIGNSAFE_SHARED?.overlayHelpers || {};
  const CHANNEL = CONSTANTS.OVERLAY_CHANNEL || "SIGNSAFE_OVERLAY";
  const OVERLAY_MESSAGE_TYPES = CONSTANTS.MESSAGE_TYPES?.OVERLAY || {};
  const DEBUG_STORAGE_KEY = CONSTANTS.DEBUG_STORAGE_KEY || "signsafe-debug";
  const DEBUG = isDebugEnabled();

  const normalizeFacts = HELPERS.normalizeFacts || ((v) => v?.facts || {});
  const normalizeArray = HELPERS.normalizeArray || ((v) => (Array.isArray(v) ? v : []));
  const normalizeRisk = HELPERS.normalizeRisk || ((v) => (["safe", "review", "danger"].includes(v) ? v : "review"));
  const summarizeBatchFacts = HELPERS.summarizeBatchFacts || (() => ({}));

  let currentSessionId = null;
  let currentRisk = null;
  let currentOrigin = null;
  let startTime = null;
  let parentOrigin = null;
  let advOpen = false;

  // ─── Message handling ─────────────────────────────────────────────────────

  window.addEventListener("message", (event) => {
    const message = event.data;
    if (!message || message.channel !== CHANNEL) return;

    if (!parentOrigin && event.origin) parentOrigin = event.origin;

    debugLog("received", message.type, message.sessionId);
    currentSessionId = message.sessionId;
    revealPanel();

    if (message.type === (OVERLAY_MESSAGE_TYPES.SHOW_LOADING || "SHOW_LOADING")) {
      renderLoading(message.payload || {});
      return;
    }

    if (message.type === (OVERLAY_MESSAGE_TYPES.SHOW_VERDICT || "SHOW_VERDICT")) {
      renderVerdict(message.payload?.verdict || {}, message.payload?.meta || {});
      return;
    }

    if (message.type === (OVERLAY_MESSAGE_TYPES.SHOW_BATCH || "SHOW_BATCH")) {
      renderBatch(Array.isArray(message.payload?.verdicts) ? message.payload.verdicts : []);
    }
  });

  // ─── Button wiring ────────────────────────────────────────────────────────

  document.getElementById("btn-block").addEventListener("click", () => {
    emitDecision(false, currentSessionId);
  });

  document.getElementById("btn-proceed").addEventListener("click", () => {
    if (currentRisk === "review" || currentRisk === "danger") {
      showConfirmOverlay();
    } else {
      emitDecision(true, currentSessionId);
    }
  });

  document.getElementById("btn-confirm-back").addEventListener("click", hideConfirmOverlay);

  document.getElementById("btn-confirm-proceed").addEventListener("click", () => {
    hideConfirmOverlay();
    emitDecision(true, currentSessionId);
  });

  document.getElementById("adv-toggle").addEventListener("click", toggleAdvContent);

  document.getElementById("danger-check").addEventListener("change", (e) => {
    const btn = document.getElementById("btn-sign-anyway");
    btn.classList.toggle("enabled", e.target.checked);
    btn.disabled = !e.target.checked;
  });

  document.getElementById("btn-sign-anyway").addEventListener("click", () => {
    emitDecision(true, currentSessionId);
  });

  // ─── Render functions ─────────────────────────────────────────────────────

  function renderLoading(payload) {
    startTime = Date.now();
    currentRisk = null;
    currentOrigin = payload.origin || null;

    setRiskState("scan");
    hideElement("risk-headline");
    showElement("rh-loading");
    hideElement("verdict-callout");
    hideElement("adv-toggle");
    hideElement("adv-content");
    hideElement("wallet-chip");
    hideElement("batch-area");
    showActionListSkeletons();

    const tint = document.getElementById("backdrop-tint");
    if (tint) tint.className = "";

    setText("kicker-text", "Analyzing transaction");
    setText("site-chip-text", currentOrigin || "analyzing…");

    setButtonState({ loading: true });
  }

  function renderVerdict(verdict, meta) {
    const risk = normalizeRisk(verdict.risk);
    currentRisk = risk;

    const facts = normalizeFacts(verdict);
    const method = facts.intercepted_method || verdict.intercepted_method || verdict.method || "transaction";

    setRiskState(risk);
    hideElement("rh-loading");
    showElement("risk-headline");
    hideElement("batch-area");

    // Backdrop tint
    const tint = document.getElementById("backdrop-tint");
    if (tint) tint.className = risk === "safe" ? "" : risk;

    // Panel shake on danger
    if (risk === "danger") {
      const panel = document.getElementById("panel");
      panel.classList.remove("shake");
      void panel.offsetWidth;
      panel.classList.add("shake");
      setTimeout(() => panel.classList.remove("shake"), 400);
    }

    // Risk kicker text
    const kickers = { safe: "No risk detected", review: "Review recommended", danger: "Threat detected" };
    setText("kicker-text", kickers[risk] || "Analysis complete");

    // Headline (DM Serif Display)
    setText("risk-headline", verdict.summary || "Unable to analyze this transaction clearly.");

    // Site chip
    setText("site-chip-text", currentOrigin || "—");

    // Action rows
    renderActionRows(verdict, facts, risk);

    // Advanced options (danger only)
    if (risk === "danger") {
      showElement("adv-toggle");
      advOpen = false;
      document.getElementById("adv-toggle").classList.remove("open");
      document.getElementById("adv-toggle").setAttribute("aria-expanded", "false");
      hideElement("adv-content");
      document.getElementById("adv-content").classList.remove("show");
      document.getElementById("danger-check").checked = false;
      const signAnyway = document.getElementById("btn-sign-anyway");
      signAnyway.classList.remove("enabled");
      signAnyway.disabled = true;
    } else {
      hideElement("adv-toggle");
      hideElement("adv-content");
    }

    // Debug
    setText("debug-meta", [
      `Method: ${method}`,
      `Sim: ${facts.simulation_status || "unknown"}`,
      `Codes: ${normalizeArray(verdict.reason_codes).join(", ") || "none"}`
    ].join(" · "));
    setText("debug-json", JSON.stringify({ verdict, facts, meta }, null, 2));
    document.getElementById("debug-details").open = false;

    setButtonState({ loading: false, risk });
  }

  function renderBatch(verdicts) {
    currentRisk = "safe";

    setRiskState("safe");
    hideElement("rh-loading");
    hideElement("risk-headline");
    hideElement("adv-toggle");
    hideElement("adv-content");

    const tint = document.getElementById("backdrop-tint");
    if (tint) tint.className = "";

    const unsafeCount = verdicts.filter((v) => normalizeRisk(v.risk) !== "safe").length;

    setText("kicker-text", "Batch analysis complete");
    setText("risk-headline", "");

    // Populate batch area instead of action list
    showElement("batch-area");
    document.getElementById("batch-area").classList.add("show");
    document.getElementById("action-list").innerHTML = "";

    setText("batch-summary",
      unsafeCount === 0
        ? `${verdicts.length} transactions look safe overall.`
        : `${unsafeCount} of ${verdicts.length} transactions need review.`
    );
    setText("batch-detail",
      unsafeCount === 0
        ? "SignSafe did not detect suspicious effects in this batch."
        : "One or more items in this batch need attention."
    );

    const actionItems = verdicts.flatMap((v) => normalizeArray(v.actions)).slice(0, 6);
    const batchList = document.getElementById("batch-actions");
    batchList.innerHTML = "";
    for (const text of actionItems) {
      const li = document.createElement("li");
      li.textContent = text;
      batchList.appendChild(li);
    }


    setText("debug-json", JSON.stringify({ verdicts }, null, 2));
    document.getElementById("debug-details").open = false;

    setButtonState({ loading: false, risk: unsafeCount === 0 ? "safe" : "review" });
  }

  // ─── Action row rendering ─────────────────────────────────────────────────

  function renderActionRows(verdict, facts, risk) {
    const list = document.getElementById("action-list");
    list.innerHTML = "";

    // Choose which items to show based on risk
    const riskReasons = normalizeArray(verdict.risk_reasons);
    const actions = normalizeArray(verdict.actions);

    let rows = [];

    if (risk === "danger") {
      // Show risk reasons with danger icons first
      rows = riskReasons.slice(0, 3).map((text) => ({ text, icon: "ico-d", svgType: "x" }));
      // Then actions with neutral icons
      const remaining = 4 - rows.length;
      rows.push(...actions.slice(0, remaining).map((text) => ({ text, icon: "ico-n", svgType: "arrow" })));
    } else if (risk === "review") {
      // Show risk reasons with warn icons
      rows = riskReasons.slice(0, 2).map((text) => ({ text, icon: "ico-w", svgType: "warn" }));
      // Then actions
      const remaining = 4 - rows.length;
      rows.push(...actions.slice(0, remaining).map((text) => ({ text, icon: "ico-n", svgType: "arrow" })));
    } else {
      // safe — show actions with safe icons
      rows = actions.slice(0, 4).map((text) => ({ text, icon: "ico-s", svgType: "check" }));
    }

    // If we have sol/token data, prepend a summary row
    const solSummary = buildSolSummary(facts.sol_changes || []);
    if (solSummary && rows.length < 4) {
      rows.unshift({ text: solSummary, icon: risk === "safe" ? "ico-s" : "ico-w", svgType: risk === "safe" ? "check" : "warn" });
      rows = rows.slice(0, 4);
    }

    if (rows.length === 0) {
      rows = [{ text: "No detailed breakdown is available for this transaction.", icon: "ico-n", svgType: "arrow" }];
    }

    for (const row of rows) {
      list.appendChild(buildActionRow(row.text, row.icon, row.svgType));
    }
  }

  function buildActionRow(text, iconClass, svgType) {
    const row = document.createElement("div");
    row.className = "a-row";

    const iconEl = document.createElement("div");
    iconEl.className = `a-icon ${iconClass}`;
    iconEl.innerHTML = iconSvg(svgType);

    const body = document.createElement("div");
    body.className = "a-body";
    body.textContent = text;

    row.appendChild(iconEl);
    row.appendChild(body);
    return row;
  }

  function iconSvg(type) {
    const icons = {
      check: `<svg viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 5.5l2.5 2.5 4.5-4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
      warn:  `<svg viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5.5 2v4M5.5 8v.5" stroke-linecap="round"/></svg>`,
      x:     `<svg viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 2l7 7M9 2L2 9" stroke-linecap="round"/></svg>`,
      arrow: `<svg viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M2 5.5h7M6 3l3 2.5L6 8" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    };
    return icons[type] || icons.arrow;
  }

  function buildSolSummary(solChanges) {
    if (!solChanges || solChanges.length === 0) return "";
    let out = 0;
    let inbound = 0;
    for (const item of solChanges) {
      const delta = Number(item.deltaSol ?? item.changeSOL ?? 0);
      if (delta < 0) out += Math.abs(delta);
      if (delta > 0) inbound += delta;
    }
    const parts = [];
    if (out > 0) parts.push(`Send ${trimAmount(out)} SOL`);
    if (inbound > 0) parts.push(`Receive ${trimAmount(inbound)} SOL`);
    return parts.join(" · ");
  }

  function showActionListSkeletons() {
    const list = document.getElementById("action-list");
    list.innerHTML = `
      <div class="a-row skel-row">
        <div class="a-icon ico-n"><svg viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="5.5" cy="5.5" r="4"/><path d="M5.5 2v3.5l2 2" stroke-linecap="round"/></svg></div>
        <div class="a-body"><div class="skel skel-body"></div></div>
      </div>
      <div class="a-row skel-row">
        <div class="a-icon ico-n"><svg viewBox="0 0 11 11" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="5.5" cy="5.5" r="4"/><path d="M5.5 2v3.5l2 2" stroke-linecap="round"/></svg></div>
        <div class="a-body"><div class="skel skel-body-short"></div></div>
      </div>
    `;
  }

  // ─── State helpers ────────────────────────────────────────────────────────

  function setRiskState(risk) {
    const panel = document.getElementById("panel");
    panel.classList.remove("state-scan", "state-safe", "state-review", "state-danger");
    panel.classList.add(`state-${risk}`);
  }

  function setButtonState({ loading, risk }) {
    const proceed = document.getElementById("btn-proceed");
    const block = document.getElementById("btn-block");
    const buttons = document.getElementById("buttons");

    if (loading) {
      proceed.disabled = true;
      proceed.className = "";
      proceed.textContent = "Analyzing…";
      block.disabled = false;
      block.className = "";
      block.textContent = "Cancel";
      if (buttons) buttons.removeAttribute("data-risk");
      return;
    }

    const r = normalizeRisk(risk);

    block.disabled = false;
    proceed.disabled = false;

    if (r === "danger") {
      block.className = "danger-primary";
      block.textContent = "Block this transaction";
      proceed.className = "danger";
      proceed.textContent = "Proceed anyway";
      if (buttons) buttons.setAttribute("data-risk", "danger");
    } else {
      block.className = "";
      block.textContent = "Block";
      proceed.className = r;
      proceed.textContent = "Proceed";
      if (buttons) buttons.removeAttribute("data-risk");
    }
  }

  // ─── Confirm overlay ──────────────────────────────────────────────────────

  function showConfirmOverlay() {
    const overlay = document.getElementById("confirm-overlay");
    overlay.classList.remove("hidden");
    document.getElementById("btn-confirm-back").focus();
  }

  function hideConfirmOverlay() {
    document.getElementById("confirm-overlay").classList.add("hidden");
  }

  // ─── Advanced toggle (danger) ─────────────────────────────────────────────

  function toggleAdvContent() {
    advOpen = !advOpen;
    const content = document.getElementById("adv-content");
    const btn = document.getElementById("adv-toggle");
    content.classList.toggle("show", advOpen);
    content.classList.toggle("hidden", !advOpen);
    btn.classList.toggle("open", advOpen);
    btn.setAttribute("aria-expanded", String(advOpen));
  }

  // ─── Decision emit ────────────────────────────────────────────────────────

  function emitDecision(approved, sessionId) {
    debugLog("decision", approved, sessionId);
    window.parent.postMessage(
      {
        channel: CHANNEL,
        sessionId,
        type: OVERLAY_MESSAGE_TYPES.DECISION || "DECISION",
        approved
      },
      parentOrigin || "*"
    );
  }

  // ─── Panel reveal ─────────────────────────────────────────────────────────

  function revealPanel() {
    const panel = document.getElementById("panel");
    if (!panel) return;
    requestAnimationFrame(() => panel.classList.add("visible"));
  }

  // ─── DOM helpers ──────────────────────────────────────────────────────────

  function setText(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === "intercept-text") {
      el.innerHTML = value || "";
    } else {
      el.textContent = value || "";
    }
  }

  function showElement(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("hidden");
  }

  function hideElement(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add("hidden");
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function trimAmount(value) {
    const n = Number(value || 0);
    return Number.isInteger(n) ? String(n) : n.toFixed(4).replace(/\.?0+$/, "");
  }

  // ─── Debug ────────────────────────────────────────────────────────────────

  function debugLog(...args) {
    if (!DEBUG) return;
    console.log("[SignSafe overlay]", ...args);
  }

  function isDebugEnabled() {
    try {
      return Boolean(window.__SIGNSAFE_DEBUG__) || localStorage.getItem(DEBUG_STORAGE_KEY) === "1";
    } catch (_error) {
      return false;
    }
  }
})();
