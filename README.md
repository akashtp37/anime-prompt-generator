# Random Anime Prompt Generator

A client-side website that generates randomized prompts for AI image generators —
press one **Generate Prompt** button and get a prompt for an **anime character**
or an **anime place**. No backend, no login, no database; static-hosting ready.

The app lives in [`anime-prompt-generator/`](anime-prompt-generator/) — see its
[README](anime-prompt-generator/README.md) for features and details.

## Quick start

```bash
# serve locally (zero dependencies, Node built-ins only)
node anime-prompt-generator/tools/serve.mjs 4173
# → http://127.0.0.1:4173/index.html

# run the generator tests (14 tests, zero dependencies)
node anime-prompt-generator/tests/generator.test.mjs
```

## What's inside

```text
anime-prompt-generator/     # the app
├── index.html
├── css/style.css           # themes: palette tokens, mode accents, light/dark
├── js/
│   ├── data.js             # all editable vocabulary + style blocks
│   ├── generator.js        # random selection, locks, prompt assembly
│   └── app.js              # state, locks, history, favorites, storage, themes
├── tests/generator.test.mjs
└── tools/serve.mjs         # zero-dependency static preview server
all md file/                 # design specification documents
```

## Features

- **Modes:** Characters | Places | Both (random per generation)
- **Character filter:** All / Main / Side / Female
- **Per-part locks:** lock any chip and re-roll everything else
- **History** (last 10) and **favorites**, persisted in `localStorage`
- **Retro palette themes:** brick red for Characters, forest green for Places,
  with a Light/Dark/System surface override
- **Accessible and responsive:** keyboard focus, `aria-pressed` locks, live
  status announcements, reduced-motion support, mobile layout
