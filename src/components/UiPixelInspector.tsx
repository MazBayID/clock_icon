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
  customPixels: Int16Array | null;
  onChangeCustomPixels: (pixels: Uint8ClampedArray) => void;
  onDownloadAsset: (assetId: UiAssetId) => void;
}

export const UiPixelInspector: React.FC<UiPixelInspectorProps> = ({
  assetId,
  styleId,
  options,
  customPixels,
  onChangeCustomPixels,
  onDownloadAsset,
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [editMode, setEditMode] = useState<'draw' | 'erase'>('draw');
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; lum: number } | null>(null);
  const lastPaintedRef = useRef<string | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const meta = getUiAssetMeta(assetId);
  const assetWidth = options.assetSizes?.[assetId]?.width || meta.width;
  const assetHeight = options.assetSizes?.[assetId]?.height || meta.height;
  const zoom = assetWidth >= 60 ? 6 : assetWidth >= 48 ? 7 : 10;
  const viewW = assetWidth * zoom;
  const viewH = assetHeight * zoom;

  const { alphaMap, metrics } = useMemo(() => {
    const width = options.assetSizes?.[assetId]?.width || meta.width;
    const height = options.assetSizes?.[assetId]?.height || meta.height;
    const canvas = renderUiAssetToCanvas(assetId, styleId, options, null);
    const generated = extractUiAlphaMap(canvas);
    const pixels = new Uint8ClampedArray(generated);
    if (customPixels?.length === width * height) {
      for (let p = 0; p < customPixels.length; p++) {
        if (customPixels[p] >= 0) pixels[p] = customPixels[p];
      }
    }
    const pixelCanvas = document.createElement('canvas');
    pixelCanvas.width = width;
    pixelCanvas.height = height;
    const context = pixelCanvas.getContext('2d')!;
    const image = context.createImageData(width, height);
    for (let p = 0; p < pixels.length; p++) {
      const offset = p * 4;
      image.data[offset] = pixels[p];
      image.data[offset + 1] = pixels[p];
      image.data[offset + 2] = pixels[p];
      image.data[offset + 3] = 255;
    }
    context.putImageData(image, 0, 0);
    return { alphaMap: pixels, metrics: computeUiAssetMetrics(pixelCanvas) as UiAssetMetrics };
  }, [assetId, styleId, options, customPixels, meta.width, meta.height]);

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

  const getPointerPixel = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * assetWidth);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * assetHeight);
    return x >= 0 && x < assetWidth && y >= 0 && y < assetHeight ? { x, y } : null;
  };

  const paintPixel = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.buttons !== 1 && event.type === 'pointermove') return;
    const point = getPointerPixel(event);
    if (!point) return;
    const key = point.x + ':' + point.y;
    if (lastPaintedRef.current === key) return;
    lastPaintedRef.current = key;
    const next = customPixels?.length === assetWidth * assetHeight
      ? new Int16Array(customPixels)
      : new Int16Array(assetWidth * assetHeight).fill(-1);
    next[point.y * assetWidth + point.x] = editMode === 'draw' ? 255 : 0;
    onChangeCustomPixels(next);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getPointerPixel(event);
    if (!point) { setHoverCoord(null); return; }
    setHoverCoord({ ...point, lum: alphaMap[point.y * assetWidth + point.x] });
    if (event.buttons === 1) paintPixel(event);
  };

  const resetPixels = () => {
    onChangeCustomPixels(new Int16Array(assetWidth * assetHeight).fill(-1));
  };

  return (
    <section className="bg-[#0C0E13] border border-white/[0.08] rounded-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-sm font-semibold text-white">Inspektor Piksel UI — {meta.name}</h3>
          <p className="text-xs text-slate-400 mt-0.5">Edit setiap piksel dengan sentuhan atau mouse. Gambar menyalakan piksel, Hapus mematikannya. Perubahan masuk ke preview dan ekspor.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowGrid((value) => !value)} aria-pressed={showGrid}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${showGrid ? 'bg-sky-500/15 text-sky-300 border-sky-400/30' : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:text-white'}`}>
            <Grid3X3 className="w-3.5 h-3.5" /> {showGrid ? 'Sembunyikan kisi' : 'Tampilkan kisi'}
          </button>
          <div className="flex items-center gap-1 rounded-md border border-white/10 p-1">
            <button type="button" onClick={() => setEditMode('draw')} aria-pressed={editMode === 'draw'}
              className={`px-2 py-1 text-xs rounded ${editMode === 'draw' ? 'bg-sky-400 text-slate-950' : 'text-slate-300'}`}>Gambar</button>
            <button type="button" onClick={() => setEditMode('erase')} aria-pressed={editMode === 'erase'}
              className={`px-2 py-1 text-xs rounded ${editMode === 'erase' ? 'bg-sky-400 text-slate-950' : 'text-slate-300'}`}>Hapus</button>
          </div>
          <button type="button" onClick={resetPixels} className="px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/10 rounded-md">Reset Pixel</button>
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
              onPointerDown={(event) => { lastPaintedRef.current = null; event.currentTarget.setPointerCapture(event.pointerId); paintPixel(event); }}
              onPointerMove={handlePointerMove} onPointerUp={() => { lastPaintedRef.current = null; }}
              onPointerLeave={() => setHoverCoord(null)} onContextMenu={(event) => event.preventDefault()}
              aria-label={`Pembesaran aset ${meta.name}, ${assetWidth} kali ${assetHeight} piksel`}
              className="block pixelated-canvas"
              style={{ width: `${viewW}px`, height: `${viewH}px` }} />
          </div>
          <div className="text-xs font-mono-tabular text-slate-400 h-4">
            {hoverCoord ? `X:${String(hoverCoord.x).padStart(2, '0')} · Y:${String(hoverCoord.y).padStart(2, '0')} · L:${hoverCoord.lum}` : `${assetWidth} × ${assetHeight} px · Skala ${zoom}× · Editor pixel`}
          </div>
        </div>

        <div className="flex-1 w-full space-y-5">
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2">Ukuran Asli 1:1 ({assetWidth}×{assetHeight} px)</div>
            <div className="flex items-center gap-4 p-4 rounded-md bg-black border border-white/[0.08]">
              <div className="p-2 border border-dashed border-white/[0.18] bg-black inline-block">
                <UiAssetCanvas assetId={assetId} styleId={styleId} options={options} customPixels={customPixels} scale={1} />
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
