import {
  ColonStyleMode,
  GLYPH_HEIGHT,
  GLYPH_WIDTH,
  GlyphChar,
  GlyphMetrics,
  GlyphRenderOptions,
  StyleId,
} from '../types/glyph';

export const DEFAULT_RENDER_OPTIONS: GlyphRenderOptions = {
  strokeScale: 1.0,
  paddingX: 1,
  paddingY: 1,
  pixelSnap: false,
  threshold: 128,
  colonStyle: 'match',
};

interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
}

function getBox(options: GlyphRenderOptions): Box {
  const x0 = 1 + options.paddingX;
  const x1 = GLYPH_WIDTH - 1 - options.paddingX;
  const y0 = 2 + options.paddingY;
  const y1 = GLYPH_HEIGHT - 2 - options.paddingY;
  return {
    x0,
    y0,
    x1,
    y1,
    w: x1 - x0,
    h: y1 - y0,
    cx: (x0 + x1) / 2,
    cy: (y0 + y1) / 2,
  };
}

function drawColon(
  ctx: CanvasRenderingContext2D,
  styleId: StyleId,
  box: Box,
  options: GlyphRenderOptions
) {
  const mode: Exclude<ColonStyleMode, 'match'> =
    options.colonStyle !== 'match'
      ? options.colonStyle
      : styleId === 'chronos-horology' ||
          styleId === 'kinetik-matrix' ||
          styleId === 'atelier-stencil' ||
          styleId === 'obsidian-inline'
        ? 'diamond'
        : styleId === 'mecha-katana' ||
            styleId === 'glitch-2099' ||
            styleId === 'hyper-kinetic' ||
            styleId === 'neo-kanji-tech' ||
            styleId === 'holo-scanline' ||
            styleId === 'exo-frame-bracket' ||
            styleId === 'kurogane-heavy' ||
            styleId === 'synth-blade-bold' ||
            styleId === 'oni-chrome-brutal' ||
            styleId === 'chrome-shard-v2' ||
            styleId === 'cyber-stencil-2077' ||
            styleId === 'binary-barcode-cyber' ||
            styleId === 'vortex-razor-italic' ||
            styleId === 'ronin-katana-split' ||
            styleId === 'subzero-visor' ||
            styleId === 'tachyon-chevron' ||
            styleId === 'signal-jammer'
          ? 'slit'
          : styleId === 'volt-arc-surge' ||
              styleId === 'cyber-gothic-2100'
            ? 'diamond'
            : 'round';

  const r = Math.max(1.5, 2.2 * options.strokeScale);
  const yTop = box.y0 + box.h * 0.34;
  const yBot = box.y0 + box.h * 0.68;

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FFFFFF';

  if (mode === 'round') {
    for (const y of [yTop, yBot]) {
      ctx.beginPath();
      ctx.arc(box.cx, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  if (mode === 'diamond') {
    const d = r * 1.25;
    for (const y of [yTop, yBot]) {
      ctx.beginPath();
      ctx.moveTo(box.cx, y - d);
      ctx.lineTo(box.cx + d, y);
      ctx.lineTo(box.cx, y + d);
      ctx.lineTo(box.cx - d, y);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }

  // slit / cyber slash
  const hw = r * 1.15;
  const hh = r * 1.1;
  const skew = styleId === 'mecha-katana' ? 1.4 : 0.7;
  for (const y of [yTop, yBot]) {
    ctx.beginPath();
    ctx.moveTo(box.cx - hw + skew, y - hh);
    ctx.lineTo(box.cx + hw + skew, y - hh);
    ctx.lineTo(box.cx + hw - skew, y + hh);
    ctx.lineTo(box.cx - hw - skew, y + hh);
    ctx.closePath();
    ctx.fill();
  }
}

// ============================================================================
// 1. AETHER NEO-GROTESQUE (Modern Swiss Geometric)
// ============================================================================
function drawAetherGrotesque(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'aether-grotesque', box, options);
    return;
  }

  const sw = Math.max(1.8, Math.min(4.8, 3.1 * options.strokeScale));
  const hw = sw / 2;
  const l = box.x0 + hw;
  const r = box.x1 - hw;
  const t = box.y0 + hw;
  const b = box.y1 - hw;
  const cx = box.cx;
  const cy = box.cy;
  const rad = Math.min(6.5, (r - l) * 0.38);

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = sw;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'round';

  switch (char) {
    case '0': {
      ctx.beginPath();
      ctx.roundRect(l, t, r - l, b - t, rad + 1.5);
      ctx.stroke();
      break;
    }
    case '1': {
      const stemX = cx + 1.5;
      ctx.beginPath();
      ctx.moveTo(l + 1.2, t + 6.5);
      ctx.lineTo(stemX, t + 0.5);
      ctx.lineTo(stemX, b + hw);
      ctx.stroke();
      // Subtle architectural base bar
      ctx.beginPath();
      ctx.moveTo(l + 1, b);
      ctx.lineTo(r - 0.5, b);
      ctx.stroke();
      break;
    }
    case '2': {
      ctx.beginPath();
      ctx.moveTo(l, t + 6.5);
      ctx.quadraticCurveTo(l, t, cx, t);
      ctx.quadraticCurveTo(r, t, r, t + 7.5);
      ctx.bezierCurveTo(r, cy - 1, l + 1, cy + 4, l, b);
      ctx.lineTo(r + hw, b);
      ctx.stroke();
      break;
    }
    case '3': {
      ctx.beginPath();
      ctx.moveTo(l + 0.5, t + 5.5);
      ctx.quadraticCurveTo(l + 1, t, cx, t);
      ctx.quadraticCurveTo(r, t, r, t + 7);
      ctx.quadraticCurveTo(r, cy - 1, cx - 1, cy - 0.5);
      ctx.lineTo(cx - 2.5, cy - 0.5);
      ctx.moveTo(cx - 1, cy - 0.5);
      ctx.quadraticCurveTo(r, cy, r, cy + 8.5);
      ctx.quadraticCurveTo(r, b, cx, b);
      ctx.quadraticCurveTo(l + 0.5, b, l, b - 5.5);
      ctx.stroke();
      break;
    }
    case '4': {
      const barY = cy + 5.5;
      const stemX = r - 3.2;
      ctx.beginPath();
      ctx.moveTo(stemX, b + hw);
      ctx.lineTo(stemX, t);
      ctx.lineTo(l, barY);
      ctx.lineTo(r + hw, barY);
      ctx.stroke();
      break;
    }
    case '5': {
      ctx.beginPath();
      ctx.moveTo(r + hw - 0.5, t);
      ctx.lineTo(l + 0.8, t);
      ctx.lineTo(l + 0.3, cy - 2);
      ctx.quadraticCurveTo(cx + 1, cy - 3.5, r, cy + 4.5);
      ctx.quadraticCurveTo(r, b, cx, b);
      ctx.quadraticCurveTo(l + 0.5, b, l, b - 5.5);
      ctx.stroke();
      break;
    }
    case '6': {
      ctx.beginPath();
      ctx.moveTo(r - 0.5, t + 5);
      ctx.quadraticCurveTo(r - 1, t, cx + 0.5, t);
      ctx.quadraticCurveTo(l, t, l, t + 11);
      ctx.lineTo(l, b - 8);
      ctx.quadraticCurveTo(l, b, cx, b);
      ctx.quadraticCurveTo(r, b, r, cy + 7.5);
      ctx.quadraticCurveTo(r, cy - 1, cx, cy - 1);
      ctx.quadraticCurveTo(l, cy - 1, l, cy + 6);
      ctx.stroke();
      break;
    }
    case '7': {
      ctx.beginPath();
      ctx.moveTo(l - hw, t);
      ctx.lineTo(r, t);
      ctx.lineTo(l + 4.5, b + hw);
      ctx.stroke();
      break;
    }
    case '8': {
      // Slightly narrower upper loop for optical stability
      ctx.beginPath();
      ctx.roundRect(l + 0.7, t, r - l - 1.4, cy - t + 1.2, 5.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(l, cy - 1.2, r - l, b - cy + 1.2, 5.8);
      ctx.stroke();
      break;
    }
    case '9': {
      ctx.beginPath();
      ctx.moveTo(l + 0.5, b - 5);
      ctx.quadraticCurveTo(l + 1, b, cx - 0.5, b);
      ctx.quadraticCurveTo(r, b, r, b - 11);
      ctx.lineTo(r, t + 8);
      ctx.quadraticCurveTo(r, t, cx, t);
      ctx.quadraticCurveTo(l, t, l, cy - 7.5);
      ctx.quadraticCurveTo(l, cy + 1, cx, cy + 1);
      ctx.quadraticCurveTo(r, cy + 1, r, cy - 6);
      ctx.stroke();
      break;
    }
  }
}

// ============================================================================
// 2. LUMINAR FLUID CURVE (Modern Sport & Fluid G2 Curves)
// ============================================================================
function drawLuminarFluid(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'luminar-fluid', box, options);
    return;
  }

  const sw = Math.max(1.8, Math.min(4.8, 3.2 * options.strokeScale));
  const hw = sw / 2;
  const l = box.x0 + hw;
  const r = box.x1 - hw;
  const t = box.y0 + hw;
  const b = box.y1 - hw;
  const cx = box.cx;
  const cy = box.cy;

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = sw;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  switch (char) {
    case '0': {
      ctx.beginPath();
      ctx.roundRect(l, t, r - l, b - t, (r - l) / 2);
      ctx.stroke();
      break;
    }
    case '1': {
      ctx.beginPath();
      ctx.moveTo(l + 2.5, t + 5.5);
      ctx.quadraticCurveTo(cx, t + 4, cx + 1.5, t);
      ctx.lineTo(cx + 1.5, b);
      ctx.stroke();
      break;
    }
    case '2': {
      ctx.beginPath();
      ctx.moveTo(l + 0.5, t + 6.5);
      ctx.bezierCurveTo(l + 0.5, t - 0.5, r, t - 0.5, r, t + 7.5);
      ctx.bezierCurveTo(r, cy + 2, l, cy + 5, l, b);
      ctx.lineTo(r, b);
      ctx.stroke();
      break;
    }
    case '3': {
      ctx.beginPath();
      ctx.moveTo(l + 1, t + 4.5);
      ctx.bezierCurveTo(l + 2, t - 0.5, r, t - 0.5, r, t + 7);
      ctx.bezierCurveTo(r, cy - 1, cx + 2, cy - 0.5, cx - 1.5, cy - 0.5);
      ctx.bezierCurveTo(cx + 2, cy - 0.5, r, cy + 1, r, cy + 8.5);
      ctx.bezierCurveTo(r, b + 0.5, l + 2, b + 0.5, l + 0.5, b - 4.5);
      ctx.stroke();
      break;
    }
    case '4': {
      const barY = cy + 5;
      const stemX = r - 3.0;
      ctx.beginPath();
      ctx.moveTo(stemX, b);
      ctx.lineTo(stemX, t);
      ctx.quadraticCurveTo(l + 4, t + 10, l, barY);
      ctx.lineTo(r, barY);
      ctx.stroke();
      break;
    }
    case '5': {
      ctx.beginPath();
      ctx.moveTo(r - 0.5, t);
      ctx.lineTo(l + 1.2, t);
      ctx.lineTo(l + 0.5, cy - 2.5);
      ctx.bezierCurveTo(cx + 3, cy - 4, r, cy + 1, r, cy + 7.5);
      ctx.bezierCurveTo(r, b + 0.5, l + 2, b + 0.5, l, b - 4.5);
      ctx.stroke();
      break;
    }
    case '6': {
      ctx.beginPath();
      ctx.moveTo(r - 1.2, t + 3);
      ctx.bezierCurveTo(cx, t - 1, l, t + 2, l, cy - 2);
      ctx.lineTo(l, b - 8);
      ctx.bezierCurveTo(l, b + 1, r, b + 1, r, cy + 7.5);
      ctx.bezierCurveTo(r, cy - 2, l, cy - 2, l, cy + 7.5);
      ctx.stroke();
      break;
    }
    case '7': {
      ctx.beginPath();
      ctx.moveTo(l, t);
      ctx.lineTo(r, t);
      ctx.quadraticCurveTo(r - 2, cy - 2, l + 4.5, b);
      ctx.stroke();
      break;
    }
    case '8': {
      ctx.beginPath();
      ctx.ellipse(cx, (t + cy) / 2 + 0.5, (r - l) * 0.45, (cy - t) * 0.52, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(cx, (cy + b) / 2 - 0.5, (r - l) * 0.5, (b - cy) * 0.52, 0, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case '9': {
      ctx.beginPath();
      ctx.moveTo(l + 1.2, b - 3);
      ctx.bezierCurveTo(cx, b + 1, r, b - 2, r, cy + 2);
      ctx.lineTo(r, t + 8);
      ctx.bezierCurveTo(r, t - 1, l, t - 1, l, cy - 7.5);
      ctx.bezierCurveTo(l, cy + 2, r, cy + 2, r, cy - 7.5);
      ctx.stroke();
      break;
    }
  }
}

// ============================================================================
// 3. CHRONOS HAUTE HOROLOGY (Luxury High-Contrast Horological Numerals)
// ============================================================================
function drawChronosHorology(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'chronos-horology', box, options);
    return;
  }

  const thick = Math.max(2.6, Math.min(5.2, 4.1 * options.strokeScale));
  const thin = Math.max(1.2, Math.min(2.6, 1.5 * options.strokeScale));
  const l = box.x0;
  const r = box.x1;
  const t = box.y0;
  const b = box.y1;
  const w = r - l;
  const h = b - t;
  const cx = box.cx;
  const cy = box.cy;

  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#FFFFFF';

  // Helper: draw high-contrast luxury oval loop by outer/inner subtraction
  const drawContrastLoop = (lx: number, ty: number, rx: number, by: number) => {
    const outerRx = (rx - lx) / 2;
    const outerRy = (by - ty) / 2;
    const mx = (lx + rx) / 2;
    const my = (ty + by) / 2;
    const innerRx = Math.max(1.2, outerRx - thick);
    const innerRy = Math.max(1.5, outerRy - thin);

    ctx.beginPath();
    ctx.ellipse(mx, my, outerRx, outerRy, 0, 0, Math.PI * 2);
    ctx.ellipse(mx, my, innerRx, innerRy, 0, 0, Math.PI * 2, true);
    ctx.fill('evenodd');
  };

  switch (char) {
    case '0': {
      drawContrastLoop(l, t, r, b);
      break;
    }
    case '1': {
      const stemLeft = cx - thick * 0.25;
      const stemRight = stemLeft + thick;
      // Main thick vertical stem
      ctx.fillRect(stemLeft, t, thick, h);
      // Graceful curved luxury flag
      ctx.beginPath();
      ctx.moveTo(stemLeft + 0.5, t);
      ctx.quadraticCurveTo(stemLeft - 2.5, t + 4.5, l + 1.5, t + 6.5);
      ctx.lineTo(l + 1.5, t + 6.5 + thin);
      ctx.quadraticCurveTo(stemLeft - 1.5, t + 5.5, stemLeft + 0.5, t + thin + 1.5);
      ctx.closePath();
      ctx.fill();
      // Fine flared base serif
      ctx.fillRect(l + 2, b - thin, w - 4, thin);
      // Subtle top crown taper
      ctx.fillRect(stemLeft - 0.3, t, stemRight - stemLeft + 0.3, thin);
      break;
    }
    case '2': {
      // Top curve
      ctx.lineWidth = thin;
      ctx.lineCap = 'butt';
      ctx.beginPath();
      ctx.moveTo(l + 1.5, t + 8);
      ctx.bezierCurveTo(l + 1.5, t + 0.5, r - 1.5, t + 0.5, r - thick / 2, t + 9);
      ctx.stroke();
      // Thick right shoulder & diagonal descent
      ctx.beginPath();
      ctx.moveTo(r - thick, t + 7);
      ctx.quadraticCurveTo(r, t + 7, r, t + 11.5);
      ctx.bezierCurveTo(r, cy + 1, l + 5, cy + 7, l + thick, b - thin);
      ctx.lineTo(l, b - thin);
      ctx.bezierCurveTo(l + 1, cy + 6, r - thick, cy + 1, r - thick, t + 11.5);
      ctx.closePath();
      ctx.fill();
      // Razor-sharp horizontal base with vertical end bracket
      ctx.fillRect(l, b - thin, w, thin);
      ctx.fillRect(r - thin * 1.3, b - 4.5, thin * 1.3, 4.5);
      break;
    }
    case '3': {
      // Top & bottom contrast arcs
      ctx.beginPath();
      ctx.ellipse(cx, (t + cy) / 2 + 0.5, w * 0.48, (cy - t) * 0.52, 0, -Math.PI * 0.85, Math.PI * 0.5);
      ctx.lineWidth = thick * 0.82;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx, (cy + b) / 2 - 0.5, w * 0.5, (b - cy) * 0.52, 0, -Math.PI * 0.5, Math.PI * 0.85);
      ctx.lineWidth = thick * 0.82;
      ctx.stroke();

      // Carve thin horizontal relief inside top/bottom to emphasize luxury contrast
      ctx.fillStyle = '#000000';
      ctx.fillRect(l + 3, t + thin, w - 6, 1.5);
      ctx.fillRect(l + 3, b - thin - 1.5, w - 6, 1.5);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(l + 3, t, w - 6, thin);
      ctx.fillRect(l + 3, b - thin, w - 6, thin);
      // Thin center waist
      ctx.fillRect(cx - 2.5, cy - thin / 2, 7, thin);
      // Teardrop terminals
      ctx.beginPath();
      ctx.arc(l + 2.2, t + 6.5, 1.8, 0, Math.PI * 2);
      ctx.arc(l + 2.2, b - 6.5, 1.8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case '4': {
      const barY = cy + 6;
      const stemX = r - thick - 2.2;
      // Thick vertical stem
      ctx.fillRect(stemX, t, thick, h);
      // Fine diagonal hairline
      ctx.lineWidth = thin;
      ctx.beginPath();
      ctx.moveTo(stemX + 0.5, t + 0.5);
      ctx.lineTo(l + 0.5, barY);
      ctx.stroke();
      // Fine crossbar
      ctx.fillRect(l, barY - thin / 2, w, thin);
      // Base serif
      ctx.fillRect(stemX - 2.2, b - thin, thick + 4.4, thin);
      break;
    }
    case '5': {
      // Hairline top bar + fine drop + thick lower bowl
      ctx.fillRect(l + 1, t, w - 1.5, thin);
      ctx.fillRect(r - thin * 1.2, t, thin * 1.2, 3.2);
      ctx.fillRect(l + 1, t, thin * 1.15, cy - t - 1);
      // Lower bowl outer/inner contrast
      const bowlTop = cy - 2;
      ctx.beginPath();
      ctx.ellipse(cx, (bowlTop + b) / 2, w * 0.5, (b - bowlTop) / 2, 0, -Math.PI * 0.78, Math.PI * 0.82);
      ctx.ellipse(
        cx - 0.5,
        (bowlTop + b) / 2,
        Math.max(1.5, w * 0.5 - thick),
        Math.max(1.5, (b - bowlTop) / 2 - thin),
        0,
        Math.PI * 0.82,
        -Math.PI * 0.78,
        true
      );
      ctx.fill('evenodd');
      // Teardrop lower terminal
      ctx.beginPath();
      ctx.arc(l + 2.2, b - 6.5, 1.9, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case '6': {
      // Upper spine curving smoothly into lower contrast bowl
      drawContrastLoop(l, cy - 2, r, b);
      ctx.beginPath();
      ctx.moveTo(l, cy + 7);
      ctx.bezierCurveTo(l, t + 2, cx + 1, t, r - 2.5, t);
      ctx.lineTo(r - 2.5, t + thin);
      ctx.bezierCurveTo(cx + 1, t + thin, l + thick, t + 4, l + thick, cy + 7);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(r - 2.8, t + 3.2, 1.8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case '7': {
      // Fine top bar with left bracket + sweeping thick-to-thin curved leg
      ctx.fillRect(l, t, w, thin);
      ctx.fillRect(l, t, thin * 1.2, 4.2);
      ctx.beginPath();
      ctx.moveTo(r - thick * 0.7, t);
      ctx.lineTo(r, t);
      ctx.quadraticCurveTo(cx + 1.5, cy, cx - 1.5, b);
      ctx.lineTo(cx - 1.5 - thin * 1.4, b);
      ctx.quadraticCurveTo(cx - 0.5, cy, r - thick * 0.7, t);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case '8': {
      drawContrastLoop(l + 1, t, r - 1, cy + 1.2);
      drawContrastLoop(l, cy - 1.2, r, b);
      break;
    }
    case '9': {
      drawContrastLoop(l, t, r, cy + 2);
      ctx.beginPath();
      ctx.moveTo(r, cy - 7);
      ctx.bezierCurveTo(r, b - 2, cx - 1, b, l + 2.5, b);
      ctx.lineTo(l + 2.5, b - thin);
      ctx.bezierCurveTo(cx - 1, b - thin, r - thick, b - 4, r - thick, cy - 7);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(l + 2.8, b - 3.2, 1.8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
  }
}

// ============================================================================
// 4. MONOLITH ARSITEKTURAL (Bold Condensed Architectural Slabs)
// ============================================================================
function drawMonolithSlab(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'monolith-slab', box, options);
    return;
  }

  const l = Math.round(box.x0);
  const r = Math.round(box.x1);
  const t = Math.round(box.y0);
  const b = Math.round(box.y1);
  const w = r - l;
  const h = b - t;
  const wall = Math.max(3, Math.min(7, Math.round(5.6 * options.strokeScale)));
  const hWall = Math.max(3, Math.min(6, Math.round(4.6 * options.strokeScale)));
  const cy = Math.round((t + b) / 2);

  ctx.fillStyle = '#FFFFFF';

  const cutout = (x: number, y: number, cw: number, ch: number) => {
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, cw, ch);
    ctx.fillStyle = '#FFFFFF';
  };

  // Helper: subtle 1.5px architectural corner chamfer on outer silhouette
  const chamferCorners = (x: number, y: number, cw: number, ch: number, c = 1.5) => {
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x + c, y); ctx.lineTo(x, y + c); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + cw, y); ctx.lineTo(x + cw - c, y); ctx.lineTo(x + cw, y + c); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y + ch); ctx.lineTo(x + c, y + ch); ctx.lineTo(x, y + ch - c); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + cw, y + ch); ctx.lineTo(x + cw - c, y + ch); ctx.lineTo(x + cw, y + ch - c); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#FFFFFF';
  };

  switch (char) {
    case '0': {
      ctx.fillRect(l, t, w, h);
      cutout(l + wall, t + hWall, w - wall * 2, h - hWall * 2);
      chamferCorners(l, t, w, h, 2);
      break;
    }
    case '1': {
      const stemW = Math.min(w - 4, wall + 2);
      const sx = Math.round(box.cx - stemW / 2 + 1.5);
      ctx.fillRect(sx, t, stemW, h);
      ctx.fillRect(l + 1, t, sx - l + 1, hWall);
      ctx.fillRect(l + 1, b - hWall, w - 2, hWall);
      chamferCorners(sx, t, stemW, h, 1.5);
      break;
    }
    case '2': {
      ctx.fillRect(l, t, w, h);
      cutout(l, t + hWall, w - wall, cy - t - hWall - Math.floor(hWall / 2));
      cutout(l + wall, cy + Math.ceil(hWall / 2), w - wall, b - cy - Math.ceil(hWall / 2) - hWall);
      chamferCorners(l, t, w, h, 2);
      break;
    }
    case '3': {
      ctx.fillRect(l, t, w, h);
      cutout(l, t + hWall, w - wall, cy - t - hWall - Math.floor(hWall / 2));
      cutout(l, cy + Math.ceil(hWall / 2), w - wall, b - cy - Math.ceil(hWall / 2) - hWall);
      chamferCorners(l, t, w, h, 2);
      break;
    }
    case '4': {
      const barY = cy + 1;
      ctx.fillRect(l, t, wall, barY - t + hWall);
      ctx.fillRect(r - wall, t, wall, h);
      ctx.fillRect(l, barY, w, hWall);
      break;
    }
    case '5': {
      ctx.fillRect(l, t, w, h);
      cutout(l + wall, t + hWall, w - wall, cy - t - hWall - Math.floor(hWall / 2));
      cutout(l, cy + Math.ceil(hWall / 2), w - wall, b - cy - Math.ceil(hWall / 2) - hWall);
      chamferCorners(l, t, w, h, 2);
      break;
    }
    case '6': {
      ctx.fillRect(l, t, w, h);
      cutout(l + wall, t + hWall, w - wall, cy - t - hWall - Math.floor(hWall / 2));
      cutout(l + wall, cy + Math.ceil(hWall / 2), w - wall * 2, b - cy - Math.ceil(hWall / 2) - hWall);
      chamferCorners(l, t, w, h, 2);
      break;
    }
    case '7': {
      ctx.fillRect(l, t, w, hWall);
      ctx.fillRect(r - wall, t, wall, h);
      // Subtle architectural left notch under top bar
      ctx.fillRect(l, t, Math.max(2, wall * 0.6), hWall + 3);
      chamferCorners(l, t, w, hWall, 1.5);
      break;
    }
    case '8': {
      ctx.fillRect(l, t, w, h);
      cutout(l + wall, t + hWall, w - wall * 2, cy - t - hWall - Math.floor(hWall / 2));
      cutout(l + wall, cy + Math.ceil(hWall / 2), w - wall * 2, b - cy - Math.ceil(hWall / 2) - hWall);
      chamferCorners(l, t, w, h, 2);
      break;
    }
    case '9': {
      ctx.fillRect(l, t, w, h);
      cutout(l + wall, t + hWall, w - wall * 2, cy - t - hWall - Math.floor(hWall / 2));
      cutout(l, cy + Math.ceil(hWall / 2), w - wall, b - cy - Math.ceil(hWall / 2) - hWall);
      chamferCorners(l, t, w, h, 2);
      break;
    }
  }
}

// ============================================================================
// 5. VEKTOR AEROSPACE HUD (Chamfered Octilinear + Tactical Micro-Slits)
// ============================================================================
function drawVektorHud(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'vektor-hud', box, options);
    return;
  }

  const sw = Math.max(1.8, Math.min(4.6, 3.0 * options.strokeScale));
  const hw = sw / 2;
  const l = box.x0 + hw;
  const r = box.x1 - hw;
  const t = box.y0 + hw;
  const b = box.y1 - hw;
  const cx = box.cx;
  const cy = box.cy;
  const c = 4.2; // 45-deg chamfer

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = sw;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';

  const drawOctagon = (lx: number, ty: number, rx: number, by: number, ch = c) => {
    ctx.beginPath();
    ctx.moveTo(lx + ch, ty);
    ctx.lineTo(rx - ch, ty);
    ctx.lineTo(rx, ty + ch);
    ctx.lineTo(rx, by - ch);
    ctx.lineTo(rx - ch, by);
    ctx.lineTo(lx + ch, by);
    ctx.lineTo(lx, by - ch);
    ctx.lineTo(lx, ty + ch);
    ctx.closePath();
    ctx.stroke();
  };

  switch (char) {
    case '0': {
      drawOctagon(l, t, r, b);
      // Precision HUD inner reticle dot/dash
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(cx - 1.5, cy - 1.5, 3, 3);
      break;
    }
    case '1': {
      const sx = cx + 1.5;
      ctx.beginPath();
      ctx.moveTo(l + 1.5, t + 5.5);
      ctx.lineTo(sx, t);
      ctx.lineTo(sx, b + hw);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(l + 1.5, b);
      ctx.lineTo(r - 1, b);
      ctx.stroke();
      break;
    }
    case '2': {
      ctx.beginPath();
      ctx.moveTo(l, t + c);
      ctx.lineTo(l + c, t);
      ctx.lineTo(r - c, t);
      ctx.lineTo(r, t + c);
      ctx.lineTo(r, cy - 2.5);
      ctx.lineTo(l, cy + 5.5);
      ctx.lineTo(l, b);
      ctx.lineTo(r + hw, b);
      ctx.stroke();
      break;
    }
    case '3': {
      ctx.beginPath();
      ctx.moveTo(l, t + c);
      ctx.lineTo(l + c, t);
      ctx.lineTo(r - c, t);
      ctx.lineTo(r, t + c);
      ctx.lineTo(r, cy - 3);
      ctx.lineTo(r - 3, cy);
      ctx.lineTo(cx - 2, cy);
      ctx.moveTo(r - 3, cy);
      ctx.lineTo(r, cy + 3);
      ctx.lineTo(r, b - c);
      ctx.lineTo(r - c, b);
      ctx.lineTo(l + c, b);
      ctx.lineTo(l, b - c);
      ctx.stroke();
      break;
    }
    case '4': {
      const barY = cy + 4;
      const sx = r - 3;
      ctx.beginPath();
      ctx.moveTo(sx, b + hw);
      ctx.lineTo(sx, t);
      ctx.lineTo(l, barY - 3);
      ctx.lineTo(l, barY);
      ctx.lineTo(r + hw, barY);
      ctx.stroke();
      break;
    }
    case '5': {
      ctx.beginPath();
      ctx.moveTo(r + hw, t);
      ctx.lineTo(l, t);
      ctx.lineTo(l, cy - 1);
      ctx.lineTo(r - c, cy - 1);
      ctx.lineTo(r, cy + c - 1);
      ctx.lineTo(r, b - c);
      ctx.lineTo(r - c, b);
      ctx.lineTo(l + c, b);
      ctx.lineTo(l, b - c);
      ctx.stroke();
      break;
    }
    case '6': {
      ctx.beginPath();
      ctx.moveTo(r, t + c);
      ctx.lineTo(r - c, t);
      ctx.lineTo(l + c, t);
      ctx.lineTo(l, t + c);
      ctx.lineTo(l, b - c);
      ctx.lineTo(l + c, b);
      ctx.lineTo(r - c, b);
      ctx.lineTo(r, b - c);
      ctx.lineTo(r, cy + 2);
      ctx.lineTo(r - c, cy - 1.5);
      ctx.lineTo(l, cy - 1.5);
      ctx.stroke();
      break;
    }
    case '7': {
      ctx.beginPath();
      ctx.moveTo(l - hw, t);
      ctx.lineTo(r, t);
      ctx.lineTo(r, t + 4.5);
      ctx.lineTo(cx - 2, b + hw);
      ctx.stroke();
      break;
    }
    case '8': {
      drawOctagon(l + 0.5, t, r - 0.5, cy + 0.8, 3.6);
      drawOctagon(l, cy - 0.8, r, b, 3.6);
      break;
    }
    case '9': {
      ctx.beginPath();
      ctx.moveTo(l, b - c);
      ctx.lineTo(l + c, b);
      ctx.lineTo(r - c, b);
      ctx.lineTo(r, b - c);
      ctx.lineTo(r, t + c);
      ctx.lineTo(r - c, t);
      ctx.lineTo(l + c, t);
      ctx.lineTo(l, t + c);
      ctx.lineTo(l, cy - 2);
      ctx.lineTo(l + c, cy + 1.5);
      ctx.lineTo(r, cy + 1.5);
      ctx.stroke();
      break;
    }
  }

  // Tactical 1.2px aerospace stencil micro-slits
  ctx.fillStyle = '#000000';
  if (char === '0' || char === '8') {
    ctx.fillRect(cx - 0.7, box.y0, 1.4, sw + 1);
    ctx.fillRect(cx - 0.7, box.y1 - sw - 1, 1.4, sw + 1);
  } else if (char === '4' || char === '6' || char === '9') {
    ctx.fillRect(box.x0, cy - 0.6, sw + 1.2, 1.2);
  }
}

// ============================================================================
// 6. KINETIK SEGMENTED PRO (Bespoke Beveled 7+Diagonal Watch Segments)
// ============================================================================
function drawKinetikMatrix(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'kinetik-matrix', box, options);
    return;
  }

  const x0 = box.x0;
  const x1 = box.x1;
  const y0 = box.y0;
  const y1 = box.y1;
  const cy = box.cy;
  const t = Math.max(2.2, Math.min(4.8, 3.4 * options.strokeScale));
  const gap = 0.85; // Crisp isolation channel

  ctx.fillStyle = '#FFFFFF';

  const hSeg = (lx: number, rx: number, y: number, dir: 'top' | 'mid' | 'bot') => {
    const a = lx + gap;
    const b = rx - gap;
    ctx.beginPath();
    if (dir === 'top') {
      ctx.moveTo(a, y);
      ctx.lineTo(b, y);
      ctx.lineTo(b - t, y + t);
      ctx.lineTo(a + t, y + t);
    } else if (dir === 'bot') {
      ctx.moveTo(a + t, y - t);
      ctx.lineTo(b - t, y - t);
      ctx.lineTo(b, y);
      ctx.lineTo(a, y);
    } else {
      const ht = t * 0.52;
      ctx.moveTo(a + ht, y - ht);
      ctx.lineTo(b - ht, y - ht);
      ctx.lineTo(b, y);
      ctx.lineTo(b - ht, y + ht);
      ctx.lineTo(a + ht, y + ht);
      ctx.lineTo(a, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  const vSeg = (x: number, ty: number, by: number, side: 'left' | 'right') => {
    const a = ty + gap;
    const b = by - gap;
    ctx.beginPath();
    if (side === 'left') {
      ctx.moveTo(x, a);
      ctx.lineTo(x + t, a + t);
      ctx.lineTo(x + t, b - t * 0.6);
      ctx.lineTo(x, b);
    } else {
      ctx.moveTo(x, a);
      ctx.lineTo(x, b);
      ctx.lineTo(x - t, b - t * 0.6);
      ctx.lineTo(x - t, a + t);
    }
    ctx.closePath();
    ctx.fill();
  };

  const map: Record<string, string[]> = {
    '0': ['A', 'B', 'C', 'D', 'E', 'F', 'SL'],
    '1': ['B', 'C'],
    '2': ['A', 'B', 'G', 'E', 'D'],
    '3': ['A', 'B', 'G', 'C', 'D'],
    '4': ['F', 'G', 'B', 'C'],
    '5': ['A', 'F', 'G', 'C', 'D'],
    '6': ['A', 'F', 'G', 'E', 'C', 'D'],
    '7': ['A', 'B', 'C'],
    '8': ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    '9': ['A', 'B', 'C', 'D', 'F', 'G'],
  };

  const segs = map[char] || [];
  if (segs.includes('A')) hSeg(x0, x1, y0, 'top');
  if (segs.includes('D')) hSeg(x0, x1, y1, 'bot');
  if (segs.includes('G')) hSeg(x0 + 0.8, x1 - 0.8, cy, 'mid');
  if (segs.includes('F')) vSeg(x0, y0, cy, 'left');
  if (segs.includes('E')) vSeg(x0, cy, y1, 'left');
  if (segs.includes('B')) vSeg(x1, y0, cy, 'right');
  if (segs.includes('C')) vSeg(x1, cy, y1, 'right');

  // High-tech diagonal slash inside 0
  if (segs.includes('SL')) {
    ctx.beginPath();
    ctx.moveTo(x1 - t - 1.5, y0 + t + 3);
    ctx.lineTo(x1 - t + 0.6, y0 + t + 3);
    ctx.lineTo(x0 + t + 1.5, y1 - t - 3);
    ctx.lineTo(x0 + t - 0.6, y1 - t - 3);
    ctx.closePath();
    ctx.fill();
  }
}

// ============================================================================
// 7. MECHA-KATANA SLANT (Cyberpunk Aggressive 10° Italic Blade Cuts)
// ============================================================================
function drawMechaKatana(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'mecha-katana', box, options);
    return;
  }

  ctx.save();
  // Apply crisp forward italic shear centered on the box
  const skew = -0.15;
  ctx.translate(box.cx, box.cy);
  ctx.transform(1, 0, skew, 1, 0, 0);
  ctx.translate(-box.cx, -box.cy);

  // Slightly inset horizontally so slanted top/bottom don't clip 25x50 bounds
  const sw = Math.max(2.0, Math.min(4.6, 3.2 * options.strokeScale));
  const hw = sw / 2;
  const l = box.x0 + hw + 2.4;
  const r = box.x1 - hw - 2.4;
  const t = box.y0 + hw;
  const b = box.y1 - hw;
  const cx = box.cx;
  const cy = box.cy;

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = sw;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';

  switch (char) {
    case '0': {
      ctx.beginPath();
      ctx.moveTo(l + 3.5, t);
      ctx.lineTo(r, t);
      ctx.lineTo(r, b - 3.5);
      ctx.lineTo(r - 3.5, b);
      ctx.lineTo(l, b);
      ctx.lineTo(l, t + 3.5);
      ctx.closePath();
      ctx.stroke();
      // Katana slash accent
      ctx.lineWidth = Math.max(1.2, sw * 0.55);
      ctx.beginPath();
      ctx.moveTo(l + 3.5, b - 6);
      ctx.lineTo(r - 3.5, t + 6);
      ctx.stroke();
      break;
    }
    case '1': {
      const sx = cx + 1.2;
      ctx.beginPath();
      ctx.moveTo(l + 0.5, t + 6);
      ctx.lineTo(sx, t);
      ctx.lineTo(sx, b + hw);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(l, b);
      ctx.lineTo(r, b);
      ctx.stroke();
      break;
    }
    case '2': {
      ctx.beginPath();
      ctx.moveTo(l, t + 4.5);
      ctx.lineTo(l + 4, t);
      ctx.lineTo(r, t);
      ctx.lineTo(r, cy - 2);
      ctx.lineTo(l, cy + 5);
      ctx.lineTo(l, b);
      ctx.lineTo(r + 1, b);
      ctx.stroke();
      break;
    }
    case '3': {
      ctx.beginPath();
      ctx.moveTo(l, t);
      ctx.lineTo(r, t);
      ctx.lineTo(r, cy - 2);
      ctx.lineTo(cx - 2, cy);
      ctx.lineTo(r, cy + 2);
      ctx.lineTo(r, b);
      ctx.lineTo(l, b);
      ctx.stroke();
      break;
    }
    case '4': {
      const barY = cy + 4.5;
      const sx = r - 2.2;
      ctx.beginPath();
      ctx.moveTo(sx, b + hw);
      ctx.lineTo(sx, t);
      ctx.lineTo(l, barY);
      ctx.lineTo(r + 1, barY);
      ctx.stroke();
      break;
    }
    case '5': {
      ctx.beginPath();
      ctx.moveTo(r + 0.5, t);
      ctx.lineTo(l, t);
      ctx.lineTo(l, cy - 1);
      ctx.lineTo(r, cy - 1);
      ctx.lineTo(r, b - 3.5);
      ctx.lineTo(r - 3.5, b);
      ctx.lineTo(l, b);
      ctx.stroke();
      break;
    }
    case '6': {
      ctx.beginPath();
      ctx.moveTo(r, t);
      ctx.lineTo(l + 3.5, t);
      ctx.lineTo(l, t + 3.5);
      ctx.lineTo(l, b);
      ctx.lineTo(r, b);
      ctx.lineTo(r, cy);
      ctx.lineTo(l, cy);
      ctx.stroke();
      break;
    }
    case '7': {
      ctx.beginPath();
      ctx.moveTo(l - 1, t);
      ctx.lineTo(r, t);
      ctx.lineTo(cx - 1.5, b + hw);
      ctx.stroke();
      break;
    }
    case '8': {
      ctx.beginPath();
      ctx.moveTo(l + 3, t);
      ctx.lineTo(r, t);
      ctx.lineTo(r, b - 3);
      ctx.lineTo(r - 3, b);
      ctx.lineTo(l, b);
      ctx.lineTo(l, t + 3);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(l, cy);
      ctx.lineTo(r, cy);
      ctx.stroke();
      break;
    }
    case '9': {
      ctx.beginPath();
      ctx.moveTo(l, b);
      ctx.lineTo(r - 3.5, b);
      ctx.lineTo(r, b - 3.5);
      ctx.lineTo(r, t);
      ctx.lineTo(l, t);
      ctx.lineTo(l, cy);
      ctx.lineTo(r, cy);
      ctx.stroke();
      break;
    }
  }
  ctx.restore();

  // Carve aggressive cybernetic blade notch on upper-left/lower-right
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(box.x0, box.y0 + 13);
  ctx.lineTo(box.x0 + 7, box.y0 + 10);
  ctx.lineTo(box.x0 + 7, box.y0 + 11.4);
  ctx.lineTo(box.x0, box.y0 + 14.4);
  ctx.closePath();
  ctx.fill();
}

