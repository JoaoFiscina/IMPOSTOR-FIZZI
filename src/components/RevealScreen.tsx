import React, { useState } from 'react';
import type { Player } from '../types';

interface RevealScreenProps {
  players: Player[];
  secretWord: string;
  onFinishReveal: () => void;
}

export const RevealScreen: React.FC<RevealScreenProps> = ({
  players,
  secretWord,
  onFinishReveal,
}) => {
  const [playerIndex, setPlayerIndex] = useState(0);
  const [subStep, setSubStep] = useState<'PASS' | 'SHOW'>('PASS');
  const [isHolding, setIsHolding] = useState(false);
  const [hasHeldOnce, setHasHeldOnce] = useState(false);

  const currentPlayer = players[playerIndex];

  const handleRevealClick = () => {
    setSubStep('SHOW');
    setIsHolding(false);
    setHasHeldOnce(false);
  };

  const handleHoldStart = () => {
    setIsHolding(true);
    setHasHeldOnce(true);
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
  };

  const handleNextPlayer = () => {
    if (playerIndex + 1 < players.length) {
      setPlayerIndex(playerIndex + 1);
      setSubStep('PASS');
    } else {
      onFinishReveal();
    }
  };

  return (
    <div className="screen-container" style={{ justifyContent: 'center' }}>
      
      {/* SUB-STEP 1: PASS THE PHONE */}
      {subStep === 'PASS' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '20px' }}>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            PASSE O CELULAR
          </div>
          
          <div className="pass-instruction">
            Entregue o aparelho para:
            <span className="pass-name">{currentPlayer.name}</span>
          </div>

          <div 
            style={{ 
              width: '120px', 
              height: '120px', 
              borderRadius: '60px', 
              background: 'rgba(0, 229, 255, 0.05)', 
              border: '2px solid rgba(0, 229, 255, 0.2)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: '44px',
              animation: 'pulseCyan 2s infinite',
              marginBottom: '20px'
            }}
          >
            👤
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', maxWidth: '280px', marginBottom: '20px', lineHeight: '1.4' }}>
            Certifique-se de que mais ninguém está olhando para a tela.
          </p>

          <button className="btn-primary" onClick={handleRevealClick}>
            Entendi, Revelar Papel
          </button>
        </div>
      )}

      {/* SUB-STEP 2: SHOW ROLE (PRIVACY SCREEN) */}
      {subStep === 'SHOW' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Jogador Atual</span>
            <h3 style={{ fontSize: '24px', color: 'white' }}>{currentPlayer.name}</h3>
          </div>

          {/* Secret Display Area */}
          <div className="reveal-card-container">
            <div className="hold-area">
              
              {/* Blur Overlay (visible when NOT holding) */}
              <div className={`hold-blur-overlay ${isHolding ? 'hidden' : ''}`}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔒</div>
                <div style={{ fontWeight: '700', fontSize: '16px', color: 'white', textAlign: 'center', maxWidth: '240px' }}>
                  A palavra está oculta
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Pressione o botão abaixo para revelar
                </div>
              </div>

              {/* Reveal Content (visible when holding) */}
              <div 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  padding: '20px'
                }}
              >
                {currentPlayer.isImpostor ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '14px', color: 'var(--primary-red)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '10px' }}>
                      Cuidado!
                    </div>
                    <h1 style={{ color: 'var(--primary-red)', fontSize: '36px', textShadow: '0 0 15px rgba(255, 59, 48, 0.6)', margin: 0, textTransform: 'uppercase' }}>
                      Você é o Impostor
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '12px', maxWidth: '280px', lineHeight: '1.4' }}>
                      Se misture entre os jogadores comuns e tente descobrir a palavra secreta!
                    </p>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--secondary-cyan)', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                      Sua Palavra Secreta
                    </div>
                    <h1 style={{ color: 'var(--secondary-cyan)', fontSize: '42px', textShadow: '0 0 15px rgba(0, 229, 255, 0.6)', margin: 0, fontWeight: '900' }}>
                      {secretWord}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '12px', maxWidth: '280px', lineHeight: '1.4' }}>
                      Diga pistas que confirmem que você sabe a palavra, mas sem entregá-la de bandeja.
                    </p>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Touch-and-Hold Button */}
          <div style={{ marginBottom: '24px' }}>
            <button
              className="btn-accent"
              style={{ 
                padding: '20px 24px', 
                fontSize: '18px', 
                background: isHolding ? 'rgba(0, 229, 255, 0.2)' : 'linear-gradient(135deg, var(--secondary-cyan) 0%, #00b4d8 100%)',
                border: isHolding ? '2px solid var(--secondary-cyan)' : 'none',
                color: isHolding ? 'var(--secondary-cyan)' : 'var(--bg-dark)',
                boxShadow: isHolding ? '0 0 20px rgba(0, 229, 255, 0.4)' : '0 4px 12px rgba(0, 229, 255, 0.2)',
                transform: isHolding ? 'scale(0.97)' : 'scale(1)'
              }}
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
            >
              🤝 {isHolding ? 'Segurando para ver...' : 'Pressione e SEGURE para ver'}
            </button>
          </div>

          {/* Passing Button - Only allowed to proceed if they have viewed at least once */}
          <div style={{ marginTop: 'auto' }}>
            <button 
              className="btn-primary" 
              onClick={handleNextPlayer}
              disabled={!hasHeldOnce}
              style={{ 
                background: hasHeldOnce ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)' : 'rgba(255,255,255,0.02)',
                color: hasHeldOnce ? 'white' : 'rgba(255, 255, 255, 0.2)',
                border: hasHeldOnce ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.02)',
                boxShadow: 'none',
                cursor: hasHeldOnce ? 'pointer' : 'not-allowed'
              }}
            >
              Ocultar e Passar →
            </button>
            {!hasHeldOnce && (
              <p style={{ color: 'rgba(239, 68, 68, 0.7)', fontSize: '11px', textAlign: 'center', marginTop: '8px' }}>
                Você precisa visualizar seu papel antes de passar a vez.
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
