import { GlyphStyleMeta, StyleCategory } from '../types/glyph';

export const STYLE_CATEGORIES: { id: StyleCategory; label: string }[] = [
  { id: 'all', label: 'Semua Gaya' },
  { id: 'modern', label: 'Modern' },
  { id: 'elegan', label: 'Elegan' },
  { id: 'teknologi', label: 'Berteknologi' },
  { id: 'cyberpunk', label: 'Cyberpunk' },
];

export const GLYPH_STYLES: GlyphStyleMeta[] = [
  // ================= MODERN (4) =================
  {
    id: 'aether-grotesque',
    name: 'Aether Neo-Grotesque',
    category: 'modern',
    categoryLabel: 'Modern',
    tagline: 'Proporsi Swiss presisi dengan apertur terbuka & jebakan optik',
    architectureNote:
      'Geometri super-elips vertikal 1:2 dengan ketebalan batang konstan, terminal horizontal rata, dan keseimbangan piksel optimal pada OLED berkerapatan tinggi.',
    recommendedMode: 'antialiased',
    targetWatches: 'Flagship AMOLED Minimalis',
  },
  {
    id: 'luminar-fluid',
    name: 'Luminar Fluid Curve',
    category: 'modern',
    categoryLabel: 'Modern',
    tagline: 'Kurva G2 kontinu yang halus untuk keterbacaan instan saat bergerak',
    architectureNote:
      'Ujung sapuan membulat sempurna dengan lengkungan terbuka yang lapang pada angka 3, 5, 6, dan 9 agar cepat terbaca dalam sekilas pandang.',
    recommendedMode: 'antialiased',
    targetWatches: 'Sport & Wellness Titanium',
  },
  {
    id: 'bauhaus-geo',
    name: 'Bauhaus Disk Geometry',
    category: 'modern',
    categoryLabel: 'Modern',
    tagline: 'Minimalisme geometris murni terinspirasi desain industri Dieter Rams',
    architectureNote:
      'Membangun setiap angka dari kombinasi busur lingkaran murni dan potongan garis tegak lurus tanpa ornamen berlebih untuk estetika modernis ikonik.',
    recommendedMode: 'antialiased',
    targetWatches: 'Minimalist Design Watch',
  },
  {
    id: 'hyper-kinetic',
    name: 'Hyper-Kinetic Sport',
    category: 'modern',
    categoryLabel: 'Modern',
    tagline: 'Siluet atletik bertenaga dengan sudut dinamis untuk jam olahraga pro',
    architectureNote:
      'Batang tebal berenergi tinggi dengan kemiringan aerodinamis ringan dan ruang dalam lebar agar tetap tajam terbaca saat lari atau bersepeda.',
    recommendedMode: 'antialiased',
    targetWatches: 'Endurance & Multisport GPS',
  },

  // ================= ELEGAN (4) =================
  {
    id: 'chronos-horology',
    name: 'Chronos Haute Horology',
    category: 'elegan',
    categoryLabel: 'Elegan',
    tagline: 'Kontras tinggi terinspirasi mekanika horologi Swiss mewah',
    architectureNote:
      'Memadukan batang vertikal tegas dengan garis silang tipis elegan, terminal tirus halus, serta penanda titik dua berfaset berlian.',
    recommendedMode: 'antialiased',
    targetWatches: 'Luxury Dress Smartwatch',
  },
  {
    id: 'monolith-slab',
    name: 'Monolith Arsitektural',
    category: 'elegan',
    categoryLabel: 'Elegan',
    tagline: 'Siluet blok tinggi berkarakter tegas dengan celah batin mikro',
    architectureNote:
      'Mengoptimalkan lebar 25px dengan blok padat berwibawa dan ruang negatif 3px di tengah untuk kesan arsitektural yang kokoh dan abadi.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Ceramic & Sapphire Edition',
  },
  {
    id: 'atelier-stencil',
    name: 'Atelier Luxury Stencil',
    category: 'elegan',
    categoryLabel: 'Elegan',
    tagline: 'Stensil adibusana horologi dengan jembatan celah presisi tinggi',
    architectureNote:
      'Menggabungkan lekuk elegan berstandar butik jam mewah dengan potongan celah stensil diagonal dan horizontal yang memberi ruang bernapas artistik.',
    recommendedMode: 'antialiased',
    targetWatches: 'Haute Couture & Titanium Gold',
  },
  {
    id: 'obsidian-inline',
    name: 'Obsidian Double-Line',
    category: 'elegan',
    categoryLabel: 'Elegan',
    tagline: 'Ukiran garis ganda (inline) terinspirasi grafir logam jam klasik',
    architectureNote:
      'Setiap batang angka diukir dengan garis rambut hitam 1px di bagian inti, menciptakan efek kilau relief perhiasan mewah di atas layar OLED hitam.',
    recommendedMode: 'antialiased',
    targetWatches: 'Collector Bespoke Edition',
  },

  // ================= BERTEKNOLOGI (4) =================
  {
    id: 'vektor-hud',
    name: 'Vektor Aerospace HUD',
    category: 'teknologi',
    categoryLabel: 'Berteknologi',
    tagline: 'Sudut chamfer 45° dengan celah mikro presisi ala kokpit aviasi',
    architectureNote:
      'Potongan sudut oktagonal simetris dipadu pemisah struktural 1.2px untuk menciptakan nuansa instrumen penerbangan canggih tanpa mengorbankan legibilitas.',
    recommendedMode: 'antialiased',
    targetWatches: 'Titanium Tactical & Aviation',
  },
  {
    id: 'kinetik-matrix',
    name: 'Kinetik Segmented Pro',
    category: 'teknologi',
    categoryLabel: 'Berteknologi',
    tagline: 'Segmen berfaset modern dengan sambungan diagonal berpresisi tinggi',
    architectureNote:
      'Evolusi tampilan multi-segmen kelas atas: setiap bilah segmen memiliki ujung meruncing 45° dan celah isolasi hitam pekat untuk efisiensi daya OLED.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Pro Chrono & Hybrid OLED',
  },
  {
    id: 'quantum-dot',
    name: 'Quantum Micro-Matrix',
    category: 'teknologi',
    categoryLabel: 'Berteknologi',
    tagline: 'Susunan matriks titik micro-LED 5×9 berjarak presisi tinggi',
    architectureNote:
      'Merender angka menggunakan kisi 5 kolom × 9 baris nodus micro-LED bulat sempurna di dalam kanvas 25×50px untuk tampilan instrumen teknis ultra-modern.',
    recommendedMode: 'antialiased',
    targetWatches: 'Industrial Minimal & Telemetry',
  },
  {
    id: 'orbital-dual',
    name: 'Orbital Dual-Track',
    category: 'teknologi',
    categoryLabel: 'Berteknologi',
    tagline: 'Jalur rel ganda paralel futuristik bergaya instrumen antariksa',
    architectureNote:
      'Konstruksi dua garis paralel berjarak seragam dengan kanal tengah gelap, menghadirkan estetika navigasi orbital dan rekayasa kedirgantaraan.',
    recommendedMode: 'antialiased',
    targetWatches: 'Spacecraft & Tech Flagship',
  },

  // ================= CYBERPUNK (6) =================
  {
    id: 'mecha-katana',
    name: 'Mecha-Katana Slant',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Kemiringan kinetik 10° dengan ujung tebasan bilah diagonal tajam',
    architectureNote:
      'Garis potong miring 35° pada terminal, lekukan takik mekanis pada batang utama, serta titik dua berbentuk bilah kembar agresif.',
    recommendedMode: 'antialiased',
    targetWatches: 'Cybernetic Streetwear OLED',
  },
  {
    id: 'glitch-2099',
    name: 'Glitch-Sector 2099',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Pergeseran kanal scanline terkendali dengan takik sinyal distopia',
    architectureNote:
      'Lapisan horizontal terbelah celah scanline 1px dengan pergeseran mikro ±1.2px yang dikalibrasi ketat agar seluruh angka 0–9 tetap terbaca tajam di 25×50px.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Neo-Tokyo Cyber Mod Watch',
  },
  {
    id: 'circuit-rail',
    name: 'Circuit-Rail PCB',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Jalur sirkuit 90°/45° dengan simpul sudut dan nodus terminal',
    architectureNote:
      'Dibangun dari rute konduktor PCB sudut 45° lengkap dengan rongga nodus terminal dan titik dua heksagonal untuk estetika perangkat keras futuristik.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Hacker & Hardware Enthusiast',
  },
  {
    id: 'neo-kanji-tech',
    name: 'Neo-Shibuya Cyber',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Geometri jalanan Neo-Tokyo dengan palang atas berat & kait tajam',
    architectureNote:
      'Kontras palang horizontal tebal dengan sudut kait menyiku ala tipografi futuristik Shibuya, memberi bobot visual kuat pada layar OLED gelap.',
    recommendedMode: 'antialiased',
    targetWatches: 'Urban Cyber & Gaming Watch',
  },
  {
    id: 'holo-scanline',
    name: 'Holo-CRT Scanline',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Proyeksi hologram bergaris raster CRT dengan bingkai kontur tegas',
    architectureNote:
      'Mengiris isi angka secara horizontal menggunakan celah raster 1px berirama seperti proyektor hologram 2088 namun tetap menjaga batas luar tetap utuh.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Retro-Futuristic Cyber OLED',
  },
  {
    id: 'exo-frame-bracket',
    name: 'Exo-Frame Armored',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Blok zirah eksoskeleton dengan takik sudut diagonal & paku baut',
    architectureNote:
      'Struktur berat berbingkai braket mekanis dengan potongan sudut 45° asimetris dan celah ventilasi mikro untuk kesan perangkat tempur cyber.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Rugged Armor Cyber Watch',
  },
  {
    id: 'kurogane-heavy',
    name: 'Kurogane Cyber Brush',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Kaligrafi mecha tebal berkarakter artistik dengan taji diagonal tajam',
    architectureNote:
      'Batang super-tebal terinspirasi poster mecha Neo-Tokyo: menggabungkan lengkungan dalam organik, potongan diagonal tajam pada terminal, dan taji asimetris yang ekspresif.',
    recommendedMode: 'antialiased',
    targetWatches: 'Artistic Cyber Flagship OLED',
  },
  {
    id: 'synth-blade-bold',
    name: 'Synth-Blade Sculpted',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Siluet blok tebal yang dibelah retakan bilah diagonal 30° artistik',
    architectureNote:
      'Massa geometris tebal dengan pahatan sudut terpangkas dan celah belahan miring 1.4px yang menciptakan dinamika kecepatan tinggi khas desain sampul synth-cyber.',
    recommendedMode: 'antialiased',
    targetWatches: 'Cyber-Artistic Collector Watch',
  },
  {
    id: 'oni-chrome-brutal',
    name: 'Oni-Chrome Brutalist',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Brutalisme cyber-deco berat dengan taring sudut & pahatan bertingkat',
    architectureNote:
      'Pilar vertikal masif 6px dipadu serif taring tajam dan celah relief bertingkat pada tiap lengkungan untuk kehadiran visual maksimal pada layar smartwatch hitam.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Heavy Statement Cyber Watch',
  },
  {
    id: 'chrome-shard-v2',
    name: 'Chrome-Shard Fracture',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Pecahan kristal poligonal tajam dengan retakan petir diagonal',
    architectureNote:
      'Siluet bersudut tajam yang dipecah oleh rekahan kilat diagonal zig-zag dan penanda titik dua berbentuk serpihan segitiga presisi.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Cyber-Fragment AMOLED Watch',
  },
  {
    id: 'wireframe-void',
    name: 'Wireframe Netrunner',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Kontur CAD wireframe berongga ala antarmuka peretas Netrunner',
    architectureNote:
      'Garis tepi luar tipis 1.2px yang membungkus ruang hitam berongga dengan simpul sudut teknikal, menghasilkan tampilan cetak biru cyberspace yang sangat ringan di OLED.',
    recommendedMode: 'antialiased',
    targetWatches: 'Netrunner & CAD HUD Watch',
  },
  {
    id: 'cyber-stencil-2077',
    name: 'Night-Sector Stencil',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Stensil militer korporat distopia dengan jembatan belahan 45°',
    architectureNote:
      'Blok industri berat yang dipotong oleh celah stensil miring 45° konsisten pada setiap angka untuk karakter taktis Night-Sector.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Tactical Corpo-Cyber Watch',
  },
  {
    id: 'plasma-tube-cyber',
    name: 'Plasma-Tube Neon',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Estetika tabung neon ganda bercahaya dengan sambungan simpul sudut',
    architectureNote:
      'Mengkonstruksi angka menggunakan tabung neon kontur ganda dengan efek rongga dalam dan ujung konektor terisolasi untuk nuansa distrik neon.',
    recommendedMode: 'antialiased',
    targetWatches: 'Neon District OLED Watch',
  },
  {
    id: 'binary-barcode-cyber',
    name: 'Barcode-Net 88',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Angka blok berat beraksen irisan kode batang data vertikal',
    architectureNote:
      'Memadukan keterbacaan blok cyber tegas dengan irisan vertikal kode batang (barcode) berirama di bagian mahkota dan dasar angka.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Cyber-Identity & Data Watch',
  },
  {
    id: 'vortex-razor-italic',
    name: 'Vortex Razor 16°',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Kemiringan kecepatan ekstrem 16° lengkap dengan ekor garis kecepatan',
    architectureNote:
      'Sudut miring agresif 16° dengan kumis garis kecepatan horizontal di terminal atas dan bawah serta titik dua chevron ganda.',
    recommendedMode: 'antialiased',
    targetWatches: 'Cyber-Racing & Hyper-Speed OLED',
  },
  {
    id: 'cyber-hex-hive',
    name: 'Hex-Hive Cyborg',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Anyaman zirah cyborg berperforasi mikro ala struktur sarang lebah',
    architectureNote:
      'Blok tebal dengan lubang perforasi teratur berpola kisi mikro di dalam batang utama untuk efisiensi OLED dan tekstur zirah sibernetik.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Cyborg Armor OLED Watch',
  },
  {
    id: 'ronin-katana-split',
    name: 'Ronin Dual-Split',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Siluet terbelah horisontal di ekuator dengan pergeseran katana',
    architectureNote:
      'Membelah setiap angka tepat di garis tengah y=25 dengan pergeseran ±1.5px berlawanan arah, menciptakan efek tebasan energi berkecepatan tinggi.',
    recommendedMode: 'antialiased',
    targetWatches: 'Neo-Ronin Streetwear Watch',
  },
  {
    id: 'datastream-rain',
    name: 'Datastream Matrix',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Jejak hujan data vertikal dengan piksel jatuh di ujung terminal',
    architectureNote:
      'Mengukir celah kolom vertikal tipis 1px dengan titik piksel jatuh berirama ala aliran kode matriks cyberspace.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Matrix Terminal Smartwatch',
  },
  {
    id: 'subzero-visor',
    name: 'Subzero Cyber Visor',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Siluet helm visor futuristik dengan celah pandang tengah yang tajam',
    architectureNote:
      'Bibir atas dan bawah ekstra kokoh membingkai celah visor horizontal di tengah serta garis inti vertikal yang tajam.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Tactical Visor Helmet Watch',
  },
  {
    id: 'tachyon-chevron',
    name: 'Tachyon Chevron',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Dinding samping meruncing berbentuk mata panah kecepatan cyber',
    architectureNote:
      'Mengganti sisi vertikal lurus dengan sudut chevron simetris yang menunjuk ke depan untuk kesan aerodinamis fiksi ilmiah.',
    recommendedMode: 'antialiased',
    targetWatches: 'Hyper-Velocity Sci-Fi Watch',
  },
  {
    id: 'volt-arc-surge',
    name: 'Volt-Arc Surge',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Loncatan busur listrik zig-zag dengan nodus percikan energi',
    architectureNote:
      'Menyisipkan patahan sudut petir bertegangan tinggi pada batang vertikal serta titik dua berbentuk percikan berlian tajam.',
    recommendedMode: 'antialiased',
    targetWatches: 'High-Voltage Cyber Watch',
  },
  {
    id: 'mecha-rivet-plate',
    name: 'Mecha-Rivet Titan',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Pelat baja mecha berat lengkap dengan lubang paku keling sudut',
    architectureNote:
      'Terinspirasi penanda lambung robot tempur raksasa: pelat tebal berlubang rivet presisi di tiap simpul sudut.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Heavy Mecha Titan Watch',
  },
  {
    id: 'cyber-gothic-2100',
    name: 'Cyber-Gothic 2100',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Fusi artistik blackletter gotik gelap dan tipografi cyber masa depan',
    architectureNote:
      'Memadukan pilar vertikal berat dengan puncak jarum gotik runcing dan penanda titik dua berlian runcing khas subkultur cyber-goth.',
    recommendedMode: 'antialiased',
    targetWatches: 'Dark Cyber-Artistic Edition',
  },
  {
    id: 'pixel-dither-punk',
    name: 'Dither-Punk Bayer',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Tekstur bayangan dither 2×2 retro-cyberpunk berpresisi piksel',
    architectureNote:
      'Tepi kiri-atas solid yang bergradasi ke pola papan catur 1-bit Bayer dither pada sisi kanan-bawah, tampil autentik di mode 1-bit dan image2cpp.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Retro-Cyber Terminal & MIP',
  },
  {
    id: 'signal-jammer',
    name: 'Signal-Jammer Noise',
    category: 'cyberpunk',
    categoryLabel: 'Cyberpunk',
    tagline: 'Interferensi gelombang frekuensi dengan takik spektrum asimetris',
    architectureNote:
      'Menampilkan gerigi spektrum sinyal 1px pada sisi atas-bawah serta garis pemotong interferensi ganda yang terukur tanpa merusak keterbacaan.',
    recommendedMode: 'pixel-snap',
    targetWatches: 'Electronic Warfare HUD Watch',
  },
];

export function getStyleMeta(id: string): GlyphStyleMeta {
  return GLYPH_STYLES.find((s) => s.id === id) ?? GLYPH_STYLES[0];
}
