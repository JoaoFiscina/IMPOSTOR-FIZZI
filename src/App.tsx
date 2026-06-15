import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_CATEGORIES } from './initialData';
import type { Category, Player, GameScreen, CooldownHistory, GameConfig, GameMode, WordObject, ActiveSession } from './types';
import { isMedicalCategory } from './types';

// Component Screens
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { CategoriesScreen } from './components/CategoriesScreen';
import { ImportScreen } from './components/ImportScreen';
import { SetupScreen } from './components/SetupScreen';
import { RevealScreen } from './components/RevealScreen';
import { GamePlayScreen } from './components/GamePlayScreen';
import { SettingsScreen } from './components/SettingsScreen';

interface RoundState {
  players: Player[];
  selectedCategory: Category;
  secretWord: string;
  secretWordHint?: string;
  starterName: string;
  gameMode: GameMode;
}

// Normalization Migration Helper: Handles conversion of string categories or fields into WordObjects
const normalizeCategories = (cats: any[]): Category[] => {
  return cats.map((cat) => ({
    ...cat,
    isMedical: cat.isMedical !== undefined ? cat.isMedical : isMedicalCategory(cat),
    words: (cat.words || []).map((w: any) => {
      if (typeof w === 'string') {
        return { text: w };
      }
      if (w && typeof w === 'object' && 'text' in w) {
        return w as WordObject;
      }
      return { text: String(w) };
    }),
  }));
};

// Robust random generator using crypto.getRandomValues with Math.random fallback
const getRandomFloat = (): number => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / 0xffffffff;
  }
  return Math.random();
};

// Weighted recency calculation for impostors
const getImpostorWeight = (playerName: string, previousImpostors: string[]) => {
  if (previousImpostors.length === 0) return 1.0;
  
  const lastIndex = previousImpostors.lastIndexOf(playerName);
  if (lastIndex === -1) return 1.0;
  
  const distance = previousImpostors.length - 1 - lastIndex;
  
  if (distance === 0) return 0.1;
  if (distance === 1) return 0.3;
  if (distance === 2) return 0.6;
  return 1.0;
};

// Weighted recency calculation for starters
const getStarterWeight = (playerName: string, previousStarters: string[]) => {
  if (previousStarters.length === 0) return 1.0;
  
  const lastIndex = previousStarters.lastIndexOf(playerName);
  if (lastIndex === -1) return 1.0;
  
  const distance = previousStarters.length - 1 - lastIndex;
  
  if (distance === 0) return 0.1;
  if (distance === 1) return 0.3;
  if (distance === 2) return 0.6;
  return 1.0;
};

// Weighted selection without replacement for impostors
const selectImpostors = (players: string[], count: number, previousImpostors: string[]): string[] => {
  const candidates = players.map(name => ({
    name,
    weight: getImpostorWeight(name, previousImpostors)
  }));
  
  const selected: string[] = [];
  
  for (let i = 0; i < count; i++) {
    if (candidates.length === 0) break;
    
    const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
    if (totalWeight === 0) {
      const randIdx = Math.floor(getRandomFloat() * candidates.length);
      selected.push(candidates[randIdx].name);
      candidates.splice(randIdx, 1);
      continue;
    }
    
    const r = getRandomFloat() * totalWeight;
    let accum = 0;
    let selectedIdx = 0;
    
    for (let j = 0; j < candidates.length; j++) {
      accum += candidates[j].weight;
      if (accum >= r) {
        selectedIdx = j;
        break;
      }
    }
    
    selected.push(candidates[selectedIdx].name);
    candidates.splice(selectedIdx, 1);
  }
  
  return selected;
};

// Weighted selection for starter
const selectStarter = (players: string[], previousStarters: string[]): string => {
  if (players.length === 0) return '';
  
  const candidates = players.map(name => ({
    name,
    weight: getStarterWeight(name, previousStarters)
  }));
  
  const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight === 0) {
    const randIdx = Math.floor(getRandomFloat() * players.length);
    return players[randIdx];
  }
  
  const r = getRandomFloat() * totalWeight;
  let accum = 0;
  for (let i = 0; i < candidates.length; i++) {
    accum += candidates[i].weight;
    if (accum >= r) {
      return candidates[i].name;
    }
  }
  
  return candidates[0].name;
};

