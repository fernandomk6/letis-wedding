// Reserve modal component
import { useState } from 'react';
import { productService } from '../firebase/services.jsx';
import { formatPrice } from '../utils/status.js';
import ConfirmModal from './ConfirmModal.jsx';
import './ReserveModal.css';

const ReserveModal = ({ ownerUid, product, onClose, onSuccess }) => {
  const [donorName, setDonorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!donorName.trim()) {
      setError('Por favor, digite seu nome.');
      return;
    }

    setError('');
    setConfirming(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError('');

    try {
      await productService.reserveProduct(ownerUid, product.id, donorName.trim());
      onSuccess();
    } catch (error) {
      setConfirming(false);
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
              {formatPrice(product.price) && <p className="modal-price">{formatPrice(product.price)}</p>}
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
                Confirmar Reserva
              </button>
            </div>
          </form>
        </div>
      </div>

      {confirming && (
        <ConfirmModal
          title="Confirmar reserva"
          message="Confirma a reserva do presente?"
          confirmLabel="Sim, reservar"
          loading={loading}
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
};

export default ReserveModal;
