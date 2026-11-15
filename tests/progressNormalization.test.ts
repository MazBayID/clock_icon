import { describe, expect, test } from 'bun:test';
import { createDefaultProgressConfig, normalizeProgressConfig } from '../src/generator-v2/model/progress';

describe('progress config normalization edge cases', () => {
  test('repairs non-finite geometry and style values', () => {
    const normalized = normalizeProgressConfig({
      ...createDefaultProgressConfig('linear-progress'),
      width: Number.NaN,
      height: Number.POSITIVE_INFINITY,
      value: Number.NaN,
      segments: Number.NaN,
      gap: Number.NaN,
      strokeWidth: Number.NaN,
      cornerRadius: Number.NaN,
      padding: Number.NaN,
    });
    expect(normalized.width).toBe(96);
    expect(normalized.height).toBe(16);
    expect(normalized.value).toBe(0);
    expect(normalized.segments).toBe(5);
    expect(normalized.gap).toBe(2);
    expect(normalized.strokeWidth).toBe(2);
    expect(normalized.cornerRadius).toBe(3);
    expect(normalized.padding).toBe(2);
  });

  test('keeps vertical segmented progress within its available axis', () => {
    const normalized = normalizeProgressConfig({
      ...createDefaultProgressConfig('segmented-progress'),
      width: 10,
      height: 32,
      orientation: 'vertical',
      padding: 3,
      gap: 4,
      segments: 32,
    });
    expect(normalized.segments).toBeLessThanOrEqual(6);
  });
});
