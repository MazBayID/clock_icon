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

  const updateWidth = (value: string) => {
    setPendingWidth(value);
    const width = Number(value);
    if (value.trim() !== '' && Number.isFinite(width) && width > 0) {
      setPendingHeight(String(Math.round(width * nativeSize.height / nativeSize.width)));
    }
    setSizeError('');
  };

  const updateHeight = (value: string) => {
    setPendingHeight(value);
    const height = Number(value);
    if (value.trim() !== '' && Number.isFinite(height) && height > 0) {
      setPendingWidth(String(Math.round(height * nativeSize.width / nativeSize.height)));
    }
    setSizeError('');
  };

  const resetCustomSize = () => {
    const nextSizes = { ...options.assetSizes };
    delete nextSizes[selectedAssetId];
    onChange({ ...options, assetSizes: nextSizes });
    setPendingWidth(String(nativeSize.width));
    setPendingHeight(String(nativeSize.height));
    setSizeError('');
  };

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
      {options.pixelSnap && (
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-400 whitespace-nowrap">Ukuran kustom:</span>
        <label className="text-[11px] text-slate-500" htmlFor="ui-width">W</label>
        <input id="ui-width" type="number" min={8} max={256} placeholder="px" value={pendingWidth} onChange={(e) => updateWidth(e.target.value)} className="w-16 px-2 py-1 text-xs font-mono-tabular text-white bg-black border border-white/10 rounded" />
        <span className="text-[11px] text-slate-500">×</span>
        <label className="text-[11px] text-slate-500" htmlFor="ui-height">H</label>
        <input id="ui-height" type="number" min={8} max={256} placeholder="Auto" value={pendingHeight} onChange={(e) => updateHeight(e.target.value)} className="w-16 px-2 py-1 text-xs font-mono-tabular text-white bg-black border border-white/10 rounded" />
        <span className="text-[10px] text-slate-500">Rasio {nativeSize.width}:{nativeSize.height} · sisi lain otomatis · 8–256 px</span>
        <button type="button" onClick={applyCustomSize} className="px-2.5 py-1 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded transition-colors cursor-pointer">OK</button>
        <button type="button" onClick={resetCustomSize} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] border border-white/[0.08] rounded transition-colors cursor-pointer">
          <RotateCcw className="w-3 h-3" /> Reset Pixel
        </button>
        {sizeError && <span role="alert" className="w-full text-[10px] text-rose-400">{sizeError}</span>}
      </div>
      )}

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

      {/* Contextual Preview Slider: follows the selected asset */}
      <div className="w-full flex flex-wrap items-center gap-3 rounded-md border border-sky-400/20 bg-sky-400/[0.04] px-3 py-2.5">
        <span className="text-xs font-semibold text-sky-300 whitespace-nowrap">Preview {selectedAssetId === 'battery' ? 'Baterai' : selectedAssetId === 'signal' ? 'Sinyal' : selectedAssetId === 'wifi-meter' ? 'Wi-Fi' : selectedAssetId === 'progress-arc' ? 'Progress Arc' : selectedAssetId === 'progress-bar' ? 'Progress Bar' : 'Ikon Terpilih'}</span>
        {selectedAssetId === 'battery' && (
          <>
            <input aria-label="Level baterai preview" type="range" min={0} max={100} step={1} value={options.batteryLevel} onChange={(e) => onChange({ ...options, batteryLevel: parseInt(e.target.value, 10) })} className="flex-1 min-w-[120px] accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer" />
            <span className="text-xs font-mono-tabular text-white w-10 text-right">{options.batteryLevel}%</span>
          </>
        )}
        {(selectedAssetId === 'signal' || selectedAssetId === 'wifi-meter') && (
          <>
            <input aria-label="Kekuatan sinyal preview" type="range" min={0} max={4} step={1} value={options.signalBars} onChange={(e) => onChange({ ...options, signalBars: parseInt(e.target.value, 10) })} className="flex-1 min-w-[120px] accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer" />
            <span className="text-xs font-mono-tabular text-white w-10 text-right">{options.signalBars}/4</span>
          </>
        )}
        {selectedAssetId === 'progress-arc' && (
          <>
            <input aria-label="Progress Arc preview" type="range" min={0} max={100} step={1} value={options.progressPercent} onChange={(e) => onChange({ ...options, progressPercent: parseInt(e.target.value, 10) })} className="flex-1 min-w-[120px] accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer" />
            <span className="text-xs font-mono-tabular text-white w-10 text-right">{options.progressPercent}%</span>
          </>
        )}
        {selectedAssetId === 'progress-bar' && (
          <>
            <input aria-label="Progress Bar preview" type="range" min={0} max={100} step={1} value={options.progressBarPercent} onChange={(e) => onChange({ ...options, progressBarPercent: parseInt(e.target.value, 10) })} className="flex-1 min-w-[120px] accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer" />
            <span className="text-xs font-mono-tabular text-white w-10 text-right">{options.progressBarPercent}%</span>
          </>
        )}
        {options.pixelSnap &&
          selectedAssetId !== 'battery' &&
          selectedAssetId !== 'signal' &&
          selectedAssetId !== 'wifi-meter' &&
          selectedAssetId !== 'progress-arc' &&
          selectedAssetId !== 'progress-bar' && (
            <>
              <span className="text-xs text-slate-400 whitespace-nowrap">Ketebalan ikon</span>
              <input aria-label="Ketebalan ikon preview" type="range" min={0.75} max={1.3} step={0.05} value={options.strokeScale} onChange={(e) => onChange({ ...options, strokeScale: parseFloat(e.target.value) })} className="flex-1 min-w-[120px] accent-sky-400 h-1.5 bg-white/10 rounded-lg cursor-pointer" />
              <span className="text-xs font-mono-tabular text-white w-10 text-right">{options.strokeScale.toFixed(2)}×</span>
            </>
          )}
      </div>

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
