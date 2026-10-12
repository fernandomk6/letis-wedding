// Modal de confirmação reutilizável (lista pública e admin)
import './ConfirmModal.css';

const ConfirmModal = ({
  title = 'Confirmar',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  danger = false,
  loading = false,
  error = '',
  children,
  onConfirm,
  onCancel
}) => (
  <div
    className="confirm-modal-overlay"
    onClick={(e) => {
      e.stopPropagation();
      if (!loading) onCancel();
    }}
  >
    <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
      <h3 className="confirm-modal-title">{title}</h3>
      <p className="confirm-modal-message">{message}</p>
      {children}
      {error && <div className="confirm-modal-error">{error}</div>}
      <div className="confirm-modal-actions">
        <button
          type="button"
          className="confirm-modal-cancel"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          className={`confirm-modal-confirm${danger ? ' danger' : ''}`}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? 'Aguarde...' : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
