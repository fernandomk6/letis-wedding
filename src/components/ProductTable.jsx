// Product table component for admin
import { useState } from 'react';
import './ProductTable.css';

const ProductTable = ({ 
  products, 
  onEdit, 
  onDelete, 
  onUnreserve, 
  onTransferReservation 
}) => {
  const [transferModal, setTransferModal] = useState(null);

  const formatPrice = (price) => {
    if (!price) return 'Não informado';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleTransferClick = (product) => {
    setTransferModal(product);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    const newDonorName = e.target.donorName.value.trim();
    if (newDonorName) {
      onTransferReservation(transferModal.id, newDonorName);
      setTransferModal(null);
    }
  };

  if (products.length === 0) {
    return (
        <div className="empty-state">
          <p>Nenhum presente encontrado.</p>
        </div>
    );
  }

  return (
    <>
      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Presente</th>
              <th>Preço</th>
              <th>Status</th>
              <th>Doador</th>
              <th>Data Reserva</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={product.reservedBy ? 'reserved' : 'available'}>
                <td className="table-product-info">
                  <div className="table-product-image">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.title} />
                    ) : (
                      <div className="placeholder">🎁</div>
                    )}
                  </div>
                  <div className="product-details">
                    <h4>{product.title}</h4>
                    <p>{product.description}</p>
                  </div>
                </td>
                <td className="price">{formatPrice(product.price)}</td>
                <td className="status">
                  <span className={`status-badge ${product.reservedBy ? 'reserved' : 'available'}`}>
                    {product.reservedBy ? 'Reservado' : 'Disponível'}
                  </span>
                </td>
                <td className="donor">
                  {product.reservedBy || '-'}
                </td>
                <td className="reserved-date">
                  {formatDate(product.reservedAt)}
                </td>
                <td className="actions">
                  <div className="action-buttons">
                    <button 
                      className="edit-button"
                      onClick={() => onEdit(product)}
                      title="Editar presente"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => onDelete(product.id)}
                      title="Excluir presente"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                      </svg>
                    </button>
                    {product.reservedBy ? (
                      <>
                        <button 
                          className="transfer-button"
                          onClick={() => handleTransferClick(product)}
                          title="Transferir reserva"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2z"/>
                            <path d="m8 21 4-7 4 7"/>
                            <path d="M12 3v18"/>
                          </svg>
                        </button>
                        <button 
                          className="unreserve-button"
                          onClick={() => onUnreserve(product.id)}
                          title="Desvincular presente"
                        >
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                          </svg>
                        </button>
                      </>
                    ) : (
                      <span className="no-actions">-</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {transferModal && (
        <div className="modal-overlay" onClick={() => setTransferModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Transferir Reserva</h3>
              <button 
                className="close-button" 
                onClick={() => setTransferModal(null)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleTransferSubmit} className="transfer-form">
              <div className="form-group">
                <label htmlFor="donorName">Novo nome do doador:</label>
                <input
                  type="text"
                  id="donorName"
                  required
                  placeholder="Digite o nome completo"
                />
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setTransferModal(null)}>
                  Cancelar
                </button>
                <button type="submit">Transferir</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductTable;
