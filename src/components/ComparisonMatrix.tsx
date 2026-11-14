import React, { useState } from 'react';
import { FileArchive } from 'lucide-react';
import { GlyphChar, GlyphRenderOptions, StyleCategory, StyleId } from '../types/glyph';
import { GLYPH_STYLES, STYLE_CATEGORIES } from '../engine/glyphStyles';
import { GlyphCanvas } from './GlyphCanvas';

interface ComparisonMatrixProps {
  selectedStyleId: StyleId;
  onSelectStyle: (id: StyleId) => void;
  options: GlyphRenderOptions;
  onDownloadAllZip: () => void;
  isExportingAll: boolean;
}

const SAMPLE_PRESETS = ['10:48', '23:59', '07:36', '88:88'];

export const ComparisonMatrix: React.FC<ComparisonMatrixProps> = ({
  selectedStyleId,
  onSelectStyle,
  options,
  onDownloadAllZip,
  isExportingAll,
}) => {
  const [sample, setSample] = useState('10:48');
  const [filterCat, setFilterCat] = useState<StyleCategory>('all');

  const visibleStyles =
    filterCat === 'all'
      ? GLYPH_STYLES
      : GLYPH_STYLES.filter((s) => s.category === filterCat);

  return (
    <section
      id="komparasi"
      className="bg-[#0C0E13] border border-white/[0.08] rounded-lg p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Perbandingan Lintas Gaya ({GLYPH_STYLES.length} Model Smartwatch)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Evaluasi karakter tipografi antara gaya Modern, Elegan, Berteknologi, dan Cyberpunk secara berdampingan.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1 p-0.5 rounded-md bg-black border border-white/[0.08]">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setSample(preset)}
                className={`px-2.5 py-1 text-xs font-mono-tabular rounded transition-colors whitespace-nowrap cursor-pointer ${
                  sample === preset
                    ? 'bg-white text-black font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={isExportingAll}
            onClick={onDownloadAllZip}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
          >
            <FileArchive className="w-3.5 h-3.5" />
            {isExportingAll
              ? `Mengemas ${GLYPH_STYLES.length} Gaya...`
              : `Unduh Semua ${GLYPH_STYLES.length} Gaya (ZIP)`}
          </button>
        </div>
      </div>

      {/* Category Filter Row */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {STYLE_CATEGORIES.map((cat) => {
          const active = filterCat === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCat(cat.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                active
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-400/30'
                  : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {visibleStyles.map((style) => {
          const active = style.id === selectedStyleId;
          const chars = sample.split('') as GlyphChar[];

          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`text-left p-4 rounded-md border transition-colors flex flex-col justify-between gap-3.5 cursor-pointer ${
                active
                  ? 'bg-white/[0.06] border-sky-400/60'
                  : 'bg-[#090A0D] border-white/[0.08] hover:border-white/25 hover:bg-white/[0.03]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 w-full">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className={style.category === 'cyberpunk' ? 'text-sky-400' : ''}>
                      {style.categoryLabel}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="truncate">{style.targetWatches}</span>
                  </div>
                  <div className="text-sm font-semibold text-white mt-0.5 truncate">
                    {style.name}
                  </div>
                </div>
                {active && (
                  <span className="text-[11px] font-medium text-sky-300 shrink-0">
                    Aktif
                  </span>
                )}
              </div>

              <div className="w-full py-3.5 px-3 rounded bg-black border border-white/[0.06] flex items-center justify-center gap-[2px]">
                {chars.map((ch, idx) => (
                  <GlyphCanvas
                    key={idx}
                    char={ch}
                    styleId={style.id}
                    options={options}
                    scale={1.32}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
