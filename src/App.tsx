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
    const category = categories.find((c) => c.id === config.categoryId);
    if (!category || category.words.length === 0) {
      alert('Erro: Categoria não encontrada ou vazia.');
      return;
    }

    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    const categoryName = category.name;
    const categoryCooldowns = history[categoryName] || [];

    // Filter words that haven't been used in the last 2 hours (comparing text property)
    const availableWords = category.words.filter((wordObj) => {
      const cooldownItem = categoryCooldowns.find(
        (item) => item.word.toLowerCase() === wordObj.text.toLowerCase()
      );
      // Available if no record or record is older than 2 hours
      return !cooldownItem || cooldownItem.timestamp < twoHoursAgo;
    });

    let selectedWordObj: WordObject = { text: '' };

    if (availableWords.length > 0) {
      // Pick random from available words
      const randIdx = Math.floor(Math.random() * availableWords.length);
      selectedWordObj = availableWords[randIdx];
    } else {
      // All words are in cooldown! Show warning and pick the least recently used
      alert(
        'Todas as palavras desta categoria foram jogadas nas últimas 2 horas. A palavra menos recente foi repetida para esta rodada.'
      );

      const categoryWordsSet = new Set(category.words.map((w) => w.text.toLowerCase()));
      const validHistoryItems = categoryCooldowns.filter((item) =>
        categoryWordsSet.has(item.word.toLowerCase())
      );

      if (validHistoryItems.length > 0) {
        // Find item with minimum timestamp
        let oldestItem = validHistoryItems[0];
        for (const item of validHistoryItems) {
          if (item.timestamp < oldestItem.timestamp) {
            oldestItem = item;
          }
        }
        // Match original spelling
        selectedWordObj =
          category.words.find((w) => w.text.toLowerCase() === oldestItem.word.toLowerCase()) ||
          { text: oldestItem.word };
      } else {
        // Fallback safety
        const randIdx = Math.floor(Math.random() * category.words.length);
        selectedWordObj = category.words[randIdx];
      }
    }

    // Save/Update cooldown history
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
      selectedCategory: category,
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
