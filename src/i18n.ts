export type Language = 'en' | 'id' | 'fil' | 'zh' | 'ja';

export const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'id', label: 'Indonesian', native: 'Bahasa Indonesia' },
  { code: 'fil', label: 'Filipino', native: 'Filipino' },
  { code: 'zh', label: 'Chinese', native: '中文' },
  { code: 'ja', label: 'Japanese', native: '日本語' },
];

const dictionaries: Record<Exclude<Language, 'id'>, Record<string, string>> = {
  en: {
    'Aset 25×50': '25×50 Assets', 'Aset UI': 'UI Assets', 'Simulasi Jam': 'Watch Preview',
    'Inspektor Piksel': 'Pixel Inspector', 'Generator Bitmap': 'Bitmap Generator',
    'Komparasi Gaya': 'Style Comparison', 'Tutup navigasi': 'Close navigation',
    'Buka navigasi': 'Open navigation', 'Mengemas...': 'Packaging...',
    'Unduh Paket Lengkap (ZIP)': 'Download Full Package (ZIP)', 'Unduh ZIP (Aset UI)': 'Download UI Assets (ZIP)',
    'Pilihan Generating:': 'Generator Mode:', 'Pilihan Mode Generator Aset Smartwatch': 'Smartwatch Asset Generator Mode',
    'Set: 0–9 & : (11 glif)': 'Set: 0–9 & : (11 glyphs)', 'Kanvas: 25×50 px': 'Canvas: 25×50 px',
    'Set:': 'Set:', 'Ikon & Widget UI': 'UI Icons & Widgets', 'Palet:': 'Palette:',
    'Karakter: Mochi Face': 'Character: Mochi Face', 'Animasi: 10 koleksi': 'Animations: 10 collections',
    'Karakter': 'Characters', 'Dimensi': 'Dimensions', 'Rasio': 'Aspect Ratio',
    'Koleksi UI': 'UI Collection', 'Elemen / Gaya': 'Elements / Style', 'Format': 'Format',
    'Gaya': 'Styles', 'Aset': 'Assets', 'Unduh': 'Download', 'Pratinjau': 'Preview',
    'Simulasi': 'Preview', 'Piksel': 'Pixel', 'Ukuran': 'Size', 'Aktif': 'Active',
    'Total': 'Total', 'Isi Paket ZIP Gaya Ini': 'Contents of This Style ZIP',
    'Format Aktif': 'Active Format', 'Ukuran per Karakter': 'Size per Character',
    'Total 11 Karakter (0–9, :)': '11 Characters Total (0–9, :)',
    'Mode Render:': 'Render Mode:', 'Sinyal:': 'Signal:', 'Ikuti Gaya': 'Match Style',
    'Mode Piksel Output': 'Output Pixel Mode', 'Margin horizontal piksel': 'Horizontal Pixel Margin',
    'Margin vertikal piksel': 'Vertical Pixel Margin', 'Dimensi kanvas': 'Canvas Dimensions',
    'Piksel aktif': 'Active Pixels', 'Beban luminansi OLED': 'OLED Luminance Load',
    'Bounding box': 'Bounding Box', 'Palet ekspor': 'Export Palette',
    'Pembesaran glif': 'Glyph Magnification', 'kali': 'by', 'Skala': 'Scale',
    'Hanya-baca': 'Read-only', 'Pratinjau detail dan pengukuran glif 25×50 px. Piksel bersifat hanya-baca.': 'Detailed preview and measurement of the 25×50 px glyph. Pixels are read-only.',
    'Ukuran Asli 1:1 (25×50 px)': 'Original Size 1:1 (25×50 px)',
    'Pratinjau native OLED': 'Native OLED Preview', 'Dimensi ekspor aktual tepat 25px × 50px.': 'Exact export dimensions: 25px × 50px.',
    'Mengemas ZIP...': 'Packaging ZIP...', 'Mengemas Paket...': 'Packaging...',
    'Unduh .h': 'Download .h', 'Mengemas Paket UI...': 'Packaging UI assets...',
    'Unduh Paket UI (ZIP)': 'Download UI Package (ZIP)', 'Unduh Paket UI Lengkap (ZIP)': 'Download Full UI Package (ZIP)',
    'Isi Paket ZIP UI Ini': 'Contents of This UI ZIP', 'Dimensi Aset Aktif': 'Active Asset Dimensions',
    'Unduh Kode': 'Download Code', 'Format Ekspor:': 'Export Formats:',
    'Character animation workspace': 'Character animation workspace', 'Animation Studio': 'Animation Studio',
    'Jelajahi, pratinjau, dan kendalikan animasi karakter untuk proyek display kecil seperti OLED SSD1306.': 'Explore, preview, and control character animations for small-display projects such as the SSD1306 OLED.',
    'Resolusi frame': 'Frame Resolution', 'Koleksi saat ini': 'Current Collection',
    '10 animasi': '10 animations', 'Live Preview': 'Live Preview', 'Pratinjau frame aktual': 'Live Frame Preview',
    'FPS': 'FPS', 'Pilih koleksi karakter': 'Choose a Character Collection', 'Audio': 'Audio',
    'Audio dan frame berjalan tersinkronisasi': 'Audio and frames are synchronized',
    'Putar, jeda, dan pengaturan FPS mengendalikan audio serta animasi bersama.': 'Play, pause, and FPS settings control audio and animation together.',
    'Informasi aset': 'Asset Information', 'ID animasi': 'Animation ID', 'Jumlah frame': 'Frame Count',
    'PNG sequence + WAV': 'PNG sequence + WAV', 'Target': 'Target', 'OLED SSD1306': 'SSD1306 OLED',
    'Koleksi animasi wajah Mochi untuk layar OLED SSD1306.': 'Mochi face animation collection for SSD1306 OLED displays.',
    'Audio gagal diputar. Periksa pemuatan file atau coba tekan Putar lagi.': 'Audio playback failed. Check the file loading or press Play again.',
    'Aktifkan audio': 'Enable audio', 'Bisukan audio': 'Mute audio',
    'File audio tidak dapat dimuat. Periksa jalur aset WAV.': 'Audio file could not be loaded. Check the WAV asset path.',
    'Unduh Paket Lengkap (PNG + BMP + image2cpp ZIP)': 'Download Full Package (PNG + BMP + image2cpp ZIP)',
    'Koordinat 0–9 & : pada Sprite 275×50': 'Coordinates 0–9 & : on 275×50 Sprite',
    'Mengemas Paket...': 'Packaging package...', 'Palet ekspor': 'Export Palette',
    'Generator Angka': 'Numeral Generator', 'Generator Asset UI': 'UI Asset Generator',
    'Gaya Cyberpunk': 'Cyberpunk Styles', 'Unduh Semua': 'Download All',
    'Pilih': 'Select', 'Reset': 'Reset', 'Default': 'Default',
  },
  fil: {
    'Aset 25×50': 'Mga Asset 25×50', 'Aset UI': 'Mga UI Asset', 'Simulasi Jam': 'Preview ng Relo',
    'Inspektor Piksel': 'Pixel Inspector', 'Generator Bitmap': 'Bitmap Generator',
    'Komparasi Gaya': 'Paghahambing ng Estilo', 'Tutup navigasi': 'Isara ang navigation',
    'Buka navigasi': 'Buksan ang navigation', 'Mengemas...': 'Inihahanda...',
    'Unduh Paket Lengkap (ZIP)': 'I-download ang Buong Package (ZIP)', 'Unduh ZIP (Aset UI)': 'I-download ang UI Assets (ZIP)',
    'Pilihan Generating:': 'Mode ng Generator:', 'Pilihan Mode Generator Aset Smartwatch': 'Mode ng Smartwatch Asset Generator',
    'Set: 0–9 & : (11 glif)': 'Set: 0–9 & : (11 glyph)', 'Kanvas: 25×50 px': 'Canvas: 25×50 px',
    'Karakter': 'Mga Character', 'Dimensi': 'Mga Dimensyon', 'Rasio': 'Aspect Ratio',
    'Koleksi UI': 'Koleksyon ng UI', 'Elemen / Gaya': 'Mga Elemento / Estilo', 'Format': 'Format',
    'Gaya': 'Mga Estilo', 'Aset': 'Mga Asset', 'Unduh': 'I-download', 'Pratinjau': 'Preview',
    'Simulasi': 'Preview', 'Piksel': 'Pixel', 'Ukuran': 'Laki', 'Aktif': 'Aktibo',
    'Total': 'Kabuuan', 'Format Aktif': 'Aktibong Format', 'Ukuran per Karakter': 'Laki bawat Character',
    'Mode Render:': 'Render Mode:', 'Sinyal:': 'Signal:', 'Ikuti Gaya': 'Sundin ang Estilo',
    'Dimensi kanvas': 'Mga Dimensyon ng Canvas', 'Piksel aktif': 'Mga Aktibong Pixel',
    'Beban luminansi OLED': 'OLED Luminance Load', 'Bounding box': 'Bounding Box',
    'Palet ekspor': 'Export Palette', 'Hanya-baca': 'Read-only', 'Audio': 'Audio',
    'Pilih koleksi karakter': 'Pumili ng Character Collection', 'Informasi aset': 'Impormasyon ng Asset',
    'Jumlah frame': 'Bilang ng Frame', 'Target': 'Target', 'FPS': 'FPS',
    'Unduh .h': 'I-download ang .h', 'Mengemas ZIP...': 'Inihahanda ang ZIP...',
    'Animation Studio': 'Animation Studio', 'Pratinjau frame aktual': 'Live Frame Preview',
    'Aktifkan audio': 'Paganahin ang audio', 'Bisukan audio': 'I-mute ang audio',
    'Reset': 'I-reset', 'Pilih': 'Pumili',
  },
  zh: {
    'Aset 25×50': '25×50 资源', 'Aset UI': 'UI 资源', 'Simulasi Jam': '手表预览',
    'Inspektor Piksel': '像素检查器', 'Generator Bitmap': '位图生成器',
    'Komparasi Gaya': '样式比较', 'Tutup navigasi': '关闭导航', 'Buka navigasi': '打开导航',
    'Mengemas...': '正在打包...', 'Unduh Paket Lengkap (ZIP)': '下载完整包 (ZIP)',
    'Unduh ZIP (Aset UI)': '下载 UI 资源 (ZIP)', 'Pilihan Generating:': '生成器模式：',
    'Karakter': '字符', 'Dimensi': '尺寸', 'Rasio': '宽高比', 'Koleksi UI': 'UI 集合',
    'Elemen / Gaya': '元素 / 样式', 'Format': '格式', 'Gaya': '样式', 'Aset': '资源',
    'Unduh': '下载', 'Pratinjau': '预览', 'Simulasi': '预览', 'Piksel': '像素',
    'Ukuran': '大小', 'Aktif': '当前', 'Total': '总计', 'Format Aktif': '当前格式',
    'Ukuran per Karakter': '每个字符的大小', 'Mode Render:': '渲染模式：', 'Sinyal:': '信号：',
    'Dimensi kanvas': '画布尺寸', 'Piksel aktif': '活动像素', 'Beban luminansi OLED': 'OLED 亮度负载',
    'Bounding box': '边界框', 'Palet ekspor': '导出调色板', 'Hanya-baca': '只读',
    'Pilih koleksi karakter': '选择角色集合', 'Audio': '音频', 'Informasi aset': '资源信息',
    'Jumlah frame': '帧数', 'Target': '目标', 'FPS': '帧率', 'Unduh .h': '下载 .h',
    'Animation Studio': '动画工作室', 'Pratinjau frame aktual': '实时帧预览',
    'Aktifkan audio': '启用音频', 'Bisukan audio': '静音', 'Reset': '重置', 'Pilih': '选择',
  },
  ja: {
    'Aset 25×50': '25×50 アセット', 'Aset UI': 'UI アセット', 'Simulasi Jam': '時計プレビュー',
    'Inspektor Piksel': 'ピクセルインスペクター', 'Generator Bitmap': 'ビットマップ生成',
    'Komparasi Gaya': 'スタイル比較', 'Tutup navigasi': 'ナビゲーションを閉じる',
    'Buka navigasi': 'ナビゲーションを開く', 'Mengemas...': 'パッケージ作成中...',
    'Unduh Paket Lengkap (ZIP)': '完全パッケージをダウンロード (ZIP)',
    'Unduh ZIP (Aset UI)': 'UI アセットをダウンロード (ZIP)', 'Pilihan Generating:': '生成モード：',
    'Karakter': '文字', 'Dimensi': '寸法', 'Rasio': '比率', 'Koleksi UI': 'UI コレクション',
    'Elemen / Gaya': '要素 / スタイル', 'Format': '形式', 'Gaya': 'スタイル', 'Aset': 'アセット',
    'Unduh': 'ダウンロード', 'Pratinjau': 'プレビュー', 'Simulasi': 'プレビュー',
    'Piksel': 'ピクセル', 'Ukuran': 'サイズ', 'Aktif': '現在', 'Total': '合計',
    'Format Aktif': '現在の形式', 'Ukuran per Karakter': '文字ごとのサイズ',
    'Mode Render:': '描画モード：', 'Sinyal:': '信号：', 'Dimensi kanvas': 'キャンバス寸法',
    'Piksel aktif': '有効ピクセル', 'Beban luminansi OLED': 'OLED 輝度負荷',
    'Bounding box': '境界ボックス', 'Palet ekspor': 'エクスポートパレット',
    'Hanya-baca': '読み取り専用', 'Pilih koleksi karakter': 'キャラクターコレクションを選択',
    'Audio': 'オーディオ', 'Informasi aset': 'アセット情報', 'Jumlah frame': 'フレーム数',
    'Target': '対象', 'FPS': 'FPS', 'Unduh .h': '.h をダウンロード',
    'Animation Studio': 'アニメーションスタジオ', 'Pratinjau frame aktual': 'ライブフレームプレビュー',
    'Aktifkan audio': '音声を有効化', 'Bisukan audio': 'ミュート', 'Reset': 'リセット', 'Pilih': '選択',
  },
};

