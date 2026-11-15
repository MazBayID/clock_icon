import React, { useState } from 'react';
import {
  CustomUiPixelMap,
  UiRenderOptions,
  UiStyleId,
} from '../types/uiAsset';
import { UiAssetCanvas } from './UiAssetCanvas';

interface UiWatchPreviewProps {
  styleId: UiStyleId;
  options: UiRenderOptions;
  customMap: CustomUiPixelMap;
}

type CaseShape = 'round' | 'square' | 'raw';

export const UiWatchPreview: React.FC<UiWatchPreviewProps> = ({
  styleId,
  options,
  customMap,
}) => {
  const [caseShape, setCaseShape] = useState<CaseShape>('round');
  const [nightMode, setNightMode] = useState(false);

  const weatherAsset = nightMode ? 'weather-moon' : 'weather-sun';

  return (
    <div className="bg-[#0C0E13] border border-white/[0.08] rounded-lg p-5 flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <h3 className="text-sm font-semibold text-white">
            Simulasi HUD UI Smartwatch
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Komposisi ikon dan widget UI pada layar OLED. Nilai telemetri adalah data simulasi.
          </p>
        </div>

        <div className="flex items-center gap-1 p-0.5 rounded-md bg-black border border-white/[0.08]">
          {[
            { id: 'round', label: 'Bulat 46mm' },
            { id: 'square', label: 'Kotak Ultra' },
            { id: 'raw', label: 'Baris 1:1' },
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

      {/* Watch Viewport */}
      <div className="py-8 flex items-center justify-center bg-[#07080A] border border-white/[0.06] rounded-md my-4 min-h-[300px]">
        {caseShape === 'round' && (
          <div className="relative w-[264px] h-[264px] rounded-full bg-gradient-to-b from-[#2A2F3A] via-[#171A22] to-[#0E1015] p-[10px] shadow-2xl border border-white/15 flex items-center justify-center">
            <div
              className="absolute -right-2.5 top-1/2 -translate-y-1/2 w-2.5 h-9 rounded-r bg-gradient-to-b from-[#404756] to-[#1D212A] border-y border-r border-white/20"
              aria-hidden="true"
            />
            <div className="w-full h-full rounded-full bg-black border border-white/10 flex flex-col items-center justify-between py-5 px-5 relative overflow-hidden">
              {/* Top status strip */}
              <div className="flex items-center gap-2.5">
                <UiAssetCanvas
                  assetId="bluetooth"
                  styleId={styleId}
                  options={options}
                  customPixels={customMap[styleId]?.['bluetooth'] ?? null}
                  scale={0.62}
                />
                <UiAssetCanvas
                  assetId="signal"
                  styleId={styleId}
                  options={options}
                  customPixels={customMap[styleId]?.['signal'] ?? null}
                  scale={0.72}
                />
                <UiAssetCanvas
                  assetId="battery"
                  styleId={styleId}
                  options={options}
                  customPixels={customMap[styleId]?.['battery'] ?? null}
                  scale={0.82}
                />
              </div>

              {/* Center Complication Ring + Telemetry */}
              <div className="flex items-center justify-center gap-4 w-full">
                <div className="flex flex-col items-center gap-1">
                  <UiAssetCanvas
                    assetId="heart-dynamic"
                    styleId={styleId}
                    options={options}
                    customPixels={customMap[styleId]?.['heart-dynamic'] ?? null}
                    scale={0.85}
                  />
                  <span className="text-[11px] font-mono-tabular text-white">72</span>
                </div>

                <div className="relative flex items-center justify-center">
                  <UiAssetCanvas
                    assetId="progress-arc"
                    styleId={styleId}
                    options={options}
                    customPixels={customMap[styleId]?.['progress-arc'] ?? null}
                    scale={1.35}
                  />
                </div>

                <div className="flex flex-col items-center gap-1">
                  <UiAssetCanvas
                    assetId={weatherAsset}
                    styleId={styleId}
                    options={options}
                    customPixels={customMap[styleId]?.[weatherAsset] ?? null}
                    scale={0.85}
                  />
                  <span className="text-[11px] font-mono-tabular text-white">24°</span>
                </div>
              </div>

              {/* Divider + Bottom Icons */}
              <div className="flex flex-col items-center gap-2">
                <UiAssetCanvas
                  assetId="ecg-divider"
                  styleId={styleId}
                  options={options}
                  customPixels={customMap[styleId]?.['ecg-divider'] ?? null}
                  scale={1.4}
                />
                <div className="flex items-center gap-3">
                  <UiAssetCanvas
                    assetId="steps"
                    styleId={styleId}
                    options={options}
                    customPixels={customMap[styleId]?.['steps'] ?? null}
                    scale={0.7}
                  />
                  <UiAssetCanvas
                    assetId="notification"
                    styleId={styleId}
                    options={options}
                    customPixels={customMap[styleId]?.['notification'] ?? null}
                    scale={0.7}
                  />
                  <UiAssetCanvas
                    assetId="alarm"
                    styleId={styleId}
                    options={options}
                    customPixels={customMap[styleId]?.['alarm'] ?? null}
                    scale={0.7}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {caseShape === 'square' && (
          <div className="relative w-[238px] h-[278px] rounded-[42px] bg-gradient-to-b from-[#2E3440] via-[#181B22] to-[#0E1015] p-[11px] shadow-2xl border border-white/15 flex items-center justify-center">
            <div
              className="absolute -right-2.5 top-[72px] w-2.5 h-10 rounded-r bg-gradient-to-b from-[#454D5E] to-[#1E222B] border-y border-r border-white/20"
              aria-hidden="true"
            />
            <div className="w-full h-full rounded-[32px] bg-black border border-white/10 flex flex-col items-center justify-between py-5 px-4">
              {/* Top Corner Status */}
              <div className="w-full flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <UiAssetCanvas
                    assetId="signal"
                    styleId={styleId}
                    options={options}
                    customPixels={customMap[styleId]?.['signal'] ?? null}
                    scale={0.75}
                  />
                  <UiAssetCanvas
                    assetId="wifi-meter"
                    styleId={styleId}
                    options={options}
                    customPixels={customMap[styleId]?.['wifi-meter'] ?? null}
                    scale={0.75}
                  />
                </div>
                <UiAssetCanvas
                  assetId="battery"
                  styleId={styleId}
                  options={options}
                  customPixels={customMap[styleId]?.['battery'] ?? null}
                  scale={0.85}
                />
              </div>

              {/* Center Gauge + Metrics */}
              <div className="flex items-center justify-between w-full px-1">
                <UiAssetCanvas
                  assetId="progress-arc"
                  styleId={styleId}
                  options={options}
                  customPixels={customMap[styleId]?.['progress-arc'] ?? null}
                  scale={1.45}
                />
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono-tabular text-white">72</span>
                    <UiAssetCanvas
                      assetId="heart-dynamic"
                      styleId={styleId}
                      options={options}
                      customPixels={customMap[styleId]?.['heart-dynamic'] ?? null}
                      scale={0.75}
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono-tabular text-white">24°</span>
                    <UiAssetCanvas
                      assetId={weatherAsset}
                      styleId={styleId}
                      options={options}
                      customPixels={customMap[styleId]?.[weatherAsset] ?? null}
                      scale={0.75}
                    />
                  </div>
                </div>
              </div>

              {/* Divider */}
              <UiAssetCanvas
                assetId="ecg-divider"
                styleId={styleId}
                options={options}
                customPixels={customMap[styleId]?.['ecg-divider'] ?? null}
                scale={1.6}
              />

              {/* Bottom Dock */}
              <div className="w-full flex items-center justify-around pt-1">
                <UiAssetCanvas
                  assetId="bluetooth"
                  styleId={styleId}
                  options={options}
                  customPixels={customMap[styleId]?.['bluetooth'] ?? null}
                  scale={0.68}
                />
                <UiAssetCanvas
                  assetId="notification"
                  styleId={styleId}
                  options={options}
                  customPixels={customMap[styleId]?.['notification'] ?? null}
                  scale={0.72}
                />
                <UiAssetCanvas
                  assetId="alarm"
                  styleId={styleId}
                  options={options}
                  customPixels={customMap[styleId]?.['alarm'] ?? null}
                  scale={0.72}
                />
              </div>
            </div>
          </div>
        )}

        {caseShape === 'raw' && (
          <div className="flex flex-col items-center gap-4 px-4">
            <div className="p-4 bg-black border border-dashed border-white/20 flex flex-wrap items-center justify-center gap-3 max-w-full">
              <UiAssetCanvas assetId="battery" styleId={styleId} options={options} scale={1} />
              <UiAssetCanvas assetId="signal" styleId={styleId} options={options} scale={1} />
              <UiAssetCanvas assetId="wifi-meter" styleId={styleId} options={options} scale={1} />
              <UiAssetCanvas assetId="bluetooth" styleId={styleId} options={options} scale={1} />
              <UiAssetCanvas assetId="heart-dynamic" styleId={styleId} options={options} scale={1} />
              <UiAssetCanvas assetId="steps" styleId={styleId} options={options} scale={1} />
              <UiAssetCanvas assetId="notification" styleId={styleId} options={options} scale={1} />
              <UiAssetCanvas assetId="alarm" styleId={styleId} options={options} scale={1} />
              <UiAssetCanvas assetId={weatherAsset} styleId={styleId} options={options} scale={1} />
              <UiAssetCanvas assetId="progress-arc" styleId={styleId} options={options} scale={1} />
              <UiAssetCanvas assetId="ecg-divider" styleId={styleId} options={options} scale={1} />
            </div>
            <span className="text-xs font-mono-tabular text-slate-400">
              Skala Asli 1:1 Native Piksel
            </span>
          </div>
        )}
      </div>

      {/* Weather Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <span className="text-xs text-slate-400">
          Status UI mengikuti kalibrasi Baterai ({options.batteryLevel}%), Sinyal ({options.signalBars}/4), &amp; Progres ({options.progressPercent}%).
        </span>
        <label className="inline-flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={nightMode}
            onChange={(e) => setNightMode(e.target.checked)}
            className="accent-sky-400 rounded cursor-pointer"
          />
          Cuaca Malam
        </label>
      </div>
    </div>
  );
};
