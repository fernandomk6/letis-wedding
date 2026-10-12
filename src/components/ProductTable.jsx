// Product table component for admin
import { useState } from 'react';
import { getProductStatus, STATUS, STATUS_LABELS, formatPrice } from '../utils/status.js';
import ConfirmModal from './ConfirmModal.jsx';
import './ProductTable.css';

const Icon = ({ size, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

const ICONS = {
  edit: (
    <>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </>
  ),
  delete: (
    <>
      <polyline points="3,6 5,6 21,6"/>
      <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
      <line x1="10" y1="11" x2="10" y2="17"/>
      <line x1="14" y1="11" x2="14" y2="17"/>
    </>
  ),
  transfer: (
    <>
      <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2z"/>
      <path d="m8 21 4-7 4 7"/>
      <path d="M12 3v18"/>
    </>
  ),
  release: (
    <>
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </>
  ),
  donor: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <line x1="19" y1="8" x2="19" y2="14"/>
      <line x1="16" y1="11" x2="22" y2="11"/>
    </>
  ),
  received: (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </>
  ),
  return: (
    <>
      <polyline points="1 4 1 10 7 10"/>
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
    </>
  )
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

const ProductTable = ({
  products,
  onEdit,
  onDelete,
  onRelease,
  onReturn,
  onTransferReservation,
  onAssignDonor,
  onMarkReceived
}) => {
  // dialog: { kind, product, step: 'name' | 'confirm' }
  const [dialog, setDialog] = useState(null);
  const [name, setName] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [busy, setBusy] = useState(false);

  const openDialog = (kind, product) => {
    const needsName =
      kind === 'transfer' ||
      kind === 'assign' ||
      (kind === 'receive' && getProductStatus(product) === STATUS.AVAILABLE);
    setName('');
    setDialogError('');
    setDialog({ kind, product, step: needsName ? 'name' : 'confirm' });
  };

  const closeDialog = () => {
    if (!busy) setDialog(null);
  };

  const run = async (action) => {
    setBusy(true);
    try {
      await action();
      setDialog(null);
    } catch (err) {
      setDialogError('Não foi possível concluir a ação. Tente novamente.');
    } finally {
      setBusy(false);
    }
  };

  const handleNameStep = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setDialogError('Informe o nome do doador.');
      return;
    }
    setDialogError('');
    const { kind, product } = dialog;
    if (kind === 'receive') {
      setDialog({ kind, product, step: 'confirm' });
    } else if (kind === 'transfer') {
      run(() => onTransferReservation(product.id, trimmed));
    } else {
      run(() => onAssignDonor(product.id, trimmed));
    }
  };

  const handleConfirmStep = () => {
    const { kind, product } = dialog;
    if (kind === 'delete') return run(() => onDelete(product.id));
    if (kind === 'release') return run(() => onRelease(product.id));
    if (kind === 'return') return run(() => onReturn(product.id));
    return run(() => onMarkReceived(product.id, name.trim()));
  };

  const renderDialog = () => {
    if (!dialog) return null;
    const { kind, product, step } = dialog;
    const status = getProductStatus(product);

    if (step === 'name') {
      const titles = {
        transfer: 'Transferir reserva',
        assign: 'Adicionar doador',
        receive: 'Marcar como recebido'
      };
      return (
        <ConfirmModal
          title={titles[kind]}
          message={`Informe o nome do doador de “${product.title}”.`}
          confirmLabel={kind === 'receive' ? 'Continuar' : 'Salvar'}
          loading={busy}
          error={dialogError}
          onConfirm={handleNameStep}
          onCancel={closeDialog}
        >
          <input
            type="text"
            className="confirm-modal-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNameStep()}
            placeholder="Digite o nome completo"
            autoFocus
          />
        </ConfirmModal>
      );
    }

    const config = {
      delete: {
        title: 'Excluir presente',
        message: `Tem certeza que deseja excluir “${product.title}”?`,
        confirmLabel: 'Excluir',
        danger: true
      },
      release: {
        title: status === STATUS.PAID ? 'Estornar pagamento' : 'Desvincular presente',
        message: status === STATUS.PAID
          ? `Estornar o pagamento de “${product.title}”? O presente volta a ficar disponível, sem doador.`
          : `Desvincular “${product.title}” de ${product.reservedBy}? O presente volta a ficar disponível.`,
        confirmLabel: status === STATUS.PAID ? 'Estornar' : 'Desvincular',
        danger: true
      },
      return: {
        title: 'Devolver presente',
        message: `Devolver “${product.title}”? O presente volta a ficar disponível, sem doador.`,
        confirmLabel: 'Devolver',
        danger: true
      },
      receive: {
        title: 'Confirmar recebimento',
        message: `Confirma o recebimento do item “${product.title}” do doador “${name.trim() || product.reservedBy}”?`,
        confirmLabel: 'Confirmar recebimento',
        danger: false
      }
    }[kind];

    return (
      <ConfirmModal
        {...config}
        loading={busy}
        error={dialogError}
        onConfirm={handleConfirmStep}
        onCancel={closeDialog}
      />
    );
  };

  // Ações disponíveis para cada status
  const getActions = (product) => {
    const status = getProductStatus(product);
    const edit = { key: 'edit', className: 'edit-button', title: 'Editar presente', label: 'Editar', icon: ICONS.edit, onClick: () => onEdit(product) };
    const remove = { key: 'delete', className: 'delete-button', title: 'Excluir presente', label: 'Excluir', icon: ICONS.delete, onClick: () => openDialog('delete', product) };
    const assign = { key: 'assign', className: 'donor-button', title: 'Adicionar doador', label: 'Adicionar doador', icon: ICONS.donor, onClick: () => openDialog('assign', product) };
    const receive = { key: 'receive', className: 'received-button', title: 'Marcar como recebido', label: 'Recebido', icon: ICONS.received, onClick: () => openDialog('receive', product) };
    const transfer = { key: 'transfer', className: 'transfer-button', title: 'Transferir reserva', label: 'Transferir', icon: ICONS.transfer, onClick: () => openDialog('transfer', product) };
    const release = { key: 'release', className: 'unreserve-button', title: 'Desvincular presente', label: 'Desvincular', icon: ICONS.release, onClick: () => openDialog('release', product) };
    const refund = { ...release, title: 'Estornar pagamento', label: 'Estornar' };
    const giveBack = { key: 'return', className: 'return-button', title: 'Devolver presente', label: 'Devolver', icon: ICONS.return, onClick: () => openDialog('return', product) };

    switch (status) {
      case STATUS.AVAILABLE: return [edit, remove, assign, receive];
      case STATUS.RESERVED: return [transfer, receive, release];
      case STATUS.PAID: return [receive, refund];
      case STATUS.RECEIVED: return [giveBack];
      default: return [];
    }
  };

  const renderStatusBadge = (product) => {
    const status = getProductStatus(product);
    return <span className={`status-badge ${status}`}>{STATUS_LABELS[status]}</span>;
  };

  // Data relevante conforme o status
  const getStatusDate = (product) => {
    const status = getProductStatus(product);
    if (status === STATUS.PAID) return product.paidAt || product.reservedAt;
    if (status === STATUS.RECEIVED) return product.receivedAt;
    return product.reservedAt;
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
      {/* Desktop Table View */}
      <div className="products-table-container desktop-view">
        <table className="products-table">
          <thead>
            <tr>
              <th>Presente</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Doador</th>
              <th>Data</th>
              <th>Comentário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={getProductStatus(product)}>
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
                <td className="price">{formatPrice(product.price) || '-'}</td>
                <td className="status">{renderStatusBadge(product)}</td>
                <td className="donor">{product.reservedBy || '-'}</td>
                <td className="reserved-date">{formatDate(getStatusDate(product))}</td>
                <td className="comment">{product.comment || '-'}</td>
                <td className="actions">
                  <div className="action-buttons">
                    {getActions(product).map((action) => (
                      <button
                        key={action.key}
                        className={action.className}
                        onClick={action.onClick}
                        title={action.title}
                      >
                        <Icon size={24}>{action.icon}</Icon>
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="products-cards-container mobile-view">
        {products.map((product) => (
          <div key={product.id} className={`product-card ${getProductStatus(product)}`}>
            <div className="card-header">
              <div className="card-product-image">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.title} />
                ) : (
                  <div className="placeholder">🎁</div>
                )}
              </div>
              <div className="card-product-info">
                <h4>{product.title}</h4>
                <p>{product.description}</p>
              </div>
            </div>

            <div className="card-body">
              <div className="card-row">
                <span className="card-label">Valor:</span>
                <span className="card-value">{formatPrice(product.price) || '-'}</span>
              </div>

              <div className="card-row">
                <span className="card-label">Status:</span>
                {renderStatusBadge(product)}
              </div>

              {product.reservedBy && (
                <div className="card-row">
                  <span className="card-label">Doador:</span>
                  <span className="card-value">{product.reservedBy}</span>
                </div>
              )}

              {getStatusDate(product) && (
                <div className="card-row">
                  <span className="card-label">Data:</span>
                  <span className="card-value">{formatDate(getStatusDate(product))}</span>
                </div>
              )}

              {product.comment && (
                <div className="card-row">
                  <span className="card-label">Comentário:</span>
                  <span className="card-value">{product.comment}</span>
                </div>
              )}
            </div>

            <div className="card-actions">
              {getActions(product).map((action) => (
                <button
                  key={action.key}
                  className={action.className}
                  onClick={action.onClick}
                  title={action.title}
                >
                  <Icon size={20}>{action.icon}</Icon>
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {renderDialog()}
    </>
  );
};

export default ProductTable;
