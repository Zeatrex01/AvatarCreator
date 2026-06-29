export const SCHEMA = {
  top: ["hat", "hijab", "turban", "winterHat1", "winterHat02", "winterHat03", "winterHat04", "bob", "bun", "curly", "curvy", "dreads", "frida", "fro", "froBand", "longButNotTooLong", "miaWallace", "shavedSides", "straight02", "straight01", "straightAndStrand", "dreads01", "dreads02", "frizzle", "shaggy", "shaggyMullet", "shortCurly", "shortFlat", "shortRound", "shortWaved", "sides", "theCaesar", "theCaesarAndSidePart", "bigHair"],
  accessories: ["kurt", "prescription01", "prescription02", "round", "sunglasses", "wayfarers", "eyepatch"],
  clothing: ["blazerAndShirt", "blazerAndSweater", "collarAndSweater", "graphicShirt", "hoodie", "overall", "shirtCrewNeck", "shirtScoopNeck", "shirtVNeck"],
  clothingGraphic: ["bat", "bear", "cumbia", "deer", "diamond", "hola", "pizza", "resist", "skull", "skullOutline"],
  eyes: ["closed", "cry", "default", "eyeRoll", "happy", "hearts", "side", "squint", "surprised", "winkWacky", "wink", "xDizzy"],
  eyebrows: ["angryNatural", "defaultNatural", "flatNatural", "frownNatural", "raisedExcitedNatural", "sadConcernedNatural", "unibrowNatural", "upDownNatural", "angry", "default", "raisedExcited", "sadConcerned", "upDown"],
  mouth: ["concerned", "default", "disbelief", "eating", "grimace", "sad", "screamOpen", "serious", "smile", "tongue", "twinkle", "vomit"],
  facialHair: ["beardLight", "beardMajestic", "beardMedium", "moustacheFancy", "moustacheMagnum"],
};

export const COLORS = {
  skinColor: ["614335", "d08b5b", "ae5d29", "edb98a", "ffdbb4", "fd9841", "f8d25c"],
  hairColor: ["a55728", "2c1b18", "b58143", "d6b370", "724133", "4a312c", "f59797", "ecdcbf", "c93305", "e8e1e1"],
  facialHairColor: ["a55728", "2c1b18", "b58143", "d6b370", "724133", "4a312c", "f59797", "ecdcbf", "c93305", "e8e1e1"],
  clothesColor: ["262e33", "65c9ff", "5199e4", "25557c", "e6e6e6", "929598", "3c4f5c", "b1e2ff", "a7ffc4", "ffafb9", "ffffb1", "ff488e", "ff5c5c", "ffffff"],
  accessoriesColor: ["262e33", "65c9ff", "5199e4", "25557c", "e6e6e6", "929598", "3c4f5c", "b1e2ff", "a7ffc4", "ffafb9", "ffffb1", "ff488e", "ff5c5c", "ffffff"],
  backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf", "65c9ff", "transparent"]
};

export const COLOR_LABELS = {
  skinColor: "Skin",
  hairColor: "Hair Color",
  facialHairColor: "Facial Hair Color",
  clothesColor: "Clothes Color",
  accessoriesColor: "Accessories Color",
  backgroundColor: "Background"
};

export const MALE_HAIR = ["dreads01", "dreads02", "frizzle", "shaggy", "shaggyMullet", "shortCurly", "shortFlat", "shortRound", "shortWaved", "sides", "theCaesar", "theCaesarAndSidePart"];
export const FEMALE_HAIR = ["bob", "bun", "curly", "curvy", "dreads", "frida", "fro", "froBand", "longButNotTooLong", "miaWallace", "shavedSides", "straight02", "straight01", "straightAndStrand", "bigHair", "hijab"];
export const UNISEX_HAIR = ["hat", "turban", "winterHat1", "winterHat02", "winterHat03", "winterHat04"];

export const TABS = [
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
