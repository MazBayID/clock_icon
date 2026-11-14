import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Eraser, Grid3X3, Paintbrush, RotateCcw } from 'lucide-react';
import {
  GLYPH_HEIGHT,
  GLYPH_WIDTH,
  GlyphChar,
  GlyphMetrics,
  GlyphRenderOptions,
  StyleId,
} from '../types/glyph';
import {
  computeGlyphMetrics,
  extractAlphaMap,
  renderGlyphToCanvas,
} from '../engine/glyphRenderer';
import { GlyphCanvas } from './GlyphCanvas';

interface PixelInspectorProps {
  char: GlyphChar;
  styleId: StyleId;
  options: GlyphRenderOptions;
  customPixels?: Uint8ClampedArray | null;
  onUpdateCustomPixels: (char: GlyphChar, pixels: Uint8ClampedArray) => void;
  onResetCustomPixels: (char: GlyphChar) => void;
  onDownloadGlyph: (char: GlyphChar) => void;
}

const ZOOM = 9; // 25*9 = 225px, 50*9 = 450px

export const PixelInspector: React.FC<PixelInspectorProps> = ({
  char,
  styleId,
  options,
  customPixels,
  onUpdateCustomPixels,
  onResetCustomPixels,
  onDownloadGlyph,
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [brushMode, setBrushMode] = useState<'paint' | 'erase'>('paint');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; lum: number } | null>(
    null
  );
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compute current 25x50 pixel buffer & metrics
  const { alphaMap, metrics } = useMemo(() => {
    const c = renderGlyphToCanvas(char, styleId, options, customPixels);
    return {
      alphaMap: extractAlphaMap(c),
      metrics: computeGlyphMetrics(c) as GlyphMetrics,
    };
  }, [char, styleId, options, customPixels]);

  // Draw zoomed 25x50 pixel grid onto inspector canvas
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const w = GLYPH_WIDTH * ZOOM;
    const h = GLYPH_HEIGHT * ZOOM;

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);

    for (let y = 0; y < GLYPH_HEIGHT; y++) {
      for (let x = 0; x < GLYPH_WIDTH; x++) {
        const lum = alphaMap[y * GLYPH_WIDTH + x];
        if (lum > 0) {
          ctx.fillStyle = `rgb(${lum},${lum},${lum})`;
          ctx.fillRect(x * ZOOM, y * ZOOM, ZOOM, ZOOM);
        }
      }
    }

    if (showGrid) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.11)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= GLYPH_WIDTH; x++) {
        const px = x * ZOOM + 0.5;
        ctx.moveTo(px, 0);
        ctx.lineTo(px, h);
      }
      for (let y = 0; y <= GLYPH_HEIGHT; y++) {
        const py = y * ZOOM + 0.5;
        ctx.moveTo(0, py);
        ctx.lineTo(w, py);
      }
      ctx.stroke();

      // Center axes crosshair guide
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.moveTo(Math.floor(GLYPH_WIDTH / 2) * ZOOM + 0.5, 0);
      ctx.lineTo(Math.floor(GLYPH_WIDTH / 2) * ZOOM + 0.5, h);
      ctx.moveTo(0, (GLYPH_HEIGHT / 2) * ZOOM + 0.5);
      ctx.lineTo(w, (GLYPH_HEIGHT / 2) * ZOOM + 0.5);
      ctx.stroke();
    }
  }, [alphaMap, showGrid]);

  const applyPixelAtEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * GLYPH_WIDTH);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * GLYPH_HEIGHT);
    if (x < 0 || x >= GLYPH_WIDTH || y < 0 || y >= GLYPH_HEIGHT) return;

    const next = new Uint8ClampedArray(alphaMap);
    const targetVal = brushMode === 'paint' ? 255 : 0;
    const idx = y * GLYPH_WIDTH + x;
    setHoverCoord({ x, y, lum: targetVal });
    if (next[idx] !== targetVal) {
      next[idx] = targetVal;
      onUpdateCustomPixels(char, next);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * GLYPH_WIDTH);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * GLYPH_HEIGHT);
    if (x >= 0 && x < GLYPH_WIDTH && y >= 0 && y < GLYPH_HEIGHT) {
      setHoverCoord({ x, y, lum: alphaMap[y * GLYPH_WIDTH + x] });
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
            Inspektor & Editor Piksel — Karakter “{char}”
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Klik atau seret pada kisi 25×50 untuk menyempurnakan piksel secara manual.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {customPixels && (
            <button
              type="button"
              onClick={() => onResetCustomPixels(char)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 rounded-md transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Kembalikan Vektor
            </button>
          )}
          <button
            type="button"
            onClick={() => onDownloadGlyph(char)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-white hover:bg-slate-200 rounded-md transition-colors whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Unduh {char === ':' ? 'colon.png' : `${char}.png`}
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col xl:flex-row gap-6 items-start">
        {/* Zoomed Interactive 25x50 Canvas */}
        <div className="flex flex-col gap-3">
          {/* Toolbar */}
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
              width={GLYPH_WIDTH * ZOOM}
              height={GLYPH_HEIGHT * ZOOM}
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
                width: `${GLYPH_WIDTH * ZOOM}px`,
                height: `${GLYPH_HEIGHT * ZOOM}px`,
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
              <span>25 × 50 px · Skala 9×</span>
            )}
          </div>
        </div>

        {/* Right Side: 1:1 Native Scale & Telemetry */}
        <div className="flex-1 w-full space-y-5">
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2">
              Ukuran Asli 1:1 (25×50 px)
            </div>
            <div className="flex items-center gap-4 p-4 rounded-md bg-black border border-white/[0.08]">
              <div className="p-2 border border-dashed border-white/[0.18] bg-black inline-block">
                <GlyphCanvas
                  char={char}
                  styleId={styleId}
                  options={options}
                  customPixels={customPixels}
                  scale={1}
                />
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="text-slate-200 font-medium">
                  Pratinjau 100% Native OLED
                </div>
                <div>Dimensi ekspor aktual tepat 25px lebar × 50px tinggi.</div>
              </div>
            </div>
          </div>

          {/* Metrics Table */}
          <div className="border border-white/[0.08] rounded-md divide-y divide-white/[0.06] bg-[#090A0D]">
            <div className="px-3.5 py-2.5 flex items-center justify-between text-xs">
              <span className="text-slate-400">Dimensi Kanvas</span>
              <span className="font-mono-tabular text-white font-medium">
                25 × 50 px
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
