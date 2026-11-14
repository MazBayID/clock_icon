import React, { useState } from 'react';
import { FileArchive } from 'lucide-react';
import {
  UiRenderOptions,
  UiStyleCategory,
  UiStyleId,
} from '../types/uiAsset';
import { UI_STYLES, UI_STYLE_CATEGORIES } from '../engine/uiAssetStyles';
import { UiAssetCanvas } from './UiAssetCanvas';

interface UiComparisonMatrixProps {
  selectedStyleId: UiStyleId;
  onSelectStyle: (id: UiStyleId) => void;
  options: UiRenderOptions;
  onDownloadAllUiZip: () => void;
  isExportingAllUi: boolean;
}

export const UiComparisonMatrix: React.FC<UiComparisonMatrixProps> = ({
  selectedStyleId,
  onSelectStyle,
  options,
  onDownloadAllUiZip,
  isExportingAllUi,
}) => {
  const [filterCat, setFilterCat] = useState<UiStyleCategory>('all');

  const visibleStyles =
    filterCat === 'all'
      ? UI_STYLES
      : UI_STYLES.filter((s) => s.category === filterCat);

  return (
    <section
      id="komparasi"
      className="bg-[#0C0E13] border border-white/[0.08] rounded-lg p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Perbandingan 10 Gaya Aset UI Smartwatch
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Bandingkan seluruh bahasa visual UI mulai dari Swiss Micro-Line, Horologi, Aerospace HUD, hingga Cyberpunk UI secara berdampingan.
          </p>
        </div>

        <button
          type="button"
          disabled={isExportingAllUi}
          onClick={onDownloadAllUiZip}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap cursor-pointer disabled:opacity-50"
        >
          <FileArchive className="w-3.5 h-3.5" />
          {isExportingAllUi
            ? `Mengemas ${UI_STYLES.length} Gaya UI...`
            : `Unduh Semua ${UI_STYLES.length} Gaya UI (ZIP)`}
        </button>
      </div>

      {/* Category Filter Row */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {UI_STYLE_CATEGORIES.map((cat) => {
          const active = filterCat === cat.id;
          const count =
            cat.id === 'all'
              ? UI_STYLES.length
              : UI_STYLES.filter((s) => s.category === cat.id).length;
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
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {visibleStyles.map((style) => {
          const active = style.id === selectedStyleId;

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
                    <span
                      className={
                        style.category === 'cyberpunk-ui' ? 'text-sky-400' : ''
                      }
                    >
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

              <div className="w-full py-3 px-3 rounded bg-black border border-white/[0.06] flex items-center justify-around gap-2">
                <UiAssetCanvas
                  assetId="battery"
                  styleId={style.id}
                  options={options}
                  scale={1.15}
                />
                <UiAssetCanvas
                  assetId="heart"
                  styleId={style.id}
                  options={options}
                  scale={1.1}
                />
                <UiAssetCanvas
                  assetId="signal"
                  styleId={style.id}
                  options={options}
                  scale={1.1}
                />
                <UiAssetCanvas
                  assetId="progress-arc"
                  styleId={style.id}
                  options={options}
                  scale={0.85}
                />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
