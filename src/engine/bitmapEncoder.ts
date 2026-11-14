import {
  CustomPixelMap,
  GLYPH_CHARS,
  GLYPH_HEIGHT,
  GLYPH_WIDTH,
  GlyphChar,
  GlyphRenderOptions,
  StyleId,
} from '../types/glyph';
import { renderGlyphToCanvas } from './glyphRenderer';
import { getStyleMeta } from './glyphStyles';

export type BitmapFormatId =
  | 'image2cpp'
  | 'bmp-1bit'
  | 'bmp-24bit'
  | 'c-l8'
  | 'c-rgb565'
  | 'bmfont-fnt'
  | 'bin-1bit';

export type Image2CppDrawMode =
  | 'horizontal-msb'
  | 'horizontal-lsb'
  | 'vertical-lsb'
  | 'vertical-msb';

export type Image2CppOutputStyle =
  | 'arduino-progmem'
  | 'uint8-std'
  | 'plain-bytes'
  | 'micropython';

export interface Image2CppOptions {
  drawMode: Image2CppDrawMode;
  outputStyle: Image2CppOutputStyle;
  invertColors: boolean;
  prefix: string;
  includeAllArray: boolean;
  threshold: number;
}

/**
 * Encodes an HTMLCanvasElement into a spec-compliant Windows/Firmware BMP Blob.
 * Supports 1-bit monochrome (2-color #000000 / #FFFFFF) and 24-bit RGB BMP.
 */
export function canvasToBmpBlob(
  canvas: HTMLCanvasElement,
  bitsPerPixel: 1 | 24,
  threshold = 128
): Blob {
  const width = canvas.width;
  const height = canvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const img = ctx.getImageData(0, 0, width, height).data;

  if (bitsPerPixel === 1) {
    const rowBytes = Math.ceil(width / 32) * 4;
    const pixelDataSize = rowBytes * height;
    const headerSize = 14 + 40 + 8; // File header + DIB + 2-color palette
    const fileSize = headerSize + pixelDataSize;
    const buffer = new ArrayBuffer(fileSize);
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);

    // BMP File Header (14 bytes)
    bytes[0] = 0x42; // 'B'
    bytes[1] = 0x4d; // 'M'
    view.setUint32(2, fileSize, true);
    view.setUint32(6, 0, true);
    view.setUint32(10, headerSize, true);

    // BITMAPINFOHEADER (40 bytes)
    view.setUint32(14, 40, true);
    view.setInt32(18, width, true);
    view.setInt32(22, height, true); // positive = bottom-up
    view.setUint16(26, 1, true); // planes
    view.setUint16(28, 1, true); // bpp
    view.setUint32(30, 0, true); // BI_RGB
    view.setUint32(34, pixelDataSize, true);
    view.setInt32(38, 2835, true);
    view.setInt32(42, 2835, true);
    view.setUint32(46, 2, true); // colors used
    view.setUint32(50, 2, true); // important colors

    // Palette: 0 = Black (#000000), 1 = White (#FFFFFF) in BGRA
    bytes[54] = 0x00; bytes[55] = 0x00; bytes[56] = 0x00; bytes[57] = 0x00;
    bytes[58] = 0xff; bytes[59] = 0xff; bytes[60] = 0xff; bytes[61] = 0x00;

    // Pixel data bottom-up, MSB first
    for (let y = 0; y < height; y++) {
      const srcY = height - 1 - y;
      const dstRowStart = headerSize + y * rowBytes;
      for (let x = 0; x < width; x++) {
        const idx = (srcY * width + x) * 4;
        const lum = Math.round(0.299 * img[idx] + 0.587 * img[idx + 1] + 0.114 * img[idx + 2]);
        if (lum >= threshold) {
          const byteOffset = dstRowStart + (x >> 3);
          const bitMask = 0x80 >> (x & 7);
          bytes[byteOffset] |= bitMask;
        }
      }
    }

    return new Blob([buffer], { type: 'image/bmp' });
  }

  // 24-bit RGB BMP
  const rowBytes = Math.ceil((width * 3) / 4) * 4;
  const pixelDataSize = rowBytes * height;
  const headerSize = 54;
  const fileSize = headerSize + pixelDataSize;
  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);

  bytes[0] = 0x42;
  bytes[1] = 0x4d;
  view.setUint32(2, fileSize, true);
  view.setUint32(6, 0, true);
  view.setUint32(10, headerSize, true);

  view.setUint32(14, 40, true);
  view.setInt32(18, width, true);
  view.setInt32(22, height, true);
  view.setUint16(26, 1, true);
  view.setUint16(28, 24, true);
  view.setUint32(30, 0, true);
  view.setUint32(34, pixelDataSize, true);
  view.setInt32(38, 2835, true);
  view.setInt32(42, 2835, true);
  view.setUint32(46, 0, true);
  view.setUint32(50, 0, true);

  for (let y = 0; y < height; y++) {
    const srcY = height - 1 - y;
    const dstRowStart = headerSize + y * rowBytes;
    for (let x = 0; x < width; x++) {
      const sIdx = (srcY * width + x) * 4;
      const dIdx = dstRowStart + x * 3;
      bytes[dIdx] = img[sIdx + 2];     // B
      bytes[dIdx + 1] = img[sIdx + 1]; // G
      bytes[dIdx + 2] = img[sIdx];     // R
    }
  }

  return new Blob([buffer], { type: 'image/bmp' });
}

