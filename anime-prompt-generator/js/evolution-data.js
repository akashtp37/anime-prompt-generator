// evolution-data.js — Original creature concepts and prompt vocabulary.
// The requested research text was not present in this workspace; this file
// contains a replaceable 106-seed set built from the feature specification.

export const TYPE_THEMES = Object.freeze({
  Fire: {
    type: "Fire",
    primaryColors: ["ember red", "copper orange", "sunset coral"],
    accentColors: ["molten gold", "warm ivory", "smoke black"],
    materials: ["charred bark", "warm ceramic", "brushed copper", "volcanic glass"],
    bodyPlans: ["quadrupedal ember beast", "long-bodied salamander", "avian spark raptor"],
    motifs: ["flame crest", "coal tail", "ember horn"],
    habitat: "sun-warmed basalt hollows",
    promptDescriptors: ["heat shimmer", "glowing seams", "curling flame shapes"]
  },
  Water: {
    type: "Water",
    primaryColors: ["lagoon teal", "deep ocean blue", "river jade"],
    accentColors: ["sea-glass mint", "foam white", "pearl silver"],
    materials: ["polished shell", "translucent fin", "smooth river stone", "woven kelp"],
    bodyPlans: ["streamlined piscine swimmer", "serpentine river creature", "web-footed marine mammal"],
    motifs: ["tide crest", "ripple bands", "current ribbon"],
    habitat: "quiet tidal pools",
    promptDescriptors: ["flowing water shapes", "clear fin membranes", "soft reflected highlights"]
  },
  Grass: {
    type: "Grass",
    primaryColors: ["leaf green", "fern jade", "moss olive"],
    accentColors: ["pollen gold", "blossom pink", "bark brown"],
    materials: ["velvety moss", "layered leaf", "woven vine", "soft flower petal"],
    bodyPlans: ["compact woodland quadruped", "branch-limbed forest creature", "long-eared meadow runner"],
    motifs: ["leaf crown", "seed pod", "vine tassel"],
    habitat: "sun-dappled woodland clearings",
    promptDescriptors: ["leaf-vein markings", "fresh growth", "organic branching shapes"]
  },
  Electric: {
    type: "Electric",
    primaryColors: ["bright citron", "electric blue", "warm chartreuse"],
    accentColors: ["arc white", "copper gold", "midnight navy"],
    materials: ["amber resin", "conductive copper", "smooth enamel", "charged crystal"],
    bodyPlans: ["spring-legged runner", "wide-eyed tree climber", "swift avian glider"],
    motifs: ["forked spark crest", "static whiskers", "zigzag tail"],
    habitat: "windy ridgelines before a storm",
    promptDescriptors: ["fine branching sparks", "charged markings", "crisp lightning angles"]
  },
  Ice: {
    type: "Ice",
    primaryColors: ["glacier blue", "frost lilac", "icy turquoise"],
    accentColors: ["snow white", "blue silver", "soft rose"],
    materials: ["frosted glass", "layered down", "clear ice", "pale quartz"],
    bodyPlans: ["sturdy snowfield quadruped", "rounded burrowing mammal", "long-necked alpine bird"],
    motifs: ["crystal brow", "frost fringe", "snowflake tail fan"],
    habitat: "wind-carved snow valleys",
    promptDescriptors: ["crystalline edges", "powdery frost", "cool refracted glints"]
  },
  Flying: {
    type: "Flying",
    primaryColors: ["cloud blue", "soft sky gray", "wind-washed cream"],
    accentColors: ["sunset peach", "feather white", "slate"],
    materials: ["layered feather", "lightweight down", "silky membrane", "wind-polished wood"],
    bodyPlans: ["wide-winged glider", "slim sky runner", "soaring long-tailed bird"],
    motifs: ["swept crest", "wing-tip eye marks", "tail streamer"],
    habitat: "open cliffs above cloudbanks",
    promptDescriptors: ["wind-swept feather lines", "broad lift surfaces", "airy negative space"]
  },
  Bug: {
    type: "Bug",
    primaryColors: ["leaf-litter green", "amber brown", "iridescent teal"],
    accentColors: ["cream spots", "copper red", "golden pollen"],
    materials: ["segmented chitin", "silk filament", "polished shell", "downy fuzz"],
    bodyPlans: ["six-limbed crawler", "wing-cased beetle", "soft-bodied caterpillar"],
    motifs: ["horn crest", "wing-case spots", "thread tassels"],
    habitat: "mossy trunks at the forest floor",
    promptDescriptors: ["clear segmented anatomy", "fine antennae", "delicate wing patterns"]
  },
  Ghost: {
    type: "Ghost",
    primaryColors: ["smoke violet", "moonlit blue", "muted mauve"],
    accentColors: ["lantern ivory", "spectral mint", "ink black"],
    materials: ["mist veil", "soft felt", "smoky glass", "old paper"],
    bodyPlans: ["floating hooded wisp", "small hovering familiar", "long-tailed shadow creature"],
    motifs: ["lantern wisp", "veil fringe", "floating charm"],
    habitat: "quiet ruins under moonlight",
    promptDescriptors: ["soft drifting wisps", "translucent edges", "gentle inner glow"]
  },
  Dragon: {
    type: "Dragon",
    primaryColors: ["deep jade", "storm blue", "burnished bronze"],
    accentColors: ["antique gold", "cloud ivory", "dark plum"],
    materials: ["overlapping scale", "brushed horn", "clouded jade", "silk-like mane"],
    bodyPlans: ["four-legged drake", "long-bodied river dragon", "winged cliff wyrm"],
    motifs: ["brow horns", "cloud mane", "ringed tail"],
    habitat: "high peaks above the cloudline",
    promptDescriptors: ["layered scales", "ancient carved shapes", "flowing whisker forms"]
  },
  Steel: {
    type: "Steel",
    primaryColors: ["brushed silver", "blue steel", "graphite gray"],
    accentColors: ["signal orange", "warm brass", "porcelain white"],
    materials: ["brushed alloy", "riveted plate", "forged iron", "polished ceramic"],
    bodyPlans: ["compact plated quadruped", "jointed mechanical insect", "broad-shouldered guardian"],
    motifs: ["hinged crest", "ringed armor plates", "blade-shaped tail fin"],
    habitat: "quiet workshops among old stone",
    promptDescriptors: ["clean plate seams", "simple hinge details", "restrained metallic glints"]
  },
  Rock: {
    type: "Rock",
    primaryColors: ["warm granite", "sandstone tan", "slate blue"],
    accentColors: ["lichen green", "quartz rose", "chalk cream"],
    materials: ["layered shale", "rounded river rock", "rough granite", "crystalline geode"],
    bodyPlans: ["low-slung stone grazer", "tortoise-like crawler", "broad-clawed burrower"],
    motifs: ["crystal brow", "strata bands", "pebble mantle"],
    habitat: "sunlit canyon shelves",
    promptDescriptors: ["visible stone strata", "faceted mineral inclusions", "weighty grounded shapes"]
  },
  Ground: {
    type: "Ground",
    primaryColors: ["ochre sand", "clay red", "dry earth brown"],
    accentColors: ["desert sage", "chalk cream", "sun-baked orange"],
    materials: ["packed earth", "woven root", "sand-polished shell", "clay"],
    bodyPlans: ["wide-pawed burrower", "long-legged dune runner", "armored ground crawler"],
    motifs: ["dust plume tail", "burrowing brow", "dune ridge markings"],
    habitat: "sheltered red-earth ravines",
    promptDescriptors: ["dust-soft edges", "earth-layer markings", "sturdy digging limbs"]
  },
  Poison: {
    type: "Poison",
    primaryColors: ["orchid purple", "deep teal", "berry magenta"],
    accentColors: ["acid lime", "pale lilac", "charcoal"],
    materials: ["smooth amphibian skin", "glossy resin", "spotted membrane", "dark glass"],
    bodyPlans: ["low amphibious crawler", "curled burrowing serpent", "many-legged dusk hunter"],
    motifs: ["warning spots", "droplet crest", "spined collar"],
    habitat: "humid shade beside mineral springs",
    promptDescriptors: ["bold warning marks", "glossy color patches", "contained luminous droplets"]
  },
  Psychic: {
    type: "Psychic",
    primaryColors: ["soft amethyst", "rose quartz", "blue lavender"],
    accentColors: ["starlight cream", "deep indigo", "silver pink"],
    materials: ["smooth opal", "soft velvet", "floating crystal", "silk"],
    bodyPlans: ["upright observant familiar", "hovering round-bodied seer", "long-limbed lunar creature"],
    motifs: ["third-eye jewel", "orbiting beads", "fan-shaped brow"],
    habitat: "still gardens at twilight",
    promptDescriptors: ["balanced geometric marks", "subtle floating forms", "calm focused gaze"]
  },
  Dark: {
    type: "Dark",
    primaryColors: ["ink navy", "charcoal plum", "deep forest black"],
    accentColors: ["ember magenta", "pale moon gray", "muted crimson"],
    materials: ["matte fur", "smoked glass", "soft shadow cloth", "dark horn"],
    bodyPlans: ["quiet stalking quadruped", "long-eared nocturnal runner", "slender cave glider"],
    motifs: ["crescent brow", "shadow mantle", "notched tail"],
    habitat: "sheltered cedar groves after dusk",
    promptDescriptors: ["clear dark-on-light edge design", "crescent markings", "controlled shadow shapes"]
  },
  Fairy: {
    type: "Fairy",
    primaryColors: ["blossom pink", "soft lilac", "spring mint"],
    accentColors: ["butter yellow", "pearl white", "bluebell"],
    materials: ["fine petal", "silk ribbon", "opal shell", "soft down"],
    bodyPlans: ["tiny winged woodland friend", "deer-like meadow spirit", "hovering flower-bodied sprite"],
    motifs: ["petal crown", "ribbon tail", "bell-flower wings"],
    habitat: "flowering meadows after a light rain",
    promptDescriptors: ["delicate petal layers", "small luminous dust motes", "gentle rounded details"]
  },
  Fighting: {
    type: "Fighting",
    primaryColors: ["warm umber", "brick red", "storm gray"],
    accentColors: ["cream wraps", "cobalt blue", "sun-gold"],
    materials: ["dense fur", "woven training wraps", "tough hide", "matte horn"],
    bodyPlans: ["balanced martial quadruped", "upright nimble climber", "compact grappling beast"],
    motifs: ["wrapped forearms", "brow guard", "stance stripes"],
    habitat: "terraced training grounds at dawn",
    promptDescriptors: ["clear athletic joints", "grounded balance", "purposeful martial shapes"]
  },
  Normal: {
    type: "Normal",
    primaryColors: ["warm cream", "soft chestnut", "cloud gray"],
    accentColors: ["meadow green", "coral pink", "honey gold"],
    materials: ["short soft fur", "smooth shell", "downy feather", "polished wood"],
    bodyPlans: ["familiar small quadruped", "nimble woodland mammal", "rounded garden bird"],
    motifs: ["cheek tufts", "ringed tail", "soft forehead crest"],
    habitat: "hedgerows beside a quiet path",
    promptDescriptors: ["clear readable markings", "friendly anatomy", "natural unembellished details"]
  }
});

