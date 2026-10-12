import { useState, useEffect } from 'react';
import { updateCoupleNames, getCoupleNames } from '../firebase/services.jsx';
import { PALETTES_BY_FAMILY, COLOR_FAMILIES, DEFAULT_PALETTE_ID, getPalette } from '../theme/palettes.js';
import './CoupleSettings.css';

const CoupleSettings = ({ ownerUid }) => {
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    pixKey: '',
    weddingDate: '',
    publicMessage: '',
    paletteId: DEFAULT_PALETTE_ID
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPaletteModal, setShowPaletteModal] = useState(false);
  const [familyFilter, setFamilyFilter] = useState('all');

  useEffect(() => {
    loadCoupleNames();
  }, []);

  const loadCoupleNames = async () => {
    try {
      const names = await getCoupleNames(ownerUid);
      if (names) {
        setFormData({
          brideName: names.brideName || '',
          groomName: names.groomName || '',
          pixKey: names.pixKey || '',
          weddingDate: names.weddingDate || '',
          publicMessage: names.publicMessage || '',
          paletteId: names.paletteId || DEFAULT_PALETTE_ID
        });
      }
    } catch (error) {
      console.error('Erro ao carregar nomes do casal:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      await updateCoupleNames(
        ownerUid,
        formData.brideName, 
        formData.groomName, 
        formData.pixKey,
        formData.weddingDate,
        formData.publicMessage,
        formData.paletteId
      );
      setMessage('Configurações do casal atualizadas com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      setMessage('Erro ao atualizar configurações do casal');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPalette = getPalette(formData.paletteId);
  const visiblePalettes = familyFilter === 'all'
    ? PALETTES_BY_FAMILY
    : PALETTES_BY_FAMILY.filter((p) => p.family === familyFilter);

  return (
    <div className="couple-settings">
      <div className="settings-header">
        <h2>💕 Configurações do Casal</h2>
        <p>Configure os nomes da noiva e do noivo, e a chave PIX para exibir na lista de presentes</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="form-group">
          <label htmlFor="brideName">Nome da Noiva</label>
          <input
            type="text"
            id="brideName"
            name="brideName"
            value={formData.brideName}
            onChange={handleChange}
            placeholder="Digite o nome da noiva"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="groomName">Nome do Noivo</label>
          <input
            type="text"
            id="groomName"
            name="groomName"
            value={formData.groomName}
            onChange={handleChange}
            placeholder="Digite o nome do noivo"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="pixKey">Chave PIX para Contribuição (Opcional)</label>
          <input
            type="text"
            id="pixKey"
            name="pixKey"
            value={formData.pixKey}
            onChange={handleChange}
            placeholder="Ex: (11) 99999-9999 ou email@exemplo.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="weddingDate">Data do Casamento</label>
          <input
            type="date"
            id="weddingDate"
            name="weddingDate"
            value={formData.weddingDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="publicMessage">Mensagem Pública</label>
          <textarea
            id="publicMessage"
            name="publicMessage"
            value={formData.publicMessage}
            onChange={handleChange}
            placeholder="Digite uma mensagem para exibir aos convidados na lista de presentes"
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label>Paleta de Cores da Lista Pública</label>
          <button
            type="button"
            className="palette-trigger"
            onClick={() => setShowPaletteModal(true)}
          >
            <span className="palette-swatches">
              {[selectedPalette.primary, selectedPalette.secondary, selectedPalette.accent, selectedPalette.light, selectedPalette.background].map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
            </span>
            <span className="palette-name">{selectedPalette.name}</span>
            <span className="palette-trigger-action">Alterar</span>
          </button>
        </div>

        <button 
          type="submit" 
          className="save-button"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Configurações'}
        </button>

        {message && (
          <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>

      {showPaletteModal && (
        <div className="palette-modal-overlay" onClick={() => setShowPaletteModal(false)}>
          <div className="palette-modal" onClick={(e) => e.stopPropagation()}>
            <div className="palette-modal-header">
              <h3>Escolha a paleta de cores</h3>
              <button type="button" className="palette-modal-close" onClick={() => setShowPaletteModal(false)}>×</button>
            </div>

            <div className="palette-family-filter">
              <button
                type="button"
                className={`palette-family-chip ${familyFilter === 'all' ? 'active' : ''}`}
                onClick={() => setFamilyFilter('all')}
              >
                Todas
              </button>
              {COLOR_FAMILIES.map((f) => (
                <button
                  type="button"
                  key={f.id}
                  className={`palette-family-chip ${familyFilter === f.id ? 'active' : ''}`}
                  onClick={() => setFamilyFilter(f.id)}
                >
                  <span className="palette-family-dot" style={{ background: f.swatch }} />
                  {f.label}
                </button>
              ))}
            </div>

            <p className="palette-modal-hint">Deslize para o lado para ver mais paletas.</p>
            <div className="palette-grid" role="radiogroup" aria-label="Paleta de cores">
              {visiblePalettes.map((p) => (
                <button
                  type="button"
                  key={p.id}
                  role="radio"
                  aria-checked={formData.paletteId === p.id}
                  className={`palette-option ${formData.paletteId === p.id ? 'selected' : ''}`}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, paletteId: p.id }));
                    setShowPaletteModal(false);
                  }}
                >
                  <span className="palette-swatches">
                    {[p.primary, p.secondary, p.accent, p.light, p.background].map((c) => (
                      <span key={c} style={{ background: c }} />
                    ))}
                  </span>
                  <span className="palette-name">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoupleSettings;
