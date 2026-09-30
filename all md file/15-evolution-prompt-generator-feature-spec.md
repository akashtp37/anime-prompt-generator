# Evolution Prompt Generator — Feature Specification

Version 1.0

## Purpose

Add an **Evolution Prompt Generator** to the existing Random Anime Prompt Generator.

Existing modes remain:
- Characters
- Places
- Both

New mode:

```text
Characters | Places | Evolution | Both
```

Evolution is a prompt-only feature. It creates an original creature family progressing through 2 or 3 stages and produces individual stage prompts plus a complete evolution-sheet prompt.

The evolution research defines the core rules: silhouette expansion, shape-language shifts, palette inheritance, motif retention, archetypes, type/theme data, concept seeds, bilingual naming, full-sheet layouts, trait locks, compatibility, and validation.

## Core principle

Never generate three unrelated creatures.

Generate one family identity first:

```text
type + palette + eye color + body plan + material + anchor motif + concept seed
                         ↓
                 shared family traits
                         ↓
             controlled stage evolution
```

Every stage must look like the same species becoming more developed.

---

## Stage rules

### Stage 1 — Baby / Base

Use:
- soft circles and curves
- large head-to-body ratio
- large round eyes
- curious/playful expression
- compact silhouette
- low complexity
- one small anchor motif
- undeveloped appendages
- low center of gravity

### Stage 2 — Intermediate

Use:
- trapezoids / polygon-curve hybrids
- defined joints
- medium head-to-body ratio
- semi-angular eyes
- alert/focused expression
- elongated limbs
- duplicated or lengthened motifs
- medium silhouette complexity

### Stage 3 — Final / Adult

Use:
- sharp triangles and jagged angles
- strong diagonals
- broad silhouette
- smaller/sharper eyes
- fierce/dominant/wise expression
- expanded or weaponized motifs
- mature appendages
- imposing/battle-ready posture

Metamorphosis is an exception: Stage 2 may become a hard chrysalis with concealed features and little/no visible limbs before Stage 3 becomes the complex adult.

---

## Shared family traits

Create this before generating stages:

```js
{
  primaryType,
  secondaryType,
  primaryColor,
  secondaryColor,
  accentColor,
  eyeColor,
  anchorMotif,
  bodyPlan,
  baseMaterial,
  conceptSeed
}
```

Normally preserve:
- primary type
- secondary type
- primary color
- secondary color
- eye color
- core motif identity
- body-plan identity
- main material

The accent color can intensify:

```text
soft → saturated → glowing/material
```

---

## Palette inheritance

Use the research distribution as a design guide:

```text
Stage 1: 60% primary / 30% secondary / 10% accent
Stage 2: 55% primary / 30% secondary / 15% accent
Stage 3: 50% primary / 30% secondary / 20% accent
```

Do not completely recolor the creature.

---

## Motif escalation

A recognizable anchor motif must survive evolution.

Examples:

```text
single horn → dual horns → branching crown
small crest → double crest → large crown
wing nub → functional wings → massive wings
small tail fin → segmented fin → weaponized tail
simple spots → bands → glowing/rune-like markings
soft fur → hardened hide → armor/energized material
```

---

## Evolution archetypes

Support:

```text
LINEAR_2_STAGE
LINEAR_3_STAGE
BRANCHING
METAMORPHOSIS
ARMOR_SHELL_GROWTH
MEGA_ALTERNATE
REGIONAL_VARIANT
CONVERGENT_LINE
```

V1 priority:

```text
LINEAR_2_STAGE
LINEAR_3_STAGE
METAMORPHOSIS
```

Archetype data should contain:

```js
{
  id,
  name,
  totalStages,
  branching,
  stageRules: [
    {
      stage,
      massMultiplier,
      shapeDominance,
      eyeStyle,
      motifScaling,
      poseDynamics
    }
  ]
}
```

---

## Type/theme database

Use the research type matrix as the basis for:

```text
Fire
Water
Grass
Electric
Ice
Flying
Bug
Ghost
Dragon
Steel
Rock
Ground
Poison
Psychic
Dark
Fairy
Fighting
Normal
```

