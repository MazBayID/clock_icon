import { describe, expect, test } from 'bun:test';
import { createSpriteSheetManifest, getSpriteSheetLayout } from '../src/generator-v2/export/spriteSheet';

describe('sprite sheet layout', () => {
  test('fits a mixed-size collection into a predictable grid', () => {
    expect(getSpriteSheetLayout([{ width: 24, height: 28 }, { width: 64, height: 20 }, { width: 28, height: 28 }], 2, 2))
      .toEqual({ width: 130, height: 58, columns: 2, rows: 2, cellWidth: 64, cellHeight: 28, gap: 2 });
  });

  test('clamps columns and spacing', () => {
    expect(getSpriteSheetLayout([{ width: 8, height: 8 }, { width: 8, height: 8 }], 9, -4))
      .toEqual({ width: 16, height: 8, columns: 2, rows: 1, cellWidth: 8, cellHeight: 8, gap: 0 });
  });

  test('rejects an empty collection', () => {
    expect(() => getSpriteSheetLayout([])).toThrow('Cannot create an empty sprite sheet.');
  });

  test('maps every asset to its exact centered sprite-sheet coordinates', () => {
    const items = [
      { id: 'small', canvas: { width: 24, height: 20 } as HTMLCanvasElement },
      { id: 'large', canvas: { width: 40, height: 30 } as HTMLCanvasElement },
      { id: 'wide', canvas: { width: 30, height: 10 } as HTMLCanvasElement },
    ];
    expect(createSpriteSheetManifest(items, 2, 2)).toEqual({
      format: 'PNG',
      layout: { width: 82, height: 62, columns: 2, rows: 2, cellWidth: 40, cellHeight: 30, gap: 2 },
      assets: [
        { id: 'small', x: 8, y: 5, width: 24, height: 20 },
        { id: 'large', x: 42, y: 0, width: 40, height: 30 },
        { id: 'wide', x: 5, y: 42, width: 30, height: 10 },
      ],
    });
  });
});
