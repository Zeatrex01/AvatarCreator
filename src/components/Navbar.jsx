import React from 'react';
import { UserCircle, Grid, Library, Info } from 'lucide-react';

export default function Navbar({ onOpenSpriteTool, onToggleLibrary, onOpenAbout }) {
  return (
    <nav className="h-16 border-b border-slate-200 bg-white flex items-center px-6 justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
          <UserCircle size={20} className="text-white" />
        </div>
        <h1 className="text-lg font-bold text-slate-800">Avatar Playground</h1>
      </div>
      <div className="hidden lg:flex items-center gap-3">
        <button 
          onClick={onOpenSpriteTool}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg font-medium transition-colors"
        >
          <Grid size={18} />
          <span className="hidden sm:inline">Sprite Tool</span>
        </button>
        <button 
          onClick={onToggleLibrary}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
        >
          <Library size={18} />
          <span className="hidden sm:inline">My Library</span>
        </button>
        <button 
          onClick={onOpenAbout}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors ml-2 border border-transparent hover:border-indigo-100"
          title="About & Credits"
        >
          <Info size={20} />
        </button>
      </div>
    </nav>
  );
}