export const TYPE_NAMES = Object.freeze(Object.keys(TYPE_THEMES));

export const EYE_COLORS = Object.freeze([
  "amber", "aqua", "blue-gray", "copper", "crystal green", "deep teal", "gold", "ice blue",
  "indigo", "lavender", "mint", "moon silver", "orange", "rose", "violet", "warm brown"
]);

export const COMPATIBILITY_RULES = Object.freeze({
  Fire: {
    forbiddenHabitats: ["underwater ocean trench", "deep coral reef", "glacial ice cavern"],
    preferredBodyPlans: ["quadrupedal ember beast", "long-bodied salamander", "avian spark raptor"]
  },
  Water: {
    forbiddenHabitats: ["active magma chamber", "arid desert badlands"],
    preferredBodyPlans: ["streamlined piscine swimmer", "serpentine river creature", "web-footed marine mammal"]
  },
  Grass: {
    forbiddenHabitats: ["barren salt flat", "deep magma chamber"],
    preferredBodyPlans: ["compact woodland quadruped", "branch-limbed forest creature", "long-eared meadow runner"]
  },
  Electric: {
    forbiddenHabitats: ["deep ocean trench", "sealed stone cavern"],
    preferredBodyPlans: ["spring-legged runner", "wide-eyed tree climber", "swift avian glider"]
  },
  Ice: {
    forbiddenHabitats: ["active magma chamber", "humid jungle basin"],
    preferredBodyPlans: ["sturdy snowfield quadruped", "rounded burrowing mammal", "long-necked alpine bird"]
  },
  Flying: {
    forbiddenHabitats: ["deep underground cavern"],
    preferredBodyPlans: ["wide-winged glider", "slim sky runner", "soaring long-tailed bird"]
  },
  Bug: {
    forbiddenHabitats: ["open magma vent"],
    preferredBodyPlans: ["six-limbed crawler", "wing-cased beetle", "soft-bodied caterpillar"]
  },
  Ghost: {
    forbiddenHabitats: [],
    preferredBodyPlans: ["floating hooded wisp", "small hovering familiar", "long-tailed shadow creature"]
  },
  Dragon: {
    forbiddenHabitats: [],
    preferredBodyPlans: ["four-legged drake", "long-bodied river dragon", "winged cliff wyrm"]
  },
  Steel: {
    forbiddenHabitats: ["open magma vent"],
    preferredBodyPlans: ["compact plated quadruped", "jointed mechanical insect", "broad-shouldered guardian"]
  },
  Rock: {
    forbiddenHabitats: ["open ocean"],
    preferredBodyPlans: ["low-slung stone grazer", "tortoise-like crawler", "broad-clawed burrower"]
  },
  Ground: {
    forbiddenHabitats: ["open ocean", "high cloudline"],
    preferredBodyPlans: ["wide-pawed burrower", "long-legged dune runner", "armored ground crawler"]
  },
  Poison: {
    forbiddenHabitats: [],
    preferredBodyPlans: ["low amphibious crawler", "curled burrowing serpent", "many-legged dusk hunter"]
  },
  Psychic: {
    forbiddenHabitats: [],
    preferredBodyPlans: ["upright observant familiar", "hovering round-bodied seer", "long-limbed lunar creature"]
  },
  Dark: {
    forbiddenHabitats: [],
    preferredBodyPlans: ["quiet stalking quadruped", "long-eared nocturnal runner", "slender cave glider"]
  },
  Fairy: {
    forbiddenHabitats: ["active magma chamber"],
    preferredBodyPlans: ["tiny winged woodland friend", "deer-like meadow spirit", "hovering flower-bodied sprite"]
  },
  Fighting: {
    forbiddenHabitats: [],
    preferredBodyPlans: ["balanced martial quadruped", "upright nimble climber", "compact grappling beast"]
  },
  Normal: {
    forbiddenHabitats: [],
    preferredBodyPlans: ["familiar small quadruped", "nimble woodland mammal", "rounded garden bird"]
  }
});

