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
    <div className="w-full lg:w-[400px] shrink-0 border-b lg:border-b-0 lg:border-r border-slate-200 bg-white p-3 lg:p-6 flex flex-col items-center justify-start z-10 shadow-sm lg:shadow-none">
      
      <div className="flex flex-row lg:flex-col gap-4 lg:gap-0 items-center w-full">
        
        {/* Mobile Left / Desktop Top */}
        <div className="flex flex-col items-center shrink-0 w-[130px] lg:w-full lg:max-w-[280px]">
          <div className="w-full aspect-square rounded-[1.25rem] lg:rounded-[2rem] bg-slate-50 border border-slate-200 shadow-sm mb-2 lg:mb-4 overflow-hidden flex items-center justify-center p-1 lg:p-2"
               dangerouslySetInnerHTML={{ __html: svgContent }}
          />

          <div className="w-full bg-slate-100 p-1 rounded-lg flex shadow-inner mb-0 lg:mb-6">
            <button 
              onClick={() => handleGenderChange('male')}
              className={`flex-1 py-1.5 lg:py-2 text-[10px] lg:text-sm font-medium rounded-md flex items-center justify-center gap-1 lg:gap-2 transition-all ${genderFilter === 'male' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              title="Male"
            >
              <User size={14} className="lg:w-4 lg:h-4" /> <span className="hidden lg:inline">Male</span>
            </button>
            <button 
              onClick={() => handleGenderChange('female')}
              className={`flex-1 py-1.5 lg:py-2 text-[10px] lg:text-sm font-medium rounded-md flex items-center justify-center gap-1 lg:gap-2 transition-all ${genderFilter === 'female' ? 'bg-white text-pink-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              title="Female"
            >
              <User size={14} className="lg:w-4 lg:h-4" /> <span className="hidden lg:inline">Female</span>
            </button>
            <button 
              onClick={() => handleGenderChange('any')}
              className={`flex-1 py-1.5 lg:py-2 text-[10px] lg:text-sm font-medium rounded-md flex items-center justify-center gap-1 lg:gap-2 transition-all ${genderFilter === 'any' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              title="Any"
            >
              <Users size={14} className="lg:w-4 lg:h-4" /> <span className="hidden lg:inline">Any</span>
            </button>
          </div>
        </div>

        {/* Mobile Right / Desktop Bottom */}
        <div className="flex-1 flex flex-col justify-center space-y-2 lg:space-y-4 w-full">
          
          {/* Emotion Presets */}
          <div className="flex justify-center gap-1 lg:gap-2 lg:mb-2">
            <button onClick={() => setEmotion('default')} className="p-1.5 lg:p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors" title="Default">
              <User size={16} className="lg:w-[18px] lg:h-[18px]" />
            </button>
            <button onClick={() => setEmotion('happy')} className="p-1.5 lg:p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-green-500 transition-colors" title="Happy">
              <Smile size={16} className="lg:w-[18px] lg:h-[18px]" />
            </button>
            <button onClick={() => setEmotion('sad')} className="p-1.5 lg:p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-blue-500 transition-colors" title="Sad">
              <Frown size={16} className="lg:w-[18px] lg:h-[18px]" />
            </button>
            <button onClick={() => setEmotion('angry')} className="p-1.5 lg:p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-red-500 transition-colors" title="Angry">
              <Angry size={16} className="lg:w-[18px] lg:h-[18px]" />
            </button>
            <button onClick={() => setEmotion('surprised')} className="p-1.5 lg:p-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-orange-500 transition-colors" title="Surprised">
              <Zap size={16} className="lg:w-[18px] lg:h-[18px]" />
            </button>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Name..."
              value={characterName}
              onChange={e => setCharacterName(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg lg:rounded-xl px-3 lg:px-4 py-2 lg:py-2.5 text-xs lg:text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
            />
            <button 
              onClick={saveCurrentCharacter}
              className="flex items-center justify-center px-3 lg:px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg lg:rounded-xl font-medium transition-colors"
              title="Save to Library"
            >
              <Save size={16} className="lg:w-[18px] lg:h-[18px]" />
            </button>
          </div>

          <button 
            onClick={() => applyGenderToRandomization(genderFilter)}
            className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 lg:px-5 py-2 lg:py-3 rounded-lg lg:rounded-xl text-sm lg:text-base font-medium transition-colors border border-slate-200"
          >
            <Dices size={16} className="lg:w-5 lg:h-5" />
            Randomize
          </button>

          <div className="hidden lg:grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
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
    </div>
  );
}