const wordMaps: Record<Exclude<Language, 'id'>, Record<string, string>> = {
  en: { 'Pilih': 'Select', 'Semua': 'All', 'Kategori': 'Category', 'Koleksi': 'Collection', 'Gaya': 'Style', 'Aset': 'Asset', 'Glif': 'Glyph', 'Karakter': 'Character', 'Dimensi': 'Dimensions', 'Ukuran': 'Size', 'Piksel': 'Pixel', 'Unduh': 'Download', 'Pratinjau': 'Preview', 'Simulasi': 'Preview', 'Ekspor': 'Export', 'Aktif': 'Active', 'Mode': 'Mode', 'Sinyal': 'Signal', 'Baterai': 'Battery', 'Tingkat': 'Level', 'Warna': 'Color', 'Lebar': 'Width', 'Tinggi': 'Height', 'Reset': 'Reset', 'Putar': 'Play', 'Jeda': 'Pause', 'Informasi': 'Information', 'Saat ini': 'Current', 'Target': 'Target' },
  fil: { 'Pilih': 'Pumili', 'Semua': 'Lahat', 'Kategori': 'Kategorya', 'Koleksi': 'Koleksyon', 'Gaya': 'Estilo', 'Aset': 'Asset', 'Glif': 'Glyph', 'Karakter': 'Character', 'Dimensi': 'Mga Dimensyon', 'Ukuran': 'Laki', 'Piksel': 'Pixel', 'Unduh': 'I-download', 'Pratinjau': 'Preview', 'Simulasi': 'Preview', 'Ekspor': 'I-export', 'Aktif': 'Aktibo', 'Mode': 'Mode', 'Sinyal': 'Signal', 'Baterai': 'Baterya', 'Warna': 'Kulay', 'Reset': 'I-reset', 'Putar': 'I-play', 'Jeda': 'I-pause', 'Informasi': 'Impormasyon', 'Target': 'Target' },
  zh: { 'Pilih': '选择', 'Semua': '全部', 'Kategori': '类别', 'Koleksi': '集合', 'Gaya': '样式', 'Aset': '资源', 'Glif': '字形', 'Karakter': '字符', 'Dimensi': '尺寸', 'Ukuran': '大小', 'Piksel': '像素', 'Unduh': '下载', 'Pratinjau': '预览', 'Simulasi': '预览', 'Ekspor': '导出', 'Aktif': '当前', 'Mode': '模式', 'Sinyal': '信号', 'Baterai': '电池', 'Warna': '颜色', 'Reset': '重置', 'Putar': '播放', 'Jeda': '暂停', 'Informasi': '信息', 'Target': '目标' },
  ja: { 'Pilih': '選択', 'Semua': 'すべて', 'Kategori': 'カテゴリー', 'Koleksi': 'コレクション', 'Gaya': 'スタイル', 'Aset': 'アセット', 'Glif': 'グリフ', 'Karakter': '文字', 'Dimensi': '寸法', 'Ukuran': 'サイズ', 'Piksel': 'ピクセル', 'Unduh': 'ダウンロード', 'Pratinjau': 'プレビュー', 'Simulasi': 'プレビュー', 'Ekspor': 'エクスポート', 'Aktif': '現在', 'Mode': 'モード', 'Sinyal': '信号', 'Baterai': 'バッテリー', 'Warna': '色', 'Reset': 'リセット', 'Putar': '再生', 'Jeda': '一時停止', 'Informasi': '情報', 'Target': '対象' },
};

