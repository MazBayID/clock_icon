import { IconAssetId, IconRenderOptions } from '../model/icons';
import { UiStyleId } from '../model/styles';

interface UiBox {
  w: number;
  h: number;
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  bw: number;
  bh: number;
  cx: number;
  cy: number;
}

function getUiBox(w: number, h: number, padding: number): UiBox {
  const x0 = padding;
  const y0 = padding;
  const x1 = w - padding;
  const y1 = h - padding;
  return {
    w,
    h,
    x0,
    y0,
    x1,
    y1,
    bw: Math.max(8, x1 - x0),
    bh: Math.max(8, y1 - y0),
    cx: w / 2,
    cy: h / 2,
  };
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  pts: [number, number][],
  close = true
) {
  if (pts.length === 0) return;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) {
    ctx.lineTo(pts[i][0], pts[i][1]);
  }
  if (close) ctx.closePath();
}

function drawChamferRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  c: number
) {
  const ch = Math.min(c, w / 3, h / 3);
  drawPolygon(ctx, [
    [x + ch, y],
    [x + w - ch, y],
    [x + w, y + ch],
    [x + w, y + h - ch],
    [x + w - ch, y + h],
    [x + ch, y + h],
    [x, y + h - ch],
    [x, y + ch],
  ]);
}

function drawDiamond(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number
) {
  drawPolygon(ctx, [
    [cx, cy - ry],
    [cx + rx, cy],
    [cx, cy + ry],
    [cx - rx, cy],
  ]);
}

function drawSolderVia(ctx: CanvasRenderingContext2D, x: number, y: number, r = 1.9) {
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.45, 0, Math.PI * 2);
  ctx.fill();
}

function drawCornerBrackets(
  ctx: CanvasRenderingContext2D,
  box: UiBox,
  arm = 4,
  thickness = 1.2
) {
  ctx.fillStyle = '#FFFFFF';
  const x0 = Math.max(0, box.x0 - 0.5);
  const y0 = Math.max(0, box.y0 - 0.5);
  const x1 = Math.min(box.w, box.x1 + 0.5);
  const y1 = Math.min(box.h, box.y1 + 0.5);
  // Top-left
  ctx.fillRect(x0, y0, arm, thickness);
  ctx.fillRect(x0, y0, thickness, arm);
  // Top-right
  ctx.fillRect(x1 - arm, y0, arm, thickness);
  ctx.fillRect(x1 - thickness, y0, thickness, arm);
  // Bottom-left
  ctx.fillRect(x0, y1 - thickness, arm, thickness);
  ctx.fillRect(x0, y1 - arm, thickness, arm);
  // Bottom-right
  ctx.fillRect(x1 - arm, y1 - thickness, arm, thickness);
  ctx.fillRect(x1 - thickness, y1 - arm, thickness, arm);
}

/**
 * Core procedural vector renderer that adapts stroke weight, corner language,
 * fill/carve polarity, slant, and horological/cyberpunk ornaments per UiStyleId.
 */
