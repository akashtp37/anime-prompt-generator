// Minimal zero-dependency test runner for ai-targets.js.
// Usage: node tests/ai-targets.test.mjs

import assert from "node:assert/strict";
import { AI_TARGETS, getTarget, buildTargetUrl } from "../js/ai-targets.js";

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

const PROMPT = "a lone swordsman, sunset field, masterpiece";

// ---------- Target definitions ----------

test("targets cover ChatGPT, Claude, and Gemini with unique ids", () => {
  const ids = AI_TARGETS.map((t) => t.id);
  assert.deepEqual(ids, ["chatgpt", "claude", "gemini"]);
  assert.equal(new Set(ids).size, ids.length);
});

test("every target has a name, an https home page, and a prefill flag", () => {
  AI_TARGETS.forEach((t) => {
    assert.ok(t.name.length > 0, `${t.id} needs a name`);
    assert.ok(t.home.startsWith("https://"), `${t.id} home must be https`);
    assert.equal(typeof t.prefill, "boolean");
  });
});

test("getTarget returns a target by id and undefined otherwise", () => {
  assert.equal(getTarget("chatgpt").name, "ChatGPT");
  assert.equal(getTarget("does-not-exist"), undefined);
});

// ---------- URL building ----------

test("prefill targets carry the prompt in the URL, percent-encoded", () => {
  const chatgpt = buildTargetUrl("chatgpt", PROMPT);
  const claude = buildTargetUrl("claude", PROMPT);

  assert.ok(chatgpt.startsWith("https://chatgpt.com/?q="));
  assert.ok(claude.startsWith("https://claude.ai/new?q="));
  assert.equal(chatgpt, `https://chatgpt.com/?q=${encodeURIComponent(PROMPT)}`);
  assert.equal(claude, `https://claude.ai/new?q=${encodeURIComponent(PROMPT)}`);
});

test("prompts with punctuation and newlines stay in a single query value", () => {
  const messy = 'a "quoted" hero, line 1\nline 2 & more?';
  ["chatgpt", "claude"].forEach((id) => {
    const url = buildTargetUrl(id, messy);
    const query = url.slice(url.indexOf("?q=") + 3);
    assert.equal(decodeURIComponent(query), messy);
    assert.ok(!/\s/.test(query), `${id} URL must not contain raw whitespace`);
  });
});

test("Gemini never puts the prompt in the URL (no public prefill support)", () => {
  const url = buildTargetUrl("gemini", PROMPT);
  assert.equal(url, "https://gemini.google.com/app");
  assert.ok(!url.includes(encodeURIComponent(PROMPT).slice(0, 20)));
});

test("missing or blank prompts fall back to the chat home page", () => {
  ["chatgpt", "claude"].forEach((id) => {
    assert.equal(buildTargetUrl(id, ""), getTarget(id).home);
    assert.equal(buildTargetUrl(id, "   "), getTarget(id).home);
    assert.equal(buildTargetUrl(id, undefined), getTarget(id).home);
    assert.equal(buildTargetUrl(id, null), getTarget(id).home);
  });
});

test("unknown target ids raise a clear error", () => {
  assert.throws(() => buildTargetUrl("bard", PROMPT), /Unknown AI target: bard/);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
