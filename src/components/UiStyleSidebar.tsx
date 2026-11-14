import React from 'react';
import { UiRenderOptions, UiStyleCategory, UiStyleId } from '../types/uiAsset';
import { UI_STYLES, UI_STYLE_CATEGORIES } from '../engine/uiAssetStyles';
import { UiAssetCanvas } from './UiAssetCanvas';

interface UiStyleSidebarProps {
  selectedCategory: UiStyleCategory;
  onSelectCategory: (cat: UiStyleCategory) => void;
  selectedStyleId: UiStyleId;
  onSelectStyle: (id: UiStyleId) => void;
  options: UiRenderOptions;
}

export const UiStyleSidebar: React.FC<UiStyleSidebarProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedStyleId,
  onSelectStyle,
  options,
}) => {
  const filteredStyles =
    selectedCategory === 'all'
      ? UI_STYLES
      : UI_STYLES.filter((s) => s.category === selectedCategory);

  return (
    <aside className="w-full lg:w-[300px] shrink-0 border-b lg:border-b-0 lg:border-r border-white/[0.08] bg-[#0C0E13] flex flex-col lg:sticky lg:top-14 lg:h-[calc(100vh-3.5rem)]">
      <div className="p-4 border-b border-white/[0.08]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-white tracking-tight">
            Katalog Gaya Aset UI
          </h2>
          <span className="text-xs font-mono-tabular text-slate-400">
            {filteredStyles.length} / {UI_STYLES.length}
          </span>
        </div>

        {/* Category Filter Tabs */}
        <div className="grid grid-cols-2 gap-1.5 sm:flex sm:flex-wrap lg:grid lg:grid-cols-2">
          {UI_STYLE_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat.id;
            const count =
              cat.id === 'all'
                ? UI_STYLES.length
                : UI_STYLES.filter((s) => s.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md text-left transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center justify-between gap-1.5 ${
                  cat.id === 'all' ? 'col-span-2' : ''
                } ${
                  active
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-400/30'
                    : 'bg-white/[0.03] text-slate-400 border border-white/[0.06] hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="truncate">{cat.label}</span>
                <span className="font-mono-tabular text-[11px] opacity-75">
                  {count}
                </span>
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
                isSelected ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                  <span
                    className={
                      style.category === 'cyberpunk-ui'
                        ? 'text-sky-400'
                        : 'text-slate-400'
                    }
                  >
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

              {/* Miniature live UI icon preview */}
              <div
                className={`shrink-0 flex items-center gap-1 p-1.5 rounded bg-black border ${
                  isSelected ? 'border-sky-400/50' : 'border-white/[0.08]'
                }`}
                aria-hidden="true"
              >
                <UiAssetCanvas
                  assetId="heart"
                  styleId={style.id}
                  options={options}
                  scale={0.85}
                />
                <UiAssetCanvas
                  assetId="signal"
                  styleId={style.id}
                  options={options}
                  scale={0.85}
                />
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
};
