// ai-targets.js — External AI chat destinations for a generated prompt.
//
// Each target is opened in a new tab. Services that support prompt prefill via
// URL get the prompt in the URL; the others open their blank chat and rely on
// the clipboard, which app.js fills on click.

const CHATGPT_HOME = "https://chatgpt.com/";
const CLAUDE_HOME = "https://claude.ai/new";
const GEMINI_HOME = "https://gemini.google.com/app";

/**
 * Supported AI chats.
 * `prefill: true`  → the prompt is passed in the URL (filled in on arrival).
 * `prefill: false` → no public prefill parameter, so the prompt is only
 *                    copied to the clipboard (never sent in the URL).
 */
export const AI_TARGETS = [
  {
    id: "chatgpt",
    name: "ChatGPT",
    home: CHATGPT_HOME,
    prefill: true,
    buildUrl: (prompt) => `${CHATGPT_HOME}?q=${encodeURIComponent(prompt)}`
  },
  {
    id: "claude",
    name: "Claude",
    home: CLAUDE_HOME,
    prefill: true,
    buildUrl: (prompt) => `${CLAUDE_HOME}?q=${encodeURIComponent(prompt)}`
  },
  {
    id: "gemini",
    name: "Gemini",
    home: GEMINI_HOME,
    prefill: false,
    buildUrl: () => GEMINI_HOME
  }
];

const TARGETS_BY_ID = new Map(AI_TARGETS.map((target) => [target.id, target]));

/** Look up a target by id, or `undefined` if the id is unknown. */
export function getTarget(id) {
  return TARGETS_BY_ID.get(id);
}

/**
 * Build the URL to open for a target. Falls back to the chat's home page when
 * there is no prompt to send or the service cannot prefill from a URL.
 */
export function buildTargetUrl(id, prompt) {
  const target = getTarget(id);
  if (!target) throw new Error(`Unknown AI target: ${id}`);

  const text = typeof prompt === "string" ? prompt.trim() : "";
  if (!target.prefill || text === "") return target.home;
  return target.buildUrl(text);
}
