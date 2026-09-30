# UI, State, and Theme Specification

## Page Layout

1. Header
2. Mode selector
3. Character filter
4. Prompt display
5. Prompt actions
6. Prompt-part chips
7. Generate button
8. History
9. Favorites

## Header

Contains:

- Site name
- Dark/light control

## Mode Selector

```text
Characters | Places | Both
```

## Character Filter

```text
All
Main
Side
Female
```

Only active for character generation.

## Prompt Display

Actions:

```text
Copy
Favorite
```

Future:

```text
Regenerate
Share
Copy Positive
Copy Negative
```

## Prompt Chips

Example:

```text
Character     Goku-type hero       🔒
Outfit        Hooded cloak         🔓
Hair          Short green hair     🔓
Eyes          Glowing yellow       🔓
Pose          Kamehameha stance    🔒
Effect        Golden aura          🔓
```

## Application State

```js
const appState = {
  mode: "characters",
  characterFilter: "all",
  currentPrompt: "",
  currentParts: {},
  lockedSlots: {},
  history: [],
  favorites: [],
  darkLightOverride: null
};
```

## Character Theme

```css
--bg-primary: #F5E6D3;
--bg-card: #E8D5C4;
--text-primary: #1A1A1A;
--accent-color: #D9381E;
--border-color: #C8B4A0;
```

Direction:

- Warm beige
- Paper
- Ink
- Sketch
- Character-sheet feeling

## Place Theme

```css
--bg-primary: #0A192F;
--bg-card: #112240;
--text-primary: #E6F1FF;
--accent-color: #64FFDA;
--border-color: #233554;
```

Direction:

- Deep blue
- Sky
- Clouds
- Soft glow
- Cinematic atmosphere

## Both Theme

```css
--bg-primary: #1E293B;
--bg-card: #334155;
--text-primary: #F8FAFC;
--accent-color: #F59E0B;
--border-color: #475569;
```

Direction:

- Neutral studio interface
- Hybrid visual system

## Appearance Override

Mode and appearance are separate.

Mode:

```text
Characters
Places
Both
```

Appearance:

```text
Light
Dark
System
```

## Responsive Design

The website must work on:

- Desktop
- Laptop
- Tablet
- Mobile

Mobile requirements:

- Large Generate button
- Readable prompt
- Touch-friendly controls
- Lock chips that do not overflow
- Easy history/favorites access
