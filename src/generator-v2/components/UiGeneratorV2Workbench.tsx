import React, { useState } from 'react';
import JSZip from 'jszip';
import { Activity, Download, Package, Shapes } from 'lucide-react';
import { IconGeneratorWorkbench } from './IconGeneratorWorkbench';
import { ProgressGeneratorWorkbench } from './ProgressGeneratorWorkbench';
import { ICON_ASSET_CATALOG, createDefaultIconRenderOptions } from '../model/icons';
import { PROGRESS_ASSET_CATALOG, createDefaultProgressConfig } from '../model/progress';
import { UI_STYLES } from '../model/styles';
import { renderIconAsset } from '../renderers/iconRenderer';
import { renderProgressAsset } from '../renderers/progressRenderer';
import { createSpriteSheetCanvas } from '../export/spriteSheet';

type Workspace = 'progress' | 'icons';

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('PNG encoding failed.')), 'image/png');
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
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
      zip.file('spritesheets/progress.png', await canvasToBlob(createSpriteSheetCanvas(progressItems, 3, 2)));
      zip.file('spritesheets/icons.png', await canvasToBlob(createSpriteSheetCanvas(iconItems, 4, 2)));
      zip.file('manifest.json', JSON.stringify({
        generator: 'Clock Icon UI Generator V2',
        format: 'PNG',
        defaultIconStyle: iconStyle,
        families: {
          progress: progressItems.map(({ id, canvas }) => ({ id, filename: 'progress/' + id + '.png', width: canvas.width, height: canvas.height })),
          icons: iconItems.map(({ id, canvas }) => ({ id, filename: 'icons/' + id + '.png', width: canvas.width, height: canvas.height })),
        },
        spriteSheets: ['spritesheets/progress.png', 'spritesheets/icons.png'],
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
            <button type="button" disabled={exportingLibrary} onClick={exportFullLibrary} className="inline-flex items-center gap-2 rounded-md bg-sky-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-300 disabled:opacity-50"><Package className="w-4 h-4" /> {exportingLibrary ? 'Mengemas…' : 'Ekspor Semua UI'}</button>
          </div>
        </div>
      </header>
      {workspace === 'progress' ? <ProgressGeneratorWorkbench /> : <IconGeneratorWorkbench />}
    </div>
  );
};
