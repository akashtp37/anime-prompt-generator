// evolution-generator.js — Build one shared creature identity, then evolve it by stage.

import {
  COMPATIBILITY_RULES,
  CONCEPT_SEEDS,
  ENGLISH_NAME_PARTS,
  EVOLUTION_ARCHETYPES,
  EVOLUTION_STYLE_TEMPLATES,
  EYE_COLORS,
  FLAVOR_TEXT_TEMPLATES,
  FORBIDDEN_FRANCHISE_TERMS,
  KATAKANA_NAME_PARTS,
  MOTIF_ESCALATION_TEMPLATES,
  TYPE_NAMES,
  TYPE_THEMES
} from "./evolution-data.js";

const PALETTE_DISTRIBUTIONS = {
  1: { primary: 60, secondary: 30, accent: 10 },
  2: { primary: 55, secondary: 30, accent: 15 },
  3: { primary: 50, secondary: 30, accent: 20 }
};

const MAX_LINE_ATTEMPTS = 14;

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function capitalize(value) {
  const text = String(value ?? "");
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
}

function replaceTokens(template, values) {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_match, key) =>
    values[key] === undefined ? "" : String(values[key])
  );
}

function sameChoice(left, right) {
  if (left && right && typeof left === "object" && typeof right === "object") {
    return (left.id ?? left.name) === (right.id ?? right.name);
  }
  return left === right;
}

function paletteText(distribution) {
  return distribution.primary + "% primary / " +
    distribution.secondary + "% secondary / " +
    distribution.accent + "% accent";
}

function familyTypeLabel(sharedTraits) {
  return sharedTraits.secondaryType
    ? sharedTraits.primaryType + " / " + sharedTraits.secondaryType
    : sharedTraits.primaryType;
}

function getFinalStageRule(archetype, stageNumber, stageCount) {
  const sourceStage = stageCount === 2 && stageNumber === 2 ? 3 : stageNumber;
  const rule = archetype.stageRules.find((candidate) => candidate.stage === sourceStage);
  if (!rule) throw new Error("The selected evolution type is missing a stage rule.");
  return { ...rule, paletteDistribution: { ...PALETTE_DISTRIBUTIONS[stageNumber] } };
}

function hasForbiddenTerm(value) {
  const normalized = " " + normalizeText(value) + " ";
  return FORBIDDEN_FRANCHISE_TERMS.some((term) => {
    const normalizedTerm = normalizeText(term);
    return normalizedTerm && normalized.includes(" " + normalizedTerm + " ");
  });
}

function stableSignature(line) {
  return normalizeText((line.stages ?? []).map((stage) => stage.prompt).join("|"));
}

export class EvolutionPromptGenerator {
  constructor({ random = Math.random, now = Date.now } = {}) {
    this.random = random;
    this.now = now;
    this.seenSignatures = new Set();
  }

