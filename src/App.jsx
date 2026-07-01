import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

import Navbar      from './components/Navbar';
import AboutModal  from './components/AboutModal';
import AvatarPage  from './pages/AvatarPage';
import SpriteStudioPage from './pages/SpriteStudioPage';

import { useLibrary } from './hooks/useLibrary';

/**
 * App — router shell.
 * Owns shared state (library, getPayloadFromOptions) so both pages can read it.
 * No business logic here — delegates to pages.
 */
function AppShell() {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isAboutOpen,   setIsAboutOpen]   = useState(false);

  const { library, saveLibrary, deleteCharacter, clearLibrary } = useLibrary();

  const getPayloadFromOptions = (optsObj, customSeed, customGender) => {
    const payload = { seed: customSeed ?? '', size: 256 };
    if (optsObj.style) payload.style = optsObj.style;

    Object.keys(optsObj).forEach(key => {
      if (Array.isArray(optsObj[key]) && optsObj[key].length > 0) {
        if (optsObj[key][0] === 'none') {
          if (key === 'top')         payload.topProbability          = 0;
          if (key === 'facialHair')  payload.facialHairProbability   = 0;
          if (key === 'accessories') payload.accessoriesProbability  = 0;
        } else {
          payload[key] = optsObj[key];
          if (key === 'top')         payload.topProbability          = 100;
          if (key === 'facialHair')  payload.facialHairProbability   = 100;
          if (key === 'accessories') payload.accessoriesProbability  = 100;
        }
      }
    });

    if (customGender === 'female') payload.facialHairProbability = 0;
    return payload;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-100 lg:bg-none lg:bg-slate-50 text-slate-900 flex flex-col font-sans pb-16 lg:pb-0">
      <Navbar
        onToggleLibrary={() => setIsLibraryOpen(prev => !prev)}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      <Routes>
        <Route
          path="/"
          element={
            <AvatarPage
              library={library}
              saveLibrary={saveLibrary}
              deleteCharacter={deleteCharacter}
              clearLibrary={clearLibrary}
              getPayloadFromOptions={getPayloadFromOptions}
              isLibraryOpen={isLibraryOpen}
              setIsLibraryOpen={setIsLibraryOpen}
            />
          }
        />
        <Route
          path="/sprite"
          element={
            <SpriteStudioPage
              library={library}
              getPayloadFromOptions={getPayloadFromOptions}
            />
          }
        />
      </Routes>

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
