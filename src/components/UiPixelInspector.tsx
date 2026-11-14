import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Eraser, Grid3X3, Paintbrush, RotateCcw } from 'lucide-react';
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
  customPixels?: Uint8ClampedArray | null;
  onUpdateCustomPixels: (assetId: UiAssetId, pixels: Uint8ClampedArray) => void;
  onResetCustomPixels: (assetId: UiAssetId) => void;
  onDownloadAsset: (assetId: UiAssetId) => void;
}

export const UiPixelInspector: React.FC<UiPixelInspectorProps> = ({
  assetId,
  styleId,
  options,
  customPixels,
  onUpdateCustomPixels,
  onResetCustomPixels,
  onDownloadAsset,
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [brushMode, setBrushMode] = useState<'paint' | 'erase'>('paint');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoverCoord, setHoverCoord] = useState<{
    x: number;
    y: number;
    lum: number;
  } | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const meta = getUiAssetMeta(assetId);
  const zoom = meta.width >= 60 ? 6 : meta.width >= 48 ? 7 : 10;
  const viewW = meta.width * zoom;
  const viewH = meta.height * zoom;

  const { alphaMap, metrics } = useMemo(() => {
    const c = renderUiAssetToCanvas(assetId, styleId, options, customPixels);
    return {
      alphaMap: extractUiAlphaMap(c),
      metrics: computeUiAssetMetrics(c) as UiAssetMetrics,
    };
  }, [assetId, styleId, options, customPixels]);

  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, viewW, viewH);

    for (let y = 0; y < meta.height; y++) {
      for (let x = 0; x < meta.width; x++) {
        const lum = alphaMap[y * meta.width + x];
        if (lum > 0) {
          ctx.fillStyle = `rgb(${lum},${lum},${lum})`;
          ctx.fillRect(x * zoom, y * zoom, zoom, zoom);
        }
      }
    }

    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.11)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= meta.width; x++) {
        const px = x * zoom + 0.5;
        ctx.moveTo(px, 0);
        ctx.lineTo(px, viewH);
      }
      for (let y = 0; y <= meta.height; y++) {
        const py = y * zoom + 0.5;
        ctx.moveTo(0, py);
        ctx.lineTo(viewW, py);
      }
      ctx.stroke();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.moveTo(Math.floor(meta.width / 2) * zoom + 0.5, 0);
      ctx.lineTo(Math.floor(meta.width / 2) * zoom + 0.5, viewH);
      ctx.moveTo(0, Math.floor(meta.height / 2) * zoom + 0.5);
      ctx.lineTo(viewW, Math.floor(meta.height / 2) * zoom + 0.5);
      ctx.stroke();
    }
  }, [alphaMap, showGrid, meta.width, meta.height, zoom, viewW, viewH]);

  const applyPixelAtEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * meta.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * meta.height);
    if (x < 0 || x >= meta.width || y < 0 || y >= meta.height) return;

    const next = new Uint8ClampedArray(alphaMap);
    const targetVal = brushMode === 'paint' ? 255 : 0;
    const idx = y * meta.width + x;
    setHoverCoord({ x, y, lum: targetVal });
    if (next[idx] !== targetVal) {
      next[idx] = targetVal;
      onUpdateCustomPixels(assetId, next);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * meta.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * meta.height);
    if (x >= 0 && x < meta.width && y >= 0 && y < meta.height) {
      setHoverCoord({ x, y, lum: alphaMap[y * meta.width + x] });
    }
    if (isDrawing) {
      applyPixelAtEvent(e);
    }
  };

  return (
    <div className="bg-[#0C0E13] border border-white/[0.08] rounded-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Inspektor &amp; Editor Piksel UI — {meta.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Klik atau seret pada kisi {meta.width}×{meta.height} px untuk menyempurnakan piksel aset UI.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {customPixels && (
            <button
              type="button"
              onClick={() => onResetCustomPixels(assetId)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Kembalikan Vektor
            </button>
          )}
          <button
            type="button"
            onClick={() => onDownloadAsset(assetId)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-white hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Unduh {assetId}.png
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col xl:flex-row gap-6 items-start">
        <div className="flex flex-col gap-3 max-w-full overflow-x-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 p-0.5 rounded-md bg-black border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setBrushMode('paint')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  brushMode === 'paint'
                    ? 'bg-white text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Paintbrush className="w-3.5 h-3.5" />
                Putih
              </button>
              <button
                type="button"
                onClick={() => setBrushMode('erase')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                  brushMode === 'erase'
                    ? 'bg-white text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                Hitam
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowGrid((g) => !g)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded border transition-colors whitespace-nowrap cursor-pointer ${
                showGrid
                  ? 'bg-sky-500/15 text-sky-300 border-sky-400/30'
                  : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:text-white'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              Kisi 1px
            </button>
          </div>

          <div className="p-2 bg-black border border-white/[0.12] rounded-md inline-block self-start">
            <canvas
              ref={gridCanvasRef}
              width={viewW}
              height={viewH}
              onPointerDown={(e) => {
                setIsDrawing(true);
                e.currentTarget.setPointerCapture(e.pointerId);
                applyPixelAtEvent(e);
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={() => setIsDrawing(false)}
              onPointerLeave={() => {
                setIsDrawing(false);
                setHoverCoord(null);
              }}
              className="block cursor-crosshair touch-none"
              style={{
                width: `${viewW}px`,
                height: `${viewH}px`,
              }}
            />
          </div>

          <div className="text-xs font-mono-tabular text-slate-400 h-4">
            {hoverCoord ? (
              <span>
                X:{hoverCoord.x.toString().padStart(2, '0')} · Y:
                {hoverCoord.y.toString().padStart(2, '0')} · L:{hoverCoord.lum}
              </span>
            ) : (
              <span>
                {meta.width} × {meta.height} px · Skala {zoom}×
              </span>
            )}
          </div>
        </div>

        <div className="flex-1 w-full space-y-5">
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2">
              Ukuran Asli 1:1 ({meta.width}×{meta.height} px)
            </div>
            <div className="flex items-center gap-4 p-4 rounded-md bg-black border border-white/[0.08]">
              <div className="p-2 border border-dashed border-white/[0.18] bg-black inline-block">
                <UiAssetCanvas
                  assetId={assetId}
                  styleId={styleId}
                  options={options}
                  customPixels={customPixels}
                  scale={1}
                />
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="text-slate-200 font-medium">{meta.group}</div>
                <div>{meta.description}</div>
              </div>
            </div>
          </div>

          <div className="border border-white/[0.08] rounded-md divide-y divide-white/[0.06] bg-[#090A0D]">
            <div className="px-3.5 py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Dimensi Kanvas</span>
              <span className="font-mono-tabular text-white font-medium">
                {meta.width} × {meta.height} px
              </span>
            </div>
            <div className="px-3.5 py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Piksel Aktif (Putih)</span>
              <span className="font-mono-tabular text-white font-medium">
                {metrics.activePixels} / {metrics.totalPixels} px
              </span>
            </div>
            <div className="px-3.5 py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Beban Luminansi OLED</span>
              <span className="font-mono-tabular text-white font-medium">
                {metrics.fillPercent}%
              </span>
            </div>
            <div className="px-3.5 py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Bounding Box Konten</span>
              <span className="font-mono-tabular text-white font-medium">
                {metrics.boundingBox.width} × {metrics.boundingBox.height} px
              </span>
            </div>
            <div className="px-3.5 py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Palet Ekspor</span>
              <span className="font-mono-tabular text-white font-medium">
                #FFFFFF / #000000
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