Each type should contain:

```js
{
  type,
  primaryColors,
  accentColors,
  materials,
  bodyPlans,
  motifs,
  habitat,
  promptDescriptors
}
```

Keep this data in `evolution-data.js`, not inside UI code.

---

## Concept seeds

Use the research's 106 concept seeds.

Recommended structured record:

```js
{
  id: "seed_055",
  category: "insects",
  animal: "Rhinoceros Beetle",
  concept: "Kabuto Helmet",
  type: "Steel",
  motif: "horn crest",
  tags: ["beetle", "armor", "samurai"]
}
```

Support combinations such as:

```text
Animal + Element + Object
Object + Spirit + Animal
Myth/Folklore + Natural Phenomenon
Concept/Vocation + Creature
```

---

## Name generation

Generate a name per stage.

English:

```text
Prefix + Root + Stage Suffix
```

Stage 1 suffixes should feel young:
`ling, pup, bud, let, mite, kit, sprout`

Stage 2:
`tor, drake, crest, wing, shell, fang, tail, claw`

Stage 3:
`king, titan, sovereign, maw, vortex, behemoth, dread, blade, lord`

Also generate a stylized Katakana name using the research syllable pools.

Do not use existing franchise creature names.

---

## Prompt hierarchy

Single-stage prompt:

```text
Original monster collecting game concept art,
Stage {STAGE_NUM} {STAGE_TYPE} creature,
{MASS_DESCRIPTION},
{BODY_PLAN},
{PRIMARY_COLOR} and {SECONDARY_COLOR} body coloring,
{ACCENT_COLOR} {EVOLVED_MOTIF},
{EYE_STYLE},
{POSE_AND_EXPRESSION},
{MATERIALS},
flat cel-shaded anime character sheet style,
bold clean lineart,
solid color fills,
plain white background
```

Order:

```text
stage identity
→ type/theme
→ body structure
→ motif
→ colors/materials
→ expression/posture
→ style
→ quality
```

Full-sheet prompt:

```text
Full evolution character sheet showing {TOTAL_STAGES} evolution stages of
a {PRIMARY_TYPE} {SECONDARY_TYPE} {BASE_CONCEPT} monster family on one page,
clean left-to-right horizontal progression,
Stage 1 on the left,
Stage 2 in the center,
Stage 3 on the right,
matching shared color palette,
recognizable inherited motif,
controlled silhouette progression,
directional arrows between stages,
clean off-white studio background,
flat color character-sheet layout,
bold clean anime lineart style
```

Adapt automatically for 2-stage lines.

---

## Optional Dex prompt

Generate:

```text
Original creature index encyclopedia card,
{TOTAL_STAGES}-stage evolution line,
off-white background,
16:9 horizontal canvas,
left-to-right stages,
directional arrows,
rounded information bubbles,
Japanese name,
English name,
type badge,
Dex number,
short flavor text,
flat vector anime UI layout
```

This is a prompt, not an actual image renderer.

---

## Result data

Use:

```js
{
  id: "line_...",
  mode: "evolution",

  sharedTraits: {...},

  archetype: {
    id: "LINEAR_3_STAGE",
    name: "Linear 3-Stage Progression"
  },

  conceptSeed: {...},

  stages: [
    {
      stageNumber: 1,
      names: { english, japanese },
      prompt,
      flavorText,
      rule
    }
  ],

  fullSheetPrompt,
  dexPrompt
}
```

---

## Generator architecture

Create:

```js
class EvolutionPromptGenerator
```

Methods:

```text
generateLine(options)
generateSharedTraits()
generateStages()
generateBilingualNames()
assembleSingleStagePrompt()
assembleFullSheetPrompt()
assembleDexPrompt()
selectCompatiblePalette()
validateEvolutionLine()
getRandomItem()
```

Pipeline:

```text
type
→ secondary type
→ archetype
→ concept seed
→ compatible palette
→ shared traits
→ stage rules
→ stage prompts
→ names
→ flavor text
→ full-sheet prompt
→ validation
```

---

## Compatibility