/**
 * Generates packed 1-bit MSB bitmap C header (4 bytes/row * 50 rows = 200 bytes/glyph).
 */
export function buildC1BitHeader(
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
): string {
  const meta = getStyleMeta(styleId);
  const safeId = styleId.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();
  const bytesPerRow = Math.ceil(GLYPH_WIDTH / 8); // 4 bytes
  const bytesPerGlyph = bytesPerRow * GLYPH_HEIGHT; // 200 bytes

  const lines: string[] = [
    `/*`,
    ` * ChronoGlyph Studio — 1-Bit Packed Monochrome Bitmap Header`,
    ` * Style: ${meta.name} (${meta.categoryLabel})`,
    ` * Dimensions: ${GLYPH_WIDTH}x${GLYPH_HEIGHT} px (${bytesPerRow} bytes/row, ${bytesPerGlyph} bytes/glyph, MSB first)`,
    ` * Compatible: Adafruit GFX, LVGL, U8g2, Watchy, STM32/ESP32 OLED`,
    ` */`,
    `#ifndef CHRONOGLYPH_${safeId}_1BIT_H`,
    `#define CHRONOGLYPH_${safeId}_1BIT_H`,
    ``,
    `#include <stdint.h>`,
    ``,
    `#define GLYPH_WIDTH          ${GLYPH_WIDTH}`,
    `#define GLYPH_HEIGHT         ${GLYPH_HEIGHT}`,
    `#define GLYPH_BYTES_PER_ROW  ${bytesPerRow}`,
    `#define GLYPH_BYTE_SIZE      ${bytesPerGlyph}`,
    ``,
  ];

  GLYPH_CHARS.forEach((ch) => {
    const label = ch === ':' ? 'colon' : ch;
    const custom = customMap[styleId]?.[ch] ?? null;
    const canvas = renderGlyphToCanvas(ch, styleId, options, custom);
    const img = canvas.getContext('2d', { willReadFrequently: true })!.getImageData(
      0,
      0,
      GLYPH_WIDTH,
      GLYPH_HEIGHT
    ).data;

    lines.push(`static const uint8_t glyph_1bit_${label}[${bytesPerGlyph}] = {`);
    for (let y = 0; y < GLYPH_HEIGHT; y++) {
      const rowBytes: string[] = [];
      for (let b = 0; b < bytesPerRow; b++) {
        let byteVal = 0;
        for (let bit = 0; bit < 8; bit++) {
          const x = b * 8 + bit;
          if (x < GLYPH_WIDTH) {
            const lum = img[(y * GLYPH_WIDTH + x) * 4];
            if (lum >= options.threshold) {
              byteVal |= 0x80 >> bit;
            }
          }
        }
        rowBytes.push(`0x${byteVal.toString(16).padStart(2, '0').toUpperCase()}`);
      }
      lines.push(`  ${rowBytes.join(', ')}${y < GLYPH_HEIGHT - 1 ? ',' : ''}`);
    }
    lines.push(`};`);
    lines.push(``);
  });

  lines.push(`static const uint8_t* const ${safeId}_1BIT_GLYPHS[${GLYPH_CHARS.length}] = {`);
  lines.push(
    `  ${GLYPH_CHARS.map((ch) => `glyph_1bit_${ch === ':' ? 'colon' : ch}`).join(', ')}`
  );
  lines.push(`};`);
  lines.push(``);
  lines.push(`#endif /* CHRONOGLYPH_${safeId}_1BIT_H */`);

  return lines.join('\n');
}

