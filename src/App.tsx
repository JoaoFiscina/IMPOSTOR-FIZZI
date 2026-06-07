import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_CATEGORIES } from './initialData';
import type { Category, Player, GameScreen, CooldownHistory, GameConfig, GameMode, WordObject } from './types';

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

function App() {
  const [screen, setScreen] = useState<GameScreen>('HOME');
  
  // Local storage persisted state
  const [rawCategories, setCategories] = useLocalStorage<Category[]>('impostor_fizzi_categories', INITIAL_CATEGORIES);
  const [history, setHistory] = useLocalStorage<CooldownHistory>('impostor_fizzi_cooldowns', {});
  
  // Normalize loaded categories
  const categories = normalizeCategories(rawCategories);

  // Game running state
  const [roundState, setRoundState] = useState<RoundState | null>(null);

  // BACK BUTTON LOGIC
  const handleBack = () => {
    if (screen === 'CATEGORIES' || screen === 'IMPORT' || screen === 'SETUP' || screen === 'SETTINGS') {
      setScreen('HOME');
    }
  };

  // GAME LAUNCH & WORD SELECTION ENGINE
  const handleStartRound = (config: GameConfig) => {
    const selectedCategories = categories.filter((c) => config.categoryIds.includes(c.id));
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
      // Pick random from available candidates
      const randIdx = Math.floor(Math.random() * availableCandidates.length);
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
        const randCatIdx = Math.floor(Math.random() * selectedCategories.length);
        chosenCategory = selectedCategories[randCatIdx];
        const randWordIdx = Math.floor(Math.random() * chosenCategory.words.length);
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

    // Populate players list
    const preparedPlayers: Player[] = config.players.map((name) => ({
      id: Math.random().toString(36).substring(2, 11),
      name,
      isImpostor: false,
    }));

    // Choose impostors indices
    const impostorIndices = new Set<number>();
    while (impostorIndices.size < config.impostorsCount) {
      const randIdx = Math.floor(Math.random() * preparedPlayers.length);
      impostorIndices.add(randIdx);
    }

    // Assign impostors
    impostorIndices.forEach((idx) => {
      preparedPlayers[idx].isImpostor = true;
    });

    // Pick a random starter player
    const randStartIdx = Math.floor(Math.random() * preparedPlayers.length);
    const starterName = preparedPlayers[randStartIdx].name;

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
        <HomeScreen onNavigate={setScreen} />
      )}

      {screen === 'CATEGORIES' && (
        <CategoriesScreen
          categories={categories}
          onUpdateCategories={setCategories}
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
          onStartRound={handleStartRound}
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
        />
      )}
    </>
  );
}

export default App;
