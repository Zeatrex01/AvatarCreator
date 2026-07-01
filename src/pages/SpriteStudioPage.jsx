import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Scissors, Download, UserCircle } from 'lucide-react';
import SpritesheetCreator from '../components/SpritesheetCreator';
import SheetSplitter      from '../components/SheetSplitter';

export default function SpriteStudioPage({ library, getPayloadFromOptions }) {
  const [activeTab, setActiveTab]           = useState('creator');
  const [creatorDataUrl, setCreatorDataUrl] = useState(null);
  const [canSplit, setCanSplit]             = useState(false);
  const splitterDownloadRef                 = useRef(null);

  const footerDisabled = activeTab === 'creator' ? !creatorDataUrl : !canSplit;

  const handleDownload = () => {
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

  const downloadBtnClass = `flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
    footerDisabled
      ? 'opacity-40 cursor-not-allowed ' + (activeTab === 'creator' ? 'bg-indigo-300 text-white' : 'bg-rose-300 text-white')
      : activeTab === 'creator'
        ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 text-white'
        : 'bg-rose-500 hover:bg-rose-600 hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 text-white'
  }`;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-50 pb-16 lg:pb-0">

      {/* ── Mobile top bar (logo + back link) ────────────────────── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Grid size={15} className="text-white" />
          </div>
          <span className="font-bold text-slate-800 text-sm">Sprite Studio</span>
        </div>
        <Link to="/" className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-indigo-50">
          <UserCircle size={14} />
          Avatar Creator
        </Link>
      </div>

      {/* ── Desktop page header ───────────────────────────────────── */}
      <div className="hidden lg:flex bg-white border-b border-slate-200 px-8 py-5 items-center justify-between shrink-0">
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
        <button onClick={handleDownload} disabled={footerDisabled} className={downloadBtnClass}>
          <Download size={18} />
          {activeTab === 'creator' ? 'Download Spritesheet' : 'Download Frames (.zip)'}
        </button>
      </div>

      {/* ── Tab bar ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 px-4 lg:px-8 flex gap-1 shrink-0">
        {[
          { id: 'creator',  label: 'Sheet Creator',  Icon: Grid,     active: 'border-indigo-600 text-indigo-600' },
          { id: 'splitter', label: 'Sheet Splitter', Icon: Scissors, active: 'border-rose-500 text-rose-600' },
        ].map(({ id, label, Icon, active }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 lg:px-5 py-3 lg:py-3.5 text-sm font-semibold border-b-2 transition-all ${
              activeTab === id ? active : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <Icon size={15} />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{id === 'creator' ? 'Creator' : 'Splitter'}</span>
          </button>
        ))}
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
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

      {/* ── Mobile bottom bar (download) ──────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 px-4 py-3 flex gap-3">
        <Link
          to="/"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold text-sm hover:bg-slate-200 transition-colors"
        >
          <UserCircle size={17} />
          Avatar
        </Link>
        <button
          onClick={handleDownload}
          disabled={footerDisabled}
          className={`flex-[2] ${downloadBtnClass} justify-center`}
        >
          <Download size={17} />
          {activeTab === 'creator' ? 'Download Sheet' : 'Download Frames'}
        </button>
      </div>
    </div>
  );
}
