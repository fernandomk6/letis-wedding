// Admin dashboard component
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { productService } from '../firebase/services.jsx';
import ProductForm from './ProductForm.jsx';
import ProductTable from './ProductTable.jsx';
import AdminHeader from './AdminHeader.jsx';
import CoupleSettings from './CoupleSettings.jsx';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [donorFilter, setDonorFilter] = useState('');
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productService.getAllProducts();
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
      await productService.createProduct(productData);
      setShowForm(false);
      loadProducts();
    } catch (error) {
      setError('Erro ao criar presente.');
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async (productId, updateData) => {
    try {
      await productService.updateProduct(productId, updateData);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      setError('Erro ao atualizar presente.');
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Tem certeza que deseja excluir este presente?')) {
      try {
        await productService.deleteProduct(productId);
        loadProducts();
      } catch (error) {
        setError('Erro ao excluir presente.');
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleUnreserveProduct = async (productId) => {
    if (window.confirm('Tem certeza que deseja desvincular este presente?')) {
      try {
        await productService.unreserveProduct(productId);
        loadProducts();
      } catch (error) {
        setError('Erro ao desvincular presente.');
        console.error('Error unreserving product:', error);
      }
    }
  };

  const handleTransferReservation = async (productId, newDonorName) => {
    try {
      await productService.transferReservation(productId, newDonorName);
      loadProducts();
    } catch (error) {
      setError('Erro ao transferir reserva.');
      console.error('Error transferring reservation:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm ||
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDonor = !donorFilter ||
      (product.reservedBy && product.reservedBy.toLowerCase().includes(donorFilter.toLowerCase()));
    
    return matchesSearch && matchesDonor;
  });

  const handleCopyPublicLink = async () => {
    try {
      // Criar URL da lista pública
      const publicUrl = `${window.location.origin}/public`;
      
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
    window.open('/public', '_blank');
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
            className={`tab-button ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            📦 Gerenciar Presentes
          </button>
          <button 
            className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
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
              <div className="stat-card">
                <h3>Total de Presentes</h3>
                <span className="stat-number">{products.length}</span>
              </div>
              <div className="stat-card">
                <h3>Reservados</h3>
                <span className="stat-number">
                  {products.filter(p => p.reservedBy).length}
                </span>
              </div>
              <div className="stat-card">
                <h3>Disponíveis</h3>
                <span className="stat-number">
                  {products.filter(p => !p.reservedBy).length}
                </span>
              </div>
            </div>

            <ProductTable
              products={filteredProducts}
              onEdit={setEditingProduct}
              onDelete={handleDeleteProduct}
              onUnreserve={handleUnreserveProduct}
              onTransferReservation={handleTransferReservation}
            />
          </>
        )}

        {activeTab === 'settings' && (
          <CoupleSettings />
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
