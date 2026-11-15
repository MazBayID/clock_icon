# ChronoGlyph Studio

ChronoGlyph Studio is a browser-based workspace for generating monochrome smartwatch numerals and interface assets. It focuses on pixel-accurate previews, inspection, comparison, and firmware-oriented exports.

## Features

- Generate numeral glyphs **0–9 and colon** at 25×50 px.
- Browse and compare multiple numeral styles.
- Generate a catalog of smartwatch UI assets.
- Preview assets in round, square, and native-size watch layouts.
- Inspect pixels, coordinates, and image metrics in read-only mode.
- Export individual PNG files, sprite sheets, C headers, and ZIP packages.
- Tune rendering options and preview changes without editing individual pixels.

## Development

Requirements: Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

## Validation and build

```bash
npm run lint
npm run build
npm run preview
```

The production build is generated in `dist/`.

## Deployment

The Vite base path is configured for the GitHub Pages project site:

```
https://mazbayid.github.io/clock_icon/
```

## Export formats

Depending on the selected generator and export action, the studio provides PNG images, bitmap/sprite-sheet assets, C header output, and ZIP packages.

## Project structure

- `src/engine/` — glyph rendering, UI asset rendering, bitmap encoding, and export logic.
- `src/components/` — generator panels, previews, inspectors, and comparison views.
- `src/types/` — TypeScript types for glyphs and UI assets.
- `src/App.tsx` — application shell and generator-mode state.

## Notes

Pixel inspection is intentionally read-only. The application does not provide manual pixel editing.
