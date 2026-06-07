import React, { useState } from 'react';
import type { Category, WordObject } from '../types';

interface CategoriesScreenProps {
  categories: Category[];
  onUpdateCategories: (newCategories: Category[]) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({
  categories,
  onUpdateCategories,
}) => {
  const [activeTab, setActiveTab] = useState<'categories' | 'words'>('categories');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(
    categories.length > 0 ? categories[0].id : ''
  );

  // New item inputs
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newWord, setNewWord] = useState('');
  const [newWordHint, setNewWordHint] = useState('');

  // Modals editing states
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');

  const [editingWord, setEditingWord] = useState<{ index: number; text: string; hint: string } | null>(null);
  const [editWordText, setEditWordText] = useState('');
  const [editWordHint, setEditWordHint] = useState('');

  // Selected category object
  const selectedCategory = categories.find((c) => c.id === selectedCategoryId);

  // CATEGORY OPERATIONS
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    const name = newCategoryName.trim();
    // Check duplication
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      alert('Esta categoria já existe!');
      return;
    }

    const newCat: Category = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      words: [],
    };

    const updated = [...categories, newCat];
    onUpdateCategories(updated);
    setNewCategoryName('');
    setSelectedCategoryId(newCat.id);
    setActiveTab('words'); // Switch to words tab to start adding words
  };

  const handleStartEditCategory = (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selection when clicking edit
    setEditingCategory(cat);
    setEditCategoryName(cat.name);
  };

  const handleSaveCategoryEdit = () => {
    if (!editingCategory || !editCategoryName.trim()) return;

    const newName = editCategoryName.trim();
    const updated = categories.map((c) => {
      if (c.id === editingCategory.id) {
        return { ...c, name: newName };
      }
      return c;
    });

    onUpdateCategories(updated);
    setEditingCategory(null);
  };

  const handleDeleteCategory = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja excluir esta categoria e todas as suas palavras?')) {
      const updated = categories.filter((c) => c.id !== catId);
      onUpdateCategories(updated);
      if (selectedCategoryId === catId) {
        setSelectedCategoryId(updated.length > 0 ? updated[0].id : '');
      }
    }
  };

  // WORD OPERATIONS
  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !newWord.trim()) return;

    const word = newWord.trim();
    // Avoid duplicates
    if (selectedCategory.words.some((w) => w.text.toLowerCase() === word.toLowerCase())) {
      alert('Esta palavra já existe nesta categoria!');
      return;
    }

    const hint = newWordHint.trim() || undefined;

    const newWordObj: WordObject = {
      text: word,
      hint,
    };

    const updated = categories.map((c) => {
      if (c.id === selectedCategoryId) {
        return { ...c, words: [...c.words, newWordObj] };
      }
      return c;
    });

    onUpdateCategories(updated);
    setNewWord('');
    setNewWordHint('');
  };

  const handleStartEditWord = (index: number, wordObj: WordObject) => {
    setEditingWord({ index, text: wordObj.text, hint: wordObj.hint || '' });
    setEditWordText(wordObj.text);
    setEditWordHint(wordObj.hint || '');
  };

  const handleSaveWordEdit = () => {
    if (!selectedCategory || editingWord === null || !editWordText.trim()) return;

    const newText = editWordText.trim();
    const newHint = editWordHint.trim() || undefined;
    
    const updatedWords = [...selectedCategory.words];
    updatedWords[editingWord.index] = {
      text: newText,
      hint: newHint,
    };

    const updated = categories.map((c) => {
      if (c.id === selectedCategoryId) {
        return { ...c, words: updatedWords };
      }
      return c;
    });

    onUpdateCategories(updated);
    setEditingWord(null);
  };

  const handleDeleteWord = (index: number) => {
    if (!selectedCategory) return;
    if (confirm('Excluir esta palavra?')) {
      const updatedWords = selectedCategory.words.filter((_, idx) => idx !== index);
      const updated = categories.map((c) => {
        if (c.id === selectedCategoryId) {
          return { ...c, words: updatedWords };
        }
        return c;
      });
      onUpdateCategories(updated);
    }
  };

  return (
    <div className="screen-container">
      <h2 style={{ fontSize: '24px', marginBottom: '16px', color: 'white' }}>Gerenciar Coleções</h2>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
          onClick={() => setActiveTab('categories')}
        >
          Categorias ({categories.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'words' ? 'active' : ''}`}
          onClick={() => setActiveTab('words')}
        >
          Palavras ({selectedCategory ? selectedCategory.words.length : 0})
        </button>
      </div>

      {/* TAB 1: CATEGORIES */}
      {activeTab === 'categories' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {/* Add Category Form */}
          <form onSubmit={handleCreateCategory} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input
              type="text"
              className="input-text"
              placeholder="Nova categoria... Ex: Frutas"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button className="btn-accent" type="submit" style={{ width: 'auto', padding: '0 20px' }}>
              +
            </button>
          </form>

          {/* Categories List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`list-item ${selectedCategoryId === cat.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedCategoryId(cat.id);
                  setActiveTab('words');
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: 'white' }}>{cat.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {cat.words.length} palavras
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '13px', width: 'auto', borderRadius: '10px' }}
                    onClick={(e) => handleStartEditCategory(cat, e)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-danger"
                    onClick={(e) => handleDeleteCategory(cat.id, e)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                Nenhuma categoria criada. Crie uma acima!
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: WORDS */}
      {activeTab === 'words' && (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          {selectedCategory ? (
            <>
              {/* Info Header */}
              <div style={{ marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Categoria Selecionada</span>
                <h3 style={{ fontSize: '20px', color: 'var(--secondary-cyan)' }}>{selectedCategory.name}</h3>
              </div>

              {/* Add Word Form */}
              <form onSubmit={handleAddWord} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="input-text"
                    placeholder="Nova palavra..."
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                  />
                  <button className="btn-accent" type="submit" style={{ width: 'auto', padding: '0 20px' }}>
                    Adicionar
                  </button>
                </div>
                <input
                  type="text"
                  className="input-text"
                  placeholder="Dica opcional para o impostor..."
                  value={newWordHint}
                  onChange={(e) => setNewWordHint(e.target.value)}
                  style={{ fontSize: '13px', padding: '10px 14px' }}
                />
              </form>

              {/* Words List */}
              <div style={{ flex: 1, overflowY: 'auto' }}>
                {selectedCategory.words.map((wordObj, idx) => (
                  <div
                    key={idx}
                    className="list-item"
                    style={{ cursor: 'default', alignItems: 'flex-start' }}
                  >
                    <div style={{ flex: 1, marginRight: '10px' }}>
                      <div style={{ color: 'white', fontWeight: '500' }}>{wordObj.text}</div>
                      {wordObj.hint && (
                        <div style={{ fontSize: '12px', color: 'rgba(0, 229, 255, 0.7)', marginTop: '4px', fontStyle: 'italic' }}>
                          Dica: {wordObj.hint}
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn-secondary"
                        style={{ padding: '6px 12px', fontSize: '13px', width: 'auto', borderRadius: '10px' }}
                        onClick={() => handleStartEditWord(idx, wordObj)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-danger"
                        style={{ padding: '6px 10px', fontSize: '12px' }}
                        onClick={() => handleDeleteWord(idx)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                {selectedCategory.words.length === 0 && (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
                    Esta categoria não tem palavras. Adicione uma acima!
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '40px' }}>
              Selecione uma categoria na primeira aba primeiro.
            </div>
          )}
        </div>
      )}

      {/* EDIT CATEGORY MODAL */}
      {editingCategory && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Editar Nome da Categoria</h3>
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                className="input-text"
                value={editCategoryName}
                onChange={(e) => setEditCategoryName(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setEditingCategory(null)}>
                Cancelar
              </button>
              <button className="btn-accent" onClick={handleSaveCategoryEdit}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT WORD MODAL */}
      {editingWord && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Editar Palavra</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div>
                <label className="label-title">Palavra</label>
                <input
                  type="text"
                  className="input-text"
                  value={editWordText}
                  onChange={(e) => setEditWordText(e.target.value)}
                />
              </div>
              <div>
                <label className="label-title">Dica (Opcional)</label>
                <input
                  type="text"
                  className="input-text"
                  value={editWordHint}
                  placeholder="Nenhuma dica cadastrada"
                  onChange={(e) => setEditWordHint(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setEditingWord(null)}>
                Cancelar
              </button>
              <button className="btn-accent" onClick={handleSaveWordEdit}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
