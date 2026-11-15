export const GLYPH_CHARS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':'] as const;
export type GlyphChar = (typeof GLYPH_CHARS)[number];

export const GLYPH_WIDTH = 25;
export const GLYPH_HEIGHT = 48;

export type StyleCategory = 'all' | 'modern' | 'elegan' | 'teknologi' | 'cyberpunk';

export type StyleId =
  | 'aether-grotesque'
  | 'luminar-fluid'
  | 'bauhaus-geo'
  | 'hyper-kinetic'
  | 'chronos-horology'
  | 'monolith-slab'
  | 'atelier-stencil'
  | 'obsidian-inline'
  | 'vektor-hud'
  | 'kinetik-matrix'
  | 'quantum-dot'
  | 'orbital-dual'
  | 'mecha-katana'
  | 'glitch-2099'
  | 'circuit-rail'
  | 'neo-kanji-tech'
  | 'holo-scanline'
  | 'exo-frame-bracket'
  | 'kurogane-heavy'
  | 'synth-blade-bold'
  | 'oni-chrome-brutal'
  | 'chrome-shard-v2'
  | 'wireframe-void'
  | 'cyber-stencil-2077'
  | 'plasma-tube-cyber'
  | 'binary-barcode-cyber'
  | 'vortex-razor-italic'
  | 'cyber-hex-hive'
  | 'ronin-katana-split'
  | 'datastream-rain'
  | 'subzero-visor'
  | 'tachyon-chevron'
  | 'volt-arc-surge'
  | 'mecha-rivet-plate'
  | 'cyber-gothic-2100'
  | 'pixel-dither-punk'
  | 'signal-jammer';

export interface GlyphStyleMeta {
  id: StyleId;
  name: string;
  category: Exclude<StyleCategory, 'all'>;
  categoryLabel: string;
  tagline: string;
  architectureNote: string;
  recommendedMode: 'antialiased' | 'pixel-snap';
  targetWatches: string;
}

export type ColonStyleMode = 'match' | 'round' | 'diamond' | 'slit';

export interface GlyphRenderOptions {
  strokeScale: number; // 0.75 to 1.30
  paddingX: number; // 0 to 3 px
  paddingY: number; // 0 to 4 px
  pixelSnap: boolean; // false = OLED Smooth Anti-Alias, true = Pure 1-Bit Sharp Binary
  threshold: number; // 64 to 210 (used when pixelSnap is true)
  colonStyle: ColonStyleMode;
}

export type CustomPixelMap = Partial<Record<StyleId, Partial<Record<GlyphChar, Uint8ClampedArray>>>>;

export interface GlyphMetrics {
  activePixels: number;
  totalPixels: number;
  fillPercent: number;
  boundingBox: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
  };
}
