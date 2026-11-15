import { useEffect, useState } from 'react';
import { FileArchive, Globe2, Menu, X } from 'lucide-react';
import { applyLanguage, LANGUAGES, Language } from './i18n';
import {
  CustomPixelMap,
  GlyphChar,
  GlyphRenderOptions,
  StyleCategory,
  StyleId,
} from './types/glyph';
import { DEFAULT_RENDER_OPTIONS } from './engine/glyphRenderer';
import { GLYPH_STYLES, getStyleMeta } from './engine/glyphStyles';
import {
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
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { AnimationStudio } from './components/AnimationStudio';
import { ProgressGeneratorWorkbench } from './generator-v2/components/ProgressGeneratorWorkbench';

type GeneratorMode = 'numerals' | 'ui-assets' | 'animation';

const EMPTY_CUSTOM_MAP: CustomPixelMap = {};

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

  const activeStyleMeta = getStyleMeta(selectedStyleId);

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
            {generatorMode === 'numerals' ? 'Aset 25×50' : generatorMode === 'ui-assets' ? 'UI Generator V2' : 'Animation Studio'}
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
        <ProgressGeneratorWorkbench />
      ) : (
        <AnimationStudio />
      )}

      {/* Quiet Studio Footer */}
      <footer className="border-t border-white/[0.08] bg-[#090A0D] px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <span>
          Neo Clock — Generator Aset, UI Smartwatch &amp; Animation Studio
        </span>
        <span className="font-mono-tabular">
          Format Ekspor: PNG · ZIP
        </span>
      </footer>
    </div>
  );
}