function App() {
  const [screen, setScreen] = useState<GameScreen>('HOME');
  
  // Local storage persisted state
  const [rawCategories, setCategories] = useLocalStorage<Category[]>('impostor_fizzi_categories', INITIAL_CATEGORIES);
  const [history, setHistory] = useLocalStorage<CooldownHistory>('impostor_fizzi_cooldowns', {});
  const [activeSession, setActiveSession] = useLocalStorage<ActiveSession | null>('impostorFizzi.activeSession', null);
  const [nonMedicinerMode, setNonMedicinerMode] = useLocalStorage<boolean>('impostorFizzi.nonMedicinerMode', false);
  
  // Normalize loaded categories
  const categories = normalizeCategories(rawCategories);

  // Toggle mode with session check
  const handleToggleNonMediciner = () => {
    const newMode = !nonMedicinerMode;
    
    if (newMode && activeSession) {
      const sessionCategories = categories.filter((c) => activeSession.config.categoryIds.includes(c.id));
      const hasMedical = sessionCategories.some(isMedicalCategory);
      
      if (hasMedical) {
        const confirmDeactivate = window.confirm(
          "O modo Não mediciner remove categorias médicas da seleção. Deseja continuar?"
        );
        if (!confirmDeactivate) {
          return;
        }
        
        const nonMedicalIds = activeSession.config.categoryIds.filter((id) => {
          const cat = categories.find((c) => c.id === id);
          return cat ? !isMedicalCategory(cat) : false;
        });
        
        if (nonMedicalIds.length === 0) {
          alert("A sessão atual ficou sem nenhuma categoria. Por favor, escolha novas categorias.");
          setActiveSession({
            ...activeSession,
            config: {
              ...activeSession.config,
              categoryIds: []
            }
          });
          setNonMedicinerMode(true);
          setScreen('SETUP');
          return;
        } else {
          setActiveSession({
            ...activeSession,
            config: {
              ...activeSession.config,
              categoryIds: nonMedicalIds
            }
          });
        }
      }
    }
    
    setNonMedicinerMode(newMode);
  };

  // Game running state
  const [roundState, setRoundState] = useState<RoundState | null>(null);

  // BACK BUTTON LOGIC
  const handleBack = () => {
    if (screen === 'CATEGORIES' || screen === 'IMPORT' || screen === 'SETUP' || screen === 'SETTINGS') {
      setScreen('HOME');
    }
  };

  // GAME LAUNCH & WORD SELECTION ENGINE
  const handleStartRound = (config: GameConfig, isNewSession = true) => {
    let finalCategoryIds = config.categoryIds;
    if (nonMedicinerMode) {
      finalCategoryIds = config.categoryIds.filter((id) => {
        const cat = categories.find((c) => c.id === id);
        return cat ? !isMedicalCategory(cat) : false;
      });
    }

    const selectedCategories = categories.filter((c) => finalCategoryIds.includes(c.id));
    if (selectedCategories.length === 0) {
      alert('Erro: Nenhuma categoria selecionada.');
      return;
    }

    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;

    // Collect all candidate words that are not in cooldown in their specific category
    const availableCandidates: { category: Category; wordObj: WordObject }[] = [];

    selectedCategories.forEach((category) => {
      const categoryCooldowns = history[category.name] || [];
      category.words.forEach((wordObj) => {
        const cooldownItem = categoryCooldowns.find(
          (item) => item.word.toLowerCase() === wordObj.text.toLowerCase()
        );
        const isAvailable = !cooldownItem || cooldownItem.timestamp < twoHoursAgo;
        if (isAvailable) {
          availableCandidates.push({ category, wordObj });
        }
      });
    });

    let chosenCategory: Category;
    let selectedWordObj: WordObject = { text: '' };

    if (availableCandidates.length > 0) {
      // Pick random from available candidates using robust getRandomFloat
      const randIdx = Math.floor(getRandomFloat() * availableCandidates.length);
      const chosen = availableCandidates[randIdx];
      chosenCategory = chosen.category;
      selectedWordObj = chosen.wordObj;
    } else {
      // All words are in cooldown! Show warning and pick the least recently used across all selected categories
      alert(
        'Todas as palavras das categorias selecionadas foram jogadas nas últimas 2 horas. A palavra menos recente foi repetida para esta rodada.'
      );

      let oldestTimestamp = Infinity;
      let oldestCandidate: { category: Category; wordObj: WordObject } | null = null;

      selectedCategories.forEach((category) => {
        const categoryCooldowns = history[category.name] || [];
        category.words.forEach((wordObj) => {
          const cooldownItem = categoryCooldowns.find(
            (item) => item.word.toLowerCase() === wordObj.text.toLowerCase()
          );
          const timestamp = cooldownItem ? cooldownItem.timestamp : 0;
          if (timestamp < oldestTimestamp) {
            oldestTimestamp = timestamp;
            oldestCandidate = { category, wordObj };
          }
        });
      });

      if (oldestCandidate) {
        chosenCategory = (oldestCandidate as any).category;
        selectedWordObj = (oldestCandidate as any).wordObj;
      } else {
        // Fallback safety
        const randCatIdx = Math.floor(getRandomFloat() * selectedCategories.length);
        chosenCategory = selectedCategories[randCatIdx];
        const randWordIdx = Math.floor(getRandomFloat() * chosenCategory.words.length);
        selectedWordObj = chosenCategory.words[randWordIdx];
      }
    }

    // Save/Update cooldown history
    const categoryName = chosenCategory.name;
    const categoryCooldowns = history[categoryName] || [];
    const updatedCategoryCooldowns = categoryCooldowns.filter(
      (item) => item.word.toLowerCase() !== selectedWordObj.text.toLowerCase()
    );
    updatedCategoryCooldowns.push({
      word: selectedWordObj.text,
      timestamp: Date.now(),
    });

    setHistory({
      ...history,
      [categoryName]: updatedCategoryCooldowns,
    });

    // Resolve active session
    let currentSession = activeSession;
    if (isNewSession || !currentSession) {
      currentSession = {
        config,
        selectionMode: config.selectionMode || 'SINGLE',
        previousImpostors: [],
        previousStarters: [],
        roundsPlayed: 0
      };
    }

    // Select impostors using weighted randomization
    const impostorNames = selectImpostors(config.players, config.impostorsCount, currentSession.previousImpostors);

    // Select starter using weighted randomization
    const starterName = selectStarter(config.players, currentSession.previousStarters);

    // Update and persist session history
    const updatedSession: ActiveSession = {
      ...currentSession,
      config: {
        ...config,
        categoryIds: finalCategoryIds
      },
      previousImpostors: [...currentSession.previousImpostors, ...impostorNames],
      previousStarters: [...currentSession.previousStarters, starterName],
      roundsPlayed: currentSession.roundsPlayed + 1
    };

    setActiveSession(updatedSession);

    // Populate players list with isImpostor flag
    const preparedPlayers: Player[] = config.players.map((name) => ({
      id: Math.random().toString(36).substring(2, 11),
      name,
      isImpostor: impostorNames.includes(name),
    }));

    // Load Round State
    setRoundState({
      players: preparedPlayers,
      selectedCategory: chosenCategory,
      secretWord: selectedWordObj.text,
      secretWordHint: selectedWordObj.hint,
      starterName,
      gameMode: config.gameMode,
    });

    // Transition to turn-based reveal
    setScreen('REVEAL_PASS');
  };

  const handleNewRoundWithSession = () => {
    if (activeSession) {
      handleStartRound(activeSession.config, false);
    }
  };

  const handleExitSession = () => {
    setActiveSession(null);
    setRoundState(null);
    setScreen('HOME');
  };

  const handleContinueSession = () => {
    if (activeSession) {
      handleStartRound(activeSession.config, false);
    }
  };

  const handleFinishReveal = () => {
    setScreen('GAMEPLAY');
  };

  const handleRestartGame = () => {
    setRoundState(null);
    setScreen('HOME');
  };

  return (
    <>
      <Header currentScreen={screen} onBack={handleBack} />

      {screen === 'HOME' && (
        <HomeScreen 
          onNavigate={setScreen} 
          activeSession={activeSession}
          onContinueSession={handleContinueSession}
          onExitSession={handleExitSession}
          nonMedicinerMode={nonMedicinerMode}
          onToggleNonMediciner={handleToggleNonMediciner}
        />
      )}

      {screen === 'CATEGORIES' && (
        <CategoriesScreen
          categories={categories}
          onUpdateCategories={setCategories}
          nonMedicinerMode={nonMedicinerMode}
        />
      )}

      {screen === 'IMPORT' && (
        <ImportScreen
          categories={categories}
          onUpdateCategories={setCategories}
          onNavigateHome={handleRestartGame}
        />
      )}

      {screen === 'SETUP' && (
        <SetupScreen
          categories={categories}
          onStartRound={(cfg) => handleStartRound(cfg, true)}
          activeSession={activeSession}
          nonMedicinerMode={nonMedicinerMode}
        />
      )}

      {screen === 'SETTINGS' && (
        <SettingsScreen
          categories={categories}
          onUpdateCategories={setCategories}
          onNavigateHome={handleRestartGame}
        />
      )}

      {(screen === 'REVEAL_PASS' || screen === 'REVEAL_SHOW') && roundState && (
        <RevealScreen
          players={roundState.players}
          secretWord={roundState.secretWord}
          secretWordHint={roundState.secretWordHint}
          gameMode={roundState.gameMode}
          categoryName={roundState.selectedCategory.name}
          onFinishReveal={handleFinishReveal}
        />
      )}

      {screen === 'GAMEPLAY' && roundState && (
        <GamePlayScreen
          players={roundState.players}
          selectedCategory={roundState.selectedCategory}
          secretWord={roundState.secretWord}
          starterName={roundState.starterName}
          onRestartGame={handleRestartGame}
          onNewRoundWithSession={handleNewRoundWithSession}
          onExitSession={handleExitSession}
        />
      )}
    </>
  );
}

export default App;