const originals = new WeakMap<Node, string>();
const applied = new WeakMap<Node, string>();

export function translateText(input: string, language: Language): string {
  if (language === 'id') return input;
  const dictionary = dictionaries[language];
  const trimmed = input.trim();
  if (dictionary[trimmed]) return input.replace(trimmed, dictionary[trimmed]);
  let output = input;
  for (const [source, target] of Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length)) {
    if (source.length > 2) output = output.split(source).join(target);
  }
  for (const [source, target] of Object.entries(wordMaps[language]).sort((a, b) => b[0].length - a[0].length)) {
    output = output.replace(new RegExp(source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), target);
  }
  return output;
}

export function applyLanguage(root: HTMLElement, language: Language): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const current = node.nodeValue ?? '';
    if (!current.trim()) continue;
    const last = applied.get(node);
    if (last === undefined || current !== last) originals.set(node, current);
    const original = originals.get(node) ?? current;
    const translated = translateText(original, language);
    if (translated !== current) {
      node.nodeValue = translated;
      applied.set(node, translated);
    } else {
      applied.set(node, current);
    }
  }

  const attributes = ['aria-label', 'title', 'placeholder'];
  root.querySelectorAll<HTMLElement>('*').forEach((element) => {
    attributes.forEach((attribute) => {
      const current = element.getAttribute(attribute);
      if (current === null) return;
      const key = attribute + ':' + current;
      const translated = translateText(current, language);
      if (translated !== current) element.setAttribute(attribute, translated);
      else if (language === 'id' && element.dataset['i18nOriginal' + attribute] !== undefined) {
        element.setAttribute(attribute, element.dataset['i18nOriginal' + attribute] ?? current);
      }
      if (element.dataset['i18nOriginal' + attribute] === undefined) {
        element.dataset['i18nOriginal' + attribute] = current;
      }
    });
  });
}
