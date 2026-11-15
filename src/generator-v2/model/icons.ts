export const ICON_ASSET_IDS = [
  'bluetooth',
  'wifi',
  'heart',
  'steps',
  'notification',
  'weather-sun',
  'weather-moon',
  'alarm',
  'ecg-divider',
] as const;

export type IconAssetId = (typeof ICON_ASSET_IDS)[number];

export interface IconAssetMeta {
  id: IconAssetId;
  name: string;
  shortLabel: string;
  group: 'connectivity' | 'health' | 'environment' | 'interface';
  width: number;
  height: number;
  description: string;
}

export const ICON_ASSET_CATALOG: IconAssetMeta[] = [
  { id: 'bluetooth', name: 'Koneksi Bluetooth', shortLabel: 'BT Link', group: 'connectivity', width: 24, height: 28, description: 'Simbol tautan nirkabel jarak dekat menuju ponsel pendamping.' },
  { id: 'wifi', name: 'Gelombang Wi-Fi', shortLabel: 'Wi-Fi', group: 'connectivity', width: 28, height: 24, description: 'Busur transmisi data nirkabel untuk sinkronisasi OTA.' },
  { id: 'heart', name: 'Detak Jantung (BPM)', shortLabel: 'Jantung', group: 'health', width: 28, height: 28, description: 'Emblem sensor optik PPG untuk pemantauan denyut jantung kontinu.' },
  { id: 'steps', name: 'Penghitung Langkah', shortLabel: 'Langkah', group: 'health', width: 28, height: 28, description: 'Ikon aktivitas langkah harian untuk ringkasan kebugaran.' },
  { id: 'notification', name: 'Notifikasi & Peringatan', shortLabel: 'Notif', group: 'interface', width: 28, height: 28, description: 'Lonceng peringatan pesan masuk dengan titik indikator aktif.' },
  { id: 'weather-sun', name: 'Cuaca Cerah / UV', shortLabel: 'Cerah', group: 'environment', width: 28, height: 28, description: 'Ikon indeks matahari dan kondisi cuaca siang hari.' },
  { id: 'weather-moon', name: 'Mode Malam / DND', shortLabel: 'Malam', group: 'environment', width: 28, height: 28, description: 'Simbol bulan sabit untuk mode tidur dan cuaca malam.' },
  { id: 'alarm', name: 'Alarm & Kronometer', shortLabel: 'Alarm', group: 'environment', width: 28, height: 28, description: 'Penanda pengatur waktu dan alarm mekanis pada dial jam.' },
  { id: 'ecg-divider', name: 'Gelombang Telemetry & HUD', shortLabel: 'ECG Bar', group: 'interface', width: 64, height: 20, description: 'Pita pemisah telemetri bergaya denyut EKG dan braket HUD.' },
];

export function getIconAssetMeta(id: IconAssetId): IconAssetMeta {
  return ICON_ASSET_CATALOG.find((asset) => asset.id === id) ?? ICON_ASSET_CATALOG[0];
}


export interface IconRenderOptions {
  width: number;
  height: number;
  strokeScale: number;
  padding: number;
  pixelSnap: boolean;
  threshold: number;
}

export const DEFAULT_ICON_RENDER_OPTIONS: IconRenderOptions = {
  width: 28,
  height: 28,
  strokeScale: 1,
  padding: 1,
  pixelSnap: false,
  threshold: 128,
};

export function createDefaultIconRenderOptions(id: IconAssetId): IconRenderOptions {
  const asset = getIconAssetMeta(id);
  return { ...DEFAULT_ICON_RENDER_OPTIONS, width: asset.width, height: asset.height };
}

export function normalizeIconRenderOptions(options: IconRenderOptions): IconRenderOptions {
  return {
    width: Math.max(8, Math.min(512, Math.round(Number.isFinite(options.width) ? options.width : 28))),
    height: Math.max(8, Math.min(512, Math.round(Number.isFinite(options.height) ? options.height : 28))),
    strokeScale: Math.max(0.75, Math.min(1.3, Number.isFinite(options.strokeScale) ? options.strokeScale : 1)),
    padding: Math.max(0, Math.min(3, Math.round(Number.isFinite(options.padding) ? options.padding : 1))),
    pixelSnap: Boolean(options.pixelSnap),
    threshold: Math.max(64, Math.min(210, Math.round(Number.isFinite(options.threshold) ? options.threshold : 128))),
  };
}
