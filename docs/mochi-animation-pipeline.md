# Mochi animation asset pipeline

The original ZIP archives in `public/assets/aistudio/` are the source of truth and are never modified by this pipeline.

## Fixed output contract

- Source PNG: 256 × 192 pixels, with transparency.
- Generated PNG: 64 × 48 pixels, with transparency.
- Resize filter: nearest-neighbor (preserves hard pixel edges).
- Playback rate: 10 FPS (100 ms per frame).
- Frame names inside each archive: `mochi_<digit>_<index>.png`.
- Frame indexes must be continuous from zero. The script sorts numerically and rejects duplicates or gaps.
- Every digit keeps its own frame count and total duration.

## Generated files

For each digit, the workflow creates:

- `public/assets/mochi/<digit>/frame_NNN.png` — resized individual frames.
- `public/assets/mochi/<digit>/spritesheet.png` — transparent sprite sheet, up to 8 columns.
- `public/assets/mochi/<digit>/manifest.json` — dimensions, frame order, timing, frame count, and source archive hash.

It also creates `public/assets/mochi/index.json` as the collection index.

## Run

The GitHub Actions workflow runs when a Mochi source ZIP or this processor changes on `main`. It can also be started manually with **Actions → Process Mochi Animation Assets → Run workflow**.

The workflow validates all ten source archives before committing generated assets. Any invalid archive, unexpected frame size, missing transparency, duplicate frame, or frame-index gap fails the run instead of silently producing incomplete animation data.
