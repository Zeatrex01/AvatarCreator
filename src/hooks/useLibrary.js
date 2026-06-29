import { useState, useEffect } from 'react';

export function useLibrary() {
  const [library, setLibrary] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('avatar_library');
    let parsed = saved && saved !== "[]" ? JSON.parse(saved) : [];
    setLibrary(parsed);
  }, []);

  const saveLibrary = (newLibrary) => {
    setLibrary(newLibrary);
    localStorage.setItem('avatar_library', JSON.stringify(newLibrary));
  };

  const deleteCharacter = (e, id) => {
    e.stopPropagation();
    const charToDelete = library.find(c => c.id === id);
    if (window.confirm(`Are you sure you want to delete "${charToDelete?.name || 'this character'}"?`)) {
      const updatedLibrary = library.filter(c => c.id !== id);
      saveLibrary(updatedLibrary);
      return updatedLibrary;
    }
    return library;
  };

  return {
    library,
    saveLibrary,
    deleteCharacter
  };
}
