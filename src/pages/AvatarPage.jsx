import React, { useState, useMemo } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { Image as ImageIcon, Library, Scissors } from 'lucide-react';

import PreviewPane    from '../components/PreviewPane';
import OptionsGrid    from '../components/OptionsGrid';
import LibrarySidebar from '../components/LibrarySidebar';

import { useAvatar }  from '../hooks/useAvatar';
import { useLibrary } from '../hooks/useLibrary';
import { PROPERTY_DICTIONARY, MALE_HAIR, FEMALE_HAIR, UNISEX_HAIR } from '../utils/constants';

/**
 * AvatarPage
 * Props:
 *   onToggleLibrary  — passed up to Navbar (mobile bottom nav also uses it)
 *   isLibraryOpen    — controlled from root so Navbar button works
 *   setIsLibraryOpen
 *
 * Exports: library, getPayloadFromOptions (consumed by SpriteStudioPage via root)
 */
export default function AvatarPage({
  library, saveLibrary, deleteCharacter, clearLibrary,
  getPayloadFromOptions,
  isLibraryOpen, setIsLibraryOpen,
}) {
  const [activeTab,   setActiveTab]   = useState('top');
  const [isExporting, setIsExporting] = useState(false);
  const [exportResolution]            = useState(512);
  const [librarySearch, setLibrarySearch] = useState('');

  const {
    seed,
    genderFilter,
    characterName, setCharacterName,
    activeCharacterId, setActiveCharacterId,
    options,
    handleOptionChange,
    applyGenderToRandomization,
    handleGenderChange,
    setEmotion,
    loadCharacter,
  } = useAvatar();

  const activeCollection = avataaars;

  const dicebearOptions = useMemo(
    () => getPayloadFromOptions(options, seed, genderFilter),
    [seed, options, genderFilter]
  );

  const avatarSvg = useMemo(
    () => createAvatar(activeCollection, dicebearOptions).toString(),
    [dicebearOptions, activeCollection]
  );

  // ── Character save ────────────────────────────────────────────────────────

  const saveCurrentCharacter = () => {
    const name = characterName.trim() || `Character - ${seed.substring(0, 4)}`;

    if (activeCharacterId) {
      const existing = library.find(c => c.id === activeCharacterId);
      if (existing) {
        if (window.confirm(`Overwrite "${name}"? Cancel to create a new copy.`)) {
          saveLibrary(library.map(c =>
            c.id === activeCharacterId ? { ...c, name, seed, gender: genderFilter, options: { ...options } } : c
          ));
          setIsLibraryOpen(true);
          return;
        }
      }
    }

    const newChar = { id: Date.now().toString(), name, seed, gender: genderFilter, options: { ...options } };
    saveLibrary([newChar, ...library]);
    setActiveCharacterId(newChar.id);
    setIsLibraryOpen(true);
  };

  // ── Download helpers ──────────────────────────────────────────────────────

  const handleDownloadSVG = () => {
    const blob = new Blob([avatarSvg], { type: 'image/svg+xml' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${characterName || 'avatar'}.svg`; a.click();
    URL.revokeObjectURL(url);
  };

  const svgToPngBlob = (svgString, res = 512) =>
    new Promise(resolve => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = res;
      const img = new Image();
      const url = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' }));
      img.onload = () => { canvas.getContext('2d').drawImage(img, 0, 0, res, res); URL.revokeObjectURL(url); canvas.toBlob(resolve, 'image/png'); };
      img.src = url;
    });

  const handleDownloadPNG = async () => {
    const blob = await svgToPngBlob(avatarSvg, exportResolution);
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${characterName || 'avatar'}.png`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadTemplate = () => {
    const payload = { ...dicebearOptions, size: 1024, top: ['none'], accessories: ['none'], facialHair: ['none'] };
    let svg = createAvatar(activeCollection, payload).toString();
    svg = svg.replace(/<g transform="translate\(78 134\)">(.*?)<\/g>/g, '');
    svg = svg.replace(/<g transform="translate\(76 90\)">(.*?)<\/g>/g, '');
    svg = svg.replace(/<g transform="translate\(76 82\)">(.*?)<\/g>/g, '');
    const overlay = `<g id="blueprint-guide" opacity="0.6">
      <path d="M 50% 0 L 50% 100%" stroke="#ff00ff" stroke-width="1" stroke-dasharray="4 4" />
      <path d="M 0 50% L 100% 50%" stroke="#ff00ff" stroke-width="1" stroke-dasharray="4 4" />
      <rect x="25%" y="40%" width="20%" height="15%" fill="none" stroke="#00ffff" stroke-width="2" stroke-dasharray="2 2" />
      <rect x="55%" y="40%" width="20%" height="15%" fill="none" stroke="#00ffff" stroke-width="2" stroke-dasharray="2 2" />
      <text x="35%" y="38%" font-family="monospace" font-size="12" fill="#00ffff" text-anchor="middle">EYE_L</text>
      <text x="65%" y="38%" font-family="monospace" font-size="12" fill="#00ffff" text-anchor="middle">EYE_R</text>
      <rect x="35%" y="65%" width="30%" height="15%" fill="none" stroke="#00ff00" stroke-width="2" stroke-dasharray="2 2" />
      <text x="50%" y="63%" font-family="monospace" font-size="12" fill="#00ff00" text-anchor="middle">MOUTH</text>
      <rect x="20%" y="35%" width="60%" height="25%" fill="none" stroke="#ffaa00" stroke-width="1" stroke-dasharray="4 4" />
      <text x="50%" y="33%" font-family="monospace" font-size="12" fill="#ffaa00" text-anchor="middle">GLASSES/ACCESSORY</text>
    </g>`;
    svg = svg.replace('</svg>', `${overlay}</svg>`);
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'avataaars_blueprint.svg'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportZip = async () => {
    if (!library.length) return;
    setIsExporting(true);
    const zip = new JSZip();
    try {
      for (const char of library) {
        const payload = getPayloadFromOptions(char.options, char.seed, char.gender || 'any');
        payload.size  = exportResolution;
        const blob    = await svgToPngBlob(createAvatar(activeCollection, payload).toString(), exportResolution);
        zip.file(`${char.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'avatar'}_${char.id}.png`, blob);
      }
      saveAs(await zip.generateAsync({ type: 'blob' }), 'avatars_export.zip');
    } catch (e) { console.error('Export zip failed', e); }
    finally { setIsExporting(false); }
  };

  // ── Tabs ──────────────────────────────────────────────────────────────────

  const visibleTabs = useMemo(() => {
    const props = activeCollection.schema.properties;
    const colorKeys = Object.keys(props).filter(k => props[k].type === 'array' && props[k].items?.pattern);
    const tabs = Object.keys(props)
      .filter(k => props[k].type === 'array' && props[k].items?.enum && !k.toLowerCase().includes('probability'))
      .map(key => ({
        id: key,
        label: PROPERTY_DICTIONARY[key]?.label ?? key,
        icon: PROPERTY_DICTIONARY[key]?.icon ?? 'Settings',
        options: props[key].default || props[key].items.enum || [],
        colorKeys: colorKeys.filter(c => c.startsWith(key) || (key === 'top' && c === 'hairColor') || (key === 'clothing' && c === 'clothesColor')),
      }));

    const usedColors = new Set(tabs.flatMap(t => t.colorKeys));
    const standalone = colorKeys.filter(c => !usedColors.has(c));
    if (tabs.length && standalone.length) tabs[0].colorKeys = [...standalone, ...tabs[0].colorKeys];

    return tabs.filter(t => {
      if (genderFilter === 'female' && t.id === 'facialHair') return false;
      if (t.id === 'clothingGraphic' && options.clothing?.[0] !== 'graphicShirt') return false;
      return true;
    });
  }, [activeCollection, genderFilter, options.clothing]);

  const activeTabData    = visibleTabs.find(t => t.id === activeTab) || visibleTabs[0] || { id: 'default', options: [], colorKeys: [] };
  let   displayedOptions = activeTabData.options;
  if (activeTabData.id === 'top') {
    if (genderFilter === 'male')   displayedOptions = ['none', ...MALE_HAIR,   ...UNISEX_HAIR];
    if (genderFilter === 'female') displayedOptions = ['none', ...FEMALE_HAIR, ...UNISEX_HAIR];
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
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
          handleDownloadTemplate={handleDownloadTemplate}
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
          activeCollection={activeCollection}
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
          clearLibrary={clearLibrary}
          handleExportZip={handleExportZip}
          isExporting={isExporting}
        />
      </main>

      {/* Mobile bottom nav */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 flex items-center justify-around px-1 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button onClick={handleDownloadTemplate} className="flex flex-col items-center justify-center p-2 text-slate-500 hover:text-indigo-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-1"><Scissors size={18} className="text-blue-600" /></div>
          <span className="text-[10px] font-medium">Şablon</span>
        </button>
        <button onClick={handleDownloadPNG} className="flex flex-col items-center justify-center p-2 text-slate-500 hover:text-indigo-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mb-1"><ImageIcon size={18} className="text-indigo-600" /></div>
          <span className="text-[10px] font-medium">Export</span>
        </button>
        <button onClick={() => setIsLibraryOpen(true)} className="flex flex-col items-center justify-center p-2 text-slate-500 hover:text-indigo-600 transition-colors">
          <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center mb-1"><Library size={18} className="text-purple-600" /></div>
          <span className="text-[10px] font-medium">Library</span>
        </button>
      </div>
    </>
  );
}
