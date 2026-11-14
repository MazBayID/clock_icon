import React, { useMemo, useState } from 'react';
import { Check, Copy, Download, FileArchive, FileCode2, FileImage } from 'lucide-react';
import {
  CustomUiPixelMap,
  UI_ASSET_IDS,
  UiAssetId,
  UiRenderOptions,
  UiStyleId,
} from '../types/uiAsset';
import { UI_ASSET_CATALOG, getUiAssetMeta } from '../engine/uiAssetStyles';
import {
  Image2CppDrawMode,
  Image2CppOutputStyle,
  buildUiAsciiBitPreview,
  buildUiCL8Header,
  buildUiCRgb565Header,
  buildUiImage2CppCode,
} from '../engine/bitmapEncoder';
import {
  downloadSingleUiAssetBmp,
  downloadTextFile,
  downloadUiSpriteSheetBmp,
} from '../engine/exportEngine';
import { UiAssetCanvas } from './UiAssetCanvas';

type UiBitmapFormat =
  | 'image2cpp'
  | 'bmp-1bit'
  | 'bmp-24bit'
  | 'c-l8'
  | 'c-rgb565';

interface UiBitmapGeneratorPanelProps {
  styleId: UiStyleId;
  options: UiRenderOptions;
  customMap: CustomUiPixelMap;
  selectedAssetId: UiAssetId;
  onSelectAsset: (id: UiAssetId) => void;
  onDownloadStyleZip: () => void;
  isExporting: boolean;
}

const UI_FORMATS: { id: UiBitmapFormat; label: string; spec: string }[] = [
  {
    id: 'image2cpp',
    label: 'Kode Bitmap UI (image2cpp)',
    spec: 'Arduino PROGMEM / Adafruit GFX / SSD1306 / U8g2',
  },
  {
    id: 'bmp-1bit',
    label: 'BMP 1-Bit Mono',
    spec: 'Indexed Monochrome BMP (2 Warna)',
  },
  {
    id: 'bmp-24bit',
    label: 'BMP 24-Bit RGB',
    spec: 'Uncompressed RGB BMP (Watch Face Studio)',
  },
  {
    id: 'c-l8',
    label: 'C Array 8-Bit L8',
    spec: 'Luminansi 8-bit OLED Anti-Alias',
  },
  {
    id: 'c-rgb565',
    label: 'C Array RGB565',
    spec: '16-Bit Color Word 0xFFFF / 0x0000',
  },
];