function renderAssetCore(
  ctx: CanvasRenderingContext2D,
  assetId: IconAssetId,
  styleId: UiStyleId,
  box: UiBox,
  options: IconRenderOptions
) {
  const isSolid =
    styleId === 'neo-solid-pill' ||
    styleId === 'glitch-crt-ui' ||
    styleId === 'oni-brutal-ui';
  const isChamfer =
    styleId === 'aerospace-hud-ui' ||
    styleId === 'circuit-pcb-ui' ||
    styleId === 'oni-brutal-ui' ||
    styleId === 'cyber-katana-ui';
  const isDoubleTrack = styleId === 'obsidian-frame-ui';
  const isHorology = styleId === 'horology-bezel-ui';
  const isPcb = styleId === 'circuit-pcb-ui';
  const isBrutal = styleId === 'oni-brutal-ui';
  const isKatana = styleId === 'cyber-katana-ui';

  const baseSw = isDoubleTrack
    ? 3.1
    : isBrutal
      ? 2.3
      : isHorology
        ? 1.35
        : isPcb
          ? 1.5
          : 1.75;
  const sw = Math.max(1.1, Math.min(3.8, baseSw * options.strokeScale));
  const inset = isBrutal ? 2.5 : isHorology ? 1.5 : 0.8;
  const l = box.x0 + inset;
  const r = box.x1 - inset;
  const t = box.y0 + inset;
  const b = box.y1 - inset;
  const bw = Math.max(6, r - l);
  const bh = Math.max(6, b - t);
  const cx = (l + r) / 2;
  const cy = (t + b) / 2;

  ctx.strokeStyle = '#FFFFFF';
  ctx.fillStyle = '#FFFFFF';
  ctx.lineWidth = sw;
  ctx.lineCap = styleId === 'swiss-precision-ui' || styleId === 'neo-solid-pill' ? 'round' : 'square';
  ctx.lineJoin = isChamfer || isBrutal ? 'miter' : 'round';

  const applyDoubleTrackIfEnabled = (drawPath: () => void) => {
    drawPath();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = sw;
    ctx.stroke();
    if (isDoubleTrack) {
      ctx.save();
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = Math.max(0.85, sw * 0.34);
      ctx.stroke();
      ctx.restore();
    }
  };

  switch (assetId) {
    case 'bluetooth': {
      const mx = cx - 0.5;
      const spanX = bw * 0.36;
      const drawBtPath = () => {
        ctx.beginPath();
        ctx.moveTo(mx - spanX, cy - bh * 0.2);
        ctx.lineTo(mx + spanX, cy + bh * 0.22);
        ctx.lineTo(mx, b);
        ctx.lineTo(mx, t);
        ctx.lineTo(mx + spanX, cy - bh * 0.22);
        ctx.lineTo(mx - spanX, cy + bh * 0.2);
      };
      applyDoubleTrackIfEnabled(drawBtPath);

      if (isPcb) {
        drawSolderVia(ctx, mx, t + 1, 1.5);
        drawSolderVia(ctx, mx, b - 1, 1.5);
        drawSolderVia(ctx, mx + spanX, cy - bh * 0.22, 1.5);
      }
      if (isHorology) {
        drawDiamond(ctx, mx, cy, 1.8, 1.8);
      }
      break;
    }

    case 'wifi': {
      const oy = b - 2.2;
      ctx.fillStyle = '#FFFFFF';
      if (isChamfer || isHorology) {
        drawDiamond(ctx, cx, oy, 2.0, 2.0);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(cx, oy, Math.max(1.8, sw * 0.95), 0, Math.PI * 2);
        ctx.fill();
      }

      const radii = [bw * 0.25, bw * 0.43, bw * 0.61];
      for (const rad of radii) {
        if (isChamfer) {
          applyDoubleTrackIfEnabled(() => {
            ctx.beginPath();
            ctx.moveTo(cx - rad * 0.72, oy - rad * 0.62);
            ctx.lineTo(cx, oy - rad);
            ctx.lineTo(cx + rad * 0.72, oy - rad * 0.62);
          });
        } else {
          applyDoubleTrackIfEnabled(() => {
            ctx.beginPath();
            ctx.arc(cx, oy, rad, -Math.PI * 0.78, -Math.PI * 0.22);
          });
        }
      }
      if (isPcb) {
        drawSolderVia(ctx, cx - radii[2] * 0.72, oy - radii[2] * 0.62, 1.4);
        drawSolderVia(ctx, cx + radii[2] * 0.72, oy - radii[2] * 0.62, 1.4);
      }
      break;
    }

    case 'heart': {
      const topY = t + bh * 0.25;
      const drawHeartPath = () => {
        if (isChamfer) {
          drawPolygon(ctx, [
            [cx, b - 0.5],
            [l, cy - 1.5],
            [l, t + 4],
            [l + bw * 0.25, t],
            [cx, t + bh * 0.24],
            [r - bw * 0.25, t],
            [r, t + 4],
            [r, cy - 1.5],
          ]);
        } else {
          ctx.beginPath();
          ctx.moveTo(cx, b - 0.8);
          ctx.bezierCurveTo(l - 1, cy + 4, l, topY, l + bw * 0.22, t + 1);
          ctx.bezierCurveTo(l + bw * 0.4, t - 0.5, cx, topY - 1, cx, topY + 1.5);
          ctx.bezierCurveTo(cx, topY - 1, r - bw * 0.4, t - 0.5, r - bw * 0.22, t + 1);
          ctx.bezierCurveTo(r, topY, r + 1, cy + 4, cx, b - 0.8);
          ctx.closePath();
        }
      };

      if (isSolid) {
        drawHeartPath();
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        // Negative-space ECG pulse line carved inside the heart
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(l + 3, cy);
        ctx.lineTo(cx - 3.2, cy);
        ctx.lineTo(cx - 1.2, cy - 4.2);
        ctx.lineTo(cx + 1.4, cy + 4);
        ctx.lineTo(cx + 3.2, cy);
        ctx.lineTo(r - 3, cy);
        ctx.stroke();
      } else {
        applyDoubleTrackIfEnabled(drawHeartPath);
        if (isHorology || isPcb) {
          ctx.beginPath();
          ctx.moveTo(cx - 4.5, cy);
          ctx.lineTo(cx - 1.8, cy);
          ctx.lineTo(cx, cy - 3.5);
          ctx.lineTo(cx + 1.8, cy + 3.0);
          ctx.lineTo(cx + 3.4, cy);
          ctx.lineTo(cx + 5, cy);
          ctx.lineWidth = 1.3;
          ctx.strokeStyle = '#FFFFFF';
          ctx.stroke();
        }
        if (isPcb) {
          drawSolderVia(ctx, cx, b - 1.2, 1.5);
        }
      }
      break;
    }

    case 'steps': {
      // Crisp pair of ergonomic footprints (left lower, right slightly higher)
      const drawPrint = (px: number, py: number, w: number, h: number) => {
        if (isChamfer) {
          drawChamferRectPath(ctx, px, py, w, h * 0.62, 2);
          if (isSolid) ctx.fill();
          else ctx.stroke();
          drawChamferRectPath(ctx, px + 0.5, py + h * 0.72, w - 1, h * 0.28, 1.2);
          if (isSolid) ctx.fill();
          else ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.ellipse(px + w / 2, py + h * 0.33, w / 2, h * 0.33, 0, 0, Math.PI * 2);
          if (isSolid) ctx.fill();
          else ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(px + w / 2, py + h * 0.84, w * 0.38, h * 0.16, 0, 0, Math.PI * 2);
          if (isSolid) ctx.fill();
          else ctx.stroke();
        }
      };

      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(1.2, sw * 0.85);
      drawPrint(l + 1.5, t + 4.5, bw * 0.36, bh - 5);
      drawPrint(r - bw * 0.36 - 1.5, t + 0.5, bw * 0.36, bh - 5);
      if (isDoubleTrack) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(l + 3.2, t + 8, 2, 4);
        ctx.fillRect(r - bw * 0.36 + 0.2, t + 4, 2, 4);
      }
      break;
    }

    case 'notification': {
      const bellW = bw * 0.72;
      const bellL = cx - bellW / 2;
      const bellR = cx + bellW / 2;
      const baseY = b - 4.5;

      const drawBellBody = () => {
        if (isChamfer) {
          drawPolygon(ctx, [
            [bellL, baseY],
            [bellL + 2, baseY - 3],
            [bellL + 2.5, t + 5],
            [cx - 3.5, t + 2],
            [cx + 3.5, t + 2],
            [bellR - 2.5, t + 5],
            [bellR - 2, baseY - 3],
            [bellR, baseY],
          ]);
        } else {
          ctx.beginPath();
          ctx.moveTo(bellL, baseY);
          ctx.quadraticCurveTo(bellL + 2, baseY - 3, bellL + 2.2, t + 7.5);
          ctx.arc(cx, t + 7.5, bellW / 2 - 2.2, Math.PI, 0);
          ctx.quadraticCurveTo(bellR - 2, baseY - 3, bellR, baseY);
          ctx.closePath();
        }
      };

      if (isSolid) {
        drawBellBody();
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.fillRect(cx - 1.5, t + 5, 3, 5);
        ctx.fillStyle = '#FFFFFF';
      } else {
        applyDoubleTrackIfEnabled(drawBellBody);
      }

      // Clapper & Top ring
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx, baseY + 2.2, 2.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(cx - 1, t, 2, 2.5);

      // Unread dot badge in top-right (carved outline + bright pip)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(r - 2.2, t + 2.5, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
      if (isChamfer) {
        drawDiamond(ctx, r - 2.2, t + 2.5, 2.3, 2.3);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(r - 2.2, t + 2.5, 2.1, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }

    case 'alarm': {
      const rad = Math.min(bw, bh) * 0.4;
      const clockY = cy + 1.5;

      // Top twin bells / ears
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(1.5, sw);
      ctx.beginPath();
      ctx.moveTo(cx - rad * 0.9, t + 3);
      ctx.lineTo(cx - rad * 0.35, t);
      ctx.moveTo(cx + rad * 0.35, t);
      ctx.lineTo(cx + rad * 0.9, t + 3);
      ctx.stroke();

      // Main dial ring
      applyDoubleTrackIfEnabled(() => {
        if (isChamfer) {
          drawChamferRectPath(ctx, cx - rad, clockY - rad, rad * 2, rad * 2, rad * 0.42);
        } else {
          ctx.beginPath();
          ctx.arc(cx, clockY, rad, 0, Math.PI * 2);
        }
      });

      // Clock hands (10:10 position)
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(1.3, sw * 0.85);
      ctx.beginPath();
      ctx.moveTo(cx, clockY - rad * 0.55);
      ctx.lineTo(cx, clockY);
      ctx.lineTo(cx + rad * 0.48, clockY + rad * 0.25);
      ctx.stroke();

      if (isHorology) {
        for (let a = 0; a < 4; a++) {
          const ang = (a * Math.PI) / 2;
          ctx.fillRect(
            cx + Math.cos(ang) * (rad - 2.2) - 0.6,
            clockY + Math.sin(ang) * (rad - 2.2) - 0.6,
            1.2,
            1.2
          );
        }
      }
      break;
    }

    case 'weather-sun': {
      const coreR = Math.min(bw, bh) * 0.24;
      const drawCore = () => {
        if (isChamfer) {
          drawChamferRectPath(ctx, cx - coreR, cy - coreR, coreR * 2, coreR * 2, coreR * 0.45);
        } else {
          ctx.beginPath();
          ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
        }
      };

      if (isSolid) {
        drawCore();
        ctx.fill();
      } else {
        applyDoubleTrackIfEnabled(drawCore);
      }

      const rayIn = coreR + 2.6;
      const rayOut = Math.min(bw, bh) * 0.48;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(1.3, sw * 0.85);
      for (let i = 0; i < 8; i++) {
        const ang = (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * rayIn, cy + Math.sin(ang) * rayIn);
        ctx.lineTo(cx + Math.cos(ang) * rayOut, cy + Math.sin(ang) * rayOut);
        ctx.stroke();
        if (isPcb && i % 2 === 0) {
          drawSolderVia(
            ctx,
            cx + Math.cos(ang) * rayOut,
            cy + Math.sin(ang) * rayOut,
            1.2
          );
        }
      }
      break;
    }

    case 'weather-moon': {
      const outerR = Math.min(bw, bh) * 0.44;
      // Draw crisp crescent via offscreen mask or compositing
      const tmp = document.createElement('canvas');
      tmp.width = box.w;
      tmp.height = box.h;
      const tctx = tmp.getContext('2d')!;
      tctx.fillStyle = '#FFFFFF';
      if (isChamfer) {
        drawPolygon(tctx, [
          [cx + 1, cy - outerR],
          [cx - outerR * 0.7, cy - outerR * 0.7],
          [cx - outerR, cy],
          [cx - outerR * 0.7, cy + outerR * 0.7],
          [cx + 1, cy + outerR],
          [cx + outerR * 0.65, cy + outerR * 0.65],
          [cx - 1.5, cy + outerR * 0.55],
          [cx - 3.5, cy],
          [cx - 1.5, cy - outerR * 0.55],
          [cx + outerR * 0.65, cy - outerR * 0.65],
        ]);
        tctx.fill();
      } else {
        tctx.beginPath();
        tctx.arc(cx - 1, cy, outerR, 0, Math.PI * 2);
        tctx.fill();
        tctx.globalCompositeOperation = 'destination-out';
        tctx.beginPath();
        tctx.arc(cx + outerR * 0.45, cy - outerR * 0.25, outerR * 0.82, 0, Math.PI * 2);
        tctx.fill();
        tctx.globalCompositeOperation = 'source-over';
        if (!isSolid) {
          // Hollow inner core to make outline crescent
          tctx.globalCompositeOperation = 'destination-out';
          tctx.beginPath();
          tctx.arc(cx - 1, cy, Math.max(2, outerR - sw * 1.1), 0, Math.PI * 2);
          tctx.fill();
          tctx.globalCompositeOperation = 'source-over';
          // Re-stroke arc silhouette
          tctx.strokeStyle = '#FFFFFF';
          tctx.lineWidth = Math.max(1.3, sw * 0.85);
          tctx.beginPath();
          tctx.arc(cx - 1, cy, outerR - 0.6, Math.PI * 0.32, Math.PI * 1.65);
          tctx.stroke();
        }
      }
      ctx.drawImage(tmp, 0, 0);

      // Companion star diamond
      ctx.fillStyle = '#FFFFFF';
      drawDiamond(ctx, r - 3.5, t + 4.5, 2.2, 2.2);
      ctx.fill();
      break;
    }

    case 'ecg-divider': {
      // Horizontal HUD divider + live telemetry waveform (64×20px)
      const midY = cy + 0.5;
      const drawWave = () => {
        ctx.beginPath();
        ctx.moveTo(l + 3, midY);
        ctx.lineTo(cx - 12, midY);
        ctx.lineTo(cx - 8, midY - 3);
        ctx.lineTo(cx - 5, midY + 2);
        ctx.lineTo(cx - 1.5, t + 1.5);
        ctx.lineTo(cx + 2.5, b - 1.5);
        ctx.lineTo(cx + 6, midY - 2);
        ctx.lineTo(cx + 9, midY + 2);
        ctx.lineTo(cx + 12, midY);
        ctx.lineTo(r - 3, midY);
      };
      applyDoubleTrackIfEnabled(drawWave);

      // Left & right end brackets / anchors
      ctx.fillStyle = '#FFFFFF';
      if (isPcb) {
        drawSolderVia(ctx, l + 2, midY, 2.0);
        drawSolderVia(ctx, r - 2, midY, 2.0);
      } else if (isHorology) {
        drawDiamond(ctx, l + 2, midY, 2.2, 2.2);
        ctx.fill();
        drawDiamond(ctx, r - 2, midY, 2.2, 2.2);
        ctx.fill();
      } else {
        ctx.fillRect(l, t + 2, 1.8, bh - 4);
        ctx.fillRect(r - 1.8, t + 2, 1.8, bh - 4);
        ctx.fillRect(l, t + 2, 4, 1.2);
        ctx.fillRect(l, b - 3.2, 4, 1.2);
        ctx.fillRect(r - 4, t + 2, 4, 1.2);
        ctx.fillRect(r - 4, b - 3.2, 4, 1.2);
      }
      break;
    }
  }
}

export function renderIconAsset(
  assetId: IconAssetId,
  styleId: UiStyleId,
  options: IconRenderOptions,
  targetCanvas?: HTMLCanvasElement | null
): HTMLCanvasElement {
  const w = options.width;
  const h = options.height;
  const canvas = targetCanvas ?? document.createElement('canvas');
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D context is unavailable.');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, w, h);
  const box = getUiBox(w, h, options.padding);
  if (styleId === 'cyber-katana-ui') {
    ctx.save();
    ctx.translate(box.cx, box.cy);
    ctx.transform(1, 0, -0.15, 1, 0, 0);
    ctx.translate(-box.cx, -box.cy);
    renderAssetCore(ctx, assetId, styleId, box, options);
    ctx.restore();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(box.x0 + 2, box.y1 - 2);
    ctx.lineTo(box.x0 + 7, box.y1 - 7);
    ctx.stroke();
  } else {
    renderAssetCore(ctx, assetId, styleId, box, rendererOptions);
  }

  if (styleId === 'quantum-dot-ui') {
    const img = ctx.getImageData(0, 0, w, h);
    const src = new Uint8ClampedArray(img.data);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#FFFFFF';
    for (let y = 0; y < h; y += 2) {
      for (let x = 0; x < w; x += 2) {
        let maxLum = 0;
        for (let dy = 0; dy < 2 && y + dy < h; dy++) {
          for (let dx = 0; dx < 2 && x + dx < w; dx++) {
            maxLum = Math.max(maxLum, src[((y + dy) * w + (x + dx)) * 4]);
          }
        }
        if (maxLum >= 90) ctx.fillRect(x, y, 1.35, 1.35);
      }
    }
  } else if (styleId === 'glitch-crt-ui') {
    const tmp = document.createElement('canvas');
    tmp.width = w;
    tmp.height = h;
    tmp.getContext('2d')!.drawImage(canvas, 0, 0);
    const band1Y = Math.round(h * 0.28);
    const band2Y = Math.round(h * 0.64);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, band1Y, w, 3);
    ctx.drawImage(tmp, 0, band1Y, w, 3, 1, band1Y, w, 3);
    ctx.fillRect(0, band2Y, w, 3);
    ctx.drawImage(tmp, 0, band2Y, w, 3, -1, band2Y, w, 3);
    ctx.fillStyle = '#000000';
    for (let y = 3; y < h; y += 4) ctx.fillRect(0, y, w, 1);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(box.x0, box.y0, 2, 1);
    ctx.fillRect(box.x1 - 2, box.y1 - 1, 2, 1);
  } else if (styleId === 'oni-brutal-ui') {
    drawCornerBrackets(ctx, box, 4.5, 1.2);
  } else if (styleId === 'aerospace-hud-ui') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(box.cx - 0.5, 0, 1, 1.5);
    ctx.fillRect(box.cx - 0.5, h - 1.5, 1, 1.5);
  }

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const lum = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
    const finalValue = options.pixelSnap ? (lum >= options.threshold ? 255 : 0) : lum;
    data[i] = finalValue;
    data[i + 1] = finalValue;
    data[i + 2] = finalValue;
    data[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
  return canvas;
}
