# Storage, Clipboard, Accessibility, and Errors

## Clipboard

Use:

```js
navigator.clipboard.writeText(prompt)
```

After successful copying:

```text
Prompt copied!
```

Provide fallback behavior if clipboard access fails.

## Local Storage

Recommended keys:

```text
animePrompt.history
animePrompt.favorites
animePrompt.preferences
```

Store data as JSON.

The application should survive:

- Missing keys
- Empty storage
- Invalid JSON
- Old formats
- localStorage being unavailable

## History

- Last 10 prompts
- Newest first
- Click to reuse/copy
- Persistent in localStorage

## Favorites

- Add/remove
- Persistent
- Copyable
- Avoid duplicate favorites
- Allow clearing

## Accessibility

Required:

- Semantic HTML
- Visible keyboard focus
- Accessible button labels
- Sufficient contrast
- Do not rely only on color for lock state
- `aria-label` for icon-only controls
- Keyboard-accessible mode controls
- Screen-reader-friendly prompt output
- Reduced-motion support where practical

Example:

```html
<button
  aria-label="Lock pose"
  aria-pressed="true">
  🔒
</button>
```

## Error Handling

### Empty data array

```text
Unable to generate this category. Please add data to the selected list.
```

### Clipboard failure

```text
Copy failed. Please select and copy the prompt manually.
```

### Local storage failure

Generation should continue even if persistence is unavailable.

### Invalid mode

Fallback to:

```text
characters
```
