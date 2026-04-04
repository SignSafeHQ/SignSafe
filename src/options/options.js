const apiKeyInput = document.getElementById("api-key");
const toggleKeyBtn = document.getElementById("toggle-key");
const eyeIcon = document.getElementById("eye-icon");
const statusEl = document.getElementById("status");
const saveButton = document.getElementById("save");

const STORAGE_KEYS = globalThis.SIGNSAFE_SHARED?.constants?.STORAGE_KEYS || {};
const API_KEY_STORAGE_KEY = STORAGE_KEYS.OPENAI_API_KEY || "openai_api_key";

const EYE_OPEN = `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>`;
const EYE_CLOSED = `<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>`;

restore();
saveButton.addEventListener("click", save);
toggleKeyBtn.addEventListener("click", toggleKeyVisibility);

async function restore() {
  const stored = await chrome.storage.local.get(API_KEY_STORAGE_KEY);
  apiKeyInput.value = stored?.[API_KEY_STORAGE_KEY] || "";
}

async function save() {
  const key = apiKeyInput.value.trim();
  await chrome.storage.local.set({ [API_KEY_STORAGE_KEY]: key });
  showStatus(
    key ? "success" : "error",
    key ? "Key saved. Live analysis is ready." : "Key cleared. Analysis will be unavailable."
  );
}

function toggleKeyVisibility() {
  const isHidden = apiKeyInput.type === "password";
  apiKeyInput.type = isHidden ? "text" : "password";
  eyeIcon.innerHTML = isHidden ? EYE_CLOSED : EYE_OPEN;
  toggleKeyBtn.setAttribute("aria-label", isHidden ? "Hide API key" : "Show API key");
}

function showStatus(type, message) {
  const icon = type === "success"
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
  statusEl.innerHTML = `${icon}<span>${message}</span>`;
  statusEl.className = type;
}
