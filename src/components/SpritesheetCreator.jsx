import React, { useState, useEffect, useCallback } from 'react';
import { Upload, Grid, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

import { useManagedFiles }      from '../hooks/useManagedFiles';
import { useSpritesheetCanvas } from '../hooks/useSpritesheetCanvas';
import SortableFileGrid         from './SortableFileGrid';
import CropOverlay              from './CropOverlay';

/**
 * SpritesheetCreator
 * Single responsibility: compose settings UI + sub-components into the
 * sheet-creation workflow. No canvas, no file URL, no crop logic here.
 *
 * Props:
 *   library              — character array from app state
 *   getPayloadFromOptions — fn(options, seed, gender) → avataaars payload
 *   onDownloadReady      — fn(dataUrl | null)
 */
export default function SpritesheetCreator({ library, getPayloadFromOptions, onDownloadReady }) {
  const [activeTab, setActiveTab] = useState('library');

  // ── Grid settings ─────────────────────────────────────────────────────────
  const [columns,    setColumns]    = useState(0);
  const [cellWidth,  setCellWidth]  = useState(512);
  const [cellHeight, setCellHeight] = useState(512);
  const [padding,    setPadding]    = useState(0);
  const [bgColor,    setBgColor]    = useState('transparent');
  const [objectFit,  setObjectFit]  = useState('contain');

  // ── File management (SRP hook) ────────────────────────────────────────────
  const { files, fileIds, urlOf, addFiles, removeFile, reorder, replaceFile } = useManagedFiles();

  // ── Drop zone drag state ──────────────────────────────────────────────────
  const [isDropping, setIsDropping] = useState(false);

  // ── Crop overlay ──────────────────────────────────────────────────────────
  const [croppingId, setCroppingId] = useState(null); // file ID being cropped

  // ── Canvas generation (SRP hook) ──────────────────────────────────────────
  const { previewUrl, isGenerating } = useSpritesheetCanvas({
    activeTab,
    library,
    getPayloadFromOptions,
    customFiles: files,
    columns,
    cellWidth,
    cellHeight,
    padding,
    bgColor,
    objectFit,
  });

  // ── Preview zoom ──────────────────────────────────────────────────────────
  const [zoom, setZoom] = useState(1);

  // ── Notify parent (stable ref prevents firing on every parent re-render) ──
  const onDownloadReadyRef = React.useRef(onDownloadReady);
  useEffect(() => { onDownloadReadyRef.current = onDownloadReady; }, [onDownloadReady]);
  useEffect(() => { onDownloadReadyRef.current?.(previewUrl); }, [previewUrl]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFileDrop = useCallback((e) => {
    e.preventDefault(); setIsDropping(false);
    addFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
  }, [addFiles]);

  const handleFileInput = useCallback((e) => {
    addFiles(Array.from(e.target.files).filter(f => f.type.startsWith('image/')));
    e.target.value = ''; // allow re-selecting same file
  }, [addFiles]);

  const handleCropConfirm = useCallback((id, newFile) => {
    replaceFile(id, newFile);
    setCroppingId(null);
  }, [replaceFile]);

  // ── Derived sheet info ────────────────────────────────────────────────────
  const sourceCount = activeTab === 'library' ? library.length : files.length;
  const numCols     = columns > 0 ? columns : Math.max(1, sourceCount);
  const numRows     = sourceCount > 0 ? Math.ceil(sourceCount / numCols) : 0;
  const sheetW      = numCols * cellWidth  + (numCols  + 1) * padding;
  const sheetH      = numRows * cellHeight + (numRows  + 1) * padding;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col lg:flex-row gap-6 flex-1">

      {/* ── Left panel ──────────────────────────────────────────── */}
      <div className="w-full lg:w-1/3 flex flex-col gap-4 overflow-y-auto max-h-[65vh] pr-1">

        {/* Source tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
          {[['library', 'Library'], ['custom', 'Custom Images']].map(([t, label]) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {label}
            </button>
          ))}
        </div>

        {/* ── Settings ──────────────────────────────────────────── */}
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 shrink-0">
          <h3 className="text-sm font-bold text-indigo-900 mb-3">Grid Settings</h3>
          <div className="flex flex-col gap-3">

            {/* Columns */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-indigo-700 font-medium">Columns</label>
              <div className="flex gap-2">
                <select
                  value={columns > 5 ? 'custom' : columns}
                  onChange={e => { if (e.target.value !== 'custom') setColumns(Number(e.target.value)); }}
                  className="flex-1 p-2 rounded-lg border border-indigo-200 outline-none text-sm bg-white"
                >
                  <option value={0}>Single Row</option>
                  {[1, 2, 3, 4, 5].map(n => (
                    <option key={n} value={n}>{n} {n === 1 ? '(Vertical)' : 'Cols'}</option>
                  ))}
                  <option value="custom">Custom…</option>
                </select>
                <input
                  type="number" min="1" max="64"
                  value={columns === 0 ? Math.max(1, sourceCount) : columns}
                  onChange={e => setColumns(Math.max(1, Number(e.target.value) || 1))}
                  className="w-16 p-2 rounded-lg border border-indigo-200 outline-none text-sm bg-white text-center"
                />
              </div>
            </div>

            {/* Cell size */}
            <div className="flex gap-2">
              {[['Cell W', cellWidth, setCellWidth], ['Cell H', cellHeight, setCellHeight]].map(([label, val, set]) => (
                <div key={label} className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-indigo-700 font-medium">{label} (px)</label>
                  <input type="number" min="16" max="2048" value={val}
                    onChange={e => set(Number(e.target.value) || 16)}
                    className="p-2 rounded-lg border border-indigo-200 outline-none w-full text-sm bg-white" />
                </div>
              ))}
            </div>

            {/* Padding */}
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-indigo-700 font-medium">Padding</label>
                <span className="text-xs font-semibold text-indigo-500">{padding}px</span>
              </div>
              <input type="range" min="0" max="64" value={padding}
                onChange={e => setPadding(Number(e.target.value))}
                className="w-full accent-indigo-500" />
            </div>

            {/* Background */}
            <div className="flex flex-col gap-1">
              <label className="text-xs text-indigo-700 font-medium">Background</label>
              <div className="flex gap-2 items-center flex-wrap">
                {['transparent', '#ffffff', '#000000', '#1e293b', '#fef3c7'].map(c => (
                  <button key={c} onClick={() => setBgColor(c)} title={c}
                    className={`w-7 h-7 rounded-lg border-2 transition-all shrink-0 ${bgColor === c ? 'border-indigo-500 scale-110 shadow-md' : 'border-slate-200 hover:border-indigo-300'}`}
                    style={{ background: c === 'transparent' ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'8\' height=\'8\'%3E%3Crect width=\'4\' height=\'4\' fill=\'%23ccc\'/%3E%3Crect x=\'4\' y=\'4\' width=\'4\' height=\'4\' fill=\'%23ccc\'/%3E%3C/svg%3E")' : c }}
                  />
                ))}
                <input type="color"
                  value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                  onChange={e => setBgColor(e.target.value)}
                  className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0 overflow-hidden shrink-0"
                  title="Custom color"
                />
              </div>
            </div>

            {/* Object fit — custom tab only */}
            {activeTab === 'custom' && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-indigo-700 font-medium">Object Fit</label>
                <div className="flex bg-white p-1 rounded-lg border border-indigo-100">
                  {[['contain', 'Contain'], ['cover', 'Cover'], ['stretch', 'Stretch']].map(([v, label]) => (
                    <button key={v} onClick={() => setObjectFit(v)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${objectFit === v ? 'bg-indigo-500 text-white shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sheet size info */}
          {sourceCount > 0 && (
            <div className="mt-3 p-2 bg-white rounded-lg border border-indigo-100 text-xs text-slate-600 font-medium">
              {numRows} × {numCols} &mdash; {sourceCount} frames &mdash; {sheetW} × {sheetH} px
            </div>
          )}
        </div>

        {/* ── Library info ───────────────────────────────────────── */}
        {activeTab === 'library' && (
          <div className="text-center p-5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600 shrink-0">
            Using <strong>{library.length}</strong> characters from your library.
          </div>
        )}

        {/* ── Custom upload + sortable grid ──────────────────────── */}
        {activeTab === 'custom' && (
          <div className="flex flex-col gap-3">
            {/* Drop zone */}
            <div
              className={`text-center p-5 rounded-2xl border-2 border-dashed transition-all duration-300 relative overflow-hidden group shrink-0 ${isDropping ? 'border-emerald-400 bg-emerald-50 scale-[1.02]' : 'border-indigo-200 bg-indigo-50/50 hover:border-indigo-400 hover:bg-indigo-50'}`}
              onDragOver={e => { e.preventDefault(); setIsDropping(true); }}
              onDragLeave={e => { e.preventDefault(); setIsDropping(false); }}
              onDrop={handleFileDrop}
            >
              <input type="file" multiple accept="image/*" className="hidden" id="custom-file-upload" onChange={handleFileInput} />
              <label htmlFor="custom-file-upload" className="cursor-pointer flex items-center justify-center gap-3">
                <div className={`p-3 rounded-full shadow-sm transition-transform ${isDropping ? 'bg-emerald-500 text-white scale-110' : 'bg-white text-indigo-500 group-hover:scale-110'}`}>
                  <Upload size={20} strokeWidth={2.5} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-700">Add Images</p>
                  <p className="text-xs text-slate-500">Drag or click — supports multiple</p>
                </div>
              </label>
            </div>

            {/* Sortable grid */}
            {fileIds.length > 0 && (
              <SortableFileGrid
                fileIds={fileIds}
                urlOf={urlOf}
                onCrop={setCroppingId}
                onDelete={removeFile}
                onReorder={reorder}
              />
            )}
          </div>
        )}
      </div>

      {/* ── Right preview ─────────────────────────────────────────── */}
      <div className="w-full lg:w-2/3 flex flex-col gap-2">

        {/* Zoom bar */}
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => setZoom(z => Math.max(0.1, +(z - 0.25).toFixed(2)))}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
            <ZoomOut size={16} />
          </button>
          <span className="text-xs font-semibold text-slate-500 w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button onClick={() => setZoom(z => Math.min(4, +(z + 0.25).toFixed(2)))}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
            <ZoomIn size={16} />
          </button>
          <button onClick={() => setZoom(1)} title="Reset zoom"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors">
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Preview area */}
        <div className="flex-1 min-h-[300px] bg-slate-50 rounded-xl border border-slate-200 overflow-auto flex items-start justify-center p-4 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZmZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2YzZjMiPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2YzZjMiPjwvcmVjdD4KPC9zdmc+')]">
          {isGenerating && (
            <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
              <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-lg animate-pulse text-sm">
                Generating…
              </div>
            </div>
          )}
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Spritesheet Preview"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', transition: 'transform 0.15s ease' }}
              className="border border-slate-300 shadow-md bg-white"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
              <Grid size={48} className="opacity-20 mb-3" />
              <p className="font-medium">No Preview</p>
              <p className="text-sm mt-1">
                {activeTab === 'library' ? 'Add characters to your library first' : 'Upload images above'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Crop overlay (portal-like, absolute over modal) ───────── */}
      {croppingId && (
        <CropOverlay
          src={urlOf(croppingId)}
          fileName={files[fileIds.indexOf(croppingId)]?.name}
          onConfirm={(newFile) => handleCropConfirm(croppingId, newFile)}
          onCancel={() => setCroppingId(null)}
        />
      )}
    </div>
  );
}
