import JSZip from 'jszip';
import {
  CustomPixelMap,
  GLYPH_CHARS,
  GLYPH_HEIGHT,
  GLYPH_WIDTH,
  GlyphChar,
  GlyphRenderOptions,
  StyleId,
} from '../types/glyph';
import {
  buildBmFontDescriptor,
  buildC1BitHeader,
  buildCRgb565Header,
  buildImage2CppCode,
  buildRawBinaryBuffer,
  canvasToBmpBlob,
} from './bitmapEncoder';
import { renderGlyphToCanvas } from './glyphRenderer';
import { GLYPH_STYLES, getStyleMeta } from './glyphStyles';

export function glyphFileName(char: GlyphChar, ext: 'png' | 'bmp' = 'png'): string {
  return char === ':' ? `colon.${ext}` : `${char}.${ext}`;
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
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadSingleGlyphPng(
  char: GlyphChar,
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
) {
  const custom = customMap[styleId]?.[char] ?? null;
  const canvas = renderGlyphToCanvas(char, styleId, options, custom);
  const blob = await canvasToPngBlob(canvas);
  triggerBlobDownload(blob, `${styleId}_${glyphFileName(char, 'png')}`);
}

export function downloadSingleGlyphBmp(
  char: GlyphChar,
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap,
  bitsPerPixel: 1 | 24
) {
  const custom = customMap[styleId]?.[char] ?? null;
  const canvas = renderGlyphToCanvas(char, styleId, options, custom);
  const blob = canvasToBmpBlob(canvas, bitsPerPixel, options.threshold);
  triggerBlobDownload(
    blob,
    `${styleId}_${bitsPerPixel}bit_${glyphFileName(char, 'bmp')}`
  );
}

export function buildSpriteSheetCanvas(
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
): HTMLCanvasElement {
  const sheet = document.createElement('canvas');
  sheet.width = GLYPH_WIDTH * GLYPH_CHARS.length; // 275px
  sheet.height = GLYPH_HEIGHT; // 50px
  const ctx = sheet.getContext('2d')!;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, sheet.width, sheet.height);

  GLYPH_CHARS.forEach((ch, idx) => {
    const custom = customMap[styleId]?.[ch] ?? null;
    const glyphCanvas = renderGlyphToCanvas(ch, styleId, options, custom);
    ctx.drawImage(glyphCanvas, idx * GLYPH_WIDTH, 0);
  });

  return sheet;
}

export async function downloadSpriteSheetPng(
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
) {
  const sheet = buildSpriteSheetCanvas(styleId, options, customMap);
  const blob = await canvasToPngBlob(sheet);
  triggerBlobDownload(blob, `${styleId}_spritesheet_275x50.png`);
}

export function downloadSpriteSheetBmp(
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap,
  bitsPerPixel: 1 | 24
) {
  const sheet = buildSpriteSheetCanvas(styleId, options, customMap);
  const blob = canvasToBmpBlob(sheet, bitsPerPixel, options.threshold);
  triggerBlobDownload(blob, `${styleId}_spritesheet_275x50_${bitsPerPixel}bit.bmp`);
}

export function buildCHeaderString(
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
): string {
  const meta = getStyleMeta(styleId);
  const safeId = styleId.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
  const lines: string[] = [
    `/*`,
    ` * ChronoGlyph Studio — Smartwatch Numeral Firmware Asset`,
    ` * Style: ${meta.name} (${meta.categoryLabel})`,
    ` * Dimensions: ${GLYPH_WIDTH}x${GLYPH_HEIGHT} px (1250 bytes/glyph, 8-bit L8 luminance, #FFFFFF on #000000)`,
    ` * Mode: ${options.pixelSnap ? '1-bit Binary Pixel-Snap' : '8-bit Anti-Aliased OLED'}`,
    ` */`,
    `#ifndef CHRONOGLYPH_${safeId}_H`,
    `#define CHRONOGLYPH_${safeId}_H`,
    ``,
    `#include <stdint.h>`,
    ``,
    `#define GLYPH_WIDTH  ${GLYPH_WIDTH}`,
    `#define GLYPH_HEIGHT ${GLYPH_HEIGHT}`,
    `#define GLYPH_COUNT  ${GLYPH_CHARS.length}`,
    ``,
  ];

  GLYPH_CHARS.forEach((ch) => {
    const label = ch === ':' ? 'colon' : ch;
    const custom = customMap[styleId]?.[ch] ?? null;
    const canvas = renderGlyphToCanvas(ch, styleId, options, custom);
    const ctx = canvas.getContext('2d')!;
    const img = ctx.getImageData(0, 0, GLYPH_WIDTH, GLYPH_HEIGHT).data;

    lines.push(`static const uint8_t glyph_${label}[${GLYPH_WIDTH * GLYPH_HEIGHT}] = {`);
    for (let y = 0; y < GLYPH_HEIGHT; y++) {
      const rowHex: string[] = [];
      for (let x = 0; x < GLYPH_WIDTH; x++) {
        const val = img[(y * GLYPH_WIDTH + x) * 4];
        rowHex.push(`0x${val.toString(16).padStart(2, '0').toUpperCase()}`);
      }
      lines.push(`  ${rowHex.join(', ')}${y < GLYPH_HEIGHT - 1 ? ',' : ''}`);
    }
    lines.push(`};`);
    lines.push(``);
  });

  lines.push(`static const uint8_t* const ${safeId}_GLYPHS[GLYPH_COUNT] = {`);
  lines.push(
    `  ${GLYPH_CHARS.map((ch) => `glyph_${ch === ':' ? 'colon' : ch}`).join(', ')}`
  );
  lines.push(`};`);
  lines.push(``);
  lines.push(`#endif /* CHRONOGLYPH_${safeId}_H */`);

  return lines.join('\n');
}

