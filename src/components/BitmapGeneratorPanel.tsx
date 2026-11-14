import React, { useMemo, useState } from 'react';
import { Check, Copy, Download, FileArchive, FileCode2, FileImage } from 'lucide-react';
import {
  CustomPixelMap,
  GLYPH_CHARS,
  GlyphChar,
  GlyphRenderOptions,
  StyleId,
} from '../types/glyph';
import {
  BitmapFormatId,
  Image2CppDrawMode,
  Image2CppOutputStyle,
  buildAsciiBitPreview,
  buildBmFontDescriptor,
  buildCRgb565Header,
  buildImage2CppCode,
  buildRawBinaryBuffer,
} from '../engine/bitmapEncoder';
import {
  buildCHeaderString,
  downloadBinaryFile,
  downloadSingleGlyphBmp,
  downloadSpriteSheetBmp,
  downloadTextFile,
  glyphFileName,
} from '../engine/exportEngine';
import { GlyphCanvas } from './GlyphCanvas';

interface BitmapGeneratorPanelProps {
  styleId: StyleId;
  options: GlyphRenderOptions;
  customMap: CustomPixelMap;
  selectedChar: GlyphChar;
  onSelectChar: (char: GlyphChar) => void;
  onDownloadStyleZip: () => void;
  isExporting: boolean;
}

const BITMAP_FORMATS: {
  id: BitmapFormatId;
  label: string;
  spec: string;
  bytesPerGlyph: string;
  total11Size: string;
}[] = [
  {
    id: 'image2cpp',
    label: 'Kode Bitmap (image2cpp)',
    spec: 'Arduino PROGMEM / Adafruit GFX / SSD1306 / U8g2',
    bytesPerGlyph: '175–200 B',
    total11Size: '1.93–2.20 KB',
  },
  {
    id: 'bmp-1bit',
    label: 'BMP 1-Bit Mono',
    spec: 'Windows/Firmware Indexed BMP (2 Warna)',
    bytesPerGlyph: '262 B',
    total11Size: '2.88 KB',
  },
  {
    id: 'bmp-24bit',
    label: 'BMP 24-Bit RGB',
    spec: 'Uncompressed RGB BMP (Watch Face Studio)',
    bytesPerGlyph: '3.85 KB',
    total11Size: '42.4 KB',
  },
  {
    id: 'c-l8',
    label: 'C Array 8-Bit L8',
    spec: 'Luminansi 8-bit OLED Anti-Alias',
    bytesPerGlyph: '1.25 KB',
    total11Size: '13.75 KB',
  },
  {
    id: 'c-rgb565',
    label: 'C Array RGB565',
    spec: '16-Bit Color Word 0xFFFF / 0x0000 (SPI AMOLED)',
    bytesPerGlyph: '2.50 KB',
    total11Size: '27.50 KB',
  },
  {
    id: 'bmfont-fnt',
    label: 'Atlas BMFont (.fnt)',
    spec: 'Koordinat 0–9 & : pada Sprite 275×50',
    bytesPerGlyph: 'Metadata',
    total11Size: '~1.1 KB',
  },
  {
    id: 'bin-1bit',
    label: 'Raw Binary (.bin)',
    spec: 'Buffer Biner Berurutan untuk SPI Flash',
    bytesPerGlyph: '200 B',
    total11Size: '2.20 KB',
  },
];

