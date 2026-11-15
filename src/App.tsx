import { useEffect, useState } from 'react';
import { FileArchive, Globe2, Hash, LayoutGrid, Menu, X } from 'lucide-react';
import { applyLanguage, LANGUAGES, Language } from './i18n';
import {
  CustomPixelMap,
  GlyphChar,
  GlyphRenderOptions,
  StyleCategory,
  StyleId,
} from './types/glyph';
import {
  CustomUiPixelMap,
  UiAssetId,
  UiRenderOptions,
  UiStyleCategory,
  UiStyleId,
} from './types/uiAsset';
import { DEFAULT_RENDER_OPTIONS } from './engine/glyphRenderer';
import { GLYPH_STYLES, getStyleMeta } from './engine/glyphStyles';
import { DEFAULT_UI_RENDER_OPTIONS } from './engine/uiAssetRenderer';
import { UI_ASSET_CATALOG, UI_STYLES, getUiStyleMeta } from './engine/uiAssetStyles';
import {
  downloadCHeader,
  downloadSingleGlyphPng,
  downloadSingleUiAssetPng,
  downloadSpriteSheetPng,
  downloadUiSpriteSheetPng,
  exportAllStylesZip,
  exportAllUiStylesZip,
  exportCategoryZip,
  exportStyleZip,
  exportUiStyleZip,
} from './engine/exportEngine';
import { StyleSidebar } from './components/StyleSidebar';
import { TuningControls } from './components/TuningControls';
import { AssetSheetGrid } from './components/AssetSheetGrid';
import { WatchPreview } from './components/WatchPreview';
import { PixelInspector } from './components/PixelInspector';
import { BitmapGeneratorPanel } from './components/BitmapGeneratorPanel';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { UiStyleSidebar } from './components/UiStyleSidebar';
import { UiTuningControls } from './components/UiTuningControls';
import { UiAssetSheetGrid } from './components/UiAssetSheetGrid';
import { UiWatchPreview } from './components/UiWatchPreview';
import { UiPixelInspector } from './components/UiPixelInspector';
import { UiBitmapGeneratorPanel } from './components/UiBitmapGeneratorPanel';
import { UiComparisonMatrix } from './components/UiComparisonMatrix';
import { AnimationStudio } from './components/AnimationStudio';

type GeneratorMode = 'numerals' | 'ui-assets' | 'animation';

const EMPTY_CUSTOM_MAP: CustomPixelMap = {};
const EMPTY_CUSTOM_UI_MAP: CustomUiPixelMap = {};