const BASE_STAGE_RULES = [
  {
    stage: 1,
    progressionRank: 1,
    role: "Baby / Base",
    massMultiplier: 0.55,
    shapeDominance: "soft circles and curves",
    bodyStructure: "compact low-to-ground body with a large head-to-body ratio",
    eyeStyle: "large round {eyeColor} eyes",
    expressionOptions: ["curious and playful", "brightly curious", "gentle and eager"],
    poseOptions: ["sits with a curious head tilt", "takes a small tentative step", "curls into a compact alert pose"],
    motifScaling: "one small undeveloped anchor motif",
    appendageStyle: "short tucked-in appendages",
    complexity: "simple silhouette with very few small details",
    paletteDistribution: { primary: 60, secondary: 30, accent: 10 }
  },
  {
    stage: 2,
    progressionRank: 2,
    role: "Intermediate",
    massMultiplier: 1,
    shapeDominance: "trapezoids and polygon-curve hybrids",
    bodyStructure: "elongated torso with clearly defined joints and a medium head-to-body ratio",
    eyeStyle: "semi-angular {eyeColor} eyes",
    expressionOptions: ["alert and focused", "confidently watchful", "curious with new confidence"],
    poseOptions: ["stands in an alert three-quarter pose", "leans forward ready to move", "plants its feet and studies the horizon"],
    motifScaling: "duplicated or lengthened anchor motifs",
    appendageStyle: "partly developed functional appendages",
    complexity: "medium silhouette complexity with a few clear structural details",
    paletteDistribution: { primary: 55, secondary: 30, accent: 15 }
  },
  {
    stage: 3,
    progressionRank: 3,
    role: "Final / Adult",
    massMultiplier: 1.55,
    shapeDominance: "sharp triangles, strong diagonals, and jagged angles",
    bodyStructure: "broad mature silhouette with a powerful chest and a smaller head-to-body ratio",
    eyeStyle: "smaller sharp {eyeColor} eyes",
    expressionOptions: ["fierce and dominant", "calmly formidable", "wise with a commanding gaze"],
    poseOptions: ["holds an imposing battle-ready stance", "turns with a broad protective silhouette", "sets its large appendages in a dramatic display"],
    motifScaling: "mature, expanded, or weaponized anchor motif",
    appendageStyle: "large mature appendages that widen the silhouette",
    complexity: "high but cleanly grouped silhouette complexity",
    paletteDistribution: { primary: 50, secondary: 30, accent: 20 }
  }
];

