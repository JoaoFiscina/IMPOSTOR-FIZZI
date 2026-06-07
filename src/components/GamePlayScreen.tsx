import React, { useState } from 'react';
import type { Player, Category } from '../types';

interface GamePlayScreenProps {
  players: Player[];
  selectedCategory: Category;
  secretWord: string;
  starterName: string;
  onRestartGame: () => void;
}

export const GamePlayScreen: React.FC<GamePlayScreenProps> = ({
  players,
  selectedCategory,
  secretWord,
  starterName,
  onRestartGame,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const impostors = players.filter((p) => p.isImpostor);
  const impostorsList = impostors.map((p) => p.name).join(', ');

  const handleRevealClick = () => {
    setIsConfirming(true);
  };

  const handleConfirmReveal = () => {
    setIsConfirming(false);
    setShowResults(true);
  };

  return (
    <div className="screen-container" style={{ justifyContent: 'space-between' }}>
      
      {/* GAME RUNNING SCREEN */}
      {!showResults ? (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
            
            {/* Header Status */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <div 
                style={{ 
                  display: 'inline-block',
                  background: 'rgba(0, 229, 255, 0.1)', 
                  border: '1px solid rgba(0, 229, 255, 0.2)',
                  color: 'var(--secondary-cyan)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '12px'
                }}
              >
                Partida Iniciada
              </div>
              <h2 style={{ fontSize: '28px', color: 'white' }}>Todos viram seus papéis!</h2>
            </div>

            {/* Starter Player Banner */}
            <div 
              className="card-glass" 
              style={{ 
                border: '2px solid rgba(0, 229, 255, 0.3)', 
                boxShadow: '0 0 20px rgba(0, 229, 255, 0.1)',
                textAlign: 'center',
                padding: '24px 20px'
              }}
            >
              <span style={{ fontSize: '13px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quem começa falando
              </span>
              <h1 style={{ color: 'var(--secondary-cyan)', fontSize: '32px', fontWeight: '900', marginTop: '6px', textShadow: '0 0 10px var(--secondary-cyan-glow)' }}>
                {starterName}
              </h1>
            </div>

            {/* Quick Playbook */}
            <div className="card-glass" style={{ background: 'rgba(255,255,255,0.02)', padding: '18px' }}>
              <h4 style={{ fontSize: '15px', color: 'white', marginBottom: '8px' }}>Como Jogar:</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', textAlign: 'left' }}>
                1. Em sentido horário a partir do sorteado, cada jogador fala <strong>apenas uma palavra</strong> relacionada à categoria secreta.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', textAlign: 'left', marginTop: '8px' }}>
                2. O impostor não sabe a palavra secreta e deve se misturar às cegas.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', textAlign: 'left', marginTop: '8px' }}>
                3. Após a rodada de falas, debatam e votem verbalmente em quem vocês acham que é o Impostor.
              </p>
            </div>
          </div>

          {/* Discreet Results Reveal Trigger */}
          <div style={{ marginTop: 'auto', padding: '10px 0' }}>
            <button
              className="btn-secondary"
              onClick={handleRevealClick}
              style={{
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: 'rgba(255, 255, 255, 0.5)',
                padding: '12px 20px',
                fontSize: '14px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}
            >
              👁 Revelar resultado da rodada
            </button>
          </div>
        </>
      ) : (
        /* ROUND RESULTS SCREEN */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1, justifyContent: 'center' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <div 
              style={{ 
                display: 'inline-block',
                background: 'rgba(255, 59, 48, 0.1)', 
                border: '1px solid rgba(255, 59, 48, 0.2)',
                color: 'var(--primary-red)',
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '4px 12px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '12px'
              }}
            >
              Fim de Rodada
            </div>
            <h2 style={{ fontSize: '28px', color: 'white' }}>Resultado da Rodada</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Category */}
            <div className="card-glass" style={{ padding: '16px 20px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Categoria</span>
              <h3 style={{ fontSize: '22px', color: 'white', marginTop: '4px' }}>{selectedCategory.name}</h3>
            </div>

            {/* Secret Word */}
            <div className="card-glass" style={{ padding: '16px 20px', borderLeft: '4px solid var(--secondary-cyan)' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Palavra Secreta</span>
              <h3 style={{ fontSize: '26px', color: 'var(--secondary-cyan)', marginTop: '4px' }}>{secretWord}</h3>
            </div>

            {/* Impostor(es) List */}
            <div 
              className="card-glass" 
              style={{ 
                padding: '20px', 
                border: '1px solid var(--primary-red)', 
                boxShadow: '0 0 15px rgba(255, 59, 48, 0.15)',
                background: 'rgba(255, 59, 48, 0.03)'
              }}
            >
              <span style={{ fontSize: '12px', color: 'var(--primary-red)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {impostors.length > 1 ? 'Os Impostores' : 'O Impostor'}
              </span>
              <h2 style={{ fontSize: '26px', color: 'white', marginTop: '6px', fontWeight: '800' }}>
                {impostorsList}
              </h2>
            </div>

          </div>

          {/* Settle and restart buttons */}
          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn-primary" onClick={onRestartGame}>
              🎮 Nova Rodada
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {isConfirming && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ fontSize: '36px', textAlign: 'center', marginBottom: '12px' }}>⚠️</div>
            <h3 className="modal-title" style={{ textAlign: 'center' }}>Revelar Resultados?</h3>
            <p className="modal-body" style={{ textAlign: 'center' }}>
              Isso vai encerrar a rodada atual e revelar a palavra secreta e a identidade dos impostores para todos na mesa.
            </p>
            <div className="modal-actions">
              <button 
                className="btn-secondary" 
                style={{ flex: 1 }}
                onClick={() => setIsConfirming(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn-accent" 
                style={{ flex: 1, background: 'linear-gradient(135deg, var(--primary-red) 0%, #d32f2f 100%)', color: 'white', boxShadow: '0 4px 12px rgba(255, 59, 48, 0.2)' }}
                onClick={handleConfirmReveal}
              >
                Sim, Revelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
