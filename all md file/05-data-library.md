# Data Library Specification

All editable vocabulary should live in `data.js`.

## Data Structure

```js
export const DATA = {
  styles: {
    character: "...",
    place: "..."
  },

  characters: {
    main: [],
    side: [],
    female: []
  },

  archetypes: [],
  poses: [],
  outfits: [],
  hair: [],
  eyes: [],
  expressions: [],
  gear: [],
  effects: [],
  labels: [],

  places: [],
  times: [],
  weather: [],
  moods: [],
  cameras: [],
  quality: []
};
```

## Character Types

- Main character
- Side character
- Female character

## Character Examples

### Main
- Goku-type hero
- Naruto-type ninja
- Luffy-type pirate
- Tanjiro-type swordsman
- Deku-type student hero
- Ichigo-type soul reaper

### Side
- Zoro-type swordsman
- Sasuke-type rival
- Vegeta-type prince
- Killua-type assassin kid
- Levi-type soldier
- Todoroki-type ice-fire student

### Female
- Sailor Moon-type magical girl
- Mikasa-type soldier
- Nezuko-type demon girl
- Hinata-type ninja
- Nami-type navigator
- Violet Evergarden-type doll

## Pose Library

- Kamehameha energy-blast stance
- Naruto-style run with arms back
- Sword draw and slash
- Back-to-back battle pose
- Dramatic JoJo-style pose
- Magical girl transformation pose
- Jumping attack from above
- Peace sign with a wink
- Hands-in-pockets cool walk
- Sitting on a rooftop looking at the sky
- Power-up aura with hair flowing upward
- Spinning kick
- Crouching ready-to-spring stance
- Pointing at the enemy
- Arms crossed, standing tall
- Bow drawn and aiming
- Hanging upside down from a branch
- Spinning attack
- Raging axe swing
- Breathing fire/water blast forward

## Outfit and Gear

- Hooded cloak
- Scarf
- School uniform
- Ninja gear
- Kimono
- Armor pieces
- Skull helmet
- Leaf-shaped dagger
- Bow and arrows
- Big axe
- Katana
- Staff
- Backpack

## Hair

- Black
- Spiky orange
- Long silver
- Twin tails
- Short green
- Messy blue
- Pink bob
- Long white

## Eyes

- Big blue
- Glowing yellow
- Intense red
- Purple
- Green
- Golden

## Expressions

- Brave
- Jolly
- Rage
- Timid
- Determined
- Smirking
- Surprised
- Calm
- Fierce

## Energy Effects

- Fire flames
- Green leaf slash
- Water blast
- Wind spin
- Lightning
- Purple shadow smoke
- Golden aura
- Ice shards

## Handwritten Labels

- BRAVE!
- RAGE!
- JOLLY!
- TIMID?
- SPIN to WIN!
- FLAME BUFF
- LEAF DAGGER!
- CALM
- POWER UP!
- LIMIT BREAK!
- AWAKEN!
- VICTORY!

## Places

- Torii gate standing in the sea
- Fushimi Inari style torii path
- School rooftop at sunset
- Train crossing with a passing train
- Shibuya-style city crossing
- Tokyo Tower night skyline
- Hidden ninja village on a cliff
- Giant walls and a fantasy city
- Bathhouse town in the mist
- Floating castle in the sky
- Mount Fuji lake shore
- Cherry blossom river bridge
- Seaside station with an endless ocean
- Lantern festival street
- Old shrine stairs in the forest
- Starry night hill with a lone tree

## Time

- Sunrise
- Morning
- Noon
- Golden hour
- Blue hour
- Midnight
- Starry night

## Weather

- Clear
- Big clouds
- Light rain
- After-rain
- Fog
- Snow
- Storm clouds

## Mood

- Calm
- Dreamy
- Lonely
- Epic
- Nostalgic
- Mysterious

## Camera

- Wide shot
- Low angle
- High angle
- Top-down
- Close-up on landmark

## Quality

```text
highly detailed
masterpiece
best quality
sharp focus
dynamic composition
8k
```

## Data Rules

1. Use visually descriptive phrases.
2. Avoid unnecessary duplicates.
3. Keep categories clean.
4. Avoid severe contradictions.
5. Keep style blocks stable.
6. Expand lists without changing generator logic.
