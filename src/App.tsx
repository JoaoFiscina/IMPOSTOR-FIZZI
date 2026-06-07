import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { INITIAL_CATEGORIES } from './initialData';
import type { Category, Player, GameScreen, CooldownHistory, GameConfig } from './types';

// Component Screens
import { Header } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { CategoriesScreen } from './components/CategoriesScreen';
import { ImportScreen } from './components/ImportScreen';
import { SetupScreen } from './components/SetupScreen';
import { RevealScreen } from './components/RevealScreen';
import { GamePlayScreen } from './components/GamePlayScreen';

interface RoundState {
  players: Player[];
  selectedCategory: Category;
  secretWord: string;
  starterName: string;
}

function App() {
  const [screen, setScreen] = useState<GameScreen>('HOME');
  
  // Local storage persisted state
  const [categories, setCategories] = useLocalStorage<Category[]>('impostor_fizzi_categories', INITIAL_CATEGORIES);
  const [history, setHistory] = useLocalStorage<CooldownHistory>('impostor_fizzi_cooldowns', {});
  
  // Game running state
  const [roundState, setRoundState] = useState<RoundState | null>(null);

  // BACK BUTTON LOGIC
  const handleBack = () => {
    if (screen === 'CATEGORIES' || screen === 'IMPORT' || screen === 'SETUP') {
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

    // Filter words that haven't been used in the last 2 hours
    const availableWords = category.words.filter((word) => {
      const cooldownItem = categoryCooldowns.find(
        (item) => item.word.toLowerCase() === word.toLowerCase()
      );
      // Available if no record or record is older than 2 hours
      return !cooldownItem || cooldownItem.timestamp < twoHoursAgo;
    });

    let selectedWord = '';

    if (availableWords.length > 0) {
      // Pick random from available words
      const randIdx = Math.floor(Math.random() * availableWords.length);
      selectedWord = availableWords[randIdx];
    } else {
      // All words are in cooldown! Show warning and pick the least recently used
      alert(
        'Todas as palavras desta categoria foram jogadas nas últimas 2 horas. A palavra menos recente foi repetida para esta rodada.'
      );

      const categoryWordsSet = new Set(category.words.map((w) => w.toLowerCase()));
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
        selectedWord =
          category.words.find((w) => w.toLowerCase() === oldestItem.word.toLowerCase()) ||
          oldestItem.word;
      } else {
        // Fallback safety
        const randIdx = Math.floor(Math.random() * category.words.length);
        selectedWord = category.words[randIdx];
      }
    }

    // Save/Update cooldown history
    const updatedCategoryCooldowns = categoryCooldowns.filter(
      (item) => item.word.toLowerCase() !== selectedWord.toLowerCase()
    );
    updatedCategoryCooldowns.push({
      word: selectedWord,
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
      secretWord: selectedWord,
      starterName,
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

      {(screen === 'REVEAL_PASS' || screen === 'REVEAL_SHOW') && roundState && (
        <RevealScreen
          players={roundState.players}
          secretWord={roundState.secretWord}
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
