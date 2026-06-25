import React, { useState } from 'react';
import type { Category } from '../types';
import { INITIAL_CATEGORIES } from '../initialData';

interface SettingsScreenProps {
  categories: Category[];
  onUpdateCategories: (newCategories: Category[]) => void;
  onNavigateHome: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  categories,
  onUpdateCategories,
  onNavigateHome,
}) => {
  const [isConfirming, setIsConfirming] = useState(false);

  // Soft reset: Keep custom categories/words, restore default categories/words, update default hints
  const handleSoftReset = () => {
    const updatedCategoriesList = [...categories];

    INITIAL_CATEGORIES.forEach((defaultCat) => {
      // Find category with same name or id (case-insensitive)
      const existingCatIdx = updatedCategoriesList.findIndex(
        (c) => c.id === defaultCat.id || c.name.toLowerCase() === defaultCat.name.toLowerCase()
      );

      if (existingCatIdx === -1) {
        // If it was deleted, recreate it entirely
        updatedCategoriesList.push({ ...defaultCat });
      } else {
        // If it exists, merge missing words and update hints
        const existingCat = updatedCategoriesList[existingCatIdx];
        const mergedWords = [...existingCat.words];

        defaultCat.words.forEach((defaultWordObj) => {
          const wordIdx = mergedWords.findIndex(
            (w) => w.text.toLowerCase() === defaultWordObj.text.toLowerCase()
          );

          if (wordIdx === -1) {
            // Restore missing default word
            mergedWords.push({ ...defaultWordObj });
          } else {
            // Update default word's hint with the new default hint
            mergedWords[wordIdx] = {
              ...mergedWords[wordIdx],
              hint: defaultWordObj.hint, // update hint
            };
          }
        });

        // Save merged list
        updatedCategoriesList[existingCatIdx] = {
          ...existingCat,
          words: mergedWords,
        };
      }
    });

    onUpdateCategories(updatedCategoriesList);
    setIsConfirming(false);
    alert('As categorias padrão foram restauradas mantendo as suas personalizações!');
    onNavigateHome();
  };

  // Hard reset: Overwrite everything with default categories
  const handleHardReset = () => {
    onUpdateCategories(INITIAL_CATEGORIES);
    setIsConfirming(false);
    alert('O aplicativo foi restaurado com sucesso para a configuração original de fábrica.');
    onNavigateHome();
  };

  return (
    <div className="screen-container">
      <h2 style={{ fontSize: '24px', marginBottom: '20px', color: 'white' }}>Configurações</h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
        {/* App Data Settings Box */}
        <div className="card-glass" style={{ padding: '24px 20px' }}>
          <h3 style={{ fontSize: '18px', color: 'white', marginBottom: '8px' }}>Dados do aplicativo</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: '20px' }}>
            Aqui você pode gerenciar o banco de dados armazenado no seu navegador. O botão abaixo permite restaurar as categorias e palavras originais que acompanham o jogo.
          </p>

          <button
            className="btn-secondary"
            style={{
              borderColor: 'rgba(239, 68, 68, 0.3)',
              background: 'rgba(239, 68, 68, 0.05)',
              color: '#ef4444',
            }}
            onClick={() => setIsConfirming(true)}
          >
            🔄 Resetar para o padrão
          </button>
        </div>

        {/* General App Info Box */}
        <div className="card-glass" style={{ background: 'rgba(255,255,255,0.01)', borderStyle: 'dashed' }}>
          <h4 style={{ fontSize: '14px', color: 'white', marginBottom: '6px' }}>Sobre o IMPOSTOR FIZZI</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', lineHeight: '1.4' }}>
            Versão: 23.09.0001<br />
            Este aplicativo roda 100% no seu dispositivo local e funciona offline após o primeiro acesso.
          </p>
        </div>
      </div>

      {/* CONFIRMATION OVERLAY MODAL */}
      {isConfirming && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '440px' }}>
            <div style={{ fontSize: '36px', textAlign: 'center', marginBottom: '12px' }}>🔄</div>
            <h3 className="modal-title" style={{ textAlign: 'center', fontSize: '20px' }}>Resetar Categorias?</h3>
            <p className="modal-body" style={{ textAlign: 'center', fontSize: '14px', marginBottom: '24px' }}>
              Como você deseja restaurar as categorias? Escolha a opção de segurança recomendada para não perder suas criações.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                className="btn-accent"
                onClick={handleSoftReset}
                style={{
                  fontSize: '14px',
                  padding: '14px 18px',
                  background: 'linear-gradient(135deg, var(--secondary-cyan) 0%, #00b4d8 100%)',
                  color: 'var(--bg-dark)',
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                }}
              >
                <div>
                  <strong>1. Restaurar e manter personalizadas (Recomendado)</strong>
                  <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.85, fontWeight: 'normal', lineHeight: '1.3' }}>
                    Recria categorias padrão apagadas e palavras originais sem remover suas categorias criadas/importadas.
                  </div>
                </div>
              </button>

              <button
                className="btn-secondary"
                onClick={handleHardReset}
                style={{
                  fontSize: '14px',
                  padding: '14px 18px',
                  borderColor: 'rgba(239, 68, 68, 0.4)',
                  color: '#ef4444',
                  textAlign: 'left',
                  justifyContent: 'flex-start',
                }}
              >
                <div>
                  <strong>2. Limpar tudo e restaurar do zero</strong>
                  <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.85, fontWeight: 'normal', lineHeight: '1.3' }}>
                    Apaga permanentemente todas as suas categorias e palavras e recria apenas a base original de fábrica.
                  </div>
                </div>
              </button>

              <button
                className="btn-secondary"
                onClick={() => setIsConfirming(false)}
                style={{ marginTop: '8px', padding: '12px', fontSize: '14px', justifyContent: 'center' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
