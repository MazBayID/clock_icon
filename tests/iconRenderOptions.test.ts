import { describe, expect, test } from 'bun:test';
import { DEFAULT_ICON_RENDER_OPTIONS, normalizeIconRenderOptions } from '../src/generator-v2/model/icons';

describe('icon render options', () => {
  test('provides safe defaults', () => {
    expect(DEFAULT_ICON_RENDER_OPTIONS).toEqual({ strokeScale: 1, padding: 1, pixelSnap: false, threshold: 128 });
  });

  test('clamps visual parameters', () => {
    expect(normalizeIconRenderOptions({ strokeScale: 8, padding: -5, pixelSnap: true, threshold: 999 }))
      .toEqual({ strokeScale: 1.3, padding: 0, pixelSnap: true, threshold: 210 });
  });

  test('repairs non-finite numeric values', () => {
    expect(normalizeIconRenderOptions({ strokeScale: Number.NaN, padding: Number.NaN, pixelSnap: false, threshold: Number.NaN }))
      .toEqual(DEFAULT_ICON_RENDER_OPTIONS);
  });
});
