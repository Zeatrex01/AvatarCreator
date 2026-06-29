import React from 'react';
import { User, Users, Smile, Frown, Angry, Zap, AlertCircle, Save, Dices, Download, Image as ImageIcon, Scissors } from 'lucide-react';

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
  handleDownloadPNG,
  handleDownloadTemplate,
  activeCollectionName,
  setActiveCollectionName
}) {
  return (
    <div className="w-full lg:w-[400px] shrink-0 border-b-0 lg:border-r border-slate-200 bg-transparent lg:bg-white p-4 lg:p-6 flex flex-col items-center justify-start z-10 shadow-none lg:shadow-none">
      
      {/* Mobile RPG Avatar / Desktop Avatar */}
      <div className="relative w-[240px] lg:w-full lg:max-w-[280px] aspect-square rounded-[2rem] bg-transparent lg:bg-slate-50 border-0 lg:border lg:border-slate-200 shadow-none lg:shadow-sm mb-4 lg:mb-4 overflow-hidden flex items-center justify-center p-0 lg:p-2">
        <div className="w-full h-full flex items-center justify-center scale-110 lg:scale-100" dangerouslySetInnerHTML={{ __html: svgContent }} />
        
        {/* Floating Mobile Dice Button */}
        <button 
          onClick={() => applyGenderToRandomization(genderFilter)} 
          className="lg:hidden absolute bottom-3 right-3 w-12 h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
          title="Randomize"
        >
          <Dices size={24} />
        </button>
      </div>
      
      <div className="w-full space-y-3 lg:space-y-4">
        
        {/* Compact Mobile Row: Gender & Emotion */}
        <div className="flex items-center justify-between lg:hidden w-full px-1">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl shadow-inner">
            <button onClick={() => handleGenderChange('male')} className={`p-2 rounded-lg transition-all ${genderFilter === 'male' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}><User size={18}/></button>
            <button onClick={() => handleGenderChange('female')} className={`p-2 rounded-lg transition-all ${genderFilter === 'female' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-400'}`}><User size={18}/></button>
            <button onClick={() => handleGenderChange('any')} className={`p-2 rounded-lg transition-all ${genderFilter === 'any' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400'}`}><Users size={18}/></button>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl shadow-inner">
            <button onClick={() => setEmotion('default')} className="p-2 text-slate-500 bg-white rounded-lg shadow-sm"><Smile size={18}/></button>
            <button onClick={() => setEmotion('angry')} className="p-2 text-red-500"><Angry size={18}/></button>
            <button onClick={() => setEmotion('surprised')} className="p-2 text-orange-500"><Zap size={18}/></button>
          </div>
        </div>

        {/* Desktop Only: Full Gender Buttons */}
        <div className="hidden lg:flex w-full bg-slate-100 p-1 rounded-xl shadow-inner mb-6">
          <button onClick={() => handleGenderChange('male')} className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${genderFilter === 'male' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <User size={16} /> Male
          </button>
          <button onClick={() => handleGenderChange('female')} className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${genderFilter === 'female' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <User size={16} /> Female
          </button>
          <button onClick={() => handleGenderChange('any')} className={`flex-1 py-2 text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all ${genderFilter === 'any' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            <Users size={16} /> Any
          </button>
        </div>

        {/* Desktop Only: Emotion Presets */}
        <div className="hidden lg:flex justify-center gap-2 mb-2">
          <button onClick={() => setEmotion('default')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors" title="Default"><User size={18} /></button>
          <button onClick={() => setEmotion('happy')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-green-500 transition-colors" title="Happy"><Smile size={18} /></button>
          <button onClick={() => setEmotion('sad')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-blue-500 transition-colors" title="Sad"><Frown size={18} /></button>
          <button onClick={() => setEmotion('angry')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-red-500 transition-colors" title="Angry"><Angry size={18} /></button>
          <button onClick={() => setEmotion('surprised')} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-orange-500 transition-colors" title="Surprised"><Zap size={18} /></button>
        </div>

        {/* Collection/Style Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200 mb-2">
          {['avataaars', 'adventurer', 'micah'].map(col => (
            <button
              key={col}
              onClick={() => setActiveCollectionName(col)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${activeCollectionName === col ? 'bg-white shadow text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {col}
            </button>
          ))}
        </div>

        {/* Name Input & Save (Both Mobile and Desktop) */}
        <div className="flex gap-2">
          <input 
            type="text" 
            placeholder="Name your avatar..."
            value={characterName}
            onChange={e => setCharacterName(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 lg:py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
          <button 
            onClick={saveCurrentCharacter}
            className="flex items-center justify-center px-5 lg:px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm"
            title="Save to Library"
          >
            <Save size={20} className="lg:w-[18px] lg:h-[18px]" />
          </button>
        </div>

        {/* Desktop Only: Big Randomize Button */}
        <button 
          onClick={() => applyGenderToRandomization(genderFilter)}
          className="hidden lg:flex w-full items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-5 py-3 rounded-xl font-medium transition-colors border border-slate-200"
        >
          <Dices size={20} />
          Randomize
        </button>

        {/* Desktop Only: Export */}
        <div className="hidden lg:flex flex-col gap-2 pt-4 border-t border-slate-100">
          <div className="grid grid-cols-2 gap-2">
            <button onClick={handleDownloadSVG} className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-slate-600"><Download size={16} /> SVG</button>
            <button onClick={handleDownloadPNG} className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-slate-600"><ImageIcon size={16} /> PNG</button>
          </div>
          <button 
            onClick={handleDownloadTemplate} 
            className="flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-indigo-600"
            title="Download blank base template to draw your own assets in Illustrator"
          >
            <Scissors size={16} /> Şablon İndir (Base SVG)
          </button>
        </div>

      </div>
    </div>
  );
}
