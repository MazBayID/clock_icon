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
    'Generator Angka': 'Numeral Generator', 'Generator Asset UI': 'UI Asset Generator',
    'Gaya Cyberpunk': 'Cyberpunk Styles', 'Unduh Semua': 'Download All',
    'Pilih': 'Select', 'Reset': 'Reset', 'Default': 'Default',
    'Katalog Gaya Angka': 'Numeral Style Catalog',
    'Kalibrasi Geometri & Rasterisasi 25×50px': '25×50px Geometry & Rasterization Calibration',
    'Reset Parameter': 'Reset Parameters', 'OLED Halus': 'Smooth OLED', '1-Bit Tajam': 'Sharp 1-Bit',
    'Ketebalan Batang': 'Stroke Thickness', 'Margin Aman (X / Y)': 'Safe Margin (X / Y)',
    'Bentuk Titik Dua (:)': 'Colon Shape (:)', 'Ambang Biner (1-Bit)': 'Binary Threshold (1-Bit)',
    'Set Aset Lengkap 0–9 & Titik Dua (:)': 'Complete Asset Set 0–9 & Colon (:)',
    '11 karakter · 25×50 piksel · Putih (#FFFFFF) di atas Hitam (#000000). Klik karakter untuk inspeksi piksel.': '11 characters · 25×50 pixels · White (#FFFFFF) on Black (#000000). Select a character to inspect its pixels.',
    'Pratinjau Sprite Sheet Horizontal (275 × 50 px)': 'Horizontal Sprite Sheet Preview (275 × 50 px)',
    'Array Firmware C/C++ (uint8_t L8 Luminance · 25×50 px)': 'C/C++ Firmware Array (uint8_t L8 Luminance · 25×50 px)',
    'Tersalin': 'Copied', 'Salin Kode': 'Copy Code', 'Simulasi Layar Smartwatch': 'Smartwatch Screen Simulation',
    'Dirender dari kanvas 25×50px aktual. Data kesehatan dan baterai adalah simulasi.': 'Rendered from the actual 25×50px canvas. Health and battery data are simulated.',
    'Kedip (:)': 'Blink (:)', 'Generator Kode Bitmap (image2cpp) & Aset Firmware Paket Gaya': 'Bitmap Code Generator (image2cpp) & Style Package Firmware Assets',
    'Hasilkan kode array byte PROGMEM seperti image2cpp untuk seluruh 11 karakter (0–9 & :) dalam satu paket gaya, plus berkas .BMP dan .BIN.': 'Generate image2cpp-style PROGMEM byte arrays for all 11 characters (0–9 & :) in one style package, plus .BMP and .BIN files.',
    'Pengaturan image2cpp': 'image2cpp Settings', 'Draw Mode (Arah Pemindaian Byte)': 'Draw Mode (Byte Scan Direction)',
    'Horizontal 1-bit (MSB · Adafruit GFX)': 'Horizontal 1-bit (MSB · Adafruit GFX)',
    'Horizontal 1-bit (LSB · U8g2 drawXBM)': 'Horizontal 1-bit (LSB · U8g2 drawXBM)',
    'Vertical 1-bit (LSB · SSD1306 / OLED Page)': 'Vertical 1-bit (LSB · SSD1306 / OLED Page)',
    'Vertical 1-bit (MSB · Top-Bit)': 'Vertical 1-bit (MSB · Top-Bit)',
    'Format Kode Keluaran': 'Output Code Format', 'Arduino / C++ (const unsigned char [] PROGMEM)': 'Arduino / C++ (const unsigned char [] PROGMEM)',
    'Standard C99 (static const uint8_t[])': 'Standard C99 (static const uint8_t[])',
    'Plain Bytes (Hex saja tanpa deklarasi)': 'Plain Bytes (Hex only, no declaration)',
    'MicroPython Dictionary (bytes([...]))': 'MicroPython Dictionary (bytes([...]))',
    'Identifier / Prefix': 'Identifier / Prefix', 'Cakupan Karakter': 'Character Range',
    'Semua 11': 'All 11', 'Brightness / Alpha Threshold': 'Brightness / Alpha Threshold',
    'Sertakan allArray[11]': 'Include allArray[11]', 'Karakter Paket (25×50px)': 'Package Characters (25×50px)',
    'Katalog Gaya Aset UI': 'UI Asset Style Catalog',
    'Tebal Garis': 'Line Thickness', 'Baterai': 'Battery', 'Progres': 'Progress',
    'Ambang': 'Threshold', 'Reset UI': 'Reset UI', 'Set Aset UI Smartwatch Lengkap (12 Ikon & Widget HUD)': 'Complete Smartwatch UI Asset Set (12 Icons & HUD Widgets)',
    '12 elemen UI siap pakai · Putih (#FFFFFF) di atas Hitam (#000000). Klik aset untuk inspeksi & edit piksel.': '12 ready-to-use UI elements · White (#FFFFFF) on Black (#000000). Select an asset to inspect and edit its pixels.',
    'Atlas UI PNG': 'UI PNG Atlas', 'Pratinjau Atlas Sprite UI Gabungan (Skala Asli 1:1)': 'Combined UI Sprite Atlas Preview (Native 1:1 Scale)',
    '12 Elemen UI · 1:1 Native': '12 UI Elements · 1:1 Native',
    'Array Firmware UI C/C++ (uint8_t L8 Luminance · 12 Aset)': 'UI C/C++ Firmware Array (uint8_t L8 Luminance · 12 Assets)',
    'Simulasi HUD UI Smartwatch': 'Smartwatch UI HUD Simulation',
    'Komposisi ikon dan widget UI pada layar OLED. Nilai telemetri adalah data simulasi.': 'UI icon and widget composition on the OLED screen. Telemetry values are simulated.',
    'Skala Asli 1:1 Native Piksel': 'Native 1:1 Pixel Scale', 'Cuaca Malam': 'Night Weather',
    'Generator Kode Bitmap UI (image2cpp) & Aset Firmware Paket': 'UI Bitmap Code Generator (image2cpp) & Package Firmware Assets',
    'Bangkitkan array byte PROGMEM untuk ke-12 ikon dan widget UI smartwatch beserta berkas .BMP dan .H.': 'Generate PROGMEM byte arrays for all 12 smartwatch UI icons and widgets, along with .BMP and .H files.',
    'Pengaturan image2cpp UI': 'UI image2cpp Settings', 'Cakupan Aset UI': 'UI Asset Range',
    'Semua 12': 'All 12', 'Satu Aset': 'Single Asset', 'Sertakan allArray[12]': 'Include allArray[12]',
    'Elemen Paket UI (12 Aset)': 'UI Package Elements (12 Assets)',
    'Perbandingan 10 Gaya Aset UI Smartwatch': 'Comparison of 10 Smartwatch UI Asset Styles',
    'Bandingkan seluruh bahasa visual UI mulai dari Swiss Micro-Line, Horologi, Aerospace HUD, hingga Cyberpunk UI secara berdampingan.': 'Compare all UI visual languages side by side, from Swiss Micro-Line and Horology to Aerospace HUD and Cyberpunk UI.',
    'Ulangi': 'Repeat',
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
    'Katalog Gaya Angka': 'Katalog ng Estilo ng Numero',
    'Kalibrasi Geometri & Rasterisasi 25×50px': 'Calibration ng Geometry at Rasterization 25×50px',
    'Reset Parameter': 'I-reset ang mga Parameter', 'OLED Halus': 'Smooth OLED', '1-Bit Tajam': 'Sharp 1-Bit',
    'Ketebalan Batang': 'Kapal ng Stroke', 'Margin Aman (X / Y)': 'Safe Margin (X / Y)',
    'Set Aset Lengkap 0–9 & Titik Dua (:)': 'Kumpletong Asset Set 0–9 at Colon (:)',
    'Pratinjau Sprite Sheet Horizontal (275 × 50 px)': 'Horizontal Sprite Sheet Preview (275 × 50 px)',
    'Array Firmware C/C++ (uint8_t L8 Luminance · 25×50 px)': 'C/C++ Firmware Array (uint8_t L8 Luminance · 25×50 px)',
    'Simulasi Layar Smartwatch': 'Smartwatch Screen Simulation', 'Pengaturan image2cpp': 'Mga Setting ng image2cpp',
    'Draw Mode (Arah Pemindaian Byte)': 'Draw Mode (Direksyon ng Byte Scan)', 'Format Kode Keluaran': 'Output Code Format',
    'Cakupan Karakter': 'Character Range', 'Semua 11': 'Lahat ng 11',
    'Katalog Gaya Aset UI': 'Katalog ng Estilo ng UI Asset', 'Tebal Garis': 'Kapal ng Linya',
    'Baterai': 'Baterya', 'Progres': 'Progress', 'Ambang': 'Threshold', 'Reset UI': 'I-reset ang UI',
    'Set Aset UI Smartwatch Lengkap (12 Ikon & Widget HUD)': 'Kumpletong Smartwatch UI Asset Set (12 Icon at HUD Widget)',
    'Pratinjau Atlas Sprite UI Gabungan (Skala Asli 1:1)': 'Combined UI Sprite Atlas Preview (Native 1:1 Scale)',
    'Simulasi HUD UI Smartwatch': 'Smartwatch UI HUD Simulation',
    'Generator Kode Bitmap UI (image2cpp) & Aset Firmware Paket': 'UI Bitmap Code Generator (image2cpp) at Package Firmware Assets',
    'Pengaturan image2cpp UI': 'Mga Setting ng UI image2cpp', 'Cakupan Aset UI': 'UI Asset Range',
    'Satu Aset': 'Isang Asset', 'Perbandingan 10 Gaya Aset UI Smartwatch': 'Paghahambing ng 10 Smartwatch UI Asset Style',
    'Ulangi': 'Ulitin',
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
    'Katalog Gaya Angka': '数字样式目录',
    'Kalibrasi Geometri & Rasterisasi 25×50px': '25×50px 几何与栅格校准',
    'Reset Parameter': '重置参数', 'OLED Halus': '平滑 OLED', '1-Bit Tajam': '锐利 1 位',
    'Ketebalan Batang': '笔画粗细', 'Margin Aman (X / Y)': '安全边距 (X / Y)',
    'Set Aset Lengkap 0–9 & Titik Dua (:)': '完整数字资源集 0–9 和冒号 (:)',
    'Pratinjau Sprite Sheet Horizontal (275 × 50 px)': '横向精灵图预览 (275 × 50 px)',
    'Array Firmware C/C++ (uint8_t L8 Luminance · 25×50 px)': 'C/C++ 固件数组 (uint8_t L8 亮度 · 25×50 px)',
    'Simulasi Layar Smartwatch': '智能手表屏幕模拟', 'Pengaturan image2cpp': 'image2cpp 设置',
    'Draw Mode (Arah Pemindaian Byte)': '绘制模式（字节扫描方向）', 'Format Kode Keluaran': '输出代码格式',
    'Cakupan Karakter': '字符范围', 'Semua 11': '全部 11 个',
    'Katalog Gaya Aset UI': 'UI 资源样式目录', 'Tebal Garis': '线条粗细',
    'Baterai': '电池', 'Progres': '进度', 'Ambang': '阈值', 'Reset UI': '重置 UI',
    'Set Aset UI Smartwatch Lengkap (12 Ikon & Widget HUD)': '完整智能手表 UI 资源集（12 个图标和 HUD 组件）',
    'Pratinjau Atlas Sprite UI Gabungan (Skala Asli 1:1)': '组合 UI 精灵图集预览（原生 1:1 比例）',
    'Simulasi HUD UI Smartwatch': '智能手表 UI HUD 模拟',
    'Generator Kode Bitmap UI (image2cpp) & Aset Firmware Paket': 'UI 位图代码生成器 (image2cpp) 与固件资源包',
    'Pengaturan image2cpp UI': 'UI image2cpp 设置', 'Cakupan Aset UI': 'UI 资源范围',
    'Satu Aset': '单个资源', 'Perbandingan 10 Gaya Aset UI Smartwatch': '10 种智能手表 UI 资源样式比较',
    'Ulangi': '重复',
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
    'Katalog Gaya Angka': '数字スタイルカタログ',
    'Kalibrasi Geometri & Rasterisasi 25×50px': '25×50px ジオメトリとラスタライズの調整',
    'Reset Parameter': 'パラメーターをリセット', 'OLED Halus': '滑らかな OLED', '1-Bit Tajam': 'シャープな 1 ビット',
    'Ketebalan Batang': '線の太さ', 'Margin Aman (X / Y)': '安全マージン (X / Y)',
    'Set Aset Lengkap 0–9 & Titik Dua (:)': '数字アセット一式 0–9 とコロン (:)',
    'Pratinjau Sprite Sheet Horizontal (275 × 50 px)': '横向きスプライトシートプレビュー (275 × 50 px)',
    'Array Firmware C/C++ (uint8_t L8 Luminance · 25×50 px)': 'C/C++ ファームウェア配列 (uint8_t L8 輝度 · 25×50 px)',
    'Simulasi Layar Smartwatch': 'スマートウォッチ画面シミュレーション', 'Pengaturan image2cpp': 'image2cpp 設定',
    'Draw Mode (Arah Pemindaian Byte)': '描画モード（バイト走査方向）', 'Format Kode Keluaran': '出力コード形式',
    'Cakupan Karakter': '文字範囲', 'Semua 11': 'すべて 11 個',
    'Katalog Gaya Aset UI': 'UI アセットスタイルカタログ', 'Tebal Garis': '線の太さ',
    'Baterai': 'バッテリー', 'Progres': '進行状況', 'Ambang': 'しきい値', 'Reset UI': 'UI をリセット',
    'Set Aset UI Smartwatch Lengkap (12 Ikon & Widget HUD)': 'スマートウォッチ UI アセット一式（12 個のアイコンと HUD ウィジェット）',
    'Pratinjau Atlas Sprite UI Gabungan (Skala Asli 1:1)': '統合 UI スプライトアトラスプレビュー（ネイティブ 1:1）',
    'Simulasi HUD UI Smartwatch': 'スマートウォッチ UI HUD シミュレーション',
    'Generator Kode Bitmap UI (image2cpp) & Aset Firmware Paket': 'UI ビットマップコード生成 (image2cpp) とファームウェアアセット',
    'Pengaturan image2cpp UI': 'UI image2cpp 設定', 'Cakupan Aset UI': 'UI アセット範囲',
    'Satu Aset': '単一アセット', 'Perbandingan 10 Gaya Aset UI Smartwatch': 'スマートウォッチ UI アセット 10 スタイルの比較',
    'Ulangi': '繰り返す',
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
    output = output.split(source).join(target);
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
      const dataKey = 'i18nOriginal' + attribute.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase());
      if (element.dataset[dataKey] === undefined) {
        element.dataset[dataKey] = current;
      }
      const original = element.dataset[dataKey] ?? current;
      const translated = translateText(original, language);
      if (translated !== current) element.setAttribute(attribute, translated);
    });
  });
}
