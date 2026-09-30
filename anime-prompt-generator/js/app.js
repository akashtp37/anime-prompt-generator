// app.js — DOM events, application state, clipboard, history, favorites,
// localStorage, rendering, themes, and error handling.
// (see 07-ui-and-theme.md, 08-storage-and-accessibility.md)

import { DATA, CHARACTER_SLOTS, PLACE_SLOTS } from "./data.js";
import { generatePrompt, GeneratorError, MAX_REGEN_ATTEMPTS } from "./generator.js";
import { getTarget, buildTargetUrl } from "./ai-targets.js";
import { CONCEPT_SEEDS, EVOLUTION_ARCHETYPES, TYPE_NAMES } from "./evolution-data.js";
import { EvolutionPromptGenerator } from "./evolution-generator.js";

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
  mode: "characters", // "characters" | "places" | "evolution" | "both"
  characterFilter: "all", // "all" | "main" | "side" | "female"
  currentPrompt: "",
  currentParts: {},
  currentMode: null, // actual prompt mode of the current generation ("character" | "place")
  lockedSlots: {},
  history: [],
  favorites: [],
  currentEvolution: null,
  evolutionSeedId: null,
  evolutionFamilyLocks: {
    type: false,
    palette: false,
    eyeColor: false,
    anchorMotif: false,
    bodyPlan: false,
    material: false
  },
  evolutionStageLocks: {},
  appearance: "system", // "light" | "dark" | "system"
  darkLightOverride: null
};

const HISTORY_LIMIT = 10;
const evolutionGenerator = new EvolutionPromptGenerator();

const FAMILY_LOCKS = [
  { key: "type", label: "Type" },
  { key: "palette", label: "Palette" },
  { key: "eyeColor", label: "Eye color" },
  { key: "anchorMotif", label: "Anchor motif" },
  { key: "bodyPlan", label: "Body plan" },
  { key: "material", label: "Material" }
];

const STAGE_LOCKS = [
  { key: "pose", label: "Pose" },
  { key: "expression", label: "Expression" },
  { key: "motifDetail", label: "Stage motif" }
];

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
    "themeStatus",
    "skipLink",
    "promptDisplay",
    "evolutionControls",
    "evolutionType",
    "evolutionPrimaryType",
    "evolutionSecondaryType",
    "randomizeConceptBtn",
    "conceptSeedStatus",
    "evolutionGenerateBtn",
    "evolutionResults",
    "evolutionStatus",
    "evolutionEmpty",
    "evolutionContent",
    "evolutionFamilySummary",
    "familyLockControls",
    "evolutionStageCards",
    "evolutionFullSheetPrompt",
    "evolutionDexPrompt",
    "favoriteEvolutionBtn"
  ].forEach((id) => {
    els[id] = $(id);
  });
  els.promptDisplay = $("prompt-display");
  els.modeRadios = Array.from(document.querySelectorAll('input[name="mode"]'));
  els.filterRadios = Array.from(document.querySelectorAll('input[name="characterFilter"]'));
  els.evolutionStageRadios = Array.from(document.querySelectorAll('input[name="evolutionStages"]'));
  els.aiTargets = Array.from(document.querySelectorAll("[data-ai-target]"));
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
  const themeByMode = {
    characters: "character",
    places: "place",
    evolution: "evolution",
    both: "both"
  };
  document.documentElement.dataset.modeTheme = themeByMode[appState.mode] ?? "both";

  const filterField = $("characterFilterFieldset");
  if (filterField) {
    filterField.disabled = appState.mode === "places" || appState.mode === "evolution";
    filterField.hidden = appState.mode === "evolution";
  }
}

function selectedEvolutionStageCount() {
  return Number(els.evolutionStageRadios.find((radio) => radio.checked)?.value ?? 3);
}

function setSelectOptions(select, options, selectedValue) {
  if (!select) return;
  select.textContent = "";
  options.forEach(({ value, label }) => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.appendChild(option);
  });
  select.value = options.some((option) => option.value === selectedValue)
    ? selectedValue
    : options[0]?.value ?? "";
}

