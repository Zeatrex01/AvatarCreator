import React from 'react';
import { X, Library, Search, Upload, Trash2, FolderArchive } from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

export default function LibrarySidebar({
  isOpen,
  onClose,
  library,
  librarySearch,
  setLibrarySearch,
  seed,
  getPayloadFromOptions,
  loadCharacter,
  deleteCharacter,
  clearLibrary,
  handleExportZip,
  isExporting
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white/95 backdrop-blur-3xl border-l border-white/20 shadow-2xl h-full flex flex-col">
        {/* Premium Header */}
        <div className="p-6 border-b border-slate-200/60 bg-gradient-to-b from-slate-50/50 to-transparent">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Library size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">My Library</h2>
                <p className="text-xs text-slate-500 font-medium">{library.length} saved characters</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {library.length > 0 && (
                <button onClick={clearLibrary} className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Clear All">
                  <Trash2 size={20} />
                </button>
              )}
              <button onClick={onClose} className="p-2.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 rounded-xl transition-all" title="Close Library">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search characters..."
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100/50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {library.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 border border-slate-200 border-dashed">
                <Library size={32} className="text-slate-300" />
              </div>
              <h3 className="text-slate-700 font-semibold mb-1">No characters yet</h3>
              <p className="text-sm text-slate-500 max-w-[200px]">Save your first character to start building your library.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {library.filter(c => c.name.toLowerCase().includes(librarySearch.toLowerCase())).map(char => (
                <div 
                  key={char.id} 
                  className={`group relative flex flex-col items-center p-4 rounded-2xl border transition-all duration-300 bg-white hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 ${seed === char.seed ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/20' : 'border-slate-200/60 hover:border-indigo-300'}`}
                >
                  <div 
                    className="w-20 h-20 bg-slate-50/50 rounded-full mb-3 flex items-center justify-center border border-slate-100 shadow-inner group-hover:scale-105 transition-transform"
                    dangerouslySetInnerHTML={{ __html: createAvatar(avataaars, getPayloadFromOptions(char.options, char.seed, char.gender || 'any')).toString() }}
                  />
                  <div className="w-full text-center">
                    <h3 className="font-bold text-sm truncate text-slate-800" title={char.name}>{char.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider mt-0.5">{char.gender || 'any'}</p>
                  </div>
                  
                  {/* Hover Actions Overlay */}
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-200 rounded-2xl flex items-center justify-center gap-2">
                     <button 
                       onClick={() => { loadCharacter(char); onClose(); }}
                       className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg transition-transform hover:scale-110"
                       title="Load Character"
                     >
                       <Upload size={16} />
                     </button>
                     <button 
                       onClick={(e) => deleteCharacter(e, char.id)}
                       className="p-2.5 bg-white text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl shadow-lg border border-red-100 transition-transform hover:scale-110"
                       title="Delete Character"
                     >
                       <Trash2 size={16} />
                     </button>
                  </div>
                </div>
              ))}
              {library.filter(c => c.name.toLowerCase().includes(librarySearch.toLowerCase())).length === 0 && (
                <div className="col-span-2 text-center text-sm text-slate-500 py-10">
                  No characters found matching "{librarySearch}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Batch Export Button */}
        {library.length > 0 && (
          <div className="p-6 border-t border-slate-200/60 bg-white/50 backdrop-blur-md">
            <button 
              onClick={handleExportZip}
              disabled={isExporting}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold transition-all shadow-lg ${isExporting ? 'bg-indigo-300 text-white cursor-wait' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white hover:shadow-indigo-500/25'}`}
            >
              <FolderArchive size={20} />
              {isExporting ? 'Exporting...' : 'Export All (.zip)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
