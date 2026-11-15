export const DYNAMIC_UI_ASSET_IDS = ['battery', 'signal', 'wifi-meter', 'progress-arc', 'heart-dynamic'] as const;
export const STATIC_UI_ASSET_IDS = ['bluetooth', 'wifi-static', 'weather-sun', 'weather-moon', 'alarm', 'notification', 'heart-static', 'ecg-divider'] as const;
export const UI_ASSET_IDS = [...DYNAMIC_UI_ASSET_IDS, ...STATIC_UI_ASSET_IDS] as const;

export type UiAssetId = (typeof UI_ASSET_IDS)[number];

export type UiStyleCategory =
  | 'all'
  | 'modern-ui'
  | 'elegan-ui'
  | 'taktis-ui'
  | 'cyberpunk-ui';

export type UiStyleId =
  | 'swiss-precision-ui'
  | 'neo-solid-pill'
  | 'horology-bezel-ui'
  | 'obsidian-frame-ui'
  | 'aerospace-hud-ui'
  | 'quantum-dot-ui'
  | 'cyber-katana-ui'
  | 'circuit-pcb-ui'
  | 'glitch-crt-ui'
  | 'oni-brutal-ui';

export interface UiAssetMeta {
  id: UiAssetId;
  name: string;
  shortLabel: string;
  group: 'Status & Konektivitas' | 'Kesehatan & Aktivitas' | 'Lingkungan & Alarm' | 'Widget & HUD';
  width: number;
  height: number;
  description: string;
}

export interface UiStyleMeta {
  id: UiStyleId;
  name: string;
  category: Exclude<UiStyleCategory, 'all'>;
  categoryLabel: string;
  tagline: string;
  architectureNote: string;
  recommendedMode: 'antialiased' | 'pixel-snap';
  targetWatches: string;
}

export interface UiRenderOptions {
  strokeScale: number; // 0.75 to 1.30
  padding: number; // 0 to 3 px
  pixelSnap: boolean;
  threshold: number; // 64 to 210
  batteryLevel: number; // 0 to 100
  signalBars: number; // 0 to 4
  progressPercent: number; // 0 to 100
  assetSizes?: Partial<Record<UiAssetId, { width?: number; height?: number }>>;
}

export type CustomUiPixelMap = Partial<Record<UiStyleId, Partial<Record<UiAssetId, Uint8ClampedArray>>>>;

export interface UiAssetMetrics {
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
