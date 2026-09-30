// app.js — DOM events, application state, clipboard, history, favorites,
// localStorage, rendering, themes, and error handling.
// (see 07-ui-and-theme.md, 08-storage-and-accessibility.md)

import { DATA, CHARACTER_SLOTS, PLACE_SLOTS } from "./data.js";
import { generatePrompt, GeneratorError, MAX_REGEN_ATTEMPTS } from "./generator.js";

// ---------- Storage (safe against unavailable/invalid localStorage) ----------

const STORAGE_KEYS = {
  history: "animePrompt.history",
  favorites: "animePrompt.favorites",
  preferences: "animePrompt.preferences"
};

function storageGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const value = JSON.parse(raw);
    return value ?? fallback;
  } catch {
    return fallback; // missing keys, invalid JSON, or unavailable storage
  }
}

function storageSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false; // persistence unavailable — generation continues
  }
}

// ---------- Application state ----------

const appState = {
  mode: "characters", // "characters" | "places" | "both"
  characterFilter: "all", // "all" | "main" | "side" | "female"
  currentPrompt: "",
  currentParts: {},
  currentMode: null, // actual prompt mode of the current generation ("character" | "place")
  lockedSlots: {},
  history: [],
  favorites: [],
  appearance: "system", // "light" | "dark" | "system"
  darkLightOverride: null
};

const HISTORY_LIMIT = 10;

// ---------- DOM handles ----------

const $ = (id) => document.getElementById(id);

const els = {};

function cacheDom() {
  [
    "promptOutput",
    "chipRow",
    "generateBtn",
    "copyBtn",
    "favoriteBtn",
    "copyStatus",
    "historyList",
    "favoritesList",
    "clearFavoritesBtn",
    "clearHistoryBtn",
    "appearanceSelect",
    "themeStatus"
  ].forEach((id) => {
    els[id] = $(id);
  });
  els.modeRadios = Array.from(document.querySelectorAll('input[name="mode"]'));
  els.filterRadios = Array.from(document.querySelectorAll('input[name="characterFilter"]'));
}

// ---------- Appearance / themes ----------

function applyAppearance() {
  const prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const resolved =
    appState.appearance === "system" ? (prefersDark ? "dark" : "light") : appState.appearance;

  document.documentElement.dataset.appearance = resolved;
  appState.darkLightOverride = appState.appearance === "system" ? null : appState.appearance;
}

function applyModeTheme() {
  const themeByMode = { characters: "character", places: "place", both: "both" };
  document.documentElement.dataset.modeTheme = themeByMode[appState.mode] ?? "both";

  const filterField = $("characterFilterFieldset");
  if (filterField) {
    filterField.disabled = appState.mode === "places"; // filter only active for character generation
  }
}

// ---------- Rendering ----------

function activeSlots() {
  return appState.currentMode === "place" ? PLACE_SLOTS : CHARACTER_SLOTS;
}

function renderChips() {
  const row = els.chipRow;
  row.textContent = "";

  const slots = activeSlots();
  if (!appState.currentPrompt || Object.keys(appState.currentParts).length === 0) {
    const empty = document.createElement("p");
    empty.className = "chips-empty muted";
    empty.textContent = "Generate a prompt to see and lock its parts.";
    row.appendChild(empty);
    return;
  }

  slots.forEach(({ key, label }) => {
    const value = appState.currentParts[key];
    if (value === undefined) return;

    const chip = document.createElement("div");
    chip.className = "chip";

    const name = document.createElement("span");
    name.className = "chip-label";
    name.textContent = label;

    const val = document.createElement("span");
    val.className = "chip-value";
    val.textContent = value;

    const lockBtn = document.createElement("button");
    lockBtn.type = "button";
    lockBtn.className = "chip-lock";
    const locked = Boolean(appState.lockedSlots[key]);
    lockBtn.textContent = locked ? "🔒" : "🔓";
    lockBtn.setAttribute("aria-label", `${locked ? "Unlock" : "Lock"} ${label.toLowerCase()}`);
    lockBtn.setAttribute("aria-pressed", String(locked));
    lockBtn.addEventListener("click", () => {
      appState.lockedSlots[key] = !appState.lockedSlots[key];
      renderChips();
    });

    chip.append(name, val, lockBtn);
    row.appendChild(chip);
  });
}

