import React, { useState, useEffect } from 'react';
import type { Category, GameConfig, GameMode, ActiveSession, CategorySelectionMode } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { isMedicalCategory } from '../types';

interface SetupScreenProps {
  categories: Category[];
  onStartRound: (config: GameConfig) => void;
  activeSession?: ActiveSession | null;
  nonMedicinerMode: boolean;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ 
  categories, 
  onStartRound, 
  activeSession,
  nonMedicinerMode
}) => {
  const [selectionMode, setSelectionMode] = useState<CategorySelectionMode>(() => {
    return activeSession ? activeSession.selectionMode : 'SINGLE';
  });

  const displayedCategories = nonMedicinerMode 
    ? categories.filter(c => !isMedicalCategory(c))
    : categories;

  // Select first category as default if available
  const [selectedCategoryId, setSelectedCategoryId] = useState(() => {
    if (activeSession && activeSession.selectionMode === 'SINGLE' && activeSession.config.categoryIds.length > 0) {
      const activeId = activeSession.config.categoryIds[0];
      if (displayedCategories.some(c => c.id === activeId)) {
        return activeId;
      }
    }
    return displayedCategories.length > 0 ? displayedCategories[0].id : '';
  });
  
  // Selected categories for multi-select
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(() => {
    if (activeSession && activeSession.selectionMode === 'MULTI') {
      return activeSession.config.categoryIds.filter(id => 
        displayedCategories.some(c => c.id === id)
      );
    }
    return [];
  });

  // Initial list of players
  const [playerNames, setPlayerNames] = useLocalStorage<string[]>(
    'impostorFizzi.players',
    ['Jogador 1', 'Jogador 2', 'Jogador 3']
  );
  const [impostorsCount, setImpostorsCount] = useState(() => {
    return activeSession ? activeSession.config.impostorsCount : 1;
  });
  const [gameMode, setGameMode] = useState<GameMode>(() => {
    return activeSession ? activeSession.config.gameMode : 'CLASSIC';
  });

  const selectedCategory = displayedCategories.find((c) => c.id === selectedCategoryId);

  const handleToggleCategory = (catId: string) => {
    if (selectedCategoryIds.includes(catId)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== catId));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, catId]);
    }
  };

  const handleSelectAll = () => {
    setSelectedCategoryIds(displayedCategories.map(c => c.id));
  };

  const handleClearSelection = () => {
    setSelectedCategoryIds([]);
  };

  const totalWords = selectionMode === 'SINGLE' 
    ? (selectedCategory?.words.length || 0)
    : selectionMode === 'MULTI'
      ? displayedCategories
          .filter(c => selectedCategoryIds.includes(c.id))
          .reduce((sum, c) => sum + c.words.length, 0)
      : displayedCategories
          .reduce((sum, c) => sum + c.words.length, 0);

  // Sync impostors count if players list shrinks
  useEffect(() => {
    if (impostorsCount >= playerNames.length) {
      setImpostorsCount(Math.max(1, playerNames.length - 1));
    }
  }, [playerNames.length, impostorsCount]);

  // PLAYER LIST MANIPULATIONS
  const handlePlayerNameChange = (index: number, val: string) => {
    const updated = [...playerNames];
    updated[index] = val;
    setPlayerNames(updated);
  };

  const handleAddPlayer = () => {
    if (playerNames.length >= 20) return;
    setPlayerNames([...playerNames, `Jogador ${playerNames.length + 1}`]);
  };

  const handleRemovePlayer = (index: number) => {
    if (playerNames.length <= 3) return;
    const updated = playerNames.filter((_, idx) => idx !== index);
    setPlayerNames(updated);
  };

  const handleClearSavedPlayers = () => {
    if (window.confirm('Tem certeza que deseja apagar os jogadores salvos?')) {
      localStorage.removeItem('impostorFizzi.players');
      setPlayerNames(['Jogador 1', 'Jogador 2', 'Jogador 3']);
    }
  };

  // IMPOSTORS COUNT ADJUSTMENT
  const handleAdjustImpostors = (delta: number) => {
    const targetValue = impostorsCount + delta;
    if (targetValue >= 1 && targetValue < playerNames.length) {
      setImpostorsCount(targetValue);
    }
  };

  // ROUND FORM SUBMIT VALIDATION
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalCategoryIds: string[] = [];

    if (selectionMode === 'SINGLE') {
      if (!selectedCategoryId) {
        alert('Por favor, selecione uma categoria.');
        return;
      }
      const cat = displayedCategories.find((c) => c.id === selectedCategoryId);
      if (!cat || cat.words.length === 0) {
        alert('A categoria selecionada não possui palavras! Por favor, escolha outra.');
        return;
      }
      finalCategoryIds = [selectedCategoryId];
    } else if (selectionMode === 'MULTI') {
      if (selectedCategoryIds.length === 0) {
        alert('Por favor, selecione pelo menos uma categoria.');
        return;
      }
      const nonEmptySelected = displayedCategories.filter(c => selectedCategoryIds.includes(c.id) && c.words.length > 0);
      if (nonEmptySelected.length === 0) {
        alert('Nenhuma das categorias selecionadas possui palavras! Adicione palavras a elas primeiro.');
        return;
      }
      finalCategoryIds = selectedCategoryIds;
    } else {
      const nonEmptyAvailable = displayedCategories.filter(c => c.words && c.words.length > 0);
      if (nonEmptyAvailable.length === 0) {
        alert('Nenhuma categoria disponível para sorteio. Desative o modo Não mediciner ou adicione categorias não médicas.');
        return;
      }
      finalCategoryIds = nonEmptyAvailable.map(c => c.id);
    }

    // Clean names and validate
    const cleanedNames = playerNames.map((n) => n.trim());
    
    // Check for empty names
    if (cleanedNames.some((n) => n === '')) {
      alert('Todos os jogadores precisam ter nomes! Preencha os campos vazios.');
      return;
    }

    // Validate size boundaries
    if (cleanedNames.length < 3 || cleanedNames.length > 20) {
      alert('O jogo requer entre 3 e 20 jogadores.');
      return;
    }

    // Validate impostor boundaries
    if (impostorsCount < 1 || impostorsCount >= cleanedNames.length) {
      alert('Número de impostores inválido. Deve haver pelo menos 1 impostor e menos impostores do que jogadores.');
      return;
    }

    // Pass configuration up to trigger round launch
    onStartRound({
      categoryIds: finalCategoryIds,
      players: cleanedNames,
      impostorsCount,
      gameMode,
      selectionMode,
    });
  };

  return (
    <div className="screen-container">
      <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'white' }}>Configurar Rodada</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        
        {/* Category Pick */}
        <div className="card-glass">
          <label className="label-title">Coleção de Palavras</label>
          
          {/* Mode Selector */}
          <div className="tabs-container" style={{ marginBottom: '16px' }}>
            <button
              type="button"
              className={`tab-btn ${selectionMode === 'SINGLE' ? 'active' : ''}`}
              style={{ padding: '8px 12px', fontSize: '13px' }}
              onClick={() => setSelectionMode('SINGLE')}
            >
              Categoria Única
            </button>
            <button
              type="button"
              className={`tab-btn ${selectionMode === 'MULTI' ? 'active' : ''}`}
              style={{ padding: '8px 12px', fontSize: '13px' }}
              onClick={() => setSelectionMode('MULTI')}
            >
              Múltiplas ({selectedCategoryIds.length})
            </button>
            <button
              type="button"
              className={`tab-btn ${selectionMode === 'RANDOM' ? 'active' : ''}`}
              style={{ padding: '8px 12px', fontSize: '13px' }}
              onClick={() => setSelectionMode('RANDOM')}
            >
              Categoria Aleatória
            </button>
          </div>

          {selectionMode === 'SINGLE' && (
            <div>
              <select
                className="input-text"
                style={{ appearance: 'none', background: 'rgba(255,255,255,0.05) url("data:image/svg+xml;utf8,<svg fill=\'white\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat right 16px center' }}
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <option value="" disabled style={{ backgroundColor: '#12141c', color: 'white' }}>Selecione uma categoria</option>
                {displayedCategories.map((c) => (
                  <option key={c.id} value={c.id} style={{ backgroundColor: '#12141c', color: 'white' }}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectionMode === 'MULTI' && (
            <div>
              {/* Quick action buttons */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '12px', flex: 1, minHeight: '36px' }}
                  onClick={handleSelectAll}
                >
                  ☑ Selecionar todas
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '12px', flex: 1, minHeight: '36px' }}
                  onClick={handleClearSelection}
                >
                  ☒ Limpar seleção
                </button>
              </div>

              {/* Scrollable list of categories with checkboxes */}
              <div style={{ 
                maxHeight: '180px', 
                overflowY: 'auto', 
                paddingRight: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                {displayedCategories.map((c) => {
                  const isChecked = selectedCategoryIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => handleToggleCategory(c.id)}
                      className={`list-item ${isChecked ? 'selected' : ''}`}
                      style={{ 
                        margin: 0, 
                        padding: '10px 14px', 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderRadius: '12px',
                        border: isChecked ? '1px solid var(--secondary-cyan)' : '1px solid rgba(255, 255, 255, 0.05)'
                      }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>{c.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{c.words.length} pal.</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}} // handled by parent onClick
                          style={{
                            width: '16px',
                            height: '16px',
                            accentColor: 'var(--secondary-cyan)',
                            cursor: 'pointer'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectionMode === 'RANDOM' && (
            <div style={{
              padding: '16px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <p style={{ fontSize: '13.5px', color: 'var(--text-main)', margin: 0, fontWeight: '500' }}>
                🎲 Uma categoria será sorteada automaticamente no início da rodada.
              </p>
              {nonMedicinerMode && (
                <p style={{ fontSize: '12px', color: '#ff4d4d', margin: 0, fontWeight: '600' }}>
                  🚫 Modo Não mediciner ativo: categorias médicas não entram no sorteio.
                </p>
              )}
            </div>
          )}

          {/* Words and Categories Summary */}
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Total de palavras disponíveis:</span>
            <strong style={{ color: 'var(--secondary-cyan)' }}>{totalWords}</strong>
          </div>
        </div>

        {/* Game Mode Pick */}
        <div className="card-glass">
          <label className="label-title">Modo de Jogo</label>
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 12px',
                borderColor: gameMode === 'CLASSIC' ? 'var(--secondary-cyan)' : 'var(--surface-border)',
                background: gameMode === 'CLASSIC' ? 'rgba(0, 229, 255, 0.06)' : 'var(--surface)',
                color: gameMode === 'CLASSIC' ? 'var(--secondary-cyan)' : 'var(--text-main)',
                gap: '6px',
                borderRadius: '16px'
              }}
              onClick={() => setGameMode('CLASSIC')}
            >
              <span style={{ fontSize: '20px' }}>👤</span>
              <strong>Clássico</strong>
            </button>
            <button
              type="button"
              className="btn-secondary"
              style={{
                flex: 1,
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 12px',
                borderColor: gameMode === 'HINT' ? 'var(--secondary-cyan)' : 'var(--surface-border)',
                background: gameMode === 'HINT' ? 'rgba(0, 229, 255, 0.06)' : 'var(--surface)',
                color: gameMode === 'HINT' ? 'var(--secondary-cyan)' : 'var(--text-main)',
                gap: '6px',
                borderRadius: '16px'
              }}
              onClick={() => setGameMode('HINT')}
            >
              <span style={{ fontSize: '20px' }}>💡</span>
              <strong>Com Dica</strong>
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '12.5px', marginTop: '12px', lineHeight: '1.45', textAlign: 'center' }}>
            {gameMode === 'CLASSIC' 
              ? 'Clássico: O impostor não recebe nenhuma pista.' 
              : 'Com dica: O impostor recebe uma pista sutil sobre a palavra, sem revelá-la.'
            }
          </p>
        </div>

        {/* Player Names Setup */}
        <div className="card-glass" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <label className="label-title" style={{ margin: 0 }}>Jogadores ({playerNames.length})</label>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Mín: 3 | Máx: 20</span>
          </div>

          <div className="players-scroll" style={{ flex: 1 }}>
            {playerNames.map((name, index) => (
              <div key={index} className="player-row">
                <div className="player-index">{index + 1}</div>
                <input
                  type="text"
                  placeholder={`Jogador ${index + 1}`}
                  value={name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  maxLength={15}
                />
                {playerNames.length > 3 && (
                  <button
                    type="button"
                    className="remove-player-btn"
                    onClick={() => handleRemovePlayer(index)}
                    title="Remover jogador"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleAddPlayer}
            disabled={playerNames.length >= 20}
            style={{ marginTop: '14px', padding: '10px 16px', fontSize: '14px', opacity: playerNames.length >= 20 ? 0.5 : 1 }}
          >
            + Adicionar Jogador
          </button>

          <button
            type="button"
            onClick={handleClearSavedPlayers}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '12px',
              cursor: 'pointer',
              marginTop: '12px',
              textDecoration: 'underline',
              textAlign: 'center',
              display: 'block',
              width: '100%',
              opacity: 0.7
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
          >
            Limpar jogadores salvos
          </button>
        </div>

        {/* Impostor Adjuster */}
        <div className="card-glass">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label className="label-title" style={{ margin: 0 }}>Quantidade de Impostores</label>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Menos que o total de jogadores</span>
          </div>
          
          <div className="numeric-controls">
            <button
              type="button"
              className="numeric-btn"
              onClick={() => handleAdjustImpostors(-1)}
              disabled={impostorsCount <= 1}
              style={{ opacity: impostorsCount <= 1 ? 0.3 : 1 }}
            >
              -
            </button>
            <div className="numeric-value">
              {impostorsCount}
            </div>
            <button
              type="button"
              className="numeric-btn"
              onClick={() => handleAdjustImpostors(1)}
              disabled={impostorsCount >= playerNames.length - 1}
              style={{ opacity: impostorsCount >= playerNames.length - 1 ? 0.3 : 1 }}
            >
              +
            </button>
          </div>
        </div>

        {/* Launch Button */}
        <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
          🚀 Iniciar Jogo
        </button>

      </form>
    </div>
  );
};
