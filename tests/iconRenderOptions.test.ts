import { describe, expect, test } from 'bun:test';
import { createDefaultIconRenderOptions, DEFAULT_ICON_RENDER_OPTIONS, normalizeIconRenderOptions } from '../src/generator-v2/model/icons';

describe('icon render options', () => {
  test('provides safe defaults', () => {
    expect(DEFAULT_ICON_RENDER_OPTIONS).toEqual({ width: 28, height: 28, strokeScale: 1, padding: 1, pixelSnap: false, threshold: 128 });
  });

  test('clamps visual parameters', () => {
    expect(normalizeIconRenderOptions({ width: 900, height: 2, strokeScale: 8, padding: -5, pixelSnap: true, threshold: 999 }))
      .toEqual({ width: 512, height: 8, strokeScale: 1.3, padding: 0, pixelSnap: true, threshold: 210 });
  });

  test('uses per-asset default dimensions', () => {
    expect(createDefaultIconRenderOptions('bluetooth').width).toBe(24);
    expect(createDefaultIconRenderOptions('bluetooth').height).toBe(28);
  });

  test('repairs non-finite numeric values', () => {
    expect(normalizeIconRenderOptions({ width: Number.NaN, height: Number.NaN, strokeScale: Number.NaN, padding: Number.NaN, pixelSnap: false, threshold: Number.NaN }))
      .toEqual(DEFAULT_ICON_RENDER_OPTIONS);
  });
});
