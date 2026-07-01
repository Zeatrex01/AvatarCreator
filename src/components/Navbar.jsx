import React, { useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserCircle, Grid, Library, Info, Scissors } from 'lucide-react';

/**
 * Navbar
 * Props:
 *   onToggleLibrary — fn() (avatar page only)
 *   onOpenAbout     — fn()
 */
export default function Navbar({ onToggleLibrary, onOpenAbout }) {
  const location = useLocation();
  const isSprite = location.pathname === '/sprite';

  return (
    <nav className="hidden lg:flex h-16 border-b border-slate-200 bg-white items-center px-6 justify-between shrink-0 z-30">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
          <UserCircle size={20} className="text-white" />
        </div>
        <h1 className="text-lg font-bold text-slate-800">Avatar Playground</h1>
      </div>

      {/* Nav links */}
      <div className="flex items-center gap-1">
        <Link
          to="/"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
            !isSprite
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCircle size={17} />
          Avatar Creator
        </Link>

        <Link
          to="/sprite"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
            isSprite
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Grid size={17} />
          Sprite Studio
        </Link>

        {/* Library button — only on avatar page */}
        {!isSprite && onToggleLibrary && (
          <button
            onClick={onToggleLibrary}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors text-sm ml-2"
          >
            <Library size={17} />
            My Library
          </button>
        )}

        <button
          onClick={onOpenAbout}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors ml-1 border border-transparent hover:border-indigo-100"
          title="About & Credits"
        >
          <Info size={20} />
        </button>
      </div>
    </nav>
  );
}