  getRandomItem(items, avoid = []) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Evolution data is missing a required choice.");
    }
    const candidates = items.filter((item) => !avoid.some((excluded) => sameChoice(item, excluded)));
    const pool = candidates.length > 0 ? candidates : items;
    const value = Number(this.random());
    const index = Math.min(pool.length - 1, Math.max(0, Math.floor(value * pool.length)));
    return pool[index];
  }

  selectCompatiblePalette(primaryType, secondaryType = null, options = {}) {
    const previous = options.previousTraits ?? {};
    if (options.locked && previous.primaryColor && previous.secondaryColor && previous.accentColor) {
      return {
        primaryColor: previous.primaryColor,
        secondaryColor: previous.secondaryColor,
        accentColor: previous.accentColor
      };
    }

    const primaryTheme = TYPE_THEMES[primaryType] ?? TYPE_THEMES.Normal;
    const secondaryTheme = secondaryType ? TYPE_THEMES[secondaryType] : primaryTheme;
    const primaryOptions = primaryTheme.primaryColors;
    const secondaryOptions = secondaryType
      ? secondaryTheme.primaryColors
      : primaryTheme.accentColors;
    const primaryColor = this.getRandomItem(primaryOptions, [previous.primaryColor]);
    let secondaryColor = this.getRandomItem(
      [...secondaryOptions, ...primaryTheme.accentColors],
      [primaryColor, previous.secondaryColor]
    );
    if (secondaryColor === primaryColor) {
      secondaryColor = this.getRandomItem(secondaryOptions, [primaryColor]);
    }
    const accentOptions = [...primaryTheme.accentColors, ...secondaryTheme.accentColors]
      .filter((color, index, colors) =>
        colors.indexOf(color) === index && color !== primaryColor && color !== secondaryColor
      );
    const accentColor = this.getRandomItem(accentOptions, [previous.accentColor]);
    return { primaryColor, secondaryColor, accentColor };
  }

  generateSharedTraits(options = {}) {
    const familyLocks = options.familyLocks ?? {};
    const previousTraits = options.previousTraits ?? {};
    const typeIsLocked = Boolean(familyLocks.type && previousTraits.primaryType);
    const requestedPrimary = options.primaryType;
    const requestedSecondary = TYPE_THEMES[options.secondaryType] ? options.secondaryType : null;
    const primaryType = typeIsLocked
      ? previousTraits.primaryType
      : TYPE_THEMES[requestedPrimary]
        ? requestedPrimary
        : this.getRandomItem(TYPE_NAMES, [previousTraits.primaryType, requestedSecondary]);

    let secondaryType;
    if (typeIsLocked) {
      secondaryType = previousTraits.secondaryType ?? null;
    } else if (TYPE_THEMES[options.secondaryType]) {
      secondaryType = options.secondaryType === primaryType ? null : options.secondaryType;
    } else if (options.secondaryType === "none") {
      secondaryType = null;
    } else {
      const secondaryOptions = TYPE_NAMES.filter((type) => type !== primaryType);
      secondaryType = this.getRandomItem(secondaryOptions, [previousTraits.secondaryType]);
    }

    let conceptSeed = CONCEPT_SEEDS.find((seed) => seed.id === options.conceptSeedId);
    if (!conceptSeed) {
      let seedOptions = CONCEPT_SEEDS.filter((seed) => seed.type === primaryType);
      if (seedOptions.length === 0) seedOptions = CONCEPT_SEEDS;
      conceptSeed = this.getRandomItem(seedOptions, [previousTraits.conceptSeed?.id]);
    }

    const primaryTheme = TYPE_THEMES[primaryType];
    const secondaryTheme = secondaryType ? TYPE_THEMES[secondaryType] : null;
    const palette = this.selectCompatiblePalette(primaryType, secondaryType, {
      locked: familyLocks.palette,
      previousTraits
    });
    const anchorChoices = [...new Set([
      conceptSeed.motif,
      ...primaryTheme.motifs,
      ...(secondaryTheme?.motifs ?? [])
    ])];
    const anchorMotif = familyLocks.anchorMotif && previousTraits.anchorMotif
      ? previousTraits.anchorMotif
      : previousTraits.anchorMotif
        ? this.getRandomItem(anchorChoices, [previousTraits.anchorMotif])
        : conceptSeed.motif;

    const compatibility = COMPATIBILITY_RULES[primaryType];
    const bodyPlanChoices = [...new Set([
      ...compatibility.preferredBodyPlans,
      ...primaryTheme.bodyPlans,
      ...(secondaryTheme?.bodyPlans ?? [])
    ])];
    const bodyPlan = familyLocks.bodyPlan && previousTraits.bodyPlan
      ? previousTraits.bodyPlan
      : this.getRandomItem(bodyPlanChoices, [previousTraits.bodyPlan]);

    const materialChoices = [
      ...primaryTheme.materials,
      ...(secondaryTheme?.materials ?? [])
    ];
    const baseMaterial = familyLocks.material && previousTraits.baseMaterial
      ? previousTraits.baseMaterial
      : this.getRandomItem(materialChoices, [previousTraits.baseMaterial]);

    const eyeColor = familyLocks.eyeColor && previousTraits.eyeColor
      ? previousTraits.eyeColor
      : this.getRandomItem(EYE_COLORS, [previousTraits.eyeColor]);
    const forbiddenHabitats = [
      ...compatibility.forbiddenHabitats,
      ...(secondaryType ? COMPATIBILITY_RULES[secondaryType].forbiddenHabitats : [])
    ];
    const compatibleHabitats = TYPE_NAMES.map((type) => TYPE_THEMES[type].habitat)
      .filter((habitat) => !forbiddenHabitats.includes(habitat));
    const habitat = forbiddenHabitats.includes(primaryTheme.habitat)
      ? this.getRandomItem(compatibleHabitats)
      : primaryTheme.habitat;

    return {
      primaryType,
      secondaryType,
      ...palette,
      eyeColor,
      anchorMotif,
      bodyPlan,
      baseMaterial,
      conceptSeed: { ...conceptSeed },
      habitat,
      typeDescriptors: [...primaryTheme.promptDescriptors]
    };
  }

  generateStages(sharedTraits, archetype, stageCount, options = {}) {
    const previousStages = options.previousStages ?? [];
    const stageLocks = options.stageLocks ?? {};
    const primaryTheme = TYPE_THEMES[sharedTraits.primaryType];
    const secondaryTheme = sharedTraits.secondaryType
      ? TYPE_THEMES[sharedTraits.secondaryType]
      : null;
    const accentProgress = {
      1: "a soft, restrained accent",
      2: "a brighter, more visible accent",
      3: "a concentrated, vivid accent"
    };

    return Array.from({ length: stageCount }, (_unused, index) => {
      const stageNumber = index + 1;
      const rule = getFinalStageRule(archetype, stageNumber, stageCount);
      const previousStage = previousStages.find((stage) => stage.stageNumber === stageNumber);
      const previousTraits = previousStage?.traits ?? {};
      const locks = stageLocks[stageNumber] ?? {};
      const motifOptions = MOTIF_ESCALATION_TEMPLATES[rule.progressionRank]
        .map((template) => replaceTokens(template, { motif: sharedTraits.anchorMotif }));
      const motifDetail = locks.motifDetail && previousTraits.motifDetail
        ? previousTraits.motifDetail
        : this.getRandomItem(motifOptions, [previousTraits.motifDetail]);
      const pose = locks.pose && previousTraits.pose
        ? previousTraits.pose
        : this.getRandomItem(rule.poseOptions, [previousTraits.pose]);
      const expression = locks.expression && previousTraits.expression
        ? previousTraits.expression
        : this.getRandomItem(rule.expressionOptions, [previousTraits.expression]);
      const materialDetails = this.getRandomItem(
        [...primaryTheme.promptDescriptors, ...(secondaryTheme?.promptDescriptors ?? [])],
        [previousTraits.materialDetails]
      );
      const massDescription = "mass about " + rule.massMultiplier.toFixed(2) +
        " times the base stage's body volume";
      const eyeStyle = rule.eyeStyle.replace("{eyeColor}", sharedTraits.eyeColor);

      return {
        stageNumber,
        role: rule.role,
        type: sharedTraits.primaryType,
        secondaryType: sharedTraits.secondaryType,
        rule,
        names: { english: "", japanese: "" },
        traits: {
          bodyPlan: sharedTraits.bodyPlan,
          bodyStructure: rule.bodyStructure,
          shapeDominance: rule.shapeDominance,
          eyeStyle,
          eyeColor: sharedTraits.eyeColor,
          expression,
          pose,
          motifDetail,
          materialDetails,
          accentIntensity: accentProgress[rule.progressionRank],
          massDescription,
          paletteDistribution: { ...rule.paletteDistribution },
          progressionRank: rule.progressionRank
        },
        flavorText: "",
        prompt: ""
      };
    });
  }

  generateBilingualNames(sharedTraits, stages, previousStages = []) {
    const seed = sharedTraits.conceptSeed;
    const root = String(seed.nameRoot || seed.animal)
      .replace(/[^a-zA-Z]/g, "")
      .toLowerCase();
    const oldFamilyPrefix = previousStages[0]?.names?.english?.split("-")[0];
    const englishPrefix = this.getRandomItem(ENGLISH_NAME_PARTS.prefixes, [oldFamilyPrefix]);
    const japaneseStart = this.getRandomItem(KATAKANA_NAME_PARTS.starts);
    const japaneseMiddle = this.getRandomItem(KATAKANA_NAME_PARTS.middles);
    const namesInLine = new Set();
    const japaneseNamesInLine = new Set();
    const oldEnglishNames = new Set(previousStages.map((stage) => normalizeText(stage.names?.english)));
    const oldJapaneseNames = new Set(previousStages.map((stage) => stage.names?.japanese));

    return stages.map((stage) => {
      const rank = stage.traits.progressionRank;
      const suffixPool = ENGLISH_NAME_PARTS.stageSuffixes[rank];
      let english = "";
      let japanese = "";

      for (let attempt = 0; attempt < 20; attempt += 1) {
        const suffix = this.getRandomItem(suffixPool);
        english = englishPrefix + "-" + capitalize(root) + suffix;
        japanese = japaneseStart + japaneseMiddle +
          this.getRandomItem(KATAKANA_NAME_PARTS.stageSuffixes[rank]);
        const englishKey = normalizeText(english);
        if (!namesInLine.has(englishKey) && !oldEnglishNames.has(englishKey) &&
            !japaneseNamesInLine.has(japanese) && !oldJapaneseNames.has(japanese)) break;
      }

      namesInLine.add(normalizeText(english));
      japaneseNamesInLine.add(japanese);
      return { english, japanese };
    });
  }

  assembleSingleStagePrompt(sharedTraits, stage) {
    const traits = stage.traits;
    const distribution = paletteText(traits.paletteDistribution);
    const values = {
      stageNumber: stage.stageNumber,
      role: stage.role.toLowerCase(),
      typeLabel: familyTypeLabel(sharedTraits),
      concept: sharedTraits.conceptSeed.concept + " " + sharedTraits.conceptSeed.animal,
      bodyPlan: traits.bodyPlan,
      massDescription: traits.massDescription,
      bodyStructure: traits.bodyStructure,
      shapeDominance: traits.shapeDominance,
      motifDetail: traits.motifDetail,
      anchorMotif: sharedTraits.anchorMotif,
      paletteDistribution: distribution,
      primaryColor: sharedTraits.primaryColor,
      secondaryColor: sharedTraits.secondaryColor,
      accentColor: sharedTraits.accentColor + " (" + traits.accentIntensity + ")",
      eyeStyle: traits.eyeStyle,
      expression: traits.expression,
      pose: traits.pose,
      baseMaterial: sharedTraits.baseMaterial,
      materialDetails: traits.materialDetails,
      style: EVOLUTION_STYLE_TEMPLATES.style
    };
    return replaceTokens(EVOLUTION_STYLE_TEMPLATES.singleStage.join(", "), values);
  }

  assembleFullSheetPrompt(line) {
    const stageCount = line.stages.length;
    const stageDirections = stageCount === 3
      ? "Stage 1 on the left, Stage 2 in the center, Stage 3 on the right"
      : "Stage 1 on the left and Stage 2 on the right";
    return replaceTokens(EVOLUTION_STYLE_TEMPLATES.fullSheet, {
      stageCount,
      typeLabel: familyTypeLabel(line.sharedTraits),
      concept: line.conceptSeed.concept + " " + line.conceptSeed.animal,
      stageDirections,
      primaryColor: line.sharedTraits.primaryColor,
      secondaryColor: line.sharedTraits.secondaryColor,
      accentColor: line.sharedTraits.accentColor,
      anchorMotif: line.sharedTraits.anchorMotif
    });
  }

  assembleDexPrompt(line) {
    const stageSummary = line.stages.map((stage) =>
      "Stage " + stage.stageNumber + ": " + stage.names.japanese + " / " +
      stage.names.english + " (" + familyTypeLabel(line.sharedTraits) + ") — " + stage.flavorText
    ).join("; ");
    const dexNumber = line.id.replace(/^line_/, "").slice(-6).toUpperCase();
    return replaceTokens(EVOLUTION_STYLE_TEMPLATES.dex, {
      stageCount: line.stages.length,
      typeLabel: familyTypeLabel(line.sharedTraits),
      dexNumber,
      stageSummary
    }) + "; " + stageSummary;
  }

  validateEvolutionLine(line) {
    const errors = [];
    const stages = Array.isArray(line?.stages) ? line.stages : [];
    if (![2, 3].includes(line?.stageCount) || stages.length !== line.stageCount) {
      errors.push("Stage count does not match the selected evolution length.");
    }
    if (!line?.sharedTraits || !line?.conceptSeed) {
      errors.push("Shared family identity or concept seed is missing.");
      return { valid: false, errors };
    }

    const shared = line.sharedTraits;
    const sharedFields = [
      "primaryType", "primaryColor", "secondaryColor", "accentColor",
      "eyeColor", "anchorMotif", "bodyPlan", "baseMaterial"
    ];
    sharedFields.forEach((field) => {
      if (!shared[field]) errors.push("Shared family trait is missing: " + field + ".");
    });
    if (!stages.length) errors.push("Evolution line has no stages.");

    const names = new Set();
    const prompts = new Set();
    let previousRank = 0;
    const expectedRanks = line.stageCount === 2 ? [1, 3] : [1, 2, 3];
    stages.forEach((stage, index) => {
      const stageLabel = "Stage " + (index + 1);
      if (stage.stageNumber !== index + 1) errors.push(stageLabel + " has an invalid number.");
      if (!stage.prompt || !stage.prompt.trim()) errors.push(stageLabel + " has an empty prompt.");
      if (!stage.names?.english || !stage.names?.japanese) {
        errors.push(stageLabel + " is missing a bilingual name.");
      }
      const nameKey = normalizeText(stage.names?.english);
      if (nameKey && names.has(nameKey)) errors.push("Stage names must be unique.");
      names.add(nameKey);

      const promptKey = normalizeText(stage.prompt);
      if (promptKey && prompts.has(promptKey)) errors.push("Stage descriptions must not duplicate each other.");
      prompts.add(promptKey);

      [shared.primaryColor, shared.secondaryColor, shared.accentColor, shared.anchorMotif]
        .filter(Boolean)
        .forEach((trait) => {
          if (!stage.prompt.toLowerCase().includes(trait.toLowerCase())) {
            errors.push(stageLabel + " does not inherit " + trait + ".");
          }
        });

      const rank = Number(stage.traits?.progressionRank ?? 0);
      if (rank <= previousRank || rank !== expectedRanks[index]) {
        errors.push("Stage progression is not increasing through the expected growth rules.");
      }
      previousRank = rank;
      const expectedDistribution = PALETTE_DISTRIBUTIONS[stage.stageNumber];
      if (expectedDistribution &&
          JSON.stringify(stage.traits.paletteDistribution) !== JSON.stringify(expectedDistribution)) {
        errors.push(stageLabel + " does not use its required palette distribution.");
      }
    });

    if (line.archetype?.id === "METAMORPHOSIS" && line.stageCount === 3) {
      if (!/larval/i.test(stages[0]?.traits?.bodyStructure ?? "") ||
          !/hard closed chrysalis/i.test(stages[1]?.traits?.bodyStructure ?? "") ||
          !/broad mature silhouette/i.test(stages[2]?.traits?.bodyStructure ?? "")) {
        errors.push("Metamorphosis must progress from larva to chrysalis to mature adult.");
      }
    }

    if (!line.fullSheetPrompt?.trim()) errors.push("Full evolution sheet prompt is empty.");
    if (!line.dexPrompt?.trim()) errors.push("Dex prompt is empty.");
    const protectedText = JSON.stringify({
      stages: stages.map((stage) => ({
        name: stage.names,
        prompt: stage.prompt,
        flavorText: stage.flavorText
      })),
      fullSheetPrompt: line.fullSheetPrompt,
      dexPrompt: line.dexPrompt
    });
    if (hasForbiddenTerm(protectedText)) errors.push("A protected franchise term was found.");
    return { valid: errors.length === 0, errors };
  }

  generateLine(options = {}) {
    const stageCount = Number(options.stages) === 2 ? 2 : 3;
    const previousLine = options.previousLine ?? null;
    const previousTraits = previousLine?.sharedTraits ?? {};
    const previousStages = previousLine?.stages ?? [];
    const familyLocks = options.familyLocks ?? {};
    const stageLocks = options.stageLocks ?? {};
    let lastErrors = [];

    for (let attempt = 0; attempt < MAX_LINE_ATTEMPTS; attempt += 1) {
      const availableArchetypes = EVOLUTION_ARCHETYPES.filter((item) => item.totalStages === stageCount);
      const requestedArchetype = EVOLUTION_ARCHETYPES.find((item) =>
        item.id === options.evolutionType && item.totalStages === stageCount
      );
      const archetype = requestedArchetype ?? this.getRandomItem(
        availableArchetypes,
        [previousLine?.archetype?.id]
      );
      const sharedTraits = this.generateSharedTraits({
        primaryType: options.primaryType,
        secondaryType: options.secondaryType,
        conceptSeedId: options.conceptSeedId,
        familyLocks,
        previousTraits
      });
      const stages = this.generateStages(sharedTraits, archetype, stageCount, {
        stageLocks,
        previousStages
      });
      const names = this.generateBilingualNames(sharedTraits, stages, previousStages);

      stages.forEach((stage, index) => {
        stage.names = names[index];
        const previousFlavor = previousStages.find((item) =>
          item.stageNumber === stage.stageNumber
        )?.flavorText;
        const templates = FLAVOR_TEXT_TEMPLATES[stage.traits.progressionRank];
        const template = this.getRandomItem(templates, [previousFlavor]);
        stage.flavorText = replaceTokens(template, {
          animal: sharedTraits.conceptSeed.animal,
          concept: sharedTraits.conceptSeed.concept,
          habitat: sharedTraits.habitat,
          motif: sharedTraits.anchorMotif
        });
        stage.prompt = this.assembleSingleStagePrompt(sharedTraits, stage);
      });

      const line = {
        id: "line_" + this.now().toString(36) + "_" +
          Math.floor(Number(this.random()) * 0xffffff).toString(36),
        mode: "evolution",
        stageCount,
        sharedTraits,
        archetype: { id: archetype.id, name: archetype.name },
        conceptSeed: { ...sharedTraits.conceptSeed },
        stages,
        fullSheetPrompt: "",
        dexPrompt: ""
      };
      line.fullSheetPrompt = this.assembleFullSheetPrompt(line);
      line.dexPrompt = this.assembleDexPrompt(line);
      const validation = this.validateEvolutionLine(line);
      if (!validation.valid) {
        lastErrors = validation.errors;
        continue;
      }

      const signature = stableSignature(line);
      const hasAnyLocks = Object.values(familyLocks).some(Boolean) ||
        Object.values(stageLocks).some((locks) => Object.values(locks ?? {}).some(Boolean));
      if (this.seenSignatures.has(signature) &&
          !(attempt === MAX_LINE_ATTEMPTS - 1 && hasAnyLocks && previousLine)) {
        lastErrors = ["A duplicate evolution was generated."];
        continue;
      }
      this.seenSignatures.add(signature);
      return line;
    }

    throw new Error(
      "Could not create a valid distinct evolution line. " +
      (lastErrors.length ? lastErrors.join(" ") : "Try changing the type or concept seed.")
    );
  }
}