export const BitmapGeneratorPanel: React.FC<BitmapGeneratorPanelProps> = ({
  styleId,
  options,
  customMap,
  selectedChar,
  onSelectChar,
  onDownloadStyleZip,
  isExporting,
}) => {
  const [format, setFormat] = useState<BitmapFormatId>('image2cpp');
  const [copied, setCopied] = useState(false);

  // image2cpp style controls
  const [drawMode, setDrawMode] = useState<Image2CppDrawMode>('horizontal-msb');
  const [outputStyle, setOutputStyle] =
    useState<Image2CppOutputStyle>('arduino-progmem');
  const [invertColors, setInvertColors] = useState(false);
  const [prefix, setPrefix] = useState('epd_bitmap');
  const [includeAllArray, setIncludeAllArray] = useState(true);
  const [scopeAll, setScopeAll] = useState(true);
  const [i2cThreshold, setI2cThreshold] = useState(options.threshold);

  const activeMeta =
    BITMAP_FORMATS.find((f) => f.id === format) ?? BITMAP_FORMATS[0];

  const i2cConfig = useMemo(
    () => ({
      drawMode,
      outputStyle,
      invertColors,
      prefix,
      includeAllArray,
      threshold: i2cThreshold,
    }),
    [drawMode, outputStyle, invertColors, prefix, includeAllArray, i2cThreshold]
  );

  const targetChars = useMemo(
    () => (scopeAll ? GLYPH_CHARS : [selectedChar]),
    [scopeAll, selectedChar]
  );

  const previewText = useMemo(() => {
    switch (format) {
      case 'image2cpp':
        return buildImage2CppCode(
          styleId,
          options,
          customMap,
          i2cConfig,
          targetChars
        );
      case 'bmp-1bit':
      case 'bmp-24bit':
      case 'bin-1bit':
        return buildAsciiBitPreview(selectedChar, styleId, options, customMap);
      case 'c-l8':
        return buildCHeaderString(styleId, options, customMap);
      case 'c-rgb565':
        return buildCRgb565Header(styleId, options, customMap);
      case 'bmfont-fnt':
        return buildBmFontDescriptor(styleId);
    }
  }, [format, selectedChar, styleId, options, customMap, i2cConfig, targetChars]);

  const i2cBytesPerGlyph = drawMode.startsWith('horizontal') ? 200 : 175;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(previewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownloadActiveFormat = () => {
    switch (format) {
      case 'image2cpp': {
        const ext = outputStyle === 'micropython' ? 'py' : 'h';
        downloadTextFile(
          previewText,
          `${styleId}_image2cpp_${drawMode}.${ext}`
        );
        break;
      }
      case 'bmp-1bit':
        downloadSingleGlyphBmp(selectedChar, styleId, options, customMap, 1);
        break;
      case 'bmp-24bit':
        downloadSingleGlyphBmp(selectedChar, styleId, options, customMap, 24);
        break;
      case 'c-l8':
        downloadTextFile(
          buildCHeaderString(styleId, options, customMap),
          `${styleId}_glyphs_l8_25x50.h`
        );
        break;
      case 'c-rgb565':
        downloadTextFile(
          buildCRgb565Header(styleId, options, customMap),
          `${styleId}_glyphs_rgb565_25x50.h`
        );
        break;
      case 'bmfont-fnt':
        downloadTextFile(
          buildBmFontDescriptor(styleId),
          `${styleId}_atlas_275x50.fnt`
        );
        break;
      case 'bin-1bit':
        downloadBinaryFile(
          buildRawBinaryBuffer(styleId, options, customMap, '1bit'),
          `${styleId}_glyphs_1bit_25x50.bin`
        );
        break;
    }
  };

  return (
    <section
      id="bitmap"
      className="bg-[#0C0E13] border border-white/[0.08] rounded-lg p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Generator Kode Bitmap (image2cpp) &amp; Aset Firmware Paket Gaya
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Hasilkan kode array byte PROGMEM seperti image2cpp untuk seluruh 11 karakter (0–9 &amp; :) dalam satu paket gaya, plus berkas .BMP dan .BIN.
          </p>
        </div>

        <button
          type="button"
          disabled={isExporting}
          onClick={onDownloadStyleZip}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
        >
          <FileArchive className="w-3.5 h-3.5" />
          {isExporting
            ? 'Mengemas Paket...'
            : 'Unduh Paket Lengkap (PNG + BMP + image2cpp ZIP)'}
        </button>
      </div>

      {/* Format Tabs */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {BITMAP_FORMATS.map((item) => {
          const active = format === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFormat(item.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-white text-black border-white font-semibold'
                  : 'bg-[#090A0D] text-slate-300 border-white/[0.08] hover:border-white/25 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Main Split: Left Config & Glyph Picker / Right Live Output */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-5 space-y-4">
          {format === 'image2cpp' ? (
            <div className="p-4 rounded-md bg-[#090A0D] border border-white/[0.08] space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-xs font-semibold text-white">
                  Pengaturan image2cpp
                </span>
                <span className="text-xs font-mono-tabular text-sky-300">
                  {i2cBytesPerGlyph} B/angka · {targetChars.length * i2cBytesPerGlyph} B total
                </span>
              </div>

              {/* Draw Mode */}
              <div className="space-y-1">
                <label
                  htmlFor="i2c-draw-mode"
                  className="block text-[11px] font-medium text-slate-400"
                >
                  Draw Mode (Arah Pemindaian Byte)
                </label>
                <select
                  id="i2c-draw-mode"
                  value={drawMode}
                  onChange={(e) =>
                    setDrawMode(e.target.value as Image2CppDrawMode)
                  }
                  className="w-full px-3 py-1.5 text-xs bg-black text-slate-200 border border-white/[0.1] rounded-md focus:outline-none focus:border-sky-400 cursor-pointer"
                >
                  <option value="horizontal-msb">
                    Horizontal 1-bit (MSB · Adafruit GFX)
                  </option>
                  <option value="horizontal-lsb">
                    Horizontal 1-bit (LSB · U8g2 drawXBM)
                  </option>
                  <option value="vertical-lsb">
                    Vertical 1-bit (LSB · SSD1306 / OLED Page)
                  </option>
                  <option value="vertical-msb">
                    Vertical 1-bit (MSB · Top-Bit)
                  </option>
                </select>
              </div>

              {/* Output Format */}
              <div className="space-y-1">
                <label
                  htmlFor="i2c-output-style"
                  className="block text-[11px] font-medium text-slate-400"
                >
                  Format Kode Keluaran
                </label>
                <select
                  id="i2c-output-style"
                  value={outputStyle}
                  onChange={(e) =>
                    setOutputStyle(e.target.value as Image2CppOutputStyle)
                  }
                  className="w-full px-3 py-1.5 text-xs bg-black text-slate-200 border border-white/[0.1] rounded-md focus:outline-none focus:border-sky-400 cursor-pointer"
                >
                  <option value="arduino-progmem">
                    Arduino / C++ (const unsigned char [] PROGMEM)
                  </option>
                  <option value="uint8-std">
                    Standard C99 (static const uint8_t[])
                  </option>
                  <option value="plain-bytes">
                    Plain Bytes (Hex saja tanpa deklarasi)
                  </option>
                  <option value="micropython">
                    MicroPython Dictionary (bytes([...]))
                  </option>
                </select>
              </div>

              {/* Prefix & Scope */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="i2c-prefix"
                    className="block text-[11px] font-medium text-slate-400"
                  >
                    Identifier / Prefix
                  </label>
                  <input
                    id="i2c-prefix"
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="epd_bitmap"
                    className="w-full px-2.5 py-1.5 text-xs font-mono-tabular bg-black text-white border border-white/[0.1] rounded-md focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-1">
                  <span className="block text-[11px] font-medium text-slate-400">
                    Cakupan Karakter
                  </span>
                  <div className="grid grid-cols-2 p-0.5 rounded-md bg-black border border-white/[0.08]">
                    <button
                      type="button"
                      onClick={() => setScopeAll(true)}
                      className={`py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                        scopeAll
                          ? 'bg-sky-500 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Semua 11
                    </button>
                    <button
                      type="button"
                      onClick={() => setScopeAll(false)}
                      className={`py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                        !scopeAll
                          ? 'bg-sky-500 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Satu ({selectedChar})
                    </button>
                  </div>
                </div>
              </div>

              {/* Brightness Threshold */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <label
                    htmlFor="i2c-threshold"
                    className="font-medium text-slate-400"
                  >
                    Brightness / Alpha Threshold
                  </label>
                  <span className="font-mono-tabular text-slate-200">
                    {i2cThreshold}
                  </span>
                </div>
                <input
                  id="i2c-threshold"
                  type="range"
                  min={32}
                  max={224}
                  step={4}
                  value={i2cThreshold}
                  onChange={(e) =>
                    setI2cThreshold(parseInt(e.target.value, 10))
                  }
                  className="w-full accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-slate-300">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={invertColors}
                    onChange={(e) => setInvertColors(e.target.checked)}
                    className="accent-sky-400 cursor-pointer"
                  />
                  Invert bit (Hitam=1)
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeAllArray}
                    onChange={(e) => setIncludeAllArray(e.target.checked)}
                    className="accent-sky-400 cursor-pointer"
                  />
                  Sertakan allArray[11]
                </label>
              </div>
            </div>
          ) : (
            <div className="border border-white/[0.08] rounded-md divide-y divide-white/[0.06] bg-[#090A0D]">
              <div className="px-3.5 py-2.5 flex items-center justify-between text-xs gap-4">
                <span className="text-slate-400">Format Aktif</span>
                <span className="text-white font-medium text-right">
                  {activeMeta.spec}
                </span>
              </div>
              <div className="px-3.5 py-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Ukuran per Karakter</span>
                <span className="font-mono-tabular text-white font-medium">
                  {activeMeta.bytesPerGlyph}
                </span>
              </div>
              <div className="px-3.5 py-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Total 11 Karakter (0–9, :)</span>
                <span className="font-mono-tabular text-sky-300 font-medium">
                  {activeMeta.total11Size}
                </span>
              </div>
              <div className="px-3.5 py-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Isi Paket ZIP Gaya Ini</span>
                <span className="font-mono-tabular text-slate-200">
                  PNG + BMP + image2cpp + .FNT + .BIN
                </span>
              </div>
            </div>
          )}

          {/* Character Strip for Quick Pick */}
          <div className="p-3.5 rounded-md bg-[#090A0D] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-medium text-slate-300">
                Karakter Paket (25×50px)
              </span>
              <span className="text-xs font-mono-tabular text-sky-300">
                {selectedChar === ':' ? 'colon' : selectedChar}
              </span>
            </div>

            <div className="grid grid-cols-6 sm:grid-cols-11 gap-1.5">
              {GLYPH_CHARS.map((ch) => {
                const active = ch === selectedChar;
                return (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => onSelectChar(ch)}
                    className={`py-1.5 rounded border flex flex-col items-center gap-1 transition-colors cursor-pointer ${
                      active
                        ? 'bg-white/[0.08] border-sky-400 text-white'
                        : 'bg-black border-white/[0.08] text-slate-400 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <GlyphCanvas
                      char={ch}
                      styleId={styleId}
                      options={options}
                      customPixels={customMap[styleId]?.[ch] ?? null}
                      scale={0.56}
                    />
                    <span className="text-[10px] font-mono-tabular">{ch}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDownloadActiveFormat}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-950 bg-white hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              {format === 'bmp-1bit' || format === 'bmp-24bit' ? (
                <FileImage className="w-3.5 h-3.5" />
              ) : (
                <FileCode2 className="w-3.5 h-3.5" />
              )}
              {format === 'image2cpp'
                ? `Unduh Kode (.${outputStyle === 'micropython' ? 'py' : 'h'})`
                : format === 'bmp-1bit'
                  ? `Unduh ${glyphFileName(selectedChar, 'bmp')} (1-Bit)`
                  : format === 'bmp-24bit'
                    ? `Unduh ${glyphFileName(selectedChar, 'bmp')} (24-Bit)`
                    : `Unduh ${activeMeta.label}`}
            </button>

            <button
              type="button"
              onClick={() =>
                downloadSpriteSheetBmp(
                  styleId,
                  options,
                  customMap,
                  format === 'bmp-24bit' ? 24 : 1
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Sprite 275×50.bmp ({format === 'bmp-24bit' ? '24-Bit' : '1-Bit'})
            </button>
          </div>
        </div>

        {/* Right: Live Output Code / Bit Matrix */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-300">
              {format === 'image2cpp'
                ? `Keluaran image2cpp (${targetChars.length} karakter · ${drawMode})`
                : format === 'bmp-1bit' || format === 'bmp-24bit' || format === 'bin-1bit'
                  ? `Matriks Bit 25×50 Karakter “${selectedChar}” (Threshold ${options.threshold})`
                  : `Keluaran Kode — ${activeMeta.label}`}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-950 bg-sky-400 hover:bg-sky-300 rounded transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Tersalin!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Salin Kode
                </>
              )}
            </button>
          </div>

          <pre className="h-[430px] overflow-auto p-3.5 rounded-md bg-black border border-white/[0.08] text-[11px] font-mono-tabular text-slate-200 leading-[1.35] select-all">
            {previewText}
          </pre>
        </div>
      </div>
    </section>
  );
};
