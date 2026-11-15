import { getProgressRatio, normalizeProgressConfig, ProgressAssetConfig } from '../model/progress';

const WHITE = '#FFFFFF';
const BLACK = '#000000';

function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, radius: number) {
  const r = Math.max(0, Math.min(radius, w / 2, h / 2));
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

function drawTrack(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, config: ProgressAssetConfig, filled: boolean) {
  if (w <= 0 || h <= 0) return;
  roundedRect(ctx, x, y, w, h, config.cornerRadius);
  if (filled || config.style === 'solid') {
    ctx.fillStyle = filled ? WHITE : BLACK;
    ctx.fill();
    if (!filled && config.style === 'solid') {
      ctx.strokeStyle = WHITE;
      ctx.lineWidth = config.strokeWidth;
      ctx.stroke();
    }
  } else {
    ctx.strokeStyle = WHITE;
    ctx.lineWidth = config.strokeWidth;
    ctx.stroke();
  }
}

function drawBattery(ctx: CanvasRenderingContext2D, c: ProgressAssetConfig, ratio: number) {
  const p = c.padding;
  const terminalW = Math.max(3, Math.min(c.height * 0.18, c.width * 0.12));
  const bodyW = c.width - p * 2 - terminalW;
  const bodyH = c.height - p * 2;
  const x = p;
  const y = p;
  const inner = Math.max(1, Math.min(c.strokeWidth + 1, bodyH / 2, bodyW / 2));
  const fillW = Math.max(0, (bodyW - inner * 2) * ratio);
  ctx.fillStyle = WHITE;
  ctx.fillRect(x + bodyW, y + bodyH * 0.3, terminalW, bodyH * 0.4);
  roundedRect(ctx, x, y, bodyW, bodyH, c.cornerRadius);
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = c.strokeWidth;
  ctx.stroke();
  const ix = x + inner;
  const iy = y + inner;
  const ih = Math.max(1, bodyH - inner * 2);
  if (c.showTrack) {
    ctx.fillStyle = '#252525';
    ctx.fillRect(ix, iy, Math.max(0, bodyW - inner * 2), ih);
  }
  if (fillW > 0) {
    ctx.fillStyle = WHITE;
    ctx.fillRect(ix, iy, fillW, ih);
  }
}

function drawSignal(ctx: CanvasRenderingContext2D, c: ProgressAssetConfig, ratio: number) {
  const p = c.padding;
  const count = Math.max(2, Math.min(12, c.segments));
  const gap = c.gap;
  const usableW = c.width - p * 2 - gap * (count - 1);
  const barW = usableW / count;
  const active = Math.round(ratio * count);
  for (let i = 0; i < count; i++) {
    const h = Math.max(2, (c.height - p * 2) * ((i + 1) / count));
    const x = p + i * (barW + gap);
    const y = c.height - p - h;
    if (i < active) {
      ctx.fillStyle = WHITE;
      roundedRect(ctx, x, y, barW, h, c.style === 'pixel' ? 0 : c.cornerRadius);
      ctx.fill();
    } else if (c.showTrack) {
      ctx.strokeStyle = '#777777';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, Math.max(0, barW - 1), Math.max(0, h - 1));
    }
  }
}

function drawLinear(ctx: CanvasRenderingContext2D, c: ProgressAssetConfig, ratio: number, segmented: boolean) {
  const p = c.padding;
  const horizontal = c.orientation === 'horizontal';
  const length = (horizontal ? c.width : c.height) - p * 2;
  const thickness = Math.max(2, (horizontal ? c.height : c.width) - p * 2);
  const x = horizontal ? p : (c.width - thickness) / 2;
  const y = horizontal ? (c.height - thickness) / 2 : p;
  const count = segmented ? c.segments : 1;
  const gap = segmented ? c.gap : 0;
  const unit = (length - gap * (count - 1)) / count;
  if (segmented) {
    const active = Math.round(ratio * count);
    for (let i = 0; i < count; i++) {
      const ux = horizontal ? x + i * (unit + gap) : x;
      const uy = horizontal ? y : y + i * (unit + gap);
      if (i < active) {
        ctx.fillStyle = WHITE;
        roundedRect(ctx, ux, uy, horizontal ? unit : thickness, horizontal ? thickness : unit, c.style === 'pixel' ? 0 : c.cornerRadius);
        ctx.fill();
      } else if (c.showTrack) {
        ctx.strokeStyle = '#777777';
        ctx.lineWidth = 1;
        ctx.strokeRect(ux + 0.5, uy + 0.5, Math.max(0, (horizontal ? unit : thickness) - 1), Math.max(0, (horizontal ? thickness : unit) - 1));
      }
    }
    return;
  }
  if (c.showTrack) drawTrack(ctx, x, y, horizontal ? length : thickness, horizontal ? thickness : length, c, false);
  const fillLength = length * ratio;
  if (fillLength > 0) {
    ctx.fillStyle = WHITE;
    roundedRect(ctx, x, y, horizontal ? fillLength : thickness, horizontal ? thickness : fillLength, c.style === 'pixel' ? 0 : c.cornerRadius);
    ctx.fill();
  }
}