function updateEvolutionTypeOptions() {
  if (!els.evolutionType) return;
  const stageCount = selectedEvolutionStageCount();
  const selected = els.evolutionType.value || "random";
  const options = [
    { value: "random", label: "Random" },
    ...EVOLUTION_ARCHETYPES
      .filter((archetype) => archetype.totalStages === stageCount)
      .map((archetype) => ({ value: archetype.id, label: archetype.name }))
  ];
  setSelectOptions(els.evolutionType, options, selected);
}

function initializeEvolutionControls() {
  updateEvolutionTypeOptions();
  setSelectOptions(els.evolutionPrimaryType, [
    { value: "random", label: "Random" },
    ...TYPE_NAMES.map((type) => ({ value: type, label: type }))
  ], "random");
  setSelectOptions(els.evolutionSecondaryType, [
    { value: "none", label: "None" },
    { value: "random", label: "Random" },
    ...TYPE_NAMES.map((type) => ({ value: type, label: type }))
  ], "random");
}

function syncModePanels() {
  const evolutionMode = appState.mode === "evolution";
  if (els.evolutionControls) els.evolutionControls.hidden = !evolutionMode;
  if (els.promptDisplay) els.promptDisplay.hidden = evolutionMode;
  if (els.evolutionResults) els.evolutionResults.hidden = !evolutionMode;
  if (els.generateBtn) els.generateBtn.hidden = evolutionMode;
  if (els.evolutionGenerateBtn) els.evolutionGenerateBtn.hidden = !evolutionMode;
  if (els.skipLink) {
    els.skipLink.href = evolutionMode ? "#evolutionResults" : "#prompt-display";
    els.skipLink.textContent = evolutionMode ? "Skip to evolution prompts" : "Skip to prompt";
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
  const statusTarget = appState.mode === "evolution" ? els.evolutionStatus : els.copyStatus;
  if (statusTarget) statusTarget.textContent = message;
  if (message) {
    window.clearTimeout(setStatus._t);
    setStatus._t = window.setTimeout(() => {
      if (els.copyStatus) els.copyStatus.textContent = "";
      if (els.evolutionStatus) els.evolutionStatus.textContent = "";
    }, 3000);
  }
}

function savedEntryPrompt(entry) {
  return entry.mode === "evolution"
    ? entry.data?.fullSheetPrompt ?? ""
    : entry.prompt ?? "";
}

function savedEntryLabel(entry, index, collectionName) {
  if (entry.mode !== "evolution" || !entry.data) {
    return entry.prompt ?? "Saved prompt";
  }
  const names = entry.data.stages?.map((stage) => stage.names?.english).filter(Boolean) ?? [];
  const familyName = names.join(" → ") || "Evolution line";
  const type = entry.data.sharedTraits?.secondaryType
    ? entry.data.sharedTraits.primaryType + "/" + entry.data.sharedTraits.secondaryType
    : entry.data.sharedTraits?.primaryType ?? "Creature";
  return collectionName + " evolution " + (index + 1) + ": " + familyName + " · " + type;
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
      const savedPrompt = savedEntryPrompt(entry);
      btn.textContent = savedEntryLabel(entry, index, "History");
      btn.title = entry.mode === "evolution" ? "Restore this complete evolution line" : "Click to reuse this prompt";
      btn.setAttribute("aria-label", `Reuse history prompt ${index + 1}: ${btn.textContent}`);
      btn.addEventListener("click", () => reusePrompt(entry));

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "entry-action";
      copyBtn.textContent = "Copy";
      copyBtn.setAttribute("aria-label", entry.mode === "evolution" ? "Copy full evolution sheet prompt" : "Copy history prompt");
      copyBtn.addEventListener("click", () => copyText(savedPrompt, copyBtn));

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
      const savedPrompt = savedEntryPrompt(entry);
      btn.textContent = savedEntryLabel(entry, index, "Favorite");
      btn.title = entry.mode === "evolution" ? "Restore this complete evolution line" : "Click to reuse this prompt";
      btn.setAttribute("aria-label", `Reuse favorite prompt ${index + 1}: ${btn.textContent}`);
      btn.addEventListener("click", () => reusePrompt(entry));

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "entry-action";
      copyBtn.textContent = "Copy";
      copyBtn.setAttribute("aria-label", entry.mode === "evolution" ? "Copy full evolution sheet prompt" : "Copy favorite prompt");
      copyBtn.addEventListener("click", () => copyText(savedPrompt, copyBtn));

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

// ---------- AI chat targets ----------

/** Point every "Send to ..." link at the current prompt. */
function renderAiTargets() {
  const hasPrompt = Boolean(appState.currentPrompt);

  els.aiTargets.forEach((link) => {
    const target = getTarget(link.dataset.aiTarget);
    if (!target) return;

    link.href = buildTargetUrl(target.id, appState.currentPrompt);
    link.setAttribute("aria-disabled", String(!hasPrompt));
    link.classList.toggle("is-disabled", !hasPrompt);

    if (!hasPrompt) {
      link.title = "Generate a prompt first";
    } else {
      link.title = target.prefill
        ? `Open ${target.name} with this prompt`
        : `Open ${target.name} (prompt copied to your clipboard)`;
    }
  });
}

/** Open an AI chat in a new tab, copying the prompt along as a backup. */
async function openInAiChat(target, event) {
  if (!appState.currentPrompt) {
    event.preventDefault(); // checked before any await, so the default action is still cancellable
    setStatus("Generate a prompt first, then send it to an AI chat.");
    return;
  }

  const copied = await writeClipboard(appState.currentPrompt);

  if (target.prefill) {
    setStatus(`Opening ${target.name} with your prompt…`);
  } else if (copied) {
    setStatus(`Prompt copied — paste it into ${target.name} with Ctrl/\u2318 + V.`);
  } else {
    setStatus(
      `Opening ${target.name}. The prompt wasn't copied — use the Copy button above, then paste it there.`
    );
  }
}

function createLockButton({ key, label, locked, family, stageNumber }) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "evolution-lock-button";
  button.textContent = label;
  button.setAttribute("aria-pressed", String(locked));
  button.setAttribute("aria-label", (locked ? "Unlock " : "Lock ") + label.toLowerCase() + " on reroll");
  button.title = locked ? "Keep this value when rerolling" : "Allow this value to change on reroll";
  if (locked) button.classList.add("is-locked");
  if (family) button.dataset.familyLock = key;
  else {
    button.dataset.stageLock = key;
    button.dataset.stageNumber = String(stageNumber);
  }
  return button;
}

function renderEvolutionStageCard(stage, sharedTraits) {
  const card = document.createElement("article");
  card.className = "evolution-stage-card";
  card.setAttribute("role", "listitem");

  const header = document.createElement("div");
  header.className = "evolution-stage-header";
  const stageIndex = document.createElement("p");
  stageIndex.className = "evolution-stage-index";
  stageIndex.textContent = "STAGE " + String(stage.stageNumber).padStart(2, "0");
  const role = document.createElement("span");
  role.className = "evolution-role-badge";
  role.textContent = stage.role;
  header.append(stageIndex, role);

  const name = document.createElement("h3");
  name.className = "evolution-stage-name";
  name.textContent = stage.names.english;
  const japaneseName = document.createElement("p");
  japaneseName.className = "evolution-japanese-name";
  japaneseName.lang = "ja";
  japaneseName.textContent = stage.names.japanese;

  const typeBadges = document.createElement("div");
  typeBadges.className = "evolution-type-badges";
  [sharedTraits.primaryType, sharedTraits.secondaryType].filter(Boolean).forEach((type) => {
    const badge = document.createElement("span");
    badge.className = "evolution-type-badge";
    badge.textContent = type;
    typeBadges.appendChild(badge);
  });

  const flavor = document.createElement("p");
  flavor.className = "evolution-flavor";
  flavor.textContent = stage.flavorText;

  const lockFieldset = document.createElement("fieldset");
  lockFieldset.className = "evolution-stage-locks";
  const lockLegend = document.createElement("legend");
  lockLegend.textContent = "Stage locks";
  const lockRow = document.createElement("div");
  lockRow.className = "evolution-lock-row";
  const stageLockState = appState.evolutionStageLocks[stage.stageNumber] ?? {};
  STAGE_LOCKS.forEach(({ key, label }) => {
    lockRow.appendChild(createLockButton({
      key,
      label,
      locked: Boolean(stageLockState[key]),
      family: false,
      stageNumber: stage.stageNumber
    }));
  });
  lockFieldset.append(lockLegend, lockRow);

  const prompt = document.createElement("pre");
  prompt.className = "evolution-prompt evolution-stage-prompt";
  prompt.textContent = stage.prompt;
  prompt.dataset.evolutionPromptTarget = "stage-" + stage.stageNumber;

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "btn btn-secondary evolution-copy-button";
  copyButton.textContent = "Copy Stage " + stage.stageNumber;
  copyButton.dataset.copyEvolution = "stage";
  copyButton.dataset.stageNumber = String(stage.stageNumber);
  copyButton.setAttribute("aria-label", "Copy stage " + stage.stageNumber + " prompt");

  card.append(header, name, japaneseName, typeBadges, flavor, lockFieldset, prompt, copyButton);
  return card;
}

function renderEvolutionResults() {
  if (!els.evolutionResults) return;
  const line = appState.currentEvolution;
  const hasLine = Boolean(line?.stages?.length);
  els.evolutionEmpty.hidden = hasLine;
  els.evolutionContent.hidden = !hasLine;
  els.favoriteEvolutionBtn.disabled = !hasLine;
  els.familyLockControls.textContent = "";
  els.evolutionStageCards.textContent = "";
  if (!hasLine) {
    els.evolutionPrimaryType.disabled = false;
    els.evolutionSecondaryType.disabled = false;
    return;
  }

  const shared = line.sharedTraits;
  const concept = line.conceptSeed;
  const typeLabel = shared.secondaryType
    ? shared.primaryType + " / " + shared.secondaryType
    : shared.primaryType;
  els.evolutionFamilySummary.textContent = typeLabel + " family · " + concept.concept + " " +
    concept.animal + " · shared " + shared.primaryColor + " / " + shared.secondaryColor +
    " palette · anchor: " + shared.anchorMotif;
  els.evolutionFullSheetPrompt.textContent = line.fullSheetPrompt;
  els.evolutionDexPrompt.textContent = line.dexPrompt;

  FAMILY_LOCKS.forEach(({ key, label }) => {
    els.familyLockControls.appendChild(createLockButton({
      key,
      label,
      locked: Boolean(appState.evolutionFamilyLocks[key]),
      family: true
    }));
  });
  const typeLocked = Boolean(appState.evolutionFamilyLocks.type);
  els.evolutionPrimaryType.disabled = typeLocked;
  els.evolutionSecondaryType.disabled = typeLocked;

  line.stages.forEach((stage, index) => {
    if (index > 0) {
      const arrow = document.createElement("span");
      arrow.className = "evolution-stage-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";
      els.evolutionStageCards.appendChild(arrow);
    }
    els.evolutionStageCards.appendChild(renderEvolutionStageCard(stage, shared));
  });

  const isFavorite = appState.favorites.some((entry) =>
    entry.mode === "evolution" && (entry.id === line.id || entry.data?.id === line.id)
  );
  els.favoriteEvolutionBtn.textContent = isFavorite ? "Remove Favorite" : "Favorite Evolution";
  els.favoriteEvolutionBtn.setAttribute("aria-pressed", String(isFavorite));
}

function renderAll() {
  setPromptDisplay(appState.currentPrompt);
  renderChips();
  renderLists();
  renderAiTargets();
  renderEvolutionResults();
  applyModeTheme();
  syncModePanels();
  applyAppearance();
}

// ---------- Clipboard ----------

async function writeClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false; // clipboard unavailable (e.g. insecure context)
  }
}

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

