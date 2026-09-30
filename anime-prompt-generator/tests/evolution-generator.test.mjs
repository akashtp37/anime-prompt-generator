// Zero-dependency tests for the coherent evolution-line generator.
// Usage: node tests/evolution-generator.test.mjs

import assert from "node:assert/strict";
import {
  CONCEPT_SEEDS,
  EVOLUTION_ARCHETYPES,
  FORBIDDEN_FRANCHISE_TERMS,
  TYPE_NAMES
} from "../js/evolution-data.js";
import { EvolutionPromptGenerator } from "../js/evolution-generator.js";

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log("✔ " + name);
  } catch (error) {
    failed += 1;
    console.error("✘ " + name + "\n  " + error.message);
  }
}

function seededRandom(seed = 73521) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

function makeGenerator(seed) {
  let clock = 1_750_000_000_000;
  return new EvolutionPromptGenerator({
    random: seededRandom(seed),
    now: () => ++clock
  });
}

function sampleOptions(stages = 3, extra = {}) {
  return {
    stages,
    evolutionType: stages === 2 ? "LINEAR_2_STAGE" : "LINEAR_3_STAGE",
    primaryType: "Fire",
    secondaryType: "none",
    ...extra
  };
}

test("the replacement concept pool contains exactly 106 original seed records", () => {
  assert.equal(CONCEPT_SEEDS.length, 106);
  assert.equal(new Set(CONCEPT_SEEDS.map((seed) => seed.id)).size, 106);
  assert.ok(CONCEPT_SEEDS.every((seed) =>
    seed.id && seed.animal && seed.concept && seed.type && seed.motif && seed.tags.length
  ));
});

test("all 18 requested primary types have compatible concept seeds", () => {
  assert.deepEqual(TYPE_NAMES, [
    "Fire", "Water", "Grass", "Electric", "Ice", "Flying", "Bug", "Ghost", "Dragon",
    "Steel", "Rock", "Ground", "Poison", "Psychic", "Dark", "Fairy", "Fighting", "Normal"
  ]);
  for (const type of TYPE_NAMES) {
    assert.ok(CONCEPT_SEEDS.some((seed) => seed.type === type), "missing seed for " + type);
  }
});

test("two-stage line has a baby and mature stage with two-stage palette ratios", () => {
  const generator = makeGenerator();
  const line = generator.generateLine(sampleOptions(2));
  assert.equal(line.mode, "evolution");
  assert.equal(line.stages.length, 2);
  assert.equal(line.stages[0].role, "Baby / Base");
  assert.equal(line.stages[1].role, "Final / Adult");
  assert.deepEqual(line.stages[0].traits.paletteDistribution, { primary: 60, secondary: 30, accent: 10 });
  assert.deepEqual(line.stages[1].traits.paletteDistribution, { primary: 55, secondary: 30, accent: 15 });
  assert.ok(line.fullSheetPrompt.includes("Stage 1 on the left"));
  assert.ok(line.fullSheetPrompt.includes("Stage 2 on the right"));
  assert.ok(!line.fullSheetPrompt.includes("Stage 3"));
});

test("three-stage line carries one family through base, intermediate, and adult shapes", () => {
  const line = makeGenerator(91).generateLine(sampleOptions(3));
  assert.equal(line.stages.length, 3);
  assert.deepEqual(line.stages.map((stage) => stage.role), ["Baby / Base", "Intermediate", "Final / Adult"]);
  assert.deepEqual(line.stages.map((stage) => stage.traits.paletteDistribution), [
    { primary: 60, secondary: 30, accent: 10 },
    { primary: 55, secondary: 30, accent: 15 },
    { primary: 50, secondary: 30, accent: 20 }
  ]);
  for (const stage of line.stages) {
    assert.equal(stage.traits.bodyPlan, line.sharedTraits.bodyPlan);
    assert.equal(stage.traits.eyeColor, line.sharedTraits.eyeColor);
    assert.ok(stage.prompt.includes(line.sharedTraits.anchorMotif));
    assert.ok(stage.prompt.includes(line.sharedTraits.primaryColor));
    assert.ok(stage.prompt.includes(line.sharedTraits.secondaryColor));
  }
  assert.ok(line.fullSheetPrompt.includes("Stage 1 on the left"));
  assert.ok(line.fullSheetPrompt.includes("Stage 2 in the center"));
  assert.ok(line.fullSheetPrompt.includes("Stage 3 on the right"));
});

test("metamorphosis uses a larva, a hard chrysalis, and a complex adult", () => {
  const line = makeGenerator(23).generateLine({
    ...sampleOptions(3),
    evolutionType: "METAMORPHOSIS"
  });
  assert.equal(line.archetype.id, "METAMORPHOSIS");
  assert.match(line.stages[1].traits.bodyStructure, /hard closed chrysalis/i);
  assert.match(line.stages[1].traits.eyeStyle, /shell seam/i);
  assert.match(line.stages[2].traits.bodyStructure, /broad mature silhouette/i);
});

test("family locks preserve type, palette, eyes, motif, body plan, and material", () => {
  const generator = makeGenerator(77);
  const first = generator.generateLine(sampleOptions(3));
  const next = generator.generateLine({
    ...sampleOptions(3),
    primaryType: "Water",
    secondaryType: "Ice",
    previousLine: first,
    familyLocks: {
      type: true,
      palette: true,
      eyeColor: true,
      anchorMotif: true,
      bodyPlan: true,
      material: true
    }
  });
  for (const key of [
    "primaryType", "secondaryType", "primaryColor", "secondaryColor", "accentColor",
    "eyeColor", "anchorMotif", "bodyPlan", "baseMaterial"
  ]) {
    assert.equal(next.sharedTraits[key], first.sharedTraits[key], "family lock failed for " + key);
  }
});

