import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Scissors, RotateCcw } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const SNAP_PX = 8; // display-pixel snap threshold

/**
 * SheetSplitter
 * Props:
 *   onCanSplit  — fn(bool) notifies parent footer when download is possible
 *   downloadRef — ref; parent calls downloadRef.current() to trigger zip download
 */
export default function SheetSplitter({ onCanSplit, downloadRef }) {
  const [file,        setFile]        = useState(null);
  const [previewUrl,  setPreviewUrl]  = useState(null);
  const [imgSize,     setImgSize]     = useState({ w: 0, h: 0 });
  const [isDrop,      setIsDrop]      = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);

  // Grid config (for generating uniform initial lines)
  const [rows,  setRows]  = useState(4);
  const [cols,  setCols]  = useState(4);
  const [mode,  setMode]  = useState('rowcol'); // 'rowcol' | 'cellsize'
  const [cellW, setCellW] = useState(64);
  const [cellH, setCellH] = useState(64);

  // Line positions in IMAGE pixel coordinates (borders 0 / w / h excluded)
  const [hLines, setHLines] = useState([]); // sorted Y values
  const [vLines, setVLines] = useState([]); // sorted X values

  // Interaction state
  const [cursor, setCursor] = useState('default');

  // Refs (stable across closures — used in global event handlers)
  const canvasRef   = useRef(null);
  const imageRef    = useRef(null);
  const imgSizeRef  = useRef({ w: 0, h: 0 });
  const hLinesRef   = useRef([]);
  const vLinesRef   = useRef([]);
  const dragRef     = useRef(null); // { axis:'h'|'v', index:number } | null

  // Keep refs in sync with state
  useEffect(() => { hLinesRef.current = hLines; }, [hLines]);
  useEffect(() => { vLinesRef.current = vLines; }, [vLines]);
  useEffect(() => { imgSizeRef.current = imgSize; }, [imgSize]);

  // Expose download fn to parent
  useEffect(() => { if (downloadRef) downloadRef.current = handleDownload; });
  useEffect(() => { onCanSplit?.(!!file && !isSplitting); }, [file, isSplitting]);

  // ── File handling ─────────────────────────────────────────────────────────

  const handleFile = (f) => {
    if (!f?.type.startsWith('image/')) return;
    setFile(f);
  };

  // Object URL lifecycle
  useEffect(() => {
    if (!file) { setPreviewUrl(null); return; }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Load image into ref + generate initial uniform grid
  useEffect(() => {
    if (!previewUrl) return;
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      const size = { w: img.naturalWidth, h: img.naturalHeight };
      setImgSize(size);
      generateLines(size.w, size.h, rows, cols, mode, cellW, cellH);
    };
    img.src = previewUrl;
  }, [previewUrl]);

  // Regenerate lines when grid params change (only if image already loaded)
  useEffect(() => {
    if (!imgSize.w) return;
    generateLines(imgSize.w, imgSize.h, rows, cols, mode, cellW, cellH);
  }, [rows, cols, mode, cellW, cellH]);

  // ── Grid generation ───────────────────────────────────────────────────────

  const generateLines = (w, h, numR, numC, m, cW, cH) => {
    let r = numR, c = numC;
    if (m === 'cellsize') {
      c = Math.max(1, Math.floor(w / cW));
      r = Math.max(1, Math.floor(h / cH));
    }
    const cw = w / c;
    const ch = h / r;
    setVLines(Array.from({ length: c - 1 }, (_, i) => Math.round((i + 1) * cw)));
    setHLines(Array.from({ length: r - 1 }, (_, i) => Math.round((i + 1) * ch)));
  };

  // ── Canvas draw ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!imageRef.current || !imgSize.w) return;
    draw();
  }, [hLines, vLines, imgSize]);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    const img = imageRef.current;
    const ctx  = canvas.getContext('2d');

    canvas.width  = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);

    const lw      = Math.max(1, Math.round(img.naturalWidth / 400));
    const isDrag  = dragRef.current;

    const drawLine = (x1, y1, x2, y2, active) => {
      ctx.strokeStyle = active ? 'rgba(251,113,133,1)' : 'rgba(239,68,68,0.9)';
      ctx.lineWidth   = active ? lw * 2.5 : lw;
      ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    };

    vLinesRef.current.forEach((x, i) =>
      drawLine(x, 0, x, img.naturalHeight, isDrag?.axis === 'v' && isDrag?.index === i)
    );
    hLinesRef.current.forEach((y, i) =>
      drawLine(0, y, img.naturalWidth, y, isDrag?.axis === 'h' && isDrag?.index === i)
    );
  };

  // ── Coordinate helpers ────────────────────────────────────────────────────

  const getScale = () => {
    const c = canvasRef.current;
    if (!c) return { sx: 1, sy: 1 };
    const r = c.getBoundingClientRect();
    return { sx: c.width / r.width, sy: c.height / r.height };
  };

  const toImgCoords = (e) => {
    const c = canvasRef.current;
    if (!c) return { x: 0, y: 0 };
    const r = c.getBoundingClientRect();
    const { sx, sy } = getScale();
    return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy };
  };

  const findNearestLine = (x, y) => {
    const { sx, sy } = getScale();
    const snapX = SNAP_PX * sx;
    const snapY = SNAP_PX * sy;
    for (let i = 0; i < vLinesRef.current.length; i++)
      if (Math.abs(x - vLinesRef.current[i]) < snapX) return { axis: 'v', index: i };
    for (let i = 0; i < hLinesRef.current.length; i++)
      if (Math.abs(y - hLinesRef.current[i]) < snapY) return { axis: 'h', index: i };
    return null;
  };

  // ── Global mouse events (track drag outside canvas) ───────────────────────

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current) return;
      const { axis, index } = dragRef.current;
      const { x, y } = toImgCoords(e);
      const { w, h } = imgSizeRef.current;

      if (axis === 'v') {
        setVLines(prev => {
          const next = [...prev];
          const min  = index > 0 ? prev[index - 1] + 2 : 2;
          const max  = index < prev.length - 1 ? prev[index + 1] - 2 : w - 2;
          next[index] = Math.round(Math.max(min, Math.min(max, x)));
          return next;
        });
      } else {
        setHLines(prev => {
          const next = [...prev];
          const min  = index > 0 ? prev[index - 1] + 2 : 2;
          const max  = index < prev.length - 1 ? prev[index + 1] - 2 : h - 2;
          next[index] = Math.round(Math.max(min, Math.min(max, y)));
          return next;
        });
      }
    };

    const onUp = () => {
      if (dragRef.current) {
        dragRef.current = null;
        setCursor('default');
        draw(); // redraw without active highlight
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup',   onUp);
    };
  }, []); // stable — uses only refs

  // ── Canvas local mouse events ─────────────────────────────────────────────

  const onCanvasMouseMove = useCallback((e) => {
    if (dragRef.current) return; // global handler takes over during drag
    const { x, y } = toImgCoords(e);
    const hit = findNearestLine(x, y);
    setCursor(hit ? (hit.axis === 'v' ? 'col-resize' : 'row-resize') : 'default');
  }, []);

  const onCanvasMouseDown = useCallback((e) => {
    const { x, y } = toImgCoords(e);
    const hit = findNearestLine(x, y);
    if (!hit) return;
    e.preventDefault();
    dragRef.current = hit;
    setCursor(hit.axis === 'v' ? 'col-resize' : 'row-resize');
  }, []);

  // ── Download ──────────────────────────────────────────────────────────────

  const handleDownload = async () => {
    if (!file || isSplitting) return;
    setIsSplitting(true);
    try {
      const img    = imageRef.current;
      const allV   = [0, ...vLines, imgSize.w];
      const allH   = [0, ...hLines, imgSize.h];
      const zip    = new JSZip();
      const folder = zip.folder('frames');

      for (let r = 0; r < allH.length - 1; r++) {
        for (let c = 0; c < allV.length - 1; c++) {
          const sx = allV[c],        sy = allH[r];
          const sw = allV[c + 1] - sx, sh = allH[r + 1] - sy;
          const cv = document.createElement('canvas');
          cv.width = sw; cv.height = sh;
          cv.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
          const blob = await new Promise(res => cv.toBlob(res, 'image/png'));
          folder.file(`frame_r${r}c${c}.png`, blob);
        }
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `frames_${file.name.replace(/\.[^.]+$/, '')}_${allH.length - 1}x${allV.length - 1}.zip`);
    } catch (err) {
      console.error('Split failed:', err);
    } finally {
      setIsSplitting(false);
    }
  };

  // ── Derived info ──────────────────────────────────────────────────────────

  const frameCount = (hLines.length + 1) * (vLines.length + 1);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col lg:flex-row gap-6 flex-1">

      {/* ── Left panel ──────────────────────────────────────────── */}
      <div className="w-full lg:w-1/3 flex flex-col gap-5">

        {/* Drop zone */}
        <div
          className={`text-center p-8 rounded-2xl border-2 border-dashed transition-all duration-300 relative overflow-hidden group ${
            isDrop ? 'border-rose-400 bg-rose-50 scale-[1.02]' : 'border-rose-200 bg-rose-50/50 hover:border-rose-400 hover:bg-rose-50 hover:shadow-md'
          }`}
          onDragOver={e => { e.preventDefault(); setIsDrop(true); }}
          onDragLeave={e => { e.preventDefault(); setIsDrop(false); }}
          onDrop={e => { e.preventDefault(); setIsDrop(false); handleFile(e.dataTransfer.files?.[0]); }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <input type="file" accept="image/*" className="hidden" id="splitter-file-upload"
            onChange={e => handleFile(e.target.files?.[0])} />
          <label htmlFor="splitter-file-upload" className="cursor-pointer flex flex-col items-center gap-4 relative z-10">
            <div className={`p-4 rounded-full transition-transform duration-300 shadow-sm ${isDrop ? 'bg-rose-500 text-white scale-110' : 'bg-white text-rose-500 group-hover:scale-110'}`}>
              <Scissors size={24} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-base font-bold text-slate-700">{file ? file.name : 'Load Spritesheet'}</p>
              <p className="text-sm text-slate-500 mt-1 font-medium">
                {imgSize.w ? `${imgSize.w} × ${imgSize.h} px` : 'Drag or click here'}
              </p>
            </div>
          </label>
        </div>

        {/* Settings */}
        <div className="bg-rose-50 p-4 rounded-xl border border-rose-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-rose-900">Grid Settings</h3>
            {imgSize.w > 0 && (
              <button
                onClick={() => generateLines(imgSize.w, imgSize.h, rows, cols, mode, cellW, cellH)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-rose-600 bg-white border border-rose-200 rounded-lg hover:bg-rose-50 transition-all"
              >
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>

          {/* Mode toggle */}
          <div className="flex bg-white p-1 rounded-lg border border-rose-100 mb-4">
            {[['rowcol', 'Rows × Cols'], ['cellsize', 'Cell Size']].map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${mode === m ? 'bg-rose-500 text-white shadow-sm' : 'text-slate-500 hover:text-rose-600'}`}>
                {label}
              </button>
            ))}
          </div>

          {mode === 'rowcol' ? (
            <div className="flex gap-2">
              {[['Rows', rows, v => setRows(Math.max(1, v))], ['Columns', cols, v => setCols(Math.max(1, v))]].map(([label, val, set]) => (
                <div key={label} className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-rose-700 font-medium">{label}</label>
                  <input type="number" min="1" max="64" value={val}
                    onChange={e => set(Number(e.target.value) || 1)}
                    className="p-2 rounded-lg border border-rose-200 outline-none w-full text-sm" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-2">
              {[['Cell W (px)', cellW, v => setCellW(Math.max(1, v))], ['Cell H (px)', cellH, v => setCellH(Math.max(1, v))]].map(([label, val, set]) => (
                <div key={label} className="flex flex-col gap-1 flex-1">
                  <label className="text-xs text-rose-700 font-medium">{label}</label>
                  <input type="number" min="1" max="2048" value={val}
                    onChange={e => set(Number(e.target.value) || 1)}
                    className="p-2 rounded-lg border border-rose-200 outline-none w-full text-sm" />
                </div>
              ))}
            </div>
          )}

          {imgSize.w > 0 && (
            <>
              <div className="mt-3 p-2 bg-white rounded-lg border border-rose-100 text-xs text-slate-600 font-medium">
                {hLines.length + 1} × {vLines.length + 1} &mdash; {frameCount} frames
              </div>
              <p className="mt-2 text-xs text-rose-400 italic">
                💡 Drag red lines on the preview to fine-tune
              </p>
            </>
          )}
        </div>
      </div>

      {/* ── Right preview (interactive canvas) ──────────────────── */}
      <div className="w-full lg:w-2/3 min-h-[300px] bg-slate-50 rounded-xl border border-slate-200 overflow-auto flex items-center justify-center p-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZmZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2YzZjMiPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2YzZjMiPjwvcmVjdD4KPC9zdmc+')]">
        {previewUrl ? (
          <canvas
            ref={canvasRef}
            style={{
              cursor,
              imageRendering: 'pixelated',
              maxWidth: '100%',
              maxHeight: '60vh',
              objectFit: 'contain',
              display: 'block',
            }}
            className="border border-slate-300 shadow-md bg-white"
            onMouseMove={onCanvasMouseMove}
            onMouseDown={onCanvasMouseDown}
          />
        ) : (
          <div className="flex flex-col items-center text-slate-400">
            <Scissors size={48} className="opacity-20 mb-3" />
            <p className="font-medium">No Sheet Loaded</p>
            <p className="text-sm mt-1">Upload a spritesheet to preview the split grid</p>
          </div>
        )}
      </div>

    </div>
  );
}
