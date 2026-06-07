export interface Category {
  id: string;
  name: string;
  words: string[];
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
  | 'RESULTS';

export interface CooldownItem {
  word: string;
  timestamp: number; // Date.now() when picked
}

// Map from categoryName -> list of cooldown items
export interface CooldownHistory {
  [categoryName: string]: CooldownItem[];
}

export interface GameConfig {
  categoryId: string;
  players: string[];
  impostorsCount: number;
}
