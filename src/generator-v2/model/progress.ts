export const PROGRESS_ASSET_IDS = [
  'battery',
  'signal',
  'linear-progress',
  'segmented-progress',
  'progress-ring',
  'storage',
  'volume',
] as const;

export type ProgressAssetId = (typeof PROGRESS_ASSET_IDS)[number];
export type ProgressOrientation = 'horizontal' | 'vertical';
export type ProgressStyle = 'outline' | 'solid' | 'pixel' | 'tactical';

export interface ProgressAssetConfig {
  id: ProgressAssetId;
  width: number;
  height: number;
  value: number;
  min: number;
  max: number;
  segments: number;
  gap: number;
  strokeWidth: number;
  cornerRadius: number;
  padding: number;
  orientation: ProgressOrientation;
  style: ProgressStyle;
  showTrack: boolean;
}

export interface ProgressAssetMeta {
  id: ProgressAssetId;
  name: string;
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  group: 'status' | 'progress' | 'system';
}

export const PROGRESS_ASSET_CATALOG: ProgressAssetMeta[] = [
  { id: 'battery', name: 'Battery', description: 'Battery shell, terminal and charge fill.', defaultWidth: 72, defaultHeight: 32, group: 'status' },
  { id: 'signal', name: 'Signal', description: 'Discrete signal-strength columns.', defaultWidth: 48, defaultHeight: 36, group: 'status' },
  { id: 'linear-progress', name: 'Linear Progress', description: 'Continuous progress track and fill.', defaultWidth: 96, defaultHeight: 16, group: 'progress' },
  { id: 'segmented-progress', name: 'Segmented Progress', description: 'Independent blocks for stepped progress.', defaultWidth: 96, defaultHeight: 16, group: 'progress' },
  { id: 'progress-ring', name: 'Progress Ring', description: 'Circular progress indicator with track.', defaultWidth: 48, defaultHeight: 48, group: 'progress' },
  { id: 'storage', name: 'Storage', description: 'Capacity meter with compact drive silhouette.', defaultWidth: 72, defaultHeight: 28, group: 'system' },
  { id: 'volume', name: 'Volume', description: 'Stepped audio-level meter.', defaultWidth: 48, defaultHeight: 36, group: 'system' },
];

export function createDefaultProgressConfig(id: ProgressAssetId): ProgressAssetConfig {
  const meta = PROGRESS_ASSET_CATALOG.find((item) => item.id === id) ?? PROGRESS_ASSET_CATALOG[0];
  return {
    id,
    width: meta.defaultWidth,
    height: meta.defaultHeight,
    value: id === 'battery' ? 80 : id === 'signal' ? 75 : 60,
    min: 0,
    max: 100,
    segments: id === 'signal' || id === 'volume' ? 5 : 10,
    gap: 2,
    strokeWidth: 2,
    cornerRadius: 3,
    padding: 2,
    orientation: 'horizontal',
    style: 'outline',
    showTrack: true,
  };
}

export function normalizeProgressConfig(config: ProgressAssetConfig): ProgressAssetConfig {
  const clamp = (value: number, fallback: number, min: number, max: number) =>
    Math.max(min, Math.min(max, Number.isFinite(value) ? value : fallback));
  const width = Math.round(clamp(config.width, 96, 8, 512));
  const height = Math.round(clamp(config.height, 16, 8, 512));
  const min = Number.isFinite(config.min) ? config.min : 0;
  const max = Number.isFinite(config.max) && config.max > min ? config.max : min + 1;
  const paddingLimit = Math.max(0, Math.floor((Math.min(width, height) - 2) / 2));
  const padding = Math.round(clamp(config.padding, 2, 0, Math.min(24, paddingLimit)));
  const gap = clamp(config.gap, 2, 0, 12);
  const orientation: ProgressOrientation = config.orientation === 'vertical' ? 'vertical' : 'horizontal';
  const segmentAxis = orientation === 'vertical' && config.id === 'segmented-progress' ? height : width;
  const segmentLimit = Math.max(2, Math.floor((segmentAxis - padding * 2 + gap) / (1 + gap)));
  const segments = Math.round(clamp(config.segments, 5, 2, Math.min(32, segmentLimit)));
  const strokeWidth = Math.round(clamp(config.strokeWidth, 2, 1, Math.min(8, Math.floor(Math.min(width, height) / 2))));
  const cornerRadius = Math.round(clamp(config.cornerRadius, 3, 0, Math.min(16, Math.floor(Math.min(width, height) / 2))));
  return {
    ...config,
    width,
    height,
    min,
    max,
    value: clamp(config.value, min, min, max),
    segments,
    gap,
    strokeWidth,
    cornerRadius,
    padding,
    orientation,
    showTrack: Boolean(config.showTrack),
  };
}

export function getProgressRatio(config: ProgressAssetConfig): number {
  const normalized = normalizeProgressConfig(config);
  return (normalized.value - normalized.min) / (normalized.max - normalized.min);
}
