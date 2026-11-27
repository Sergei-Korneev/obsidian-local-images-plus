## New features

- **Inline SVG support**: inline `<svg>…</svg>` blocks are extracted, saved as separate `.svg` files in the attachment folder, and embedded in the note.
  
  Example page to try: [On the Navier–Stokes Millennium Prize Problem](https://openai.com/index/navier-stokes-solution/).

- **YAML list properties**: image URLs stored as list items are now downloaded and localized while the list indentation and dash prefix are preserved ([#142](https://github.com/Sergei-Korneev/obsidian-local-images-plus/issues/142)).

  ```yaml
  image:
    - https://example.com/image.jpg
  ```

## Fixes and improvements

- **Frontmatter regression tests**: added coverage for YAML list items, quoted URLs, query strings, multiple list values, and ordinary single-value properties ([#142](https://github.com/Sergei-Korneev/obsidian-local-images-plus/issues/142)).

**Full changelog**: https://github.com/Sergei-Korneev/obsidian-local-images-plus/compare/0.19.8...0.20.6