const makeRules = (special = {}) => BASE_STAGE_RULES.map((rule) => ({
  ...rule,
  ...special[rule.stage],
  paletteDistribution: { ...rule.paletteDistribution }
}));

export const EVOLUTION_ARCHETYPES = Object.freeze([
  { id: "LINEAR_2_STAGE", name: "Linear 2-Stage Progression", totalStages: 2, branching: false, stageRules: makeRules() },
  { id: "LINEAR_3_STAGE", name: "Linear 3-Stage Progression", totalStages: 3, branching: false, stageRules: makeRules() },
  { id: "BRANCHING", name: "Branching Potential", totalStages: 3, branching: true, stageRules: makeRules() },
  {
    id: "METAMORPHOSIS",
    name: "Metamorphosis",
    totalStages: 3,
    branching: false,
    stageRules: makeRules({
      1: {
        role: "Larva / Base",
        massMultiplier: 0.45,
        bodyStructure: "soft compact larval body with a large rounded head and tiny tucked limbs",
        eyeStyle: "large round larval eyes in the shared family eye color",
        motifScaling: "one small larval version of the anchor motif",
        appendageStyle: "short soft larval appendages",
        complexity: "simple larval silhouette with very few small details"
      },
      2: {
        role: "Chrysalis / Transition",
        bodyStructure: "a hard closed chrysalis grown from the same body plan, with most limbs and features concealed",
        eyeStyle: "the shared eye color glows faintly through a narrow shell seam",
        expressionOptions: ["still and quietly luminous", "sealed in a calm cocoon"],
        poseOptions: ["hangs from a short sturdy thread", "rests upright in a protective shell"],
        motifScaling: "the anchor motif is etched as a repeated shell ridge",
        appendageStyle: "little or no visible limbs beneath the shell",
        complexity: "clean chrysalis silhouette with layered shell plates"
      }
    })
  },
  { id: "ARMOR_SHELL_GROWTH", name: "Armor Shell Growth", totalStages: 3, branching: false, stageRules: makeRules({
    2: { motifScaling: "anchor motif echoed across new shell plates", appendageStyle: "sturdy jointed appendages beginning to show" },
    3: { motifScaling: "anchor motif matured into a fitted armor crown or shield", appendageStyle: "large plated appendages framing the body" }
  }) },
  { id: "MEGA_ALTERNATE", name: "Alternate Final Form", totalStages: 2, branching: false, stageRules: makeRules({
    3: { role: "Alternate Final / Adult", motifScaling: "anchor motif amplified into a dramatic alternate crest", complexity: "high detail grouped into a readable alternate silhouette" }
  }) },
  { id: "REGIONAL_VARIANT", name: "Regional Adaptation", totalStages: 2, branching: false, stageRules: makeRules({
    3: { role: "Regional Final / Adult", motifScaling: "anchor motif maturely adapted to the new habitat", complexity: "high but coherent habitat-adapted detail" }
  }) },
  { id: "CONVERGENT_LINE", name: "Convergent Family Line", totalStages: 3, branching: false, stageRules: makeRules() }
]);

