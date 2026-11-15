import React, { useEffect, useState } from 'react';
import {
  CustomPixelMap,
  GlyphChar,
  GlyphRenderOptions,
  StyleId,
} from '../types/glyph';
import { GlyphCanvas } from './GlyphCanvas';

interface WatchPreviewProps {
  styleId: StyleId;
  options: GlyphRenderOptions;
  customMap: CustomPixelMap;
}

type CaseShape = 'round' | 'square' | 'raw';
type TimeMode = 'live' | 'custom' | 'cycle';

function formatNowHHMM(): string {
  const now = new Date();
  const h = now.getHours().toString().padStart(2, '0');
  const m = now.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export const WatchPreview: React.FC<WatchPreviewProps> = ({
  styleId,
  options,
  customMap,
}) => {
  const [caseShape, setCaseShape] = useState<CaseShape>('round');
  const [timeMode, setTimeMode] = useState<TimeMode>('custom');
  const [customTime, setCustomTime] = useState('10:48');
  const [liveTime, setLiveTime] = useState(formatNowHHMM);
  const [cycleDigit, setCycleDigit] = useState(0);
  const [blinkColon, setBlinkColon] = useState(false);
  const [colonVisible, setColonVisible] = useState(true);

  useEffect(() => {
    if (timeMode !== 'live') return;
    const id = setInterval(() => setLiveTime(formatNowHHMM()), 1000);
    return () => clearInterval(id);
  }, [timeMode]);

  useEffect(() => {
    if (timeMode !== 'cycle') return;
    const id = setInterval(() => setCycleDigit((d) => (d + 1) % 10), 850);
    return () => clearInterval(id);
  }, [timeMode]);

  useEffect(() => {
    if (!blinkColon) {
      setColonVisible(true);
      return;
    }
    const id = setInterval(() => setColonVisible((v) => !v), 650);
    return () => clearInterval(id);
  }, [blinkColon]);

  const displayTime =
    timeMode === 'live'
      ? liveTime
      : timeMode === 'cycle'
        ? `${cycleDigit}${cycleDigit}:${cycleDigit}${cycleDigit}`
        : customTime;

  // Sanitize to 5 chars [d, d, ':', d, d]
  const chars: GlyphChar[] = [];
  const clean = displayTime.replace(/[^0-9:]/g, '');
  const parts = clean.includes(':')
    ? clean.split(':')
    : [clean.slice(0, 2), clean.slice(2, 4)];
  const hh = (parts[0] || '10').padStart(2, '0').slice(-2);
  const mm = (parts[1] || '48').padStart(2, '0').slice(0, 2);
  const normalized = `${hh}:${mm}`;

  for (const c of normalized) {
    if (c === ':' || (c >= '0' && c <= '9')) {
      chars.push(c as GlyphChar);
    }
  }

  const spriteScale = caseShape === 'raw' ? 1 : 2;
  const dateLabel = new Date().toLocaleDateString('id-ID', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  });

  return (
    <div className="bg-[#0C0E13] border border-white/[0.08] rounded-lg p-5 flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Simulasi Layar Smartwatch
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Dirender dari kanvas 25×50px aktual. Data kesehatan dan baterai adalah simulasi.
          </p>
        </div>

        {/* Case Shape Selector */}
        <div className="flex items-center gap-1 p-0.5 rounded-md bg-black border border-white/[0.08]">
          {[
            { id: 'round', label: 'Bulat 46mm' },
            { id: 'square', label: 'Kotak Ultra' },
            { id: 'raw', label: 'Asli 1:1' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCaseShape(item.id as CaseShape)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                caseShape === item.id
                  ? 'bg-white text-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Watch Face Viewport */}
      <div className="py-8 flex items-center justify-center bg-[#07080A] border border-white/[0.06] rounded-md my-4 min-h-[300px]">
        {caseShape === 'round' && (
          <div className="relative w-[264px] h-[264px] rounded-full bg-gradient-to-b from-[#2A2F3A] via-[#171A22] to-[#0E1015] p-[10px] shadow-2xl border border-white/15 flex items-center justify-center">
            {/* Crown Button */}
            <div
              className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-9 rounded-r bg-gradient-to-b from-[#404756] to-[#1D212A] border-y border-r border-white/20"
              aria-hidden="true"
            />
            {/* Inner Bezel & Pure Black OLED Dial */}
            <div className="w-full h-full rounded-full bg-black border border-white/10 flex flex-col items-center justify-between py-6 px-4 relative overflow-hidden">
              {/* Subtle minute tick ring */}
              <div className="text-[10px] font-mono-tabular tracking-widest text-slate-400 uppercase">
                {dateLabel}
              </div>

              {/* Actual 25x50 Glyphs rendered at crisp 2x */}
              <div className="flex items-center justify-center gap-[3px]">
                {chars.map((ch, idx) => (
                  <div
                    key={`${idx}-${ch}`}
                    style={{ opacity: ch === ':' && !colonVisible ? 0.1 : 1 }}
                    className="animate-glyph-enter transition-opacity duration-200"
                  >
                    <GlyphCanvas
                      char={ch}
                      styleId={styleId}
                      options={options}
                      customPixels={customMap[styleId]?.[ch] ?? null}
                      scale={spriteScale}
                    />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 text-[10px] font-mono-tabular text-slate-400">
                <span>72 BPM</span>
                <span aria-hidden="true">·</span>
                <span>94%</span>
              </div>
            </div>
          </div>
        )}

        {caseShape === 'square' && (
          <div className="relative w-[238px] h-[278px] rounded-[42px] bg-gradient-to-b from-[#2E3440] via-[#181B22] to-[#0E1015] p-[11px] shadow-2xl border border-white/15 flex items-center justify-center">
            {/* Side Action Crown */}
            <div
              className="absolute -right-2.5 top-[72px] w-2.5 h-10 rounded-r bg-gradient-to-b from-[#454D5E] to-[#1E222B] border-y border-r border-white/20"
              aria-hidden="true"
            />
            <div className="w-full h-full rounded-[32px] bg-black border border-white/10 flex flex-col items-center justify-between py-6 px-4">
              <div className="w-full flex items-center justify-between px-2 text-[10px] font-mono-tabular text-slate-400">
                <span>{dateLabel}</span>
                <span>100%</span>
              </div>

              <div className="flex items-center justify-center gap-[3px]">
                {chars.map((ch, idx) => (
                  <div
                    key={`${idx}-${ch}`}
                    style={{ opacity: ch === ':' && !colonVisible ? 0.1 : 1 }}
                    className="animate-glyph-enter transition-opacity duration-200"
                  >
                    <GlyphCanvas
                      char={ch}
                      styleId={styleId}
                      options={options}
                      customPixels={customMap[styleId]?.[ch] ?? null}
                      scale={spriteScale}
                    />
                  </div>
                ))}
              </div>

              <div className="w-full flex items-center justify-between px-2 text-[10px] font-mono-tabular text-slate-500">
                <span>6.420 LKH</span>
                <span>24°C</span>
              </div>
            </div>
          </div>
        )}

        {caseShape === 'raw' && (
          <div className="flex flex-col items-center gap-3">
            <div className="p-4 bg-black border border-dashed border-white/20 flex items-center justify-center gap-[2px]">
              {chars.map((ch, idx) => (
                <div
                  key={`${idx}-${ch}`}
                  style={{ opacity: ch === ':' && !colonVisible ? 0.1 : 1 }}
                  className="animate-glyph-enter transition-opacity duration-200"
                >
                  <GlyphCanvas
                    char={ch}
                    styleId={styleId}
                    options={options}
                    customPixels={customMap[styleId]?.[ch] ?? null}
                    scale={1}
                  />
                </div>
              ))}
            </div>
            <span className="text-xs font-mono-tabular text-slate-400">
              Skala Asli 1:1 (5 × 25×50 px = 125×50 px)
            </span>
          </div>
        )}
      </div>

      {/* Time Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1 p-0.5 rounded-md bg-black border border-white/[0.08]">
          {[
            { id: 'custom', label: 'Uji Kustom' },
            { id: 'live', label: 'Waktu Nyata' },
            { id: 'cycle', label: 'Siklus 0–9' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setTimeMode(m.id as TimeMode)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                timeMode === m.id
                  ? 'bg-sky-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {timeMode === 'custom' && (
            <input
              type="time"
              value={customTime}
              min="00:00"
              max="23:59"
              step={60}
              onChange={(e) => setCustomTime(e.target.value)}
              placeholder="10:48"
              aria-label="Masukkan waktu uji kustom"
              className="w-20 px-2.5 py-1 text-xs font-mono-tabular text-center bg-black text-white border border-white/[0.12] rounded focus:outline-none focus:border-sky-400"
            />
          )}

          <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={blinkColon}
              onChange={(e) => setBlinkColon(e.target.checked)}
              className="accent-sky-400 rounded cursor-pointer"
            />
            Kedip (:)
          </label>
        </div>
      </div>
    </div>
  );
};
