// Admin dashboard component
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { productService } from '../firebase/services.jsx';
import ProductForm from './ProductForm.jsx';
import ProductTable from './ProductTable.jsx';
import AdminHeader from './AdminHeader.jsx';
import CoupleSettings from './CoupleSettings.jsx';
import { getProductStatus, STATUS } from '../utils/status.js';
import './AdminDashboard.css';

// Ordem de exibição: disponíveis, reservados, pagos e recebidos
const STATUS_ORDER = [STATUS.AVAILABLE, STATUS.RESERVED, STATUS.PAID, STATUS.RECEIVED];

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const ownerUid = user.uid;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [donorFilter, setDonorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const productsData = await productService.getAllProducts(ownerUid);
      setProducts(productsData);
    } catch (error) {
      setError('Erro ao carregar presentes.');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData) => {
    try {
      await productService.createProduct(ownerUid, productData);
      setShowForm(false);
      loadProducts();
    } catch (error) {
      setError('Erro ao criar presente.');
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async (productId, updateData) => {
    try {
      await productService.updateProduct(ownerUid, productId, updateData);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      setError('Erro ao atualizar presente.');
      console.error('Error updating product:', error);
    }
  };

  // As ações abaixo recarregam a lista e repassam o erro para o diálogo da tabela
  const runAction = (action, errorMessage) => async (...args) => {
    try {
      await action(...args);
    } catch (error) {
      console.error(errorMessage, error);
      throw error;
    } finally {
      loadProducts(true);
    }
  };

  const handleDeleteProduct = runAction(
    (id) => productService.deleteProduct(ownerUid, id), 'Error deleting product:'
  );
  const handleReleaseProduct = runAction(
    (id) => productService.releaseProduct(ownerUid, id), 'Error releasing product:'
  );
  const handleReturnProduct = runAction(
    (id) => productService.returnProduct(ownerUid, id), 'Error returning product:'
  );
  const handleTransferReservation = runAction(
    (id, name) => productService.transferReservation(ownerUid, id, name), 'Error transferring reservation:'
  );
  const handleAssignDonor = runAction(
    (id, name) => productService.assignDonor(ownerUid, id, name), 'Error assigning donor:'
  );
  const handleMarkReceived = runAction(
    (id, name) => productService.markReceived(ownerUid, id, name), 'Error marking as received:'
  );

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDonor = !donorFilter ||
      (product.reservedBy && product.reservedBy.toLowerCase().includes(donorFilter.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || getProductStatus(product) === statusFilter;

    return matchesSearch && matchesDonor && matchesStatus;
  }).sort((a, b) =>
    STATUS_ORDER.indexOf(getProductStatus(a)) - STATUS_ORDER.indexOf(getProductStatus(b))
  );

  const handleCopyPublicLink = async () => {
    try {
      // Criar URL da lista pública
      const publicUrl = `${window.location.origin}/l/${ownerUid}`;
      
      await navigator.clipboard.writeText(publicUrl);
      
      // Mostrar feedback visual
      const button = document.querySelector('.copy-link-button');
      const originalText = button.textContent;
      button.textContent = '✅ Link Copiado!';
      button.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
      }, 2000);
    } catch (error) {
      console.error('Erro ao copiar link:', error);
      alert('Erro ao copiar link. Tente novamente.');
    }
  };

  const handleViewPublicList = () => {
    window.open(`/l/${ownerUid}`, '_blank');
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <AdminHeader onSignOut={signOut} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <AdminHeader onSignOut={signOut} />
      
      <main className="admin-main">
        <div className="dashboard-header">
          <h1>Dashboard Administrativo</h1>
          <div className="header-buttons">
            <button 
              className="view-public-button"
              onClick={handleViewPublicList}
            >
              📋 Lista Pública
            </button>
            <button 
              className="copy-link-button"
              onClick={handleCopyPublicLink}
            >
              📋 Copiar Link Público
            </button>
            <button 
              className="add-product-button"
              onClick={() => setShowForm(true)}
            >
              + Adicionar Presente
            </button>
          </div>
        </div>

        <div className="admin-tabs">
          <button 
            className={`tab-button-admin ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Gerenciar Presentes
          </button>
          <button 
            className={`tab-button-admin ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            💕 Configurações do Casal
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {activeTab === 'products' && (
          <>
            <div className="filters-section">
              <div className="filter-group">
                <label htmlFor="search">Buscar por presente:</label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite o nome do presente..."
                />
              </div>
              
              <div className="filter-group">
                <label htmlFor="donor">Filtrar por doador:</label>
                <input
                  type="text"
                  id="donor"
                  value={donorFilter}
                  onChange={(e) => setDonorFilter(e.target.value)}
                  placeholder="Digite o nome do doador..."
                />
              </div>
            </div>

            <div className="stats-section">
              <div
                className={`stat-card clickable ${statusFilter === 'all' ? 'selected' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                <h3>Total de Presentes</h3>
                <span className="stat-number">{products.length}</span>
              </div>
              {STATUS_ORDER.map((status) => (
                <div
                  key={status}
                  className={`stat-card clickable ${statusFilter === status ? 'selected' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  <h3>{status === 'available' ? 'Disponíveis' : status === 'reserved' ? 'Reservados' : status === 'paid' ? 'Pagos' : 'Recebidos'}</h3>
                  <span className="stat-number">
                    {products.filter(p => getProductStatus(p) === status).length}
                  </span>
                </div>
              ))}
            </div>

            <ProductTable
              products={filteredProducts}
              onEdit={setEditingProduct}
              onDelete={handleDeleteProduct}
              onRelease={handleReleaseProduct}
              onReturn={handleReturnProduct}
              onTransferReservation={handleTransferReservation}
              onAssignDonor={handleAssignDonor}
              onMarkReceived={handleMarkReceived}
            />
          </>
        )}

        {activeTab === 'settings' && (
          <CoupleSettings ownerUid={ownerUid} />
        )}
      </main>

      {showForm && (
        <ProductForm
          onSubmit={handleCreateProduct}
          onClose={() => setShowForm(false)}
        />
      )}

      {editingProduct && (
        <ProductForm
          product={editingProduct}
          onSubmit={(data) => handleUpdateProduct(editingProduct.id, data)}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
