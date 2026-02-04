import React, { useState, useEffect } from 'react';
import { updateCoupleNames, getCoupleNames } from '../firebase/services.jsx';
import './CoupleSettings.css';

const CoupleSettings = () => {
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: '',
    pixKey: '',
    weddingDate: '',
    publicMessage: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadCoupleNames();
  }, []);

  const loadCoupleNames = async () => {
    try {
      const names = await getCoupleNames();
      if (names) {
        setFormData({
          brideName: names.brideName || '',
          groomName: names.groomName || '',
          pixKey: names.pixKey || '',
          weddingDate: names.weddingDate || '',
          publicMessage: names.publicMessage || ''
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
        formData.brideName, 
        formData.groomName, 
        formData.pixKey,
        formData.weddingDate,
        formData.publicMessage
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

      <div className="preview-section">
        <h3>Prévia da Lista Pública</h3>
        <div className="preview-text">
          {formData.brideName && formData.groomName ? (
            <div>
              <p>Escolha um presente especial para o casal <strong>{formData.brideName}</strong> e <strong>{formData.groomName}</strong>!</p>
              {formData.weddingDate && (
                <p className="date-preview">
                  📅 Data do casamento: <strong>{new Date(formData.weddingDate).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</strong>
                </p>
              )}
              {formData.publicMessage && (
                <p className="message-preview">
                  💬 {formData.publicMessage}
                </p>
              )}
              {formData.pixKey && (
                <p className="pix-preview">
                  Chave PIX para contribuição: <strong>{formData.pixKey}</strong>
                </p>
              )}
            </div>
          ) : (
            <p>Escolha um presente especial para o casal!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoupleSettings;
