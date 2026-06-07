export interface WordObject {
  text: string;
  hint?: string;
}

export interface Category {
  id: string;
  name: string;
  words: WordObject[];
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
}
