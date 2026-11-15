import React, { useState } from 'react';
import { Activity, Shapes } from 'lucide-react';
import { IconGeneratorWorkbench } from './IconGeneratorWorkbench';
import { ProgressGeneratorWorkbench } from './ProgressGeneratorWorkbench';

type Workspace = 'progress' | 'icons';

export const UiGeneratorV2Workbench: React.FC = () => {
  const [workspace, setWorkspace] = useState<Workspace>('progress');
  return (
    <div id="top" className="flex-1 min-w-0 bg-[#090A0D] text-[#F2F4F8]">
      <header className="px-5 sm:px-7 py-6 border-b border-white/[0.08] bg-[#0B0D12]">
        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
          <div><div className="text-xs font-semibold tracking-[0.18em] uppercase text-sky-400 mb-2">Generator V2 · Modular UI Studio</div><h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">UI Asset Generator</h1><p className="text-sm text-slate-400 mt-2 max-w-2xl">Bangun indikator status, progress widget, dan ikon antarmuka dengan renderer khusus dan kontrol visual yang terpisah.</p></div>
          <div className="inline-flex items-center gap-1 rounded-md border border-white/[0.08] bg-black p-1">
            <button type="button" onClick={() => setWorkspace('progress')} aria-pressed={workspace === 'progress'} className={`inline-flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold ${workspace === 'progress' ? 'bg-sky-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}><Activity className="w-4 h-4" /> Progress & Status</button>
            <button type="button" onClick={() => setWorkspace('icons')} aria-pressed={workspace === 'icons'} className={`inline-flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold ${workspace === 'icons' ? 'bg-sky-400 text-slate-950' : 'text-slate-400 hover:text-white'}`}><Shapes className="w-4 h-4" /> Icon Library</button>
          </div>
        </div>
      </header>
      {workspace === 'progress' ? <ProgressGeneratorWorkbench /> : <IconGeneratorWorkbench />}
    </div>
  );
};
