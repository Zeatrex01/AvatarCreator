import React, { useState, useRef } from 'react';
import { Grid, Scissors, Download } from 'lucide-react';
import SpritesheetCreator from '../components/SpritesheetCreator';
import SheetSplitter      from '../components/SheetSplitter';

/**
 * SpriteStudioPage
 * Full-page version of Sprite Studio — no modal wrapper.
 * Props:
 *   library              — from useLibrary hook (passed from root)
 *   getPayloadFromOptions — fn from App
 */
export default function SpriteStudioPage({ library, getPayloadFromOptions }) {
  const [activeTab, setActiveTab]           = useState('creator');
  const [creatorDataUrl, setCreatorDataUrl] = useState(null);
  const [canSplit, setCanSplit]             = useState(false);
  const splitterDownloadRef                 = useRef(null);

  const handleFooterClick = () => {
    if (activeTab === 'creator') {
      if (!creatorDataUrl) return;
      const a = document.createElement('a');
      a.download = `spritesheet_${Date.now()}.png`;
      a.href     = creatorDataUrl;
      a.click();
    } else {
      splitterDownloadRef.current?.();
    }
  };

  const footerDisabled = activeTab === 'creator' ? !creatorDataUrl : !canSplit;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50">

      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md">
              <Grid size={20} className="text-white" />
            </div>
            Sprite Studio
          </h1>
          <p className="text-sm text-slate-500 mt-1 ml-11">
            Build spritesheets from your library, or split existing ones into frames.
          </p>
        </div>

        {/* Download button */}
        <button
          onClick={handleFooterClick}
          disabled={footerDisabled}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            footerDisabled
              ? 'opacity-40 cursor-not-allowed ' + (activeTab === 'creator' ? 'bg-indigo-300 text-white' : 'bg-rose-300 text-white')
              : activeTab === 'creator'
                ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 text-white'
                : 'bg-rose-500 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 text-white'
          }`}
        >
          <Download size={18} />
          {activeTab === 'creator' ? 'Download Spritesheet' : 'Download Frames (.zip)'}
        </button>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-8 flex gap-1 shrink-0">
        <button
          onClick={() => setActiveTab('creator')}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'creator'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Grid size={16} />
          Sheet Creator
        </button>
        <button
          onClick={() => setActiveTab('splitter')}
          className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'splitter'
              ? 'border-rose-500 text-rose-600'
              : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
          }`}
        >
          <Scissors size={16} />
          Sheet Splitter
        </button>
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'creator' && (
          <SpritesheetCreator
            library={library}
            getPayloadFromOptions={getPayloadFromOptions}
            onDownloadReady={setCreatorDataUrl}
          />
        )}
        {activeTab === 'splitter' && (
          <SheetSplitter
            onCanSplit={setCanSplit}
            downloadRef={splitterDownloadRef}
          />
        )}
      </div>
    </div>
  );
}
