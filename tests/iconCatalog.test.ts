import { describe, expect, test } from 'bun:test';
import { ICON_ASSET_CATALOG, ICON_ASSET_IDS, getIconAssetMeta } from '../src/generator-v2/model/icons';

describe('icon generator catalog', () => {
  test('contains unique icon asset identifiers', () => {
    const ids = ICON_ASSET_CATALOG.map((asset) => asset.id);
    expect(ids).toEqual([...ICON_ASSET_IDS]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('provides valid dimensions and descriptions for every icon', () => {
    for (const asset of ICON_ASSET_CATALOG) {
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
      expect(asset.description.length).toBeGreaterThan(0);
    }
  });

  test('keeps progress and status indicators out of the icon family', () => {
    expect(ICON_ASSET_IDS).not.toContain('battery');
    expect(ICON_ASSET_IDS).not.toContain('signal');
    expect(ICON_ASSET_IDS).not.toContain('progress-arc');
  });

  test('resolves metadata by identifier', () => {
    expect(getIconAssetMeta('heart').name).toBe('Detak Jantung (BPM)');
  });
});
