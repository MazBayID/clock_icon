import JSZip from 'jszip';
import {
  CustomPixelMap,
  GLYPH_CHARS,
  GLYPH_HEIGHT,
  GLYPH_WIDTH,
  GlyphChar,
  GlyphRenderOptions,
  StyleCategory,
  StyleId,
} from '../types/glyph';
import { renderGlyphToCanvas } from './glyphRenderer';
import { GLYPH_STYLES, getStyleMeta } from './glyphStyles';
import {
  CustomUiPixelMap,
  DYNAMIC_UI_ASSET_IDS,
  STATIC_UI_ASSET_IDS,
  UiAssetId,
  UiRenderOptions,
  UiStyleId,
} from '../types/uiAsset';
import { renderUiAssetToCanvas } from './uiAssetRenderer';
import { UI_ASSET_CATALOG, UI_STYLES, getUiAssetMeta, getUiStyleMeta } from './uiAssetStyles';

export function glyphFileName(char: GlyphChar): string {
  return char === ':' ? 'colon.png' : `${char}.png`;
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Gagal mengonversi canvas ke PNG.'));
    }, 'image/png');
  });
}

export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadSingleGlyphPng(
  char: GlyphChar,
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
) {
  const custom = customMap[styleId]?.[char] ?? null;
  const canvas = renderGlyphToCanvas(char, styleId, options, custom);
  triggerBlobDownload(await canvasToPngBlob(canvas), `${styleId}_${glyphFileName(char)}`);
}

export function buildSpriteSheetCanvas(
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
): HTMLCanvasElement {
  const sheet = document.createElement('canvas');
  sheet.width = GLYPH_WIDTH * GLYPH_CHARS.length;
  sheet.height = GLYPH_HEIGHT;
  const ctx = sheet.getContext('2d')!;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, sheet.width, sheet.height);

  GLYPH_CHARS.forEach((char, index) => {
    const custom = customMap[styleId]?.[char] ?? null;
    ctx.drawImage(renderGlyphToCanvas(char, styleId, options, custom), index * GLYPH_WIDTH, 0);
  });
  return sheet;
}

export async function downloadSpriteSheetPng(
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
) {
  const sheet = buildSpriteSheetCanvas(styleId, options, customMap);
  triggerBlobDownload(await canvasToPngBlob(sheet), `${styleId}_spritesheet_275x50.png`);
}

async function populateStyleFolder(
  folder: JSZip,
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
) {
  const meta = getStyleMeta(styleId);
  const pngFolder = folder.folder('png_25x50')!;

  for (const char of GLYPH_CHARS) {
    const custom = customMap[styleId]?.[char] ?? null;
    const canvas = renderGlyphToCanvas(char, styleId, options, custom);
    pngFolder.file(glyphFileName(char), await canvasToPngBlob(canvas));
  }

  const sheet = buildSpriteSheetCanvas(styleId, options, customMap);
  pngFolder.file('spritesheet_275x50.png', await canvasToPngBlob(sheet));
  folder.file('manifest.json', JSON.stringify({
    styleId,
    name: meta.name,
    category: meta.categoryLabel,
    dimensions: { width: GLYPH_WIDTH, height: GLYPH_HEIGHT },
    colors: { foreground: '#FFFFFF', background: '#000000' },
    files: GLYPH_CHARS.map((char) => ({ char, png: glyphFileName(char) })),
    renderOptions: options,
  }, null, 2));
}

export async function exportStyleZip(
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
) {
  const zip = new JSZip();
  await populateStyleFolder(zip.folder(`${styleId}_png_package_25x50`)!, styleId, options, customMap);
  const blob = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(blob, `chronoglyph_${styleId}_png_package_25x50.zip`);
}