export const CONCEPT_SEED_BLUEPRINTS = Object.freeze([
  ["woodland", "fox", "Fire", ["lantern ember", "charcoal brush"], ["flame ear crest", "coal-tipped tail"], ["fox", "lantern", "ember"]],
  ["amphibians", "salamander", "Fire", ["kiln pebble", "soot scarf"], ["warm stone frill", "smoke-ring tail"], ["salamander", "kiln", "soot"]],
  ["birds", "kite lizard", "Fire", ["furnace bell", "copper vane"], ["ember sail", "bell-shaped brow"], ["glider", "copper", "spark"]],
  ["waterlife", "river otter", "Water", ["rain drum", "river lantern"], ["current ribbon", "shell-bell collar"], ["otter", "rain", "river"]],
  ["waterlife", "manta ray", "Water", ["tideglass mirror", "mooncurrent"], ["wing-tip eye marks", "crescent fin"], ["manta", "tideglass", "moon"]],
  ["birds", "reed heron", "Water", ["reed bell", "mist ribbon"], ["long water crest", "ripple tail"], ["heron", "reed", "mist"]],
  ["woodland", "moth hare", "Grass", ["seed lantern", "fern lace"], ["leaf-wing mantle", "seed-pod brow"], ["hare", "seed", "fern"]],
  ["woodland", "orchard stag", "Grass", ["orchard key", "moss medallion"], ["branching leaf antler", "moss collar"], ["stag", "orchard", "moss"]],
  ["woodland", "meadow hare", "Grass", ["clover compass", "vine tassel"], ["clover forehead mark", "paired vine tail"], ["meadow", "clover", "vine"]],
  ["amphibians", "glass frog", "Electric", ["storm marble", "copper whiskers"], ["charged cheek spots", "forked spark crest"], ["frog", "marble", "copper"]],
  ["birds", "swift", "Electric", ["thunder thread", "static feather"], ["zigzag flight feathers", "arc-shaped tail"], ["swift", "thunder", "static"]],
  ["woodland", "tree ferret", "Electric", ["amber coil", "cloud battery"], ["coiled tail ring", "bright antenna tufts"], ["ferret", "amber", "coil"]],
  ["alpine", "snow seal", "Ice", ["snow quartz", "frost ribbon"], ["crystal brow", "frost fringe"], ["seal", "quartz", "frost"]],
  ["birds", "alpine owl", "Ice", ["glacier lantern", "blue snow bell"], ["feathered ice crown", "snow-ring wing spots"], ["owl", "glacier", "snowbell"]],
  ["woodland", "winter marmot", "Ice", ["frozen pinecone", "ice scarf"], ["pinecone mantle", "crystal tail tip"], ["marmot", "pine", "crystal"]],
  ["birds", "cliff falcon", "Flying", ["cloud compass", "sunset pennant"], ["swept feather crest", "long tail streamer"], ["falcon", "cloud", "pennant"]],
  ["birds", "kite swallow", "Flying", ["wind spool", "sky ribbon"], ["forked ribbon tail", "wind-scoop wings"], ["swallow", "spool", "ribbon"]],
  ["mammals", "gliding squirrel", "Flying", ["breeze sail", "rainbow seed"], ["broad glide membrane", "seed-shaped shoulder marks"], ["squirrel", "breeze", "glide"]],
  ["insects", "stag beetle", "Bug", ["bark helmet", "dew lens"], ["single horn crest", "clear wing-case spots"], ["beetle", "bark", "dew"]],
  ["insects", "luna moth", "Bug", ["silk lantern", "moon cocoon"], ["soft antenna fans", "crescent wing marks"], ["moth", "silk", "luna"]],
  ["insects", "garden mantis", "Bug", ["leaf scissors", "pollen thimble"], ["folded leaf forearms", "pollen crest"], ["mantis", "leaf", "pollen"]],
  ["spirits", "lantern fox", "Ghost", ["paper lantern", "lost bell"], ["floating lantern wisp", "bell-tipped tail"], ["lantern", "fox", "bell"]],
  ["waterlife", "cave jelly", "Ghost", ["echo pearl", "hollow moon"], ["mist veil fringe", "floating pearl lights"], ["jelly", "echo", "hollow"]],
  ["woodland", "shadow deer", "Ghost", ["old key", "quiet candle"], ["key-shaped brow", "candle-wisp antlers"], ["deer", "quiet", "candle"]],
  ["mythic", "cloud drake", "Dragon", ["storm-scroll", "jade cloud"], ["cloud mane", "ringed tail"], ["drake", "storm", "cloud"]],
  ["mythic", "river wyrm", "Dragon", ["rain-drum scale", "bridge ribbon"], ["river pearl whiskers", "bridge-arch horns"], ["wyrm", "river", "bridge"]],
  ["mythic", "mountain wyvern", "Dragon", ["peak bell", "thunderstone"], ["peak-shaped horns", "storm vane wings"], ["wyvern", "peak", "thunderstone"]],
  ["insects", "iron badger", "Steel", ["hinge acorn", "brass thimble"], ["hinged brow plate", "ringed shoulder armor"], ["badger", "hinge", "brass"]],
  ["birds", "tin crane", "Steel", ["folded compass", "rivet flower"], ["folded metal crest", "rivet wing dots"], ["crane", "compass", "rivet"]],
  ["insects", "clock beetle", "Steel", ["clockwork seed", "porcelain shield"], ["gear-shell spots", "porcelain horn"], ["clock", "gear", "porcelain"]],
  ["alpine", "canyon ram", "Rock", ["quartz bell", "strata scarf"], ["crystal brow", "layered stone horns"], ["ram", "quartz", "strata"]],
  ["waterlife", "river tortoise", "Rock", ["geode shell", "pebble drum"], ["geode shell crown", "smooth pebble bands"], ["tortoise", "geode", "pebble"]],
  ["mammals", "granite mole", "Rock", ["flint thimble", "lichen crown"], ["stone-claw fan", "lichen brow ridge"], ["mole", "flint", "lichen"]],
  ["desert", "dune fennec", "Ground", ["sand compass", "clay jar"], ["dune-ridge ears", "dust plume tail"], ["fennec", "dune", "clay"]],
  ["amphibians", "burrowing newt", "Ground", ["root map", "mud bell"], ["rooted brow crest", "earth-ring tail"], ["newt", "root", "mud"]],
  ["mammals", "armored pangolin", "Ground", ["terracotta tile", "sandstone seed"], ["layered clay mantle", "dune-shell scales"], ["pangolin", "terracotta", "sandstone"]],
  ["amphibians", "orchid newt", "Poison", ["bitterberry charm", "mineral drop"], ["droplet crest", "warning blossom spots"], ["newt", "berry", "mineral"]],
  ["reptiles", "vine viper", "Poison", ["glass vial", "night orchid"], ["spined flower collar", "striped vine tail"], ["viper", "vial", "orchid"]],
  ["insects", "cave spider", "Poison", ["glow web spool", "moss bead"], ["silk-drop abdomen", "paired warning marks"], ["spider", "glowweb", "moss"]],
  ["birds", "dream owl", "Psychic", ["orbiting seed", "star mirror"], ["orbiting brow beads", "fan-shaped forehead mark"], ["owl", "orbit", "starmirror"]],
  ["woodland", "moon cat", "Psychic", ["quiet teacup", "silver thread"], ["crescent forehead jewel", "floating thread loops"], ["cat", "moon", "thread"]],
  ["spirits", "thoughtful lemur", "Psychic", ["memory prism", "folded paper star"], ["prism brow", "starry tail rings"], ["lemur", "prism", "memory"]],
  ["birds", "raven", "Dark", ["ink feather", "eclipse button"], ["eclipse brow", "notched shadow tail"], ["raven", "ink", "eclipse"]],
  ["mammals", "cave fox", "Dark", ["midnight thimble", "shadow scarf"], ["shadow mantle", "crescent cheek mark"], ["fox", "midnight", "shadow"]],
  ["waterlife", "deep cave eel", "Dark", ["dark current coin", "cavern ribbon"], ["notched dorsal crest", "moonless ring markings"], ["eel", "cavern", "current"]],
  ["woodland", "blossom moth", "Fairy", ["petal compass", "bellflower bead"], ["petal crown", "bell-shaped wing tips"], ["moth", "blossom", "petal"]],
  ["mythic", "meadow fawn", "Fairy", ["ribbon thistle", "dewglass charm"], ["flowering brow crown", "ribbon tail"], ["fawn", "dewglass", "thistle"]],
  ["birds", "hummingbird", "Fairy", ["pollen lantern", "rainbow bell"], ["bell-flower throat", "petal-edged wings"], ["hummingbird", "pollen", "bellflower"]],
  ["birds", "training crane", "Fighting", ["wrap spool", "dawn pebble"], ["wrapped wing joints", "balanced brow guard"], ["crane", "wrap", "dawn"]],
  ["woodland", "hill boar", "Fighting", ["stone fist charm", "red-clay drum"], ["brow guard", "stance stripe markings"], ["boar", "stonefist", "clay"]],
  ["alpine", "ridge goat", "Fighting", ["summit bell", "woven wrist cord"], ["ringed horn guard", "knotted ankle wraps"], ["goat", "summit", "cord"]],
  ["birds", "hedgerow wren", "Normal", ["button seed", "woven nest ring"], ["cheek tufts", "nest-ring tail"], ["wren", "button", "nest"]],
  ["mammals", "garden raccoon", "Normal", ["acorn cup", "berry basket"], ["soft eye mask", "ringed basket tail"], ["raccoon", "acorn", "berry"]]
]);

