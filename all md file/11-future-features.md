# Future Features

## Character + Place Mode

This is different from Both mode.

Both mode:
```text
Randomly choose Character OR Place
```

Future Character + Place mode:
```text
Character + Place in one prompt
```

## Expanded Character Categories

- Villains
- Mentors
- Rivals
- Children
- Warriors
- Mages
- Mecha pilots
- Monsters
- Fantasy characters
- Cyberpunk characters

## Visual Expansion

- Body types
- Face shapes
- Accessories
- Footwear
- Armor
- Color palettes
- Lighting types
- Background props

## Environment Expansion

- Architecture
- Vegetation
- Terrain
- Water type
- Atmospheric particles
- Lighting direction
- Seasons

## Platform Presets

Possible targets:

- Generic
- Midjourney / Niji
- Stable Diffusion / SDXL
- Other

Possible platform-specific settings:

- Weight syntax
- Aspect ratio
- Style parameters
- Negative prompt support

## Prompt Export

Future options:

```text
Copy prompt
Download .txt
Export JSON
Share prompt
```

Example structured export:

```json
{
  "mode": "character",
  "character": "Goku-type hero",
  "type": "main",
  "outfit": "hooded cloak",
  "hair": "short green hair",
  "eyes": "glowing yellow eyes",
  "expression": "fierce",
  "pose": "energy charging stance",
  "gear": "staff",
  "effect": "golden aura",
  "label": "POWER UP!"
}
```

## Negative Prompt

Future separate field:

```text
Positive Prompt
Negative Prompt
Copy Positive
Copy Negative
Copy Both
```

## Compatibility Engine

Future data items can contain metadata such as:

```js
{
  name: "heavy stone armor",
  tags: ["heavy", "armor", "warrior"]
}
```

The generator can use these tags to avoid severe conflicts.

## Sharing

Future feature:

- Share a generated prompt
- Encode prompt state into a URL
- Reopen a shared prompt