function setPromptDisplay(text) {
  els.promptOutput.textContent = text || "Press Generate Prompt to create your first prompt.";
}

function setStatus(message) {
  els.copyStatus.textContent = message;
  if (message) {
    window.clearTimeout(setStatus._t);
    setStatus._t = window.setTimeout(() => {
      els.copyStatus.textContent = "";
    }, 3000);
  }
}

function renderLists() {
  // History (newest first)
  els.historyList.textContent = "";
  if (appState.history.length === 0) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "No history yet.";
    els.historyList.appendChild(li);
  } else {
    appState.history.forEach((entry, index) => {
      const li = document.createElement("li");
      li.className = "entry";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "entry-main";
      btn.textContent = entry.prompt;
      btn.title = "Click to reuse this prompt";
      btn.setAttribute("aria-label", `Reuse history prompt ${index + 1}: ${entry.prompt}`);
      btn.addEventListener("click", () => reusePrompt(entry));

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "entry-action";
      copyBtn.textContent = "Copy";
      copyBtn.setAttribute("aria-label", "Copy history prompt");
      copyBtn.addEventListener("click", () => copyText(entry.prompt, copyBtn));

      li.append(btn, copyBtn);
      els.historyList.appendChild(li);
    });
  }

  // Favorites
  els.favoritesList.textContent = "";
  if (appState.favorites.length === 0) {
    const li = document.createElement("li");
    li.className = "muted";
    li.textContent = "No favorites yet.";
    els.favoritesList.appendChild(li);
  } else {
    appState.favorites.forEach((entry, index) => {
      const li = document.createElement("li");
      li.className = "entry";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "entry-main";
      btn.textContent = entry.prompt;
      btn.title = "Click to reuse this prompt";
      btn.setAttribute("aria-label", `Reuse favorite prompt ${index + 1}: ${entry.prompt}`);
      btn.addEventListener("click", () => reusePrompt(entry));

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "entry-action";
      copyBtn.textContent = "Copy";
      copyBtn.setAttribute("aria-label", "Copy favorite prompt");
      copyBtn.addEventListener("click", () => copyText(entry.prompt, copyBtn));

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "entry-action";
      removeBtn.textContent = "Remove";
      removeBtn.setAttribute("aria-label", "Remove favorite");
      removeBtn.addEventListener("click", () => {
        appState.favorites.splice(index, 1);
        saveFavorites();
        renderLists();
      });

      li.append(btn, copyBtn, removeBtn);
      els.favoritesList.appendChild(li);
    });
  }

  if (els.clearFavoritesBtn) {
    els.clearFavoritesBtn.disabled = appState.favorites.length === 0;
  }
  if (els.clearHistoryBtn) {
    els.clearHistoryBtn.disabled = appState.history.length === 0;
  }
}

function renderAll() {
  setPromptDisplay(appState.currentPrompt);
  renderChips();
  renderLists();
  applyModeTheme();
  applyAppearance();
}

// ---------- Clipboard ----------