export const CONCEPT_SEEDS = Object.freeze(CONCEPT_SEED_BLUEPRINTS.flatMap((blueprint, index) => {
  const [category, animal, type, concepts, motifs, tags] = blueprint;
  return concepts.map((concept, variantIndex) => ({
    id: "seed_" + String(index * 2 + variantIndex + 1).padStart(3, "0"),
    category,
    animal,
    concept,
    type,
    motif: motifs[variantIndex],
    nameRoot: tags[variantIndex],
    tags: [animal, concept, type.toLowerCase(), ...tags]
  }));
}));

export const ENGLISH_NAME_PARTS = Object.freeze({
  prefixes: ["Aster", "Bramble", "Cinder", "Dapple", "Dew", "Fable", "Fallow", "Flint", "Glimmer", "Juniper", "Lumen", "Maple", "Mallow", "Mica", "Morrow", "Nettle", "Pebble", "Pollen", "Ripple", "Sable", "Thistle", "Tumble", "Velvet", "Willow"],
  stageSuffixes: {
    1: ["ling", "pup", "bud", "let", "mite", "kit", "sprout"],
    2: ["tor", "drake", "crest", "wing", "shell", "fang", "tail", "claw"],
    3: ["king", "titan", "sovereign", "maw", "vortex", "behemoth", "dread", "blade", "lord"]
  }
});