Use advisory compatibility rules to avoid obviously nonsensical combinations.

Example:

```js
const COMPATIBILITY_RULES = {
  FIRE: {
    forbiddenHabitats: [
      "underwater ocean trench",
      "deep coral reef",
      "glacial ice cavern"
    ],
    preferredBodyPlans: [
      "quadrupedal beast",
      "drake dragon",
      "avian raptor"
    ]
  },

  WATER: {
    forbiddenHabitats: [
      "active magma chamber",
      "arid desert badlands"
    ],
    preferredBodyPlans: [
      "piscine fish",
      "serpentine eel",
      "marine mammal"
    ]
  }
};
```

Do not over-constrain random generation.

---

## Locks

Two levels:

### Family locks

```text
Type
Palette
Eye Color
Anchor Motif
Body Plan
Material
```

### Stage locks

```text
Stage pose
Stage expression
Stage-specific motif escalation
```

Locked values survive rerolls. Unlocked values regenerate. Rebuild every affected prompt after a reroll.

---

## UI

Evolution controls:

```text
Evolution Type
[ Random ▼ ]

Stages
[ 2 ] [ 3 ]

Primary Type
[ Random ▼ ]

Secondary Type
[ None / Random / Select ▼ ]

Concept Seed
[ Randomize ]

Generate Evolution
```

Stage cards:

```text
Stage 1       Stage 2       Stage 3
Baby          Intermediate  Final

Name          Name          Name
Type          Type          Type
Prompt        Prompt        Prompt
Copy          Copy          Copy
Lock          Lock          Lock
```

Below:

```text
Full Evolution Prompt
[Copy Full Sheet]

Dex Prompt
[Copy Dex]
```

For 2-stage output, hide Stage 3.

---

## Theme

Evolution should feel like an original creature design sheet:

- off-white/light-gray studio background
- dark ink
- thin borders
- small type badges
- paper/print feeling
- stage arrows
- encyclopedia/character-sheet layout
- violet/purple accent

Suggested starting variables:

```css
--bg-primary: #F8F9FA;
--bg-card: #FFFFFF;
--text-primary: #171717;
--accent-color: #7C3AED;
--border-color: #D4D4D8;
```

Do not break existing Character or Place themes.

---

## History / Favorites / Copy

Evolution results must use the existing localStorage architecture.

Store the complete structured evolution object, not only the full-sheet text.

Required copy actions:

```text
Copy Stage 1
Copy Stage 2
Copy Stage 3
Copy Full Evolution
```

Optional:

```text
Copy Dex
Copy JSON
Copy Markdown
```

Reuse the existing clipboard/toast system.

---

## Validation

Before display:

- stage count is correct
- prompts are non-empty
- shared colors appear across stages
- anchor motif remains recognizable
- stage progression is coherent
- names exist
- duplicate stage descriptions are avoided
- forbidden franchise terms are absent

If validation fails, regenerate or repair the offending data.

---

## Originality safeguard

Do not generate protected franchise terms such as:

```text
Pokémon
Pikachu
Charmander
Nintendo
Game Freak
Pokédex
```

Do not use:

```text
"Pokémon style"
"official Pokédex art"
"official Sugimori artwork"
```

Use neutral language:

```text
original monster collecting game concept art
original creature design
flat color character sheet
bold clean anime lineart
```

The goal is an original creature prompt system using generic creature-design principles.

---

## Files

Recommended:

```text
anime-prompt-generator/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── data.js
│   ├── generator.js
│   ├── evolution-data.js
│   ├── evolution-generator.js
│   └── app.js
└── README.md
```

Do not rewrite unrelated existing code.

---

## V1 acceptance criteria

- Evolution mode exists.
- 2-stage generation works.
- 3-stage generation works.
- Shared family identity works.
- Palette inheritance works.
- Motif escalation works.
- Names work.
- Stage prompts work.
- Full-sheet prompt works.
- Copy works.
- Locks work.
- History works.
- Favorites work.
- localStorage works.
- Mobile UI works.
- Character mode still works.
- Place mode still works.
- Dark/light mode still works.
- Protected franchise keywords are rejected.
