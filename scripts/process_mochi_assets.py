#!/usr/bin/env python3
"""Build optimized Mochi animation assets from the original AI Studio ZIP files."""

from __future__ import annotations

import hashlib
import json
import re
import shutil
import sys
import zipfile
from pathlib import Path
from typing import Any

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "public" / "assets" / "aistudio"
OUTPUT_DIR = ROOT / "public" / "assets" / "mochi"

SOURCE_WIDTH = 256
SOURCE_HEIGHT = 192
OUTPUT_WIDTH = 64
OUTPUT_HEIGHT = 48
FPS = 10
FRAME_DURATION_MS = 100
SHEET_COLUMNS = 8
DIGITS = tuple(str(value) for value in range(10))
FRAME_PATTERN = re.compile(r"^mochi_(?P<digit>\d)_(?P<frame>\d+)\.png$", re.IGNORECASE)


def fail(message: str) -> None:
    raise SystemExit(f"[Mochi asset pipeline] ERROR: {message}")


def sha256_file(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def find_source_archive(digit: str) -> Path:
    matches = sorted(SOURCE_DIR.glob(f"mochi_{digit}_*.zip"))
    if len(matches) != 1:
        fail(
            f"digit {digit}: expected exactly one source archive "
            f"matching mochi_{digit}_*.zip, found {len(matches)}"
        )
    return matches[0]


def read_frames(archive_path: Path, expected_digit: str) -> list[tuple[int, Image.Image]]:
    frames: dict[int, Image.Image] = {}

    try:
        archive = zipfile.ZipFile(archive_path)
    except zipfile.BadZipFile:
        fail(f"{archive_path.name} is not a valid ZIP archive")

    with archive:
        for member in archive.infolist():
            if member.is_dir() or not member.filename.lower().endswith(".png"):
                continue

            filename = Path(member.filename).name
            match = FRAME_PATTERN.fullmatch(filename)
            if not match:
                fail(
                    f"{archive_path.name}: unexpected PNG filename "
                    f"{member.filename!r}; expected mochi_{expected_digit}_NNN.png"
                )

            digit = match.group("digit")
            frame_index = int(match.group("frame"))
            if digit != expected_digit:
                fail(
                    f"{archive_path.name}: found frame for digit {digit}, "
                    f"expected digit {expected_digit}"
                )
            if frame_index in frames:
                fail(f"{archive_path.name}: duplicate frame index {frame_index}")

            try:
                with archive.open(member) as file:
                    image = Image.open(file)
                    image.load()
            except Exception as error:  # Pillow raises several format-specific exceptions.
                fail(f"{member.filename}: cannot decode PNG ({error})")

            if image.size != (SOURCE_WIDTH, SOURCE_HEIGHT):
                fail(
                    f"{member.filename}: expected {SOURCE_WIDTH}x{SOURCE_HEIGHT}, "
                    f"got {image.width}x{image.height}"
                )

            has_alpha = "A" in image.getbands() or "transparency" in image.info
            if not has_alpha:
                fail(f"{member.filename}: transparency/alpha channel is missing")

            frames[frame_index] = image.convert("RGBA")

    if not frames:
        fail(f"{archive_path.name}: no PNG frames were found")

    indexes = sorted(frames)
    expected_indexes = list(range(len(indexes)))
    if indexes != expected_indexes:
        fail(
            f"{archive_path.name}: frame indexes must be continuous from 000; "
            f"found {indexes[:5]}...{indexes[-5:]}"
        )

    return [(index, frames[index]) for index in indexes]


def process_digit(digit: str) -> dict[str, Any]:
    archive_path = find_source_archive(digit)
    archive_bytes = archive_path.read_bytes()
    source_frames = read_frames(archive_path, digit)

    digit_output = OUTPUT_DIR / digit
    if digit_output.exists():
        shutil.rmtree(digit_output)
    digit_output.mkdir(parents=True, exist_ok=True)

    resized_frames: list[Image.Image] = []
    frame_entries: list[dict[str, Any]] = []

    for index, source_image in source_frames:
        resized = source_image.resize(
            (OUTPUT_WIDTH, OUTPUT_HEIGHT),
            resample=Image.Resampling.NEAREST,
        )
        filename = f"frame_{index:03d}.png"
        resized.save(digit_output / filename, format="PNG", optimize=True)
        resized_frames.append(resized)
        frame_entries.append(
            {
                "index": index,
                "file": filename,
                "durationMs": FRAME_DURATION_MS,
            }
        )

    frame_count = len(resized_frames)
    columns = min(SHEET_COLUMNS, frame_count)
    rows = (frame_count + columns - 1) // columns
    sheet = Image.new(
        "RGBA",
        (columns * OUTPUT_WIDTH, rows * OUTPUT_HEIGHT),
        (0, 0, 0, 0),
    )

    for index, frame in enumerate(resized_frames):
        x = (index % columns) * OUTPUT_WIDTH
        y = (index // columns) * OUTPUT_HEIGHT
        sheet.alpha_composite(frame, (x, y))

    sheet.save(digit_output / "spritesheet.png", format="PNG", optimize=True)

    manifest: dict[str, Any] = {
        "formatVersion": 1,
        "digit": digit,
        "sourceArchive": archive_path.name,
        "sourceSha256": sha256_file(archive_bytes),
        "sourceFrameSize": {"width": SOURCE_WIDTH, "height": SOURCE_HEIGHT},
        "frameSize": {"width": OUTPUT_WIDTH, "height": OUTPUT_HEIGHT},
        "fps": FPS,
        "frameDurationMs": FRAME_DURATION_MS,
        "frameCount": frame_count,
        "totalDurationMs": frame_count * FRAME_DURATION_MS,
        "sheet": {
            "file": "spritesheet.png",
            "columns": columns,
            "rows": rows,
            "width": columns * OUTPUT_WIDTH,
            "height": rows * OUTPUT_HEIGHT,
        },
        "frames": frame_entries,
    }

    (digit_output / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(
        f"[Mochi] digit {digit}: {frame_count} frames, "
        f"{frame_count * FRAME_DURATION_MS} ms total"
    )
    return manifest


def main() -> None:
    if not SOURCE_DIR.is_dir():
        fail(f"source directory does not exist: {SOURCE_DIR}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    manifests = [process_digit(digit) for digit in DIGITS]

    index = {
        "formatVersion": 1,
        "frameSize": {"width": OUTPUT_WIDTH, "height": OUTPUT_HEIGHT},
        "fps": FPS,
        "frameDurationMs": FRAME_DURATION_MS,
        "animations": [
            {
                "digit": manifest["digit"],
                "manifest": f"{manifest['digit']}/manifest.json",
                "frameCount": manifest["frameCount"],
                "totalDurationMs": manifest["totalDurationMs"],
            }
            for manifest in manifests
        ],
    }
    (OUTPUT_DIR / "index.json").write_text(
        json.dumps(index, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"[Mochi] completed: {len(manifests)} animations generated")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("[Mochi asset pipeline] interrupted", file=sys.stderr)
        raise SystemExit(130)
