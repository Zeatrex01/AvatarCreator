import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'GeneratedCharacters');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir);
}

const characters = [
  {
    name: "Burak_Aydin",
    seed: "burak",
    options: {
      style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"],
      top: ["shortWaved"], hairColor: ["2c1b18"], skinColor: ["edb98a"],
      facialHair: ["beardLight"], facialHairColor: ["2c1b18"], facialHairProbability: 100,
      eyes: ["default"], eyebrows: ["defaultNatural"], mouth: ["smile"], backgroundColor: ["transparent"]
    }
  },
  {
    name: "Cansu_Demir",
    seed: "cansu",
    options: {
      style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"],
      top: ["straight02"], hairColor: ["724133"], skinColor: ["ffdbb4"],
      facialHairProbability: 0,
      eyes: ["default"], eyebrows: ["flatNatural"], mouth: ["serious"], backgroundColor: ["transparent"]
    }
  },
  {
    name: "Emre_Koc",
    seed: "emre",
    options: {
      style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"],
      top: ["sides"], hairColor: ["e8e1e1"], skinColor: ["d08b5b"],
      facialHair: ["beardLight"], facialHairColor: ["e8e1e1"], facialHairProbability: 100,
      eyes: ["squint"], eyebrows: ["sadConcernedNatural"], mouth: ["grimace"], backgroundColor: ["transparent"]
    }
  }
];

for (const char of characters) {
  const avatar = createAvatar(avataaars, { seed: char.seed, size: 256, ...char.options });
  const svg = avatar.toString();
  const filePath = path.join(outDir, `${char.name}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Generated: ${filePath}`);
}
