import { useState, useRef, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

// ── Image loading helpers (pure, no side-effects on caller) ──────────────────

const svgToImage = (svgString, size) =>
  new Promise((resolve, reject) => {
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    img.onload  = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = reject;
    img.width = img.height = size;
    img.src = url;
  });

const fileToImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload  = () => resolve(img);
      img.onerror = reject;
      img.src     = e.target.result;
    };
    reader.readAsDataURL(file);
  });

// ── Drawing helpers (pure canvas operations) ─────────────────────────────────

const drawFrame = (ctx, img, x, y, w, h, objectFit) => {
  if (objectFit === 'stretch') {
    ctx.drawImage(img, x, y, w, h);
  } else if (objectFit === 'contain') {
    const scale = Math.min(w / img.width, h / img.height);
    const dw = img.width * scale, dh = img.height * scale;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  } else { // cover
    const scale = Math.max(w / img.width, h / img.height);
    const dw = img.width * scale, dh = img.height * scale;
    ctx.save();
    ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    ctx.restore();
  }
};

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useSpritesheetCanvas
 * Single responsibility: generate a spritesheet PNG data URL from sources.
 *
 * Input changes are debounced (150ms) so rapid slider/input changes
 * do not trigger excessive canvas redraws.
 *
 * Returns: { previewUrl, isGenerating, canvasRef }
 */
export function useSpritesheetCanvas({
  activeTab,
  library,
  getPayloadFromOptions,
  customFiles,
  columns,
  cellWidth,
  cellHeight,
  padding,
  bgColor,
  objectFit,
}) {
  const [previewUrl,   setPreviewUrl]   = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef(document.createElement('canvas')); // off-screen, never mounted

  useEffect(() => {
    let cancelled = false;

    // Debounce: cancel previous scheduled run on rapid changes
    const timer = setTimeout(async () => {
      if (cancelled) return;
      setIsGenerating(true);

      try {
        let images = [];

        if (activeTab === 'library') {
          if (!library.length) { setPreviewUrl(null); return; }
          const size = Math.max(cellWidth, cellHeight);
          for (const char of library) {
            if (cancelled) return;
            const payload = getPayloadFromOptions(char.options, char.seed, char.gender || 'any');
            payload.size  = size;
            images.push(await svgToImage(createAvatar(avataaars, payload).toString(), size));
          }
        } else {
          if (!customFiles.length) { setPreviewUrl(null); return; }
          for (const file of customFiles) {
            if (cancelled) return;
            images.push(await fileToImage(file));
          }
        }

        if (cancelled || !images.length) return;

        const numCols  = columns > 0 ? columns : images.length;
        const numRows  = Math.ceil(images.length / numCols);
        const canvas   = canvasRef.current;
        canvas.width   = numCols * cellWidth  + (numCols  + 1) * padding;
        canvas.height  = numRows * cellHeight + (numRows  + 1) * padding;
        const ctx = canvas.getContext('2d');

        if (bgColor === 'transparent') {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        images.forEach((img, i) => {
          const col = i % numCols;
          const row = Math.floor(i / numCols);
          const x   = padding + col * (cellWidth  + padding);
          const y   = padding + row * (cellHeight + padding);
          // Library avatars always stretch (they're already sized correctly)
          drawFrame(ctx, img, x, y, cellWidth, cellHeight, activeTab === 'library' ? 'stretch' : objectFit);
        });

        if (!cancelled) setPreviewUrl(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error('Spritesheet generation failed:', err);
      } finally {
        if (!cancelled) setIsGenerating(false);
      }
    }, 150); // debounce

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [activeTab, library, getPayloadFromOptions, customFiles, columns, cellWidth, cellHeight, padding, bgColor, objectFit]);

  return { previewUrl, isGenerating };
}
