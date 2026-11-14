import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Download, Film, Pause, Play, RefreshCw } from 'lucide-react';

type MochiFrame = {
  index: number;
  file: string;
  durationMs: number;
};

type MochiManifest = {
  digit: string;
  frameSize: { width: number; height: number };
  fps: number;
  frameDurationMs: number;
  frameCount: number;
  totalDurationMs: number;
  sheet: {
    file: string;
    columns: number;
    rows: number;
    width: number;
    height: number;
  };
  frames: MochiFrame[];
};

type MochiIndex = {
  frameSize: { width: number; height: number };
  fps: number;
  animations: Array<{
    digit: string;
    manifest: string;
    frameCount: number;
    totalDurationMs: number;
  }>;
};

const ASSET_ROOT = '/assets/mochi';

export function MochiAnimationStudio() {
  const [index, setIndex] = useState<MochiIndex | null>(null);
  const [manifests, setManifests] = useState<Record<string, MochiManifest>>({});
  const [selectedDigit, setSelectedDigit] = useState('0');
  const [selectedFrame, setSelectedFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadAssets() {
      setIsLoading(true);
      setLoadError('');
      try {
        const indexResponse = await fetch(`${ASSET_ROOT}/index.json`);
        if (!indexResponse.ok) {
          throw new Error('Manifest animasi belum tersedia. Jalankan workflow pemrosesan Mochi terlebih dahulu.');
        }

        const loadedIndex = (await indexResponse.json()) as MochiIndex;
        const entries = await Promise.all(
          loadedIndex.animations.map(async (animation) => {
            const response = await fetch(`${ASSET_ROOT}/${animation.manifest}`);
            if (!response.ok) {
              throw new Error(`Manifest untuk digit ${animation.digit} tidak ditemukan.`);
            }
            return [animation.digit, (await response.json()) as MochiManifest] as const;
          })
        );

        if (!cancelled) {
          setIndex(loadedIndex);
          setManifests(Object.fromEntries(entries));
          setSelectedDigit(loadedIndex.animations[0]?.digit ?? '0');
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : 'Gagal memuat aset Mochi.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    void loadAssets();
    return () => {
      cancelled = true;
    };
  }, []);

  const animation = manifests[selectedDigit];
  const frame = animation?.frames[selectedFrame];
  const frameUrl = frame ? `${ASSET_ROOT}/${selectedDigit}/${frame.file}` : '';
  const sheetUrl = animation ? `${ASSET_ROOT}/${selectedDigit}/${animation.sheet.file}` : '';

  useEffect(() => {
    if (!isPlaying || !animation || animation.frameCount < 2) return;

    const interval = window.setInterval(() => {
      setSelectedFrame((current) => (current + 1) % animation.frameCount);
    }, 1000 / animation.fps);

    return () => window.clearInterval(interval);
  }, [isPlaying, animation]);

  useEffect(() => {
    setSelectedFrame(0);
    setIsPlaying(false);
  }, [selectedDigit]);

  const durationLabel = useMemo(() => {
    if (!animation) return '—';
    return `${(animation.totalDurationMs / 1000).toFixed(2)} detik`;
  }, [animation]);

  const selectDigit = (digit: string) => {
    setSelectedDigit(digit);
    setSelectedFrame(0);
    setIsPlaying(false);
  };

  const moveFrame = (direction: -1 | 1) => {
    if (!animation) return;
    setIsPlaying(false);
    setSelectedFrame((current) => (
      (current + direction + animation.frameCount) % animation.frameCount
    ));
  };

  return (
    <main className="flex-1 min-w-0 p-5 sm:p-7 space-y-6">
      <section className="rounded-xl border border-white/[0.09] bg-[#0B0D12] p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-400">
              <Film className="h-4 w-4" />
              Mochi Animation Studio
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Generator Animasi Wajah Mochi
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
              Pilih animasi digit, putar frame pada kecepatan sumber 10 FPS, lalu periksa
              urutan frame dan spritesheet hasil konversi 64 × 48 piksel.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-mono-tabular">
            <span className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-slate-300">
              Sumber 256 × 192
            </span>
            <span className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-slate-300">
              Output 64 × 48
            </span>
            <span className="rounded-md border border-white/10 bg-black/30 px-3 py-2 text-slate-300">
              10 FPS
            </span>
          </div>
        </div>
      </section>

      {isLoading ? (
        <section className="rounded-xl border border-white/[0.08] bg-[#0B0D12] p-8 text-center text-sm text-slate-400">
          <RefreshCw className="mx-auto mb-3 h-5 w-5 animate-spin" />
          Memuat manifest dan frame animasi Mochi...
        </section>
      ) : loadError ? (
        <section className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-6">
          <div className="text-sm font-semibold text-amber-200">Aset animasi belum siap</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">{loadError}</p>
          <p className="mt-3 text-xs text-slate-500">
            ZIP sumber tetap aman di public/assets/aistudio/. Setelah workflow berhasil,
            manifest dan frame hasil konversi akan tersedia di public/assets/mochi/.
          </p>
        </section>
      ) : (
        <>
          <section className="rounded-xl border border-white/[0.08] bg-[#0B0D12] p-4 sm:p-5">
            <div className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-500">
              Pilih animasi digit
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
              {index?.animations.map((item) => (
                <button
                  key={item.digit}
                  type="button"
                  onClick={() => selectDigit(item.digit)}
                  aria-pressed={selectedDigit === item.digit}
                  className={`rounded-lg border px-3 py-3 text-lg font-bold transition-colors ${
                    selectedDigit === item.digit
                      ? 'border-sky-400 bg-sky-400 text-slate-950'
                      : 'border-white/10 bg-black/30 text-slate-300 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {item.digit}
                </button>
              ))}
            </div>
          </section>

          {animation && frame && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              <section id="mochi-preview" className="xl:col-span-5 rounded-xl border border-white/[0.08] bg-[#0B0D12] p-5">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-white">Pratinjau animasi</h2>
                  <span className="text-xs font-mono-tabular text-sky-300">MOCHI_{selectedDigit}</span>
                </div>

                <div className="mt-5 flex min-h-[250px] items-center justify-center rounded-lg border border-white/[0.07] bg-[#07090D] p-6">
                  <img
                    key={frameUrl}
                    src={frameUrl}
                    alt={`Mochi digit ${selectedDigit}, frame ${selectedFrame}`}
                    width={64}
                    height={48}
                    className="h-auto w-64 max-w-full object-contain [image-rendering:pixelated]"
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveFrame(-1)}
                    className="rounded-md border border-white/10 p-2 text-slate-300 hover:bg-white/5"
                    aria-label="Frame sebelumnya"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPlaying((value) => !value)}
                    className="inline-flex items-center gap-2 rounded-md bg-sky-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-sky-300"
                  >
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? 'Jeda' : 'Putar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFrame(1)}
                    className="rounded-md border border-white/10 p-2 text-slate-300 hover:bg-white/5"
                    aria-label="Frame berikutnya"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <a
                    href={frameUrl}
                    download={`mochi_${selectedDigit}_${String(selectedFrame).padStart(3, '0')}.png`}
                    className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Unduh frame
                  </a>
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
                    <span>Frame {selectedFrame + 1} / {animation.frameCount}</span>
                    <span>{frame.durationMs} ms</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={Math.max(0, animation.frameCount - 1)}
                    value={selectedFrame}
                    onChange={(event) => {
                      setIsPlaying(false);
                      setSelectedFrame(Number(event.target.value));
                    }}
                    className="w-full accent-sky-400"
                    aria-label="Pilih frame animasi"
                  />
                </div>
              </section>

              <section id="mochi-frames" className="xl:col-span-7 rounded-xl border border-white/[0.08] bg-[#0B0D12] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold text-white">Informasi & spritesheet</h2>
                    <p className="mt-1 text-xs text-slate-500">Urutan frame mengikuti indeks numerik dari ZIP sumber.</p>
                  </div>
                  <a
                    href={sheetUrl}
                    download={`mochi_${selectedDigit}_spritesheet.png`}
                    className="inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Unduh spritesheet
                  </a>
                </div>

                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    ['Jumlah frame', String(animation.frameCount)],
                    ['Kecepatan', `${animation.fps} FPS`],
                    ['Durasi total', durationLabel],
                    ['Resolusi', `${animation.frameSize.width} × ${animation.frameSize.height}`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-md border border-white/[0.07] bg-black/25 p-3">
                      <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
                      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 overflow-auto rounded-lg border border-white/[0.07] bg-[#07090D] p-3">
                  <img
                    src={sheetUrl}
                    alt={`Spritesheet animasi Mochi digit ${selectedDigit}`}
                    className="mx-auto h-auto max-w-full [image-rendering:pixelated]"
                  />
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                  Pratinjau menggunakan frame PNG individual. Spritesheet disediakan sebagai
                  aset ekspor untuk integrasi firmware atau editor eksternal.
                </p>
              </section>
            </div>
          )}
        </>
      )}
    </main>
  );
}
