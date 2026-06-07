import React from 'react';
import type { GameScreen } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: GameScreen) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate }) => {
  return (
    <div className="screen-container" style={{ justifyContent: 'center', minHeight: 'calc(100vh - 68px)' }}>
      {/* Brand Logo Display */}
      <div className="brand-logo-container" style={{ marginBottom: '60px' }}>
        <div className="brand-impostor">IMPOSTOR</div>
        <div className="brand-fizzi">FIZZI</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '16px', letterSpacing: '0.05em' }}>
          O JOGO DE DISFARCE SOCIAL
        </p>
      </div>

      {/* Menu Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
        <button 
          className="btn-primary" 
          onClick={() => onNavigate('SETUP')}
          style={{ padding: '22px 24px', fontSize: '20px' }}
        >
          <span>🎮</span> Nova rodada
        </button>

        <button 
          className="btn-secondary" 
          onClick={() => onNavigate('CATEGORIES')}
        >
          <span>📂</span> Categorias
        </button>

        <button 
          className="btn-secondary" 
          onClick={() => onNavigate('IMPORT')}
        >
          <span>📥</span> Importar categorias
        </button>

        <button 
          className="btn-secondary" 
          onClick={() => onNavigate('SETTINGS')}
        >
          <span>⚙️</span> Configurações
        </button>
      </div>

      <div style={{ marginTop: '60px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
        Jogue em um único celular passado de mão em mão.
      </div>
    </div>
  );
};
