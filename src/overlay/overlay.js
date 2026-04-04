(function bootstrapSignSafeOverlay() {
  const CONSTANTS = globalThis.SIGNSAFE_SHARED?.constants || {};
  const HELPERS = globalThis.SIGNSAFE_SHARED?.overlayHelpers || {};
  const CHANNEL = CONSTANTS.OVERLAY_CHANNEL || "SIGNSAFE_OVERLAY";
  const OVERLAY_MESSAGE_TYPES = CONSTANTS.MESSAGE_TYPES?.OVERLAY || {};
  const DEBUG_STORAGE_KEY = CONSTANTS.DEBUG_STORAGE_KEY || "signsafe-debug";
  const DEBUG = isDebugEnabled();

  const normalizeFacts = HELPERS.normalizeFacts || ((verdict) => verdict?.facts || {});
  const normalizeArray = HELPERS.normalizeArray || ((value) => (Array.isArray(value) ? value : []));
  const SAFE_RISKS = ["safe", "review", "danger"];
  const normalizeRisk = HELPERS.normalizeRisk || ((value) => (SAFE_RISKS.includes(value) ? value : "review"));
  const formatSolChanges = HELPERS.formatSolChanges || ((items) => String(items || ""));
  const formatTokenChanges = HELPERS.formatTokenChanges || ((items) => String(items || ""));
  const formatPrograms = HELPERS.formatPrograms || ((items) => String(items || ""));
  const formatMessagePreview = HELPERS.formatMessagePreview || ((value) => String(value || ""));
  const summarizeBatchFacts = HELPERS.summarizeBatchFacts || (() => ({}));
  const phaseLabel = HELPERS.phaseLabel || (() => "Preparing");

  let currentSessionId = null;
  let stepTimerId = null;
  let parentOrigin = null;

  window.addEventListener("message", (event) => {
    const message = event.data;
    if (!message || message.channel !== CHANNEL) {
      return;
    }

    if (!parentOrigin && event.origin) {
      parentOrigin = event.origin;
    }

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

  document.getElementById("btn-block").addEventListener("click", () => {
    emitDecision(false, currentSessionId);
  });

  document.getElementById("btn-proceed").addEventListener("click", () => {
    emitDecision(true, currentSessionId);
  });

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

  function renderLoading(payload) {
    revealPanel();
    activateState("loading-state");
    setText("loading-phase", phaseLabel(payload.phase));
    setText("loading-title", payload.title || "Analyzing transaction");
    setButtonState({ loading: true });

    const tint = document.getElementById("backdrop-tint");
    if (tint) tint.className = "";

    const stepSimulate = document.getElementById("step-simulate");
    const stepAI = document.getElementById("step-ai");
    if (stepSimulate) stepSimulate.classList.add("active");
    if (stepAI) stepAI.classList.remove("active");
    clearTimeout(stepTimerId);
    stepTimerId = setTimeout(() => {
      if (stepAI) stepAI.classList.add("active");
    }, 1500);
  }

  function renderVerdict(verdict, meta) {
    revealPanel();
    activateState("verdict-state");
    clearTimeout(stepTimerId);

    const risk = normalizeRisk(verdict.risk);

    // Backdrop tint
    const tint = document.getElementById("backdrop-tint");
    if (tint) tint.className = risk === "safe" ? "" : risk;

    const facts = normalizeFacts(verdict);
    const method = facts.intercepted_method || verdict.intercepted_method || verdict.method || "transaction";
    const source = facts.source || verdict.source || "unknown";
    const reasonCodes = normalizeArray(verdict.reason_codes);

    // Risk stamp (merged icon + label)
    const stampEl = document.getElementById("risk-stamp");
    if (stampEl) {
      stampEl.className = risk;
      stampEl.innerHTML = riskStampInner(risk);
    }

    setText("method-badge", method ? `Method: ${method}` : "");
    setText("progress-label", meta && meta.total > 1 ? `Transaction ${meta.current} of ${meta.total}` : "");
    setText("summary", verdict.summary || "Unable to analyze this transaction clearly.");

    // Verdict callout with risk-colored left border
    const verdictTextEl = document.getElementById("verdict-text");
    if (verdictTextEl) {
      verdictTextEl.textContent = verdict.verdict || "Proceed only if you fully understand the transaction.";
      verdictTextEl.className = `verdict-callout ${risk}`;
    }

    renderFacts("facts-grid", facts);
    fillList("actions-list", normalizeArray(verdict.actions), "No visible actions were extracted.");

    const riskReasons = normalizeArray(verdict.risk_reasons);
    const risksSection = document.getElementById("risks-section");
    if (riskReasons.length > 0) {
      risksSection.classList.remove("hidden");
      fillList("risks-list", riskReasons, "");
    } else {
      risksSection.classList.add("hidden");
      fillList("risks-list", [], "");
    }

    setText(
      "debug-meta",
      [
        `Source: ${source}`,
        `Simulation: ${facts.simulation_status || verdict.simulation_status || "unknown"}`,
        `Risk codes: ${reasonCodes.length > 0 ? reasonCodes.join(", ") : "none"}`
      ].join(" | ")
    );
    setText("debug-json", JSON.stringify({ verdict, facts, meta }, null, 2));
    document.getElementById("debug-details").open = false;

    setButtonState({ loading: false, risk });
  }

  function renderBatch(verdicts) {
    revealPanel();
    activateState("batch-state");
    clearTimeout(stepTimerId);

    const tint = document.getElementById("backdrop-tint");
    if (tint) tint.className = "";

    const combinedFacts = summarizeBatchFacts(verdicts);
    const actionItems = verdicts
      .flatMap((verdict) => normalizeArray(verdict.actions))
      .slice(0, 8);
    const unsafeCount = verdicts.filter((verdict) => normalizeRisk(verdict.risk) !== "safe").length;

    setText(
      "batch-summary",
      unsafeCount === 0
        ? `${verdicts.length} transactions look safe overall.`
        : `${unsafeCount} of ${verdicts.length} transactions need review.`
    );
    setText(
      "batch-detail",
      unsafeCount === 0
        ? "SignSafe did not detect suspicious effects in this batch. Review the combined actions below before continuing."
        : "One or more items in this batch need attention. Review the combined facts below before continuing."
    );
    renderFacts("batch-facts-grid", combinedFacts);
    fillList("batch-actions", actionItems, "No suspicious effects were detected during simulation.");
    setText(
      "batch-debug-meta",
      `Source: batch | Risk codes: ${Array.from(new Set(verdicts.flatMap((verdict) => normalizeArray(verdict.reason_codes)))).join(", ") || "none"}`
    );
    setText("batch-debug-json", JSON.stringify({ verdicts, combinedFacts }, null, 2));
    document.getElementById("batch-debug-details").open = false;

    setButtonState({ loading: false, risk: unsafeCount === 0 ? "safe" : "review" });
  }

  function renderFacts(containerId, facts) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    const entries = [];
    if (facts.intercepted_method) entries.push(["Method", facts.intercepted_method]);
    if (facts.simulation_status) entries.push(["Simulation", facts.simulation_status]);
    if (facts.source) entries.push(["Source", facts.source]);
    if (facts.reason_codes && facts.reason_codes.length > 0) entries.push(["Reason codes", facts.reason_codes.join(", ")]);
    if (facts.sol_changes && facts.sol_changes.length > 0) entries.push(["SOL delta", formatSolChanges(facts.sol_changes)]);
    if (facts.token_changes && facts.token_changes.length > 0) entries.push(["Token delta", formatTokenChanges(facts.token_changes)]);
    if (facts.programs && facts.programs.length > 0) entries.push(["Programs", formatPrograms(facts.programs)]);
    if (facts.message_preview) entries.push(["Message preview", formatMessagePreview(facts.message_preview)]);

    const visibleEntries = entries.length > 0 ? entries : [["Facts", "No structured facts were supplied."]];
    for (const [label, value] of visibleEntries) {
      const card = document.createElement("div");
      card.className = `fact-card ${label === "Message preview" || value.length > 120 ? "wide" : ""}`.trim();

      const labelEl = document.createElement("div");
      labelEl.className = "fact-label";
      labelEl.textContent = label;

      const valueEl = document.createElement("div");
      valueEl.className = "fact-value";
      valueEl.textContent = value;

      if (label === "Message preview") {
        valueEl.innerHTML = "";
        const pre = document.createElement("pre");
        pre.textContent = value;
        valueEl.appendChild(pre);
      } else if (typeof value === "string" && value.includes("\n")) {
        valueEl.innerHTML = "";
        for (const line of value.split("\n")) {
          const span = document.createElement("div");
          span.textContent = line;
          valueEl.appendChild(span);
        }
      }

      card.appendChild(labelEl);
      card.appendChild(valueEl);
      container.appendChild(card);
    }
  }

  function fillList(id, items, fallback) {
    const list = document.getElementById(id);
    list.innerHTML = "";

    const values = Array.isArray(items) && items.length > 0 ? items : fallback ? [fallback] : [];
    for (const value of values) {
      const item = document.createElement("li");
      item.textContent = value;
      list.appendChild(item);
    }
  }

  function riskStampInner(risk) {
    const icons = {
      safe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,12 9,17 20,6"/></svg>`,
      review: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="9" x2="12" y2="13"/><circle cx="12" cy="17" r="1.2" fill="currentColor"/></svg>`,
      danger: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>`
    };
    const labels = { safe: "Safe", review: "Review", danger: "Danger" };
    return `${icons[risk] || icons.review}<span>${labels[risk] || "Review"}</span>`;
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = value || "";
  }

  function setButtonState({ loading, risk }) {
    const proceed = document.getElementById("btn-proceed");
    const block = document.getElementById("btn-block");
    const buttons = document.getElementById("buttons");

    if (loading) {
      proceed.disabled = true;
      proceed.className = "";
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
      // Danger: Block is primary, Proceed is demoted
      block.className = "danger-primary";
      block.textContent = "Block";
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

  function activateState(activeId) {
    for (const state of document.querySelectorAll(".state")) {
      state.classList.toggle("hidden", state.id !== activeId);
    }
  }

  function revealPanel() {
    const panel = document.getElementById("panel");
    if (!panel) return;
    requestAnimationFrame(() => {
      panel.classList.add("visible");
    });
  }

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