async function copyEvolutionPrompt(button) {
  const line = appState.currentEvolution;
  if (!line) return;
  const kind = button.dataset.copyEvolution;
  const stageNumber = Number(button.dataset.stageNumber);
  const stage = line.stages.find((item) => item.stageNumber === stageNumber);
  const text = kind === "full"
    ? line.fullSheetPrompt
    : kind === "dex"
      ? line.dexPrompt
      : stage?.prompt;
  if (!text) return;

  const original = button.textContent;
  let promptElement;
  if (kind === "full") promptElement = els.evolutionFullSheetPrompt;
  else if (kind === "dex") promptElement = els.evolutionDexPrompt;
  else promptElement = els.evolutionStageCards.querySelector(
    '[data-evolution-prompt-target="stage-' + stageNumber + '"]'
  );
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "Copied!";
    setStatus("Evolution prompt copied.");
  } catch {
    setStatus("Copy failed. The prompt has been selected; copy it manually.");
    if (promptElement) {
      const range = document.createRange();
      range.selectNodeContents(promptElement);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  } finally {
    window.setTimeout(() => { button.textContent = original; }, 1500);
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

function pushEvolutionHistory(line) {
  appState.history.unshift({
    id: line.id,
    mode: "evolution",
    timestamp: Date.now(),
    data: line
  });
  if (appState.history.length > HISTORY_LIMIT) appState.history.length = HISTORY_LIMIT;
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

function toggleEvolutionFavorite() {
  const line = appState.currentEvolution;
  if (!line) return;
  const existing = appState.favorites.findIndex((entry) =>
    entry.mode === "evolution" && (entry.id === line.id || entry.data?.id === line.id)
  );
  if (existing >= 0) {
    appState.favorites.splice(existing, 1);
    setStatus("Evolution removed from favorites.");
  } else {
    appState.favorites.unshift({
      id: line.id,
      mode: "evolution",
      timestamp: Date.now(),
      data: line
    });
    setStatus("Evolution added to favorites.");
  }
  saveFavorites();
  renderLists();
  renderEvolutionResults();
}

function reusePrompt(entry) {
  if (entry.mode === "evolution" && entry.data?.stages) {
    appState.currentEvolution = entry.data;
    appState.mode = "evolution";
    appState.evolutionSeedId = null;
    appState.evolutionStageLocks = {};
    FAMILY_LOCKS.forEach(({ key }) => { appState.evolutionFamilyLocks[key] = false; });
    els.modeRadios.forEach((radio) => { radio.checked = radio.value === "evolution"; });
    renderAll();
    setStatus("Complete evolution line restored.");
    return;
  }
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
  if (appState.mode === "evolution") {
    return generateEvolution();
  }

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

function generateEvolution() {
  try {
    const line = evolutionGenerator.generateLine({
      stages: selectedEvolutionStageCount(),
      evolutionType: els.evolutionType.value,
      primaryType: els.evolutionPrimaryType.value,
      secondaryType: els.evolutionSecondaryType.value,
      conceptSeedId: appState.evolutionSeedId,
      previousLine: appState.currentEvolution,
      familyLocks: { ...appState.evolutionFamilyLocks },
      stageLocks: Object.fromEntries(
        Object.entries(appState.evolutionStageLocks).map(([stage, locks]) => [stage, { ...locks }])
      )
    });
    appState.currentEvolution = line;
    appState.evolutionSeedId = null;
    els.conceptSeedStatus.textContent = "Last generated: " + line.conceptSeed.concept + " " +
      line.conceptSeed.animal + ". Randomize to choose a seed for the next line.";
    pushEvolutionHistory(line);
    renderAll();
    setStatus("Generated a coherent " + line.stageCount + "-stage " +
      line.sharedTraits.primaryType + " evolution.");
  } catch (err) {
    setStatus(err instanceof Error ? err.message : "Evolution generation failed. Please try again.");
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
        syncModePanels();
        renderChips();
        renderEvolutionResults();
      }
    });
  });

  els.evolutionStageRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (!radio.checked) return;
      updateEvolutionTypeOptions();
    });
  });

  if (els.evolutionPrimaryType) {
    els.evolutionPrimaryType.addEventListener("change", () => {
      if (els.evolutionSecondaryType.value === els.evolutionPrimaryType.value) {
        els.evolutionSecondaryType.value = "none";
      }
    });
  }
  if (els.evolutionSecondaryType) {
    els.evolutionSecondaryType.addEventListener("change", () => {
      if (els.evolutionSecondaryType.value !== "random" &&
          els.evolutionSecondaryType.value === els.evolutionPrimaryType.value) {
        els.evolutionSecondaryType.value = "none";
      }
    });
  }

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
  if (els.evolutionGenerateBtn) els.evolutionGenerateBtn.addEventListener("click", generate);
  if (els.copyBtn) els.copyBtn.addEventListener("click", () => copyText(appState.currentPrompt, els.copyBtn));
  if (els.favoriteBtn) els.favoriteBtn.addEventListener("click", toggleFavorite);
  if (els.favoriteEvolutionBtn) els.favoriteEvolutionBtn.addEventListener("click", toggleEvolutionFavorite);

  if (els.randomizeConceptBtn) {
    els.randomizeConceptBtn.addEventListener("click", () => {
      const requestedType = els.evolutionPrimaryType.value;
      const compatibleSeeds = requestedType === "random"
        ? CONCEPT_SEEDS
        : CONCEPT_SEEDS.filter((seed) => seed.type === requestedType);
      const choices = compatibleSeeds.length ? compatibleSeeds : CONCEPT_SEEDS;
      const seed = evolutionGenerator.getRandomItem(choices, [appState.currentEvolution?.conceptSeed?.id]);
      appState.evolutionSeedId = seed.id;
      els.conceptSeedStatus.textContent = "Next seed: " + seed.concept + " " + seed.animal +
        " · " + seed.type + " · " + seed.id;
    });
  }

  if (els.familyLockControls) {
    els.familyLockControls.addEventListener("click", (event) => {
      const button = event.target.closest("[data-family-lock]");
      if (!button) return;
      const key = button.dataset.familyLock;
      appState.evolutionFamilyLocks[key] = !appState.evolutionFamilyLocks[key];
      const locked = appState.evolutionFamilyLocks[key];
      button.setAttribute("aria-pressed", String(locked));
      button.setAttribute("aria-label", (locked ? "Unlock " : "Lock ") +
        button.textContent.toLowerCase() + " on reroll");
      button.title = locked ? "Keep this value when rerolling" : "Allow this value to change on reroll";
      button.classList.toggle("is-locked", locked);
      if (key === "type") {
        els.evolutionPrimaryType.disabled = locked;
        els.evolutionSecondaryType.disabled = locked;
      }
    });
  }

  if (els.evolutionStageCards) {
    els.evolutionStageCards.addEventListener("click", (event) => {
      const copyButton = event.target.closest("[data-copy-evolution]");
      if (copyButton) {
        copyEvolutionPrompt(copyButton);
        return;
      }
      const lockButton = event.target.closest("[data-stage-lock]");
      if (!lockButton) return;
      const stageNumber = lockButton.dataset.stageNumber;
      const key = lockButton.dataset.stageLock;
      const stageLocks = appState.evolutionStageLocks[stageNumber] ??= {};
      stageLocks[key] = !stageLocks[key];
      const locked = stageLocks[key];
      lockButton.setAttribute("aria-pressed", String(locked));
      lockButton.setAttribute("aria-label", (locked ? "Unlock " : "Lock ") +
        lockButton.textContent.toLowerCase() + " on reroll");
      lockButton.title = locked ? "Keep this value when rerolling" : "Allow this value to change on reroll";
      lockButton.classList.toggle("is-locked", locked);
    });
  }

  if (els.evolutionResults) {
    els.evolutionResults.addEventListener("click", (event) => {
      const copyButton = event.target.closest('[data-copy-evolution="full"], [data-copy-evolution="dex"]');
      if (copyButton) copyEvolutionPrompt(copyButton);
    });
  }

  els.aiTargets.forEach((link) => {
    const target = getTarget(link.dataset.aiTarget);
    if (!target) return;
    link.addEventListener("click", (event) => openInAiChat(target, event));
  });

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
  initializeEvolutionControls();
  loadState();
  bindEvents();
  renderAll();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