function drawRing(ctx: CanvasRenderingContext2D, c: ProgressAssetConfig, ratio: number) {
  const radius = Math.max(2, Math.min(c.width, c.height) / 2 - c.padding - c.strokeWidth);
  const cx = c.width / 2;
  const cy = c.height / 2;
  const start = -Math.PI / 2;
  ctx.lineWidth = c.strokeWidth;
  ctx.lineCap = c.style === 'pixel' ? 'butt' : 'round';
  if (c.showTrack) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = '#555555';
    ctx.stroke();
  }
  if (ratio > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, start, start + Math.PI * 2 * ratio);
    ctx.strokeStyle = WHITE;
    ctx.stroke();
  }
}

function drawStorage(ctx: CanvasRenderingContext2D, c: ProgressAssetConfig, ratio: number) {
  const p = c.padding;
  const h = c.height - p * 2;
  const w = c.width - p * 2;
  const shellH = Math.max(6, h * 0.7);
  const y = p + (h - shellH) / 2;
  roundedRect(ctx, p, y, w, shellH, c.cornerRadius);
  ctx.strokeStyle = WHITE;
  ctx.lineWidth = c.strokeWidth;
  ctx.stroke();
  const inner = Math.max(1, Math.min(c.strokeWidth + 1, shellH / 2, w / 2));
  const innerW = Math.max(0, w - inner * 2);
  if (c.showTrack) {
    ctx.fillStyle = '#252525';
    ctx.fillRect(p + inner, y + inner, innerW, shellH - inner * 2);
  }
  ctx.fillStyle = WHITE;
  ctx.fillRect(p + inner, y + inner, innerW * ratio, Math.max(1, shellH - inner * 2));
  ctx.beginPath();
  ctx.arc(p + w - 3, y + shellH - 3, 1, 0, Math.PI * 2);
  ctx.fill();
}

function drawVolume(ctx: CanvasRenderingContext2D, c: ProgressAssetConfig, ratio: number) {
  const count = c.segments;
  const p = c.padding;
  const gap = c.gap;
  const barW = (c.width - p * 2 - gap * (count - 1)) / count;
  const active = Math.round(ratio * count);
  for (let i = 0; i < count; i++) {
    const h = (c.height - p * 2) * (0.25 + 0.75 * ((i + 1) / count));
    const x = p + i * (barW + gap);
    const y = c.height - p - h;
    if (i < active) {
      ctx.fillStyle = WHITE;
      ctx.fillRect(x, y, barW, h);
    } else if (c.showTrack) {
      ctx.strokeStyle = '#777777';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 0.5, y + 0.5, Math.max(0, barW - 1), Math.max(0, h - 1));
    }
  }
}

export function renderProgressAsset(configInput: ProgressAssetConfig, target?: HTMLCanvasElement | null): HTMLCanvasElement {
  const config = normalizeProgressConfig(configInput);
  const canvas = target ?? document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D context is unavailable.');
  ctx.fillStyle = BLACK;
  ctx.fillRect(0, 0, config.width, config.height);
  const ratio = getProgressRatio(config);
  switch (config.id) {
    case 'battery': drawBattery(ctx, config, ratio); break;
    case 'signal': drawSignal(ctx, config, ratio); break;
    case 'linear-progress': drawLinear(ctx, config, ratio, false); break;
    case 'segmented-progress': drawLinear(ctx, config, ratio, true); break;
    case 'progress-ring': drawRing(ctx, config, ratio); break;
    case 'storage': drawStorage(ctx, config, ratio); break;
    case 'volume': drawVolume(ctx, config, ratio); break;
  }
  if (config.style === 'tactical') {
    ctx.fillStyle = WHITE;
    ctx.fillRect(config.width / 2 - 1, 0, 2, Math.max(1, config.padding));
    ctx.fillRect(config.width / 2 - 1, config.height - config.padding, 2, Math.max(1, config.padding));
  }
  return canvas;
}
