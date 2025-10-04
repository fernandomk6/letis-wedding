// Reserve modal component
import { useState } from 'react';
import { productService } from '../firebase/services.jsx';
import './ReserveModal.css';

const ReserveModal = ({ product, onClose, onSuccess }) => {
  const [donorName, setDonorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!donorName.trim()) {
      setError('Por favor, digite seu nome.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await productService.reserveProduct(product.id, donorName.trim());
      onSuccess();
    } catch (error) {
      if (error.message.includes('já foi reservado')) {
        setError('Este produto já foi reservado por outra pessoa. Por favor, escolha outro presente.');
      } else {
        setError('Erro ao reservar o produto. Tente novamente.');
      }
      console.error('Reservation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Reservar Presente</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="product-preview">
            <div className="product-image">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.title} />
              ) : (
                <div className="placeholder-image">
                  <span>🎁</span>
                </div>
              )}
            </div>
            
            <div className="product-details">
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              {product.price && (
                <div className="price">{formatPrice(product.price)}</div>
              )}
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="reserve-form">
            <div className="form-group">
              <label htmlFor="donorName">Seu nome completo:</label>
              <input
                type="text"
                id="donorName"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Digite seu nome completo"
                required
                disabled={loading}
              />
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <div className="modal-actions">
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
                className="confirm-button"
                disabled={loading}
              >
                {loading ? 'Reservando...' : 'Confirmar Reserva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReserveModal;
