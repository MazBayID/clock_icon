import React, { useState } from 'react';
import { downloadBlob } from '../export/download';
import JSZip from 'jszip';
import { Activity, Package, Shapes } from 'lucide-react';
import { IconGeneratorWorkbench } from './IconGeneratorWorkbench';
import { ProgressGeneratorWorkbench } from './ProgressGeneratorWorkbench';
import { ICON_ASSET_CATALOG, createDefaultIconRenderOptions } from '../model/icons';
import { PROGRESS_ASSET_CATALOG, createDefaultProgressConfig } from '../model/progress';
import { UI_STYLES } from '../model/styles';
import { renderIconAsset } from '../renderers/iconRenderer';
import { renderProgressAsset } from '../renderers/progressRenderer';
import { createSpriteSheetCanvas, createSpriteSheetManifest } from '../export/spriteSheet';

type Workspace = 'progress' | 'icons';

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNG encoding failed.')), 'image/png');
  });
}




export const UiGeneratorV2Workbench: React.FC = () => {
  const [workspace, setWorkspace] = useState<Workspace>('progress');
  const [exportingLibrary, setExportingLibrary] = useState(false);

  const exportFullLibrary = async () => {
    setExportingLibrary(true);
    try {
      const zip = new JSZip();
      const progressItems = PROGRESS_ASSET_CATALOG.map((asset) => ({ id: asset.id, canvas: renderProgressAsset(createDefaultProgressConfig(asset.id)) }));
      const iconStyle = UI_STYLES[0].id;
      const iconItems = ICON_ASSET_CATALOG.map((asset) => ({ id: asset.id, canvas: renderIconAsset(asset.id, iconStyle, createDefaultIconRenderOptions(asset.id)) }));
      for (const item of progressItems) zip.file('progress/' + item.id + '.png', await canvasToBlob(item.canvas));
      for (const item of iconItems) zip.file('icons/' + item.id + '.png', await canvasToBlob(item.canvas));
      const progressColumns = 3;
      const iconColumns = 4;
      const progressGap = 2;
      const iconGap = 2;
      const progressSheet = createSpriteSheetCanvas(progressItems, progressColumns, progressGap);
      const iconSheet = createSpriteSheetCanvas(iconItems, iconColumns, iconGap);
      zip.file('spritesheets/progress.png', await canvasToBlob(progressSheet));
      zip.file('spritesheets/icons.png', await canvasToBlob(iconSheet));
      zip.file('spritesheets/progress.json', JSON.stringify({
        family: 'progress',
        ...createSpriteSheetManifest(progressItems, progressColumns, progressGap),
      }, null, 2));
      zip.file('spritesheets/icons.json', JSON.stringify({
        family: 'icons',
        style: iconStyle,
        ...createSpriteSheetManifest(iconItems, iconColumns, iconGap),
      }, null, 2));
      zip.file('manifest.json', JSON.stringify({
        generator: 'Clock Icon UI Generator V2',
        exportType: 'default-library',
        format: 'PNG',
        background: '#000000',
        defaultIconStyle: iconStyle,
        families: {
          progress: progressItems.map(({ id, canvas }) => {
            const assetConfig = createDefaultProgressConfig(id as (typeof PROGRESS_ASSET_CATALOG)[number]['id']);
            return {
              id,
              filename: 'progress/' + id + '.png',
              width: canvas.width,
              height: canvas.height,
              config: assetConfig,
            };
          }),
          icons: iconItems.map(({ id, canvas }) => {
            const assetOptions = createDefaultIconRenderOptions(id as (typeof ICON_ASSET_CATALOG)[number]['id']);
            return {
              id,
              filename: 'icons/' + id + '.png',
              width: canvas.width,
              height: canvas.height,
              renderOptions: assetOptions,
            };
          }),
        },
        spriteSheets: [
          { filename: 'spritesheets/progress.png', metadata: 'spritesheets/progress.json' },
          { filename: 'spritesheets/icons.png', metadata: 'spritesheets/icons.json' },
        ],
      }, null, 2));
      downloadBlob(await zip.generateAsync({ type: 'blob' }), 'clock-icon-ui-full-library.zip');
    } finally {
      setExportingLibrary(false);
    }
  };
  return (
    <div id="top" className="flex-1 min-w-0 bg-[#090A0D] text-[#F2F4F8]">
      <header className="px-5 sm:px-7 py-6 border-b border-white/[0.08] bg-[#0B0D12]">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div><div className="text-xs font-semibold tracking-[0.18em] uppercase text-sky-400 mb-2">Generator V2 · Modular UI Studio</div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">UI Asset Generator</h1><p className="text-sm text-slate-400 mt-2 max-w-2xl">Bangun indikator status, progress widget, dan ikon antarmuka dengan renderer khusus dan kontrol visual yang terpisah.</p></div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-black p-1">
              <button type="button" onClick={() => setWorkspace('progress')} aria-pressed={workspace === 'progress'} className={`inline-flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold ${workspace === 'progress' ? 'bg-sky-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}><Activity className="w-4 h-4" /> Progress & Status</button>
              <button type="button" onClick={() => setWorkspace('icons')} aria-pressed={workspace === 'icons'} className={`inline-flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold ${workspace === 'icons' ? 'bg-sky-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}><Shapes className="w-4 h-4" /> Icon Library</button>
            </div>
            <button type="button" disabled={exportingLibrary} onClick={exportFullLibrary} className="inline-flex items-center gap-2 rounded-md bg-sky-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-300 disabled:opacity-50"><Package className="w-4 h-4" /> {exportingLibrary ? 'Mengemas…' : 'Ekspor Semua UI (Default)'}</button>
          </div>
        </div>
      </header>
      {workspace === 'progress' ? <ProgressGeneratorWorkbench /> : <IconGeneratorWorkbench />}
    </div>
  );
};
