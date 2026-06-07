import React, { useState, useEffect } from 'react';
import type { Category, GameConfig, GameMode } from '../types';

interface SetupScreenProps {
  categories: Category[];
  onStartRound: (config: GameConfig) => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ categories, onStartRound }) => {
  // Select first category as default if available
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    categories.length > 0 ? categories[0].id : ''
  );

  // Initial list of players
  const [playerNames, setPlayerNames] = useState<string[]>(['Jogador 1', 'Jogador 2', 'Jogador 3']);
  const [impostorsCount, setImpostorsCount] = useState(1);
  const [gameMode, setGameMode] = useState<GameMode>('CLASSIC');

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

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

    if (!selectedCategoryId) {
      alert('Por favor, crie e selecione uma categoria primeiro.');
      return;
    }

    if (!selectedCategory || selectedCategory.words.length === 0) {
      alert('A categoria selecionada não possui nenhuma palavra! Por favor, adicione palavras ou escolha outra categoria.');
      return;
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
      categoryId: selectedCategoryId,
      players: cleanedNames,
      impostorsCount,
      gameMode,
    });
  };

  return (
    <div className="screen-container">
      <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'white' }}>Configurar Rodada</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        
        {/* Category Pick */}
        <div className="card-glass">
          <label className="label-title">Coleção de Palavras</label>
          <select
            className="input-text"
            style={{ appearance: 'none', background: 'rgba(255,255,255,0.05) url("data:image/svg+xml;utf8,<svg fill=\'white\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>") no-repeat right 16px center' }}
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id} style={{ backgroundColor: '#12141c', color: 'white' }}>
                {c.name}
              </option>
            ))}
          </select>
          {selectedCategory && (
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Palavras nesta categoria:</span>
              <strong style={{ color: 'var(--secondary-cyan)' }}>{selectedCategory.words.length}</strong>
            </div>
          )}
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
