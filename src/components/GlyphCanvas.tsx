import React, { useEffect, useRef } from 'react';
import {
  GLYPH_HEIGHT,
  GLYPH_WIDTH,
  GlyphChar,
  GlyphRenderOptions,
  StyleId,
} from '../types/glyph';
import { renderGlyphToCanvas } from '../engine/glyphRenderer';

interface GlyphCanvasProps {
  char: GlyphChar;
  styleId: StyleId;
  options: GlyphRenderOptions;
  customPixels?: Uint8ClampedArray | null;
  scale?: number;
  className?: string;
}

export const GlyphCanvas: React.FC<GlyphCanvasProps> = ({
  char,
  styleId,
  options,
  customPixels,
  scale = 2,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    renderGlyphToCanvas(char, styleId, options, customPixels, canvasRef.current);
  }, [char, styleId, options, customPixels]);

  return (
    <canvas
      ref={canvasRef}
      width={GLYPH_WIDTH}
      height={GLYPH_HEIGHT}
      style={{
        width: `${GLYPH_WIDTH * scale}px`,
        height: `${GLYPH_HEIGHT * scale}px`,
      }}
      className={`pixelated-canvas block bg-black ${className}`}
      aria-label={`Angka ${char === ':' ? 'titik dua' : char} ukuran 25x48 piksel`}
    />
  );
};
