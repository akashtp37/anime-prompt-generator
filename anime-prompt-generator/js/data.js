// data.js — All editable vocabulary lives here (see 05-data-library.md).
// Rules: descriptive phrases, no duplicates, clean categories, stable style blocks.
// Expand lists freely WITHOUT changing generator logic.

export const DATA = {
  styles: {
    character:
      "loose sketchy digital concept art, rough ink linework with visible pencil sketch lines, painterly bold saturated colors, glowing energy effects, dynamic action pose, motion lines, cute chibi-leaning proportions with fierce expression, big shiny eyes, warm beige textured paper background, purple painted ground shadow strokes, handwritten label text, character sheet with multiple pose studies",
    place:
      "anime landscape painting, cinematic wide shot, deep cobalt and electric blue color palette, giant fluffy cumulus clouds with glowing edges, mirror-like water reflection, sparkling light particles floating in the air, dramatic sky, highly detailed background art, soft volumetric light, vertical wallpaper composition, masterpiece"
  },

  // Character examples by type (03/05)
  characters: {
    main: [
      "Goku-type hero",
      "Naruto-type ninja",
      "Luffy-type pirate",
      "Tanjiro-type swordsman",
      "Deku-type student hero",
      "Ichigo-type soul reaper"
    ],
    side: [
      "Zoro-type swordsman",
      "Sasuke-type rival",
      "Vegeta-type prince",
      "Killua-type assassin kid",
      "Levi-type soldier",
      "Todoroki-type ice-fire student"
    ],
    female: [
      "Sailor Moon-type magical girl",
      "Mikasa-type soldier",
      "Nezuko-type demon girl",
      "Hinata-type ninja",
      "Nami-type navigator",
      "Violet Evergarden-type doll"
    ]
  },

  poses: [
    "Kamehameha energy-blast stance",
    "Naruto-style run with arms back",
    "sword draw and slash",
    "back-to-back battle pose",
    "dramatic JoJo-style pose",
    "magical girl transformation pose",
    "jumping attack from above",
    "peace sign with a wink",
    "hands-in-pockets cool walk",
    "sitting on a rooftop looking at the sky",
    "power-up aura with hair flowing upward",
    "spinning kick",
    "crouching ready-to-spring stance",
    "pointing at the enemy",
    "arms crossed, standing tall",
    "bow drawn and aiming",
    "hanging upside down from a branch",
    "spinning attack",
    "raging axe swing",
    "breathing fire and water blast forward"
  ],

  outfits: [
    "hooded cloak",
    "flowing scarf",
    "school uniform",
    "ninja gear",
    "traditional kimono",
    "light armor pieces",
    "worn travel backpack"
  ],

  gear: [
    "skull helmet",
    "leaf-shaped dagger",
    "bow and arrows",
    "big battle axe",
    "katana",
    "mystic staff"
  ],

  hair: [
    "black hair",
    "spiky orange hair",
    "long silver hair",
    "twin tails",
    "short green hair",
    "messy blue hair",
    "pink bob haircut",
    "long white hair"
  ],

  eyes: [
    "big blue eyes",
    "glowing yellow eyes",
    "intense red eyes",
    "purple eyes",
    "green eyes",
    "golden eyes"
  ],

  expressions: [
    "brave expression",
    "jolly grin",
    "raging scowl",
    "timid look",
    "determined expression",
    "smirking expression",
    "surprised expression",
    "calm expression",
    "fierce expression"
  ],

  effects: [
    "fire flames",
    "green leaf slash",
    "water blast",
    "wind spin",
    "lightning crackle",
    "purple shadow smoke",
    "golden aura",
    "ice shards"
  ],

  labels: [
    "BRAVE!",
    "RAGE!",
    "JOLLY!",
    "TIMID?",
    "SPIN to WIN!",
    "FLAME BUFF",
    "LEAF DAGGER!",
    "CALM",
    "POWER UP!",
    "LIMIT BREAK!",
    "AWAKEN!",
    "VICTORY!"
  ],

  places: [
    "Torii gate standing in the sea",
    "Fushimi Inari style torii path",
    "school rooftop at sunset",
    "train crossing with a passing train",
    "Shibuya-style city crossing",
    "Tokyo Tower night skyline",
    "hidden ninja village on a cliff",
    "giant walls and a fantasy city",
    "bathhouse town in the mist",
    "floating castle in the sky",
    "Mount Fuji lake shore",
    "cherry blossom river bridge",
    "seaside station with an endless ocean",
    "lantern festival street",
    "old shrine stairs in the forest",
    "starry night hill with a lone tree"
  ],

  times: [
    "sunrise",
    "morning",
    "noon",
    "golden hour",
    "blue hour",
    "midnight",
    "starry night"
  ],

  weather: [
    "clear sky",
    "big clouds",
    "light rain",
    "after-rain freshness",
    "fog",
    "snow",
    "storm clouds"
  ],

  moods: ["calm", "dreamy", "lonely", "epic", "nostalgic", "mysterious"],

  cameras: ["wide shot", "low angle", "high angle", "top-down view", "close-up on landmark"],

  quality: ["highly detailed", "masterpiece", "best quality", "sharp focus", "dynamic composition", "8k"]
};

// Slot definitions drive chips + locks in the UI (06-lock system).
// Character and place slot names never collide, so one lock map is enough.
export const CHARACTER_SLOTS = [
  { key: "character", label: "Character" },
  { key: "outfit", label: "Outfit" },
  { key: "hair", label: "Hair" },
  { key: "eyes", label: "Eyes" },
  { key: "expression", label: "Expression" },
  { key: "pose", label: "Pose" },
  { key: "gear", label: "Gear" },
  { key: "effect", label: "Effect" },
  { key: "label", label: "Label" }
];

export const PLACE_SLOTS = [
  { key: "place", label: "Place" },
  { key: "time", label: "Time" },
  { key: "weather", label: "Weather" },
  { key: "mood", label: "Mood" },
  { key: "camera", label: "Camera" }
];
