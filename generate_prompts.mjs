import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';
import fs from 'fs';
import path from 'path';

const outDir = path.join(process.cwd(), 'Assets', 'Assets', 'Character_portraits');
fs.mkdirSync(outDir, { recursive: true });

const charsData = [
  {
    name: "Cansu_Demir",
    baseOpts: {
      style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], backgroundColor: ["transparent"],
      top: ["straight02"], hairColor: ["724133"], skinColor: ["ffdbb4"],
      facialHairProbability: 0,
      eyes: ["default"], eyebrows: ["flatNatural"], mouth: ["serious"]
    },
    varOpts: { eyes: ["happy"], mouth: ["smile"] }
  },
  {
    name: "Emre_Koc",
    baseOpts: {
      style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], backgroundColor: ["transparent"],
      top: ["sides"], hairColor: ["e8e1e1"], skinColor: ["d08b5b"],
      facialHair: ["beardLight"], facialHairColor: ["e8e1e1"], facialHairProbability: 100,
      eyes: ["squint"], eyebrows: ["sadConcernedNatural"], mouth: ["grimace"]
    },
    varOpts: { eyes: ["surprised"], mouth: ["disbelief"] }
  },
  {
    name: "Fatih_Dogan",
    baseOpts: {
      style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], backgroundColor: ["transparent"],
      top: ["shortWaved"], hairColor: ["2c1b18"], skinColor: ["ffdbb4"],
      facialHairProbability: 0,
      eyes: ["default"], eyebrows: ["raisedExcitedNatural"], mouth: ["smile"]
    },
    varOpts: { eyes: ["wink"], mouth: ["twinkle"] }
  },
  {
    name: "Gul_Arslan",
    baseOpts: {
      style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], backgroundColor: ["transparent"],
      top: ["bun"], hairColor: ["4a312c"], skinColor: ["ffdbb4"],
      facialHairProbability: 0,
      eyes: ["surprised"], eyebrows: ["defaultNatural"], mouth: ["default"]
    },
    varOpts: { eyes: ["cry"], mouth: ["sad"] }
  },
  {
    name: "Mehmet_Kaya",
    baseOpts: {
      style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], backgroundColor: ["transparent"],
      top: ["theCaesarAndSidePart"], hairColor: ["2c1b18"], skinColor: ["edb98a"],
      facialHairProbability: 0,
      eyes: ["squint"], eyebrows: ["angryNatural"], mouth: ["serious"]
    },
    varOpts: { eyebrows: ["raisedExcited"], eyes: ["happy"], mouth: ["smile"] }
  },
  {
    name: "Osman_Yildiz",
    baseOpts: {
      style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], backgroundColor: ["transparent"],
      top: ["frizzle"], hairColor: ["2c1b18"], skinColor: ["ae5d29"],
      facialHair: ["moustacheMagnum"], facialHairColor: ["4a312c"], facialHairProbability: 100,
      eyes: ["cry"], eyebrows: ["sadConcernedNatural"], mouth: ["grimace"]
    },
    varOpts: { eyes: ["default"], mouth: ["sad"] }
  },
  {
    name: "Pinar_Cetin",
    baseOpts: {
      style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], backgroundColor: ["transparent"],
      top: ["bun"], hairColor: ["2c1b18"], skinColor: ["ffdbb4"],
      facialHairProbability: 0,
      eyes: ["squint"], eyebrows: ["angryNatural"], mouth: ["serious"]
    },
    varOpts: { eyes: ["eyeRoll"], mouth: ["disbelief"] }
  },
  {
    name: "Serdar_Polat",
    baseOpts: {
      style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], backgroundColor: ["transparent"],
      top: ["shaggy"], hairColor: ["4a312c"], skinColor: ["ffdbb4"],
      facialHair: ["beardLight"], facialHairColor: ["4a312c"], facialHairProbability: 100,
      eyes: ["default"], eyebrows: ["raisedExcitedNatural"], mouth: ["concerned"]
    },
    varOpts: { eyes: ["happy"], mouth: ["smile"] }
  },
  {
    name: "Serkan_Yilmaz",
    baseOpts: {
      style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], backgroundColor: ["transparent"],
      top: ["shortCurly"], hairColor: ["2c1b18"], skinColor: ["edb98a"],
      facialHairProbability: 0,
      eyes: ["happy"], eyebrows: ["defaultNatural"], mouth: ["smile"]
    },
    varOpts: { eyes: ["winkWacky"], mouth: ["tongue"] }
  },
  {
    name: "Zeynep_Celik",
    baseOpts: {
      style: ["circle"], clothing: ["blazerAndShirt"], clothesColor: ["25557c"], backgroundColor: ["transparent"],
      top: ["longButNotTooLong"], hairColor: ["4a312c"], skinColor: ["ffdbb4"],
      facialHairProbability: 0,
      eyes: ["cry"], eyebrows: ["sadConcernedNatural"], mouth: ["default"]
    },
    varOpts: { eyes: ["happy"], mouth: ["smile"] }
  }
];

let count = 0;
for (const char of charsData) {
  // Generate Base
  const avatarBase = createAvatar(avataaars, { seed: char.name + "_base", size: 512, ...char.baseOpts });
  fs.writeFileSync(path.join(outDir, `${char.name}_base.svg`), avatarBase.toString());
  count++;

  // Generate Variant
  const mergedOpts = { ...char.baseOpts, ...char.varOpts };
  const avatarVar = createAvatar(avataaars, { seed: char.name + "_var", size: 512, ...mergedOpts });
  fs.writeFileSync(path.join(outDir, `${char.name}_variant.svg`), avatarVar.toString());
  count++;
}

// Generate 2 extra random characters to reach exactly 22 outputs!
const extraChars = [
  {
    name: "Extra_Random_1",
    baseOpts: {
      style: ["circle"], clothing: ["blazerAndSweater"], clothesColor: ["25557c"], backgroundColor: ["transparent"],
      top: ["dreads01"], hairColor: ["2c1b18"], skinColor: ["ae5d29"],
      facialHairProbability: 0,
      eyes: ["happy"], eyebrows: ["defaultNatural"], mouth: ["smile"]
    }
  },
  {
    name: "Extra_Random_2",
    baseOpts: {
      style: ["circle"], clothing: ["collarAndSweater"], clothesColor: ["3c4f5c"], backgroundColor: ["transparent"],
      top: ["bob"], hairColor: ["e8e1e1"], skinColor: ["ffdbb4"],
      facialHairProbability: 0,
      eyes: ["squint"], eyebrows: ["raisedExcited"], mouth: ["serious"]
    }
  }
];

for (const char of extraChars) {
  const avatar = createAvatar(avataaars, { seed: char.name, size: 512, ...char.baseOpts });
  fs.writeFileSync(path.join(outDir, `${char.name}.svg`), avatar.toString());
  count++;
}

console.log(`Generated ${count} characters in ${outDir}`);
