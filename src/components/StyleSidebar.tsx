import React from 'react';
import { GlyphRenderOptions, StyleCategory, StyleId } from '../types/glyph';
import { GLYPH_STYLES, STYLE_CATEGORIES } from '../engine/glyphStyles';
import { GlyphCanvas } from './GlyphCanvas';

interface StyleSidebarProps {
  selectedCategory: StyleCategory;
  onSelectCategory: (cat: StyleCategory) => void;
  selectedStyleId: StyleId;
  onSelectStyle: (id: StyleId) => void;
  options: GlyphRenderOptions;
}

export const StyleSidebar: React.FC<StyleSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedStyleId,
  onSelectStyle,
  options,
}) => {
  const filteredStyles =
    selectedCategory === 'all'
      ? GLYPH_STYLES
      : GLYPH_STYLES.filter((s) => s.category === selectedCategory);

  return (
    <aside className="w-full lg:w-[300px] shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#0C0E13] flex flex-col">
      <div className="p-4 border-b border-white/[0.08]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white tracking-tight">
            Katalog Gaya Angka
          </h2>
          <span className="text-xs font-mono-tabular text-slate-400">
            {filteredStyles.length} / {GLYPH_STYLES.length}
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap lg:grid lg:grid-cols-2">
          {STYLE_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md text-left transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  cat.id === 'all' ? 'col-span-2' : ''
                } ${
                  active
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-400/30'
                    : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Style List */}
      <div className="divide-y divide-white/[0.06] overflow-y-auto max-h-[420px] lg:max-h-none lg:flex-1">
        {filteredStyles.map((style) => {
          const isSelected = style.id === selectedStyleId;
          return (
            <button
              key={style.id}
              type="button"
              onClick={() => onSelectStyle(style.id)}
              className={`w-full text-left p-3.5 flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-white/[0.06]'
                  : 'hover:bg-white/[0.03]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                  <span className={style.category === 'cyberpunk' ? 'text-sky-400' : 'text-slate-400'}>
                    {style.categoryLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="truncate">{style.targetWatches}</span>
                </div>
                <div
                  className={`text-sm font-semibold truncate ${
                    isSelected ? 'text-white' : 'text-slate-200'
                  }`}
                >
                  {style.name}
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                  {style.tagline}
                </p>
              </div>

              {/* Miniature live 25x50 sprite preview */}
              <div
                className={`shrink-0 flex items-center gap-[1px] p-1.5 rounded bg-black border ${
                  isSelected ? 'border-sky-400/50' : 'border-white/[0.08]'
                }`}
                aria-hidden="true"
              >
                <GlyphCanvas char="2" styleId={style.id} options={options} scale={0.72} />
                <GlyphCanvas char="8" styleId={style.id} options={options} scale={0.72} />
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
