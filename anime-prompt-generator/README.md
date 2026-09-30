# Random Anime Prompt Generator

A simple client-side website that generates randomized prompts for AI image generators.
Press one **Generate Prompt** button and get a prompt for either an **Anime Character** or an **Anime Place**.

No backend, no login, no database. Static-hosting compatible (GitHub Pages / Netlify / Vercel).

## Features (Version 1)

- **Modes:** Characters | Places | Both (randomly picks one per generation)
- **Character filter:** All / Main / Side / Female
- **Modular prompt construction:** controlled categories combined in a fixed structure
- **Per-part locks:** lock any chip (pose, hair, effect…) and re-roll everything else
- **Prompt-part chips** with lock toggles (keyboard + screen-reader accessible)
- **Copy** to clipboard with fallback, **Favorites** (add/remove/copy, no duplicates)
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
│   └── app.js         # State, DOM, clipboard, history, favorites, storage
├── tests/
│   └── generator.test.mjs
└── README.md
```

## Run

Open `index.html` directly, or serve the folder (ES modules need http://):

```bash
npx serve .
```

## Tests

Zero-dependency Node test suite covering the generator spec:

```bash
node tests/generator.test.mjs
```

## Editing Data

All vocabulary lives in `js/data.js` — expand lists without touching generator logic.
Rules: use descriptive phrases, avoid duplicates, keep categories clean, keep style blocks stable.