async function copyText(text, button) {
  const original = button ? button.textContent : null;
  try {
    await navigator.clipboard.writeText(text);
    if (button) button.textContent = "Copied!";
    else setStatus("Prompt copied!");
  } catch {
    // Fallback: select the output so the user can copy manually.
    setStatus("Copy failed. Please select and copy the prompt manually.");
    if (els.promptOutput && appState.currentPrompt) {
      const range = document.createRange();
      range.selectNodeContents(els.promptOutput);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  } finally {
    if (button && original) {
      window.setTimeout(() => {
        button.textContent = original;
      }, 1500);
    }
  }
}

// ---------- History / favorites ----------

function saveHistory() {
  storageSet(STORAGE_KEYS.history, appState.history);
}

function saveFavorites() {
  storageSet(STORAGE_KEYS.favorites, appState.favorites);
}

function pushHistory(result) {
  appState.history.unshift({
    mode: result.mode,
    prompt: result.prompt,
    parts: result.parts
  });
  if (appState.history.length > HISTORY_LIMIT) {
    appState.history.length = HISTORY_LIMIT; // last 10 prompts, newest first
  }
  saveHistory();
}

function toggleFavorite() {
  if (!appState.currentPrompt) return;

  const existing = appState.favorites.findIndex((f) => f.prompt === appState.currentPrompt);
  if (existing >= 0) {
    appState.favorites.splice(existing, 1); // avoid duplicate favorites
    setStatus("Removed from favorites.");
  } else {
    appState.favorites.unshift({
      mode: appState.currentMode,
      prompt: appState.currentPrompt,
      parts: appState.currentParts
    });
    setStatus("Added to favorites!");
  }
  saveFavorites();
  renderLists();
}

function reusePrompt(entry) {
  appState.currentPrompt = entry.prompt;
  appState.currentParts = { ...(entry.parts || {}) };
  appState.currentMode = entry.mode === "place" ? "place" : "character";
  appState.lockedSlots = {};
  renderAll();
  setStatus("Prompt restored.");
}

// ---------- Generation ----------

function collectLocks() {
  const locks = {};
  Object.entries(appState.lockedSlots).forEach(([key, locked]) => {
    if (locked && appState.currentParts[key] !== undefined) {
      locks[key] = appState.currentParts[key];
    }
  });
  return locks;
}

function generate() {
  const locks = collectLocks();
  try {
    const result = generatePrompt({
      mode: appState.mode === "places" ? "place" : appState.mode === "both" ? "both" : "character",
      type: appState.characterFilter,
      locks,
      previousPrompt: appState.currentPrompt
    });

    appState.currentPrompt = result.prompt;
    appState.currentParts = result.parts;
    appState.currentMode = result.mode;

    pushHistory(result);
    renderAll();
    setStatus(
      result.mode === "place"
        ? `Generated a place prompt${result.attempts > 1 ? ` (retried ${result.attempts - 1}×)` : ""}.`
        : `Generated a ${result.type} character prompt${result.attempts > 1 ? ` (retried ${result.attempts - 1}×)` : ""}.`
    );
  } catch (err) {
    if (err instanceof GeneratorError) {
      setStatus(err.message);
    } else {
      setStatus("Something went wrong while generating. Please try again.");
      console.error(err);
    }
  }
}

// ---------- Events ----------

function bindEvents() {
  els.modeRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        appState.mode = radio.value;
        appState.lockedSlots = {}; // slot sets differ between modes
        applyModeTheme();
        renderChips();
      }
    });
  });

  els.filterRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) appState.characterFilter = radio.value;
    });
  });

  if (els.appearanceSelect) {
    els.appearanceSelect.value = appState.appearance;
    els.appearanceSelect.addEventListener("change", () => {
      appState.appearance = els.appearanceSelect.value;
      storageSet(STORAGE_KEYS.preferences, { appearance: appState.appearance });
      applyAppearance();
    });
  }

  if (els.generateBtn) els.generateBtn.addEventListener("click", generate);
  if (els.copyBtn) els.copyBtn.addEventListener("click", () => copyText(appState.currentPrompt, els.copyBtn));
  if (els.favoriteBtn) els.favoriteBtn.addEventListener("click", toggleFavorite);

  if (els.clearHistoryBtn) {
    els.clearHistoryBtn.addEventListener("click", () => {
      appState.history = [];
      saveHistory();
      renderLists();
    });
  }
  if (els.clearFavoritesBtn) {
    els.clearFavoritesBtn.addEventListener("click", () => {
      appState.favorites = [];
      saveFavorites();
      renderLists();
    });
  }

  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (mq.addEventListener) mq.addEventListener("change", applyAppearance);
  }
}

// ---------- Init ----------

function loadState() {
  appState.history = storageGet(STORAGE_KEYS.history, []);
  if (!Array.isArray(appState.history)) appState.history = [];

  appState.favorites = storageGet(STORAGE_KEYS.favorites, []);
  if (!Array.isArray(appState.favorites)) appState.favorites = [];

  const prefs = storageGet(STORAGE_KEYS.preferences, {});
  if (prefs && ["light", "dark", "system"].includes(prefs.appearance)) {
    appState.appearance = prefs.appearance;
  }
}

function init() {
  cacheDom();
  loadState();
  bindEvents();
  renderAll();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
