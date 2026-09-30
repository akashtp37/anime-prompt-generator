// Minimal zero-dependency test runner for generator.js (09-testing-and-validation.md).
// Usage: node tests/generator.test.mjs

import assert from "node:assert/strict";
import { DATA } from "../js/data.js";
import {
  makeCharacterPrompt,
  makePlacePrompt,
  makeRandom,
  generatePrompt,
  GeneratorError,
  MAX_REGEN_ATTEMPTS
} from "../js/generator.js";

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`✔ ${name}`);
  } catch (err) {
    failed += 1;
    console.error(`✘ ${name}\n  ${err.message}`);
  }
}

// ---------- Generator tests ----------

test("character generation returns a prompt with parts", () => {
  const r = makeCharacterPrompt();
  assert.equal(r.mode, "character");
  assert.ok(r.prompt.length > 0);
  assert.ok(r.parts && typeof r.parts === "object");
  assert.ok(r.parts.character && r.parts.outfit && r.parts.pose);
});

test("place generation returns a prompt with parts", () => {
  const r = makePlacePrompt();
  assert.equal(r.mode, "place");
  assert.ok(r.prompt.length > 0);
  assert.ok(r.parts.place && r.parts.mood && r.parts.camera);
});

test("both mode selects character or place", () => {
  const modes = new Set(Array.from({ length: 60 }, () => makeRandom("both").mode));
  assert.ok(modes.has("character") && modes.has("place"));
});

test("character filters restrict the character group", () => {
  for (let i = 0; i < 30; i++) {
    const r = makeCharacterPrompt("female");
    assert.ok(DATA.characters.female.includes(r.parts.character));
    assert.ok(r.prompt.includes("female character"));
  }
});

test("locked parts remain unchanged across regenerations", () => {
  const locks = { pose: "spinning kick", eyes: "intense red eyes" };
  for (let i = 0; i < 20; i++) {
    const r = makeCharacterPrompt("any", locks);
    assert.equal(r.parts.pose, "spinning kick");
    assert.equal(r.parts.eyes, "intense red eyes");
  }
});

test("unlocked parts can change across generations", () => {
  const outfits = new Set(Array.from({ length: 60 }, () => makePlacePrompt().parts.place));
  assert.ok(outfits.size > 1, "expected variety in unlocked slots");
});

test("prompt includes the character style block and a quality tag", () => {
  const r = makeCharacterPrompt();
  assert.ok(r.prompt.includes(DATA.styles.character));
  assert.ok(DATA.quality.some((q) => r.prompt.endsWith(q)));
});

test("prompt includes the place style block", () => {
  const r = makePlacePrompt();
  assert.ok(r.prompt.includes(DATA.styles.place));
});

test("repeated generations vary (randomness)", () => {
  const prompts = new Set(Array.from({ length: 40 }, () => makeCharacterPrompt().prompt));
  assert.ok(prompts.size > 10, "expected many distinct prompts");
});

test("duplicate retry is capped at MAX_REGEN_ATTEMPTS", () => {
  const fixed = { ...DATA };
  // Force a single possible value so every attempt collides with previousPrompt.
  DATA.characters.main = ["Only Hero"];
  DATA.characters.side = ["Only Hero"];
  DATA.characters.female = ["Only Hero"];
  DATA.outfits = ["same outfit"];
  DATA.hair = ["same hair"];
  DATA.eyes = ["same eyes"];
  DATA.expressions = ["same expression"];
  DATA.poses = ["same pose"];
  DATA.gear = ["same gear"];
  DATA.effects = ["same effect"];
  DATA.labels = ["SAME"];
  DATA.quality = ["masterpiece"];

  const r = generatePrompt({
    mode: "character",
    type: "main",
    previousPrompt:
      "Only Hero, main character, same outfit, same hair, same eyes, same expression, " +
      "same pose, same gear, same effect, handwritten label \"SAME\", " +
      `${DATA.styles.character}, masterpiece`
  });
  assert.equal(r.attempts, MAX_REGEN_ATTEMPTS);
  assert.equal(r.prompt, "Only Hero, main character, same outfit, same hair, same eyes, same expression, " +
    "same pose, same gear, same effect, handwritten label \"SAME\", " +
    `${DATA.styles.character}, masterpiece`);

  Object.assign(DATA, fixed); // restore
});

test("empty arrays are handled with GeneratorError", () => {
  const original = DATA.outfits;
  DATA.outfits = [];
  assert.throws(() => makeCharacterPrompt(), GeneratorError);
  assert.throws(
    () => makeCharacterPrompt(),
    /Unable to generate this category\. Please add data to the selected list\./
  );
  DATA.outfits = original;
});

test("invalid character type falls back to any", () => {
  const r = makeCharacterPrompt("not-a-group");
  assert.ok(["main", "side", "female"].includes(r.type));
});

test("quality tag is never duplicated by the style block", () => {
  const count = (haystack, needle) => haystack.split(needle).length - 1;
  for (let i = 0; i < 50; i++) {
    const character = makeCharacterPrompt();
    const place = makePlacePrompt();
    const characterTag = character.prompt.split(", ").pop();
    const placeTag = place.prompt.split(", ").pop();
    assert.equal(count(character.prompt, characterTag), 1, `duplicated "${characterTag}"`);
    assert.equal(count(place.prompt, placeTag), 1, `duplicated "${placeTag}"`);
  }
});

test("readability: prompt is comma-separated and understandable", () => {
  const r = makeRandom("both");
  assert.ok(!r.prompt.includes(",,"));
  assert.ok(!r.prompt.startsWith(","));
  assert.ok(!r.prompt.endsWith(","));
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
