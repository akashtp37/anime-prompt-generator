# Generator Logic

## Random Selection

```js
const pick = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];
```

## Character Generator

```js
export function makeCharacterPrompt(type = "any", locks = {}) {
  const group =
    type === "any"
      ? pick(["main", "side", "female"])
      : type;

  const p = {
    character: locks.character ?? pick(DATA.characters[group]),
    outfit: locks.outfit ?? pick(DATA.outfits),
    hair: locks.hair ?? pick(DATA.hair),
    eyes: locks.eyes ?? pick(DATA.eyes),
    expression: locks.expression ?? pick(DATA.expressions),
    pose: locks.pose ?? pick(DATA.poses),
    gear: locks.gear ?? pick(DATA.gear),
    effect: locks.effect ?? pick(DATA.effects),
    label: locks.label ?? pick(DATA.labels)
  };

  const prompt = [
    p.character,
    `${group} character`,
    p.outfit,
    p.hair,
    p.eyes,
    p.expression,
    p.pose,
    p.gear,
    p.effect,
    `handwritten label "${p.label}"`,
    DATA.styles.character,
    pick(DATA.quality)
  ].join(", ");

  return { prompt, parts: p };
}
```

## Place Generator

```js
export function makePlacePrompt(locks = {}) {
  const p = {
    place: locks.place ?? pick(DATA.places),
    time: locks.time ?? pick(DATA.times),
    weather: locks.weather ?? pick(DATA.weather),
    mood: locks.mood ?? pick(DATA.moods),
    camera: locks.camera ?? pick(DATA.cameras)
  };

  const prompt = [
    p.place,
    p.time,
    p.weather,
    `${p.mood} mood`,
    p.camera,
    DATA.styles.place,
    pick(DATA.quality)
  ].join(", ");

  return { prompt, parts: p };
}
```

## Both Mode

```js
export function makeRandom(mode = "both", type = "any") {
  if (mode === "character") {
    return makeCharacterPrompt(type);
  }

  if (mode === "place") {
    return makePlacePrompt();
  }

  return Math.random() < 0.5
    ? makeCharacterPrompt(type)
    : makePlacePrompt();
}
```

## Lock System

Example:

```js
lockedSlots = {
  character: false,
  outfit: false,
  hair: false,
  eyes: false,
  expression: false,
  pose: true,
  gear: false,
  effect: false,
  label: false
};
```

Locked values remain unchanged while unlocked values are re-rolled.

## Duplicate Prevention

Version 1 may allow occasional duplicates.

Recommended improvement:

```js
if (newPrompt === currentPrompt) {
  regenerate();
}
```

Use a maximum retry count so generation cannot loop forever.

## Compatibility Filtering

Future versions may attach tags to data items:

```js
{
  name: "heavy stone armor",
  tags: ["heavy", "armor", "warrior"]
}
```

and:

```js
{
  name: "mid-air acrobatic backflip",
  tags: ["agile", "airborne", "dynamic"]
}
```

Version 1 should remain simple. Compatibility filtering can be added after the base generator works.
