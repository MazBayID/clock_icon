import React, { useState } from 'react';
import { Code2, Check, Copy, Download, FileArchive, Layers } from 'lucide-react';
import {
  CustomUiPixelMap,
  UiAssetId,
  UiRenderOptions,
  UiStyleId,
} from '../types/uiAsset';
import { UI_ASSET_CATALOG } from '../engine/uiAssetStyles';
import { buildUiCL8Header } from '../engine/bitmapEncoder';
import { downloadTextFile } from '../engine/exportEngine';
import { UiAssetCanvas } from './UiAssetCanvas';

interface UiAssetSheetGridProps {
  styleId: UiStyleId;
  options: UiRenderOptions;
  customMap: CustomUiPixelMap;
  selectedAssetId: UiAssetId;
  onSelectAsset: (id: UiAssetId) => void;
  onDownloadAsset: (id: UiAssetId) => void;
  onDownloadSpriteSheet: () => void;
  onDownloadStyleZip: () => void;
  isExporting: boolean;
}

export const UiAssetSheetGrid: React.FC<UiAssetSheetGridProps> = ({
  styleId,
  options,
  customMap,
  selectedAssetId,
  onSelectAsset,
  onDownloadAsset,
  onDownloadSpriteSheet,
  onDownloadStyleZip,
  isExporting,
}) => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const cHeaderPreview = showCodeModal
    ? buildUiCL8Header(styleId, options, customMap)
    : '';

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(cHeaderPreview);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1800);
  };

  return (
    <div className="bg-[#0C0E13] border border-white/[0.08] rounded-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Set Aset UI Smartwatch Lengkap (12 Ikon &amp; Widget HUD)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            12 elemen UI siap pakai · Putih (#FFFFFF) di atas Hitam (#000000). Klik aset untuk inspeksi &amp; edit piksel.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onDownloadSpriteSheet}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5" />
            Atlas UI PNG
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
            {isExporting ? 'Mengemas ZIP...' : 'Unduh Paket UI (ZIP)'}
          </button>
        </div>
      </div>

      {/* Grid of 12 UI Assets */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
        {UI_ASSET_CATALOG.map((asset) => {
          const isSelected = asset.id === selectedAssetId;
          const scale =
            asset.width >= 60 ? 1.8 : asset.width >= 48 ? 1.6 : 2.1;

          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectAsset(asset.id);
                }
              }}
              className={`group rounded-md border p-3 flex flex-col items-center justify-between gap-2.5 transition-colors cursor-pointer select-none ${
                isSelected
                  ? 'bg-white/[0.07] border-sky-400/70'
                  : 'bg-[#090A0D] border-white/[0.08] hover:border-white/25 hover:bg-white/[0.03]'
              }`}
            >
              <div className="w-full flex items-center justify-between text-[11px]">
                <span
                  className={`font-medium truncate ${
                    isSelected ? 'text-sky-300' : 'text-slate-300'
                  }`}
                >
                  {asset.shortLabel}
                </span>
                <span className="text-[10px] font-mono-tabular text-slate-500 shrink-0">{asset.width}×{asset.height}</span>
              </div>

              <div className="w-full min-h-[82px] flex items-center justify-center p-2 bg-black border border-white/[0.08] rounded-sm overflow-hidden">
                <UiAssetCanvas
                  assetId={asset.id}
                  styleId={styleId}
                  options={options}
                  customPixels={customMap[styleId]?.[asset.id] ?? null}
                  scale={scale}
                />
              </div>

              <div className="w-full flex items-center justify-between gap-1 pt-0.5">
                <span className="text-[10px] font-mono-tabular text-slate-400 truncate">
                  {asset.id}.png
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadAsset(asset.id);
                  }}
                  title={`Unduh ${asset.id}.png (${asset.width}×${asset.height} px)`}
                  aria-label={`Unduh ${asset.name}`}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Combined UI Atlas Strip */}
      <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-xs font-medium text-slate-300">
            Pratinjau Atlas Sprite UI Gabungan (Skala Asli 1:1)
          </span>
          <div className="inline-flex items-center gap-2 p-2 bg-black border border-white/[0.1] rounded overflow-x-auto max-w-full">
            {UI_ASSET_CATALOG.map((asset) => (
              <UiAssetCanvas
                key={asset.id}
                assetId={asset.id}
                styleId={styleId}
                options={options}
                customPixels={customMap[styleId]?.[asset.id] ?? null}
                scale={1}
              />
            ))}
          </div>
        </div>
        <div className="text-xs font-mono-tabular text-slate-400 shrink-0">
          12 Elemen UI · 1:1 Native
        </div>
      </div>

      {/* Optional Embedded C Header Drawer */}
      {showCodeModal && (
        <div className="mt-5 pt-4 border-t border-white/[0.08]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <span className="text-xs font-medium text-slate-200">
              Array Firmware UI C/C++ (uint8_t L8 Luminance · 12 Aset)
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
                onClick={() =>
                  downloadTextFile(
                    cHeaderPreview,
                    `${styleId}_ui_assets_l8.h`
                  )
                }
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
  );
};
