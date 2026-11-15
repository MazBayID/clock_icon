import type { GeneratorConfig, GeneratorType } from './types';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  const r = clamp(radius, 0, Math.min(width, height) / 2);
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, r);
}

function drawBattery(ctx: CanvasRenderingContext2D, c: GeneratorConfig) {
  const pad = Math.max(2, c.thickness * 0.55);
  const terminalW = Math.max(2, c.thickness * 0.5);
  const bodyW = c.width - terminalW - pad * 2;
  const bodyH = Math.min(c.height - pad * 2, Math.max(8, c.height * 0.72));
  const x = pad;
  const y = (c.height - bodyH) / 2;
  const inner = Math.max(1, c.thickness * 0.45);
  const innerX = x + inner;
  const innerY = y + inner;
  const innerW = Math.max(1, bodyW - inner * 2);
  const innerH = Math.max(1, bodyH - inner * 2);

  ctx.fillStyle = c.foreground;
  if (c.style === 'tactical') {
    ctx.beginPath();
    ctx.moveTo(x + 2, y);
    ctx.lineTo(x + bodyW - 2, y);
    ctx.lineTo(x + bodyW, y + 2);
    ctx.lineTo(x + bodyW, y + bodyH - 2);
    ctx.lineTo(x + bodyW - 2, y + bodyH);
    ctx.lineTo(x + 2, y + bodyH);
    ctx.lineTo(x, y + bodyH - 2);
    ctx.lineTo(x, y + 2);
    ctx.closePath();
  } else {
    roundedRect(ctx, x, y, bodyW, bodyH, c.style === 'minimal' ? 1 : c.cornerRadius);
  }
  ctx.strokeStyle = c.foreground;
  ctx.lineWidth = Math.max(1, c.style === 'cyber' ? 1.5 : 1);
  ctx.stroke();
  ctx.fillStyle = c.foreground;
  ctx.fillRect(x + bodyW + 1, c.height / 2 - bodyH * 0.22, terminalW, bodyH * 0.44);

  if (c.showTrack) {
    ctx.fillStyle = c.track;
    roundedRect(ctx, innerX, innerY, innerW, innerH, Math.min(c.cornerRadius, innerH / 2));
    ctx.fill();
  }
  const fillW = innerW * c.value / 100;
  if (fillW > 0) {
    ctx.fillStyle = c.foreground;
    roundedRect(ctx, innerX, innerY, fillW, innerH, Math.min(c.cornerRadius, innerH / 2));
    ctx.fill();
  }
}

function drawSignal(ctx: CanvasRenderingContext2D, c: GeneratorConfig) {
  const count = c.segments;
  const gap = c.gap;
  const pad = Math.max(1, gap);
  const usableW = c.width - pad * 2 - gap * (count - 1);
  const barW = usableW / count;
  const baseY = c.height - pad;
  for (let i = 0; i < count; i++) {
    const ratio = (i + 1) / count;
    const barH = Math.max(2, (c.height - pad * 2) * (0.22 + ratio * 0.78));
    const x = pad + i * (barW + gap);
    const y = baseY - barH;
    const active = ((i + 1) / count) * 100 <= c.value + 0.001;
    ctx.fillStyle = active ? c.foreground : c.track;
    if (c.style === 'tactical') {
      ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.ceil(barW)), Math.ceil(barH));
    } else {
      roundedRect(ctx, x, y, barW, barH, c.style === 'minimal' ? 0 : c.cornerRadius);
      ctx.fill();
    }
  }
}

function drawLinear(ctx: CanvasRenderingContext2D, c: GeneratorConfig, segmented: boolean) {
  const pad = Math.max(1, c.gap);
  const h = Math.min(c.height - pad * 2, c.thickness);
  const y = (c.height - h) / 2;
  const x = pad;
  const w = c.width - pad * 2;
  ctx.fillStyle = c.track;
  if (c.showTrack) {
    roundedRect(ctx, x, y, w, h, c.style === 'minimal' ? 0 : c.cornerRadius);
    ctx.fill();
  }
  ctx.fillStyle = c.foreground;
  if (segmented) {
    const gap = c.gap;
    const cellW = (w - gap * (c.segments - 1)) / c.segments;
    const active = c.value / 100 * c.segments;
    for (let i = 0; i < c.segments; i++) {
      const fraction = clamp(active - i, 0, 1);
      if (fraction <= 0) continue;
      const cellX = x + i * (cellW + gap);
      roundedRect(ctx, cellX, y, cellW * fraction, h, c.style === 'minimal' ? 0 : c.cornerRadius);
      ctx.fill();
    }
  } else {
    roundedRect(ctx, x, y, w * c.value / 100, h, c.style === 'minimal' ? 0 : c.cornerRadius);
    ctx.fill();
  }
}

