# UI Generator V2 — Architecture

## Goal

Replace the tightly coupled UI-asset controls with a modular generator workspace. The rebuild is isolated on `rebuild/ui-generator-v2`; `main` remains the stable release line.

## Design principles

1. **Asset-first configuration** — controls belong to the selected asset family. Battery settings must not affect signal, and signal settings must not affect storage.
2. **Renderer isolation** — every asset family has a renderer with a shared canvas contract.
3. **Shared visual language** — style presets provide reusable tokens (stroke, corners, spacing, fill treatment) without owning asset behavior.
4. **Predictable geometry** — dimensions, padding, stroke and segment counts are explicit and clamped before drawing.
5. **One source of truth** — catalog metadata drives navigation, preview dimensions, and export names.
6. **Progress types are semantic** — battery, signal, linear, segmented, ring, storage and volume are distinct generators, not one generic bar with cosmetic switches.
7. **PNG-first export** — preserve the current PNG and PNG sprite-sheet scope. No firmware or bitmap conversion is reintroduced.

## Target layers

- `catalog/`: asset metadata, groups and style presets.
- `model/`: typed configuration and validation.
- `renderers/`: isolated Canvas 2D renderers for progress, status and icon families.
- `components/`: separate workbenches for progress/status and icon families.
- `components/`: editor shell, asset picker, context-aware controls, preview and export.
- `export/`: PNG, sprite sheet and manifest packaging.

## Current V2 asset coverage

- **Progress & status:** battery, signal, linear progress, segmented progress, progress ring, storage, volume.
- **Icon library:** Bluetooth, Wi-Fi, heart, steps, notification, sun, moon, alarm, ECG divider.
- **Style presets:** ten shared visual styles are now modeled inside V2 and consumed by the icon workbench and renderer.
- **Exports:** individual PNG, family ZIP with JSON manifest, and family sprite-sheet PNG. Sprite sheets use a deterministic grid layout with centered cells and a black background.
- **Validation:** pure model/catalog/layout logic is covered by Bun tests; every pushed change is checked by type-check, tests, and production build in GitHub Actions.

## First implementation slice

The first vertical slice establishes a typed progress model and renderer. It covers battery, signal, linear progress, segmented progress, ring, storage and volume. A unified workspace now exposes this progress family alongside the existing icon catalog. The icon family now has its own Canvas 2D renderer, typed render options, catalog, and style model. The legacy icon renderer remains in the repository for the old engine and migration comparison, but the V2 icon workbench no longer imports it.

## Migration policy

- Keep the old glyph generator and animation studio unchanged during this experiment.
- Do not delete legacy UI code until the V2 workspace has parity for the required assets.
- Migrate by asset family, not by arbitrary file replacement.
- Each migration slice must pass TypeScript checks, unit tests, production build and visual inspection before it is considered stable. Automated CI is not a substitute for browser-level visual inspection.
- Do not merge this branch into `main` until the user approves the result.

## Initial known architectural debt

The legacy `UiRenderOptions` mixes global style parameters with unrelated semantic values (`batteryLevel`, `signalBars`, `progressPercent`). This makes every new asset type expand a shared interface and toolbar. V2 moves those values into a discriminated per-family configuration.
