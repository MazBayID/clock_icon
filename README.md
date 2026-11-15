# ChronoGlyph Studio

ChronoGlyph Studio is a browser-based workspace for generating monochrome smartwatch numerals and interface assets. It focuses on pixel-accurate previews, inspection, and visual comparison.

## Features

- Generate numeral glyphs **0–9 and colon** at 25×50 px.
- Browse and compare multiple numeral styles.
- Generate seven semantic progress/status families: battery, signal, linear progress, segmented progress, progress ring, storage, and volume.
- Generate nine interface icons for connectivity, health, alerts, weather, and telemetry.
- Apply ten visual style presets to the V2 icon renderer.
- Tune each asset family with context-aware controls and live preview.
- Configure icon and progress canvas dimensions up to 512×512 px.
- Preview assets at their native canvas dimensions.
- Inspect numeral pixels, coordinates, and image metrics in read-only mode.
- Export individual PNG files and family sprite sheets.
- Export family ZIP packages with PNG assets and JSON manifests.
- Export the complete 16-asset UI library in one ZIP, including both family sprite sheets and a root manifest.

## UI Generator V2 status

The full UI generator rebuild is developed on the experimental branch `rebuild/ui-generator-v2`. The stable `main` branch remains unchanged; V2 is not merged or considered released.

The V2 architecture separates asset catalogs, typed configuration models, Canvas 2D renderers, workbenches, and PNG export utilities. The legacy UI renderer is retained in the repository for migration comparison and rollback safety; the V2 icon workbench no longer depends on it.

## Development

Requirements: Node.js 20.19+ or 22.12+ for the app; Bun 1.4+ is required for the test script.

```bash
npm install
npm run dev
```

## Validation and build

```bash
npm run lint
npm run test
npm run build
npm run preview
```

The production build is generated in `dist/`.

## Deployment

The Vite base path is configured for the GitHub Pages project site:

`https://mazbayid.github.io/clock_icon/`

The experimental V2 branch uses CI validation and is not automatically promoted to the stable deployment.

## Export formats

The export scope is PNG images, PNG sprite sheets, and ZIP packages containing PNG files plus JSON manifests. Firmware and bitmap conversion formats are intentionally excluded.

## Project structure

- `src/engine/` — numeral rendering and retained legacy UI rendering code.
- `src/generator-v2/model/` — V2 asset catalogs, style presets, and typed configuration.
- `src/generator-v2/renderers/` — dedicated Canvas 2D renderers for progress/status and icon families.
- `src/generator-v2/components/` — modular V2 workbenches and unified workspace shell.
- `src/generator-v2/export/` — shared PNG sprite-sheet composition.
- `src/components/` — numeral asset views, previews, inspectors, and comparison views.
- `src/App.tsx` — application shell and generator-mode state.

## Notes

Pixel inspection is intentionally read-only. The application does not provide manual pixel editing.