export const KATAKANA_NAME_PARTS = Object.freeze({
  starts: ["アオ", "アカ", "キラ", "クモ", "コハ", "サラ", "シオ", "スミ", "ソラ", "タマ", "ツキ", "ナギ", "ニワ", "ハル", "ヒカ", "フワ", "ホシ", "マメ", "ミズ", "モリ", "ユキ", "ヨル", "リク", "ルリ"],
  middles: ["ネ", "リ", "ト", "ミ", "ハ", "ロ", "ナ", "キ", "モ", "セ", "ユ", "ラ"],
  stageSuffixes: {
    1: ["ッコ", "ル", "リン", "ポ"],
    2: ["タ", "リオ", "ネス", "ド"],
    3: ["ガン", "ゼン", "リュウ", "オン"]
  }
});

export const FLAVOR_TEXT_TEMPLATES = Object.freeze({
  1: [
    "It gathers {concept} near {habitat}, then keeps its small {motif} tucked close while it naps.",
    "A curious {animal}, it follows faint sounds through {habitat}, letting its {motif} catch the breeze.",
    "A soft glow from its {motif} marks familiar paths home through {habitat}."
  ],
  2: [
    "As it grows, it learns the currents of {habitat}, using its expanded {motif} to signal its family.",
    "It practices steady, deliberate movements and uses its {motif} to protect the places where {concept} is found.",
    "Its alert gaze can spot a change in {habitat} long before smaller members of its family."
  ],
  3: [
    "In maturity, its {motif} can be seen across {habitat}, where it calmly guards the family paths.",
    "Old stories say this creature guides younger kin safely through {habitat} with a sweeping display of {motif}.",
    "It returns to {habitat} each season, leaving a quiet trail of {concept} for its family to discover."
  ]
});

