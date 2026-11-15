import { useMemo, useState } from 'react';
import { Download, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { downloadIndicatorPng, renderIndicator } from '../generator/renderer';
import {
  DEFAULT_GENERATOR_CONFIG,
  GENERATOR_TYPE_LABELS,
  GENERATOR_TYPES,
  type GeneratorConfig,
  type GeneratorStyle,
  type GeneratorType,
} from '../generator/types';

const STYLE_LABELS: Record<GeneratorStyle, string> = {
  minimal: 'Minimal',
  rounded: 'Rounded',
  tactical: 'Tactical',
  cyber: 'Cyber',
};

function RangeControl({
  label, value, min, max, step = 1, suffix = '', onChange,
}: {
  label: string; value: number; min: number; max: number; step?: number;
  suffix?: string; onChange: (value: number) => void;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center justify-between text-xs text-slate-300">
        <span>{label}</span><span className="font-mono text-slate-400">{value}{suffix}</span>
      </span>
      <input className="w-full accent-sky-400" type="range" min={min} max={max} step={step}
        value={value} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

export function UiGeneratorStudio() {
  const [config, setConfig] = useState<GeneratorConfig>(DEFAULT_GENERATOR_CONFIG);
  const update = <K extends keyof GeneratorConfig>(key: K, value: GeneratorConfig[K]) =>
    setConfig((current) => ({ ...current, [key]: value }));
  const canvas = useMemo(() => renderIndicator(config), [config]);
  const previewScale = Math.max(2, Math.min(8, Math.floor(440 / config.width), Math.floor(260 / config.height)));

  return (
    <main className="min-w-0 flex-1 bg-[#090A0D] text-white">
      <header className="border-b border-white/[0.08] bg-[#0B0D12] px-5 py-5 sm:px-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-1 text-xs font-medium uppercase tracking-[0.18em] text-sky-400">UI Generator · Rebuild v2</div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Indicator Workbench</h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-400">Bangun indikator status dan progres dari satu mesin generatif dengan kontrol bentuk, ukuran, dan nilai.</p>
          </div>
          <button type="button" onClick={() => downloadIndicatorPng(config)}
            className="inline-flex items-center gap-2 rounded-md bg-sky-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-300">
            <Download className="h-4 w-4" /> Export PNG
          </button>
        </div>
      </header>

      <div className="grid gap-5 p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="min-w-0 space-y-5">
          <div className="rounded-xl border border-white/10 bg-[#10141C] p-4 sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold">Live preview</h2>
                <p className="mt-1 text-xs text-slate-500">{config.width} × {config.height} px · {config.value}%</p>
              </div>
              <span className="rounded border border-white/10 px-2 py-1 text-[10px] uppercase tracking-wider text-slate-400">{STYLE_LABELS[config.style]}</span>
            </div>
            <div className="flex min-h-[260px] items-center justify-center overflow-auto rounded-lg border border-white/10 bg-[radial-gradient(circle_at_center,#17202c_1px,transparent_1px)] [background-size:16px_16px] p-6">
              <canvas
                width={canvas.width}
                height={canvas.height}
                ref={(node) => {
                  if (!node) return;
                  const context = node.getContext('2d');
                  if (context) {
                    context.imageSmoothingEnabled = false;
                    context.clearRect(0, 0, node.width, node.height);
                    context.drawImage(canvas, 0, 0);
                  }
                }}
                style={{ width: config.width * previewScale, height: config.height * previewScale, imageRendering: 'pixelated' }}
                aria-label={`Preview ${GENERATOR_TYPE_LABELS[config.type]}`}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-500">
              <span className="rounded bg-black/40 px-2 py-1">Native: {config.width}×{config.height}</span>
              <span className="rounded bg-black/40 px-2 py-1">Scale: {previewScale}×</span>
              <span className="rounded bg-black/40 px-2 py-1">Monochrome</span>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#10141C] p-4 sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-sky-400" />
              <h2 className="text-sm font-semibold">Generator type</h2>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {GENERATOR_TYPES.map((type) => (
                <button key={type} type="button" onClick={() => update('type', type)}
                  className={`rounded-lg border px-3 py-3 text-left text-xs transition-colors ${config.type === type ? 'border-sky-400/60 bg-sky-400/10 text-sky-200' : 'border-white/10 bg-black/20 text-slate-300 hover:border-white/25'}`}>
                  <span className="block font-semibold">{GENERATOR_TYPE_LABELS[type]}</span>
                  <span className="mt-1 block text-[10px] text-slate-500">{type === 'battery' ? 'Shell + fill level' : type === 'signal' ? 'Stepped reception bars' : type === 'ring-progress' ? 'Circular gauge' : type === 'volume' ? 'Rising level bars' : type === 'segmented-progress' ? 'Discrete progress cells' : 'Continuous fill track'}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="h-fit space-y-4 rounded-xl border border-white/10 bg-[#10141C] p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Properties</h2>
            <button type="button" onClick={() => setConfig(DEFAULT_GENERATOR_CONFIG)} className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white"><RotateCcw className="h-3 w-3" /> Reset</button>
          </div>

          <label className="block space-y-1.5 text-xs text-slate-300">Visual style
            <select value={config.style} onChange={(e) => update('style', e.target.value as GeneratorStyle)} className="w-full rounded-md border border-white/10 bg-[#080B10] px-3 py-2 text-white">
              {Object.entries(STYLE_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1 text-xs text-slate-300">Width
              <input type="number" min="8" max="512" value={config.width} onChange={(e) => update('width', Math.max(8, Math.min(512, Number(e.target.value) || 8)))} className="w-full rounded-md border border-white/10 bg-[#080B10] px-2 py-2 text-white" />
            </label>
            <label className="space-y-1 text-xs text-slate-300">Height
              <input type="number" min="8" max="512" value={config.height} onChange={(e) => update('height', Math.max(8, Math.min(512, Number(e.target.value) || 8)))} className="w-full rounded-md border border-white/10 bg-[#080B10] px-2 py-2 text-white" />
            </label>
          </div>

          <RangeControl label="Value" value={config.value} min={0} max={100} suffix="%" onChange={(v) => update('value', v)} />
          <RangeControl label="Thickness" value={config.thickness} min={1} max={Math.max(1, Math.min(config.width, config.height))} suffix=" px" onChange={(v) => update('thickness', v)} />
          <RangeControl label="Segments / bars" value={config.segments} min={2} max={16} onChange={(v) => update('segments', v)} />
          <RangeControl label="Gap" value={config.gap} min={0} max={12} suffix=" px" onChange={(v) => update('gap', v)} />
          <RangeControl label="Corner radius" value={config.cornerRadius} min={0} max={12} suffix=" px" onChange={(v) => update('cornerRadius', v)} />

          <label className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-300">
            Show track
            <input type="checkbox" checked={config.showTrack} onChange={(e) => update('showTrack', e.target.checked)} className="accent-sky-400" />
          </label>
          <label className="flex items-center justify-between text-xs text-slate-300">
            1-bit pixel snap
            <input type="checkbox" checked={config.pixelSnap} onChange={(e) => update('pixelSnap', e.target.checked)} className="accent-sky-400" />
          </label>
          {config.pixelSnap && <RangeControl label="Threshold" value={config.threshold} min={32} max={240} onChange={(v) => update('threshold', v)} />}

          <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-3">
            {(['foreground', 'track', 'background'] as const).map((key) => (
              <label key={key} className="space-y-1 text-[10px] capitalize text-slate-400">{key}
                <input type="color" value={config[key]} onChange={(e) => update(key, e.target.value)} className="h-8 w-full cursor-pointer rounded bg-transparent" />
              </label>
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
