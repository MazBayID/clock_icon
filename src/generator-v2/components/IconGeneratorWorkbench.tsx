import React, { useEffect, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import { Download, Package, RotateCcw } from 'lucide-react';
import { UiStyleId } from '../../types/uiAsset';
import { DEFAULT_ICON_RENDER_OPTIONS, ICON_ASSET_CATALOG, IconAssetId, IconRenderOptions, normalizeIconRenderOptions } from '../model/icons';
import { renderIconAsset } from '../renderers/iconRenderer';
import { UI_STYLES } from '../../engine/uiAssetStyles';

function canvasBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNG encoding failed.')), 'image/png');
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export const IconGeneratorWorkbench: React.FC = () => {
  const [assetId, setAssetId] = useState<IconAssetId>('heart');
  const [styleId, setStyleId] = useState<UiStyleId>('swiss-precision-ui');
  const [options, setOptions] = useState<IconRenderOptions>(DEFAULT_ICON_RENDER_OPTIONS);
  const [packaging, setPackaging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeAsset = useMemo(() => ICON_ASSET_CATALOG.find((asset) => asset.id === assetId) ?? ICON_ASSET_CATALOG[0], [assetId]);
  const activeStyle = UI_STYLES.find((style) => style.id === styleId) ?? UI_STYLES[0];

  useEffect(() => {
    if (canvasRef.current) renderIconAsset(assetId, styleId, normalizeIconRenderOptions(options), canvasRef.current);
  }, [assetId, styleId, options]);

  const selectStyle = (next: UiStyleId) => {
    setStyleId(next);
    const meta = UI_STYLES.find((style) => style.id === next);
    setOptions((current) => ({ ...current, pixelSnap: meta?.recommendedMode === 'pixel-snap' }));
  };

  const downloadCurrent = async () => {
    if (!canvasRef.current) return;
    downloadBlob(await canvasBlob(canvasRef.current), `${assetId}-${styleId}.png`);
  };

  const downloadPackage = async () => {
    setPackaging(true);
    try {
      const zip = new JSZip();
      const manifest: { id: string; filename: string; width: number; height: number }[] = [];
      for (const asset of ICON_ASSET_CATALOG) {
        const canvas = renderIconAsset(asset.id, styleId, normalizeIconRenderOptions(options));
        zip.file(`icons/${asset.id}.png`, await canvasBlob(canvas));
        manifest.push({ id: asset.id, filename: `${asset.id}.png`, width: asset.width, height: asset.height });
      }
      zip.file('manifest.json', JSON.stringify({ generator: 'Clock Icon UI Generator V2', family: 'icons', style: styleId, format: 'PNG', assets: manifest }, null, 2));
      downloadBlob(await zip.generateAsync({ type: 'blob' }), `clock-icon-ui-icons-${styleId}.zip`);
    } finally {
      setPackaging(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)] min-h-[calc(100vh-15rem)]">
      <aside className="border-b xl:border-b-0 xl:border-r border-white/[0.08] bg-[#0C0E13] p-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Icon Catalog · {ICON_ASSET_CATALOG.length}</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-1 gap-2">
          {ICON_ASSET_CATALOG.map((asset) => (
            <button key={asset.id} type="button" onClick={() => setAssetId(asset.id)} aria-pressed={assetId === asset.id}
              className={`text-left rounded-md border p-3 ${assetId === asset.id ? 'border-sky-400/60 bg-sky-400/10' : 'border-white/[0.08] bg-black/20 hover:bg-white/[0.04]'}`}>
              <span className="block text-sm font-semibold text-slate-200">{asset.name}</span>
              <span className="block text-[11px] text-slate-500 mt-1">{asset.description}</span>
              <span className="block text-[10px] font-mono text-slate-600 mt-2">{asset.width}×{asset.height}px</span>
            </button>
          ))}
        </div>
      </aside>

      <main className="min-w-0 p-4 sm:p-6 grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_340px] gap-5">
        <section className="rounded-lg border border-white/[0.08] bg-[#0C0E13] p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
            <div><div className="text-xs text-sky-400 font-medium">ICON / {activeStyle.categoryLabel}</div><h2 className="text-lg font-semibold text-white mt-1">{activeAsset.name}</h2><p className="text-xs text-slate-500 mt-1">{activeStyle.tagline}</p></div>
            <span className="text-xs font-mono text-slate-500">{activeAsset.width}×{activeAsset.height}px</span>
          </div>
          <div className="min-h-[250px] rounded-md border border-white/[0.08] bg-black flex items-center justify-center overflow-auto p-8">
            <canvas ref={canvasRef} width={activeAsset.width} height={activeAsset.height} className="pixelated-canvas block" style={{ width: `${Math.min(activeAsset.width * 5, 480)}px`, height: 'auto', imageRendering: 'pixelated' }} />
          </div>
          <div className="flex flex-wrap justify-between gap-2 mt-4 text-[11px] font-mono text-slate-500"><span>{activeAsset.id}.png</span><span>{styleId}</span><span>#FFFFFF / #000000</span></div>
        </section>

        <aside className="rounded-lg border border-white/[0.08] bg-[#0C0E13] p-4 h-fit">
          <div className="flex items-center justify-between mb-4"><h2 className="text-sm font-semibold text-white">Icon Controls</h2><button type="button" onClick={() => setOptions(DEFAULT_ICON_RENDER_OPTIONS)} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"><RotateCcw className="w-3 h-3" /> Reset</button></div>
          <div className="space-y-4">
            <label className="block"><span className="block text-xs text-slate-400 mb-1.5">Visual Style</span><select value={styleId} onChange={(e) => selectStyle(e.target.value as UiStyleId)} className="w-full bg-black border border-white/[0.12] rounded px-2.5 py-2 text-sm text-white">{UI_STYLES.map((style) => <option key={style.id} value={style.id}>{style.name}</option>)}</select></label>
            <label className="block"><span className="flex justify-between text-xs text-slate-400 mb-2"><span>Stroke Weight</span><strong className="text-white">{options.strokeScale.toFixed(2)}×</strong></span><input type="range" min="0.75" max="1.3" step="0.05" value={options.strokeScale} onChange={(e) => setOptions((current) => ({ ...current, strokeScale: Number(e.target.value) }))} className="w-full accent-sky-400" /></label>
            <label className="block"><span className="flex justify-between text-xs text-slate-400 mb-2"><span>Padding</span><strong className="text-white">{options.padding}px</strong></span><input type="range" min="0" max="3" step="1" value={options.padding} onChange={(e) => setOptions((current) => ({ ...current, padding: Number(e.target.value) }))} className="w-full accent-sky-400" /></label>
            <label className="flex items-center justify-between text-xs text-slate-300"><span>Pixel snap (1-bit)</span><input type="checkbox" checked={options.pixelSnap} onChange={(e) => setOptions((current) => ({ ...current, pixelSnap: e.target.checked }))} className="accent-sky-400" /></label>
            {options.pixelSnap && <label className="block"><span className="flex justify-between text-xs text-slate-400 mb-2"><span>Threshold</span><strong className="text-white">{options.threshold}</strong></span><input type="range" min="64" max="210" step="2" value={options.threshold} onChange={(e) => setOptions((current) => ({ ...current, threshold: Number(e.target.value) }))} className="w-full accent-sky-400" /></label>}
            <div className="grid grid-cols-1 gap-2 pt-2"><button type="button" onClick={downloadCurrent} className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-white/[0.06] border border-white/[0.12] text-sm text-white hover:bg-white/[0.1]"><Download className="w-4 h-4" /> Unduh PNG</button><button type="button" disabled={packaging} onClick={downloadPackage} className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-sky-400 text-slate-950 text-sm font-semibold hover:bg-sky-300 disabled:opacity-50"><Package className="w-4 h-4" /> {packaging ? 'Mengemas…' : 'Ekspor Paket Ikon'}</button></div>
          </div>
        </aside>
      </main>
    </div>
  );
};