/**
 * Generates 16-bit RGB565 C header (1250 uint16_t words/glyph, big-endian/little-endian compatible).
 */
export function buildCRgb565Header(
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
): string {
  const meta = getStyleMeta(styleId);
  const safeId = styleId.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase();

  const lines: string[] = [
    `/*`,
    ` * ChronoGlyph Studio — 16-Bit RGB565 Smartwatch Display Bitmap`,
    ` * Style: ${meta.name} (${meta.categoryLabel})`,
    ` * Dimensions: ${GLYPH_WIDTH}x${GLYPH_HEIGHT} px (${GLYPH_WIDTH * GLYPH_HEIGHT} uint16_t words/glyph, 2500 bytes/glyph)`,
    ` * Colors: #FFFFFF (0xFFFF) on #000000 (0x0000)`,
    ` */`,
    `#ifndef CHRONOGLYPH_${safeId}_RGB565_H`,
    `#define CHRONOGLYPH_${safeId}_RGB565_H`,
    ``,
    `#include <stdint.h>`,
    ``,
    `#define GLYPH_WIDTH  ${GLYPH_WIDTH}`,
    `#define GLYPH_HEIGHT ${GLYPH_HEIGHT}`,
    ``,
  ];

  GLYPH_CHARS.forEach((ch) => {
    const label = ch === ':' ? 'colon' : ch;
    const custom = customMap[styleId]?.[ch] ?? null;
    const canvas = renderGlyphToCanvas(ch, styleId, options, custom);
    const img = canvas.getContext('2d', { willReadFrequently: true })!.getImageData(
      0,
      0,
      GLYPH_WIDTH,
      GLYPH_HEIGHT
    ).data;

    lines.push(
      `static const uint16_t glyph_rgb565_${label}[${GLYPH_WIDTH * GLYPH_HEIGHT}] = {`
    );
    for (let y = 0; y < GLYPH_HEIGHT; y++) {
      const rowWords: string[] = [];
      for (let x = 0; x < GLYPH_WIDTH; x++) {
        const lum = img[(y * GLYPH_WIDTH + x) * 4];
        const r5 = (lum >> 3) & 0x1f;
        const g6 = (lum >> 2) & 0x3f;
        const b5 = (lum >> 3) & 0x1f;
        const rgb565 = (r5 << 11) | (g6 << 5) | b5;
        rowWords.push(`0x${rgb565.toString(16).padStart(4, '0').toUpperCase()}`);
      }
      lines.push(`  ${rowWords.join(', ')}${y < GLYPH_HEIGHT - 1 ? ',' : ''}`);
    }
    lines.push(`};`);
    lines.push(``);
  });

  lines.push(`static const uint16_t* const ${safeId}_RGB565_GLYPHS[${GLYPH_CHARS.length}] = {`);
  lines.push(
    `  ${GLYPH_CHARS.map((ch) => `glyph_rgb565_${ch === ':' ? 'colon' : ch}`).join(', ')}`
  );
  lines.push(`};`);
  lines.push(``);
  lines.push(`#endif /* CHRONOGLYPH_${safeId}_RGB565_H */`);

  return lines.join('\n');
}

/**
 * Generates BMFont .fnt text descriptor mapping 0-9 and : to the 275x50 atlas.
 */
