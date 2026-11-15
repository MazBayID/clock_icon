export type UiStyleCategory = 'all' | 'modern-ui' | 'elegan-ui' | 'taktis-ui' | 'cyberpunk-ui';
export type UiStyleId =
  | 'swiss-precision-ui' | 'neo-solid-pill' | 'horology-bezel-ui' | 'obsidian-frame-ui'
  | 'aerospace-hud-ui' | 'quantum-dot-ui' | 'cyber-katana-ui' | 'circuit-pcb-ui'
  | 'glitch-crt-ui' | 'oni-brutal-ui';

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

export const UI_STYLE_CATEGORIES: { id: UiStyleCategory; label: string }[] = [
  { id: 'all', label: 'Semua Gaya UI' },
  { id: 'modern-ui', label: 'Minimal & Modern' },
  { id: 'elegan-ui', label: 'Horologi & Elegan' },
  { id: 'taktis-ui', label: 'HUD & Taktis' },
  { id: 'cyberpunk-ui', label: 'Cyberpunk UI' },
];

export const UI_STYLES: UiStyleMeta[] = [
  // ================= MINIMAL & MODERN (2) =================
  {
    id: 'swiss-precision-ui',
    name: 'Swiss Micro-Line UI',
    category: 'modern-ui',
    categoryLabel: 'Minimal & Modern',
    tagline: 'Garis vektor Swiss konstan 1.6px dengan ujung membulat bersih',
    architectureNote:
      'Ikonografi garis halus proporsional terinspirasi desain antarmuka jam flagship: ruang napas lega, sudut seragam, dan keterbacaan optimal pada layar AMOLED.',
    recommendedMode: 'antialiased',
    targetWatches: 'Flagship AMOLED Minimalis',
  },
  {
    id: 'neo-solid-pill',
    name: 'Neo-Solid Glyph UI',
    category: 'modern-ui',
    categoryLabel: 'Minimal & Modern',
    tagline: 'Siluet padat berukir ruang negatif hitam untuk keterbacaan outdoor',
    architectureNote:
      'Menggunakan massa putih #FFFFFF penuh dipadu potongan ruang dalam tajam agar ikon status tetap kontras di bawah terik matahari.',
    recommendedMode: 'antialiased',
    targetWatches: 'Sport & Outdoor AMOLED',
  },

  // ================= HOROLOGI & ELEGAN (2) =================
  {
    id: 'horology-bezel-ui',
    name: 'Chronos Horology UI',
    category: 'elegan-ui',
    categoryLabel: 'Horologi & Elegan',
    tagline: 'Bingkai sub-dial klasik lengkap dengan penanda sudut berlian',
    architectureNote:
      'Menghadirkan nuansa komplikasi jam mekanis Swiss dengan aksen titik faset, garis silang halus, dan proporsi cincin sub-dial berjarak terukur.',
    recommendedMode: 'antialiased',
    targetWatches: 'Luxury Dress Smartwatch',
  },
  {
    id: 'obsidian-frame-ui',
    name: 'Obsidian Double-Track UI',
    category: 'elegan-ui',
    categoryLabel: 'Horologi & Elegan',
    tagline: 'Ukiran kontur ganda (inline) bergaya grafir logam mulia',
    architectureNote:
      'Membentuk ikon dari rel ganda paralel berongga hitam 1px di tengah sapuan, menghasilkan estetika perhiasan horologi hemat piksel OLED.',
    recommendedMode: 'antialiased',
    targetWatches: 'Ceramic & Titanium Gold',
  },

  // ================= HUD & TAKTIS (2) =================
  {
    id: 'aerospace-hud-ui',
    name: 'Vektor Aerospace HUD',
    category: 'taktis-ui',
    categoryLabel: 'HUD & Taktis',
    tagline: 'Sudut chamfer 45° dan garis bidik instrumen kokpit penerbangan',
    architectureNote:
      'Setiap wadah baterai, cincin progres, dan ikon mengadopsi poligon oktagonal 45° dengan takik kalibrasi presisi khas aviasi.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Aviation & Tactical GPS',
  },
  {
    id: 'quantum-dot-ui',
    name: 'Quantum Micro-Matrix UI',
    category: 'taktis-ui',
    categoryLabel: 'HUD & Taktis',
    tagline: 'Konstruksi matriks nodus micro-LED dan cincin gauge putus-putus',
    architectureNote:
      'Mengurai elemen UI menjadi kisi titik diskrit dan segmen terukur untuk estetika laboratorium telemetri serta efisiensi daya layar OLED.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Industrial Telemetry Watch',
  },

  // ================= CYBERPUNK UI (4) =================
  {
    id: 'cyber-katana-ui',
    name: 'Mecha-Katana Slash UI',
    category: 'cyberpunk-ui',
    categoryLabel: 'Cyberpunk UI',
    tagline: 'Kemiringan kinetik 10° dengan ujung tebasan bilah diagonal',
    architectureNote:
      'Membawa bahasa visual tebasan katana ke seluruh elemen UI: bilah baterai miring, cincin progres terbelah, dan puncak ikon yang terpotong tajam.',
    recommendedMode: 'antialiased',
    targetWatches: 'Cybernetic Streetwear OLED',
  },
  {
    id: 'circuit-pcb-ui',
    name: 'Circuit-Rail PCB UI',
    category: 'cyberpunk-ui',
    categoryLabel: 'Cyberpunk UI',
    tagline: 'Jalur konduktor 90°/45° lengkap dengan simpul lubang via solder',
    architectureNote:
      'Merakit ikon status dan widget progres layaknya jejak tembaga papan sirkuit tercetak dengan nodus pad berongga di setiap ujung garis.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Hacker & Hardware Edition',
  },
  {
    id: 'glitch-crt-ui',
    name: 'Glitch-CRT Scanline UI',
    category: 'cyberpunk-ui',
    categoryLabel: 'Cyberpunk UI',
    tagline: 'Raster scanline 1px dengan pergeseran pita sinyal distopia',
    architectureNote:
      'Mengiris ikon solid dengan garis raster horizontal CRT berirama serta pergeseran mikro ±1px tanpa merusak pengenalan simbol.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Neo-Tokyo Cyber Mod Watch',
  },
  {
    id: 'oni-brutal-ui',
    name: 'Oni-Chrome Armored UI',
    category: 'cyberpunk-ui',
    categoryLabel: 'Cyberpunk UI',
    tagline: 'Pelat zirah berat dengan braket sudut taring dan paku keling',
    architectureNote:
      'Gaya cyberpunk artistik tebal untuk elemen antarmuka: bingkai zirah berat, braket pojok tajam, dan bilah status berotot di atas hitam pekat.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Heavy Statement Cyber Watch',
  },
];


export function getUiStyleMeta(id: string): UiStyleMeta {
  return UI_STYLES.find((style) => style.id === id) ?? UI_STYLES[0];
}
