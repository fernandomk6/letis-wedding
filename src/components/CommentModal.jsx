// Modal para o convidado deixar um comentário após reservar ou pagar
import { useState } from 'react';
import { productService } from '../firebase/services.jsx';
import './ReserveModal.css';

const CommentModal = ({ ownerUid, product, onClose }) => {
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      onClose();
      return;
    }

    setLoading(true);
    setError('');
    try {
      await productService.addComment(ownerUid, product.id, comment);
      onClose();
    } catch (err) {
      setError('Erro ao enviar o comentário. Tente novamente.');
      console.error('Comment error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Deixe um recado</h2>
        </div>

        <div className="modal-body">
          <p className="modal-intro">
            Obrigado pelo carinho! Quer deixar um comentário para o casal sobre “{product.title}”?
          </p>

          <form onSubmit={handleSubmit} className="reserve-form">
            <div className="form-group">
              <label htmlFor="comment">Comentário (opcional):</label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Escreva sua mensagem"
                maxLength={500}
                rows={4}
                disabled={loading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="modal-actions">
              <button type="button" className="cancel-button" onClick={onClose} disabled={loading}>
                Pular
              </button>
              <button type="submit" className="confirm-button" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar comentário'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