export function buildBmFontDescriptor(styleId: StyleId): string {
  const meta = getStyleMeta(styleId);
  const atlasWidth = GLYPH_WIDTH * GLYPH_CHARS.length; // 275
  const lines: string[] = [
    `info face="${meta.name}" size=50 bold=0 italic=0 charset="" unicode=1 stretchH=100 smooth=1 aa=1 padding=0,0,0,0 spacing=0,0 outline=0`,
    `common lineHeight=50 base=44 scaleW=${atlasWidth} scaleH=${GLYPH_HEIGHT} pages=1 packed=0 alphaChnl=0 redChnl=4 greenChnl=4 blueChnl=4`,
    `page id=0 file="spritesheet_275x50.bmp"`,
    `chars count=${GLYPH_CHARS.length}`,
  ];

  GLYPH_CHARS.forEach((ch, idx) => {
    const ascii = ch.charCodeAt(0);
    const x = idx * GLYPH_WIDTH;
    lines.push(
      `char id=${ascii.toString().padEnd(3)} x=${x.toString().padEnd(4)} y=0    width=25   height=50   xoffset=0    yoffset=0    xadvance=25   page=0  chnl=15`
    );
  });

  return lines.join('\n');
}

/**
 * Builds a raw contiguous binary buffer (.bin) containing all 11 glyphs sequentially.
 * mode = '1bit': 11 * 200 bytes = 2200 bytes
 * mode = 'l8': 11 * 1250 bytes = 13750 bytes
 */
export function buildRawBinaryBuffer(
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap,
  mode: '1bit' | 'l8'
): Uint8Array {
  if (mode === 'l8') {
    const perGlyph = GLYPH_WIDTH * GLYPH_HEIGHT;
    const buf = new Uint8Array(perGlyph * GLYPH_CHARS.length);
    GLYPH_CHARS.forEach((ch, idx) => {
      const custom = customMap[styleId]?.[ch] ?? null;
      const canvas = renderGlyphToCanvas(ch, styleId, options, custom);
      const img = canvas.getContext('2d', { willReadFrequently: true })!.getImageData(
        0,
        0,
        GLYPH_WIDTH,
        GLYPH_HEIGHT
      ).data;
      const offset = idx * perGlyph;
      for (let i = 0; i < perGlyph; i++) {
        buf[offset + i] = img[i * 4];
      }
    });
    return buf;
  }

  const bytesPerRow = Math.ceil(GLYPH_WIDTH / 8); // 4
  const perGlyph = bytesPerRow * GLYPH_HEIGHT; // 200
  const buf = new Uint8Array(perGlyph * GLYPH_CHARS.length);
  GLYPH_CHARS.forEach((ch, idx) => {
    const custom = customMap[styleId]?.[ch] ?? null;
    const canvas = renderGlyphToCanvas(ch, styleId, options, custom);
    const img = canvas.getContext('2d', { willReadFrequently: true })!.getImageData(
      0,
      0,
      GLYPH_WIDTH,
      GLYPH_HEIGHT
    ).data;
    const glyphOffset = idx * perGlyph;
    for (let y = 0; y < GLYPH_HEIGHT; y++) {
      for (let b = 0; b < bytesPerRow; b++) {
        let byteVal = 0;
        for (let bit = 0; bit < 8; bit++) {
          const x = b * 8 + bit;
          if (x < GLYPH_WIDTH) {
            const lum = img[(y * GLYPH_WIDTH + x) * 4];
            if (lum >= options.threshold) {
              byteVal |= 0x80 >> bit;
            }
          }
        }
        buf[glyphOffset + y * bytesPerRow + b] = byteVal;
      }
    }
  });
  return buf;
}

/**
 * Generates a clean ASCII art / bit matrix string for quick visual verification of a 25x50 glyph.
 */
export function buildAsciiBitPreview(
  char: GlyphChar,
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap
): string {
  const custom = customMap[styleId]?.[char] ?? null;
  const canvas = renderGlyphToCanvas(char, styleId, options, custom);
  const img = canvas.getContext('2d', { willReadFrequently: true })!.getImageData(
    0,
    0,
    GLYPH_WIDTH,
    GLYPH_HEIGHT
  ).data;

  const rows: string[] = [];
  for (let y = 0; y < GLYPH_HEIGHT; y++) {
    let row = '';
    for (let x = 0; x < GLYPH_WIDTH; x++) {
      const lum = img[(y * GLYPH_WIDTH + x) * 4];
      row += lum >= options.threshold ? '█' : '·';
    }
    rows.push(`${y.toString().padStart(2, '0')} ${row}`);
  }
  return rows.join('\n');
}

