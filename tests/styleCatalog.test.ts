import { describe, expect, test } from 'bun:test';
import { UI_STYLES, UI_STYLE_CATEGORIES, getUiStyleMeta } from '../src/generator-v2/model/styles';

describe('V2 style catalog', () => {
  test('contains ten unique style presets', () => {
    expect(UI_STYLES).toHaveLength(10);
    expect(new Set(UI_STYLES.map((style) => style.id)).size).toBe(10);
  });

  test('every preset references a known category and render mode', () => {
    const categories = new Set(UI_STYLE_CATEGORIES.filter((item) => item.id !== 'all').map((item) => item.id));
    for (const style of UI_STYLES) {
      expect(categories.has(style.category)).toBe(true);
      expect(['antialiased', 'pixel-snap']).toContain(style.recommendedMode);
    }
  });

  test('falls back to the first preset for unknown identifiers', () => {
    expect(getUiStyleMeta('unknown-style').id).toBe(UI_STYLES[0].id);
  });
});
