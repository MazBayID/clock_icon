import React from 'react';
import { Download, FileArchive, Package, Layers } from 'lucide-react';
import { DYNAMIC_UI_ASSET_IDS, STATIC_UI_ASSET_IDS, CustomUiPixelMap, UiAssetId, UiRenderOptions, UiStyleId } from '../types/uiAsset';
import { UI_ASSET_CATALOG } from '../engine/uiAssetStyles';
import { UiAssetCanvas } from './UiAssetCanvas';
interface Props {
  styleId: UiStyleId; options: UiRenderOptions; customMap: CustomUiPixelMap;
  selectedAssetId: UiAssetId; onSelectAsset: (id: UiAssetId) => void;
  onDownloadSingleStatic: (id: UiAssetId) => void; onDownloadAllStatic: () => void;
  onDownloadSingleDynamic: (id: UiAssetId) => void; onDownloadAllDynamic: () => void;
  onDownloadFullZip: () => void; isExporting: boolean;
}
export const UiAssetSheetGrid: React.FC<Props> = (p) => {
  const group = (title: string, description: string, ids: readonly UiAssetId[], dynamic: boolean) => (
    <section className="mt-5">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-3">
        <div><h4 className="text-sm font-semibold text-white">{title}</h4><p className="text-xs text-slate-400 mt-1">{description}</p></div>
        <button type="button" disabled={p.isExporting} onClick={dynamic ? p.onDownloadAllDynamic : p.onDownloadAllStatic} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-200 bg-white/[0.04] border border-white/[0.08] rounded-md disabled:opacity-50"><Package className="w-3.5 h-3.5" /> Extract semua {dynamic ? 'dinamis' : 'statis'}</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
        {ids.map((id) => {
          const asset = UI_ASSET_CATALOG.find((item) => item.id === id)!;
          const width = p.options.assetSizes?.[id]?.width || asset.width, height = p.options.assetSizes?.[id]?.height || asset.height;
          const selected = p.selectedAssetId === id;
          return <div key={id} onClick={() => p.onSelectAsset(id)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); p.onSelectAsset(id); } }} className={'rounded-md border p-3 flex flex-col gap-2.5 cursor-pointer ' + (selected ? 'bg-white/[0.07] border-sky-400/70' : 'bg-[#090A0D] border-white/[0.08] hover:border-white/25')}>
            <div className="flex items-center justify-between text-[11px]"><span className="text-slate-200">{asset.shortLabel}</span><span className="font-mono-tabular text-slate-500">{width}×{height}</span></div>
            <div className="min-h-[82px] flex items-center justify-center p-2 bg-black border border-white/[0.08] rounded-sm overflow-hidden"><UiAssetCanvas assetId={id} styleId={p.styleId} options={p.options} customPixels={p.customMap[p.styleId]?.[id] ?? null} scale={Math.min(2, 100 / Math.max(width,height))} /></div>
            <div className="flex items-center justify-between text-[10px] text-slate-400"><span>{id}</span><button type="button" aria-label={'Extract ' + asset.name} onClick={(e) => { e.stopPropagation(); dynamic ? p.onDownloadSingleDynamic(id) : p.onDownloadSingleStatic(id); }} className="p-1 rounded hover:text-white hover:bg-white/10"><Download className="w-3.5 h-3.5" /></button></div>
          </div>;
        })}
      </div>
    </section>
  );
  return <div className="bg-[#0C0E13] border border-white/[0.08] rounded-lg p-5">
    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]"><div><h3 className="text-sm font-semibold text-white">Generator Aset UI — Dinamis &amp; Statis</h3><p className="text-xs text-slate-400 mt-1">5 ikon dinamis · 8 ikon statis · gaya visual aktif dipertahankan.</p></div><button type="button" disabled={p.isExporting} onClick={p.onDownloadFullZip} className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-sky-400 rounded-md disabled:opacity-50"><FileArchive className="w-3.5 h-3.5" /> Extract Full UI ZIP</button></div>
    {group('Dynamic UI Icons', 'Satu ikon dinamis berisi semua tingkat kondisi dan sprite sheet-nya.', DYNAMIC_UI_ASSET_IDS, true)}
    {group('Static UI Icons', 'Ikon statis individual atau seluruh koleksi dengan sprite sheet gabungan.', STATIC_UI_ASSET_IDS, false)}
    <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-2 text-xs text-slate-400"><span><Layers className="inline w-3.5 h-3.5 mr-1" /> Sprite sheet dinamis per ikon · statis gabungan</span><span>PNG · JSON Manifest</span></div>
  </div>;
};