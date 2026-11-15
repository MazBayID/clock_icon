import { useEffect, useMemo, useState } from 'react';
import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

type CharacterOption = {
  id: string;
  label: string;
  description: string;
  animations: {
    id: string;
    frameCount: number;
    suffix: number;
  }[];
};

const CHARACTER_CATALOG: CharacterOption[] = [
  {
    id: 'mochi-face',
    label: 'Mochi Face',
    description: 'Koleksi animasi wajah Mochi untuk layar OLED SSD1306.',
    animations: [
      { id: 'mochi_001', frameCount: 84, suffix: 0 },
      { id: 'mochi_002', frameCount: 167, suffix: 1 },
      { id: 'mochi_003', frameCount: 84, suffix: 2 },
      { id: 'mochi_004', frameCount: 71, suffix: 3 },
      { id: 'mochi_005', frameCount: 87, suffix: 4 },
      { id: 'mochi_006', frameCount: 167, suffix: 5 },
      { id: 'mochi_007', frameCount: 167, suffix: 6 },
      { id: 'mochi_008', frameCount: 167, suffix: 7 },
      { id: 'mochi_009', frameCount: 119, suffix: 8 },
      { id: 'mochi_010', frameCount: 167, suffix: 9 },
    ],
  },
];

const FRAME_WIDTH = 98;
const FRAME_HEIGHT = 64;
const BASE_URL = import.meta.env.BASE_URL;