export default function App() {
  const [generatorMode, setGeneratorMode] = useState<GeneratorMode>('numerals');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = window.localStorage.getItem('neo-clock-language') as Language | null;
      return saved && LANGUAGES.some((item) => item.code === saved) ? saved : 'en';
    } catch {
      return 'en';
    }
  });
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
    try {
      window.localStorage.setItem('neo-clock-language', language);
    } catch {
      // Language selection still works for this page session when storage is unavailable.
    }
    applyLanguage(root, language);
    const observer = new MutationObserver(() => applyLanguage(root, language));
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [language]);

  // === Numeral Generator State ===
  const [selectedCategory, setSelectedCategory] = useState<StyleCategory>('all');
  const [selectedStyleId, setSelectedStyleId] = useState<StyleId>('ronin-katana-split');
  const [selectedChar, setSelectedChar] = useState<GlyphChar>('8');
  const [options, setOptions] = useState<GlyphRenderOptions>(DEFAULT_RENDER_OPTIONS);
  const customMap = EMPTY_CUSTOM_MAP;
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingCyberpunk, setIsExportingCyberpunk] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);

  // === UI Asset Generator State ===
  const [selectedUiCategory, setSelectedUiCategory] = useState<UiStyleCategory>('all');
  const [selectedUiStyleId, setSelectedUiStyleId] = useState<UiStyleId>('swiss-precision-ui');
  const [selectedUiAssetId, setSelectedUiAssetId] = useState<UiAssetId>('battery');
  const [uiOptions, setUiOptions] = useState<UiRenderOptions>(DEFAULT_UI_RENDER_OPTIONS);
  const customUiMap = EMPTY_CUSTOM_UI_MAP;
  const [isExportingUi, setIsExportingUi] = useState(false);
  const [isExportingAllUi, setIsExportingAllUi] = useState(false);

  const activeStyleMeta = getStyleMeta(selectedStyleId);
  const activeUiStyleMeta = getUiStyleMeta(selectedUiStyleId);

  // === Numeral Handlers ===
  const handleSelectStyle = (id: StyleId) => {
    setSelectedStyleId(id);
    const meta = getStyleMeta(id);
    setOptions((prev) => ({
      ...prev,
      pixelSnap: meta.recommendedMode === 'pixel-snap',
    }));
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

  // === UI Asset Handlers ===
  const handleSelectUiStyle = (id: UiStyleId) => {
    setSelectedUiStyleId(id);
    const meta = getUiStyleMeta(id);
    setUiOptions((prev) => ({
      ...prev,
      pixelSnap: meta.recommendedMode === 'pixel-snap',
    }));
  };

  const handleDownloadUiStyleZip = async () => {
    setIsExportingUi(true);
    try {
      await exportUiStyleZip(selectedUiStyleId, uiOptions, customUiMap);
    } finally {
      setIsExportingUi(false);
    }
  };

  const handleDownloadAllUiZip = async () => {
    setIsExportingAllUi(true);
    try {
      await exportAllUiStylesZip(uiOptions, customUiMap);
    } finally {
      setIsExportingAllUi(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#F2F4F8]">
      {/* Strict 3-Zone Top Bar */}
      <header className="sticky top-0 z-30 bg-[#090A0D]/75 backdrop-blur border-b border-white/[0.08] px-3 sm:px-6 h-14 flex items-center justify-between gap-3 md:gap-8">
        <a
          href="#top"
          className="text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap shrink-0"
        >
          Neo Clock
        </a>

        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <a
            href="#aset-grid"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            {generatorMode === 'numerals' ? 'Aset 25×50' : generatorMode === 'ui-assets' ? 'Aset UI' : 'Animation Studio'}
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

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative">
            <button
              type="button"
              className="inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/[0.12] text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Choose language"
              aria-haspopup="menu"
              aria-expanded={isLanguageMenuOpen}
              onClick={() => setIsLanguageMenuOpen((open) => !open)}
            >
              <Globe2 className="w-4 h-4" />
            </button>
            {isLanguageMenuOpen && (
              <div role="menu" aria-label="Language" className="absolute right-0 top-11 z-50 min-w-44 rounded-lg border border-white/15 bg-[#081322]/95 p-1.5 shadow-2xl backdrop-blur-xl">
                {LANGUAGES.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={language === item.code}
                    onClick={() => { setLanguage(item.code); setIsLanguageMenuOpen(false); }}
                    className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors ${language === item.code ? "bg-sky-400/15 text-white" : "text-slate-300 hover:bg-white/[0.07] hover:text-white"}`}
                  >
                    <span>{item.native}</span>
                    <span className="text-[10px] text-slate-500">{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center w-9 h-9 rounded-md border border-white/[0.12] text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            aria-label={isMobileNavOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            aria-expanded={isMobileNavOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileNavOpen((open) => !open)}
          >
            {isMobileNavOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          {generatorMode === 'numerals' ? (
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadStyleZip}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
            >
              <FileArchive className="w-3.5 h-3.5" />
              {isExporting ? 'Mengemas...' : <><span className="hidden sm:inline">Unduh Paket Lengkap (ZIP)</span><span className="sm:hidden">ZIP</span></>}
            </button>
          ) : generatorMode === 'ui-assets' ? (
            <button
              type="button"
              disabled={isExportingUi}
              onClick={handleDownloadUiStyleZip}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
            >
              <FileArchive className="w-3.5 h-3.5" />
              {isExportingUi ? 'Mengemas...' : <><span className="hidden sm:inline">Unduh ZIP (Aset UI)</span><span className="sm:hidden">ZIP UI</span></>}
            </button>
          ) : null}
        </div>
      </header>

      {isMobileNavOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navigasi utama"
          className="md:hidden sticky top-14 z-20 border-b border-white/[0.08] bg-[#090A0D]/[0.98] backdrop-blur px-5 py-3 grid grid-cols-2 gap-2"
        >
          {[
            { href: '#aset-grid', label: generatorMode === 'numerals' ? 'Aset 25×50' : generatorMode === 'ui-assets' ? 'Aset UI' : 'Animation Studio' },
            { href: '#simulasi', label: 'Simulasi Jam' },
            { href: '#inspektor', label: 'Inspektor Piksel' },
            { href: '#bitmap', label: 'Generator Bitmap' },
            { href: '#komparasi', label: 'Komparasi Gaya' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileNavOpen(false)}
              className="rounded-md px-3 py-2.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}

      {/* Dedicated Generator Mode Switcher Bar (Separated: Generating Angka vs Generating Asset UI) */}
      <div className="bg-[#0B0D12] border-b border-white/[0.08] px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
            Pilihan Generating:
          </span>
          <div
            role="tablist"
            aria-label="Pilihan Mode Generator Aset Smartwatch"
            className="inline-flex items-center gap-1 p-1 rounded-md bg-black border border-white/[0.08]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={generatorMode === 'numerals'}
              onClick={() => setGeneratorMode('numerals')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                generatorMode === 'numerals'
                  ? 'bg-sky-400 text-slate-950'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Hash className="w-3.5 h-3.5" />
              Generator Angka ({GLYPH_STYLES.length} Gaya)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={generatorMode === 'ui-assets'}
              onClick={() => setGeneratorMode('ui-assets')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                generatorMode === 'ui-assets'
                  ? 'bg-sky-400 text-slate-950'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Generator Asset UI ({UI_STYLES.length} Gaya)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={generatorMode === 'animation'}
              onClick={() => setGeneratorMode('animation')}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                generatorMode === 'animation'
                  ? 'bg-sky-400 text-slate-950'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Animation Studio
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-mono-tabular">
          {generatorMode === 'numerals' ? (
            <>
              <span>Set: 0–9 &amp; : (11 glif)</span>
              <span aria-hidden="true">·</span>
              <span>Kanvas: 25×50 px</span>
            </>
          ) : generatorMode === 'ui-assets' ? (
            <>
              <span>Set: {UI_ASSET_CATALOG.length} Ikon &amp; Widget UI</span>
              <span aria-hidden="true">·</span>
              <span>Palet: #FFFFFF / #000000</span>
            </>
          ) : (
            <>
              <span>Karakter: Mochi Face</span>
              <span aria-hidden="true">·</span>
              <span>Animasi: 10 koleksi</span>
            </>
          )}
        </div>
      </div>

      {/* Main Studio Shell */}
      {generatorMode === 'numerals' ? (
        <div id="top" className="flex-1 flex flex-col lg:flex-row">
          <StyleSidebar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedStyleId={selectedStyleId}
            onSelectStyle={handleSelectStyle}
            options={options}
          />

          <main className="flex-1 min-w-0 flex flex-col">
            {/* Active Numeral Style Header */}
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

            {/* Main Numeral Workbench Content */}
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
                    onDownloadGlyph={(ch) =>
                      downloadSingleGlyphPng(ch, selectedStyleId, options, customMap)
                    }
                  />
                </div>
              </div>

              <BitmapGeneratorPanel
                styleId={selectedStyleId}
                options={options}
                customMap={customMap}
                selectedChar={selectedChar}
                onSelectChar={setSelectedChar}
                onDownloadStyleZip={handleDownloadStyleZip}
                isExporting={isExporting}
              />

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
      ) : generatorMode === 'ui-assets' ? (
        <div id="top" className="flex-1 flex flex-col lg:flex-row">
          <UiStyleSidebar
            selectedCategory={selectedUiCategory}
            onSelectCategory={setSelectedUiCategory}
            selectedStyleId={selectedUiStyleId}
            onSelectStyle={handleSelectUiStyle}
            options={uiOptions}
          />

          <main className="flex-1 min-w-0 flex flex-col">
            {/* Active UI Asset Style Header */}
            <section className="px-6 py-5 border-b border-white/[0.08] bg-[#0B0D12]">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1.5">
                    <span className="text-sky-400 font-medium">
                      {activeUiStyleMeta.categoryLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{activeUiStyleMeta.targetWatches}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">12 Aset UI</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">#FFFFFF / #000000</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    {activeUiStyleMeta.name}
                  </h1>
                  <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
                    {activeUiStyleMeta.architectureNote}
                  </p>
                </div>

                <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-white/[0.06]">
                  <div>
                    <div className="text-[11px] text-slate-400">Koleksi UI</div>
                    <div className="text-base font-mono-tabular font-semibold text-white">
                      {UI_STYLES.length} Gaya
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Elemen / Gaya</div>
                    <div className="text-base font-mono-tabular font-semibold text-white">
                      {UI_ASSET_CATALOG.length} Aset
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-slate-400">Format</div>
                    <div className="text-base font-mono-tabular font-semibold text-white">
                      PNG / BMP / .H
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* UI Calibration Toolbar */}
            <UiTuningControls
              options={uiOptions}
              onChange={setUiOptions}
              onReset={() => setUiOptions(DEFAULT_UI_RENDER_OPTIONS)}
            />

            {/* Main UI Asset Workbench Content */}
            <div className="p-5 sm:p-6 space-y-6">
              <div id="aset-grid">
                <UiAssetSheetGrid
                  styleId={selectedUiStyleId}
                  options={uiOptions}
                  customMap={customUiMap}
                  selectedAssetId={selectedUiAssetId}
                  onSelectAsset={setSelectedUiAssetId}
                  onDownloadAsset={(id) =>
                    downloadSingleUiAssetPng(id, selectedUiStyleId, uiOptions, customUiMap)
                  }
                  onDownloadSpriteSheet={() =>
                    downloadUiSpriteSheetPng(selectedUiStyleId, uiOptions, customUiMap)
                  }
                  onDownloadStyleZip={handleDownloadUiStyleZip}
                  isExporting={isExportingUi}
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
                <div id="simulasi" className="xl:col-span-5 flex flex-col">
                  <UiWatchPreview
                    styleId={selectedUiStyleId}
                    options={uiOptions}
                    customMap={customUiMap}
                  />
                </div>

                <div id="inspektor" className="xl:col-span-7 flex flex-col">
                  <UiPixelInspector
                    assetId={selectedUiAssetId}
                    styleId={selectedUiStyleId}
                    options={uiOptions}
                    onDownloadAsset={(id) =>
                      downloadSingleUiAssetPng(
                        id,
                        selectedUiStyleId,
                        uiOptions,
                        customUiMap
                      )
                    }
                  />
                </div>
              </div>

              <UiBitmapGeneratorPanel
                styleId={selectedUiStyleId}
                options={uiOptions}
                customMap={customUiMap}
                selectedAssetId={selectedUiAssetId}
                onSelectAsset={setSelectedUiAssetId}
                onDownloadStyleZip={handleDownloadUiStyleZip}
                isExporting={isExportingUi}
              />

              <UiComparisonMatrix
                selectedStyleId={selectedUiStyleId}
                onSelectStyle={handleSelectUiStyle}
                options={uiOptions}
                onDownloadAllUiZip={handleDownloadAllUiZip}
                isExportingAllUi={isExportingAllUi}
              />
            </div>
          </main>
        </div>
      ) : (
        <AnimationStudio />
      )}

      {/* Quiet Studio Footer */}
      <footer className="border-t border-white/[0.08] bg-[#090A0D] px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <span>
          Neo Clock — Generator Aset, UI Smartwatch &amp; Animation Studio
        </span>
        <span className="font-mono-tabular">
          Format Ekspor: PNG · BMP 1b/24b · C Header (.h) · image2cpp · ZIP
        </span>
      </footer>
    </div>
  );
}
