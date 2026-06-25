import React from 'react';
import type { GameScreen, ActiveSession } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: GameScreen) => void;
  activeSession: ActiveSession | null;
  onContinueSession: () => void;
  onExitSession: () => void;
  nonMedicinerMode: boolean;
  onToggleNonMediciner: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onNavigate, 
  activeSession, 
  onContinueSession, 
  onExitSession,
  nonMedicinerMode,
  onToggleNonMediciner
}) => {
  return (
    <div className="screen-container" style={{ justifyContent: 'center', minHeight: 'calc(100vh - 68px)' }}>
      {/* Brand Logo Display */}
      <div className="brand-logo-container" style={{ marginBottom: '40px' }}>
        <div className="brand-impostor">IMPOSTOR</div>
        <div className="brand-fizzi">FIZZI</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '16px', letterSpacing: '0.05em' }}>
          O JOGO DE DISFARCE SOCIAL
        </p>
      </div>

      {/* Active Session Info Card */}
      {activeSession && (
        <div className="card-glass" style={{ marginBottom: '24px', padding: '20px', border: '1px solid rgba(0, 229, 255, 0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '18px' }}>⚡</span>
            <strong style={{ fontSize: '15px', color: 'var(--secondary-cyan)' }}>Sessão Ativa Detectada</strong>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '16px', textAlign: 'left' }}>
            <strong>Jogadores:</strong> {activeSession.config.players.join(', ')}<br />
            <strong>Modo:</strong> {activeSession.config.gameMode === 'HINT' ? 'Com Dica' : 'Clássico'} | <strong>Impostores:</strong> {activeSession.config.impostorsCount}<br />
            <strong>Rodadas jogadas:</strong> {activeSession.roundsPlayed}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button className="btn-primary" onClick={onContinueSession} style={{ padding: '12px', fontSize: '15px', background: 'linear-gradient(135deg, var(--secondary-cyan) 0%, #00b4d8 100%)', color: 'var(--bg-dark)' }}>
              ▶ Continuar sessão
            </button>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-secondary" 
                onClick={() => onNavigate('SETUP')} 
                style={{ flex: 1, padding: '10px', fontSize: '13px', minHeight: '38px' }}
              >
                ⚙️ Nova config
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => {
                  if (window.confirm('Tem certeza que deseja sair da sessão? As configurações desta sessão serão encerradas, mas seus jogadores e categorias salvos continuarão disponíveis.')) {
                    onExitSession();
                  }
                }} 
                style={{ flex: 1, padding: '10px', fontSize: '13px', minHeight: '38px', borderColor: 'rgba(255, 75, 75, 0.3)', color: '#ff4d4d', background: 'rgba(255, 75, 75, 0.05)' }}
              >
                🚪 Sair da sessão
              </button>
            </div>
          </div>
        </div>
      )}

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

      <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
        Jogue em um único celular passado de mão em mão.
      </div>

      {/* Discrete "Não mediciner" toggle */}
      <div 
        onClick={onToggleNonMediciner}
        style={{
          marginTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          padding: '8px 16px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.02)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          width: 'fit-content',
          margin: '24px auto 0 auto',
          cursor: 'pointer',
          userSelect: 'none',
          transition: 'background-color 0.2s ease, border-color 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
        }}
      >
        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Não mediciner</span>
        <div style={{
          width: '36px',
          height: '20px',
          borderRadius: '10px',
          background: nonMedicinerMode ? 'var(--secondary-cyan)' : 'rgba(255,255,255,0.1)',
          position: 'relative',
          transition: 'background-color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          padding: '2px'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: nonMedicinerMode ? 'var(--bg-dark)' : 'var(--text-muted)',
            transform: nonMedicinerMode ? 'translateX(16px)' : 'translateX(0)',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease'
          }} />
        </div>
      </div>
      <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '10px', color: 'var(--text-muted)', opacity: 0.5 }}>
        v23.09.0001
      </div>
    </div>
  );
};
