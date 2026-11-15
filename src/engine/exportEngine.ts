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
  UI_ASSET_IDS,
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

export async function downloadSingleUiAssetPng(
  assetId: UiAssetId,
  styleId: UiStyleId,
  options: UiRenderOptions,
  customMap: CustomUiPixelMap
) {
  const meta = getUiAssetMeta(assetId);
  const custom = customMap[styleId]?.[assetId] ?? null;
  const canvas = renderUiAssetToCanvas(assetId, styleId, options, custom);
  triggerBlobDownload(await canvasToPngBlob(canvas), `${styleId}_${assetId}_${meta.width}x${meta.height}.png`);
}

export function buildUiSpriteSheetCanvas(
  styleId: UiStyleId,
  options: UiRenderOptions,
  customMap: CustomUiPixelMap
): HTMLCanvasElement {
  const gap = 4;
  const width = UI_ASSET_CATALOG.reduce((sum, asset) => sum + asset.width, 0) + gap * (UI_ASSET_CATALOG.length - 1);
  const height = Math.max(...UI_ASSET_CATALOG.map((asset) => asset.height));
  const sheet = document.createElement('canvas');
  sheet.width = width;
  sheet.height = height;
  const ctx = sheet.getContext('2d')!;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  let cursorX = 0;
  for (const asset of UI_ASSET_CATALOG) {
    const custom = customMap[styleId]?.[asset.id] ?? null;
    const canvas = renderUiAssetToCanvas(asset.id, styleId, options, custom);
    ctx.drawImage(canvas, cursorX, Math.floor((height - asset.height) / 2));
    cursorX += asset.width + gap;
  }
  return sheet;
}

export async function downloadUiSpriteSheetPng(
  styleId: UiStyleId,
  options: UiRenderOptions,
  customMap: CustomUiPixelMap
) {
  const sheet = buildUiSpriteSheetCanvas(styleId, options, customMap);
  triggerBlobDownload(await canvasToPngBlob(sheet), `${styleId}_ui_atlas_${sheet.width}x${sheet.height}.png`);
}

async function populateUiStyleFolder(
  folder: JSZip,
  styleId: UiStyleId,
  options: UiRenderOptions,
  customMap: CustomUiPixelMap
) {
  const meta = getUiStyleMeta(styleId);
  const pngFolder = folder.folder('png_assets')!;

  for (const assetId of UI_ASSET_IDS) {
    const asset = getUiAssetMeta(assetId);
    const custom = customMap[styleId]?.[assetId] ?? null;
    const canvas = renderUiAssetToCanvas(assetId, styleId, options, custom);
    pngFolder.file(`${assetId}_${asset.width}x${asset.height}.png`, await canvasToPngBlob(canvas));
  }

  const sheet = buildUiSpriteSheetCanvas(styleId, options, customMap);
  pngFolder.file(`ui_atlas_${sheet.width}x${sheet.height}.png`, await canvasToPngBlob(sheet));
  folder.file('manifest.json', JSON.stringify({
    uiStyleId: styleId,
    name: meta.name,
    category: meta.categoryLabel,
    colors: { foreground: '#FFFFFF', background: '#000000' },
    assets: UI_ASSET_CATALOG.map((asset) => ({
      id: asset.id,
      name: asset.name,
      width: asset.width,
      height: asset.height,
      png: `${asset.id}_${asset.width}x${asset.height}.png`,
    })),
    renderOptions: options,
  }, null, 2));
}

export async function exportUiStyleZip(
  styleId: UiStyleId,
  options: UiRenderOptions,
  customMap: CustomUiPixelMap
) {
  const zip = new JSZip();
  await populateUiStyleFolder(zip.folder(`${styleId}_ui_png_pack`)!, styleId, options, customMap);
  const blob = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(blob, `chronoglyph_ui_${styleId}_png_pack.zip`);
}

export async function exportAllUiStylesZip(
  options: UiRenderOptions,
  customMap: CustomUiPixelMap
) {
  const zip = new JSZip();
  for (const style of UI_STYLES) {
    await populateUiStyleFolder(zip.folder(`${style.category}/${style.id}_ui_png_pack`)!, style.id, options, customMap);
  }
  const blob = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(blob, `chronoglyph_all_${UI_STYLES.length}_ui_png_styles_pack.zip`);
}
