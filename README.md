# ChronoGlyph Studio

ChronoGlyph Studio is a browser-based workspace for generating monochrome smartwatch numerals and interface assets. It focuses on pixel-accurate previews, inspection, and visual comparison.

## Features

- Generate numeral glyphs **0–9 and colon** at 25×50 px.
- Browse and compare multiple numeral styles.
- Generate seven semantic progress/status families: battery, signal, linear, segmented, ring, storage, and volume.
- Generate a separate icon library for connectivity, health, alerts, weather, and telemetry.
- Tune each asset family with context-aware controls and live preview.
- Preview assets at configurable native canvas dimensions.
- Inspect pixels, coordinates, and image metrics in read-only mode.
- Download individual PNG assets and PNG sprite sheets.
- Package visual assets as PNG-only ZIP archives with manifests.
- Export individual PNG files, sprite sheets, and PNG-only ZIP packages.
- Tune rendering options and preview changes without editing individual pixels.
- Export progress assets and icon collections as PNG ZIP packages with manifests.

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

The current export scope is PNG images, PNG sprite sheets, and ZIP packages containing PNG files plus a manifest. Firmware and bitmap conversion formats are intentionally excluded while the rendering and hardware-output architecture is being redesigned.

## Project structure

- `src/engine/` — legacy glyph and icon rendering plus PNG export logic.
- `src/generator-v2/` — modular UI generator model, semantic progress renderers, and V2 workbenches.
- `src/components/` — asset views, previews, inspectors, and comparison views.
- `src/types/` — TypeScript types for glyphs and UI assets.
- `src/App.tsx` — application shell and generator-mode state.

## Notes

Pixel inspection is intentionally read-only. The application does not provide manual pixel editing.
