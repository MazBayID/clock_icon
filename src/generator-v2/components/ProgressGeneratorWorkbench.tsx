import React, { useEffect, useMemo, useRef, useState } from 'react';
import JSZip from 'jszip';
import { Download, Package, RotateCcw } from 'lucide-react';
import {
  createDefaultProgressConfig,
  normalizeProgressConfig,
  PROGRESS_ASSET_CATALOG,
  ProgressAssetConfig,
  ProgressAssetId,
  ProgressStyle,
} from '../model/progress';
import { renderProgressAsset } from '../renderers/progressRenderer';

const STYLE_OPTIONS: { id: ProgressStyle; label: string }[] = [
  { id: 'outline', label: 'Outline' },
  { id: 'solid', label: 'Solid' },
  { id: 'pixel', label: 'Pixel' },
  { id: 'tactical', label: 'Tactical' },
];

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNG encoding failed.')), 'image/png');
  });
}

export const ProgressGeneratorWorkbench: React.FC = () => {
  const [assetId, setAssetId] = useState<ProgressAssetId>('battery');
  const [config, setConfig] = useState<ProgressAssetConfig>(() => createDefaultProgressConfig('battery'));
  const [isPackaging, setIsPackaging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeMeta = useMemo(
    () => PROGRESS_ASSET_CATALOG.find((item) => item.id === assetId) ?? PROGRESS_ASSET_CATALOG[0],
    [assetId],
  );

  useEffect(() => {
    if (canvasRef.current) renderProgressAsset(config, canvasRef.current);
  }, [config]);

  const update = (patch: Partial<ProgressAssetConfig>) => {
    setConfig((current) => normalizeProgressConfig({ ...current, ...patch }));
  };

  const selectAsset = (id: ProgressAssetId) => {
    setAssetId(id);
    setConfig(createDefaultProgressConfig(id));
  };

  const downloadCurrent = async () => {
    if (!canvasRef.current) return;
    saveBlob(await canvasToBlob(canvasRef.current), `${assetId}.png`);
  };

  const downloadPackage = async () => {
    setIsPackaging(true);
    try {
      const zip = new JSZip();
      const manifest: { id: string; filename: string; width: number; height: number; value: number }[] = [];
      for (const meta of PROGRESS_ASSET_CATALOG) {
        const base = createDefaultProgressConfig(meta.id);
        const assetConfig = normalizeProgressConfig({
          ...base,
          value: config.value,
          style: config.style,
          showTrack: config.showTrack,
          strokeWidth: config.strokeWidth,
          cornerRadius: config.cornerRadius,
          gap: config.gap,
        });
        const canvas = renderProgressAsset(assetConfig);
        const blob = await canvasToBlob(canvas);
        zip.file(`assets/${meta.id}.png`, blob);
        manifest.push({
          id: meta.id,
          filename: `${meta.id}.png`,
          width: assetConfig.width,
          height: assetConfig.height,
          value: assetConfig.value,
        });
      }
      zip.file('manifest.json', JSON.stringify({
        generator: 'Clock Icon UI Generator V2',
        format: 'PNG',
        assets: manifest,
      }, null, 2));
      saveBlob(await zip.generateAsync({ type: 'blob' }), 'clock-icon-ui-progress-assets.zip');
    } finally {
      setIsPackaging(false);
    }
  };

  const reset = () => setConfig(createDefaultProgressConfig(assetId));

  return (
    <div className="flex-1 min-w-0 bg-[#090A0D] text-[#F2F4F8]">

      <div className="grid grid-cols-1 xl:grid-cols-[260px_minmax(0,1fr)] min-h-[calc(100vh-15rem)]">
        <aside className="border-b xl:border-b-0 xl:border-r border-white/[0.08] bg-[#0C0E13] p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Asset Families</h2>
            <span className="text-[11px] font-mono text-slate-500">{PROGRESS_ASSET_CATALOG.length} types</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-1 gap-2">
            {PROGRESS_ASSET_CATALOG.map((item) => (
              <button key={item.id} type="button" onClick={() => selectAsset(item.id)} aria-pressed={assetId === item.id}
                className={`text-left rounded-md border p-3 transition-colors ${assetId === item.id ? 'border-sky-400/60 bg-sky-400/10' : 'border-white/[0.08] bg-black/20 hover:bg-white/[0.04]'}`}>
                <span className={`block text-sm font-semibold ${assetId === item.id ? 'text-sky-300' : 'text-slate-200'}`}>{item.name}</span>
                <span className="block text-[11px] leading-relaxed text-slate-500 mt-1">{item.description}</span>
                <span className="block text-[10px] font-mono text-slate-600 mt-2">{item.defaultWidth}×{item.defaultHeight}px</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="min-w-0 p-4 sm:p-6 grid grid-cols-1 2xl:grid-cols-[minmax(0,1fr)_340px] gap-5">
          <section className="min-w-0 flex flex-col gap-4">
            <div className="rounded-lg border border-white/[0.08] bg-[#0C0E13] p-4 sm:p-6">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <div className="text-xs text-sky-400 font-medium">{activeMeta.group.toUpperCase()}</div>
                  <h2 className="text-lg font-semibold text-white mt-1">{activeMeta.name}</h2>
                  <p className="text-xs text-slate-500 mt-1">{activeMeta.description}</p>
                </div>
                <span className="text-xs font-mono text-slate-500">{config.width}×{config.height}px</span>
              </div>
              <div className="min-h-[250px] rounded-md border border-white/[0.08] bg-black flex items-center justify-center overflow-auto p-8">
                <canvas ref={canvasRef} width={config.width} height={config.height}
                  className="pixelated-canvas block max-w-full max-h-[360px]"
                  style={{ width: `${Math.min(config.width * 4, 520)}px`, height: 'auto', imageRendering: 'pixelated' }} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-[11px] text-slate-500 font-mono">
                <span>Canvas {config.width} × {config.height}</span>
                <span>Value {Math.round(((config.value - config.min) / (config.max - config.min)) * 100)}%</span>
                <span>Background #000000 · Foreground #FFFFFF</span>
              </div>
            </div>
          </section>

          <aside className="rounded-lg border border-white/[0.08] bg-[#0C0E13] p-4 h-fit">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-white">Context Controls</h2>
              <button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"><RotateCcw className="w-3 h-3" /> Reset</button>
            </div>

            <div className="space-y-5">
              <label className="block">
                <span className="flex justify-between text-xs text-slate-400 mb-2"><span>Value</span><strong className="text-white">{config.value}%</strong></span>
                <input type="range" min={config.min} max={config.max} value={config.value} onChange={(e) => update({ value: Number(e.target.value) })} className="w-full accent-sky-400" />
              </label>

              <div>
                <span className="block text-xs text-slate-400 mb-2">Visual Style</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {STYLE_OPTIONS.map((style) => <button key={style.id} type="button" onClick={() => update({ style: style.id })}
                    className={`rounded border px-2 py-2 text-xs ${config.style === style.id ? 'border-sky-400/60 bg-sky-400/10 text-sky-300' : 'border-white/[0.08] text-slate-400 hover:text-white'}`}>{style.label}</button>)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block"><span className="block text-xs text-slate-400 mb-1.5">Width</span><input type="number" min="8" max="512" value={config.width} onChange={(e) => update({ width: Number(e.target.value) })} className="w-full bg-black border border-white/[0.12] rounded px-2.5 py-2 text-sm text-white" /></label>
                <label className="block"><span className="block text-xs text-slate-400 mb-1.5">Height</span><input type="number" min="8" max="512" value={config.height} onChange={(e) => update({ height: Number(e.target.value) })} className="w-full bg-black border border-white/[0.12] rounded px-2.5 py-2 text-sm text-white" /></label>
              </div>

              {(assetId === 'signal' || assetId === 'volume' || assetId === 'segmented-progress') && (
                <label className="block"><span className="flex justify-between text-xs text-slate-400 mb-2"><span>Segments</span><strong className="text-white">{config.segments}</strong></span><input type="range" min="2" max="16" value={config.segments} onChange={(e) => update({ segments: Number(e.target.value) })} className="w-full accent-sky-400" /></label>
              )}

              {(assetId === 'linear-progress' || assetId === 'segmented-progress') && (
                <div><span className="block text-xs text-slate-400 mb-2">Orientation</span><div className="grid grid-cols-2 gap-1.5">{(['horizontal', 'vertical'] as const).map((orientation) => <button key={orientation} type="button" onClick={() => update({ orientation })} className={`rounded border px-2 py-2 text-xs capitalize ${config.orientation === orientation ? 'border-sky-400/60 bg-sky-400/10 text-sky-300' : 'border-white/[0.08] text-slate-400'}`}>{orientation}</button>)}</div></div>
              )}

              <label className="block"><span className="flex justify-between text-xs text-slate-400 mb-2"><span>Stroke Width</span><strong className="text-white">{config.strokeWidth}px</strong></span><input type="range" min="1" max="6" value={config.strokeWidth} onChange={(e) => update({ strokeWidth: Number(e.target.value) })} className="w-full accent-sky-400" /></label>
              <label className="block"><span className="flex justify-between text-xs text-slate-400 mb-2"><span>Corner Radius</span><strong className="text-white">{config.cornerRadius}px</strong></span><input type="range" min="0" max="12" value={config.cornerRadius} onChange={(e) => update({ cornerRadius: Number(e.target.value) })} className="w-full accent-sky-400" /></label>
              <label className="block"><span className="flex justify-between text-xs text-slate-400 mb-2"><span>Segment Gap</span><strong className="text-white">{config.gap}px</strong></span><input type="range" min="0" max="8" value={config.gap} onChange={(e) => update({ gap: Number(e.target.value) })} className="w-full accent-sky-400" /></label>

              <label className="flex items-center justify-between text-xs text-slate-300"><span>Show empty track</span><input type="checkbox" checked={config.showTrack} onChange={(e) => update({ showTrack: e.target.checked })} className="accent-sky-400" /></label>
            </div>
          </aside>
        </main>
      </div>
    </div>
  );
};
