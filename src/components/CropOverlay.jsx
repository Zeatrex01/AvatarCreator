import React, { useState, useRef } from 'react';
import { Crop, Check, X } from 'lucide-react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

/**
 * CropOverlay
 * Single responsibility: display a full-screen crop UI for one image,
 * call onConfirm(File) or onCancel().
 *
 * Props:
 *   src       — ObjectURL string of the image to crop
 *   fileName  — original file name (used for output File)
 *   onConfirm — fn(File) called with the cropped result
 *   onCancel  — fn() called when user cancels
 */
export default function CropOverlay({ src, fileName, onConfirm, onCancel }) {
  const [crop,          setCrop]          = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const imgRef = useRef(null);

  const handleConfirm = async () => {
    if (!completedCrop?.width || !completedCrop?.height || !imgRef.current) return;

    const image  = imgRef.current;
    const scaleX = image.naturalWidth  / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement('canvas');
    canvas.width  = completedCrop.width;
    canvas.height = completedCrop.height;
    canvas.getContext('2d').drawImage(
      image,
      completedCrop.x * scaleX, completedCrop.y * scaleY,
      completedCrop.width * scaleX, completedCrop.height * scaleY,
      0, 0, completedCrop.width, completedCrop.height,
    );

    canvas.toBlob(blob => {
      if (blob) onConfirm(new File([blob], fileName || 'cropped.png', { type: 'image/png' }));
    }, 'image/png');
  };

  return (
    <div className="absolute inset-0 z-[60] flex flex-col rounded-2xl overflow-hidden bg-slate-50/95 backdrop-blur-3xl border border-white/60 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/40 bg-white/40 backdrop-blur-xl">
        <h3 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Crop size={20} className="text-indigo-600" />
          </div>
          Crop Image
        </h3>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-semibold bg-white/80 text-slate-700 rounded-xl hover:bg-white border border-slate-200/50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!completedCrop?.width}
            className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Check size={18} strokeWidth={2.5} /> Confirm &amp; Crop
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-8">
        <div className="relative p-2 bg-white rounded-2xl shadow-2xl border border-slate-200/60">
          <ReactCrop
            crop={crop}
            onChange={c => setCrop(c)}
            onComplete={c => setCompletedCrop(c)}
            className="rounded-xl overflow-hidden"
          >
            <img
              ref={imgRef}
              src={src}
              alt="Crop target"
              className="max-w-full max-h-[65vh] object-contain rounded-xl"
            />
          </ReactCrop>
        </div>
      </div>
    </div>
  );
}
