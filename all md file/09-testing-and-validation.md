# Testing and Validation

## Generator Tests

Verify:

- Character generation returns a prompt
- Place generation returns a prompt
- Both mode selects Character or Place
- Character filters work
- Locked parts remain unchanged
- Unlocked parts can change
- Prompt parts are returned
- Empty arrays are handled
- Duplicate retry has a maximum limit

## UI Tests

Verify:

- Generate works
- Copy works
- Favorite works
- History works
- Lock buttons work
- Theme changes work
- Dark/light works
- Mobile layout works

## Persistence Tests

After refreshing:

- Favorites remain
- History remains
- Preferences remain if implemented

## Browser Tests

Test at minimum:

- Chrome/Edge
- Firefox
- Safari if available
- Mobile browser

## Prompt Quality Tests

### Structural quality
Every prompt contains the expected categories.

### Semantic quality
The prompt makes sense as a visual description.

### Style consistency
Character prompts contain the Character Style Block.

Place prompts contain the Place Style Block.

### Randomness
Repeated generations vary.

### Lock correctness
Locked values remain unchanged.

### Readability
The prompt remains understandable outside the website.

## Data Quality

When adding data:

1. Use descriptive phrases.
2. Avoid duplicates.
3. Keep categories clean.
4. Avoid severe contradictions.
5. Keep style blocks stable.
