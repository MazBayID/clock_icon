export const GENERATOR_TYPES = [
  'battery',
  'signal',
  'linear-progress',
  'segmented-progress',
  'ring-progress',
  'volume',
] as const;

export type GeneratorType = (typeof GENERATOR_TYPES)[number];
export type GeneratorStyle = 'minimal' | 'rounded' | 'tactical' | 'cyber';

export interface GeneratorConfig {
  type: GeneratorType;
  style: GeneratorStyle;
  width: number;
  height: number;
  value: number;
  segments: number;
  thickness: number;
  gap: number;
  cornerRadius: number;
  showTrack: boolean;
  pixelSnap: boolean;
  threshold: number;
  foreground: string;
  track: string;
  background: string;
}

export const DEFAULT_GENERATOR_CONFIG: GeneratorConfig = {
  type: 'battery',
  style: 'minimal',
  width: 64,
  height: 24,
  value: 72,
  segments: 5,
  thickness: 5,
  gap: 2,
  cornerRadius: 3,
  showTrack: true,
  pixelSnap: true,
  threshold: 128,
  foreground: '#FFFFFF',
  track: '#555555',
  background: '#000000',
};

export const GENERATOR_TYPE_LABELS: Record<GeneratorType, string> = {
  battery: 'Battery',
  signal: 'Signal',
  'linear-progress': 'Linear progress',
  'segmented-progress': 'Segmented progress',
  'ring-progress': 'Ring progress',
  volume: 'Volume',
};