test("stage locks preserve selected poses, expressions, and motif details", () => {
  const generator = makeGenerator(104);
  const first = generator.generateLine(sampleOptions(3));
  const stageLocks = {
    1: { pose: true, expression: true, motifDetail: true },
    2: { pose: true, expression: true, motifDetail: true },
    3: { pose: true, expression: true, motifDetail: true }
  };
  const next = generator.generateLine({
    ...sampleOptions(3),
    previousLine: first,
    stageLocks
  });
  first.stages.forEach((stage, index) => {
    assert.deepEqual(
      {
        pose: next.stages[index].traits.pose,
        expression: next.stages[index].traits.expression,
        motifDetail: next.stages[index].traits.motifDetail
      },
      {
        pose: stage.traits.pose,
        expression: stage.traits.expression,
        motifDetail: stage.traits.motifDetail
      }
    );
  });
});

test("unlocked stage traits change on reroll while the family remains coherent", () => {
  const generator = makeGenerator(9923);
  const first = generator.generateLine(sampleOptions(3));
  const next = generator.generateLine({
    ...sampleOptions(3),
    previousLine: first,
    familyLocks: { type: true, palette: true, eyeColor: true, anchorMotif: true, bodyPlan: true, material: true }
  });
  assert.ok(first.stages.some((stage, index) =>
    stage.traits.pose !== next.stages[index].traits.pose ||
    stage.traits.expression !== next.stages[index].traits.expression ||
    stage.traits.motifDetail !== next.stages[index].traits.motifDetail
  ));
  assert.equal(next.sharedTraits.primaryType, first.sharedTraits.primaryType);
  assert.equal(next.sharedTraits.anchorMotif, first.sharedTraits.anchorMotif);
});

test("bilingual names and stage flavor text are generated", () => {
  const line = makeGenerator(154).generateLine(sampleOptions(3));
  assert.equal(new Set(line.stages.map((stage) => stage.names.english)).size, 3);
  assert.equal(new Set(line.stages.map((stage) => stage.names.japanese)).size, 3);
  for (const stage of line.stages) {
    assert.ok(stage.names.english.length > 0);
    assert.match(stage.names.japanese, /^[\u30A0-\u30FF]+$/);
    assert.ok(stage.flavorText.length > 0);
  }
});

test("single-stage, full-sheet, and Dex prompts are complete and original", () => {
  const generator = makeGenerator(188);
  const line = generator.generateLine(sampleOptions(3));
  assert.ok(line.stages.every((stage) => stage.prompt.includes("bold clean anime lineart")));
  assert.ok(line.fullSheetPrompt.includes("directional arrows"));
  assert.ok(line.fullSheetPrompt.includes("clean off-white studio sheet"));
  assert.ok(line.dexPrompt.includes("16:9 horizontal canvas"));
  assert.ok(line.dexPrompt.includes("Japanese and English stage names"));
  const combined = JSON.stringify(line).normalize("NFKD").toLowerCase();
  for (const term of FORBIDDEN_FRANCHISE_TERMS) {
    assert.ok(!combined.includes(term.normalize("NFKD").toLowerCase()), "forbidden term: " + term);
  }
  assert.equal(generator.validateEvolutionLine(line).valid, true);
});

test("every concept seed stays original and generates unique bilingual stage names", () => {
  const generator = makeGenerator(29017);
  for (const [index, seed] of CONCEPT_SEEDS.entries()) {
    const stages = index % 2 === 0 ? 2 : 3;
    const line = generator.generateLine({
      stages,
      evolutionType: stages === 2 ? "LINEAR_2_STAGE" : "LINEAR_3_STAGE",
      primaryType: "random",
      secondaryType: "none",
      conceptSeedId: seed.id
    });
    const serialized = JSON.stringify(line).normalize("NFKD").toLowerCase();
    assert.equal(line.stages.length, stages, "wrong stage count for " + seed.id);
    assert.equal(new Set(line.stages.map((stage) => stage.names.english)).size, stages);
    assert.equal(new Set(line.stages.map((stage) => stage.names.japanese)).size, stages);
    assert.equal(generator.validateEvolutionLine(line).valid, true, "invalid line for " + seed.id);
    for (const term of FORBIDDEN_FRANCHISE_TERMS) {
      assert.ok(
        !serialized.includes(term.normalize("NFKD").toLowerCase()),
        "forbidden term " + term + " in " + seed.id
      );
    }
  }
});

test("validation rejects missing names, broken palette continuity, and protected terms", () => {
  const generator = makeGenerator(451);
  const line = generator.generateLine(sampleOptions(2));
  const invalid = structuredClone(line);
  invalid.stages[0].names.english = "";
  invalid.stages[1].prompt = invalid.stages[1].prompt.replace(
    invalid.sharedTraits.primaryColor,
    ""
  );
  invalid.dexPrompt += " Nintendo";
  const result = generator.validateEvolutionLine(invalid);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("bilingual name")));
  assert.ok(result.errors.some((error) => error.includes("inherit")));
  assert.ok(result.errors.some((error) => error.includes("protected franchise")));
});

test("random archetype selection only returns a compatible stage count", () => {
  for (const count of [2, 3]) {
    const line = makeGenerator(count * 10).generateLine({ stages: count, primaryType: "random" });
    const archetype = EVOLUTION_ARCHETYPES.find((item) => item.id === line.archetype.id);
    assert.equal(archetype.totalStages, count);
    assert.equal(line.stages.length, count);
  }
});

console.log("\n" + passed + " passed, " + failed + " failed");
process.exit(failed > 0 ? 1 : 0);