export function encodeGlyphToImage2CppBytes(
  canvas: HTMLCanvasElement,
  cfg: Image2CppOptions
): number[] {
  const img = canvas
    .getContext('2d', { willReadFrequently: true })!
    .getImageData(0, 0, GLYPH_WIDTH, GLYPH_HEIGHT).data;

  const isPixelOn = (x: number, y: number): boolean => {
    if (x < 0 || x >= GLYPH_WIDTH || y < 0 || y >= GLYPH_HEIGHT) return false;
    const lum = img[(y * GLYPH_WIDTH + x) * 4];
    const lit = lum >= cfg.threshold;
    return cfg.invertColors ? !lit : lit;
  };

  const bytes: number[] = [];

  if (cfg.drawMode === 'horizontal-msb' || cfg.drawMode === 'horizontal-lsb') {
    const bytesPerRow = Math.ceil(GLYPH_WIDTH / 8); // 4
    const lsb = cfg.drawMode === 'horizontal-lsb';
    for (let y = 0; y < GLYPH_HEIGHT; y++) {
      for (let b = 0; b < bytesPerRow; b++) {
        let byteVal = 0;
        for (let bit = 0; bit < 8; bit++) {
          const x = b * 8 + bit;
          if (isPixelOn(x, y)) {
            byteVal |= lsb ? 1 << bit : 0x80 >> bit;
          }
        }
        bytes.push(byteVal);
      }
    }
    return bytes;
  }

  // Vertical page-byte addressing (SSD1306 / U8g2 / Nokia 5110)
  const pages = Math.ceil(GLYPH_HEIGHT / 8); // 7
  const lsb = cfg.drawMode === 'vertical-lsb';
  for (let page = 0; page < pages; page++) {
    for (let x = 0; x < GLYPH_WIDTH; x++) {
      let byteVal = 0;
      for (let bit = 0; bit < 8; bit++) {
        const y = page * 8 + bit;
        if (isPixelOn(x, y)) {
          byteVal |= lsb ? 1 << bit : 0x80 >> bit;
        }
      }
      bytes.push(byteVal);
    }
  }
  return bytes;
}