export async function exportCategoryZip(
  category: Exclude<StyleCategory, 'all'>,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
) {
  const zip = new JSZip();
  const styles = GLYPH_STYLES.filter((style) => style.category === category);
  for (const style of styles) {
    await populateStyleFolder(zip.folder(`${style.id}_25x50`)!, style.id, options, customMap);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(blob, `chronoglyph_${category}_${styles.length}_png_styles_25x50.zip`);
}

export async function exportAllStylesZip(
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
) {
  const zip = new JSZip();
  for (const style of GLYPH_STYLES) {
    await populateStyleFolder(zip.folder(`${style.category}/${style.id}_25x50`)!, style.id, options, customMap);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(blob, `chronoglyph_all_${GLYPH_STYLES.length}_png_styles_25x50.zip`);
}

type UiFrame = { value: number; options: UiRenderOptions; suffix: string };
function uiFrames(assetId: UiAssetId, options: UiRenderOptions): UiFrame[] {
  const values = assetId === 'battery' ? Array.from({ length: 11 }, (_, i) => i * 10)
    : assetId === 'signal' || assetId === 'wifi-meter' ? [0, 1, 2, 3, 4]
    : assetId === 'progress-arc' ? Array.from({ length: 21 }, (_, i) => i * 5) : [0];
  return values.map((value) => {
    const next = { ...options };
    if (assetId === 'battery') next.batteryLevel = value;
    if (assetId === 'signal' || assetId === 'wifi-meter') next.signalBars = value;
    if (assetId === 'progress-arc') next.progressPercent = value;
    const suffix = assetId === 'battery' || assetId === 'progress-arc' ? String(value) + 'pct'
      : assetId === 'signal' || assetId === 'wifi-meter' ? String(value) + 'bars' : 'base';
    return { value, options: next, suffix };
  });
}
function uiSize(id: UiAssetId, options: UiRenderOptions) {
  const meta = getUiAssetMeta(id);
  const custom = options.assetSizes?.[id];
  return { width: custom?.width || meta.width, height: custom?.height || meta.height };
}
function buildDynamicSheet(id: UiAssetId, styleId: UiStyleId, options: UiRenderOptions, customMap: CustomUiPixelMap) {
  const frames = uiFrames(id, options), size = uiSize(id, options);
  const sheet = document.createElement('canvas');
  sheet.width = size.width * frames.length; sheet.height = size.height;
  const ctx = sheet.getContext('2d')!;
  ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, sheet.width, sheet.height);
  const coordinates = frames.map((frame, index) => {
    const canvas = renderUiAssetToCanvas(id, styleId, frame.options, customMap[styleId]?.[id] ?? null);
    ctx.drawImage(canvas, index * size.width, 0);
    return { index, value: frame.value, file: id + '_' + frame.suffix + '.png', x: index * size.width, y: 0, width: size.width, height: size.height };
  });
  return { sheet, coordinates };
}
function buildStaticSheet(styleId: UiStyleId, options: UiRenderOptions, customMap: CustomUiPixelMap) {
  const gap = 4, columns = 4;
  const cellW = Math.max(...STATIC_UI_ASSET_IDS.map((id) => uiSize(id, options).width));
  const cellH = Math.max(...STATIC_UI_ASSET_IDS.map((id) => uiSize(id, options).height));
  const rows = Math.ceil(STATIC_UI_ASSET_IDS.length / columns);
  const sheet = document.createElement('canvas');
  sheet.width = columns * cellW + (columns - 1) * gap;
  sheet.height = rows * cellH + (rows - 1) * gap;
  const ctx = sheet.getContext('2d')!;
  ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, sheet.width, sheet.height);
  const coordinates = STATIC_UI_ASSET_IDS.map((id, index) => {
    const size = uiSize(id, options);
    const x = (index % columns) * (cellW + gap) + Math.floor((cellW - size.width) / 2);
    const y = Math.floor(index / columns) * (cellH + gap) + Math.floor((cellH - size.height) / 2);
    const canvas = renderUiAssetToCanvas(id, styleId, options, customMap[styleId]?.[id] ?? null);
    ctx.drawImage(canvas, x, y);
    return { id, x, y, width: size.width, height: size.height };
  });
  return { sheet, coordinates };
}
async function addStaticAssets(zip: JSZip, styleId: UiStyleId, options: UiRenderOptions, customMap: CustomUiPixelMap) {
  const folder = zip.folder('static')!, png = folder.folder('png')!, assets = [];
  for (const id of STATIC_UI_ASSET_IDS) {
    const meta = getUiAssetMeta(id), size = uiSize(id, options);
    const canvas = renderUiAssetToCanvas(id, styleId, options, customMap[styleId]?.[id] ?? null);
    png.file(id + '_' + size.width + 'x' + size.height + '.png', await canvasToPngBlob(canvas));
    assets.push({ id, name: meta.name, width: size.width, height: size.height });
  }
  const built = buildStaticSheet(styleId, options, customMap), sheetFolder = folder.folder('spritesheet')!;
  sheetFolder.file('static_ui_spritesheet.png', await canvasToPngBlob(built.sheet));
  sheetFolder.file('static_ui_spritesheet.json', JSON.stringify({ layout: 'grid', columns: 4, sheet: { width: built.sheet.width, height: built.sheet.height }, assets: built.coordinates }, null, 2));
  return assets;
}
async function addDynamicAssets(zip: JSZip, styleId: UiStyleId, options: UiRenderOptions, customMap: CustomUiPixelMap, onlyId?: UiAssetId) {
  const ids = onlyId ? [onlyId] : [...DYNAMIC_UI_ASSET_IDS], assets = [];
  for (const id of ids) {
    const meta = getUiAssetMeta(id), size = uiSize(id, options), folder = zip.folder('dynamic')!.folder(id)!;
    const frames = uiFrames(id, options);
    for (const frame of frames) {
      const canvas = renderUiAssetToCanvas(id, styleId, frame.options, customMap[styleId]?.[id] ?? null);
      folder.file(id + '_' + frame.suffix + '.png', await canvasToPngBlob(canvas));
    }
    const built = buildDynamicSheet(id, styleId, options, customMap);
    folder.file(id + '_spritesheet.png', await canvasToPngBlob(built.sheet));
    folder.file(id + '_spritesheet.json', JSON.stringify({ assetId: id, layout: 'horizontal', sheet: { width: built.sheet.width, height: built.sheet.height }, frameCount: built.coordinates.length, frames: built.coordinates }, null, 2));
    assets.push({ id, name: meta.name, width: size.width, height: size.height, frameCount: frames.length, values: frames.map((f) => f.value) });
  }
  return assets;
}
function makeUiManifest(styleId: UiStyleId, options: UiRenderOptions, dynamic: unknown[], statics: unknown[]) {
  const style = getUiStyleMeta(styleId);
  return { schemaVersion: 2, generator: 'Neo Clock UI Asset Generator',
    style: { id: styleId, name: style.name, category: style.categoryLabel },
    colors: { foreground: '#FFFFFF', background: '#000000' },
    outputDimensions: { mode: 'per-asset', customSizes: options.assetSizes || {}, nativeFallback: true },
    renderOptions: options, groups: { dynamic: { assets: dynamic }, static: { assets: statics } } };
}
export async function downloadSingleUiAssetPng(assetId: UiAssetId, styleId: UiStyleId, options: UiRenderOptions, customMap: CustomUiPixelMap) {
  const size = uiSize(assetId, options), canvas = renderUiAssetToCanvas(assetId, styleId, options, customMap[styleId]?.[assetId] ?? null);
  triggerBlobDownload(await canvasToPngBlob(canvas), styleId + '_' + assetId + '_' + size.width + 'x' + size.height + '.png');
}
export async function downloadSingleStaticUiAssetPng(assetId: UiAssetId, styleId: UiStyleId, options: UiRenderOptions, customMap: CustomUiPixelMap) {
  if (!(STATIC_UI_ASSET_IDS as readonly string[]).includes(assetId)) throw new Error('Bukan ikon statis.');
  const size = uiSize(assetId, options);
  const canvas = renderUiAssetToCanvas(assetId, styleId, options, customMap[styleId]?.[assetId] ?? null);
  triggerBlobDownload(await canvasToPngBlob(canvas), 'ui_static_' + assetId + '_' + size.width + 'x' + size.height + '.png');
}
export async function exportSingleDynamicUiAssetZip(assetId: UiAssetId, styleId: UiStyleId, options: UiRenderOptions, customMap: CustomUiPixelMap) {
  if (!(DYNAMIC_UI_ASSET_IDS as readonly string[]).includes(assetId)) throw new Error('Bukan ikon dinamis.');
  const zip = new JSZip(), dynamic = await addDynamicAssets(zip, styleId, options, customMap, assetId);
  zip.file('manifest.json', JSON.stringify(makeUiManifest(styleId, options, dynamic, []), null, 2));
  triggerBlobDownload(await zip.generateAsync({ type: 'blob' }), 'ui_dynamic_' + assetId + '.zip');
}
export async function exportAllStaticUiAssetsZip(styleId: UiStyleId, options: UiRenderOptions, customMap: CustomUiPixelMap) {
  const zip = new JSZip(), statics = await addStaticAssets(zip, styleId, options, customMap);
  zip.file('manifest.json', JSON.stringify(makeUiManifest(styleId, options, [], statics), null, 2));
  triggerBlobDownload(await zip.generateAsync({ type: 'blob' }), 'ui_all_static_assets.zip');
}
export async function exportAllDynamicUiAssetsZip(styleId: UiStyleId, options: UiRenderOptions, customMap: CustomUiPixelMap) {
  const zip = new JSZip(), dynamic = await addDynamicAssets(zip, styleId, options, customMap);
  zip.file('manifest.json', JSON.stringify(makeUiManifest(styleId, options, dynamic, []), null, 2));
  triggerBlobDownload(await zip.generateAsync({ type: 'blob' }), 'ui_all_dynamic_assets.zip');
}
export async function exportUiStyleZip(styleId: UiStyleId, options: UiRenderOptions, customMap: CustomUiPixelMap) {
  const zip = new JSZip(), dynamic = await addDynamicAssets(zip, styleId, options, customMap);
  const statics = await addStaticAssets(zip, styleId, options, customMap);
  zip.file('manifest.json', JSON.stringify(makeUiManifest(styleId, options, dynamic, statics), null, 2));
  triggerBlobDownload(await zip.generateAsync({ type: 'blob' }), 'ui_full_package_' + styleId + '.zip');
}
export async function exportAllUiStylesZip(options: UiRenderOptions, customMap: CustomUiPixelMap) {
  const zip = new JSZip();
  for (const style of UI_STYLES) {
    const folder = zip.folder(style.category)!.folder(style.id)!;
    const dynamic = await addDynamicAssets(folder, style.id, options, customMap);
    const statics = await addStaticAssets(folder, style.id, options, customMap);
    folder.file('manifest.json', JSON.stringify(makeUiManifest(style.id, options, dynamic, statics), null, 2));
  }
  triggerBlobDownload(await zip.generateAsync({ type: 'blob' }), 'ui_full_packages_all_' + UI_STYLES.length + '_styles.zip');
}
export async function downloadUiSpriteSheetPng(styleId: UiStyleId, options: UiRenderOptions, customMap: CustomUiPixelMap) {
  const built = buildStaticSheet(styleId, options, customMap);
  triggerBlobDownload(await canvasToPngBlob(built.sheet), 'static_ui_spritesheet_' + built.sheet.width + 'x' + built.sheet.height + '.png');
}