export function downloadTextFile(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  triggerBlobDownload(blob, filename);
}

export function downloadBinaryFile(data: Uint8Array, filename: string) {
  const copy = new Uint8Array(data.length);
  copy.set(data);
  const blob = new Blob([copy.buffer], { type: 'application/octet-stream' });
  triggerBlobDownload(blob, filename);
}

export function downloadCHeader(
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
) {
  downloadTextFile(
    buildCHeaderString(styleId, options, customMap),
    `${styleId}_glyphs_l8_25x50.h`
  );
}

async function populateStyleFolder(
  folder: JSZip,
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
) {
  const meta = getStyleMeta(styleId);
  const pngFolder = folder.folder('png_25x50')!;
  const bmp24Folder = folder.folder('bmp_24bit_25x50')!;
  const bmp1Folder = folder.folder('bmp_1bit_25x50')!;
  const fwFolder = folder.folder('firmware')!;

  for (const ch of GLYPH_CHARS) {
    const custom = customMap[styleId]?.[ch] ?? null;
    const canvas = renderGlyphToCanvas(ch, styleId, options, custom);

    const pngBlob = await canvasToPngBlob(canvas);
    pngFolder.file(glyphFileName(ch, 'png'), pngBlob);

    bmp24Folder.file(
      glyphFileName(ch, 'bmp'),
      canvasToBmpBlob(canvas, 24, options.threshold)
    );
    bmp1Folder.file(
      glyphFileName(ch, 'bmp'),
      canvasToBmpBlob(canvas, 1, options.threshold)
    );
  }

  const sheet = buildSpriteSheetCanvas(styleId, options, customMap);
  pngFolder.file('spritesheet_275x50.png', await canvasToPngBlob(sheet));
  bmp24Folder.file('spritesheet_275x50.bmp', canvasToBmpBlob(sheet, 24, options.threshold));
  bmp1Folder.file(
    'spritesheet_275x50_1bit.bmp',
    canvasToBmpBlob(sheet, 1, options.threshold)
  );

  fwFolder.file(
    'image2cpp_arduino_progmem.h',
    buildImage2CppCode(styleId, options, customMap, {
      drawMode: 'horizontal-msb',
      outputStyle: 'arduino-progmem',
      invertColors: false,
      prefix: 'epd_bitmap',
      includeAllArray: true,
      threshold: options.threshold,
    })
  );
  fwFolder.file(
    'image2cpp_ssd1306_vertical.h',
    buildImage2CppCode(styleId, options, customMap, {
      drawMode: 'vertical-lsb',
      outputStyle: 'arduino-progmem',
      invertColors: false,
      prefix: 'oled_bitmap',
      includeAllArray: true,
      threshold: options.threshold,
    })
  );
  fwFolder.file('glyphs_l8_25x50.h', buildCHeaderString(styleId, options, customMap));
  fwFolder.file('glyphs_1bit_25x50.h', buildC1BitHeader(styleId, options, customMap));
  fwFolder.file('glyphs_rgb565_25x50.h', buildCRgb565Header(styleId, options, customMap));
  fwFolder.file('atlas_275x50.fnt', buildBmFontDescriptor(styleId));
  fwFolder.file(
    'glyphs_1bit_25x50.bin',
    buildRawBinaryBuffer(styleId, options, customMap, '1bit')
  );
  fwFolder.file(
    'glyphs_l8_25x50.bin',
    buildRawBinaryBuffer(styleId, options, customMap, 'l8')
  );

  folder.file(
    'manifest.json',
    JSON.stringify(
      {
        styleId,
        name: meta.name,
        category: meta.categoryLabel,
        dimensions: { width: GLYPH_WIDTH, height: GLYPH_HEIGHT },
        colors: { foreground: '#FFFFFF', background: '#000000' },
        packages: {
          png: 'png_25x50/',
          bmp24: 'bmp_24bit_25x50/',
          bmp1: 'bmp_1bit_25x50/',
          firmware: 'firmware/',
        },
        files: GLYPH_CHARS.map((ch) => ({
          char: ch,
          png: glyphFileName(ch, 'png'),
          bmp: glyphFileName(ch, 'bmp'),
        })),
        renderOptions: options,
      },
      null,
      2
    )
  );
}

export async function exportStyleZip(
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
) {
  const zip = new JSZip();
  const folder = zip.folder(`${styleId}_package_25x50`)!;
  await populateStyleFolder(folder, styleId, options, customMap);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(zipBlob, `chronoglyph_${styleId}_paket_lengkap_25x50.zip`);
}

export async function exportAllStylesZip(
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
) {
  const zip = new JSZip();

  for (const style of GLYPH_STYLES) {
    const folder = zip.folder(`${style.category}/${style.id}_25x50`)!;
    await populateStyleFolder(folder, style.id, options, customMap);
  }

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(
    zipBlob,
    `chronoglyph_all_${GLYPH_STYLES.length}_styles_25x50.zip`
  );
}
