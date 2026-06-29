import React, { useState, useMemo } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { Grid, Image as ImageIcon, Library } from 'lucide-react';

import Navbar from './components/Navbar';
import PreviewPane from './components/PreviewPane';
import OptionsGrid from './components/OptionsGrid';
import LibrarySidebar from './components/LibrarySidebar';
import SpriteToolModal from './components/SpriteToolModal';
import AboutModal from './components/AboutModal';

import { useAvatar } from './hooks/useAvatar';
import { useLibrary } from './hooks/useLibrary';
import { TABS, MALE_HAIR, FEMALE_HAIR, UNISEX_HAIR } from './utils/constants';

function App() {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('top');
  const [isExporting, setIsExporting] = useState(false);
  const [exportResolution] = useState(512);
  const [isSpriteToolOpen, setIsSpriteToolOpen] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  
  const { library, saveLibrary, deleteCharacter } = useLibrary();
  const {
    seed, setSeed,
    genderFilter,
    characterName, setCharacterName,
    activeCharacterId, setActiveCharacterId,
    options,
    handleOptionChange,
    applyGenderToRandomization,
    handleGenderChange,
    setEmotion,
    loadCharacter
  } = useAvatar();

  const saveCurrentCharacter = () => {
    const name = characterName.trim() || `Character - ${seed.substring(0,4)}`;
    
    if (activeCharacterId) {
      const existingChar = library.find(c => c.id === activeCharacterId);
      if (existingChar) {
        if (window.confirm(`Do you want to overwrite the existing character "${name}"?\nIf you cancel, a new copy will be created.`)) {
          const updatedLibrary = library.map(c => {
            if (c.id === activeCharacterId) {
              return { ...c, name, seed, gender: genderFilter, options: { ...options } };
            }
            return c;
          });
          saveLibrary(updatedLibrary);
          setIsLibraryOpen(true);
          return;
        }
      }
    }

    const newChar = {
      id: Date.now().toString(),
      name,
      seed,
      gender: genderFilter,
      options: { ...options }
    };
    saveLibrary([newChar, ...library]);
    setActiveCharacterId(newChar.id);
    setIsLibraryOpen(true);
  };

  const getPayloadFromOptions = (optsObj, customSeed = seed, customGender = genderFilter) => {
    const payload = { seed: customSeed, size: 256, style: optsObj.style };
    Object.keys(optsObj).forEach(key => {
      if (Array.isArray(optsObj[key]) && optsObj[key].length > 0) {
        if (optsObj[key][0] === "none") {
          if (key === 'top') payload.topProbability = 0;
          if (key === 'facialHair') payload.facialHairProbability = 0;
          if (key === 'accessories') payload.accessoriesProbability = 0;
        } else {
          payload[key] = optsObj[key];
          if (key === 'top') payload.topProbability = 100;
          if (key === 'facialHair') payload.facialHairProbability = 100;
          if (key === 'accessories') payload.accessoriesProbability = 100;
        }
      }
    });
    
    if (customGender === 'female') {
      payload.facialHairProbability = 0;
    }
    
    return payload;
  };

  const dicebearOptions = useMemo(() => getPayloadFromOptions(options), [seed, options, genderFilter]);
  const avatarSvg = useMemo(() => createAvatar(avataaars, dicebearOptions).toString(), [dicebearOptions]);

  const handleDownloadSVG = () => {
    const blob = new Blob([avatarSvg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${characterName || 'avatar'}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const svgToPngBlob = (svgString, res = 512) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = res;
      canvas.height = res;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        ctx.drawImage(img, 0, 0, res, res);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      };
      img.src = url;
    });
  };

  const handleDownloadPNG = async () => {
    const blob = await svgToPngBlob(avatarSvg, exportResolution);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${characterName || 'avatar'}.png`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportZip = async () => {
    if (library.length === 0) return;
    setIsExporting(true);
    const zip = new JSZip();

    try {
      for (const char of library) {
        const payload = getPayloadFromOptions(char.options, char.seed, char.gender || 'any');
        payload.size = exportResolution;
        const avatar = createAvatar(avataaars, payload);
        const svgString = avatar.toString();
        const blob = await svgToPngBlob(svgString, exportResolution);
        
        const fileName = char.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'avatar';
        zip.file(`${fileName}_${char.id}.png`, blob);
      }

      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, 'avatars_export.zip');
    } catch (e) {
      console.error("Failed to export zip", e);
    } finally {
      setIsExporting(false);
    }
  };

  const visibleTabs = TABS.filter(t => {
    if (genderFilter === 'female' && t.id === 'facialHair') return false;
    if (t.id === 'clothingGraphic' && options.clothing?.[0] !== 'graphicShirt') return false;
    return true;
  });

  const activeTabData = visibleTabs.find(t => t.id === activeTab) || visibleTabs[0];

  let displayedOptions = activeTabData.options;
  if (activeTabData.id === 'top') {
    // Top options are pre-filtered inside useAvatar and constants, but we need to compute it here based on constants
    if (genderFilter === 'male') {
      displayedOptions = ['none', ...MALE_HAIR, ...UNISEX_HAIR];
    } else if (genderFilter === 'female') {
      displayedOptions = ['none', ...FEMALE_HAIR, ...UNISEX_HAIR];
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-16 lg:pb-0">
      
      <Navbar 
        onOpenSpriteTool={() => setIsSpriteToolOpen(true)}
        onToggleLibrary={() => setIsLibraryOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <main className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden relative">
        
        <PreviewPane
          genderFilter={genderFilter}
          handleGenderChange={handleGenderChange}
          svgContent={avatarSvg}
          setEmotion={setEmotion}
          characterName={characterName}
          setCharacterName={setCharacterName}
          saveCurrentCharacter={saveCurrentCharacter}
          applyGenderToRandomization={applyGenderToRandomization}
          handleDownloadSVG={handleDownloadSVG}
          handleDownloadPNG={handleDownloadPNG}
        />

        <OptionsGrid
          visibleTabs={visibleTabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeTabData={activeTabData}
          options={options}
          handleOptionChange={handleOptionChange}
          displayedOptions={displayedOptions}
          getPayloadFromOptions={getPayloadFromOptions}
        />

        <LibrarySidebar
          isOpen={isLibraryOpen}
          onClose={() => setIsLibraryOpen(false)}
          library={library}
          librarySearch={librarySearch}
          setLibrarySearch={setLibrarySearch}
          seed={seed}
          getPayloadFromOptions={getPayloadFromOptions}
          loadCharacter={loadCharacter}
          deleteCharacter={deleteCharacter}
          handleExportZip={handleExportZip}
          isExporting={isExporting}
        />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 flex items-center justify-around px-2 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => setIsSpriteToolOpen(true)}
          className="flex flex-col items-center justify-center p-2 text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mb-1">
            <Grid size={18} className="text-emerald-600" />
          </div>
          <span className="text-[10px] font-medium">Sprite Tool</span>
        </button>

        <button 
          onClick={handleDownloadPNG}
          className="flex flex-col items-center justify-center p-2 text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mb-1">
            <ImageIcon size={18} className="text-indigo-600" />
          </div>
          <span className="text-[10px] font-medium">Export</span>
        </button>

        <button 
          onClick={() => setIsLibraryOpen(true)}
          className="flex flex-col items-center justify-center p-2 text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mb-1">
            <Library size={18} className="text-purple-600" />
          </div>
          <span className="text-[10px] font-medium">Library</span>
        </button>
      </div>

      <SpriteToolModal 
        isOpen={isSpriteToolOpen} 
        onClose={() => setIsSpriteToolOpen(false)} 
        library={library} 
        getPayloadFromOptions={getPayloadFromOptions} 
      />

      <AboutModal 
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}

export default App;
