import { useState, useRef, useEffect, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';

let _idCounter = 0;
const nextId = () => `mf-${++_idCounter}`;

/**
 * useManagedFiles
 * Single responsibility: manages an ordered list of File objects with:
 *   - stable string IDs (never reassigned after creation)
 *   - stable ObjectURLs (created once per File, revoked only on removal/unmount)
 *   - add / remove / reorder / replace (for crop result) operations
 *
 * Returns:
 *   files      File[]
 *   fileIds    string[]
 *   urlOf      (id: string) => string | undefined
 *   addFiles   (File[]) => void
 *   removeFile (id: string) => void
 *   reorder    (activeId: string, overId: string) => void
 *   replaceFile(id: string, newFile: File) => void
 */
export function useManagedFiles() {
  // Parallel arrays — index i of files[i] corresponds to fileIds[i]
  const [files,   setFiles]   = useState([]);
  const [fileIds, setFileIds] = useState([]);

  // Stable URL cache: id → ObjectURL (never replaced, only revoked on remove)
  const urlCache = useRef(new Map()); // Map<id, string>

  // Revoke all on unmount
  useEffect(() => {
    return () => urlCache.current.forEach(url => URL.revokeObjectURL(url));
  }, []);

  const addFiles = useCallback((newFiles) => {
    const ids  = newFiles.map(() => nextId());
    ids.forEach((id, i) => {
      urlCache.current.set(id, URL.createObjectURL(newFiles[i]));
    });
    setFiles(prev  => [...prev,  ...newFiles]);
    setFileIds(prev => [...prev, ...ids]);
  }, []);

  const removeFile = useCallback((id) => {
    const url = urlCache.current.get(id);
    if (url) { URL.revokeObjectURL(url); urlCache.current.delete(id); }
    setFileIds(prev => {
      const idx = prev.indexOf(id);
      if (idx === -1) return prev;
      setFiles(f => f.filter((_, i) => i !== idx));
      return prev.filter((_, i) => i !== idx);
    });
  }, []);

  const reorder = useCallback((activeId, overId) => {
    setFileIds(prev => {
      const oldIdx = prev.indexOf(activeId);
      const newIdx = prev.indexOf(overId);
      if (oldIdx === -1 || newIdx === -1) return prev;
      const nextIds = arrayMove(prev, oldIdx, newIdx);
      setFiles(f => arrayMove(f, oldIdx, newIdx));
      return nextIds;
    });
  }, []);

  const replaceFile = useCallback((id, newFile) => {
    const oldUrl = urlCache.current.get(id);
    if (oldUrl) URL.revokeObjectURL(oldUrl);
    urlCache.current.set(id, URL.createObjectURL(newFile));
    setFileIds(prev => {
      const idx = prev.indexOf(id);
      if (idx === -1) return prev;
      setFiles(f => { const n = [...f]; n[idx] = newFile; return n; });
      return prev; // ids unchanged
    });
  }, []);

  const urlOf = useCallback((id) => urlCache.current.get(id), []);

  return { files, fileIds, urlOf, addFiles, removeFile, reorder, replaceFile };
}