export const MOTIF_ESCALATION_TEMPLATES = Object.freeze({
  1: ["small and rounded {motif}", "soft, compact {motif}", "early-stage {motif}"],
  2: ["lengthened, duplicated {motif}", "paired {motif} with clearer edges", "broader silhouette traced by {motif}"],
  3: ["mature, weaponized {motif}", "broad crown-like silhouette formed by {motif}", "fully developed {motif}"]
});

export const EVOLUTION_STYLE_TEMPLATES = Object.freeze({
  singleStage: [
    "Original monster collecting game concept art",
    "Stage {stageNumber} {role} {typeLabel} creature from one coherent family inspired by {concept}",
    "{bodyPlan}; {massDescription}; {bodyStructure}; {shapeDominance}",
    "distinctive {motifDetail}; shared family anchor motif: {anchorMotif}",
    "{paletteDistribution} palette using {primaryColor}, {secondaryColor}, and {accentColor}",
    "{eyeStyle}; {expression}; {pose}",
    "consistent {baseMaterial} and {materialDetails}",
    "{style}"
  ],
  fullSheet: "Original {stageCount}-stage evolution character sheet of one {typeLabel} creature family inspired by {concept}; clean left-to-right progression; {stageDirections}; shared {primaryColor}, {secondaryColor}, and {accentColor} palette; the same recognizable {anchorMotif} on every stage; directional arrows between stages; clean off-white studio sheet; flat color character-sheet layout; bold clean anime lineart; solid color fills; clear even spacing",
  dex: "Original creature index encyclopedia card for a {stageCount}-stage {typeLabel} family on a 16:9 horizontal canvas; off-white background; left-to-right stages with directional arrows; rounded information bubbles; Japanese and English stage names; small type badges; original dex number {dexNumber}; short flavor text; flat vector anime UI layout; bold clean lineart; no franchise logos or copied characters",
  style: "flat cel-shaded anime character sheet, bold clean anime lineart, solid color fills, clean off-white studio background, readable silhouette, polished concept-art quality"
});

export const FORBIDDEN_FRANCHISE_TERMS = Object.freeze([
  "Pokémon",
  "Pokemon",
  "Pikachu",
  "Charmander",
  "Nintendo",
  "Game Freak",
  "Pokédex",
  "Pokedex",
  "Sugimori"
]);
