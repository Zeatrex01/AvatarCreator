import React from 'react';
import { User, Users, Smile, Frown, Angry, Zap, AlertCircle, Save, Dices, Download, Image as ImageIcon } from 'lucide-react';

export default function PreviewPane({
  genderFilter,
  handleGenderChange,
  svgContent,
  setEmotion,
  characterName,
  setCharacterName,
  saveCurrentCharacter,
  applyGenderToRandomization,
  handleDownloadSVG,
  handleDownloadPNG
}) {
  return (
    <div className="w-full lg:w-[400px] shrink-0 border-r border-slate-200 bg-white p-6 flex flex-col items-center justify-start overflow-y-auto">
      
      <div className="w-full max-w-[280px] bg-slate-100 p-1 rounded-xl flex shadow-inner mb-6">
        <button 
          onClick={() => handleGenderChange('male')}
          className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${genderFilter === 'male' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <User size={16} /> Male
        </button>
        <button 
          onClick={() => handleGenderChange('female')}
          className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${genderFilter === 'female' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <User size={16} /> Female
        </button>
        <button 
          onClick={() => handleGenderChange('any')}
          className={`flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${genderFilter === 'any' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <Users size={16} /> Any
        </button>
      </div>

      <div className="w-full max-w-[280px] aspect-square rounded-[2rem] bg-slate-50 border border-slate-200 shadow-sm mb-4 overflow-hidden flex items-center justify-center p-2"
           dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      
      <div className="w-full space-y-4">
        {/* Emotion Presets */}
        <div className="flex justify-center gap-2 mb-2">
          <button onClick={() => setEmotion('default')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 hover:text-slate-700 transition-colors" title="Default">
            <User size={18} />
          </button>
          <button onClick={() => setEmotion('happy')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-green-500 transition-colors" title="Happy">
            <Smile size={18} />
          </button>
          <button onClick={() => setEmotion('sad')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-blue-500 transition-colors" title="Sad">
            <Frown size={18} />
          </button>
          <button onClick={() => setEmotion('angry')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-red-500 transition-colors" title="Angry">
            <Angry size={18} />
          </button>
          <button onClick={() => setEmotion('surprised')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-orange-500 transition-colors" title="Surprised">
            <Zap size={18} />
          </button>
        </div>

        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Name your avatar..."
            value={characterName}
            onChange={e => setCharacterName(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
          <button 
            onClick={saveCurrentCharacter}
            className="flex items-center justify-center px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
            title="Save to Library"
          >
            <Save size={18} />
          </button>
        </div>

        <button 
          onClick={() => applyGenderToRandomization(genderFilter)}
          className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl font-medium transition-colors border border-slate-200"
        >
          <Dices size={20} />
          Randomize
        </button>

        <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
          <button 
            onClick={handleDownloadSVG}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-slate-600"
          >
            <Download size={16} /> SVG
          </button>
          <button 
            onClick={handleDownloadPNG}
            className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-slate-600"
          >
            <ImageIcon size={16} /> PNG
          </button>
        </div>
      </div>
    </div>
  );
}
