import React from 'react';
import type { GameScreen } from '../types';

interface HeaderProps {
  currentScreen: GameScreen;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onBack }) => {
  // Disable going back during active gameplay and role reveals to prevent game-breaking checks
  const showBack = 
    onBack && 
    currentScreen !== 'HOME' && 
    currentScreen !== 'REVEAL_PASS' && 
    currentScreen !== 'REVEAL_SHOW' && 
    currentScreen !== 'GAMEPLAY';

  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 'calc(env(safe-area-inset-top, 0px) + 16px)',
      paddingLeft: 'calc(env(safe-area-inset-left, 0px) + 16px)',
      paddingRight: 'calc(env(safe-area-inset-right, 0px) + 16px)',
      paddingBottom: '16px',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      background: 'rgba(10, 11, 14, 0.6)',
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      minHeight: '68px'
    }}>
      <div style={{ width: '44px', display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
        {showBack && (
          <button 
            onClick={onBack}
            className="back-btn"
            aria-label="Voltar"
          >
            ←
          </button>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{
          fontSize: '24px',
          fontWeight: 900,
          color: 'var(--primary-red)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          margin: 0,
          lineHeight: 1
        }}>
          IMPOSTOR
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            color: 'var(--secondary-cyan)',
            letterSpacing: '0.12em',
            marginLeft: '4px',
            verticalAlign: 'super'
          }}>
            FIZZI
          </span>
        </h1>
      </div>

      <div style={{ width: '44px' }} /> {/* Symmetry spacer */}
    </header>
  );
};
