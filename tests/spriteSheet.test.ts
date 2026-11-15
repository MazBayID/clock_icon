import { describe, expect, test } from 'bun:test';
import { getSpriteSheetLayout } from '../src/generator-v2/export/spriteSheet';

describe('sprite sheet layout', () => {
  test('fits a mixed-size collection into a predictable grid', () => {
    expect(getSpriteSheetLayout([{ width: 24, height: 28 }, { width: 64, height: 20 }, { width: 28, height: 28 }], 2, 2))
      .toEqual({ width: 130, height: 58, columns: 2, rows: 2, cellWidth: 64, cellHeight: 28, gap: 2 });
  });

  test('clamps columns and spacing', () => {
    expect(getSpriteSheetLayout([{ width: 8, height: 8 }, { width: 8, height: 8 }], 9, -4))
      .toEqual({ width: 16, height: 16, columns: 2, rows: 1, cellWidth: 8, cellHeight: 8, gap: 0 });
  });

  test('rejects an empty collection', () => {
    expect(() => getSpriteSheetLayout([])).toThrow('Cannot create an empty sprite sheet.');
  });
});
