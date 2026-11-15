import React, { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { UiAssetId, UiRenderOptions } from '../types/uiAsset';
import { getUiAssetMeta } from '../engine/uiAssetStyles';

interface UiTuningControlsProps {
  selectedAssetId: UiAssetId;
  options: UiRenderOptions;
  onChange: (next: UiRenderOptions) => void;
  onReset: () => void;
}

export const UiTuningControls: React.FC<UiTuningControlsProps> = ({
  selectedAssetId,
  options,
  onChange,
  onReset,
}) => {
  const nativeSize = getUiAssetMeta(selectedAssetId);
  const selectedSize = options.assetSizes?.[selectedAssetId] ?? {};
  const [pendingWidth, setPendingWidth] = useState(String(selectedSize.width ?? nativeSize.width));
  const [pendingHeight, setPendingHeight] = useState(String(selectedSize.height ?? nativeSize.height));
  const [sizeError, setSizeError] = useState('');

  useEffect(() => {
    setPendingWidth(String(selectedSize.width ?? nativeSize.width));
    setPendingHeight(String(selectedSize.height ?? nativeSize.height));
    setSizeError('');
  }, [selectedAssetId, selectedSize.width, selectedSize.height, nativeSize.width, nativeSize.height]);

  const applyCustomSize = () => {
    const width = pendingWidth.trim() === '' ? nativeSize.width : Number(pendingWidth);
    const height = pendingHeight.trim() === '' ? nativeSize.height : Number(pendingHeight);
    if (!Number.isFinite(width) || !Number.isFinite(height) ||
        !Number.isInteger(width) || !Number.isInteger(height) ||
        width < 8 || width > 256 || height < 8 || height > 256) {
      setSizeError('Masukkan ukuran bilangan bulat antara 8–256 px.');
      return;
    }
    onChange({
      ...options,
      assetSizes: {
        ...options.assetSizes,
        [selectedAssetId]: {
          width: pendingWidth.trim() === '' ? undefined : width,
          height: pendingHeight.trim() === '' ? undefined : height,
        },
      },
    });
    setSizeError('');
  };
  return (
    <div className="bg-[#0C0E13] border-b border-white/[0.08] px-5 py-3.5 flex flex-wrap items-center gap-x-6 gap-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 whitespace-nowrap">Ukuran kustom:</span>
        <label className="text-[11px] text-slate-500" htmlFor="ui-width">W</label>
        <input id="ui-width" type="number" min={8} max={256} placeholder="px" value={pendingWidth} onChange={(e) => setPendingWidth(e.target.value)} className="w-16 px-2 py-1 text-xs font-mono-tabular text-white bg-black border border-white/10 rounded" />
        <span className="text-[11px] text-slate-500">×</span>
        <label className="text-[11px] text-slate-500" htmlFor="ui-height">H</label>
        <input id="ui-height" type="number" min={8} max={256} placeholder="Auto" value={pendingHeight} onChange={(e) => setPendingHeight(e.target.value)} className="w-16 px-2 py-1 text-xs font-mono-tabular text-white bg-black border border-white/10 rounded" />
        <span className="text-[10px] text-slate-500">Ukuran ikon terpilih · 8–256 px</span>
        <button type="button" onClick={applyCustomSize} className="px-2.5 py-1 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded transition-colors cursor-pointer">OK</button>
        {sizeError && <span role="alert" className="w-full text-[10px] text-rose-400">{sizeError}</span>}
      </div>

      {/* Render Precision Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 whitespace-nowrap">Mode Render:</span>
        <div className="flex items-center p-0.5 rounded-md bg-black border border-white/[0.08]">
          <button
            type="button"
            onClick={() => onChange({ ...options, pixelSnap: false })}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
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
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              options.pixelSnap
                ? 'bg-sky-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            1-Bit Tajam
          </button>
        </div>
      </div>

      {/* Stroke Weight Slider */}
      <div className="flex items-center gap-2.5 min-w-[165px]">
        <label
          htmlFor="ui-stroke-slider"
          className="text-xs text-slate-400 whitespace-nowrap"
        >
          Tebal Garis
        </label>
        <input
          id="ui-stroke-slider"
          type="range"
          min={0.75}
          max={1.3}
          step={0.05}
          value={options.strokeScale}
          onChange={(e) =>
            onChange({ ...options, strokeScale: parseFloat(e.target.value) })
          }
          className="w-20 accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
        />
        <span className="text-xs font-mono-tabular text-slate-200 w-9 text-right">
          {options.strokeScale.toFixed(2)}×
        </span>
      </div>

      {/* Battery State Slider */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="ui-battery-slider"
          className="text-xs text-slate-400 whitespace-nowrap"
        >
          Baterai
        </label>
        <input
          id="ui-battery-slider"
          type="range"
          min={0}
          max={100}
          step={10}
          value={options.batteryLevel}
          onChange={(e) =>
            onChange({ ...options, batteryLevel: parseInt(e.target.value, 10) })
          }
          className="w-16 accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
        />
        <span className="text-xs font-mono-tabular text-slate-200 w-8 text-right">
          {options.batteryLevel}%
        </span>
      </div>

      {/* Signal Bars Selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 whitespace-nowrap">Sinyal:</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => onChange({ ...options, signalBars: lvl })}
              className={`w-6 h-6 text-xs font-mono-tabular rounded border transition-colors cursor-pointer ${
                options.signalBars === lvl
                  ? 'bg-sky-500 text-slate-950 border-sky-400 font-semibold'
                  : 'bg-black text-slate-400 border-white/[0.08] hover:text-white'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Ring Slider */}
      <div className="flex items-center gap-2">
        <label
          htmlFor="ui-progress-slider"
          className="text-xs text-slate-400 whitespace-nowrap"
        >
          Progres
        </label>
        <input
          id="ui-progress-slider"
          type="range"
          min={0}
          max={100}
          step={5}
          value={options.progressPercent}
          onChange={(e) =>
            onChange({
              ...options,
              progressPercent: parseInt(e.target.value, 10),
            })
          }
          className="w-16 accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
        />
        <span className="text-xs font-mono-tabular text-slate-200 w-8 text-right">
          {options.progressPercent}%
        </span>
      </div>

      {/* Horizontal Progress Bar Slider */}
      {selectedAssetId === 'progress-bar' && (
        <div className="flex items-center gap-2 min-w-[180px]">
          <label htmlFor="ui-progress-bar-slider" className="text-xs text-slate-400 whitespace-nowrap">
            Bar Horizontal
          </label>
          <input
            id="ui-progress-bar-slider"
            type="range"
            min={0}
            max={100}
            step={1}
            value={options.progressBarPercent}
            onChange={(e) => onChange({ ...options, progressBarPercent: parseInt(e.target.value, 10) })}
            className="w-24 accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono-tabular text-slate-200 w-9 text-right">
            {options.progressBarPercent}%
          </span>
        </div>
      )}

      {options.pixelSnap && (
        <div className="flex items-center gap-2 min-w-[155px]">
          <label
            htmlFor="ui-threshold-slider"
            className="text-xs text-slate-400 whitespace-nowrap"
          >
            Ambang
          </label>
          <input
            id="ui-threshold-slider"
            type="range"
            min={64}
            max={200}
            step={4}
            value={options.threshold}
            onChange={(e) =>
              onChange({ ...options, threshold: parseInt(e.target.value, 10) })
            }
            className="w-16 accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono-tabular text-slate-200 w-7 text-right">
            {options.threshold}
          </span>
        </div>
      )}

      <button
        type="button"
        onClick={onReset}
        className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-md transition-colors whitespace-nowrap cursor-pointer"
      >
        <RotateCcw className="w-3 h-3" />
        Reset UI
      </button>
    </div>
  );
};
