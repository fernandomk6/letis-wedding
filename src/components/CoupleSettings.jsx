import React, { useState, useEffect } from 'react';
import { updateCoupleNames, getCoupleNames } from '../firebase/services.jsx';
import './CoupleSettings.css';

const CoupleSettings = () => {
  const [formData, setFormData] = useState({
    brideName: '',
    groomName: ''
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
          groomName: names.groomName || ''
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
      await updateCoupleNames(formData.brideName, formData.groomName);
      setMessage('Nomes do casal atualizados com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao atualizar nomes:', error);
      setMessage('Erro ao atualizar nomes do casal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="couple-settings">
      <div className="settings-header">
        <h2>💕 Configurações do Casal</h2>
        <p>Configure os nomes da noiva e do noivo para exibir na lista de presentes</p>
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

        <button 
          type="submit" 
          className="save-button"
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Nomes'}
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
            <p>Escolha um presente especial para o casal <strong>{formData.brideName}</strong> e <strong>{formData.groomName}</strong>!</p>
          ) : (
            <p>Escolha um presente especial para o casal!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoupleSettings;
