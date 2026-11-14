import React, { useState } from 'react';
import { Code2, Copy, Check, Download, FileArchive, Layers } from 'lucide-react';
import {
  CustomPixelMap,
  GLYPH_CHARS,
  GlyphChar,
  GlyphRenderOptions,
  StyleId,
} from '../types/glyph';
import { buildCHeaderString } from '../engine/exportEngine';
import { GlyphCanvas } from './GlyphCanvas';

interface AssetSheetGridProps {
  styleId: StyleId;
  options: GlyphRenderOptions;
  customMap: CustomPixelMap;
  selectedChar: GlyphChar;
  onSelectChar: (char: GlyphChar) => void;
  onDownloadGlyph: (char: GlyphChar) => void;
  onDownloadSpriteSheet: () => void;
  onDownloadCHeader: () => void;
  onDownloadStyleZip: () => void;
  isExporting: boolean;
}

export const AssetSheetGrid: React.FC<AssetSheetGridProps> = ({
  styleId,
  options,
  customMap,
  selectedChar,
  onSelectChar,
  onDownloadGlyph,
  onDownloadSpriteSheet,
  onDownloadCHeader,
  onDownloadStyleZip,
  isExporting,
}) => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const cHeaderPreview = showCodeModal
    ? buildCHeaderString(styleId, options, customMap)
    : '';

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(cHeaderPreview);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <div className="space-y-6">
      {/* 11-Glyph Matrix (0-9 + :) */}
      <div className="bg-[#0C0E13] border border-white/[0.08] rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
          <div>
            <h3 className="text-sm font-semibold text-white">
              Set Aset Lengkap 0–9 & Titik Dua (:)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              11 karakter · 25×50 piksel · Putih (#FFFFFF) di atas Hitam (#000000). Klik karakter untuk inspeksi piksel.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onDownloadSpriteSheet}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              Sprite 275×50
            </button>
            <button
              type="button"
              onClick={() => setShowCodeModal((v) => !v)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                showCodeModal
                  ? 'bg-sky-500/15 text-sky-300 border-sky-400/30'
                  : 'text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              Header C (.h)
            </button>
            <button
              type="button"
              disabled={isExporting}
              onClick={onDownloadStyleZip}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
            >
              <FileArchive className="w-3.5 h-3.5" />
              {isExporting ? 'Mengemas ZIP...' : 'Unduh Paket ZIP (11 PNG)'}
            </button>
          </div>
        </div>

        {/* Grid of 11 Cards */}
        <div className="mt-5 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-11 gap-2.5">
          {GLYPH_CHARS.map((ch) => {
            const isSelected = ch === selectedChar;
            const hasCustom = Boolean(customMap[styleId]?.[ch]);
            const fileName = ch === ':' ? 'colon.png' : `${ch}.png`;

            return (
              <div
                key={ch}
                onClick={() => onSelectChar(ch)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectChar(ch);
                  }
                }}
                className={`group rounded-md border p-2.5 flex flex-col items-center justify-between gap-2.5 transition-colors cursor-pointer select-none ${
                  isSelected
                    ? 'bg-white/[0.07] border-sky-400/70'
                    : 'bg-[#090A0D] border-white/[0.08] hover:border-white/25 hover:bg-white/[0.03]'
                }`}
              >
                <div className="w-full flex items-center justify-between text-[11px] font-mono-tabular">
                  <span className={isSelected ? 'text-sky-300 font-semibold' : 'text-slate-400'}>
                    {ch}
                  </span>
                  {hasCustom ? (
                    <span className="text-[10px] text-amber-300">Edit</span>
                  ) : (
                    <span className="text-[10px] text-slate-500">25×50</span>
                  )}
                </div>

                {/* Actual 25x50 canvas rendered at clean 2x (50x100px) */}
                <div className="p-1 bg-black border border-white/[0.08] rounded-sm">
                  <GlyphCanvas
                    char={ch}
                    styleId={styleId}
                    options={options}
                    customPixels={customMap[styleId]?.[ch] ?? null}
                    scale={2}
                  />
                </div>

                <div className="w-full flex items-center justify-between gap-1 pt-0.5">
                  <span className="text-[10px] font-mono-tabular text-slate-400 truncate">
                    {fileName}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownloadGlyph(ch);
                    }}
                    title={`Unduh ${fileName} (25×50 px)`}
                    aria-label={`Unduh ${fileName}`}
                    className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Combined Horizontal Sprite Sheet Strip */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-slate-300">
              Pratinjau Sprite Sheet Horizontal (275 × 50 px)
            </span>
            <div className="inline-flex items-center p-1.5 bg-black border border-white/[0.1] rounded overflow-x-auto max-w-full">
              {GLYPH_CHARS.map((ch) => (
                <GlyphCanvas
                  key={ch}
                  char={ch}
                  styleId={styleId}
                  options={options}
                  customPixels={customMap[styleId]?.[ch] ?? null}
                  scale={1}
                />
              ))}
            </div>
          </div>
          <div className="text-xs font-mono-tabular text-slate-400 shrink-0">
            0 1 2 3 4 5 6 7 8 9 : · 1:1 Native
          </div>
        </div>

        {/* Optional Embedded C Header Drawer */}
        {showCodeModal && (
          <div className="mt-5 pt-4 border-t border-white/[0.08]">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
              <span className="text-xs font-medium text-slate-200">
                Array Firmware C/C++ (uint8_t L8 Luminance · 25×50 px)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-200 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] rounded transition-colors cursor-pointer"
                >
                  {copiedCode ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Salin Kode
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onDownloadCHeader}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-950 bg-white hover:bg-slate-200 rounded transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Unduh .h
                </button>
              </div>
            </div>
            <pre className="max-h-64 overflow-auto p-3.5 rounded bg-black border border-white/[0.08] text-[11px] font-mono-tabular text-slate-300 leading-relaxed">
              {cHeaderPreview}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
