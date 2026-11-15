import {
  UiAssetId,
  UiAssetMetrics,
  UiRenderOptions,
  UiStyleId,
} from '../types/uiAsset';
import { getUiAssetMeta } from './uiAssetStyles';

export const DEFAULT_UI_RENDER_OPTIONS: UiRenderOptions = {
  strokeScale: 1.0,
  padding: 1,
  pixelSnap: false,
  threshold: 128,
  batteryLevel: 80,
  signalLevel: 3,
  wifiLevel: 3,
  progressPercent: 72,
  progressBarPercent: 65,
};

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
  assetId: UiAssetId,
  styleId: UiStyleId,
  box: UiBox,
  options: UiRenderOptions
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
    case 'battery': {
      const capW = 2.6;
      const shellW = bw - capW - 1.2;
      const shellH = Math.min(bh, 14);
      const sy = cy - shellH / 2;
      const corner = isChamfer ? 2.8 : styleId === 'swiss-precision-ui' ? 3 : 1.5;

      // Positive terminal tip
      const capH = Math.max(4, shellH * 0.45);
      ctx.fillStyle = '#FFFFFF';
      if (isKatana) {
        drawPolygon(ctx, [
          [l + shellW + 1, cy - capH / 2],
          [l + shellW + capW + 1.5, cy - capH / 2],
          [l + shellW + capW + 0.5, cy + capH / 2],
          [l + shellW + 1, cy + capH / 2],
        ]);
        ctx.fill();
      } else {
        ctx.fillRect(l + shellW + 1, cy - capH / 2, capW, capH);
      }

      if (isSolid) {
        if (isChamfer) {
          drawChamferRectPath(ctx, l, sy, shellW, shellH, corner);
        } else {
          ctx.beginPath();
          ctx.roundRect(l, sy, shellW, shellH, corner);
        }
        ctx.fill();
        // Carve hollow interior frame, leaving bars based on batteryLevel
        const pad = 2.0;
        ctx.fillStyle = '#000000';
        ctx.fillRect(l + pad, sy + pad, shellW - pad * 2, shellH - pad * 2);

        const maxBars = 4;
        const activeBars = Math.max(0, Math.round((options.batteryLevel / 100) * maxBars));
        const innerW = shellW - pad * 2 - 2;
        const barW = (innerW - (maxBars - 1) * 1.4) / maxBars;
        ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < activeBars; i++) {
          const bx = l + pad + 1 + i * (barW + 1.4);
          if (isKatana) {
            drawPolygon(ctx, [
              [bx + 1, sy + pad + 1],
              [bx + barW + 1, sy + pad + 1],
              [bx + barW - 0.5, sy + shellH - pad - 1],
              [bx - 0.5, sy + shellH - pad - 1],
            ]);
            ctx.fill();
          } else {
            ctx.fillRect(bx, sy + pad + 1, barW, shellH - pad * 2 - 2);
          }
        }
      } else {
        applyDoubleTrackIfEnabled(() => {
          if (isChamfer) {
            drawChamferRectPath(ctx, l + sw / 2, sy + sw / 2, shellW - sw, shellH - sw, corner);
          } else {
            ctx.beginPath();
            ctx.roundRect(l + sw / 2, sy + sw / 2, shellW - sw, shellH - sw, corner);
          }
        });

        const fillRatio = Math.max(0, Math.min(1, options.batteryLevel / 100));
        const innerX = l + sw + 1.4;
        const innerY = sy + sw + 1.4;
        const innerW = Math.max(4, shellW - sw * 2 - 2.8);
        const innerH = Math.max(3, shellH - sw * 2 - 2.8);

        ctx.fillStyle = '#FFFFFF';
        if (isHorology) {
          // Segmented diamond/bar cells inside horology shell
          const segs = 4;
          const activeSegs = Math.max(1, Math.round(fillRatio * segs));
          const segW = (innerW - (segs - 1) * 1.5) / segs;
          for (let i = 0; i < activeSegs; i++) {
            ctx.fillRect(innerX + i * (segW + 1.5), innerY, segW, innerH);
          }
        } else {
          ctx.fillRect(innerX, innerY, innerW * fillRatio, innerH);
        }

        if (isPcb) {
          drawSolderVia(ctx, l + 1, cy, 1.5);
        }
      }
      break;
    }

    case 'signal': {
      const bars = 3;
      const gap = 2.0;
      const barW = (bw - gap * (bars - 1)) / bars;
      const level = Math.max(0, Math.min(3, Math.round(options.signalLevel)));

      for (let i = 0; i < bars; i++) {
        const hRatio = (i + 1) / bars;
        const barH = Math.max(4, bh * (0.28 + 0.72 * hRatio));
        const bx = l + i * (barW + gap);
        const by = b - barH;

        if (level === 0 && i === 0) {
          // At zero signal, replace the first bar with a clear X indicator.
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = Math.max(1, Math.min(1.6, sw));
          ctx.beginPath();
          ctx.moveTo(bx + barW * 0.22, by + barH * 0.28);
          ctx.lineTo(bx + barW * 0.78, by + barH * 0.72);
          ctx.moveTo(bx + barW * 0.78, by + barH * 0.28);
          ctx.lineTo(bx + barW * 0.22, by + barH * 0.72);
          ctx.stroke();
          continue;
        }

        const lit = i < level;
        if (lit) {
          ctx.fillStyle = '#FFFFFF';
          if (isChamfer) {
            drawPolygon(ctx, [
              [bx + 1.2, by],
              [bx + barW, by],
              [bx + barW, b],
              [bx, b],
              [bx, by + 1.2],
            ]);
            ctx.fill();
          } else {
            ctx.beginPath();
            ctx.roundRect(bx, by, barW, barH, styleId === 'swiss-precision-ui' ? 1.2 : 0.4);
            ctx.fill();
          }
          if (isDoubleTrack && barW >= 3) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(bx + 1, by + 1.5, Math.max(0.8, barW - 2), Math.max(1, barH - 3));
          }
          if (isPcb) drawSolderVia(ctx, bx + barW / 2, by + 1.2, 1.3);
        } else {
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = 1.0;
          ctx.strokeRect(bx + 0.5, by + 0.5, barW - 1, barH - 1);
        }
      }
      break;
    }

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

    case 'wifi-static':
    case 'wifi-meter': {
      const dynamicMeter = assetId === 'wifi-meter';
      const level = dynamicMeter ? Math.max(0, Math.min(3, Math.round(options.wifiLevel))) : 3;
      const oy = b - 2.2;
      ctx.fillStyle = '#FFFFFF';
      if (dynamicMeter && level === 0) {
        // At zero Wi-Fi strength, replace the center dot with an X.
        const mark = Math.max(2.2, sw * 1.15);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = Math.max(1, Math.min(1.6, sw));
        ctx.beginPath();
        ctx.moveTo(cx - mark, oy - mark);
        ctx.lineTo(cx + mark, oy + mark);
        ctx.moveTo(cx + mark, oy - mark);
        ctx.lineTo(cx - mark, oy + mark);
        ctx.stroke();
        break;
      }
      if (isChamfer || isHorology) { drawDiamond(ctx, cx, oy, 2.0, 2.0); ctx.fill(); }
      else { ctx.beginPath(); ctx.arc(cx, oy, Math.max(1.8, sw * 0.95), 0, Math.PI * 2); ctx.fill(); }
      const radii = [bw * 0.30, bw * 0.52];
      for (let index = 0; index < radii.length; index++) {
        if (dynamicMeter && index >= level - 1) continue;
        const rad = radii[index];
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

    case 'heart-static':
    case 'heart-dynamic': {
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

    case 'progress-arc': {
      const rad = Math.max(1, Math.min(bw, bh) * 0.43);
      const startAngle = -Math.PI / 2;
      const pct = Math.max(0, Math.min(1, options.progressPercent / 100));
      const endAngle = startAngle + Math.PI * 2 * pct;

      // Subtle background track (dotted / hairline depending on style)
      if (isChamfer) {
        ctx.strokeStyle = 'rgba(255,255,255,0.28)';
        ctx.lineWidth = 1.1;
        drawChamferRectPath(ctx, cx - rad, cy - rad, rad * 2, rad * 2, rad * 0.42);
        ctx.stroke();
      } else {
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([2, 3]);
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // Active arc / segmented gauge
      if (isHorology) {
        // 12 precision watch ticks around perimeter + active inner ring
        for (let i = 0; i < 12; i++) {
          const a = -Math.PI / 2 + (i / 12) * Math.PI * 2;
          const isLit = i / 12 <= pct;
          ctx.strokeStyle = isLit ? '#FFFFFF' : 'rgba(255,255,255,0.3)';
          ctx.lineWidth = i % 3 === 0 ? 1.8 : 1.1;
          ctx.beginPath();
          const tickInnerRadius = Math.max(rad * 0.55, rad - 3.5);
          const tickOuterRadius = rad + Math.min(1.5, rad * 0.2);
          ctx.moveTo(cx + Math.cos(a) * tickInnerRadius, cy + Math.sin(a) * tickInnerRadius);
          ctx.lineTo(cx + Math.cos(a) * tickOuterRadius, cy + Math.sin(a) * tickOuterRadius);
          ctx.stroke();
        }
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(cx, cy, Math.max(0.5, rad - 6.5), startAngle, endAngle);
        ctx.stroke();
      } else if (isBrutal || isChamfer) {
        const segs = 12;
        const litSegs = Math.max(0, Math.round(pct * segs));
        for (let i = 0; i < litSegs; i++) {
          const a0 = -Math.PI / 2 + (i / segs) * Math.PI * 2 + 0.06;
          const a1 = -Math.PI / 2 + ((i + 1) / segs) * Math.PI * 2 - 0.06;
          ctx.strokeStyle = '#FFFFFF';
          ctx.lineWidth = isBrutal ? 4.4 : 3.4;
          ctx.beginPath();
          ctx.arc(cx, cy, rad - 1.5, a0, a1);
          ctx.stroke();
        }
      } else {
        const ringW = isSolid ? 4.5 : Math.max(2.6, sw * 1.45);
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = ringW;
        ctx.lineCap = styleId === 'swiss-precision-ui' || isSolid ? 'round' : 'butt';
        ctx.beginPath();
        ctx.arc(cx, cy, rad - 1, startAngle, endAngle);
        ctx.stroke();
        if (isDoubleTrack) {
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(cx, cy, rad - 1, startAngle, endAngle);
          ctx.stroke();
        }
        if (isPcb) {
          drawSolderVia(ctx, cx + Math.cos(endAngle) * (rad - 1), cy + Math.sin(endAngle) * (rad - 1), 2.3);
        }
      }

      // Center indicator dot / crosshair
      ctx.fillStyle = '#FFFFFF';
      if (isHorology || isChamfer) {
        drawDiamond(ctx, cx, cy, 2.4, 2.4);
        ctx.fill();
      } else {
        ctx.fillRect(cx - 3.5, cy - 0.8, 7, 1.6);
        ctx.fillRect(cx - 0.8, cy - 3.5, 1.6, 7);
      }
      break;
    }

    case 'progress-bar': {
      const pct = Math.max(0, Math.min(1, options.progressBarPercent / 100));
      // Use the real canvas height here; the shared icon box has a minimum
      // geometry size that is unsuitable for a 2px-tall pixel progress bar.
      const availableBarH = Math.max(1, box.h - options.padding * 2);
      const barH = options.pixelSnap
        ? Math.max(1, Math.min(10, availableBarH))
        : Math.max(4, Math.min(10, bh * 0.58));
      const barY = Math.round((box.h - barH) / 2);
      const radius = Math.min(3, barH / 2);

      if (options.pixelSnap && barH <= 2) {
        // At 1–2px height, render a crisp filled track without an impossible
        // inner outline. The fill remains proportional and pixel-aligned.
        const trackY = Math.round((box.h - 1) / 2);
        ctx.fillStyle = '#FFFFFF';
        for (let x = Math.round(l); x < Math.round(r); x += 2) {
          ctx.fillRect(x, trackY, 1, 1);
        }
        const fillWidth = Math.round(Math.max(0, r - l) * pct);
        if (fillWidth > 0) ctx.fillRect(Math.round(l), trackY, fillWidth, 1);
        break;
      }

      if (isSolid) {
        if (isChamfer) {
          drawChamferRectPath(ctx, l, barY, bw, barH, radius);
        } else {
          ctx.beginPath();
          ctx.roundRect(l, barY, bw, barH, radius);
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.fillRect(l + 1.5, barY + 1.5, Math.max(0, bw - 3), Math.max(1, barH - 3));
      } else {
        ctx.strokeStyle = 'rgba(255,255,255,0.38)';
        ctx.lineWidth = 1;
        if (isChamfer) {
          drawChamferRectPath(ctx, l + 0.5, barY + 0.5, bw - 1, barH - 1, radius);
        } else {
          ctx.beginPath();
          ctx.roundRect(l + 0.5, barY + 0.5, bw - 1, barH - 1, radius);
        }
        ctx.stroke();
      }

      const innerX = l + 1.5;
      const innerY = barY + 1.5;
      const innerW = Math.max(0, (bw - 3) * pct);
      const innerH = Math.max(1, barH - 3);
      if (innerW > 0) {
        ctx.fillStyle = '#FFFFFF';
        if (isChamfer && innerW >= 4) {
          drawChamferRectPath(ctx, innerX, innerY, innerW, innerH, Math.min(2, innerH / 2));
          ctx.fill();
        } else {
          ctx.fillRect(innerX, innerY, innerW, innerH);
        }
      }
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

/**
 * Fits the rendered glyph to the available canvas area without distorting
 * its aspect ratio. This is applied to generated vector assets only;
 * imported/custom pixel maps retain their exact pixel placement.
 */
function fitRenderedContentToCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  padding: number,
  pixelSnap: boolean
) {
  const { width, height } = canvas;
  const image = ctx.getImageData(0, 0, width, height);
  const data = image.data;

  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      if (data[index] > 0 || data[index + 1] > 0 || data[index + 2] > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // Empty canvases need no fitting.
  if (maxX < minX || maxY < minY) return;

  const contentWidth = maxX - minX + 1;
  const contentHeight = maxY - minY + 1;
  const safePadding = Math.max(
    0,
    Math.min(Math.round(padding), Math.floor((Math.min(width, height) - 1) / 2))
  );
  const availableWidth = Math.max(1, width - safePadding * 2);
  const availableHeight = Math.max(1, height - safePadding * 2);
  const scale = Math.min(
    availableWidth / contentWidth,
    availableHeight / contentHeight
  );

  // Avoid resampling when the content already fits at native resolution.
  if (Math.abs(scale - 1) < 0.001) return;

  const fittedWidth = contentWidth * scale;
  const fittedHeight = contentHeight * scale;
  const destinationX = (width - fittedWidth) / 2;
  const destinationY = (height - fittedHeight) / 2;

  const source = document.createElement('canvas');
  source.width = width;
  source.height = height;
  source.getContext('2d')!.putImageData(image, 0, 0);

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);
  ctx.save();
  ctx.imageSmoothingEnabled = !pixelSnap;
  ctx.drawImage(
    source,
    minX,
    minY,
    contentWidth,
    contentHeight,
    destinationX,
    destinationY,
    fittedWidth,
    fittedHeight
  );
  ctx.restore();
}

export function renderUiAssetToCanvas(
  assetId: UiAssetId,
  styleId: UiStyleId,
  options: UiRenderOptions,
  customAlphaMap?: Uint8ClampedArray | null,
  targetCanvas?: HTMLCanvasElement | null
): HTMLCanvasElement {
  const meta = getUiAssetMeta(assetId);
  const customSize = options.assetSizes?.[assetId];
  const w = Math.max(8, Math.min(256, Math.round(customSize?.width || meta.width)));
  const minHeight = assetId === 'progress-bar' ? 2 : 8;
  const h = Math.max(minHeight, Math.min(256, Math.round(customSize?.height || meta.height)));

  const canvas = targetCanvas ?? document.createElement('canvas');
  if (canvas.width !== w) canvas.width = w;
  if (canvas.height !== h) canvas.height = h;

  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  if (customAlphaMap && customAlphaMap.length === w * h) {
    const img = ctx.createImageData(w, h);
    const data = img.data;
    for (let i = 0; i < customAlphaMap.length; i++) {
      const v = customAlphaMap[i];
      const idx = i * 4;
      data[idx] = v;
      data[idx + 1] = v;
      data[idx + 2] = v;
      data[idx + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    return canvas;
  }

  // Strict pure #000000 background
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

    // Carve clean diagonal katana slash across larger widgets
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(box.x0 + 2, box.y1 - 2);
    ctx.lineTo(box.x0 + 7, box.y1 - 7);
    ctx.stroke();
  } else {
    renderAssetCore(ctx, assetId, styleId, box, options);
  }

  // Style-specific post-processing treatments
  if (styleId === 'quantum-dot-ui') {
    const img = ctx.getImageData(0, 0, w, h);
    const src = new Uint8ClampedArray(img.data);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#FFFFFF';
    const step = 2;
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        // Sample 2x2 neighborhood brightness
        let maxLum = 0;
        for (let dy = 0; dy < step && y + dy < h; dy++) {
          for (let dx = 0; dx < step && x + dx < w; dx++) {
            const l = src[((y + dy) * w + (x + dx)) * 4];
            if (l > maxLum) maxLum = l;
          }
        }
        if (maxLum >= 90) {
          ctx.fillRect(x, y, 1.35, 1.35);
        }
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

    // 1px CRT scanlines
    ctx.fillStyle = '#000000';
    for (let y = 3; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1);
    }
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(box.x0, box.y0, 2, 1);
    ctx.fillRect(box.x1 - 2, box.y1 - 1, 2, 1);
  } else if (styleId === 'oni-brutal-ui') {
    drawCornerBrackets(ctx, box, assetId === 'progress-arc' ? 7 : 4.5, 1.2);
  } else if (styleId === 'aerospace-hud-ui' && assetId !== 'ecg-divider') {
    // Crisp aerospace reticle micro-ticks at vertical axis
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(box.cx - 0.5, 0, 1, 1.5);
    ctx.fillRect(box.cx - 0.5, h - 1.5, 1, 1.5);
  }

  // Fit the complete generated icon inside the target canvas before final
  // luminance quantization, keeping its aspect ratio and configured padding.
  // Dynamic Wi-Fi levels intentionally change the occupied bounds as arcs
  // disappear. Fitting each frame independently would enlarge the dot.
  const isTinySharpProgressBar = assetId === 'progress-bar' && options.pixelSnap && h <= 2;
  if (assetId !== 'wifi-meter' && !isTinySharpProgressBar) {
    fitRenderedContentToCanvas(canvas, ctx, options.padding, options.pixelSnap);
  }

  // Enforce strict neutral grayscale luminance & optional 1-bit pixel snap
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]);
    const finalVal = options.pixelSnap ? (lum >= options.threshold ? 255 : 0) : lum;
    d[i] = finalVal;
    d[i + 1] = finalVal;
    d[i + 2] = finalVal;
    d[i + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);

  return canvas;
}

export function extractUiAlphaMap(canvas: HTMLCanvasElement): Uint8ClampedArray {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const out = new Uint8ClampedArray(canvas.width * canvas.height);
  for (let i = 0; i < out.length; i++) {
    out[i] = img.data[i * 4];
  }
  return out;
}

export function computeUiAssetMetrics(canvas: HTMLCanvasElement): UiAssetMetrics {
  const w = canvas.width;
  const h = canvas.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const d = ctx.getImageData(0, 0, w, h).data;
  let activePixels = 0;
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const val = d[(y * w + x) * 4];
      if (val >= 128) {
        activePixels++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const totalPixels = w * h;
  return {
    activePixels,
    totalPixels,
    fillPercent: Math.round((activePixels / totalPixels) * 1000) / 10,
    boundingBox:
      maxX >= minX
        ? {
            minX,
            minY,
            maxX,
            maxY,
            width: maxX - minX + 1,
            height: maxY - minY + 1,
          }
        : { minX: 0, minY: 0, maxX: 0, maxY: 0, width: 0, height: 0 },
  };
}
