import React, { useState, useRef } from 'react';
import type { Category, WordObject } from '../types';

interface ImportScreenProps {
  categories: Category[];
  onUpdateCategories: (newCategories: Category[]) => void;
  onNavigateHome: () => void;
}

interface ParsedData {
  [categoryName: string]: WordObject[];
}

interface ImportPreviewItem {
  categoryName: string;
  isNew: boolean;
  newWords: WordObject[];
  updatedWords: WordObject[]; // existing words that will have their hint updated
  duplicateWords: WordObject[]; // completely ignored duplicates
}

export const ImportScreen: React.FC<ImportScreenProps> = ({
  categories,
  onUpdateCategories,
  onNavigateHome,
}) => {
  const [step, setStep] = useState<'INPUT' | 'PREVIEW' | 'SUMMARY'>('INPUT');
  const [importText, setImportText] = useState('');
  const [previewItems, setPreviewItems] = useState<ImportPreviewItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Summary statistics counts
  const [summary, setSummary] = useState({
    categoriesCreated: 0,
    categoriesUpdated: 0,
    wordsAdded: 0,
    hintsUpdated: 0,
    duplicatesIgnored: 0,
  });

  // PARSER LOGIC WITH OPTIONAL HINT PIPE
  const parseText = (text: string): ParsedData => {
    const lines = text.split(/\r?\n/);
    const parsed: ParsedData = {};
    let currentCategory = '';

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Check: Categoria: Filmes
      if (line.toLowerCase().startsWith('categoria:')) {
        currentCategory = line.substring(10).trim();
        if (currentCategory) {
          if (!parsed[currentCategory]) {
            parsed[currentCategory] = [];
          }
        }
      }
      // Check: [Filmes]
      else if (line.startsWith('[') && line.endsWith(']')) {
        currentCategory = line.substring(1, line.length - 1).trim();
        if (currentCategory) {
          if (!parsed[currentCategory]) {
            parsed[currentCategory] = [];
          }
        }
      }
      // Word line
      else if (currentCategory) {
        let textPart = line;
        let hintPart: string | undefined = undefined;

        if (line.includes('|')) {
          const parts = line.split('|');
          textPart = parts[0].trim();
          hintPart = parts.slice(1).join('|').trim() || undefined;
        }

        if (textPart) {
          // Avoid duplicates in the same import batch
          const alreadyParsedIdx = parsed[currentCategory].findIndex(
            (w) => w.text.toLowerCase() === textPart.toLowerCase()
          );

          if (alreadyParsedIdx === -1) {
            parsed[currentCategory].push({ text: textPart, hint: hintPart });
          } else if (hintPart) {
            // If it has a hint in this batch, keep the one with hint
            parsed[currentCategory][alreadyParsedIdx].hint = hintPart;
          }
        }
      }
    }
    return parsed;
  };

  const processImportInput = (text: string) => {
    if (!text.trim()) {
      alert('Por favor, cole um texto ou envie um arquivo primeiro.');
      return;
    }

    const parsed = parseText(text);
    const parsedCategoryNames = Object.keys(parsed);

    if (parsedCategoryNames.length === 0) {
      alert('Nenhuma categoria válida encontrada. Verifique o formato do texto.');
      return;
    }

    // Generate preview comparisons
    const items: ImportPreviewItem[] = parsedCategoryNames.map((catName) => {
      // Find if it already exists in database (case insensitive)
      const existingCategory = categories.find(
        (c) => c.name.toLowerCase() === catName.toLowerCase()
      );

      const parsedWords = parsed[catName];
      const newWords: WordObject[] = [];
      const updatedWords: WordObject[] = [];
      const duplicateWords: WordObject[] = [];

      if (existingCategory) {
        parsedWords.forEach((parsedWordObj) => {
          const existingWordObj = existingCategory.words.find(
            (w) => w.text.toLowerCase() === parsedWordObj.text.toLowerCase()
          );

          if (existingWordObj) {
            // Word exists. Check if we have a new/different hint to merge
            if (parsedWordObj.hint && parsedWordObj.hint !== existingWordObj.hint) {
              updatedWords.push(parsedWordObj);
            } else {
              duplicateWords.push(parsedWordObj);
            }
          } else {
            // New word
            newWords.push(parsedWordObj);
          }
        });

        return {
          categoryName: existingCategory.name, // preserve original casing
          isNew: false,
          newWords,
          updatedWords,
          duplicateWords,
        };
      } else {
        // Entirely new category, all words are new
        return {
          categoryName: catName,
          isNew: true,
          newWords: parsedWords,
          updatedWords: [],
          duplicateWords: [],
        };
      }
    });

    setPreviewItems(items);
    setStep('PREVIEW');
  };

  // Textarea import
  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processImportInput(importText);
  };

  // File import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setImportText(text);
      processImportInput(text);
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset file input
  };

  // CONFIRM AND MERGE INTO LOCAL STORAGE
  const handleConfirmImport = () => {
    let newCategoriesCount = 0;
    let updatedCategoriesCount = 0;
    let totalWordsAdded = 0;
    let totalHintsUpdated = 0;
    let totalDuplicatesIgnored = 0;

    // Deep copy current categories list
    const updatedCategoriesList = [...categories];

    previewItems.forEach((item) => {
      // Calculate stats
      totalWordsAdded += item.newWords.length;
      totalHintsUpdated += item.updatedWords.length;
      totalDuplicatesIgnored += item.duplicateWords.length;

      if (item.isNew) {
        newCategoriesCount++;
        // Create new category
        updatedCategoriesList.push({
          id: item.categoryName.toLowerCase().replace(/\s+/g, '-'),
          name: item.categoryName,
          words: item.newWords,
        });
      } else {
        if (item.newWords.length > 0 || item.updatedWords.length > 0) {
          updatedCategoriesCount++;
        }

        // Merge words in existing category
        const idx = updatedCategoriesList.findIndex(
          (c) => c.name.toLowerCase() === item.categoryName.toLowerCase()
        );

        if (idx !== -1) {
          const currentWords = [...updatedCategoriesList[idx].words];

          // Add new words
          item.newWords.forEach((newW) => currentWords.push(newW));

          // Update existing hints
          item.updatedWords.forEach((updW) => {
            const wordIdx = currentWords.findIndex(
              (w) => w.text.toLowerCase() === updW.text.toLowerCase()
            );
            if (wordIdx !== -1) {
              currentWords[wordIdx] = {
                ...currentWords[wordIdx],
                hint: updW.hint,
              };
            }
          });

          updatedCategoriesList[idx] = {
            ...updatedCategoriesList[idx],
            words: currentWords,
          };
        }
      }
    });

    onUpdateCategories(updatedCategoriesList);

    // Save summary statistics
    setSummary({
      categoriesCreated: newCategoriesCount,
      categoriesUpdated: updatedCategoriesCount,
      wordsAdded: totalWordsAdded,
      hintsUpdated: totalHintsUpdated,
      duplicatesIgnored: totalDuplicatesIgnored,
    });

    setStep('SUMMARY');
  };

  const handleCancelPreview = () => {
    setStep('INPUT');
    setPreviewItems([]);
  };

  const handleReset = () => {
    setImportText('');
    setPreviewItems([]);
    setStep('INPUT');
  };

  return (
    <div className="screen-container">
      <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'white' }}>Importação de Categorias</h2>

      {/* STEP 1: INPUT METHOD */}
      {step === 'INPUT' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: '1.45' }}>
            Envie coleções no formato de lista. Adicione dicas utilizando o separador <code>|</code>.<br />
            Exemplo: <code>Interestelar | Envolve ficção científica e viagem no tempo.</code>
          </p>

          {/* Paste Form */}
          <form onSubmit={handlePasteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <label className="label-title">Colar texto</label>
            <textarea
              className="input-text import-textarea"
              placeholder={`Exemplo:\n[Comidas]\nPizza | De origem italiana, servida em fatias.\nSushi\nLasanha\n\nCategoria: Filmes\nTitanic | Romance em um grande desastre histórico.\nAvatar`}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
            />
            <button className="btn-accent" type="submit">
              Analisar Texto
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '6px 0' }}>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>OU</span>
            <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)' }} />
          </div>

          {/* File Upload Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label className="label-title">Carregar arquivo .TXT</label>
            <button
              className="btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              type="button"
            >
              📄 Selecionar arquivo .txt
            </button>
            <input
              type="file"
              accept=".txt"
              ref={fileInputRef}
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      )}

      {/* STEP 2: PREVIEW */}
      {step === 'PREVIEW' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="alert-box" style={{ marginBottom: '14px' }}>
            Reveja os itens analisados antes de mesclar na memória do aparelho. Palavras com dica exibem o ícone 💡.
          </div>

          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
            {previewItems.map((item, index) => (
              <div key={index} className="card-glass" style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '18px', color: 'white' }}>{item.categoryName}</h4>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 'bold',
                      padding: '2px 8px',
                      borderRadius: '8px',
                      background: item.isNew ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255,255,255,0.05)',
                      color: item.isNew ? 'var(--secondary-cyan)' : 'var(--text-muted)',
                    }}
                  >
                    {item.isNew ? 'Nova' : 'Existente'}
                  </span>
                </div>
                
                {/* Details Statistics */}
                <div style={{ fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '10px' }}>
                  {item.newWords.length > 0 && (
                    <div style={{ color: 'rgba(0, 229, 255, 0.85)' }}>
                      ✓ {item.newWords.length} palavras novas a serem adicionadas
                    </div>
                  )}
                  {item.updatedWords.length > 0 && (
                    <div style={{ color: '#a259ff' }}>
                      ⚡ {item.updatedWords.length} dicas a serem atualizadas
                    </div>
                  )}
                  {item.duplicateWords.length > 0 && (
                    <div style={{ color: 'rgba(255, 255, 255, 0.35)' }}>
                      ⚠ {item.duplicateWords.length} duplicatas ignoradas
                    </div>
                  )}
                </div>

                {/* Word list mini preview with hints indicator */}
                <div
                  style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    maxHeight: '110px',
                    overflowY: 'auto',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '10px',
                    borderRadius: '10px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}
                >
                  {/* Combine new and updated words for preview */}
                  {[...item.newWords, ...item.updatedWords].map((w, wIdx) => (
                    <span 
                      key={wIdx} 
                      style={{ 
                        background: 'rgba(255,255,255,0.04)', 
                        padding: '2px 6px', 
                        borderRadius: '6px',
                        color: 'white',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px'
                      }}
                      title={w.hint ? `Dica: ${w.hint}` : 'Sem dica'}
                    >
                      {w.text} {w.hint ? '💡' : ''}
                    </span>
                  ))}
                  {item.newWords.length === 0 && item.updatedWords.length === 0 && (
                    <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                      Nenhuma palavra nova ou dica a atualizar.
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={handleCancelPreview}>
              Cancelar
            </button>
            <button className="btn-primary" onClick={handleConfirmImport}>
              Confirmar Importação
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: SUMMARY */}
      {step === 'SUMMARY' && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '32px',
              background: 'rgba(0, 229, 255, 0.1)',
              color: 'var(--secondary-cyan)',
              fontSize: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '20px',
            }}
          >
            ✓
          </div>

          <h3 style={{ fontSize: '24px', color: 'white', marginBottom: '8px' }}>Importação Concluída!</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', textAlign: 'center' }}>
            As novas coleções foram mescladas com sucesso e estão salvas no navegador.
          </p>

          <div
            className="card-glass"
            style={{
              width: '100%',
              marginBottom: '32px',
              background: 'rgba(255,255,255,0.02)',
              borderStyle: 'dashed',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Categorias criadas:</span>
                <strong style={{ color: 'var(--secondary-cyan)' }}>{summary.categoriesCreated}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Categorias atualizadas:</span>
                <strong style={{ color: 'white' }}>{summary.categoriesUpdated}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Palavras novas adicionadas:</span>
                <strong style={{ color: 'var(--secondary-cyan)' }}>{summary.wordsAdded}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Dicas de palavras atualizadas:</span>
                <strong style={{ color: '#a259ff' }}>{summary.hintsUpdated}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span>Palavras duplicadas ignoradas:</span>
                <strong style={{ color: '#ef4444' }}>{summary.duplicatesIgnored}</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={handleReset}>
              Importar Mais
            </button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={onNavigateHome}>
              Início
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