// ============================================================================
// 8. GLITCH-SECTOR 2099 (Cyberpunk Scanline Displacement & Signal Breaks)
// ============================================================================
function drawGlitch2099(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'glitch-2099', box, options);
    return;
  }

  // Render crisp angular tech digit first onto temporary canvas, then slice-shift bands
  const tmp = document.createElement('canvas');
  tmp.width = GLYPH_WIDTH;
  tmp.height = GLYPH_HEIGHT;
  const tctx = tmp.getContext('2d')!;
  tctx.fillStyle = '#000000';
  tctx.fillRect(0, 0, GLYPH_WIDTH, GLYPH_HEIGHT);

  const sw = Math.max(2.0, Math.min(4.6, 3.2 * options.strokeScale));
  const hw = sw / 2;
  const l = box.x0 + hw + 1;
  const r = box.x1 - hw - 1;
  const t = box.y0 + hw;
  const b = box.y1 - hw;
  const cx = box.cx;
  const cy = box.cy;

  tctx.strokeStyle = '#FFFFFF';
  tctx.lineWidth = sw;
  tctx.lineCap = 'square';
  tctx.lineJoin = 'miter';

  switch (char) {
    case '0':
      tctx.strokeRect(l, t, r - l, b - t);
      tctx.fillStyle = '#FFFFFF';
      tctx.fillRect(cx - 1.5, cy - 3.5, 3, 7);
      break;
    case '1':
      tctx.beginPath();
      tctx.moveTo(l + 1.5, t + 4.5);
      tctx.lineTo(cx + 1, t);
      tctx.lineTo(cx + 1, b);
      tctx.moveTo(l + 1, b);
      tctx.lineTo(r - 1, b);
      tctx.stroke();
      break;
    case '2':
      tctx.beginPath();
      tctx.moveTo(l, t + 3);
      tctx.lineTo(l, t);
      tctx.lineTo(r, t);
      tctx.lineTo(r, cy - 1);
      tctx.lineTo(l, cy + 1);
      tctx.lineTo(l, b);
      tctx.lineTo(r, b);
      tctx.stroke();
      break;
    case '3':
      tctx.beginPath();
      tctx.moveTo(l, t);
      tctx.lineTo(r, t);
      tctx.lineTo(r, b);
      tctx.lineTo(l, b);
      tctx.moveTo(l + 3, cy);
      tctx.lineTo(r, cy);
      tctx.stroke();
      break;
    case '4':
      tctx.beginPath();
      tctx.moveTo(l, t);
      tctx.lineTo(l, cy + 3);
      tctx.lineTo(r, cy + 3);
      tctx.moveTo(r - 2, t);
      tctx.lineTo(r - 2, b);
      tctx.stroke();
      break;
    case '5':
      tctx.beginPath();
      tctx.moveTo(r, t);
      tctx.lineTo(l, t);
      tctx.lineTo(l, cy);
      tctx.lineTo(r, cy);
      tctx.lineTo(r, b);
      tctx.lineTo(l, b);
      tctx.stroke();
      break;
    case '6':
      tctx.beginPath();
      tctx.moveTo(r, t);
      tctx.lineTo(l, t);
      tctx.lineTo(l, b);
      tctx.lineTo(r, b);
      tctx.lineTo(r, cy);
      tctx.lineTo(l, cy);
      tctx.stroke();
      break;
    case '7':
      tctx.beginPath();
      tctx.moveTo(l, t);
      tctx.lineTo(r, t);
      tctx.lineTo(r, cy - 2);
      tctx.lineTo(cx, b);
      tctx.stroke();
      break;
    case '8':
      tctx.strokeRect(l, t, r - l, b - t);
      tctx.beginPath();
      tctx.moveTo(l, cy);
      tctx.lineTo(r, cy);
      tctx.stroke();
      break;
    case '9':
      tctx.beginPath();
      tctx.moveTo(l, b);
      tctx.lineTo(r, b);
      tctx.lineTo(r, t);
      tctx.lineTo(l, t);
      tctx.lineTo(l, cy);
      tctx.lineTo(r, cy);
      tctx.stroke();
      break;
  }

  // Copy back with deterministic cyberpunk scanline slice displacements
  ctx.drawImage(tmp, 0, 0);
  // Shift band 1 (y: 11..15) +1px right
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 11, GLYPH_WIDTH, 4);
  ctx.drawImage(tmp, 0, 11, GLYPH_WIDTH, 4, 1, 11, GLYPH_WIDTH, 4);

  // Shift band 2 (y: 33..37) -1px left
  ctx.fillRect(0, 33, GLYPH_WIDTH, 4);
  ctx.drawImage(tmp, 0, 33, GLYPH_WIDTH, 4, -1, 33, GLYPH_WIDTH, 4);

  // Razor-sharp 1px horizontal signal break channels
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 15, GLYPH_WIDTH, 1);
  ctx.fillRect(0, 32, GLYPH_WIDTH, 1);

  // Cybernetic corner bracket micro-ticks
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(box.x0, box.y0, 2, 1);
  ctx.fillRect(box.x1 - 2, box.y1 - 1, 2, 1);
}