function drawRing(ctx: CanvasRenderingContext2D, c: GeneratorConfig) {
  const line = Math.min(c.thickness, c.width / 2 - 1, c.height / 2 - 1);
  const radius = Math.max(1, Math.min(c.width, c.height) / 2 - line / 2 - 1);
  const cx = c.width / 2;
  const cy = c.height / 2;
  const start = -Math.PI / 2;
  ctx.lineWidth = line;
  ctx.lineCap = c.style === 'tactical' ? 'butt' : 'round';
  if (c.showTrack) {
    ctx.beginPath();
    ctx.strokeStyle = c.track;
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.strokeStyle = c.foreground;
  ctx.arc(cx, cy, radius, start, start + Math.PI * 2 * c.value / 100);
  ctx.stroke();
  if (c.style === 'cyber') {
    ctx.fillStyle = c.foreground;
    ctx.fillRect(cx - 1, 1, 2, 3);
  }
}

function drawVolume(ctx: CanvasRenderingContext2D, c: GeneratorConfig) {
  const count = c.segments;
  const gap = c.gap;
  const pad = Math.max(1, gap);
  const usableW = c.width - pad * 2 - gap * (count - 1);
  const barW = usableW / count;
  for (let i = 0; i < count; i++) {
    const x = pad + i * (barW + gap);
    const h = Math.max(2, (c.height - pad * 2) * ((i + 1) / count));
    const y = c.height - pad - h;
    const level = ((i + 1) / count) * 100;
    ctx.fillStyle = level <= c.value ? c.foreground : c.track;
    roundedRect(ctx, x, y, barW, h, c.style === 'minimal' ? 0 : c.cornerRadius);
    ctx.fill();
  }
}

export function renderIndicator(config: GeneratorConfig): HTMLCanvasElement {
  const c: GeneratorConfig = {
    ...config,
    width: clamp(Math.round(config.width), 8, 512),
    height: clamp(Math.round(config.height), 8, 512),
    value: clamp(config.value, 0, 100),
    segments: clamp(Math.round(config.segments), 2, 16),
    thickness: clamp(config.thickness, 1, Math.min(config.width, config.height)),
    gap: clamp(config.gap, 0, 16),
  };
  const canvas = document.createElement('canvas');
  canvas.width = c.width;
  canvas.height = c.height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D context is unavailable.');
  ctx.fillStyle = c.background;
  ctx.fillRect(0, 0, c.width, c.height);

  const drawByType: Record<GeneratorType, () => void> = {
    battery: () => drawBattery(ctx, c),
    signal: () => drawSignal(ctx, c),
    'linear-progress': () => drawLinear(ctx, c, false),
    'segmented-progress': () => drawLinear(ctx, c, true),
    'ring-progress': () => drawRing(ctx, c),
    volume: () => drawVolume(ctx, c),
  };
  drawByType[c.type]();

  if (c.pixelSnap) {
    const image = ctx.getImageData(0, 0, c.width, c.height);
    for (let i = 0; i < image.data.length; i += 4) {
      const luminance = image.data[i] * 0.299 + image.data[i + 1] * 0.587 + image.data[i + 2] * 0.114;
      const value = luminance >= c.threshold ? 255 : 0;
      image.data[i] = value;
      image.data[i + 1] = value;
      image.data[i + 2] = value;
      image.data[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
  }
  return canvas;
}

export function downloadIndicatorPng(config: GeneratorConfig) {
  const canvas = renderIndicator(config);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `clock-icon-${config.type}-${config.width}x${config.height}.png`;
    anchor.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
}