export function AnimationStudio() {
  const [selectedCharacterId, setSelectedCharacterId] = useState('mochi-face');
  const [selectedAnimationId, setSelectedAnimationId] = useState('mochi_001');
  const [frame, setFrame] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fps, setFps] = useState(12);
  const [isMuted, setIsMuted] = useState(false);

  const character = CHARACTER_CATALOG.find((item) => item.id === selectedCharacterId) ?? CHARACTER_CATALOG[0];
  const animation = character.animations.find((item) => item.id === selectedAnimationId) ?? character.animations[0];

  const frameUrl = useMemo(() => {
    const filename = `${String(frame).padStart(3, '0')}_mochi_${animation.suffix}.png`;
    return `${BASE_URL}${animation.id}/${filename}`;
  }, [animation, frame]);

  const audioUrl = `${BASE_URL}${animation.id}/audio_${animation.id}/${animation.id}.wav`;

  useEffect(() => {
    setFrame(1);
    setIsPlaying(true);
  }, [selectedAnimationId, selectedCharacterId]);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = window.setInterval(() => {
      setFrame((current) => (current >= animation.frameCount ? 1 : current + 1));
    }, 1000 / fps);
    return () => window.clearInterval(interval);
  }, [animation.frameCount, fps, isPlaying]);

  const handleCharacterChange = (id: string) => {
    setSelectedCharacterId(id);
    const nextCharacter = CHARACTER_CATALOG.find((item) => item.id === id);
    if (nextCharacter) setSelectedAnimationId(nextCharacter.animations[0].id);
  };

  return (
    <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
      <section className="rounded-xl border border-white/[0.08] bg-[#0B0D12] p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <div className="text-xs font-semibold tracking-[0.18em] uppercase text-sky-400 mb-2">Character animation workspace</div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Animation Studio</h1>
            <p className="text-sm text-slate-400 mt-2 max-w-2xl">Jelajahi, pratinjau, dan kendalikan animasi karakter untuk proyek display kecil seperti OLED SSD1306.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-lg bg-black/40 border border-white/[0.06] px-4 py-3">
              <div className="text-slate-500">Resolusi frame</div>
              <div className="font-mono-tabular text-white text-base mt-1">98 × 64 px</div>
            </div>
            <div className="rounded-lg bg-black/40 border border-white/[0.06] px-4 py-3">
              <div className="text-slate-500">Koleksi saat ini</div>
              <div className="text-white text-base mt-1">10 animasi</div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.65fr)] gap-6">
        <div className="rounded-xl border border-white/[0.08] bg-[#0B0D12] p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-sm font-semibold text-white">Live Preview</h2>
              <p className="text-xs text-slate-500 mt-1">Pratinjau frame aktual</p>
            </div>
            <span className="text-xs font-mono-tabular text-slate-400">{String(frame).padStart(3, '0')} / {animation.frameCount}</span>
          </div>

          <div className="min-h-[300px] sm:min-h-[390px] rounded-lg bg-black border border-white/[0.08] flex items-center justify-center p-5">
            <img
              key={frameUrl}
              src={frameUrl}
              alt={`${character.label}, ${animation.id}, frame ${frame}`}
              width={FRAME_WIDTH}
              height={FRAME_HEIGHT}
              className="pixelated-canvas w-[min(100%,588px)] h-auto"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => setIsPlaying((value) => !value)} className="inline-flex items-center gap-2 rounded-md bg-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 hover:bg-sky-300">
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              {isPlaying ? 'Jeda' : 'Putar'}
            </button>
            <button type="button" onClick={() => { setFrame(1); setIsPlaying(false); }} className="inline-flex items-center gap-2 rounded-md border border-white/[0.12] px-3 py-2.5 text-sm text-slate-200 hover:bg-white/[0.06]">
              <RotateCcw size={15} /> Ulangi
            </button>
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
              <span>FPS</span>
              <select value={fps} onChange={(event) => setFps(Number(event.target.value))} className="rounded-md border border-white/[0.12] bg-black px-2.5 py-2 text-white">
                {[4, 6, 8, 10, 12, 15, 20, 24, 30].map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </div>
          </div>

          <input aria-label="Posisi frame" type="range" min={1} max={animation.frameCount} value={frame} onChange={(event) => { setFrame(Number(event.target.value)); setIsPlaying(false); }} className="w-full mt-5 accent-sky-400" />
        </div>

        <aside className="space-y-6">
          <section className="rounded-xl border border-white/[0.08] bg-[#0B0D12] p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Karakter</h2>
            <label className="block text-xs text-slate-400 mb-2" htmlFor="animation-character">Pilih koleksi karakter</label>
            <select id="animation-character" value={selectedCharacterId} onChange={(event) => handleCharacterChange(event.target.value)} className="w-full rounded-md border border-white/[0.12] bg-black px-3 py-3 text-sm text-white">
              {CHARACTER_CATALOG.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
            <p className="text-xs text-slate-500 leading-relaxed mt-3">{character.description}</p>
            <div className="border-t border-white/[0.08] mt-5 pt-5">
              <label className="block text-xs text-slate-400 mb-2" htmlFor="animation-select">Animasi {character.label}</label>
              <select id="animation-select" value={selectedAnimationId} onChange={(event) => setSelectedAnimationId(event.target.value)} className="w-full rounded-md border border-white/[0.12] bg-black px-3 py-3 text-sm text-white">
                {character.animations.map((item, index) => <option key={item.id} value={item.id}>Animasi {String(index + 1).padStart(2, '0')} · {item.frameCount} frame</option>)}
              </select>
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.08] bg-[#0B0D12] p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-white">Audio</h2>
                <p className="text-xs text-slate-500 mt-1">Audio bawaan animasi</p>
              </div>
              <button type="button" onClick={() => setIsMuted((value) => !value)} aria-label={isMuted ? 'Aktifkan audio' : 'Bisukan audio'} className="rounded-md border border-white/[0.12] p-2 text-slate-300 hover:bg-white/[0.06]">
                {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>
            </div>
            <audio key={audioUrl} controls={!isMuted} muted={isMuted} preload="none" src={audioUrl} className="w-full mt-4" />
            <p className="text-[11px] text-slate-600 mt-2">Audio dapat diputar manual melalui kontrol di atas.</p>
          </section>

          <section className="rounded-xl border border-white/[0.08] bg-[#0B0D12] p-5">
            <h2 className="text-sm font-semibold text-white mb-3">Informasi aset</h2>
            <dl className="space-y-2 text-xs">
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Karakter</dt><dd className="text-slate-200">{character.label}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-500">ID animasi</dt><dd className="font-mono-tabular text-slate-200">{animation.id}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Jumlah frame</dt><dd className="font-mono-tabular text-slate-200">{animation.frameCount}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Format</dt><dd className="text-slate-200">PNG sequence + WAV</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-slate-500">Target</dt><dd className="text-slate-200">OLED SSD1306</dd></div>
            </dl>
          </section>
        </aside>
      </section>
    </main>
  );
}
