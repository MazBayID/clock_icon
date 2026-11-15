import { describe, expect, test } from 'bun:test';
import {
  createDefaultProgressConfig,
  getProgressRatio,
  normalizeProgressConfig,
} from '../src/generator-v2/model/progress';

describe('progress generator model', () => {
  test('creates a type-specific default configuration', () => {
    const battery = createDefaultProgressConfig('battery');
    const signal = createDefaultProgressConfig('signal');
    expect(battery.id).toBe('battery');
    expect(signal.id).toBe('signal');
    expect(battery.width).not.toBe(signal.width);
  });

  test('clamps dimensions, values and visual parameters', () => {
    const normalized = normalizeProgressConfig({
      ...createDefaultProgressConfig('linear-progress'),
      width: 900,
      height: 2,
      value: 140,
      segments: 80,
      gap: -4,
      strokeWidth: 20,
      cornerRadius: 30,
      padding: -1,
    });
    expect(normalized.width).toBe(512);
    expect(normalized.height).toBe(8);
    expect(normalized.value).toBe(100);
    expect(normalized.segments).toBe(32);
    expect(normalized.gap).toBe(0);
    expect(normalized.strokeWidth).toBe(8);
    expect(normalized.cornerRadius).toBe(16);
    expect(normalized.padding).toBe(0);
  });

  test('calculates progress ratios within the configured range', () => {
    const config = { ...createDefaultProgressConfig('battery'), min: 20, max: 80, value: 50 };
    expect(getProgressRatio(config)).toBe(0.5);
    expect(getProgressRatio({ ...config, value: 0 })).toBe(0);
    expect(getProgressRatio({ ...config, value: 100 })).toBe(1);
  });
});