// ============================================================================
// 9. CIRCUIT-RAIL PCB (Cyberpunk 90°/45° Trace Geometry & Pad Nodes)
// ============================================================================
function drawCircuitRail(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.34;
    const yBot = box.y0 + box.h * 0.68;
    const r = Math.max(2.2, 2.8 * options.strokeScale);
    for (const y of [yTop, yBot]) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(box.cx - r, y - r, r * 2, r * 2);
      ctx.fillStyle = '#000000';
      ctx.fillRect(box.cx - 0.8, y - 0.8, 1.6, 1.6);
    }
    return;
  }

  const sw = Math.max(1.8, Math.min(4.2, 2.6 * options.strokeScale));
  const hw = sw / 2;
  const l = box.x0 + hw + 0.5;
  const r = box.x1 - hw - 0.5;
  const t = box.y0 + hw + 0.5;
  const b = box.y1 - hw - 0.5;
  const cx = box.cx;
  const cy = box.cy;
  const d = 4.0;

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = sw;
  ctx.lineCap = 'square';
  ctx.lineJoin = 'miter';

  const padNodes: [number, number][] = [];

  switch (char) {
    case '0': {
      ctx.beginPath();
      ctx.moveTo(l + d, t);
      ctx.lineTo(r - d, t);
      ctx.lineTo(r, t + d);
      ctx.lineTo(r, b - d);
      ctx.lineTo(r - d, b);
      ctx.lineTo(l + d, b);
      ctx.lineTo(l, b - d);
      ctx.lineTo(l, t + d);
      ctx.closePath();
      ctx.stroke();
      // Internal trace routing
      ctx.beginPath();
      ctx.moveTo(l, cy + 4);
      ctx.lineTo(cx - 2, cy + 4);
      ctx.lineTo(cx + 2, cy - 4);
      ctx.lineTo(r, cy - 4);
      ctx.stroke();
      break;
    }
    case '1': {
      const sx = cx + 2;
      ctx.beginPath();
      ctx.moveTo(l + 1.5, t + 5);
      ctx.lineTo(sx - 2, t);
      ctx.lineTo(sx, t);
      ctx.lineTo(sx, b);
      ctx.moveTo(l + 1.5, b);
      ctx.lineTo(r - 1.5, b);
      ctx.stroke();
      padNodes.push([l + 1.5, t + 5], [l + 1.5, b], [r - 1.5, b]);
      break;
    }
    case '2': {
      ctx.beginPath();
      ctx.moveTo(l, t + 5);
      ctx.lineTo(l + d, t);
      ctx.lineTo(r - d, t);
      ctx.lineTo(r, t + d);
      ctx.lineTo(r, cy - 3);
      ctx.lineTo(l, cy + 5);
      ctx.lineTo(l, b);
      ctx.lineTo(r, b);
      ctx.stroke();
      padNodes.push([l, t + 5], [r, b]);
      break;
    }
    case '3': {
      ctx.beginPath();
      ctx.moveTo(l, t);
      ctx.lineTo(r - d, t);
      ctx.lineTo(r, t + d);
      ctx.lineTo(r, cy - 2);
      ctx.lineTo(r - 2.5, cy);
      ctx.lineTo(cx - 1.5, cy);
      ctx.moveTo(r - 2.5, cy);
      ctx.lineTo(r, cy + 2);
      ctx.lineTo(r, b - d);
      ctx.lineTo(r - d, b);
      ctx.lineTo(l, b);
      ctx.stroke();
      padNodes.push([l, t], [cx - 1.5, cy], [l, b]);
      break;
    }
    case '4': {
      const barY = cy + 4;
      const sx = r - 2.5;
      ctx.beginPath();
      ctx.moveTo(l + 2, t);
      ctx.lineTo(l, t + 2);
      ctx.lineTo(l, barY);
      ctx.lineTo(r, barY);
      ctx.moveTo(sx, t);
      ctx.lineTo(sx, b);
      ctx.stroke();
      padNodes.push([l + 2, t], [sx, t], [sx, b], [r, barY]);
      break;
    }
    case '5': {
      ctx.beginPath();
      ctx.moveTo(r, t);
      ctx.lineTo(l, t);
      ctx.lineTo(l, cy - 1);
      ctx.lineTo(r - d, cy - 1);
      ctx.lineTo(r, cy + d - 1);
      ctx.lineTo(r, b - d);
      ctx.lineTo(r - d, b);
      ctx.lineTo(l, b);
      ctx.stroke();
      padNodes.push([r, t], [l, b]);
      break;
    }
    case '6': {
      ctx.beginPath();
      ctx.moveTo(r, t);
      ctx.lineTo(l + d, t);
      ctx.lineTo(l, t + d);
      ctx.lineTo(l, b - d);
      ctx.lineTo(l + d, b);
      ctx.lineTo(r - d, b);
      ctx.lineTo(r, b - d);
      ctx.lineTo(r, cy + 2);
      ctx.lineTo(r - d, cy - 1.5);
      ctx.lineTo(l, cy - 1.5);
      ctx.stroke();
      padNodes.push([r, t]);
      break;
    }
    case '7': {
      ctx.beginPath();
      ctx.moveTo(l, t + 4);
      ctx.lineTo(l, t);
      ctx.lineTo(r, t);
      ctx.lineTo(r, t + 5);
      ctx.lineTo(cx - 1.5, cy + 3);
      ctx.lineTo(cx - 1.5, b);
      ctx.stroke();
      padNodes.push([l, t + 4], [cx - 1.5, b]);
      break;
    }
    case '8': {
      ctx.beginPath();
      ctx.moveTo(l + d, t);
      ctx.lineTo(r - d, t);
      ctx.lineTo(r, t + d);
      ctx.lineTo(r, cy - 2);
      ctx.lineTo(r - 2.5, cy);
      ctx.lineTo(r, cy + 2);
      ctx.lineTo(r, b - d);
      ctx.lineTo(r - d, b);
      ctx.lineTo(l + d, b);
      ctx.lineTo(l, b - d);
      ctx.lineTo(l, cy + 2);
      ctx.lineTo(l + 2.5, cy);
      ctx.lineTo(l, cy - 2);
      ctx.lineTo(l, t + d);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(l + 2.5, cy);
      ctx.lineTo(r - 2.5, cy);
      ctx.stroke();
      break;
    }
    case '9': {
      ctx.beginPath();
      ctx.moveTo(l, b);
      ctx.lineTo(r - d, b);
      ctx.lineTo(r, b - d);
      ctx.lineTo(r, t + d);
      ctx.lineTo(r - d, t);
      ctx.lineTo(l + d, t);
      ctx.lineTo(l, t + d);
      ctx.lineTo(l, cy - 2);
      ctx.lineTo(l + d, cy + 1.5);
      ctx.lineTo(r, cy + 1.5);
      ctx.stroke();
      padNodes.push([l, b]);
      break;
    }
  }

  // Render PCB terminal pads (white ring + crisp black via hole)
  for (const [px, py] of padNodes) {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(px, py, 2.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(px, py, 0.85, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ============================================================================
// 10. BAUHAUS DISK GEOMETRY (Modernist Circle/Arc Minimalism)
// ============================================================================
function drawBauhausGeo(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'bauhaus-geo', box, options);
    return;
  }

  const sw = Math.max(1.8, Math.min(4.6, 2.9 * options.strokeScale));
  const hw = sw / 2;
  const l = box.x0 + hw;
  const r = box.x1 - hw;
  const t = box.y0 + hw;
  const b = box.y1 - hw;
  const cx = box.cx;
  const cy = box.cy;
  const rad = (r - l) / 2;

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = sw;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';

  switch (char) {
    case '0': {
      ctx.beginPath();
      ctx.arc(cx, t + rad, rad, Math.PI, 0);
      ctx.lineTo(r, b - rad);
      ctx.arc(cx, b - rad, rad, 0, Math.PI);
      ctx.closePath();
      ctx.stroke();
      // Center Bauhaus geometric dot
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case '1': {
      const sx = cx + 2;
      ctx.beginPath();
      ctx.moveTo(l + 2, t + 6);
      ctx.lineTo(sx, t);
      ctx.lineTo(sx, b + hw);
      ctx.stroke();
      break;
    }
    case '2': {
      ctx.beginPath();
      ctx.arc(cx, t + rad, rad, Math.PI, Math.PI * 0.15);
      ctx.lineTo(l, b);
      ctx.lineTo(r + hw, b);
      ctx.stroke();
      break;
    }
    case '3': {
      ctx.beginPath();
      ctx.arc(cx, t + rad, rad, -Math.PI * 0.85, Math.PI * 0.5);
      ctx.lineTo(cx - 2, t + rad * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, b - rad, rad, -Math.PI * 0.5, Math.PI * 0.85);
      ctx.stroke();
      break;
    }
    case '4': {
      const barY = cy + 5;
      ctx.beginPath();
      ctx.moveTo(r - 2.5, b + hw);
      ctx.lineTo(r - 2.5, t);
      ctx.lineTo(l, barY);
      ctx.lineTo(r + hw, barY);
      ctx.stroke();
      break;
    }
    case '5': {
      ctx.beginPath();
      ctx.moveTo(r + hw, t);
      ctx.lineTo(l + 1, t);
      ctx.lineTo(l + 1, cy - 2);
      ctx.lineTo(cx, cy - 2);
      ctx.arc(cx, b - rad, rad, -Math.PI / 2, Math.PI * 0.85);
      ctx.stroke();
      break;
    }
    case '6': {
      ctx.beginPath();
      ctx.arc(cx, b - rad, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(l, b - rad);
      ctx.lineTo(l, t + rad);
      ctx.arc(cx, t + rad, rad, Math.PI, -Math.PI * 0.15);
      ctx.stroke();
      break;
    }
    case '7': {
      ctx.beginPath();
      ctx.moveTo(l - hw, t);
      ctx.lineTo(r, t);
      ctx.lineTo(cx - 1.5, b + hw);
      ctx.stroke();
      break;
    }
    case '8': {
      const rTop = rad * 0.92;
      ctx.beginPath();
      ctx.arc(cx, t + rTop + 1, rTop, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, b - rad, rad, 0, Math.PI * 2);
      ctx.stroke();
      break;
    }
    case '9': {
      ctx.beginPath();
      ctx.arc(cx, t + rad, rad, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(r, t + rad);
      ctx.lineTo(r, b - rad);
      ctx.arc(cx, b - rad, rad, 0, Math.PI * 0.85);
      ctx.stroke();
      break;
    }
  }
}

// ============================================================================
// 11. HYPER-KINETIC SPORT (Bold Athletic Endurance Chronometer)
// ============================================================================
function drawHyperKinetic(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'hyper-kinetic', box, options);
    return;
  }

  ctx.save();
  ctx.translate(box.cx, box.cy);
  ctx.transform(1, 0, -0.1, 1, 0, 0);
  ctx.translate(-box.cx, -box.cy);

  const sw = Math.max(2.4, Math.min(5.2, 3.9 * options.strokeScale));
  const hw = sw / 2;
  const l = box.x0 + hw + 1.5;
  const r = box.x1 - hw - 1.5;
  const t = box.y0 + hw;
  const b = box.y1 - hw;
  const cx = box.cx;
  const cy = box.cy;

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = sw;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'round';

  switch (char) {
    case '0':
      ctx.beginPath();
      ctx.roundRect(l, t, r - l, b - t, 5);
      ctx.stroke();
      break;
    case '1':
      ctx.beginPath();
      ctx.moveTo(l + 0.5, t + 5);
      ctx.lineTo(cx + 1.5, t);
      ctx.lineTo(cx + 1.5, b + hw);
      ctx.moveTo(l + 0.5, b);
      ctx.lineTo(r, b);
      ctx.stroke();
      break;
    case '2':
      ctx.beginPath();
      ctx.moveTo(l, t + 5);
      ctx.lineTo(l + 3, t);
      ctx.lineTo(r - 2, t);
      ctx.lineTo(r, t + 4);
      ctx.lineTo(r, cy - 2);
      ctx.lineTo(l, cy + 5);
      ctx.lineTo(l, b);
      ctx.lineTo(r + 0.5, b);
      ctx.stroke();
      break;
    case '3':
      ctx.beginPath();
      ctx.moveTo(l, t + 3);
      ctx.lineTo(l + 3, t);
      ctx.lineTo(r - 2, t);
      ctx.lineTo(r, t + 3.5);
      ctx.lineTo(r, cy - 2.5);
      ctx.lineTo(cx - 2, cy);
      ctx.lineTo(r, cy + 2.5);
      ctx.lineTo(r, b - 3.5);
      ctx.lineTo(r - 2, b);
      ctx.lineTo(l + 3, b);
      ctx.lineTo(l, b - 3);
      ctx.stroke();
      break;
    case '4':
      ctx.beginPath();
      ctx.moveTo(r - 2, b + hw);
      ctx.lineTo(r - 2, t);
      ctx.lineTo(l, cy + 4);
      ctx.lineTo(r + 0.5, cy + 4);
      ctx.stroke();
      break;
    case '5':
      ctx.beginPath();
      ctx.moveTo(r + 0.5, t);
      ctx.lineTo(l, t);
      ctx.lineTo(l, cy - 1.5);
      ctx.lineTo(r - 2.5, cy - 1.5);
      ctx.lineTo(r, cy + 2.5);
      ctx.lineTo(r, b - 3.5);
      ctx.lineTo(r - 2.5, b);
      ctx.lineTo(l, b);
      ctx.stroke();
      break;
    case '6':
      ctx.beginPath();
      ctx.moveTo(r, t + 2);
      ctx.lineTo(r - 2.5, t);
      ctx.lineTo(l + 2.5, t);
      ctx.lineTo(l, t + 3.5);
      ctx.lineTo(l, b - 3.5);
      ctx.lineTo(l + 2.5, b);
      ctx.lineTo(r - 2.5, b);
      ctx.lineTo(r, b - 3.5);
      ctx.lineTo(r, cy + 2);
      ctx.lineTo(r - 2.5, cy - 1.5);
      ctx.lineTo(l, cy - 1.5);
      ctx.stroke();
      break;
    case '7':
      ctx.beginPath();
      ctx.moveTo(l - 0.5, t);
      ctx.lineTo(r, t);
      ctx.lineTo(cx - 1.5, b + hw);
      ctx.stroke();
      break;
    case '8':
      ctx.beginPath();
      ctx.roundRect(l, t, r - l, b - t, 4.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(l, cy);
      ctx.lineTo(r, cy);
      ctx.stroke();
      break;
    case '9':
      ctx.beginPath();
      ctx.moveTo(l, b - 2);
      ctx.lineTo(l + 2.5, b);
      ctx.lineTo(r - 2.5, b);
      ctx.lineTo(r, b - 3.5);
      ctx.lineTo(r, t + 3.5);
      ctx.lineTo(r - 2.5, t);
      ctx.lineTo(l + 2.5, t);
      ctx.lineTo(l, t + 3.5);
      ctx.lineTo(l, cy - 2);
      ctx.lineTo(l + 2.5, cy + 1.5);
      ctx.lineTo(r, cy + 1.5);
      ctx.stroke();
      break;
  }
  ctx.restore();
}

// ============================================================================
// 12. ATELIER LUXURY STENCIL (Haute-Couture Stencil Horology)
// ============================================================================
function drawAtelierStencil(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'atelier-stencil', box, options);
    return;
  }

  // Draw refined high-contrast horology base, then carve surgical boutique stencil bridges
  drawChronosHorology(ctx, char, box, options);

  ctx.fillStyle = '#000000';
  const gap = 1.6;
  const cx = box.cx;
  const cy = box.cy;

  if (char === '0' || char === '8') {
    ctx.fillRect(cx - gap / 2, box.y0 - 1, gap, 6);
    ctx.fillRect(cx - gap / 2, box.y1 - 5, gap, 6);
  }
  if (char === '1' || char === '4' || char === '7') {
    ctx.fillRect(box.x0, cy - 0.8, box.w, 1.6);
  }
  if (char === '2' || char === '3' || char === '5') {
    ctx.fillRect(cx - 0.8, box.y0 - 1, 1.6, 5);
    ctx.fillRect(cx - 0.8, box.y1 - 4, 1.6, 5);
  }
  if (char === '6' || char === '9') {
    ctx.fillRect(box.x0, cy - 0.9, box.w, 1.8);
  }
}

// ============================================================================
// 13. OBSIDIAN DOUBLE-LINE (Engraved Jewelry Inline Numerals)
// ============================================================================
function drawObsidianInline(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.34;
    const yBot = box.y0 + box.h * 0.68;
    const d = Math.max(2.6, 3.2 * options.strokeScale);
    for (const y of [yTop, yBot]) {
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(box.cx, y - d);
      ctx.lineTo(box.cx + d, y);
      ctx.lineTo(box.cx, y + d);
      ctx.lineTo(box.cx - d, y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(box.cx, y - d * 0.42);
      ctx.lineTo(box.cx + d * 0.42, y);
      ctx.lineTo(box.cx, y + d * 0.42);
      ctx.lineTo(box.cx - d * 0.42, y);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }

  // Outer thick white stroke followed by inner crisp black pinstripe engraving
  const swOuter = Math.max(3.4, Math.min(5.6, 4.6 * options.strokeScale));
  const swInner = Math.max(1.1, Math.min(2.0, 1.35 * options.strokeScale));
  const hw = swOuter / 2;
  const l = box.x0 + hw;
  const r = box.x1 - hw;
  const t = box.y0 + hw;
  const b = box.y1 - hw;
  const cx = box.cx;
  const cy = box.cy;

  const traceDigit = () => {
    ctx.beginPath();
    switch (char) {
      case '0':
        ctx.roundRect(l, t, r - l, b - t, 6);
        break;
      case '1':
        ctx.moveTo(l + 1.5, t + 5.5);
        ctx.lineTo(cx + 1.5, t + 0.5);
        ctx.lineTo(cx + 1.5, b);
        ctx.moveTo(l + 1.5, b);
        ctx.lineTo(r - 1, b);
        break;
      case '2':
        ctx.moveTo(l, t + 6);
        ctx.quadraticCurveTo(l, t, cx, t);
        ctx.quadraticCurveTo(r, t, r, t + 7);
        ctx.bezierCurveTo(r, cy, l + 1, cy + 4, l, b);
        ctx.lineTo(r, b);
        break;
      case '3':
        ctx.moveTo(l + 0.5, t + 5);
        ctx.quadraticCurveTo(l + 1, t, cx, t);
        ctx.quadraticCurveTo(r, t, r, t + 6.5);
        ctx.quadraticCurveTo(r, cy - 0.5, cx - 1, cy - 0.5);
        ctx.quadraticCurveTo(r, cy, r, cy + 8);
        ctx.quadraticCurveTo(r, b, cx, b);
        ctx.quadraticCurveTo(l + 0.5, b, l, b - 5);
        break;
      case '4': {
        const barY = cy + 5;
        const sx = r - 3;
        ctx.moveTo(sx, b);
        ctx.lineTo(sx, t);
        ctx.lineTo(l, barY);
        ctx.lineTo(r, barY);
        break;
      }
      case '5':
        ctx.moveTo(r, t);
        ctx.lineTo(l + 0.8, t);
        ctx.lineTo(l + 0.3, cy - 2);
        ctx.quadraticCurveTo(cx + 1, cy - 3.5, r, cy + 4.5);
        ctx.quadraticCurveTo(r, b, cx, b);
        ctx.quadraticCurveTo(l + 0.5, b, l, b - 5);
        break;
      case '6':
        ctx.moveTo(r - 0.5, t + 4.5);
        ctx.quadraticCurveTo(r - 1, t, cx + 0.5, t);
        ctx.quadraticCurveTo(l, t, l, t + 10);
        ctx.lineTo(l, b - 7);
        ctx.quadraticCurveTo(l, b, cx, b);
        ctx.quadraticCurveTo(r, b, r, cy + 7);
        ctx.quadraticCurveTo(r, cy - 1, cx, cy - 1);
        ctx.quadraticCurveTo(l, cy - 1, l, cy + 5.5);
        break;
      case '7':
        ctx.moveTo(l, t);
        ctx.lineTo(r, t);
        ctx.lineTo(l + 4.5, b);
        break;
      case '8':
        ctx.roundRect(l + 0.6, t, r - l - 1.2, cy - t + 1.2, 4.8);
        ctx.roundRect(l, cy - 1.2, r - l, b - cy + 1.2, 5.2);
        break;
      case '9':
        ctx.moveTo(l + 0.5, b - 4.5);
        ctx.quadraticCurveTo(l + 1, b, cx - 0.5, b);
        ctx.quadraticCurveTo(r, b, r, b - 10);
        ctx.lineTo(r, t + 7);
        ctx.quadraticCurveTo(r, t, cx, t);
        ctx.quadraticCurveTo(l, t, l, cy - 7);
        ctx.quadraticCurveTo(l, cy + 1, cx, cy + 1);
        ctx.quadraticCurveTo(r, cy + 1, r, cy - 5.5);
        break;
    }
  };

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = swOuter;
  traceDigit();
  ctx.stroke();

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = swInner;
  traceDigit();
  ctx.stroke();
}

// ============================================================================
// 14. QUANTUM MICRO-MATRIX (Precision 5×9 Circular Micro-LED Matrix)
// ============================================================================
const DOT_MATRIX_FONT: Record<string, string[]> = {
  '0': [
    '01110',
    '10001',
    '10011',
    '10101',
    '10101',
    '10101',
    '11001',
    '10001',
    '01110',
  ],
  '1': [
    '00100',
    '01100',
    '10100',
    '00100',
    '00100',
    '00100',
    '00100',
    '00100',
    '11111',
  ],
  '2': [
    '01110',
    '10001',
    '00001',
    '00010',
    '00100',
    '01000',
    '10000',
    '10001',
    '11111',
  ],
  '3': [
    '01110',
    '10001',
    '00001',
    '00001',
    '00110',
    '00001',
    '00001',
    '10001',
    '01110',
  ],
  '4': [
    '00010',
    '00110',
    '01010',
    '10010',
    '10010',
    '11111',
    '00010',
    '00010',
    '00010',
  ],
  '5': [
    '11111',
    '10000',
    '10000',
    '11110',
    '00001',
    '00001',
    '00001',
    '10001',
    '01110',
  ],
  '6': [
    '01110',
    '10001',
    '10000',
    '10000',
    '11110',
    '10001',
    '10001',
    '10001',
    '01110',
  ],
  '7': [
    '11111',
    '10001',
    '00001',
    '00010',
    '00100',
    '00100',
    '01000',
    '01000',
    '01000',
  ],
  '8': [
    '01110',
    '10001',
    '10001',
    '10001',
    '01110',
    '10001',
    '10001',
    '10001',
    '01110',
  ],
  '9': [
    '01110',
    '10001',
    '10001',
    '10001',
    '01111',
    '00001',
    '00001',
    '10001',
    '01110',
  ],
  ':': [
    '00000',
    '00000',
    '00100',
    '00100',
    '00000',
    '00100',
    '00100',
    '00000',
    '00000',
  ],
};

function drawQuantumDot(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  const rows = DOT_MATRIX_FONT[char];
  if (!rows) return;
  const cols = 5;
  const rowCount = 9;
  const stepX = box.w / cols;
  const stepY = box.h / rowCount;
  const dotR = Math.max(1.1, Math.min(2.2, 1.55 * options.strokeScale));

  ctx.fillStyle = '#FFFFFF';
  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < cols; c++) {
      if (rows[r][c] === '1') {
        const px = box.x0 + (c + 0.5) * stepX;
        const py = box.y0 + (r + 0.5) * stepY;
        ctx.beginPath();
        ctx.arc(px, py, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

// ============================================================================
// 15. ORBITAL DUAL-TRACK (Twin-Rail Space Instrument Tubing)
// ============================================================================
function drawOrbitalDual(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.34;
    const yBot = box.y0 + box.h * 0.68;
    const r = Math.max(2.2, 2.7 * options.strokeScale);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.4;
    for (const y of [yTop, yBot]) {
      ctx.beginPath();
      ctx.arc(box.cx, y, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    return;
  }

  // Draw bold futuristic path, then carve concentric inner black track channel
  const outerW = Math.max(3.6, Math.min(5.8, 4.7 * options.strokeScale));
  const innerW = Math.max(1.3, Math.min(2.3, 1.7 * options.strokeScale));
  const hw = outerW / 2;
  const l = box.x0 + hw;
  const r = box.x1 - hw;
  const t = box.y0 + hw;
  const b = box.y1 - hw;
  const cx = box.cx;
  const cy = box.cy;
  const ch = 4.0;

  const traceOrbital = () => {
    ctx.beginPath();
    switch (char) {
      case '0':
        ctx.roundRect(l, t, r - l, b - t, 5.5);
        break;
      case '1':
        ctx.moveTo(l + 2, t + 5.5);
        ctx.lineTo(cx + 1.5, t + 0.5);
        ctx.lineTo(cx + 1.5, b);
        break;
      case '2':
        ctx.moveTo(l, t + ch);
        ctx.lineTo(l + ch, t);
        ctx.lineTo(r - ch, t);
        ctx.lineTo(r, t + ch);
        ctx.lineTo(r, cy - 2);
        ctx.lineTo(l, cy + 5);
        ctx.lineTo(l, b);
        ctx.lineTo(r, b);
        break;
      case '3':
        ctx.moveTo(l, t + 3.5);
        ctx.lineTo(l + ch, t);
        ctx.lineTo(r - ch, t);
        ctx.lineTo(r, t + ch);
        ctx.lineTo(r, cy - 2.5);
        ctx.lineTo(cx - 1.5, cy);
        ctx.lineTo(r, cy + 2.5);
        ctx.lineTo(r, b - ch);
        ctx.lineTo(r - ch, b);
        ctx.lineTo(l + ch, b);
        ctx.lineTo(l, b - 3.5);
        break;
      case '4':
        ctx.moveTo(r - 2.5, b);
        ctx.lineTo(r - 2.5, t);
        ctx.lineTo(l, cy + 4.5);
        ctx.lineTo(r, cy + 4.5);
        break;
      case '5':
        ctx.moveTo(r, t);
        ctx.lineTo(l, t);
        ctx.lineTo(l, cy - 1.5);
        ctx.lineTo(r - ch, cy - 1.5);
        ctx.lineTo(r, cy + ch - 1.5);
        ctx.lineTo(r, b - ch);
        ctx.lineTo(r - ch, b);
        ctx.lineTo(l, b);
        break;
      case '6':
        ctx.moveTo(r, t + 3);
        ctx.lineTo(r - ch, t);
        ctx.lineTo(l + ch, t);
        ctx.lineTo(l, t + ch);
        ctx.lineTo(l, b - ch);
        ctx.lineTo(l + ch, b);
        ctx.lineTo(r - ch, b);
        ctx.lineTo(r, b - ch);
        ctx.lineTo(r, cy + 2);
        ctx.lineTo(r - ch, cy - 1.5);
        ctx.lineTo(l, cy - 1.5);
        break;
      case '7':
        ctx.moveTo(l, t);
        ctx.lineTo(r, t);
        ctx.lineTo(cx - 1.5, b);
        break;
      case '8':
        ctx.roundRect(l, t, r - l, b - t, 5);
        ctx.moveTo(l, cy);
        ctx.lineTo(r, cy);
        break;
      case '9':
        ctx.moveTo(l, b - 3);
        ctx.lineTo(l + ch, b);
        ctx.lineTo(r - ch, b);
        ctx.lineTo(r, b - ch);
        ctx.lineTo(r, t + ch);
        ctx.lineTo(r - ch, t);
        ctx.lineTo(l + ch, t);
        ctx.lineTo(l, t + ch);
        ctx.lineTo(l, cy - 2);
        ctx.lineTo(l + ch, cy + 1.5);
        ctx.lineTo(r, cy + 1.5);
        break;
    }
  };

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = outerW;
  traceOrbital();
  ctx.stroke();

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = innerW;
  traceOrbital();
  ctx.stroke();
}

// ============================================================================
// 16. NEO-SHIBUYA CYBER (Katakana-Inspired Urban Streetwear)
// ============================================================================
function drawNeoKanjiTech(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'neo-kanji-tech', box, options);
    return;
  }

  const l = box.x0;
  const r = box.x1;
  const t = box.y0;
  const b = box.y1;
  const w = box.w;
  const h = box.h;
  const cx = box.cx;
  const cy = box.cy;
  const bar = Math.max(3.5, Math.min(6.5, 5.2 * options.strokeScale));
  const stem = Math.max(2.2, Math.min(4.2, 3.0 * options.strokeScale));

  ctx.fillStyle = '#FFFFFF';

  switch (char) {
    case '0': {
      ctx.fillRect(l, t, w, bar);
      ctx.fillRect(l, b - bar, w, bar);
      ctx.fillRect(l, t, stem, h);
      ctx.fillRect(r - stem, t, stem, h);
      // Katakana-style diagonal interior flick
      ctx.beginPath();
      ctx.moveTo(l + stem + 2, cy + 4);
      ctx.lineTo(r - stem - 2, cy - 6);
      ctx.lineTo(r - stem - 2, cy - 3);
      ctx.lineTo(l + stem + 2, cy + 7);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case '1': {
      const sx = cx + 1.5;
      ctx.fillRect(sx - stem / 2, t, stem, h);
      ctx.beginPath();
      ctx.moveTo(l + 1, t + 7);
      ctx.lineTo(sx + stem / 2, t);
      ctx.lineTo(sx + stem / 2, t + 4.5);
      ctx.lineTo(l + 1, t + 10.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(l + 1, b - bar, w - 2, bar);
      break;
    }
    case '2': {
      ctx.fillRect(l, t, w, bar);
      ctx.fillRect(r - stem, t, stem, cy - t + 1);
      ctx.fillRect(l, cy - 1.5, w, stem);
      ctx.fillRect(l, cy - 1.5, stem, b - cy + 1.5);
      ctx.fillRect(l, b - bar, w, bar);
      // Angled top-left hook
      ctx.fillRect(l, t, stem, 8);
      break;
    }
    case '3': {
      ctx.fillRect(l, t, w, bar);
      ctx.fillRect(l, b - bar, w, bar);
      ctx.fillRect(r - stem, t, stem, h);
      ctx.fillRect(cx - 3, cy - stem / 2, w / 2 + 3, stem);
      ctx.fillRect(l, t, stem, 6.5);
      ctx.fillRect(l, b - 6.5, stem, 6.5);
      break;
    }
    case '4': {
      const barY = cy + 4;
      const sx = r - stem - 2;
      ctx.fillRect(sx, t, stem, h);
      ctx.fillRect(l, barY, w, bar * 0.85);
      ctx.beginPath();
      ctx.moveTo(sx, t);
      ctx.lineTo(sx + stem, t);
      ctx.lineTo(l + stem, barY);
      ctx.lineTo(l, barY);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case '5': {
      ctx.fillRect(l, t, w, bar);
      ctx.fillRect(l, t, stem, cy - t + 1);
      ctx.fillRect(l, cy - 1.5, w, stem);
      ctx.fillRect(r - stem, cy - 1.5, stem, b - cy + 1.5);
      ctx.fillRect(l, b - bar, w, bar);
      ctx.fillRect(l, b - 7, stem, 7);
      break;
    }
    case '6': {
      ctx.fillRect(l, t, w, bar);
      ctx.fillRect(l, t, stem, h);
      ctx.fillRect(l, cy - 1.5, w, stem);
      ctx.fillRect(r - stem, cy - 1.5, stem, b - cy + 1.5);
      ctx.fillRect(l, b - bar, w, bar);
      break;
    }
    case '7': {
      ctx.fillRect(l, t, w, bar);
      ctx.fillRect(l, t, stem, 9);
      ctx.beginPath();
      ctx.moveTo(r - stem, t + bar);
      ctx.lineTo(r, t + bar);
      ctx.lineTo(cx, b);
      ctx.lineTo(cx - stem, b);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case '8': {
      ctx.fillRect(l, t, w, bar);
      ctx.fillRect(l, b - bar, w, bar);
      ctx.fillRect(l, cy - stem / 2, w, stem);
      ctx.fillRect(l, t, stem, h);
      ctx.fillRect(r - stem, t, stem, h);
      break;
    }
    case '9': {
      ctx.fillRect(l, t, w, bar);
      ctx.fillRect(r - stem, t, stem, h);
      ctx.fillRect(l, t, stem, cy - t + 1);
      ctx.fillRect(l, cy - 1.5, w, stem);
      ctx.fillRect(l, b - bar, w, bar);
      break;
    }
  }
}

// ============================================================================
// 17. HOLO-CRT SCANLINE (Holographic Raster Scanline Projection)
// ============================================================================
function drawHoloScanline(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'holo-scanline', box, options);
    return;
  }

  // Render bold structural monolith base, then slice horizontal holographic CRT scanlines across interior
  drawMonolithSlab(ctx, char, box, options);

  ctx.fillStyle = '#000000';
  // Preserve outer 2px top/bottom edges for solid silhouette, scanline every 3rd row inside
  for (let y = Math.round(box.y0) + 3; y <= Math.round(box.y1) - 3; y += 3) {
    ctx.fillRect(0, y, GLYPH_WIDTH, 1);
  }
}

// ============================================================================
// 18. EXO-FRAME ARMORED (Tactical Exoskeleton Cyber Brackets)
// ============================================================================
function drawExoFrameBracket(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'exo-frame-bracket', box, options);
    return;
  }

  // Heavy chamfered armored base
  drawMonolithSlab(ctx, char, box, options);

  const cx = box.cx;
  const cy = box.cy;

  // Carve tactical diagonal corner notches & side bracket vents
  ctx.fillStyle = '#000000';
  // Top-right & bottom-left heavy 45° armor chamfers
  const c = 4.5;
  ctx.beginPath();
  ctx.moveTo(box.x1 - c, box.y0);
  ctx.lineTo(box.x1 + 1, box.y0);
  ctx.lineTo(box.x1 + 1, box.y0 + c);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(box.x0 - 1, box.y1 - c);
  ctx.lineTo(box.x0 - 1, box.y1 + 1);
  ctx.lineTo(box.x0 + c, box.y1 + 1);
  ctx.closePath();
  ctx.fill();

  // Horizontal armored split vent on left & right mid-flank
  ctx.fillRect(box.x0 - 1, cy - 0.8, 3.2, 1.6);
  ctx.fillRect(box.x1 - 2.2, cy - 0.8, 3.2, 1.6);

  // Subtle vertical center lock-notch on top & bottom bars
  ctx.fillRect(cx - 0.7, box.y0 - 1, 1.4, 2.5);
  ctx.fillRect(cx - 0.7, box.y1 - 1.5, 1.4, 2.5);
}

// ============================================================================
// 19. KUROGANE CYBER BRUSH (Bold Artistic Mecha-Calligraphy Cyberpunk)
// ============================================================================
function drawKuroganeHeavy(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.33;
    const yBot = box.y0 + box.h * 0.67;
    const r = Math.max(2.5, 3.3 * options.strokeScale);
    ctx.fillStyle = '#FFFFFF';
    for (const y of [yTop, yBot]) {
      ctx.beginPath();
      ctx.moveTo(box.cx - r + 1.5, y - r);
      ctx.lineTo(box.cx + r + 1.0, y - r * 0.65);
      ctx.lineTo(box.cx + r - 1.5, y + r);
      ctx.lineTo(box.cx - r - 1.0, y + r * 0.65);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }

  const sw = Math.max(3.6, Math.min(6.4, 5.2 * options.strokeScale));
  const l = box.x0;
  const r = box.x1;
  const t = box.y0;
  const b = box.y1;
  const cx = box.cx;
  const cy = box.cy;

  ctx.fillStyle = '#FFFFFF';

  const drawBrushLoop = (lx: number, ty: number, rx: number, by: number, innerCut = true) => {
    // Bold artistic swept outer contour
    ctx.beginPath();
    ctx.moveTo(lx + 5, ty);
    ctx.lineTo(rx, ty);
    ctx.lineTo(rx, by - 5.5);
    ctx.lineTo(rx - 5.5, by);
    ctx.lineTo(lx, by);
    ctx.lineTo(lx, ty + 5.5);
    ctx.closePath();
    ctx.fill();

    if (innerCut) {
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(lx + sw + 1.5, ty + sw * 0.82);
      ctx.lineTo(rx - sw * 0.85, ty + sw * 0.82);
      ctx.lineTo(rx - sw * 0.85, by - sw * 0.82 - 2);
      ctx.lineTo(rx - sw - 1.5, by - sw * 0.82);
      ctx.lineTo(lx + sw * 0.85, by - sw * 0.82);
      ctx.lineTo(lx + sw * 0.85, ty + sw * 0.82 + 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#FFFFFF';
    }
  };

  switch (char) {
    case '0': {
      drawBrushLoop(l, t, r, b);
      // Artistic mecha-brush diagonal core stroke
      ctx.beginPath();
      ctx.moveTo(l + sw - 1, b - 8);
      ctx.lineTo(r - sw + 1, t + 8);
      ctx.lineTo(r - sw + 1, t + 11.5);
      ctx.lineTo(l + sw - 1, b - 4.5);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case '1': {
      const sx = cx - sw * 0.35;
      // Heavy slanted vertical pillar + aggressive katana flag + heavy wedge base
      ctx.beginPath();
      ctx.moveTo(l + 1, t + 7);
      ctx.lineTo(sx + 1, t);
      ctx.lineTo(sx + sw + 1, t);
      ctx.lineTo(sx + sw + 0.5, b);
      ctx.lineTo(sx - 0.5, b);
      ctx.lineTo(sx, t + 7);
      ctx.lineTo(l + 1, t + 11.5);
      ctx.closePath();
      ctx.fill();
      // Wedge base
      ctx.beginPath();
      ctx.moveTo(l + 1, b - sw * 0.82);
      ctx.lineTo(r - 0.5, b - sw * 0.95);
      ctx.lineTo(r - 2, b);
      ctx.lineTo(l + 1, b);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case '2': {
      // Bold sweeping crest + diagonal brush slash + heavy anchor bar
      ctx.beginPath();
      ctx.moveTo(l, t + 6);
      ctx.lineTo(l + 5, t);
      ctx.lineTo(r, t);
      ctx.lineTo(r, cy - 1);
      ctx.lineTo(l + sw + 1.5, b - sw * 0.85);
      ctx.lineTo(r, b - sw * 0.95);
      ctx.lineTo(r - 2.5, b);
      ctx.lineTo(l, b);
      ctx.lineTo(l, cy + 4);
      ctx.lineTo(r - sw, cy - 3);
      ctx.lineTo(r - sw, t + sw * 0.85);
      ctx.lineTo(l, t + sw * 0.95);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case '3': {
      // Heavy outer frame with sharp artistic center fangs
      ctx.beginPath();
      ctx.moveTo(l + 1, t);
      ctx.lineTo(r, t);
      ctx.lineTo(r, cy - 2);
      ctx.lineTo(r - 3, cy);
      ctx.lineTo(r, cy + 2);
      ctx.lineTo(r, b);
      ctx.lineTo(l, b);
      ctx.lineTo(l + 2, b - sw * 0.9);
      ctx.lineTo(r - sw, b - sw * 0.9);
      ctx.lineTo(r - sw, cy + sw * 0.45);
      ctx.lineTo(cx - 4, cy + sw * 0.45);
      ctx.lineTo(cx - 2, cy - sw * 0.5);
      ctx.lineTo(r - sw, cy - sw * 0.5);
      ctx.lineTo(r - sw, t + sw * 0.9);
      ctx.lineTo(l + 2, t + sw * 0.9);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case '4': {
      const barY = cy + 3.5;
      const sx = r - sw - 1.5;
      ctx.fillRect(sx, t, sw, b - t);
      ctx.beginPath();
      ctx.moveTo(sx + 1, t);
      ctx.lineTo(sx + 1, t + sw + 1);
      ctx.lineTo(l + sw * 0.9, barY);
      ctx.lineTo(r, barY);
      ctx.lineTo(r - 1.5, barY + sw * 0.9);
      ctx.lineTo(l, barY + sw * 0.9);
      ctx.lineTo(l, barY - 1);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case '5': {
      ctx.beginPath();
      ctx.moveTo(r, t);
      ctx.lineTo(r - 2.5, t + sw * 0.9);
      ctx.lineTo(l + sw, t + sw * 0.9);
      ctx.lineTo(l + sw, cy - sw * 0.45);
      ctx.lineTo(r - 2.5, cy - sw * 0.45);
      ctx.lineTo(r, cy + 2);
      ctx.lineTo(r, b - 5);
      ctx.lineTo(r - 5, b);
      ctx.lineTo(l, b);
      ctx.lineTo(l + 2, b - sw * 0.9);
      ctx.lineTo(r - sw, b - sw * 0.9);
      ctx.lineTo(r - sw, cy + sw * 0.45);
      ctx.lineTo(l, cy + sw * 0.45);
      ctx.lineTo(l, t);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case '6': {
      drawBrushLoop(l, t, r, b);
      // Carve open upper-right mouth for 6
      ctx.fillStyle = '#000000';
      ctx.fillRect(cx - 0.5, t + sw * 0.82, r - cx + 2, cy - t - sw * 1.3);
      ctx.fillStyle = '#FFFFFF';
      // Bold crossbar bridge
      ctx.fillRect(l, cy - sw * 0.45, r - l - 2, sw * 0.9);
      break;
    }
    case '7': {
      ctx.beginPath();
      ctx.moveTo(l, t);
      ctx.lineTo(r, t);
      ctx.lineTo(r, t + 6.5);
      ctx.lineTo(cx + 0.5, b);
      ctx.lineTo(cx - sw, b);
      ctx.lineTo(r - sw - 0.5, t + sw * 0.95);
      ctx.lineTo(l + 2, t + sw * 0.95);
      ctx.lineTo(l, t + sw * 1.4);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case '8': {
      drawBrushLoop(l, t, r, b);
      ctx.fillRect(l, cy - sw * 0.45, r - l, sw * 0.9);
      // Side artistic waist pinch
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(l - 1, cy - 2);
      ctx.lineTo(l + 2.5, cy);
      ctx.lineTo(l - 1, cy + 2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(r + 1, cy - 2);
      ctx.lineTo(r - 2.5, cy);
      ctx.lineTo(r + 1, cy + 2);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case '9': {
      drawBrushLoop(l, t, r, b);
      // Carve open lower-left mouth for 9
      ctx.fillStyle = '#000000';
      ctx.fillRect(l - 1, cy + sw * 0.45, r - l - sw + 0.5, b - cy - sw * 1.27);
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(l + 2, cy - sw * 0.45, r - l - 2, sw * 0.9);
      break;
    }
  }
}

// ============================================================================
// 20. SYNTH-BLADE SCULPTED (Heavy Poster Block + Diagonal 30° Blade Fissure)
// ============================================================================
function drawSynthBladeBold(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'synth-blade-bold', box, options);
    return;
  }

  // Render bold architectural monolith slab first, then sculpt sweeping chamfers & 30° blade fissure
  drawMonolithSlab(ctx, char, box, options);

  ctx.fillStyle = '#000000';
  // Bold artistic 5.5px corner chamfers on opposite corners
  const c = 5.5;
  ctx.beginPath();
  ctx.moveTo(box.x0 - 1, box.y0 - 1);
  ctx.lineTo(box.x0 + c, box.y0 - 1);
  ctx.lineTo(box.x0 - 1, box.y0 + c);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(box.x1 + 1, box.y1 + 1);
  ctx.lineTo(box.x1 - c, box.y1 + 1);
  ctx.lineTo(box.x1 + 1, box.y1 - c);
  ctx.closePath();
  ctx.fill();

  // Signature 30-degree diagonal cyber-blade fissure slicing cleanly across the body
  ctx.beginPath();
  ctx.moveTo(box.x0 - 1, box.cy + 4.5);
  ctx.lineTo(box.x1 + 1, box.cy - 6.5);
  ctx.lineTo(box.x1 + 1, box.cy - 4.7);
  ctx.lineTo(box.x0 - 1, box.cy + 6.3);
  ctx.closePath();
  ctx.fill();
}

// ============================================================================
// 21. ONI-CHROME BRUTALIST (Massive Cyber-Deco Pillars & Stepped Fangs)
// ============================================================================
function drawOniChromeBrutal(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.33;
    const yBot = box.y0 + box.h * 0.67;
    const r = Math.max(2.6, 3.4 * options.strokeScale);
    ctx.fillStyle = '#FFFFFF';
    for (const y of [yTop, yBot]) {
      ctx.beginPath();
      ctx.moveTo(box.cx, y - r * 1.2);
      ctx.lineTo(box.cx + r, y);
      ctx.lineTo(box.cx, y + r * 1.2);
      ctx.lineTo(box.cx - r, y);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.fillRect(box.cx - 1.1, y - 1.1, 2.2, 2.2);
      ctx.fillStyle = '#FFFFFF';
    }
    return;
  }

  // Heavy brutalist base
  const l = Math.round(box.x0);
  const r = Math.round(box.x1);
  const t = Math.round(box.y0);
  const b = Math.round(box.y1);
  const w = r - l;
  const h = b - t;
  const wall = Math.max(4, Math.min(7, Math.round(5.8 * options.strokeScale)));
  const hWall = Math.max(4, Math.min(6, Math.round(5.0 * options.strokeScale)));
  const cy = Math.round((t + b) / 2);
  const cx = Math.round((l + r) / 2);

  drawMonolithSlab(ctx, char, box, {
    ...options,
    strokeScale: Math.max(options.strokeScale, 1.05),
  });

  // Add artistic brutalist Oni horns / deco notches
  ctx.fillStyle = '#FFFFFF';
  if (char === '0' || char === '2' || char === '3' || char === '7' || char === '8') {
    // Upper-left horn spur
    ctx.beginPath();
    ctx.moveTo(l, t - 1);
    ctx.lineTo(l + 4, t - 1);
    ctx.lineTo(l, t + 3);
    ctx.closePath();
    ctx.fill();
  }

  // Carve stepped geometric deco reliefs into top & bottom edges
  ctx.fillStyle = '#000000';
  if (w >= 14 && h >= 30) {
    // Stepped deco twin notches on left/right center flank
    ctx.fillRect(l, t + hWall + 2, 1.6, 2.5);
    ctx.fillRect(r - 1.6, b - hWall - 4.5, 1.6, 2.5);
  }
  // Center brutalist micro-crown notch on top/bottom
  if (char !== '1' && char !== '4') {
    ctx.fillRect(cx - 1.2, t, 2.4, 1.8);
    if (char !== '7') {
      ctx.fillRect(cx - 1.2, b - 1.8, 2.4, 1.8);
    }
  } else if (char === '1') {
    // Aggressive horned crest on 1
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(l + 1, t, wall + 2, hWall);
    ctx.fillStyle = '#000000';
    ctx.fillRect(l + 1, t + hWall - 1.5, 2, 2);
  }
  // Keep vertical alignment clean
  void wall;
  void cy;
}

// ============================================================================
// 22. CHROME-SHARD FRACTURE (Polygonal Crystal Shards & Lightning Fissure)
// ============================================================================
function drawChromeShard(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.34;
    const yBot = box.y0 + box.h * 0.67;
    const r = Math.max(2.4, 3.1 * options.strokeScale);
    ctx.fillStyle = '#FFFFFF';
    for (const y of [yTop, yBot]) {
      ctx.beginPath();
      ctx.moveTo(box.cx - r, y - r * 0.9);
      ctx.lineTo(box.cx + r, y - r * 0.2);
      ctx.lineTo(box.cx - r * 0.3, y + r);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }

  // Heavy angular shard base
  drawKuroganeHeavy(ctx, char, box, options);

  // Carve jagged crystal lightning fissure diagonally across the glyph
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(box.x0 - 1, box.cy + 3);
  ctx.lineTo(box.cx - 1, box.cy - 2);
  ctx.lineTo(box.cx + 1.5, box.cy + 1);
  ctx.lineTo(box.x1 + 1, box.cy - 5);
  ctx.lineTo(box.x1 + 1, box.cy - 3.3);
  ctx.lineTo(box.cx + 1.2, box.cy + 2.7);
  ctx.lineTo(box.cx - 1.2, box.cy - 0.3);
  ctx.lineTo(box.x0 - 1, box.cy + 4.7);
  ctx.closePath();
  ctx.fill();

  // Sharp crystal tip slice on top-right
  ctx.beginPath();
  ctx.moveTo(box.x1 - 5, box.y0 - 1);
  ctx.lineTo(box.x1 + 1, box.y0 - 1);
  ctx.lineTo(box.x1 + 1, box.y0 + 5);
  ctx.closePath();
  ctx.fill();
}

// ============================================================================
// 23. WIREFRAME NETRUNNER (Hollow CAD Perimeter Contour)
// ============================================================================
function drawWireframeVoid(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.34;
    const yBot = box.y0 + box.h * 0.68;
    const r = Math.max(2.2, 2.7 * options.strokeScale);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1.2;
    for (const y of [yTop, yBot]) {
      ctx.strokeRect(box.cx - r, y - r, r * 2, r * 2);
    }
    return;
  }

  // Render crisp geometric silhouette first, then hollow out the interior leaving a 1.3px CAD perimeter!
  const tmp = document.createElement('canvas');
  tmp.width = GLYPH_WIDTH;
  tmp.height = GLYPH_HEIGHT;
  const tctx = tmp.getContext('2d')!;
  tctx.fillStyle = '#000000';
  tctx.fillRect(0, 0, GLYPH_WIDTH, GLYPH_HEIGHT);

  drawMonolithSlab(tctx, char, box, { ...options, strokeScale: 0.95 });

  // Detect perimeter edges by checking 4-neighborhood in tmp canvas
  const src = tctx.getImageData(0, 0, GLYPH_WIDTH, GLYPH_HEIGHT).data;
  const out = ctx.createImageData(GLYPH_WIDTH, GLYPH_HEIGHT);
  const dst = out.data;

  const isOn = (x: number, y: number) => {
    if (x < 0 || x >= GLYPH_WIDTH || y < 0 || y >= GLYPH_HEIGHT) return false;
    return src[(y * GLYPH_WIDTH + x) * 4] >= 128;
  };

  for (let y = 0; y < GLYPH_HEIGHT; y++) {
    for (let x = 0; x < GLYPH_WIDTH; x++) {
      const idx = (y * GLYPH_WIDTH + x) * 4;
      const cur = isOn(x, y);
      const isEdge =
        cur &&
        (!isOn(x - 1, y) ||
          !isOn(x + 1, y) ||
          !isOn(x, y - 1) ||
          !isOn(x, y + 1));
      const val = isEdge ? 255 : 0;
      dst[idx] = val;
      dst[idx + 1] = val;
      dst[idx + 2] = val;
      dst[idx + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);

  // Add subtle Netrunner corner reticle ticks
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(box.x0, box.y0, 2, 1);
  ctx.fillRect(box.x1 - 2, box.y1 - 1, 2, 1);
}

// ============================================================================
// 24. NIGHT-SECTOR STENCIL (Military Corporate Dystopian 45° Stencil)
// ============================================================================
function drawCyberStencil2077(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'cyber-stencil-2077', box, options);
    return;
  }

  drawMonolithSlab(ctx, char, box, options);

  // Carve consistent 45-degree corporate-military stencil bridges
  ctx.fillStyle = '#000000';
  const cutDiagonal = (x1: number, y1: number, x2: number, y2: number, w = 1.8) => {
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = w;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  };

  cutDiagonal(box.cx - 4, box.y0 - 1, box.cx + 2, box.y0 + 7, 1.9);
  cutDiagonal(box.cx - 2, box.y1 - 7, box.cx + 4, box.y1 + 1, 1.9);
  if (char === '4' || char === '6' || char === '8' || char === '9') {
    cutDiagonal(box.x0 - 1, box.cy - 3, box.x0 + 6, box.cy + 4, 1.7);
  }
}

// ============================================================================
// 25. PLASMA-TUBE NEON (Dual-Wall Neon Tube with Glowing Corner Nodes)
// ============================================================================
function drawPlasmaTubeCyber(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.34;
    const yBot = box.y0 + box.h * 0.68;
    const r = Math.max(2.3, 2.9 * options.strokeScale);
    for (const y of [yTop, yBot]) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(box.cx, y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(box.cx, y, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  // Use orbital dual-track geometry with crisp cyber bevels & bright endpoint nodes
  drawOrbitalDual(ctx, char, box, {
    ...options,
    strokeScale: Math.max(0.9, options.strokeScale),
  });

  // Add subtle corner plasma glow nodes at key anchors
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(box.cx - 0.8, box.y0 + 1, 1.6, 1.6);
  ctx.fillRect(box.cx - 0.8, box.y1 - 2.6, 1.6, 1.6);
}

// ============================================================================
// 26. BARCODE-NET 88 (Bold Cyber Blocks with Vertical Data-Barcode Slits)
// ============================================================================
function drawBinaryBarcodeCyber(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.34;
    const yBot = box.y0 + box.h * 0.68;
    ctx.fillStyle = '#FFFFFF';
    for (const y of [yTop, yBot]) {
      ctx.fillRect(box.cx - 3, y - 2.5, 2, 5);
      ctx.fillRect(box.cx + 0.5, y - 2.5, 1, 5);
      ctx.fillRect(box.cx + 2.5, y - 2.5, 1.5, 5);
    }
    return;
  }

  drawMonolithSlab(ctx, char, box, options);

  // Carve rhythmic vertical barcode data slits into upper & lower horizontal crowns
  ctx.fillStyle = '#000000';
  const topY = Math.round(box.y0);
  const botY = Math.round(box.y1) - 4;
  for (let x = Math.round(box.x0) + 4; x < Math.round(box.x1) - 3; x += 3) {
    ctx.fillRect(x, topY, 1, 4);
    if (char !== '1' && char !== '4' && char !== '7') {
      ctx.fillRect(x + 1, botY, 1, 4);
    }
  }
}

// ============================================================================
// 27. VORTEX RAZOR 16° (Extreme 16° Forward Slant + Speed Whiskers)
// ============================================================================
function drawVortexRazorItalic(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.34;
    const yBot = box.y0 + box.h * 0.68;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = Math.max(1.8, 2.2 * options.strokeScale);
    for (const y of [yTop, yBot]) {
      ctx.beginPath();
      ctx.moveTo(box.cx - 3, y - 2.8);
      ctx.lineTo(box.cx + 2.5, y);
      ctx.lineTo(box.cx - 3, y + 2.8);
      ctx.stroke();
    }
    return;
  }

  ctx.save();
  ctx.translate(box.cx, box.cy);
  ctx.transform(1, 0, -0.24, 1, 0, 0);
  ctx.translate(-box.cx, -box.cy);

  const sw = Math.max(2.0, Math.min(4.4, 3.1 * options.strokeScale));
  const hw = sw / 2;
  const l = box.x0 + hw + 3.2;
  const r = box.x1 - hw - 3.2;
  const t = box.y0 + hw;
  const b = box.y1 - hw;
  const cx = box.cx;
  const cy = box.cy;

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = sw;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';

  switch (char) {
    case '0':
      ctx.beginPath();
      ctx.moveTo(l + 3, t);
      ctx.lineTo(r, t);
      ctx.lineTo(r, b - 3);
      ctx.lineTo(r - 3, b);
      ctx.lineTo(l, b);
      ctx.lineTo(l, t + 3);
      ctx.closePath();
      ctx.stroke();
      break;
    case '1':
      ctx.beginPath();
      ctx.moveTo(l, t + 5);
      ctx.lineTo(cx + 1.5, t);
      ctx.lineTo(cx + 1.5, b + hw);
      ctx.moveTo(l, b);
      ctx.lineTo(r, b);
      ctx.stroke();
      break;
    case '2':
      ctx.beginPath();
      ctx.moveTo(l, t + 3);
      ctx.lineTo(l + 2, t);
      ctx.lineTo(r, t);
      ctx.lineTo(r, cy - 2);
      ctx.lineTo(l, cy + 4);
      ctx.lineTo(l, b);
      ctx.lineTo(r + 1, b);
      ctx.stroke();
      break;
    case '3':
      ctx.beginPath();
      ctx.moveTo(l, t);
      ctx.lineTo(r, t);
      ctx.lineTo(r, cy - 2);
      ctx.lineTo(cx - 1.5, cy);
      ctx.lineTo(r, cy + 2);
      ctx.lineTo(r, b);
      ctx.lineTo(l, b);
      ctx.stroke();
      break;
    case '4':
      ctx.beginPath();
      ctx.moveTo(r - 1.5, b + hw);
      ctx.lineTo(r - 1.5, t);
      ctx.lineTo(l, cy + 4);
      ctx.lineTo(r + 1, cy + 4);
      ctx.stroke();
      break;
    case '5':
      ctx.beginPath();
      ctx.moveTo(r + 0.5, t);
      ctx.lineTo(l, t);
      ctx.lineTo(l, cy - 1);
      ctx.lineTo(r, cy - 1);
      ctx.lineTo(r, b);
      ctx.lineTo(l, b);
      ctx.stroke();
      break;
    case '6':
      ctx.beginPath();
      ctx.moveTo(r, t);
      ctx.lineTo(l, t);
      ctx.lineTo(l, b);
      ctx.lineTo(r, b);
      ctx.lineTo(r, cy);
      ctx.lineTo(l, cy);
      ctx.stroke();
      break;
    case '7':
      ctx.beginPath();
      ctx.moveTo(l - 0.5, t);
      ctx.lineTo(r, t);
      ctx.lineTo(cx - 1.5, b + hw);
      ctx.stroke();
      break;
    case '8':
      ctx.strokeRect(l, t, r - l, b - t);
      ctx.beginPath();
      ctx.moveTo(l, cy);
      ctx.lineTo(r, cy);
      ctx.stroke();
      break;
    case '9':
      ctx.beginPath();
      ctx.moveTo(l, b);
      ctx.lineTo(r, b);
      ctx.lineTo(r, t);
      ctx.lineTo(l, t);
      ctx.lineTo(l, cy);
      ctx.lineTo(r, cy);
      ctx.stroke();
      break;
  }
  ctx.restore();

  // Horizontal speed-trail whiskers on top-left & bottom-right
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(box.x0, box.y0 + 1, 4.5, 1.2);
  ctx.fillRect(box.x0 + 1, box.y0 + 4, 3, 1);
  ctx.fillRect(box.x1 - 4.5, box.y1 - 2.2, 4.5, 1.2);
}

// ============================================================================
// 28. HEX-HIVE CYBORG (Micro-Perforated Honeycomb Armor Texture)
// ============================================================================
function drawCyberHexHive(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.34;
    const yBot = box.y0 + box.h * 0.68;
    const r = Math.max(2.6, 3.2 * options.strokeScale);
    ctx.fillStyle = '#FFFFFF';
    for (const y of [yTop, yBot]) {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i;
        const px = box.cx + Math.cos(a) * r;
        const py = y + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.fillRect(box.cx - 0.8, y - 0.8, 1.6, 1.6);
      ctx.fillStyle = '#FFFFFF';
    }
    return;
  }

  drawMonolithSlab(ctx, char, box, {
    ...options,
    strokeScale: Math.max(options.strokeScale, 1.05),
  });

  // Carve staggered honeycomb micro-perforations inside interior pixels
  const img = ctx.getImageData(0, 0, GLYPH_WIDTH, GLYPH_HEIGHT);
  const d = img.data;
  const isLit = (x: number, y: number) => {
    if (x < 0 || x >= GLYPH_WIDTH || y < 0 || y >= GLYPH_HEIGHT) return false;
    return d[(y * GLYPH_WIDTH + x) * 4] >= 128;
  };
  for (let y = 1; y < GLYPH_HEIGHT - 1; y++) {
    for (let x = 1; x < GLYPH_WIDTH - 1; x++) {
      // Only perforate interior pixels (keep outer 1px border solid)
      if (isLit(x - 1, y) && isLit(x + 1, y) && isLit(x, y - 1) && isLit(x, y + 1)) {
        const isHexHole = (y % 4 === 0 && x % 4 === 2) || (y % 4 === 2 && x % 4 === 0);
        if (isHexHole) {
          const idx = (y * GLYPH_WIDTH + x) * 4;
          d[idx] = 0;
          d[idx + 1] = 0;
          d[idx + 2] = 0;
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

// ============================================================================
// 29. RONIN DUAL-SPLIT (Horizontal Equator Katana Recoil Shift)
// ============================================================================
function drawRoninKatanaSplit(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'ronin-katana-split', box, options);
    return;
  }

  const tmp = document.createElement('canvas');
  tmp.width = GLYPH_WIDTH;
  tmp.height = GLYPH_HEIGHT;
  const tctx = tmp.getContext('2d')!;
  tctx.fillStyle = '#000000';
  tctx.fillRect(0, 0, GLYPH_WIDTH, GLYPH_HEIGHT);

  drawKuroganeHeavy(tctx, char, { ...box, x0: box.x0 + 1, x1: box.x1 - 1, w: box.w - 2 }, options);

  const splitY = Math.round(box.cy);
  // Top half shifted +1px right, bottom half shifted -1px left with 1.5px black slash gap
  ctx.drawImage(tmp, 0, 0, GLYPH_WIDTH, splitY - 1, 1, 0, GLYPH_WIDTH, splitY - 1);
  ctx.drawImage(
    tmp,
    0,
    splitY + 1,
    GLYPH_WIDTH,
    GLYPH_HEIGHT - splitY - 1,
    -1,
    splitY + 1,
    GLYPH_WIDTH,
    GLYPH_HEIGHT - splitY - 1
  );

  // Clean black equatorial slash line
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, splitY - 1, GLYPH_WIDTH, 2);
}

// ============================================================================
// 30. DATASTREAM MATRIX (Vertical Data Rain Columns & Falling Pixels)
// ============================================================================
function drawDatastreamRain(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.34;
    const yBot = box.y0 + box.h * 0.68;
    ctx.fillStyle = '#FFFFFF';
    for (const y of [yTop, yBot]) {
      ctx.fillRect(box.cx - 2, y - 3, 4, 3);
      ctx.fillRect(box.cx - 1, y + 1.5, 2, 2);
    }
    return;
  }

  drawNeoKanjiTech(ctx, char, box, options);

  // Carve rhythmic 1px vertical matrix data dropouts
  ctx.fillStyle = '#000000';
  for (let x = Math.round(box.x0) + 3; x < Math.round(box.x1) - 2; x += 4) {
    ctx.fillRect(x, Math.round(box.y0) + 3, 1, 6);
    ctx.fillRect(x + 2, Math.round(box.cy) - 4, 1, 8);
    ctx.fillRect(x, Math.round(box.y1) - 9, 1, 6);
  }
  // Falling data trail dots near top/bottom
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(Math.round(box.x0) + 2, Math.round(box.y0) - 2, 1, 1);
  ctx.fillRect(Math.round(box.x1) - 3, Math.round(box.y1) + 1, 1, 1);
}

// ============================================================================
// 31. SUBZERO CYBER VISOR (Heavy Armored Helm with Central Visor Slit)
// ============================================================================
function drawSubzeroVisor(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'subzero-visor', box, options);
    return;
  }

  drawMonolithSlab(ctx, char, box, options);

  // Carve futuristic horizontal visor channel across central band
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, Math.round(box.cy) - 1, GLYPH_WIDTH, 1.8);

  // Add visor armored side cheeks
  ctx.fillStyle = '#FFFFFF';
  if (char === '0' || char === '8') {
    ctx.fillRect(Math.round(box.cx) - 2, Math.round(box.cy) - 2, 4, 4);
  }
}

// ============================================================================
// 32. TACHYON CHEVRON (Arrowhead Angled Cyber Flanks)
// ============================================================================
function drawTachyonChevron(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'tachyon-chevron', box, options);
    return;
  }

  const sw = Math.max(2.2, Math.min(4.8, 3.2 * options.strokeScale));
  const hw = sw / 2;
  const l = box.x0 + hw;
  const r = box.x1 - hw;
  const t = box.y0 + hw;
  const b = box.y1 - hw;
  const cx = box.cx;
  const cy = box.cy;
  const arrow = 3.2;

  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = sw;
  ctx.lineCap = 'butt';
  ctx.lineJoin = 'miter';

  switch (char) {
    case '0':
      ctx.beginPath();
      ctx.moveTo(l + 2, t);
      ctx.lineTo(r - 2, t);
      ctx.lineTo(r + 1, cy);
      ctx.lineTo(r - 2, b);
      ctx.lineTo(l + 2, b);
      ctx.lineTo(l - 1, cy);
      ctx.closePath();
      ctx.stroke();
      break;
    case '1':
      ctx.beginPath();
      ctx.moveTo(l + 1, t + 6);
      ctx.lineTo(cx + 1.5, t);
      ctx.lineTo(cx + 3, cy);
      ctx.lineTo(cx + 1.5, b + hw);
      ctx.moveTo(l + 1, b);
      ctx.lineTo(r - 1, b);
      ctx.stroke();
      break;
    case '2':
      ctx.beginPath();
      ctx.moveTo(l, t + 4);
      ctx.lineTo(l + arrow, t);
      ctx.lineTo(r - arrow, t);
      ctx.lineTo(r, cy - 4);
      ctx.lineTo(l, cy + 5);
      ctx.lineTo(l, b);
      ctx.lineTo(r + hw, b);
      ctx.stroke();
      break;
    case '3':
      ctx.beginPath();
      ctx.moveTo(l, t);
      ctx.lineTo(r - 2, t);
      ctx.lineTo(r, cy - 3);
      ctx.lineTo(cx - 2, cy);
      ctx.lineTo(r, cy + 3);
      ctx.lineTo(r - 2, b);
      ctx.lineTo(l, b);
      ctx.stroke();
      break;
    case '4':
      ctx.beginPath();
      ctx.moveTo(r - 2.5, b + hw);
      ctx.lineTo(r - 1.5, cy);
      ctx.lineTo(r - 2.5, t);
      ctx.lineTo(l, cy + 4);
      ctx.lineTo(r + hw, cy + 4);
      ctx.stroke();
      break;
    case '5':
      ctx.beginPath();
      ctx.moveTo(r + hw, t);
      ctx.lineTo(l + 1, t);
      ctx.lineTo(l, cy - 1);
      ctx.lineTo(r - 2, cy - 1);
      ctx.lineTo(r, cy + 4);
      ctx.lineTo(r - 2, b);
      ctx.lineTo(l, b);
      ctx.stroke();
      break;
    case '6':
      ctx.beginPath();
      ctx.moveTo(r - 1, t);
      ctx.lineTo(l + 2, t);
      ctx.lineTo(l - 1, cy);
      ctx.lineTo(l + 2, b);
      ctx.lineTo(r - 2, b);
      ctx.lineTo(r, cy + 3);
      ctx.lineTo(r - 2, cy - 1.5);
      ctx.lineTo(l - 0.5, cy - 1.5);
      ctx.stroke();
      break;
    case '7':
      ctx.beginPath();
      ctx.moveTo(l - hw, t);
      ctx.lineTo(r, t);
      ctx.lineTo(cx - 1.5, b + hw);
      ctx.stroke();
      break;
    case '8':
      ctx.beginPath();
      ctx.moveTo(l + 2, t);
      ctx.lineTo(r - 2, t);
      ctx.lineTo(r, cy - 3);
      ctx.lineTo(r - 2.5, cy);
      ctx.lineTo(r, cy + 3);
      ctx.lineTo(r - 2, b);
      ctx.lineTo(l + 2, b);
      ctx.lineTo(l, cy + 3);
      ctx.lineTo(l + 2.5, cy);
      ctx.lineTo(l, cy - 3);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(l + 2.5, cy);
      ctx.lineTo(r - 2.5, cy);
      ctx.stroke();
      break;
    case '9':
      ctx.beginPath();
      ctx.moveTo(l + 1, b);
      ctx.lineTo(r - 2, b);
      ctx.lineTo(r + 1, cy);
      ctx.lineTo(r - 2, t);
      ctx.lineTo(l + 2, t);
      ctx.lineTo(l, cy - 3);
      ctx.lineTo(l + 2, cy + 1.5);
      ctx.lineTo(r + 0.5, cy + 1.5);
      ctx.stroke();
      break;
  }
}

// ============================================================================
// 33. VOLT-ARC SURGE (High-Voltage Lightning Zags & Spark Nodes)
// ============================================================================
function drawVoltArcSurge(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'volt-arc-surge', box, options);
    return;
  }

  drawVektorHud(ctx, char, box, options);

  // Add electric lightning zig-zag surge notches on vertical flanks
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(box.x0, box.cy - 6);
  ctx.lineTo(box.x0 + 4.5, box.cy - 4);
  ctx.lineTo(box.x0 + 2.5, box.cy - 2);
  ctx.lineTo(box.x0 + 5.5, box.cy);
  ctx.lineTo(box.x0, box.cy + 1.5);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(box.cx - 0.8, box.y0 - 1, 1.6, 2);
  ctx.fillRect(box.cx - 0.8, box.y1 - 1, 1.6, 2);
}

// ============================================================================
// 34. MECHA-RIVET TITAN (Heavy Armored Mech Plate with Corner Rivets)
// ============================================================================
function drawMechaRivetPlate(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.34;
    const yBot = box.y0 + box.h * 0.68;
    const r = Math.max(2.6, 3.2 * options.strokeScale);
    for (const y of [yTop, yBot]) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(box.cx - r, y - r, r * 2, r * 2);
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(box.cx, y, 1.1, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  drawMonolithSlab(ctx, char, box, options);

  // Punch crisp mechanical rivet holes at the 4 corners inside white strokes
  const rivets: [number, number][] = [
    [box.x0 + 2.5, box.y0 + 2.2],
    [box.x1 - 2.5, box.y0 + 2.2],
    [box.x0 + 2.5, box.y1 - 2.2],
    [box.x1 - 2.5, box.y1 - 2.2],
  ];
  const img = ctx.getImageData(0, 0, GLYPH_WIDTH, GLYPH_HEIGHT);
  const d = img.data;
  for (const [rx, ry] of rivets) {
    const px = Math.round(rx);
    const py = Math.round(ry);
    if (px >= 0 && px < GLYPH_WIDTH && py >= 0 && py < GLYPH_HEIGHT) {
      if (d[(py * GLYPH_WIDTH + px) * 4] >= 128) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(px - 0.7, py - 0.7, 1.4, 1.4);
      }
    }
  }
}

// ============================================================================
// 35. CYBER-GOTHIC 2100 (Dark Neo-Blackletter Spires & Heavy Pillars)
// ============================================================================
function drawCyberGothic2100(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.34;
    const yBot = box.y0 + box.h * 0.67;
    const w = Math.max(2.4, 3.0 * options.strokeScale);
    const h = w * 1.45;
    ctx.fillStyle = '#FFFFFF';
    for (const y of [yTop, yBot]) {
      ctx.beginPath();
      ctx.moveTo(box.cx, y - h);
      ctx.lineTo(box.cx + w, y);
      ctx.lineTo(box.cx, y + h);
      ctx.lineTo(box.cx - w, y);
      ctx.closePath();
      ctx.fill();
    }
    return;
  }

  drawKuroganeHeavy(ctx, char, box, options);

  // Add sharp Gothic spire tips on top-left & bottom-right corners
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(box.x0, box.y0 + 3);
  ctx.lineTo(box.x0 + 2, box.y0 - 2);
  ctx.lineTo(box.x0 + 4.5, box.y0 + 2);
  ctx.closePath();
  ctx.fill();

  if (char !== '7') {
    ctx.beginPath();
    ctx.moveTo(box.x1 - 4.5, box.y1 - 2);
    ctx.lineTo(box.x1 - 2, box.y1 + 2);
    ctx.lineTo(box.x1, box.y1 - 3);
    ctx.closePath();
    ctx.fill();
  }
}

// ============================================================================
// 36. DITHER-PUNK BAYER (Retro-Cyber 2×2 Pixel Dither Shading)
// ============================================================================
function drawPixelDitherPunk(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    const yTop = box.y0 + box.h * 0.34;
    const yBot = box.y0 + box.h * 0.68;
    ctx.fillStyle = '#FFFFFF';
    for (const y of [yTop, yBot]) {
      ctx.fillRect(box.cx - 3, y - 3, 6, 4);
      ctx.fillRect(box.cx - 3, y + 1, 2, 2);
      ctx.fillRect(box.cx + 1, y + 1, 2, 2);
    }
    return;
  }

  drawMonolithSlab(ctx, char, box, options);

  // Apply 2x2 Bayer checkerboard dither on the lower/right half of the glyph
  const img = ctx.getImageData(0, 0, GLYPH_WIDTH, GLYPH_HEIGHT);
  const d = img.data;
  for (let y = 0; y < GLYPH_HEIGHT; y++) {
    for (let x = 0; x < GLYPH_WIDTH; x++) {
      const idx = (y * GLYPH_WIDTH + x) * 4;
      if (d[idx] >= 128) {
        // Keep left/top outer edge solid for crisp readability; dither lower-right body
        const inDitherZone = y > box.cy - 2 || x > box.cx + 2;
        if (inDitherZone && (x + y) % 2 === 1) {
          // Leave 1px top/bottom outline intact
          const isBottomEdge = y >= Math.round(box.y1) - 1;
          const isTopEdge = y <= Math.round(box.y0);
          if (!isBottomEdge && !isTopEdge) {
            d[idx] = 0;
            d[idx + 1] = 0;
            d[idx + 2] = 0;
          }
        }
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

// ============================================================================
// 37. SIGNAL-JAMMER NOISE (Electronic Warfare Spectrum Teeth & Interference)
// ============================================================================
function drawSignalJammer(
  ctx: CanvasRenderingContext2D,
  char: GlyphChar,
  box: Box,
  options: GlyphRenderOptions
) {
  if (char === ':') {
    drawColon(ctx, 'signal-jammer', box, options);
    return;
  }

  drawGlitch2099(ctx, char, box, options);

  // Add sharp 1px electronic-warfare spectrum bars at top-right & bottom-left
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(box.x1 - 5, box.y0 - 2, 1, 2);
  ctx.fillRect(box.x1 - 3, box.y0 - 1, 1, 1);
  ctx.fillRect(box.x0 + 2, box.y1, 1, 2);
  ctx.fillRect(box.x0 + 4, box.y1, 1, 1);

  // Extra crisp horizontal jammer interference notch
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, Math.round(box.cy), GLYPH_WIDTH, 1);
}

// ============================================================================
// MASTER RENDERER: Strictly 25×50px Pure White on Pure Black
// ============================================================================
export function renderGlyphToCanvas(
  char: GlyphChar,
  styleId: StyleId,
  options: GlyphRenderOptions,
  customAlphaMap?: Uint8ClampedArray | null,
  targetCanvas?: HTMLCanvasElement | null
): HTMLCanvasElement {
  const canvas = targetCanvas ?? document.createElement('canvas');
  if (canvas.width !== GLYPH_WIDTH) canvas.width = GLYPH_WIDTH;
  if (canvas.height !== GLYPH_HEIGHT) canvas.height = GLYPH_HEIGHT;

  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

  // If custom pixel override exists, paint directly from Uint8ClampedArray (length = 25*50 = 1250)
  if (customAlphaMap && customAlphaMap.length === GLYPH_WIDTH * GLYPH_HEIGHT) {
    const img = ctx.createImageData(GLYPH_WIDTH, GLYPH_HEIGHT);
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

  // Pure #000000 background
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, GLYPH_WIDTH, GLYPH_HEIGHT);

  const box = getBox(options);

  switch (styleId) {
    case 'aether-grotesque':
      drawAetherGrotesque(ctx, char, box, options);
      break;
    case 'luminar-fluid':
      drawLuminarFluid(ctx, char, box, options);
      break;
    case 'bauhaus-geo':
      drawBauhausGeo(ctx, char, box, options);
      break;
    case 'hyper-kinetic':
      drawHyperKinetic(ctx, char, box, options);
      break;
    case 'chronos-horology':
      drawChronosHorology(ctx, char, box, options);
      break;
    case 'monolith-slab':
      drawMonolithSlab(ctx, char, box, options);
      break;
    case 'atelier-stencil':
      drawAtelierStencil(ctx, char, box, options);
      break;
    case 'obsidian-inline':
      drawObsidianInline(ctx, char, box, options);
      break;
    case 'vektor-hud':
      drawVektorHud(ctx, char, box, options);
      break;
    case 'kinetik-matrix':
      drawKinetikMatrix(ctx, char, box, options);
      break;
    case 'quantum-dot':
      drawQuantumDot(ctx, char, box, options);
      break;
    case 'orbital-dual':
      drawOrbitalDual(ctx, char, box, options);
      break;
    case 'mecha-katana':
      drawMechaKatana(ctx, char, box, options);
      break;
    case 'glitch-2099':
      drawGlitch2099(ctx, char, box, options);
      break;
    case 'circuit-rail':
      drawCircuitRail(ctx, char, box, options);
      break;
    case 'neo-kanji-tech':
      drawNeoKanjiTech(ctx, char, box, options);
      break;
    case 'holo-scanline':
      drawHoloScanline(ctx, char, box, options);
      break;
    case 'exo-frame-bracket':
      drawExoFrameBracket(ctx, char, box, options);
      break;
    case 'kurogane-heavy':
      drawKuroganeHeavy(ctx, char, box, options);
      break;
    case 'synth-blade-bold':
      drawSynthBladeBold(ctx, char, box, options);
      break;
    case 'oni-chrome-brutal':
      drawOniChromeBrutal(ctx, char, box, options);
      break;
    case 'chrome-shard-v2':
      drawChromeShard(ctx, char, box, options);
      break;
    case 'wireframe-void':
      drawWireframeVoid(ctx, char, box, options);
      break;
    case 'cyber-stencil-2077':
      drawCyberStencil2077(ctx, char, box, options);
      break;
    case 'plasma-tube-cyber':
      drawPlasmaTubeCyber(ctx, char, box, options);
      break;
    case 'binary-barcode-cyber':
      drawBinaryBarcodeCyber(ctx, char, box, options);
      break;
    case 'vortex-razor-italic':
      drawVortexRazorItalic(ctx, char, box, options);
      break;
    case 'cyber-hex-hive':
      drawCyberHexHive(ctx, char, box, options);
      break;
    case 'ronin-katana-split':
      drawRoninKatanaSplit(ctx, char, box, options);
      break;
    case 'datastream-rain':
      drawDatastreamRain(ctx, char, box, options);
      break;
    case 'subzero-visor':
      drawSubzeroVisor(ctx, char, box, options);
      break;
    case 'tachyon-chevron':
      drawTachyonChevron(ctx, char, box, options);
      break;
    case 'volt-arc-surge':
      drawVoltArcSurge(ctx, char, box, options);
      break;
    case 'mecha-rivet-plate':
      drawMechaRivetPlate(ctx, char, box, options);
      break;
    case 'cyber-gothic-2100':
      drawCyberGothic2100(ctx, char, box, options);
      break;
    case 'pixel-dither-punk':
      drawPixelDitherPunk(ctx, char, box, options);
      break;
    case 'signal-jammer':
      drawSignalJammer(ctx, char, box, options);
      break;
  }

  // Enforce strict pure grayscale luminance & optional 1-bit pixel snap
  const imgData = ctx.getImageData(0, 0, GLYPH_WIDTH, GLYPH_HEIGHT);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    // Convert any RGB anti-aliasing strictly to neutral grayscale luminance on pure black
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

export function extractAlphaMap(canvas: HTMLCanvasElement): Uint8ClampedArray {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const img = ctx.getImageData(0, 0, GLYPH_WIDTH, GLYPH_HEIGHT);
  const out = new Uint8ClampedArray(GLYPH_WIDTH * GLYPH_HEIGHT);
  for (let i = 0; i < out.length; i++) {
    out[i] = img.data[i * 4];
  }
  return out;
}

export function computeGlyphMetrics(canvas: HTMLCanvasElement): GlyphMetrics {
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!;
  const img = ctx.getImageData(0, 0, GLYPH_WIDTH, GLYPH_HEIGHT);
  const d = img.data;
  let activePixels = 0;
  let minX = GLYPH_WIDTH;
  let minY = GLYPH_HEIGHT;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < GLYPH_HEIGHT; y++) {
    for (let x = 0; x < GLYPH_WIDTH; x++) {
      const val = d[(y * GLYPH_WIDTH + x) * 4];
      if (val >= 128) {
        activePixels++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const totalPixels = GLYPH_WIDTH * GLYPH_HEIGHT;
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