export const UiBitmapGeneratorPanel: React.FC<UiBitmapGeneratorPanelProps> = ({
  styleId,
  options,
  customMap,
  selectedAssetId,
  onSelectAsset,
  onDownloadStyleZip,
  isExporting,
}) => {
  const [format, setFormat] = useState<UiBitmapFormat>('image2cpp');
  const [copied, setCopied] = useState(false);

  const [drawMode, setDrawMode] = useState<Image2CppDrawMode>('horizontal-msb');
  const [outputStyle, setOutputStyle] =
    useState<Image2CppOutputStyle>('arduino-progmem');
  const [invertColors, setInvertColors] = useState(false);
  const [prefix, setPrefix] = useState('ui_bitmap');
  const [includeAllArray, setIncludeAllArray] = useState(true);
  const [scopeAll, setScopeAll] = useState(true);
  const [i2cThreshold, setI2cThreshold] = useState(options.threshold);

  const activeAssetMeta = getUiAssetMeta(selectedAssetId);
  const activeFormatMeta =
    UI_FORMATS.find((f) => f.id === format) ?? UI_FORMATS[0];

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

  const targetAssets = useMemo(
    () => (scopeAll ? UI_ASSET_IDS : [selectedAssetId]),
    [scopeAll, selectedAssetId]
  );

  const previewText = useMemo(() => {
    switch (format) {
      case 'image2cpp':
        return buildUiImage2CppCode(
          styleId,
          options,
          customMap,
          i2cConfig,
          targetAssets
        );
      case 'bmp-1bit':
      case 'bmp-24bit':
        return buildUiAsciiBitPreview(selectedAssetId, styleId, options, customMap);
      case 'c-l8':
        return buildUiCL8Header(styleId, options, customMap);
      case 'c-rgb565':
        return buildUiCRgb565Header(styleId, options, customMap);
    }
  }, [format, selectedAssetId, styleId, options, customMap, i2cConfig, targetAssets]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(previewText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleDownloadActive = () => {
    switch (format) {
      case 'image2cpp': {
        const ext = outputStyle === 'micropython' ? 'py' : 'h';
        downloadTextFile(
          previewText,
          `${styleId}_ui_image2cpp_${drawMode}.${ext}`
        );
        break;
      }
      case 'bmp-1bit':
        downloadSingleUiAssetBmp(selectedAssetId, styleId, options, customMap, 1);
        break;
      case 'bmp-24bit':
        downloadSingleUiAssetBmp(selectedAssetId, styleId, options, customMap, 24);
        break;
      case 'c-l8':
        downloadTextFile(
          buildUiCL8Header(styleId, options, customMap),
          `${styleId}_ui_assets_l8.h`
        );
        break;
      case 'c-rgb565':
        downloadTextFile(
          buildUiCRgb565Header(styleId, options, customMap),
          `${styleId}_ui_assets_rgb565.h`
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
            Generator Kode Bitmap UI (image2cpp) &amp; Aset Firmware Paket
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Bangkitkan array byte PROGMEM untuk ke-12 ikon dan widget UI smartwatch beserta berkas .BMP dan .H.
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
            ? 'Mengemas Paket UI...'
            : 'Unduh Paket UI Lengkap (ZIP)'}
        </button>
      </div>

      {/* Format Tabs */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {UI_FORMATS.map((item) => {
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

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-5 space-y-4">
          {format === 'image2cpp' ? (
            <div className="p-4 rounded-md bg-[#090A0D] border border-white/[0.08] space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                <span className="text-xs font-semibold text-white">
                  Pengaturan image2cpp UI
                </span>
                <span className="text-xs font-mono-tabular text-sky-300">
                  {targetAssets.length} aset UI
                </span>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="ui-i2c-draw-mode"
                  className="block text-[11px] font-medium text-slate-400"
                >
                  Draw Mode (Arah Pemindaian Byte)
                </label>
                <select
                  id="ui-i2c-draw-mode"
                  value={drawMode}
                  onChange={(e) => setDrawMode(e.target.value as Image2CppDrawMode)}
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

              <div className="space-y-1">
                <label
                  htmlFor="ui-i2c-output-style"
                  className="block text-[11px] font-medium text-slate-400"
                >
                  Format Kode Keluaran
                </label>
                <select
                  id="ui-i2c-output-style"
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="ui-i2c-prefix"
                    className="block text-[11px] font-medium text-slate-400"
                  >
                    Identifier / Prefix
                  </label>
                  <input
                    id="ui-i2c-prefix"
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="ui_bitmap"
                    className="w-full px-2.5 py-1.5 text-xs font-mono-tabular bg-black text-white border border-white/[0.1] rounded-md focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-1">
                  <span className="block text-[11px] font-medium text-slate-400">
                    Cakupan Aset UI
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
                      Semua 12
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
                      Satu Aset
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <label
                    htmlFor="ui-i2c-threshold"
                    className="font-medium text-slate-400"
                  >
                    Brightness / Alpha Threshold
                  </label>
                  <span className="font-mono-tabular text-slate-200">
                    {i2cThreshold}
                  </span>
                </div>
                <input
                  id="ui-i2c-threshold"
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
                  Sertakan allArray[12]
                </label>
              </div>
            </div>
          ) : (
            <div className="border border-white/[0.08] rounded-md divide-y divide-white/[0.06] bg-[#090A0D]">
              <div className="px-3.5 py-2.5 flex items-center justify-between text-xs gap-4">
                <span className="text-slate-400">Format Aktif</span>
                <span className="text-white font-medium text-right">
                  {activeFormatMeta.spec}
                </span>
              </div>
              <div className="px-3.5 py-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Dimensi Aset Aktif</span>
                <span className="font-mono-tabular text-white font-medium">
                  {activeAssetMeta.width} × {activeAssetMeta.height} px
                </span>
              </div>
              <div className="px-3.5 py-2.5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Isi Paket ZIP UI Ini</span>
                <span className="font-mono-tabular text-slate-200">
                  12 PNG + BMP + image2cpp + .H
                </span>
              </div>
            </div>
          )}

          {/* UI Asset Quick Picker */}
          <div className="p-3.5 rounded-md bg-[#090A0D] border border-white/[0.08]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-medium text-slate-300">
                Elemen Paket UI (12 Aset)
              </span>
              <span className="text-xs font-mono-tabular text-sky-300">
                {activeAssetMeta.shortLabel} ({activeAssetMeta.width}×{activeAssetMeta.height})
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {UI_ASSET_CATALOG.map((asset) => {
                const active = asset.id === selectedAssetId;
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => onSelectAsset(asset.id)}
                    className={`p-1.5 rounded border flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
                      active
                        ? 'bg-white/[0.08] border-sky-400 text-white'
                        : 'bg-black border-white/[0.08] text-slate-400 hover:border-white/25 hover:text-white'
                    }`}
                  >
                    <UiAssetCanvas
                      assetId={asset.id}
                      styleId={styleId}
                      options={options}
                      customPixels={customMap[styleId]?.[asset.id] ?? null}
                      scale={asset.width >= 48 ? 0.52 : 0.72}
                    />
                    <span className="text-[10px] truncate w-full text-center">
                      {asset.shortLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDownloadActive}
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
                  ? `Unduh ${selectedAssetId}.bmp (1-Bit)`
                  : format === 'bmp-24bit'
                    ? `Unduh ${selectedAssetId}.bmp (24-Bit)`
                    : `Unduh ${activeFormatMeta.label}`}
            </button>

            <button
              type="button"
              onClick={() =>
                downloadUiSpriteSheetBmp(
                  styleId,
                  options,
                  customMap,
                  format === 'bmp-24bit' ? 24 : 1
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-200 bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Atlas UI.bmp ({format === 'bmp-24bit' ? '24-Bit' : '1-Bit'})
            </button>
          </div>
        </div>

        {/* Right: Live Output Code / Bit Matrix */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-300">
              {format === 'image2cpp'
                ? `Keluaran image2cpp UI (${targetAssets.length} aset · ${drawMode})`
                : format === 'bmp-1bit' || format === 'bmp-24bit'
                  ? `Matriks Bit ${activeAssetMeta.width}×${activeAssetMeta.height} “${activeAssetMeta.name}”`
                  : `Keluaran Kode — ${activeFormatMeta.label}`}
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
