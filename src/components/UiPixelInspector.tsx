import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Grid3X3 } from 'lucide-react';
import {
  UiAssetId,
  UiAssetMetrics,
  UiRenderOptions,
  UiStyleId,
} from '../types/uiAsset';
import {
  computeUiAssetMetrics,
  extractUiAlphaMap,
  renderUiAssetToCanvas,
} from '../engine/uiAssetRenderer';
import { getUiAssetMeta } from '../engine/uiAssetStyles';
import { UiAssetCanvas } from './UiAssetCanvas';

interface UiPixelInspectorProps {
  assetId: UiAssetId;
  styleId: UiStyleId;
  options: UiRenderOptions;
  onDownloadAsset: (assetId: UiAssetId) => void;
}

export const UiPixelInspector: React.FC<UiPixelInspectorProps> = ({
  assetId,
  styleId,
  options,
  onDownloadAsset,
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; lum: number } | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const meta = getUiAssetMeta(assetId);
  const assetWidth = options.width || meta.width;
  const assetHeight = options.height || meta.height;
  const zoom = assetWidth >= 60 ? 6 : assetWidth >= 48 ? 7 : 10;
  const viewW = assetWidth * zoom;
  const viewH = assetHeight * zoom;

  const { alphaMap, metrics } = useMemo(() => {
    const canvas = renderUiAssetToCanvas(assetId, styleId, options, null);
    return {
      alphaMap: extractUiAlphaMap(canvas),
      metrics: computeUiAssetMetrics(canvas) as UiAssetMetrics,
    };
  }, [assetId, styleId, options]);

  useEffect(() => {
    const canvas = gridCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, viewW, viewH);
    for (let y = 0; y < assetHeight; y++) {
      for (let x = 0; x < assetWidth; x++) {
        const luminance = alphaMap[y * assetWidth + x];
        if (luminance > 0) {
          ctx.fillStyle = `rgb(${luminance}, ${luminance}, ${luminance})`;
          ctx.fillRect(x * zoom, y * zoom, zoom, zoom);
        }
      }
    }

    if (showGrid) {
      ctx.strokeStyle = 'rgba(255,255,255,.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= assetWidth; x++) {
        const px = x * zoom + 0.5;
        ctx.moveTo(px, 0);
        ctx.lineTo(px, viewH);
      }
      for (let y = 0; y <= assetHeight; y++) {
        const py = y * zoom + 0.5;
        ctx.moveTo(0, py);
        ctx.lineTo(viewW, py);
      }
      ctx.stroke();
    }
  }, [alphaMap, showGrid, assetWidth, assetHeight, zoom, viewW, viewH]);

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * assetWidth);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * assetHeight);
    if (x < 0 || x >= assetWidth || y < 0 || y >= assetHeight) {
      setHoverCoord(null);
      return;
    }
    setHoverCoord({ x, y, lum: alphaMap[y * assetWidth + x] });
  };

  return (
    <section className="bg-[#0C0E13] border border-white/[0.08] rounded-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-sm font-semibold text-white">Inspektor Piksel UI — {meta.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Pratinjau detail dan pengukuran aset UI {assetWidth}×{assetHeight} px. Piksel bersifat hanya-baca.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowGrid((value) => !value)} aria-pressed={showGrid}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${showGrid ? 'bg-sky-500/15 text-sky-300 border-sky-400/30' : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:text-white'}`}>
            <Grid3X3 className="w-3.5 h-3.5" /> {showGrid ? 'Sembunyikan kisi' : 'Tampilkan kisi'}
          </button>
          <button type="button" onClick={() => onDownloadAsset(assetId)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-white hover:bg-slate-200 rounded-md transition-colors">
            <Download className="w-3.5 h-3.5" /> Unduh PNG
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col xl:flex-row gap-6 items-start">
        <div className="flex flex-col gap-3 max-w-full overflow-x-auto">
          <div className="p-2 bg-black border border-white/[0.12] rounded-md inline-block self-start">
            <canvas ref={gridCanvasRef} width={viewW} height={viewH}
              onPointerMove={handlePointerMove} onPointerLeave={() => setHoverCoord(null)}
              aria-label={`Pembesaran aset ${meta.name}, ${assetWidth} kali ${assetHeight} piksel`}
              className="block pixelated-canvas"
              style={{ width: `${viewW}px`, height: `${viewH}px` }} />
          </div>
          <div className="text-xs font-mono-tabular text-slate-400 h-4">
            {hoverCoord ? `X:${String(hoverCoord.x).padStart(2, '0')} · Y:${String(hoverCoord.y).padStart(2, '0')} · L:${hoverCoord.lum}` : `${assetWidth} × ${assetHeight} px · Skala ${zoom}× · Hanya-baca`}
          </div>
        </div>

        <div className="flex-1 w-full space-y-5">
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2">Ukuran Asli 1:1 ({assetWidth}×{assetHeight} px)</div>
            <div className="flex items-center gap-4 p-4 rounded-md bg-black border border-white/[0.08]">
              <div className="p-2 border border-dashed border-white/[0.18] bg-black inline-block">
                <UiAssetCanvas assetId={assetId} styleId={styleId} options={options} customPixels={null} scale={1} />
              </div>
              <div className="text-xs text-slate-400 space-y-1"><div className="text-slate-200 font-medium">{meta.group}</div><div>{meta.description}</div></div>
            </div>
          </div>
          <div className="border border-white/[0.08] rounded-md divide-y divide-white/[0.06] bg-[#090A0D]">
            <div className="px-3.5 py-2.5 flex items-center justify-between text-xs"><span className="text-slate-400">Dimensi kanvas</span><span className="font-mono-tabular text-white">{assetWidth} × {assetHeight} px</span></div>
            <div className="px-3.5 py-2.5 flex items-center justify-between text-xs"><span className="text-slate-400">Piksel aktif</span><span className="font-mono-tabular text-white">{metrics.activePixels} / {metrics.totalPixels} px</span></div>
            <div className="px-3.5 py-2.5 flex items-center justify-between text-xs"><span className="text-slate-400">Beban luminansi OLED</span><span className="font-mono-tabular text-white">{metrics.fillPercent}%</span></div>
            <div className="px-3.5 py-2.5 flex items-center justify-between text-xs"><span className="text-slate-400">Bounding box</span><span className="font-mono-tabular text-white">{metrics.boundingBox.width} × {metrics.boundingBox.height} px</span></div>
            <div className="px-3.5 py-2.5 flex items-center justify-between text-xs"><span className="text-slate-400">Palet ekspor</span><span className="font-mono-tabular text-white">#FFFFFF / #000000</span></div>
          </div>
        </div>
      </div>
    </section>
  );
};
