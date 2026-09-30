# Prompt Engineering

## General Rule

The generator should construct prompts in a deliberate sequence rather than randomly shuffling words.

## Character Prompt

### Original project formula

```text
{character}, {character_type}, {outfit}, {hair}, {eyes}, {expression},
{famous_pose}, {weapon_or_prop}, {energy_effect},
{handwritten_label},
{CHARACTER STYLE BLOCK}, {quality_tags}
```

### Research-aligned extended formula

```text
{style_prefix},
{subject},
{character},
{character_type},
{hair},
{eyes},
{expression},
{pose},
{outfit},
{gear},
{effect},
{label},
{environment_optional},
{lighting_optional},
{camera_optional},
{quality},
{platform_parameters_optional}
```

## Place Prompt

```text
{place},
{landmark_or_location_detail},
{time_of_day},
{weather},
{mood},
{camera_angle},
{PLACE_STYLE_BLOCK},
{quality_tags}
```

## Prompt Ordering

Recommended hierarchy:

1. Style/rendering direction
2. Subject
3. Character/archetype
4. Facial features
5. Expression
6. Pose/action
7. Costume/equipment
8. Effects
9. Environment
10. Lighting/weather
11. Camera
12. Quality/platform parameters

## Weighting

Some image systems support weighting such as:

```text
(glowing yellow eyes:1.2)
```

This should be optional and platform-specific.

## Platform Parameters

Future platform modes may support:

- Generic
- Stable Diffusion / SDXL
- Midjourney / Niji

The core data should remain platform-independent.

## Negative Prompts

Optional future field:

```text
bad anatomy, malformed hands, extra fingers, duplicate character, low resolution, blurry, distorted face, cropped subject
```

Negative prompts should remain separate from the positive prompt.
