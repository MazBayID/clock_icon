import React from 'react';
import { RotateCcw } from 'lucide-react';
import { ColonStyleMode, GlyphRenderOptions } from '../types/glyph';

interface TuningControlsProps {
  options: GlyphRenderOptions;
  onChange: (next: GlyphRenderOptions) => void;
  onReset: () => void;
}

const COLON_MODES: { id: ColonStyleMode; label: string }[] = [
  { id: 'match', label: 'Ikuti Gaya' },
  { id: 'round', label: 'Bulat' },
  { id: 'diamond', label: 'Berlian' },
  { id: 'slit', label: 'Bilah Cyber' },
];

export const TuningControls: React.FC<TuningControlsProps> = ({
  options,
  onChange,
  onReset,
}) => {
  return (
    <section className="border-b border-white/[0.08] bg-[#0E1016] px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div>
          <h3 className="text-xs font-semibold text-slate-200">
            Kalibrasi Geometri & Rasterisasi 25×50px
          </h3>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Parameter
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* Render Mode Segmented Control */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[11px] font-medium text-slate-400">
            Mode Piksel Output
          </span>
          <div className="grid grid-cols-2 p-0.5 rounded-md bg-black border border-white/[0.08]">
            <button
              type="button"
              onClick={() => onChange({ ...options, pixelSnap: false })}
              className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                !options.pixelSnap
                  ? 'bg-sky-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              OLED Halus
            </button>
            <button
              type="button"
              onClick={() => onChange({ ...options, pixelSnap: true })}
              className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                options.pixelSnap
                  ? 'bg-sky-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              1-Bit Tajam
            </button>
          </div>
        </div>

        {/* Stroke Weight */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <label htmlFor="stroke-scale" className="font-medium text-slate-400">
              Ketebalan Batang
            </label>
            <span className="font-mono-tabular text-slate-200">
              {options.strokeScale.toFixed(2)}×
            </span>
          </div>
          <input
            id="stroke-scale"
            type="range"
            min={0.75}
            max={1.25}
            step={0.05}
            value={options.strokeScale}
            onChange={(e) =>
              onChange({ ...options, strokeScale: parseFloat(e.target.value) })
            }
            className="w-full accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer mt-1.5"
          />
        </div>

        {/* Horizontal & Vertical Safe Padding */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <label htmlFor="pad-x" className="font-medium text-slate-400">
              Margin Aman (X / Y)
            </label>
            <span className="font-mono-tabular text-slate-200">
              {options.paddingX}px / {options.paddingY}px
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <input
              id="pad-x"
              type="range"
              min={0}
              max={3}
              step={1}
              value={options.paddingX}
              onChange={(e) =>
                onChange({ ...options, paddingX: parseInt(e.target.value, 10) })
              }
              className="w-full accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              aria-label="Margin horizontal piksel"
            />
            <input
              id="pad-y"
              type="range"
              min={0}
              max={4}
              step={1}
              value={options.paddingY}
              onChange={(e) =>
                onChange({ ...options, paddingY: parseInt(e.target.value, 10) })
              }
              className="w-full accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
              aria-label="Margin vertikal piksel"
            />
          </div>
        </div>

        {/* Colon Style */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="colon-style" className="text-[11px] font-medium text-slate-400">
            Bentuk Titik Dua (:)
          </label>
          <select
            id="colon-style"
            value={options.colonStyle}
            onChange={(e) =>
              onChange({ ...options, colonStyle: e.target.value as ColonStyleMode })
            }
            className="w-full px-3 py-1.5 text-xs bg-black text-slate-200 border border-white/[0.1] rounded-md focus:outline-none focus:border-sky-400 cursor-pointer"
          >
            {COLON_MODES.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Threshold (when 1-bit active) or Spec Summary */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <label
              htmlFor="binary-threshold"
              className={`font-medium ${options.pixelSnap ? 'text-slate-400' : 'text-slate-600'}`}
            >
              Ambang Biner (1-Bit)
            </label>
            <span className="font-mono-tabular text-slate-200">
              {options.pixelSnap ? `${options.threshold}` : 'Auto AA'}
            </span>
          </div>
          <input
            id="binary-threshold"
            type="range"
            min={64}
            max={200}
            step={4}
            disabled={!options.pixelSnap}
            value={options.threshold}
            onChange={(e) =>
              onChange({ ...options, threshold: parseInt(e.target.value, 10) })
            }
            className="w-full accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer mt-1.5 disabled:opacity-35 disabled:cursor-not-allowed"
          />
        </div>
      </div>
    </section>
  );
};
