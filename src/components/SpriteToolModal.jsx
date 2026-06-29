import React, { useState, useRef } from 'react';
import { X, Upload, Download, Grid } from 'lucide-react';
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
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
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
                Kütüphane
              </button>
              <button
                onClick={() => setActiveTab('custom')}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'custom' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Özel Görsel
              </button>
            </div>

            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
              <h3 className="text-sm font-bold text-indigo-900 mb-2">Ayarlar</h3>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-indigo-700 font-medium">Sütun Sayısı (Columns)</label>
                  <select 
                    value={columns} 
                    onChange={e => setColumns(Number(e.target.value))}
                    className="p-2 rounded-lg border-indigo-200 focus:ring-indigo-500 outline-none w-full"
                  >
                    <option value={0}>Tek Satır (Yatay Strip)</option>
                    <option value={1}>1 (Dikey)</option>
                    <option value={2}>2 Sütun</option>
                    <option value={3}>3 Sütun</option>
                    <option value={4}>4 Sütun</option>
                    <option value={5}>5 Sütun</option>
                  </select>
                </div>
                
                <div className="flex gap-2">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-sm text-indigo-700 font-medium">Hücre Genişliği</label>
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
                    <label className="text-sm text-indigo-700 font-medium">Hücre Yüksekliği</label>
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
                    <label className="text-sm text-indigo-700 font-medium">Hizalama (Farklı Boyutlar)</label>
                    <select 
                      value={objectFit} 
                      onChange={e => setObjectFit(e.target.value)}
                      className="p-2 rounded-lg border-indigo-200 focus:ring-indigo-500 outline-none w-full"
                    >
                      <option value="contain">Sığdır (Ortala ve Küçült)</option>
                      <option value="cover">Kırp (Boşluk Bırakma)</option>
                      <option value="stretch">Esnerek Doldur (Uzama)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {activeTab === 'custom' && (
              <div 
                className={`text-center p-6 rounded-xl border-2 border-dashed transition-colors ${
                  isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-slate-50 hover:border-indigo-400'
                }`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    setCustomFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/')));
                  }
                }}
              >
                <input 
                  type="file" 
                  multiple 
                  accept="image/*"
                  className="hidden" 
                  id="custom-file-upload"
                  onChange={e => setCustomFiles(Array.from(e.target.files))}
                />
                <label htmlFor="custom-file-upload" className="cursor-pointer flex flex-col items-center gap-3">
                  <div className="p-3 bg-white rounded-full shadow-sm text-indigo-500">
                    <Upload size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-slate-700">Görselleri Seçin</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {customFiles.length > 0 ? `${customFiles.length} dosya seçildi` : "Sürükle veya Tıkla"}
                    </p>
                  </div>
                </label>
              </div>
            )}
            {activeTab === 'library' && (
              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600">
                Kütüphanenizdeki <strong>{library.length}</strong> karakter kullanılıyor.
              </div>
            )}
          </div>

          <div className="w-full lg:w-2/3 min-h-[300px] bg-slate-50 rounded-xl border border-slate-200 overflow-auto flex items-center justify-center p-4 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZmZmZiI+PC9yZWN0Pgo8cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2YzZjMiPjwvcmVjdD4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmM2YzZjMiPjwvcmVjdD4KPC9zdmc+')]">
            {isGenerating && (
              <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-lg animate-pulse">
                  Önizleme Yükleniyor...
                </div>
              </div>
            )}
            
            {previewUrl ? (
              <img src={previewUrl} alt="Spritesheet Preview" className="max-w-full h-auto max-h-[60vh] object-contain border border-slate-300 shadow-md bg-white" />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <Grid size={48} className="opacity-20 mb-3" />
                <p className="font-medium">Önizleme Yok</p>
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
            Spritesheet İndir
          </button>
        </div>
      </div>
    </div>
  );
}
