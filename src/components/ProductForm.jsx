// Product form component for admin
import { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title || '',
        description: product.description || '',
        imageUrl: product.imageUrl || ''
      });
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const submitData = {
        ...formData
      };

      await onSubmit(submitData);
    } catch (error) {
      setError('Erro ao salvar presente.');
      console.error('Form submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaste = async (e) => {
    e.preventDefault();
    
    try {
      // Verificar se há dados de imagem na área de transferência
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        // Verificar se é uma imagem
        if (item.type.indexOf('image') !== -1) {
          const file = item.getAsFile();
          
          if (file) {
            // Converter arquivo para base64
            const reader = new FileReader();
            reader.onload = (event) => {
              const base64String = event.target.result;
              setFormData(prev => ({
                ...prev,
                imageUrl: base64String
              }));
            };
            reader.readAsDataURL(file);
            return;
          }
        }
      }
      
      // Se não for imagem, tentar colar como texto (URL)
      const text = e.clipboardData?.getData('text');
      if (text && text.startsWith('http')) {
        setFormData(prev => ({
          ...prev,
          imageUrl: text
        }));
      }
    } catch (error) {
      console.error('Erro ao processar imagem colada:', error);
    }
  };

  return (
    <div 
      className="product-form-modal-overlay" 
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(36, 70, 103, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
        boxSizing: 'border-box',
        margin: 0
      }}
    >
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 20px 40px rgba(36, 70, 103, 0.2)',
          margin: '0 auto',
          position: 'relative'
        }}
      >
        <div className="modal-header">
          <h2>{product ? 'Editar Presente' : 'Adicionar Presente'}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="title">Nome do Presente *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Ex: Jogo de panelas inox"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Ex: Conjunto 5 peças, material inox..."
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl">URL da Imagem</label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              onPaste={handlePaste}
              placeholder="Cole uma imagem aqui"
              disabled={loading}
            />
            {formData.imageUrl && (
              <div className="image-preview">
                <img 
                  src={formData.imageUrl} 
                  alt="Preview" 
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="image-error" style={{display: 'none'}}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="15" y1="9" x2="9" y2="15"/>
                    <line x1="9" y1="9" x2="15" y2="15"/>
                  </svg>
                  <span>Erro ao carregar imagem</span>
                </div>
              </div>
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (product ? 'Atualizar' : 'Adicionar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
