// generator.js — Random selection, locks, prompt assembly, mode selection,
// duplicate prevention, and validation (see 06-generator-logic.md, 08-errors).

import { DATA } from "./data.js";

export const MAX_REGEN_ATTEMPTS = 5;

const CHARACTER_GROUPS = ["main", "side", "female"];

/** Thrown when a required data category is empty or invalid. */
export class GeneratorError extends Error {
  constructor(message) {
    super(message);
    this.name = "GeneratorError";
  }
}

export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

function mustPick(arr, categoryName) {
  if (!Array.isArray(arr) || arr.length === 0) {
    throw new GeneratorError(
      `Unable to generate this category. Please add data to the selected list. (${categoryName})`
    );
  }
  return pick(arr);
}

/** Pick a quality tag that is not already present in the style block (no duplicate tags). */
function pickQuality(existingText) {
  const options = DATA.quality.filter((tag) => !existingText.includes(tag));
  return mustPick(options.length > 0 ? options : DATA.quality, "quality");
}

function normalizeType(type) {
  if (type && CHARACTER_GROUPS.includes(type)) return type;
  return "any"; // invalid mode fallback (08-errors)
}

// ---------- Character ----------

export function makeCharacterPrompt(type = "any", locks = {}) {
  const normalized = normalizeType(type); // invalid type falls back to "any"
  const group =
    normalized === "any" ? mustPick(CHARACTER_GROUPS, "character types") : normalized;

  const p = {
    character: locks.character ?? mustPick(DATA.characters[group], `characters.${group}`),
    outfit: locks.outfit ?? mustPick(DATA.outfits, "outfits"),
    hair: locks.hair ?? mustPick(DATA.hair, "hair"),
    eyes: locks.eyes ?? mustPick(DATA.eyes, "eyes"),
    expression: locks.expression ?? mustPick(DATA.expressions, "expressions"),
    pose: locks.pose ?? mustPick(DATA.poses, "poses"),
    gear: locks.gear ?? mustPick(DATA.gear, "gear"),
    effect: locks.effect ?? mustPick(DATA.effects, "effects"),
    label: locks.label ?? mustPick(DATA.labels, "labels")
  };

  const prompt = [
    p.character,
    `${group} character`,
    p.outfit,
    p.hair,
    p.eyes,
    p.expression,
    p.pose,
    p.gear,
    p.effect,
    `handwritten label "${p.label}"`,
    DATA.styles.character,
    pickQuality(DATA.styles.character)
  ].join(", ");

  return { mode: "character", type: group, prompt, parts: p };
}

// ---------- Place ----------

export function makePlacePrompt(locks = {}) {
  const p = {
    place: locks.place ?? mustPick(DATA.places, "places"),
    time: locks.time ?? mustPick(DATA.times, "times"),
    weather: locks.weather ?? mustPick(DATA.weather, "weather"),
    mood: locks.mood ?? mustPick(DATA.moods, "moods"),
    camera: locks.camera ?? mustPick(DATA.cameras, "cameras")
  };

  const prompt = [
    p.place,
    p.time,
    p.weather,
    `${p.mood} mood`,
    p.camera,
    DATA.styles.place,
    pickQuality(DATA.styles.place)
  ].join(", ");

  return { mode: "place", prompt, parts: p };
}

// ---------- Both mode ----------

export function makeRandom(mode = "both", type = "any", locks = {}) {
  if (mode === "character") return makeCharacterPrompt(type, locks);
  if (mode === "place") return makePlacePrompt(locks);

  // Both: randomly choose Character OR Place for this generation.
  // Any unrecognized mode falls back to character generation (08-errors).
  if (mode === "both") {
    return Math.random() < 0.5 ? makeCharacterPrompt(type, locks) : makePlacePrompt(locks);
  }
  return makeCharacterPrompt(type, locks);
}

/**
 * Generate with duplicate prevention: retries while the new prompt equals
 * the previous one, up to MAX_REGEN_ATTEMPTS (no infinite loops).
 */
export function generatePrompt({ mode = "both", type = "any", locks = {}, previousPrompt = "" } = {}) {
  let result = makeRandom(mode, type, locks);
  let attempts = 1;

  while (result.prompt === previousPrompt && attempts < MAX_REGEN_ATTEMPTS) {
    result = makeRandom(mode, type, locks);
    attempts += 1;
  }

  return { ...result, attempts };
}
