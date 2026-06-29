import React, { useState, useRef, useCallback, useEffect } from 'react';
import { X, Upload, Download, Grid, Crop, Check } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

export default function SpriteToolModal({ isOpen, onClose, library, getPayloadFromOptions }) {
  const [activeTab, setActiveTab] = useState('library');
  const [columns, setColumns] = useState(0); // 0 means all in one row
  const [isGenerating, setIsGenerating] = useState(false);
  const [customFiles, setCustomFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [cellWidth, setCellWidth] = useState(512);
  const [cellHeight, setCellHeight] = useState(512);
  const [objectFit, setObjectFit] = useState('contain'); // 'contain', 'stretch', 'cover'
  const canvasRef = useRef(null);

  const [editingIndex, setEditingIndex] = useState(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);
  const [filePreviews, setFilePreviews] = useState([]);

  useEffect(() => {
    const urls = customFiles.map(f => URL.createObjectURL(f));
    setFilePreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [customFiles]);

  const getCroppedImg = async (image, crop, fileName) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty');
          return;
        }
        blob.name = fileName;
        const file = new File([blob], fileName, { type: 'image/png' });
        resolve(file);
      }, 'image/png');
    });
  };

  const applyCrop = async () => {
    if (completedCrop?.width && completedCrop?.height && imgRef.current && editingIndex !== null) {
      const originalFile = customFiles[editingIndex];
      const croppedFile = await getCroppedImg(imgRef.current, completedCrop, originalFile.name || 'cropped.png');
      const newFiles = [...customFiles];
      newFiles[editingIndex] = croppedFile;
      setCustomFiles(newFiles);
      setEditingIndex(null);
      setCrop(undefined);
      setCompletedCrop(null);
    }
  };

  // Helper to convert SVG to Image object
  const svgToImage = (svgString, width, height) => {
    return new Promise((resolve, reject) => {
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = reject;
      img.src = url;
      img.width = width;
      img.height = height;
    });
  };

  const fileToImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  // Re-generate preview when dependencies change
  React.useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    
    const updatePreview = async () => {
      setIsGenerating(true);
      try {
        let images = [];

        if (activeTab === 'library') {
          if (library.length === 0) {
            if (isMounted) setPreviewUrl(null);
            return;
          }
          for (const char of library) {
            const payload = getPayloadFromOptions(char.options, char.seed, char.gender || 'any');
            // Force square if library to match aspect
            const renderSize = Math.max(cellWidth, cellHeight);
            payload.size = renderSize; 
            const avatar = createAvatar(avataaars, payload);
            const img = await svgToImage(avatar.toString(), renderSize, renderSize);
            images.push(img);
          }
        } else {
          if (customFiles.length === 0) {
            if (isMounted) setPreviewUrl(null);
            return;
          }
          for (const file of customFiles) {
            const img = await fileToImage(file);
            images.push(img);
          }
        }

        if (images.length === 0 || !isMounted) return;

        const numCols = columns > 0 ? columns : images.length;
        const numRows = Math.ceil(images.length / numCols);

        const canvas = canvasRef.current;
        canvas.width = numCols * cellWidth;
        canvas.height = numRows * cellHeight;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        images.forEach((img, i) => {
          const x = (i % numCols) * cellWidth;
          const y = Math.floor(i / numCols) * cellHeight;
          
          if (activeTab === 'library' || objectFit === 'stretch') {
            ctx.drawImage(img, x, y, cellWidth, cellHeight);
          } else if (objectFit === 'contain') {
            const scale = Math.min(cellWidth / img.width, cellHeight / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            const dx = x + (cellWidth - w) / 2;
            const dy = y + (cellHeight - h) / 2;
            ctx.drawImage(img, dx, dy, w, h);
          } else if (objectFit === 'cover') {
            const scale = Math.max(cellWidth / img.width, cellHeight / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            const dx = x + (cellWidth - w) / 2;
            const dy = y + (cellHeight - h) / 2;
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, cellWidth, cellHeight);
            ctx.clip();
            ctx.drawImage(img, dx, dy, w, h);
            ctx.restore();
          }
        });

        if (isMounted) {
          setPreviewUrl(canvas.toDataURL('image/png'));
        }
      } catch (error) {
        console.error("Preview generation failed:", error);
      } finally {
        if (isMounted) setIsGenerating(false);
      }
    };

    updatePreview();

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeTab, columns, library, customFiles, cellWidth, cellHeight, objectFit]);

  const downloadSpritesheet = () => {
    if (!previewUrl) return;
    const link = document.createElement('a');
    link.download = `spritesheet_${activeTab}_${Date.now()}.png`;
    link.href = previewUrl;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Grid className="text-indigo-600" /> Spritesheet Creator
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/3 flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('library')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'library' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Library
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'custom' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Custom Image
              </button>
            </div>

            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 mb-2">Settings</h3>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-indigo-700 font-medium">Columns</label>
                  <select 
                    value={columns} 
                    onChange={e => setColumns(Number(e.target.value))}
                    className="p-2 rounded-lg border-indigo-200 focus:ring-indigo-500 outline-none w-full"
                  >
                    <option value={0}>Single Row (Strip)</option>
                    <option value={1}>1 (Vertical)</option>
                    <option value={2}>2 Columns</option>
                    <option value={3}>3 Columns</option>
                    <option value={4}>4 Columns</option>
                    <option value={5}>5 Columns</option>
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-sm text-indigo-700 font-medium">Cell Width</label>
                    <input 
                      type="number" 
                      min="16" 
                      max="2048"
                      value={cellWidth}
                      onChange={e => setCellWidth(Number(e.target.value) || 16)}
                      className="p-2 rounded-lg border border-indigo-200 focus:ring-indigo-500 outline-none w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-sm text-indigo-700 font-medium">Cell Height</label>
                    <input 
                      type="number" 
                      min="16" 
                      max="2048"
                      value={cellHeight}
                      onChange={e => setCellHeight(Number(e.target.value) || 16)}
                      className="p-2 rounded-lg border border-indigo-200 focus:ring-indigo-500 outline-none w-full"
                    />
                  </div>
                </div>

                {activeTab === 'custom' && (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-indigo-700 font-medium">Object Fit</label>
                    <select 
                      value={objectFit} 
                      onChange={e => setObjectFit(e.target.value)}
                      className="p-2 rounded-lg border-indigo-200 focus:ring-indigo-500 outline-none w-full"
                    >
                      <option value="contain">Contain (Center and scale)</option>
                      <option value="cover">Cover (Crop to fill)</option>
                      <option value="stretch">Stretch (Fill exact dimensions)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {activeTab === 'custom' && (
              <div className="flex flex-col gap-5">
                <div 
                  className={`text-center p-8 rounded-2xl border-2 border-dashed transition-all duration-300 relative overflow-hidden group ${
                    isDragging ? 'border-emerald-400 bg-emerald-50 scale-[1.02] shadow-lg shadow-emerald-500/10' : 'border-indigo-200 bg-indigo-50/50 hover:border-indigo-400 hover:bg-indigo-50 hover:shadow-md'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                      setCustomFiles(prev => [...prev, ...files]);
                    }
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*"
                    className="hidden" 
                    id="custom-file-upload"
                    onChange={e => {
                      const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
                      setCustomFiles(prev => [...prev, ...files]);
                    }}
                  />
                  <label htmlFor="custom-file-upload" className="cursor-pointer flex flex-col items-center gap-4 relative z-10">
                    <div className={`p-4 rounded-full transition-transform duration-300 shadow-sm ${isDragging ? 'bg-emerald-500 text-white scale-110 shadow-emerald-500/30' : 'bg-white text-indigo-500 group-hover:scale-110 group-hover:shadow-indigo-500/20'}`}>
                      <Upload size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-700">Add New Image</p>
                      <p className="text-sm text-slate-500 mt-1 font-medium">Drag or click here</p>
                    </div>
                  </label>
                </div>

                {customFiles.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-1 scrollbar-thin scrollbar-thumb-slate-200">
                    {customFiles.map((f, i) => (
                      <div key={i} className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200/60 aspect-square flex items-center justify-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <img src={filePreviews[i]} alt="preview" className="max-w-full max-h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500" />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                          <div className="flex gap-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <button 
                              onClick={() => setEditingIndex(i)} 
                              className="p-3 bg-white text-indigo-600 rounded-full hover:bg-indigo-50 hover:scale-110 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                              title="Crop/Edit"
                            >
                              <Crop size={18} strokeWidth={2.5} />
                            </button>
                            <button 
                              onClick={() => setCustomFiles(customFiles.filter((_, idx) => idx !== i))} 
                              className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 hover:scale-110 transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                              title="Delete"
                            >
                              <X size={18} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {activeTab === 'library' && (
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
                You are using <strong>{library.length}</strong> characters from your library.
              </div>
            )}
          </div>

          <div className="w-full lg:w-2/3 min-h-[300px] bg-slate-50 rounded-xl border border-slate-200 overflow-auto flex items-center justify-center p-4 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZmZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2YzZjMiPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2YzZjMiPjwvcmVjdD4KPC9zdmc+')]">
            {isGenerating && (
              <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-lg animate-pulse">
                  Loading Preview...
                </div>
              </div>
            )}
            
            {previewUrl ? (
              <img src={previewUrl} alt="Spritesheet Preview" className="max-w-full h-auto max-h-[60vh] object-contain border border-slate-300 shadow-md bg-white" />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <Grid size={48} className="opacity-20 mb-3" />
                <p className="font-medium">No Preview</p>
              </div>
            )}
          </div>

          {/* Hidden Canvas for generation */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={downloadSpritesheet}
            disabled={!previewUrl || isGenerating}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              !previewUrl || isGenerating ? 'bg-indigo-300 text-white cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 text-white'
            }`}
          >
            <Download size={20} />
            Download Spritesheet
          </button>
        </div>

        {/* Crop Overlay Modal */}
        {editingIndex !== null && (
          <div className="absolute inset-0 z-[60] flex flex-col rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300 bg-slate-50/95 backdrop-blur-3xl border border-white/60 shadow-[0_0_50px_-12px_rgba(0,0,0,0.25)]">
            <div className="flex items-center justify-between p-5 border-b border-white/40 bg-white/40 backdrop-blur-xl relative z-10">
              <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-3 drop-shadow-sm">
                <div className="p-2 bg-indigo-100 rounded-lg shadow-inner">
                  <Crop size={20} className="text-indigo-600" /> 
                </div>
                Crop Image
              </h3>
              <div className="flex gap-3">
                <button 
                  onClick={() => { setEditingIndex(null); setCrop(undefined); setCompletedCrop(null); }}
                  className="px-5 py-2.5 text-sm font-semibold bg-white/80 text-slate-700 rounded-xl hover:bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 active:scale-95 border border-slate-200/50"
                >
                  Cancel
                </button>
                <button 
                  onClick={applyCrop}
                  className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 flex items-center gap-2"
                >
                  <Check size={18} strokeWidth={2.5} /> Confirm & Crop
                </button>
              </div>
            </div>
            
            {/* Dot Grid and Glow Background */}
            <div className="flex-1 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiIGZpbGw9InRyYW5zcGFyZW50Ii8+CjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEuNSIgZmlsbD0iI2NiZDVlMSIvPgo8L3N2Zz4=')] overflow-auto flex items-center justify-center p-8 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />
              
              <div className="relative p-2 bg-white rounded-2xl shadow-2xl border border-slate-200/60 ring-4 ring-indigo-50/50">
                <ReactCrop 
                  crop={crop} 
                  onChange={c => setCrop(c)} 
                  onComplete={c => setCompletedCrop(c)}
                  className="rounded-xl overflow-hidden bg-slate-100/50"
                >
                  <img 
                    ref={imgRef} 
                    src={filePreviews[editingIndex]} 
                    className="max-w-full max-h-[65vh] object-contain rounded-xl"
                    alt="Crop me" 
                  />
                </ReactCrop>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
