import React, { useState, useMemo, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { Download, Dices, Image as ImageIcon, Save, Trash2, Library, UserCircle, X, Check, User, Users, FolderArchive, Smile, Frown, Angry, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const SCHEMA = {
  top: ["hat", "hijab", "turban", "winterHat1", "winterHat02", "winterHat03", "winterHat04", "bob", "bun", "curly", "curvy", "dreads", "frida", "fro", "froBand", "longButNotTooLong", "miaWallace", "shavedSides", "straight02", "straight01", "straightAndStrand", "dreads01", "dreads02", "frizzle", "shaggy", "shaggyMullet", "shortCurly", "shortFlat", "shortRound", "shortWaved", "sides", "theCaesar", "theCaesarAndSidePart", "bigHair"],
  accessories: ["kurt", "prescription01", "prescription02", "round", "sunglasses", "wayfarers", "eyepatch"],
  clothing: ["blazerAndShirt", "blazerAndSweater", "collarAndSweater", "graphicShirt", "hoodie", "overall", "shirtCrewNeck", "shirtScoopNeck", "shirtVNeck"],
  clothingGraphic: ["bat", "bear", "cumbia", "deer", "diamond", "hola", "pizza", "resist", "skull", "skullOutline"],
  eyes: ["closed", "cry", "default", "eyeRoll", "happy", "hearts", "side", "squint", "surprised", "winkWacky", "wink", "xDizzy"],
  eyebrows: ["angryNatural", "defaultNatural", "flatNatural", "frownNatural", "raisedExcitedNatural", "sadConcernedNatural", "unibrowNatural", "upDownNatural", "angry", "default", "raisedExcited", "sadConcerned", "upDown"],
  mouth: ["concerned", "default", "disbelief", "eating", "grimace", "sad", "screamOpen", "serious", "smile", "tongue", "twinkle", "vomit"],
  facialHair: ["beardLight", "beardMajestic", "beardMedium", "moustacheFancy", "moustacheMagnum"],
};

const COLORS = {
  skinColor: ["614335", "d08b5b", "ae5d29", "edb98a", "ffdbb4", "fd9841", "f8d25c"],
  hairColor: ["a55728", "2c1b18", "b58143", "d6b370", "724133", "4a312c", "f59797", "ecdcbf", "c93305", "e8e1e1"],
  facialHairColor: ["a55728", "2c1b18", "b58143", "d6b370", "724133", "4a312c", "f59797", "ecdcbf", "c93305", "e8e1e1"],
  clothesColor: ["262e33", "65c9ff", "5199e4", "25557c", "e6e6e6", "929598", "3c4f5c", "b1e2ff", "a7ffc4", "ffafb9", "ffffb1", "ff488e", "ff5c5c", "ffffff"],
  accessoriesColor: ["262e33", "65c9ff", "5199e4", "25557c", "e6e6e6", "929598", "3c4f5c", "b1e2ff", "a7ffc4", "ffafb9", "ffffb1", "ff488e", "ff5c5c", "ffffff"],
  backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf", "65c9ff", "transparent"]
};

const COLOR_LABELS = {
  skinColor: "Skin",
  hairColor: "Hair Color",
  facialHairColor: "Facial Hair Color",
  clothesColor: "Clothes Color",
  accessoriesColor: "Accessories Color",
  backgroundColor: "Background"
};

const MALE_HAIR = ["dreads01", "dreads02", "frizzle", "shaggy", "shaggyMullet", "shortCurly", "shortFlat", "shortRound", "shortWaved", "sides", "theCaesar", "theCaesarAndSidePart"];
const FEMALE_HAIR = ["bob", "bun", "curly", "curvy", "dreads", "frida", "fro", "froBand", "longButNotTooLong", "miaWallace", "shavedSides", "straight02", "straight01", "straightAndStrand", "bigHair", "hijab"];
const UNISEX_HAIR = ["hat", "turban", "winterHat1", "winterHat02", "winterHat03", "winterHat04"];

const TABS = [
  { id: 'style', label: 'Style', options: ['circle', 'default'], colorKeys: ['backgroundColor', 'skinColor'] },
  { id: 'top', label: 'Hair / Head', options: ['none', ...SCHEMA.top], colorKeys: ['hairColor'] },
  { id: 'facialHair', label: 'Facial Hair', options: ['none', ...SCHEMA.facialHair], colorKeys: ['facialHairColor'] },
  { id: 'clothing', label: 'Clothing', options: SCHEMA.clothing, colorKeys: ['clothesColor'] },
  { id: 'clothingGraphic', label: 'T-Shirt Print', options: ['none', ...SCHEMA.clothingGraphic], colorKeys: [] },
  { id: 'eyes', label: 'Eyes', options: SCHEMA.eyes, colorKeys: [] },
  { id: 'eyebrows', label: 'Eyebrows', options: SCHEMA.eyebrows, colorKeys: [] },
  { id: 'mouth', label: 'Mouth', options: SCHEMA.mouth, colorKeys: [] },
  { id: 'accessories', label: 'Accessories', options: ['none', ...SCHEMA.accessories], colorKeys: ['accessoriesColor'] }
];

function App() {
  const [seed, setSeed] = useState('Hero');
  const [genderFilter, setGenderFilter] = useState('any');
  const [characterName, setCharacterName] = useState('');
  const [activeCharacterId, setActiveCharacterId] = useState(null);
  const [library, setLibrary] = useState([]);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('top');
  const [isExporting, setIsExporting] = useState(false);
  
  const [options, setOptions] = useState({
    style: ['circle'],
    top: [], accessories: [], clothing: [], clothingGraphic: [], eyes: [], eyebrows: [], mouth: [], facialHair: [],
    skinColor: [], hairColor: [], facialHairColor: [], clothesColor: [], accessoriesColor: [], backgroundColor: ['transparent'],
  });

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // Load Library
  useEffect(() => {
    const saved = localStorage.getItem('avatar_library');
    let parsed = saved && saved !== "[]" ? JSON.parse(saved) : [];
    
    const defaultChars = [
      {
        id: "1", name: "Burak Aydin (Satis)", seed: "burak", gender: "male",
        options: { style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], clothingGraphic: [], top: ["shortWaved"], hairColor: ["2c1b18"], skinColor: ["edb98a"], facialHair: ["beardLight"], facialHairColor: ["2c1b18"], eyes: ["default"], eyebrows: ["defaultNatural"], mouth: ["smile"], backgroundColor: ["transparent"] }
      },
      {
        id: "2", name: "Cansu Demir (IK)", seed: "cansu", gender: "female",
        options: { style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], clothingGraphic: [], top: ["straight02"], hairColor: ["724133"], skinColor: ["ffdbb4"], facialHair: ["none"], eyes: ["default"], eyebrows: ["flatNatural"], mouth: ["serious"], backgroundColor: ["transparent"] }
      },
      {
        id: "3", name: "Emre Koc (Direktor)", seed: "emre", gender: "male",
        options: { style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], clothingGraphic: [], top: ["sides"], hairColor: ["e8e1e1"], skinColor: ["d08b5b"], facialHair: ["beardLight"], facialHairColor: ["e8e1e1"], eyes: ["squint"], eyebrows: ["sadConcernedNatural"], mouth: ["grimace"], backgroundColor: ["transparent"] }
      },
      {
        id: "4", name: "Fatih Dogan (Pazarlama)", seed: "fatih", gender: "male",
        options: { style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], clothingGraphic: [], top: ["shortWaved"], hairColor: ["2c1b18"], skinColor: ["ffdbb4"], facialHair: ["none"], eyes: ["default"], eyebrows: ["raisedExcitedNatural"], mouth: ["smile"], backgroundColor: ["transparent"] }
      },
      {
        id: "5", name: "Gul Arslan (Muhasebe)", seed: "gul", gender: "female",
        options: { style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], clothingGraphic: [], top: ["bun"], hairColor: ["4a312c"], skinColor: ["ffdbb4"], facialHair: ["none"], eyes: ["surprised"], eyebrows: ["defaultNatural"], mouth: ["default"], backgroundColor: ["transparent"] }
      },
      {
        id: "6", name: "Mehmet Kaya (Proje Yon.)", seed: "mehmet", gender: "male",
        options: { style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], clothingGraphic: [], top: ["theCaesarAndSidePart"], hairColor: ["2c1b18"], skinColor: ["edb98a"], facialHair: ["none"], eyes: ["squint"], eyebrows: ["angryNatural"], mouth: ["serious"], backgroundColor: ["transparent"] }
      },
      {
        id: "7", name: "Osman Yildiz (Isci)", seed: "osman", gender: "male",
        options: { style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], clothingGraphic: [], top: ["frizzle"], hairColor: ["2c1b18"], skinColor: ["ae5d29"], facialHair: ["moustacheMagnum"], facialHairColor: ["4a312c"], eyes: ["cry"], eyebrows: ["sadConcernedNatural"], mouth: ["grimace"], backgroundColor: ["transparent"] }
      },
      {
        id: "8", name: "Pinar Cetin (Operasyon)", seed: "pinar", gender: "female",
        options: { style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], clothingGraphic: [], top: ["bun"], hairColor: ["2c1b18"], skinColor: ["ffdbb4"], facialHair: ["none"], eyes: ["squint"], eyebrows: ["angryNatural"], mouth: ["serious"], backgroundColor: ["transparent"] }
      },
      {
        id: "9", name: "Serdar Polat (Yazilim)", seed: "serdar", gender: "male",
        options: { style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], clothingGraphic: [], top: ["shaggy"], hairColor: ["4a312c"], skinColor: ["ffdbb4"], facialHair: ["beardLight"], facialHairColor: ["4a312c"], eyes: ["default"], eyebrows: ["raisedExcitedNatural"], mouth: ["concerned"], backgroundColor: ["transparent"] }
      },
      {
        id: "10", name: "Serkan Yilmaz (Pazarlama)", seed: "serkan", gender: "male",
        options: { style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], clothingGraphic: [], top: ["shortCurly"], hairColor: ["2c1b18"], skinColor: ["edb98a"], facialHair: ["none"], eyes: ["happy"], eyebrows: ["defaultNatural"], mouth: ["smile"], backgroundColor: ["transparent"] }
      },
      {
        id: "11", name: "Zeynep Celik (Muhasebe)", seed: "zeynep", gender: "female",
        options: { style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], clothingGraphic: [], top: ["longButNotTooLong"], hairColor: ["4a312c"], skinColor: ["ffdbb4"], facialHair: ["none"], eyes: ["cry"], eyebrows: ["sadConcernedNatural"], mouth: ["default"], backgroundColor: ["transparent"] }
      }
    ];

    let changed = false;
    const newLibrary = [...parsed];
    defaultChars.forEach(defChar => {
      if (!parsed.find(p => p.id === defChar.id)) {
        newLibrary.push(defChar);
        changed = true;
      }
    });

    if (changed || parsed.length === 0) {
      setLibrary(newLibrary);
      localStorage.setItem('avatar_library', JSON.stringify(newLibrary));
    } else {
      setLibrary(parsed);
    }
  }, []);

  const saveLibrary = (newLibrary) => {
    setLibrary(newLibrary);
    localStorage.setItem('avatar_library', JSON.stringify(newLibrary));
  };

  const applyGenderToRandomization = (gender) => {
    const newSeed = Math.random().toString(36).substring(2, 10);
    setSeed(newSeed);
    setCharacterName('');
    setActiveCharacterId(null);
    
    let newOptions = {
      style: options.style,
      backgroundColor: options.backgroundColor,
      accessories: [], clothing: [], clothingGraphic: [], eyes: [], eyebrows: [], mouth: [],
      skinColor: [], hairColor: [], facialHairColor: [], clothesColor: [], accessoriesColor: []
    };

    if (gender === 'male') {
      newOptions.top = [pickRandom([...MALE_HAIR, ...UNISEX_HAIR])];
      newOptions.facialHair = Math.random() > 0.6 ? [pickRandom(SCHEMA.facialHair)] : [];
    } else if (gender === 'female') {
      newOptions.top = [pickRandom([...FEMALE_HAIR, ...UNISEX_HAIR])];
      newOptions.facialHair = ["none"];
    } else {
      newOptions.top = [];
      newOptions.facialHair = [];
    }

    setOptions(newOptions);
  };

  const handleGenderChange = (gender) => {
    setGenderFilter(gender);
    applyGenderToRandomization(gender);
  };

  const setEmotion = (emotion) => {
    setOptions(prev => {
      const opts = { ...prev };
      switch(emotion) {
        case 'happy':
          opts.eyes = ['happy']; opts.mouth = ['smile']; opts.eyebrows = ['defaultNatural'];
          break;
        case 'angry':
          opts.eyes = ['squint']; opts.mouth = ['serious']; opts.eyebrows = ['angryNatural'];
          break;
        case 'sad':
          opts.eyes = ['cry']; opts.mouth = ['sad']; opts.eyebrows = ['sadConcernedNatural'];
          break;
        case 'surprised':
          opts.eyes = ['surprised']; opts.mouth = ['disbelief']; opts.eyebrows = ['raisedExcitedNatural'];
          break;
        case 'default':
          opts.eyes = ['default']; opts.mouth = ['default']; opts.eyebrows = ['defaultNatural'];
          break;
        default:
          break;
      }
      return opts;
    });
  };

  const saveCurrentCharacter = () => {
    const name = characterName.trim() || `Character - ${seed.substring(0,4)}`;
    
    if (activeCharacterId) {
      const existingChar = library.find(c => c.id === activeCharacterId);
      if (existingChar) {
        if (window.confirm(`Var olan "${name}" karakterinin üzerine kaydetmek istiyor musunuz?\nİptal derseniz yeni bir kopya oluşturulur.`)) {
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

  const loadCharacter = (char) => {
    setSeed(char.seed);
    setOptions(char.options);
    setCharacterName(char.name);
    setGenderFilter(char.gender || 'any');
    setActiveCharacterId(char.id);
    setIsLibraryOpen(false);
  };

  const deleteCharacter = (e, id) => {
    e.stopPropagation();
    const charToDelete = library.find(c => c.id === id);
    if (window.confirm(`"${charToDelete?.name || 'Bu karakter'}" adlı karakteri silmek istediğinize emin misiniz?`)) {
      const updatedLibrary = library.filter(c => c.id !== id);
      saveLibrary(updatedLibrary);
      if (activeCharacterId === id) {
        setActiveCharacterId(null);
      }
    }
  };

  // Build the MAIN dicebear option payload for the preview
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

  const avatar = useMemo(() => {
    return createAvatar(avataaars, dicebearOptions);
  }, [dicebearOptions]);

  const svgContent = avatar.toString();

  const handleOptionChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value ? [value] : [] }));
  };

  const handleDownloadSVG = () => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${characterName || 'avatar'}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const svgToPngBlob = (svgString) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 512, 512);
        URL.revokeObjectURL(url);
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      };
      img.src = url;
    });
  };

  const handleDownloadPNG = async () => {
    const blob = await svgToPngBlob(svgContent);
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
    try {
      const zip = new JSZip();
      
      for (let i = 0; i < library.length; i++) {
        const char = library[i];
        const payload = getPayloadFromOptions(char.options, char.seed, char.gender || 'any');
        payload.size = 512;
        const charSvg = createAvatar(avataaars, payload).toString();
        const blob = await svgToPngBlob(charSvg);
        
        // Sanitize filename
        const safeName = char.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
        zip.file(`${safeName}_${i}.png`, blob);
      }
      
      const zipContent = await zip.generateAsync({ type: 'blob' });
      saveAs(zipContent, 'avatars_export.zip');
    } catch (e) {
      console.error("Failed to export zip", e);
    } finally {
      setIsExporting(false);
    }
  };

  // Filter tabs
  const visibleTabs = TABS.filter(t => {
    if (genderFilter === 'female' && t.id === 'facialHair') return false;
    // Show clothingGraphic only if clothing is graphicShirt
    if (t.id === 'clothingGraphic' && options.clothing?.[0] !== 'graphicShirt') return false;
    return true;
  });

  const activeTabData = visibleTabs.find(t => t.id === activeTab) || visibleTabs[0];

  // Filter options
  let displayedOptions = activeTabData.options;
  if (activeTabData.id === 'top') {
    if (genderFilter === 'male') {
      displayedOptions = ['none', ...MALE_HAIR, ...UNISEX_HAIR];
    } else if (genderFilter === 'female') {
      displayedOptions = ['none', ...FEMALE_HAIR, ...UNISEX_HAIR];
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Navbar */}
      <nav className="h-16 border-b border-slate-200 bg-white flex items-center px-6 justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
            <UserCircle size={20} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-slate-800">Avatar Playground</h1>
        </div>
        <button 
          onClick={() => setIsLibraryOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
        >
          <Library size={18} />
          <span className="hidden sm:inline">My Library</span>
        </button>
      </nav>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left Pane: Preview */}
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
                <AlertCircle size={18} />
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

        {/* Right Pane: Options Grid */}
        <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
          
          <div className="px-6 pt-6 pb-0 bg-white border-b border-slate-200 shrink-0">
            <div className="flex gap-6 overflow-x-auto no-scrollbar pb-4">
              {visibleTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap text-sm font-medium transition-colors relative ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto space-y-8">
              
              {activeTabData.colorKeys.length > 0 && (
                <div className="flex flex-wrap gap-8">
                  {activeTabData.colorKeys.map(colorKey => (
                    <div key={colorKey} className="space-y-2">
                      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{COLOR_LABELS[colorKey]}</h3>
                      <div className="flex flex-wrap gap-1.5 max-w-sm">
                        <button 
                          onClick={() => handleOptionChange(colorKey, '')}
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-transform hover:scale-110 ${!options[colorKey] || options[colorKey].length === 0 ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-sm' : 'border-slate-300 bg-white'}`}
                          title="Auto (Random)"
                        >
                          <span className="text-[10px] text-slate-500">Auto</span>
                        </button>
                        {COLORS[colorKey].map(color => (
                          <button
                            key={color}
                            onClick={() => handleOptionChange(colorKey, color)}
                            className={`w-7 h-7 rounded-full border transition-all hover:scale-110 flex items-center justify-center ${options[colorKey]?.[0] === color ? 'border-indigo-600 ring-2 ring-indigo-600/20 scale-110 shadow-sm' : 'border-slate-200 shadow-sm'}`}
                            style={{ backgroundColor: color === 'transparent' ? '#ffffff' : `#${color}` }}
                            title={`#${color}`}
                          >
                            {color === 'transparent' && <span className="text-[14px] text-slate-300 font-bold block rotate-45">/</span>}
                            {options[colorKey]?.[0] === color && color !== 'transparent' && (
                              <Check size={12} className={['ffffff', 'e6e6e6', 'ffdfbf'].includes(color) ? 'text-slate-900' : 'text-white'} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Visual Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
                {displayedOptions.map(optValue => {
                  const isActive = (options[activeTabData.id]?.[0] || 'auto') === optValue || (optValue === 'none' && options[activeTabData.id]?.[0] === 'none');
                  
                  const thumbOpts = { ...options };
                  thumbOpts[activeTabData.id] = [optValue];
                  const payload = getPayloadFromOptions(thumbOpts);
                  payload.size = 128; 
                  
                  const thumbSvg = createAvatar(avataaars, payload).toString();

                  return (
                    <button
                      key={optValue}
                      onClick={() => handleOptionChange(activeTabData.id, optValue)}
                      className={`relative aspect-square rounded-2xl border bg-white flex flex-col items-center justify-center p-2 transition-all hover:shadow-md hover:border-slate-300 group ${isActive ? 'border-indigo-600 ring-2 ring-indigo-600/20 shadow-sm' : 'border-slate-200'}`}
                    >
                      <div 
                        className="w-full h-full flex items-center justify-center"
                        dangerouslySetInnerHTML={{ __html: thumbSvg }}
                      />
                      <div className="absolute bottom-2 left-2 right-2 text-center text-[10px] font-medium text-slate-500 bg-white/90 backdrop-blur-sm py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity capitalize">
                        {optValue === 'none' ? 'None' : optValue.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                      {isActive && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm">
                          <Check size={12} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

        {/* Library Slide-over Modal */}
        {isLibraryOpen && (
          <div className="absolute inset-0 z-50 flex justify-end">
            <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={() => setIsLibraryOpen(false)} />
            <div className="relative w-full max-w-sm bg-white border-l border-slate-200 shadow-2xl h-full flex flex-col">
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Library size={18} className="text-indigo-600" />
                  <h2 className="font-semibold text-slate-800">My Library</h2>
                </div>
                <button onClick={() => setIsLibraryOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                  <X size={18} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {library.length === 0 ? (
                  <div className="text-center text-slate-400 mt-10 text-sm">
                    <Library size={48} className="mx-auto mb-4 opacity-20" />
                    <p>No characters saved yet.</p>
                  </div>
                ) : (
                  library.map(char => (
                    <div 
                      key={char.id} 
                      onClick={() => loadCharacter(char)}
                      className={`group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer bg-white ${seed === char.seed ? 'border-indigo-600 shadow-sm ring-1 ring-indigo-600/20' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
                    >
                      <div 
                        className="w-12 h-12 bg-slate-50 rounded-full overflow-hidden flex-shrink-0 border border-slate-100"
                        dangerouslySetInnerHTML={{ __html: createAvatar(avataaars, getPayloadFromOptions(char.options, char.seed, char.gender || 'any')).toString() }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate text-slate-800">{char.name}</h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{char.gender || 'any'}</p>
                      </div>
                      <button 
                        onClick={(e) => deleteCharacter(e, char.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Batch Export Button */}
              {library.length > 0 && (
                <div className="p-4 border-t border-slate-200 bg-slate-50">
                  <button 
                    onClick={handleExportZip}
                    disabled={isExporting}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors ${isExporting ? 'bg-indigo-300 text-white cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'}`}
                  >
                    <FolderArchive size={20} />
                    {isExporting ? 'Exporting...' : 'Export All (.zip)'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
