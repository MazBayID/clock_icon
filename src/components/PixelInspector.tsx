import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Download, Grid3X3 } from 'lucide-react';
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
  onDownloadGlyph: (char: GlyphChar) => void;
}

const ZOOM = 9;

export const PixelInspector: React.FC<PixelInspectorProps> = ({
  char,
  styleId,
  options,
  onDownloadGlyph,
}) => {
  const [showGrid, setShowGrid] = useState(true);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; lum: number } | null>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const { alphaMap, metrics } = useMemo(() => {
    const canvas = renderGlyphToCanvas(char, styleId, options, null);
    return {
      alphaMap: extractAlphaMap(canvas),
      metrics: computeGlyphMetrics(canvas) as GlyphMetrics,
    };
  }, [char, styleId, options]);

  useEffect(() => {
    const canvas = gridCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const width = GLYPH_WIDTH * ZOOM;
    const height = GLYPH_HEIGHT * ZOOM;
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);

    for (let y = 0; y < GLYPH_HEIGHT; y++) {
      for (let x = 0; x < GLYPH_WIDTH; x++) {
        const luminance = alphaMap[y * GLYPH_WIDTH + x];
        if (luminance > 0) {
          ctx.fillStyle = `rgb(${luminance}, ${luminance}, ${luminance})`;
          ctx.fillRect(x * ZOOM, y * ZOOM, ZOOM, ZOOM);
        }
      }
    }

    if (showGrid) {
      ctx.strokeStyle = 'rgba(255,255,255,.12)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= GLYPH_WIDTH; x++) {
        const px = x * ZOOM + 0.5;
        ctx.moveTo(px, 0);
        ctx.lineTo(px, height);
      }
      for (let y = 0; y <= GLYPH_HEIGHT; y++) {
        const py = y * ZOOM + 0.5;
        ctx.moveTo(0, py);
        ctx.lineTo(width, py);
      }
      ctx.stroke();
    }
  }, [alphaMap, showGrid]);

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.floor(((event.clientX - rect.left) / rect.width) * GLYPH_WIDTH);
    const y = Math.floor(((event.clientY - rect.top) / rect.height) * GLYPH_HEIGHT);
    if (x < 0 || x >= GLYPH_WIDTH || y < 0 || y >= GLYPH_HEIGHT) {
      setHoverCoord(null);
      return;
    }
    setHoverCoord({ x, y, lum: alphaMap[y * GLYPH_WIDTH + x] });
  };

  return (
    <section className="bg-[#0C0E13] border border-white/[0.08] rounded-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-sm font-semibold text-white">Inspektor Piksel — Karakter “{char}”</h3>
          <p className="text-xs text-slate-400 mt-0.5">Pratinjau detail dan pengukuran glif 25×50 px. Piksel bersifat hanya-baca.</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowGrid((value) => !value)}
            aria-pressed={showGrid}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${showGrid ? 'bg-sky-500/15 text-sky-300 border-sky-400/30' : 'bg-white/[0.03] text-slate-400 border-white/[0.08] hover:text-white'}`}>
            <Grid3X3 className="w-3.5 h-3.5" /> {showGrid ? 'Sembunyikan kisi' : 'Tampilkan kisi'}
          </button>
          <button type="button" onClick={() => onDownloadGlyph(char)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-950 bg-white hover:bg-slate-200 rounded-md transition-colors">
            <Download className="w-3.5 h-3.5" /> Unduh PNG
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col xl:flex-row gap-6 items-start">
        <div className="flex flex-col gap-3 max-w-full overflow-x-auto">
          <div className="p-2 bg-black border border-white/[0.12] rounded-md inline-block self-start">
            <canvas ref={gridCanvasRef} width={GLYPH_WIDTH * ZOOM} height={GLYPH_HEIGHT * ZOOM}
              onPointerMove={handlePointerMove} onPointerLeave={() => setHoverCoord(null)}
              aria-label={`Pembesaran glif ${char}, ${GLYPH_WIDTH} kali ${GLYPH_HEIGHT} piksel`}
              className="block pixelated-canvas"
              style={{ width: `${GLYPH_WIDTH * ZOOM}px`, height: `${GLYPH_HEIGHT * ZOOM}px` }} />
          </div>
          <div className="text-xs font-mono-tabular text-slate-400 h-4">
            {hoverCoord ? `X:${String(hoverCoord.x).padStart(2, '0')} · Y:${String(hoverCoord.y).padStart(2, '0')} · L:${hoverCoord.lum}` : '25 × 50 px · Skala 9× · Hanya-baca'}
          </div>
        </div>

        <div className="flex-1 w-full space-y-5">
          <div>
            <div className="text-xs font-medium text-slate-400 mb-2">Ukuran Asli 1:1 (25×50 px)</div>
            <div className="flex items-center gap-4 p-4 rounded-md bg-black border border-white/[0.08]">
              <div className="p-2 border border-dashed border-white/[0.18] bg-black inline-block">
                <GlyphCanvas char={char} styleId={styleId} options={options} customPixels={null} scale={1} />
              </div>
              <div className="text-xs text-slate-400 space-y-1">
                <div className="text-slate-200 font-medium">Pratinjau native OLED</div>
                <div>Dimensi ekspor aktual tepat 25px × 50px.</div>
              </div>
            </div>
          </div>
          <div className="border border-white/[0.08] rounded-md divide-y divide-white/[0.06] bg-[#090A0D]">
            <div className="px-3.5 py-2.5 flex items-center justify-between text-xs"><span className="text-slate-400">Dimensi kanvas</span><span className="font-mono-tabular text-white">25 × 50 px</span></div>
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
