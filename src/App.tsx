import { useState } from 'react';
import { FileArchive } from 'lucide-react';
import {
  CustomPixelMap,
  GlyphChar,
  GlyphRenderOptions,
  StyleCategory,
  StyleId,
} from './types/glyph';
import { DEFAULT_RENDER_OPTIONS } from './engine/glyphRenderer';
import { getStyleMeta } from './engine/glyphStyles';
import {
  downloadCHeader,
  downloadSingleGlyphPng,
  downloadSpriteSheetPng,
  exportAllStylesZip,
  exportCategoryZip,
  exportStyleZip,
} from './engine/exportEngine';
import { StyleSidebar } from './components/StyleSidebar';
import { TuningControls } from './components/TuningControls';
import { AssetSheetGrid } from './components/AssetSheetGrid';
import { WatchPreview } from './components/WatchPreview';
import { PixelInspector } from './components/PixelInspector';
import { BitmapGeneratorPanel } from './components/BitmapGeneratorPanel';
import { ComparisonMatrix } from './components/ComparisonMatrix';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<StyleCategory>('all');
  const [selectedStyleId, setSelectedStyleId] = useState<StyleId>('chrome-shard-v2');
  const [selectedChar, setSelectedChar] = useState<GlyphChar>('8');
  const [options, setOptions] = useState<GlyphRenderOptions>(DEFAULT_RENDER_OPTIONS);
  const [customMap, setCustomMap] = useState<CustomPixelMap>({});
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingCyberpunk, setIsExportingCyberpunk] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);

  const activeStyleMeta = getStyleMeta(selectedStyleId);

  const handleSelectStyle = (id: StyleId) => {
    setSelectedStyleId(id);
    const meta = getStyleMeta(id);
    setOptions((prev) => ({
      ...prev,
      pixelSnap: meta.recommendedMode === 'pixel-snap',
    }));
  };

  const handleUpdateCustomPixels = (char: GlyphChar, pixels: Uint8ClampedArray) => {
    setCustomMap((prev) => ({
      ...prev,
      [selectedStyleId]: {
        ...(prev[selectedStyleId] ?? {}),
        [char]: pixels,
      },
    }));
  };

  const handleResetCustomPixels = (char: GlyphChar) => {
    setCustomMap((prev) => {
      const styleMap = { ...(prev[selectedStyleId] ?? {}) };
      delete styleMap[char];
      return {
        ...prev,
        [selectedStyleId]: styleMap,
      };
    });
  };

  const handleDownloadStyleZip = async () => {
    setIsExporting(true);
    try {
      await exportStyleZip(selectedStyleId, options, customMap);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadCyberpunkZip = async () => {
    setIsExportingCyberpunk(true);
    try {
      await exportCategoryZip('cyberpunk', options, customMap);
    } finally {
      setIsExportingCyberpunk(false);
    }
  };

  const handleDownloadAllZip = async () => {
    setIsExportingAll(true);
    try {
      await exportAllStylesZip(options, customMap);
    } finally {
      setIsExportingAll(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090A0D] text-[#F2F4F8]">
      {/* Strict 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 bg-[#090A0D]/95 backdrop-blur border-b border-white/[0.08] px-6 h-14 flex items-center justify-between gap-8">
        <a
          href="#top"
          className="text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          ChronoGlyph Studio
        </a>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <a
            href="#aset-grid"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Aset 25×50
          </a>
          <a
            href="#simulasi"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Simulasi Jam
          </a>
          <a
            href="#inspektor"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Inspektor Piksel
          </a>
          <a
            href="#bitmap"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Generator Bitmap
          </a>
          <a
            href="#komparasi"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Komparasi Gaya
          </a>
        </nav>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadStyleZip}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            <FileArchive className="w-3.5 h-3.5" />
            {isExporting ? 'Mengemas...' : 'Unduh ZIP (25×50)'}
          </button>
        </div>
      </header>

      {/* Main Studio Shell */}
      <div id="top" className="flex-1 flex flex-col lg:flex-row">
        <StyleSidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          selectedStyleId={selectedStyleId}
          onSelectStyle={handleSelectStyle}
          options={options}
        />

        <main className="flex-1 min-w-0 flex flex-col">
          {/* Active Style Header */}
          <section className="px-6 py-5 border-b border-white/[0.08] bg-[#0B0D12]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1.5">
                  <span className="text-sky-400 font-medium">
                    {activeStyleMeta.categoryLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeStyleMeta.targetWatches}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular">25 × 50 px</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular">#FFFFFF / #000000</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  {activeStyleMeta.name}
                </h1>
                <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                  {activeStyleMeta.architectureNote}
                </p>
              </div>

              <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/[0.06]">
                <div>
                  <div className="text-[11px] text-slate-400">Karakter</div>
                  <div className="text-base font-mono-tabular font-semibold text-white">
                    0–9 &amp; : (11)
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Dimensi</div>
                  <div className="text-base font-mono-tabular font-semibold text-white">
                    25 × 50 px
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400">Rasio</div>
                  <div className="text-base font-mono-tabular font-semibold text-white">
                    1 : 2
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Calibration Toolbar */}
          <TuningControls
            options={options}
            onChange={setOptions}
            onReset={() => setOptions(DEFAULT_RENDER_OPTIONS)}
          />

          {/* Main Workbench Content */}
          <div className="p-5 sm:p-6 space-y-6">
            <div id="aset-grid">
              <AssetSheetGrid
                styleId={selectedStyleId}
                options={options}
                customMap={customMap}
                selectedChar={selectedChar}
                onSelectChar={setSelectedChar}
                onDownloadGlyph={(ch) =>
                  downloadSingleGlyphPng(ch, selectedStyleId, options, customMap)
                }
                onDownloadSpriteSheet={() =>
                  downloadSpriteSheetPng(selectedStyleId, options, customMap)
                }
                onDownloadCHeader={() =>
                  downloadCHeader(selectedStyleId, options, customMap)
                }
                onDownloadStyleZip={handleDownloadStyleZip}
                isExporting={isExporting}
              />
            </div>

            {/* 2-Column Watchface Preview & Pixel Inspector */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
              <div id="simulasi" className="xl:col-span-5 flex flex-col">
                <WatchPreview
                  styleId={selectedStyleId}
                  options={options}
                  customMap={customMap}
                />
              </div>

              <div id="inspektor" className="xl:col-span-7 flex flex-col">
                <PixelInspector
                  char={selectedChar}
                  styleId={selectedStyleId}
                  options={options}
                  customPixels={customMap[selectedStyleId]?.[selectedChar] ?? null}
                  onUpdateCustomPixels={handleUpdateCustomPixels}
                  onResetCustomPixels={handleResetCustomPixels}
                  onDownloadGlyph={(ch) =>
                    downloadSingleGlyphPng(ch, selectedStyleId, options, customMap)
                  }
                />
              </div>
            </div>

            {/* Bitmap & Firmware Generator for Active Style Package */}
            <BitmapGeneratorPanel
              styleId={selectedStyleId}
              options={options}
              customMap={customMap}
              selectedChar={selectedChar}
              onSelectChar={setSelectedChar}
              onDownloadStyleZip={handleDownloadStyleZip}
              isExporting={isExporting}
            />

            {/* All 27 Styles Comparison & Batch Export */}
            <ComparisonMatrix
              selectedStyleId={selectedStyleId}
              onSelectStyle={handleSelectStyle}
              options={options}
              onDownloadCyberpunkZip={handleDownloadCyberpunkZip}
              isExportingCyberpunk={isExportingCyberpunk}
              onDownloadAllZip={handleDownloadAllZip}
              isExportingAll={isExportingAll}
            />
          </div>
        </main>
      </div>

      {/* Quiet Studio Footer */}
      <footer className="border-t border-white/[0.08] bg-[#090A0D] px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <span>ChronoGlyph Studio — Generator Aset Angka Smartwatch 25×50px</span>
        <span className="font-mono-tabular">
          Format Ekspor: PNG · BMP 1b/24b · C Header (.h) · .FNT · .BIN · ZIP
        </span>
      </footer>
    </div>
  );
}