export function buildImage2CppCode(
  styleId: StyleId,
  options: GlyphRenderOptions,
  customMap: CustomPixelMap,
  cfg: Image2CppOptions,
  targetChars: readonly GlyphChar[] = GLYPH_CHARS
): string {
  const meta = getStyleMeta(styleId);
  const safePrefix =
    cfg.prefix.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^(\d)/, '_$1') ||
    'epd_bitmap';

  const modeLabel: Record<Image2CppDrawMode, string> = {
    'horizontal-msb': 'Horizontal - 1 bit per pixel (MSB first / Adafruit GFX)',
    'horizontal-lsb': 'Horizontal - 1 bit per pixel (LSB first / U8g2 XBM)',
    'vertical-lsb': 'Vertical - 1 bit per pixel (LSB top / SSD1306 Page)',
    'vertical-msb': 'Vertical - 1 bit per pixel (MSB top)',
  };

  const sampleByteCount =
    cfg.drawMode.startsWith('horizontal')
      ? Math.ceil(GLYPH_WIDTH / 8) * GLYPH_HEIGHT // 200 bytes
      : Math.ceil(GLYPH_HEIGHT / 8) * GLYPH_WIDTH; // 175 bytes

  const lines: string[] = [];

  if (cfg.outputStyle === 'micropython') {
    lines.push(`# ChronoGlyph Studio — image2cpp MicroPython Bitmap Pack`);
    lines.push(`# Style: ${meta.name} (${meta.categoryLabel})`);
    lines.push(`# Size: ${GLYPH_WIDTH}x${GLYPH_HEIGHT}px (${sampleByteCount} bytes/glyph)`);
    lines.push(`# Mode: ${modeLabel[cfg.drawMode]}`);
    lines.push(``);
    lines.push(`${safePrefix}_glyphs = {`);
  } else if (cfg.outputStyle !== 'plain-bytes') {
    lines.push(`// ChronoGlyph Studio — image2cpp Compatible Bitmap Code`);
    lines.push(`// Style: ${meta.name} (${meta.categoryLabel})`);
    lines.push(`// Dimensions: ${GLYPH_WIDTH}x${GLYPH_HEIGHT}px (${sampleByteCount} bytes/glyph)`);
    lines.push(`// Draw mode: ${modeLabel[cfg.drawMode]}`);
    lines.push(`// Invert: ${cfg.invertColors ? 'Yes (Black=1, White=0)' : 'No (White=1, Black=0)'}`);
    lines.push(``);
  }

  const varNames: string[] = [];
  const bytesPerLine = 16;

  targetChars.forEach((ch, idx) => {
    const label = ch === ':' ? 'colon' : ch;
    const varName = `${safePrefix}_${label}`;
    varNames.push(varName);

    const custom = customMap[styleId]?.[ch] ?? null;
    const canvas = renderGlyphToCanvas(ch, styleId, options, custom);
    const bytes = encodeGlyphToImage2CppBytes(canvas, cfg);
    const hexList = bytes.map(
      (b) => `0x${b.toString(16).padStart(2, '0').toLowerCase()}`
    );

    const formattedRows: string[] = [];
    for (let i = 0; i < hexList.length; i += bytesPerLine) {
      const slice = hexList.slice(i, i + bytesPerLine).join(', ');
      formattedRows.push(`  ${slice}${i + bytesPerLine < hexList.length ? ',' : ''}`);
    }

    if (cfg.outputStyle === 'arduino-progmem') {
      lines.push(`// '${label}', ${GLYPH_WIDTH}x${GLYPH_HEIGHT}px`);
      lines.push(`const unsigned char ${varName} [] PROGMEM = {`);
      lines.push(...formattedRows);
      lines.push(`};`);
      lines.push(``);
    } else if (cfg.outputStyle === 'uint8-std') {
      lines.push(`// '${label}', ${GLYPH_WIDTH}x${GLYPH_HEIGHT}px`);
      lines.push(`static const uint8_t ${varName}[${bytes.length}] = {`);
      lines.push(...formattedRows);
      lines.push(`};`);
      lines.push(``);
    } else if (cfg.outputStyle === 'plain-bytes') {
      lines.push(`// '${label}' (${GLYPH_WIDTH}x${GLYPH_HEIGHT}px, ${bytes.length} bytes)`);
      lines.push(...formattedRows.map((r) => r.trimStart()));
      if (idx < targetChars.length - 1) lines.push(``);
    } else if (cfg.outputStyle === 'micropython') {
      lines.push(`    "${ch}": bytes([`);
      for (let i = 0; i < hexList.length; i += bytesPerLine) {
        const slice = hexList.slice(i, i + bytesPerLine).join(', ');
        lines.push(`        ${slice}${i + bytesPerLine < hexList.length ? ',' : ''}`);
      }
      lines.push(`    ])${idx < targetChars.length - 1 ? ',' : ''}`);
    }
  });

  if (cfg.outputStyle === 'micropython') {
    lines.push(`}`);
  } else if (cfg.includeAllArray && cfg.outputStyle !== 'plain-bytes') {
    if (cfg.outputStyle === 'arduino-progmem') {
      lines.push(`// Array of all bitmaps for convenience. (Total bytes used to store images in PROGMEM = ${targetChars.length * sampleByteCount})`);
      lines.push(`const int ${safePrefix}_allArray_LEN = ${varNames.length};`);
      lines.push(`const unsigned char* ${safePrefix}_allArray[${varNames.length}] = {`);
      lines.push(`  ${varNames.join(',\n  ')}`);
      lines.push(`};`);
    } else {
      lines.push(`static const uint8_t* const ${safePrefix}_allArray[${varNames.length}] = {`);
      lines.push(`  ${varNames.join(',\n  ')}`);
      lines.push(`};`);
    }
  }

  return lines.join('\n');
}

