# Random Anime Prompt Generator — Project Overview

## Purpose
This document defines the project at a high level: what the website does, what the user can generate, the two visual modes, and the core design principles.

## Project Goal
Build a simple client-side website that generates randomized prompts for AI image generators.

The user presses one main **Generate Prompt** button and receives a prompt for either:

- Anime Character
- Anime Place

The website generates text prompts only. The user copies the result and uses it in an external image-generation tool.

## Core Workflow

```text
Choose mode
→ select random components
→ respect locked components
→ assemble prompt
→ display prompt
→ copy/save result
```

## Generation Modes

### Character
- Main character
- Side character
- Female character
- Random pose
- Outfit
- Hair
- Eyes
- Expression
- Gear/prop
- Energy effect
- Handwritten label

### Place
- Location
- Landmark/location detail
- Time
- Weather
- Mood
- Camera
- Place style
- Quality

### Both
Both means the generator randomly chooses either Character or Place for each generation.

It does not currently mean Character + Place in the same prompt.

## Core Design Principle

The generator uses modular prompt construction.

Instead of randomizing one large sentence, it selects values from controlled categories and combines them in a fixed prompt structure.

This makes the system easier to:

- Expand
- Edit
- Debug
- Lock
- Re-roll
- Test

## Project Scope

Version 1 is:

- Client-side
- HTML + CSS + JavaScript
- No backend
- No login
- No database
- Browser localStorage for history/favorites
- Static-hosting compatible
