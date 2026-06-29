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

      {/* Mobile Top Actions (Name Input + Style Selector) */}
      <div className="w-full flex flex-col items-center gap-3 mb-6 lg:mb-8 pt-4 lg:pt-0">
        <input
          type="text"
          value={characterName}
          onChange={(e) => setCharacterName(e.target.value)}
          placeholder="Unnamed Character"
          className="bg-transparent text-center text-xl lg:text-2xl font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-0 border-b-2 border-transparent focus:border-indigo-500 transition-colors px-2 py-1 w-2/3 lg:w-3/4"
        />

        {/* Collection/Style Toggle */}
        <div className="flex bg-slate-100/80 backdrop-blur-sm p-1 rounded-full shadow-inner border border-slate-200">
          {['avataaars', 'adventurer', 'micah'].map(col => (
            <button
              key={col}
              onClick={() => setActiveCollectionName(col)}
              className={`px-3 py-1 text-xs font-semibold rounded-full capitalize transition-all ${activeCollectionName === col ? 'bg-white shadow-sm text-indigo-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {col}
            </button>
          ))}
        </div>
      </div>
      
      <div className="w-full space-y-3 lg:space-y-4">
        
        {/* Compact Mobile Row: Gender & Emotion */}
        <div className="flex items-center justify-between lg:hidden w-full px-1">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl shadow-inner">
            <button onClick={() => handleGenderChange('any')} className={`p-1.5 rounded-lg text-sm font-medium transition-all ${genderFilter === 'any' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} title="Any Gender"><Users size={16} /></button>
            <button onClick={() => handleGenderChange('male')} className={`p-1.5 rounded-lg text-sm font-medium transition-all ${genderFilter === 'male' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} title="Masculine"><User size={16} /></button>
            <button onClick={() => handleGenderChange('female')} className={`p-1.5 rounded-lg text-sm font-medium transition-all ${genderFilter === 'female' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`} title="Feminine"><User size={16} className="text-pink-500" /></button>
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl shadow-inner">
            <button onClick={() => setEmotion('default')} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors" title="Default"><Smile size={16} /></button>
            <button onClick={() => setEmotion('sad')} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-blue-500 transition-colors" title="Sad"><Frown size={16} /></button>
            <button onClick={() => setEmotion('angry')} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-red-500 transition-colors" title="Angry"><Angry size={16} /></button>
            <button onClick={() => setEmotion('surprised')} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-orange-500 transition-colors" title="Surprised"><Zap size={16} /></button>
          </div>
        </div>

        {/* Name Input & Save (Both Mobile and Desktop) */}
        <div className="flex gap-2">
          <button 
            onClick={saveCurrentCharacter}
            className="flex-1 flex items-center justify-center px-5 lg:px-4 py-3 lg:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors shadow-sm"
            title="Save Character"
          >
            <span className="hidden lg:inline mr-2">Save to Library</span>
            <span className="lg:hidden mr-2">Save</span>
            <Save size={18} />
          </button>
        </div>

        {/* Desktop Only: Quick Actions */}
        <div className="hidden lg:flex gap-2 pt-2">
          <button onClick={() => applyGenderToRandomization(genderFilter)} className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl text-sm font-medium transition-colors">
            <Dices size={18} /> Randomize
          </button>
        </div>
        
        {/* Desktop Only: Filters */}
        <div className="hidden lg:block space-y-3 pt-2">
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Gender Focus</label>
            <div className="flex gap-2">
              <button onClick={() => handleGenderChange('any')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex justify-center items-center gap-2 ${genderFilter === 'any' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 border' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}><Users size={16} /> Any</button>
              <button onClick={() => handleGenderChange('male')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex justify-center items-center gap-2 ${genderFilter === 'male' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 border' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}><User size={16} /> Masc</button>
              <button onClick={() => handleGenderChange('female')} className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex justify-center items-center gap-2 ${genderFilter === 'female' ? 'bg-pink-50 text-pink-700 border-pink-200 border' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}><User size={16} /> Fem</button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Quick Emotion</label>
            <div className="flex gap-2">
              <button onClick={() => setEmotion('default')} className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-colors flex justify-center items-center" title="Default"><Smile size={18} /></button>
              <button onClick={() => setEmotion('sad')} className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-blue-500 transition-colors flex justify-center items-center" title="Sad"><Frown size={18} /></button>
              <button onClick={() => setEmotion('angry')} className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-red-500 transition-colors flex justify-center items-center" title="Angry"><Angry size={18} /></button>
              <button onClick={() => setEmotion('surprised')} className="flex-1 py-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-orange-500 transition-colors flex justify-center items-center" title="Surprised"><Zap size={18} /></button>
            </div>
          </div>
        </div>

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
            <Scissors size={16} /> Blueprint (Base SVG)
          </button>
        </div>

      </div>
    </div>
  );
}
