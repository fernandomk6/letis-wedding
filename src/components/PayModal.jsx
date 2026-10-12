// Modal de pagamento via Pix
import { useState } from 'react';
import { productService } from '../firebase/services.jsx';
import { formatPrice } from '../utils/status.js';
import ConfirmModal from './ConfirmModal.jsx';
import './ReserveModal.css';

const PayModal = ({ ownerUid, product, pixKey, onClose, onSuccess }) => {
  const [donorName, setDonorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Não foi possível copiar. Selecione a chave e copie manualmente.');
    }
  };

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
      await productService.payProduct(ownerUid, product.id, donorName.trim());
      onSuccess();
    } catch (err) {
      setConfirming(false);
      if (err.message.includes('já foi reservado')) {
        setError('Este presente já foi escolhido por outra pessoa. Por favor, escolha outro presente.');
      } else {
        setError('Erro ao confirmar o pagamento. Tente novamente.');
      }
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Pagar com Pix</h2>
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
              <p className="modal-price">{formatPrice(product.price)}</p>
            </div>
          </div>

          <div className="pix-box">
            <span className="pix-box-label">Chave Pix</span>
            <code className="pix-box-key">{pixKey}</code>
            <button type="button" className="pix-copy-button" onClick={handleCopy}>
              {copied ? 'Copiado!' : 'Copiar chave'}
            </button>
            <p className="pix-box-hint">
              Faça um Pix de {formatPrice(product.price)} e depois confirme o pagamento abaixo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="reserve-form">
            <div className="form-group">
              <label htmlFor="payDonorName">Seu nome completo:</label>
              <input
                type="text"
                id="payDonorName"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Digite seu nome completo"
                required
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button type="button" className="cancel-button" onClick={onClose} disabled={loading}>
                Cancelar
              </button>
              <button type="submit" className="confirm-button" disabled={loading}>
                Confirmar pagamento
              </button>
            </div>
          </form>
        </div>
      </div>

      {confirming && (
        <ConfirmModal
          title="Confirmar pagamento"
          message="Confirma o pagamento do presente?"
          confirmLabel="Sim, confirmar"
          loading={loading}
          onConfirm={handleConfirm}
          onCancel={() => setConfirming(false)}
        />
      )}
    </div>
  );
};

export default PayModal;
