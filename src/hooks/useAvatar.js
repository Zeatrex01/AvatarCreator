import { useState, useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import { SCHEMA, MALE_HAIR, FEMALE_HAIR, UNISEX_HAIR } from '../utils/constants';

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function useAvatar() {
  const [seed, setSeed] = useState('Hero');
  const [genderFilter, setGenderFilter] = useState('any');
  const [characterName, setCharacterName] = useState('');
  const [activeCharacterId, setActiveCharacterId] = useState(null);
  const [activeCollectionName, setActiveCollectionName] = useState('avataaars');
  
  const [options, setOptions] = useState({
    backgroundColor: ['transparent'],
  });

  const applyGenderToRandomization = (gender) => {
    const newSeed = Math.random().toString(36).substring(2, 10);
    setSeed(newSeed);
    setCharacterName('');
    setActiveCharacterId(null);
    
    let newOptions = {
      backgroundColor: options.backgroundColor || ['transparent']
    };

    if (activeCollectionName === 'avataaars') {
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
      
      if (activeCollectionName === 'avataaars') {
        switch(emotion) {
          case 'happy': opts.eyes = ['happy']; opts.mouth = ['smile']; opts.eyebrows = ['defaultNatural']; break;
          case 'angry': opts.eyes = ['squint']; opts.mouth = ['serious']; opts.eyebrows = ['angryNatural']; break;
          case 'sad': opts.eyes = ['cry']; opts.mouth = ['sad']; opts.eyebrows = ['sadConcernedNatural']; break;
          case 'surprised': opts.eyes = ['surprised']; opts.mouth = ['disbelief']; opts.eyebrows = ['raisedExcitedNatural']; break;
          case 'default': opts.eyes = ['default']; opts.mouth = ['default']; opts.eyebrows = ['defaultNatural']; break;
          default: break;
        }
      } else if (activeCollectionName === 'micah') {
        switch(emotion) {
          case 'happy': opts.eyes = ['smiling']; opts.mouth = ['smile', 'laughing']; break;
          case 'angry': opts.eyes = ['round']; opts.eyebrows = ['angry']; break;
          case 'sad': opts.mouth = ['sad', 'pucker']; break;
          case 'surprised': opts.mouth = ['surprised']; break;
          default: opts.eyes = []; opts.mouth = []; opts.eyebrows = []; break;
        }
      } else if (activeCollectionName === 'adventurer') {
        switch(emotion) {
          case 'happy': opts.mouth = ['variant02', 'variant26']; break;
          case 'angry': opts.mouth = ['variant12', 'variant22']; break;
          case 'sad': opts.mouth = ['variant08', 'variant14']; break;
          case 'surprised': opts.mouth = ['variant24', 'variant16']; break;
          default: opts.mouth = []; break;
        }
      }
      return opts;
    });
  };

  const loadCharacter = (char) => {
    setSeed(char.seed);
    setOptions(char.options || {});
    setCharacterName(char.name);
    setGenderFilter(char.gender || 'any');
    setActiveCharacterId(char.id);
    if (char.collectionName) {
      setActiveCollectionName(char.collectionName);
    }
  };

  const handleOptionChange = (key, value) => {
    setOptions(prev => ({ ...prev, [key]: value ? [value] : [] }));
  };

  // When collection changes, clear options
  const handleCollectionChange = (col) => {
    setActiveCollectionName(col);
    setOptions({ backgroundColor: options.backgroundColor || ['transparent'] });
  };

  return {
    seed, setSeed,
    genderFilter, setGenderFilter,
    characterName, setCharacterName,
    activeCharacterId, setActiveCharacterId,
    activeCollectionName, setActiveCollectionName: handleCollectionChange,
    options, setOptions,
    handleOptionChange,
    applyGenderToRandomization,
    handleGenderChange,
    setEmotion,
    loadCharacter
  };
}
