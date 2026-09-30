# Project Architecture

## Folder Structure

```text
anime-prompt-generator/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   ├── generator.js
│   └── app.js
├── README.md
└── assets/
    └── reference/
```

## Responsibilities

### index.html
Semantic structure, controls, prompt output, history/favorites containers.

### style.css
Layout, typography, themes, responsive rules, animations, accessibility states.

### data.js
All editable vocabulary and style blocks.

### generator.js
Random selection, locks, prompt assembly, mode selection, duplicate prevention, future compatibility.

### app.js
DOM events, application state, clipboard, history, favorites, localStorage, rendering.

## Data Flow

```text
USER
  ↓
app.js
  ↓
mode / filter / locks
  ↓
generator.js
  ↓
data.js
  ↓
prompt compiler
  ↓
style + quality
  ↓
final prompt
  ↓
copy / history / favorites
  ↓
localStorage
```

## Technical Model

The application is a lightweight client-side SPA.

No backend is required for:

- Random generation
- Prompt compilation
- Lock state
- UI rendering
- Theme switching
- Clipboard
- History
- Favorites

## Combinatorial Space

Character output space:

```text
characters
× outfits
× hair
× eyes
× expressions
× poses
× gear
× effects
× labels
```

Place output space:

```text
places
× times
× weather
× moods
× cameras
```

The number of theoretical combinations grows multiplicatively.

## Source Relationship

The original project MD defines the product.

The character research defines design principles and character data architecture.

The technical research defines implementation architecture, state handling, themes, procedural generation, and combinatorial reasoning.
