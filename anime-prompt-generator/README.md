# Random Anime Prompt Generator

A simple client-side website that generates randomized prompts for AI image generators.
Press one **Generate Prompt** button and get a prompt for either an **Anime Character** or an **Anime Place**.

No backend, no login, no database. Static-hosting compatible (GitHub Pages / Netlify / Vercel).

## Features (Version 1)

- **Modes:** Characters | Places | Evolution | Both (randomly picks a character or place in Both mode)
- **Evolution generator:** create an original, coherent 2- or 3-stage creature family with bilingual names and copy-ready stage, sheet, and Dex prompts
- **Character filter:** All / Main / Side / Female
- **Modular prompt construction:** controlled categories combined in a fixed structure
- **Per-part locks:** lock any chip (pose, hair, effect…) and re-roll everything else
- **Prompt-part chips** with lock toggles (keyboard + screen-reader accessible)
- **Copy** to clipboard with fallback, **Favorites** (add/remove/copy, no duplicates)
- **Send to an AI chat:** ChatGPT / Claude / Gemini icon buttons open the chat in a new tab — ChatGPT and Claude receive the prompt in the URL, Gemini opens its blank chat with the prompt copied to the clipboard
- **History:** last 10 prompts, newest first, click to reuse
- **localStorage persistence** with safe handling of missing/invalid/unavailable storage
- **Retro palette themes:** mode picks the accent — brick red for Characters, forest green for Places, red/green hybrid for Both — while **Light/Dark/System** picks the surfaces
- **Palette:** cream `#DCC9A9`, brick red `#B83A2D`, forest green `#4E6851`, near-black `#121110`, light cream `#F2EAD9`
- **Responsive layout** for desktop, tablet, and mobile
- **Accessibility:** semantic HTML, visible focus, `aria-pressed` locks, `aria-live` status, reduced-motion support
- **Error handling:** empty data categories, clipboard failure, invalid modes

## Folder Structure

```text
anime-prompt-generator/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js        # All editable vocabulary and style blocks
│   ├── generator.js   # Random selection, locks, prompt assembly, modes
│   ├── evolution-data.js # Creature type themes, original concept seeds, names, and templates
│   ├── evolution-generator.js # Shared-family evolution pipeline and validation
│   ├── ai-targets.js  # ChatGPT / Claude / Gemini destinations and URL builders
│   └── app.js         # State, DOM, clipboard, history, favorites, storage
├── tests/
│   ├── generator.test.mjs
│   ├── evolution-generator.test.mjs
│   └── ai-targets.test.mjs
└── README.md
```

## Run

Open `index.html` directly, or serve the folder (ES modules need http://):

```bash
npx serve .
```

## Tests

Zero-dependency Node test suites covering character/place generation, evolution lines, and AI chat links:

```bash
node tests/generator.test.mjs
node tests/evolution-generator.test.mjs
node tests/ai-targets.test.mjs
```

## Editing Data

All vocabulary lives in `js/data.js` — expand lists without touching generator logic.
Rules: use descriptive phrases, avoid duplicates, keep categories clean, keep style blocks stable.
