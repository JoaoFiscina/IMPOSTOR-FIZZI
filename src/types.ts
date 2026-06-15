export interface WordObject {
  text: string;
  hint?: string;
}

export interface Category {
  id: string;
  name: string;
  words: WordObject[];
  isMedical?: boolean;
}

export interface Player {
  id: string;
  name: string;
  isImpostor: boolean;
}

export type GameScreen = 
  | 'HOME' 
  | 'CATEGORIES' 
  | 'IMPORT' 
  | 'SETUP' 
  | 'REVEAL_PASS' 
  | 'REVEAL_SHOW' 
  | 'GAMEPLAY' 
  | 'SETTINGS';

export interface CooldownItem {
  word: string;
  timestamp: number; // Date.now() when picked
}

// Map from categoryName -> list of cooldown items
export interface CooldownHistory {
  [categoryName: string]: CooldownItem[];
}

export type GameMode = 'CLASSIC' | 'HINT';

export interface GameConfig {
  categoryIds: string[];
  players: string[];
  impostorsCount: number;
  gameMode: GameMode;
  selectionMode?: 'SINGLE' | 'MULTI';
}

export interface ActiveSession {
  config: GameConfig;
  selectionMode: 'SINGLE' | 'MULTI';
  previousImpostors: string[]; // names of previous impostors
  previousStarters: string[];  // names of previous starters
  roundsPlayed: number;
}

export const isMedicalCategory = (category: { name: string; isMedical?: boolean }): boolean => {
  if (category.isMedical) return true;
  
  const nameLower = category.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // strip accents
  
  const medicalKeywords = [
    'anatomia',
    'doenca',
    'emergencia',
    'cirurgia',
    'diagnostico',
    'medicamento',
    'medicina',
    'medico',
    'medica',
    'hospital',
    'clinica',
    'farmacologia',
    'fisiologia',
    'patologia',
    'neurologia',
    'cardiologia',
    'pediatria',
    'ortopedia',
    'ginecologia',
    'obstetricia',
    'infectologia',
    'radiologia'
  ];

  return medicalKeywords.some(keyword => nameLower.includes(keyword));
};
