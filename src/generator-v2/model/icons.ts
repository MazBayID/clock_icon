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
