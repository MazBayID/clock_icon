import React, { useEffect, useRef } from 'react';
import { UiAssetId, UiRenderOptions, UiStyleId } from '../types/uiAsset';
import { renderUiAssetToCanvas } from '../engine/uiAssetRenderer';
import { getUiAssetMeta } from '../engine/uiAssetStyles';

interface UiAssetCanvasProps {
  assetId: UiAssetId;
  styleId: UiStyleId;
  options: UiRenderOptions;
  customPixels?: Uint8ClampedArray | null;
  scale?: number;
  className?: string;
}

export const UiAssetCanvas: React.FC<UiAssetCanvasProps> = ({
  assetId,
  styleId,
  options,
  customPixels = null,
  scale = 1,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const meta = getUiAssetMeta(assetId);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    renderUiAssetToCanvas(assetId, styleId, options, customPixels, el);
  }, [assetId, styleId, options, customPixels]);

  return (
    <canvas
      ref={canvasRef}
      width={meta.width}
      height={meta.height}
      style={{
        width: `${Math.round(meta.width * scale)}px`,
        height: `${Math.round(meta.height * scale)}px`,
      }}
      className={`pixelated-canvas block shrink-0 bg-black ${className}`}
    />
  );
};
