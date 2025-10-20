// Public product list component
import { useState, useEffect } from 'react';
import { productService, getCoupleNames } from '../firebase/services.jsx';
import ProductCard from './ProductCard.jsx';
import ReserveModal from './ReserveModal.jsx';
import Header from './Header.jsx';
import './PublicList.css';

const PublicList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [coupleNames, setCoupleNames] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' ou 'reserved'

  useEffect(() => {
    loadProducts();
    loadCoupleNames();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsData = await productService.getAllProducts();
      setProducts(productsData);
    } catch (error) {
      setError('Erro ao carregar produtos. Tente novamente.');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCoupleNames = async () => {
    try {
      const names = await getCoupleNames();
      setCoupleNames(names);
    } catch (error) {
      // Silenciosamente falha - os nomes do casal são opcionais
      // Se não conseguir carregar, usa a mensagem padrão
      setCoupleNames(null);
    }
  };

  const handleReserveClick = (product) => {
    if (product.reservedBy) {
      alert('Este produto já foi reservado!');
      return;
    }
    setSelectedProduct(product);
    setShowReserveModal(true);
  };

  const handleReserveSuccess = () => {
    setShowReserveModal(false);
    setSelectedProduct(null);
    loadProducts(); // Reload to show updated reservation
  };

  // Filtrar produtos baseado na aba ativa
  const filteredProducts = products.filter(product => {
    if (activeTab === 'pending') {
      return product.reservedBy === null;
    } else {
      return product.reservedBy !== null;
    }
  });

  // Contar produtos por categoria
  const pendingCount = products.filter(p => p.reservedBy === null).length;
  const reservedCount = products.filter(p => p.reservedBy !== null).length;

  if (loading) {
    return (
      <div className="public-list-container">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando lista de presentes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-list-container">
        <Header />
        <div className="error-container">
          <p>{error}</p>
          <button onClick={loadProducts} className="retry-button">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="public-list-container">
      <Header />
      
      <main className="public-main">
        <div className="welcome-section with-background">
          <p>
            <h1>Lista de Presentes</h1>
            {coupleNames && coupleNames.brideName && coupleNames.groomName ? (
              <>Escolha um presente especial para o casal <strong>{coupleNames.brideName}</strong> e <strong>{coupleNames.groomName}</strong>!</>
            ) : (
              'Escolha um presente especial para o casal!'
            )}
          </p>
          {coupleNames && coupleNames.pixKey && (
            <p>
              Chave PIX para contribuição: <strong>{coupleNames.pixKey}</strong>
            </p>
          )}
        </div>

        {/* Abas */}
        <div className="public-tabs">
          <button 
            className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            📋 Pendentes ({pendingCount})
          </button>
          <button 
            className={`tab-button ${activeTab === 'reserved' ? 'active' : ''}`}
            onClick={() => setActiveTab('reserved')}
          >
            ✅ Reservados ({reservedCount})
          </button>
        </div>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>
                {activeTab === 'pending' 
                  ? 'Nenhum presente pendente no momento.' 
                  : 'Nenhum presente reservado ainda.'
                }
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onReserveClick={handleReserveClick}
              />
            ))
          )}
        </div>
      </main>

      {showReserveModal && selectedProduct && (
        <ReserveModal
          product={selectedProduct}
          onClose={() => setShowReserveModal(false)}
          onSuccess={handleReserveSuccess}
        />
      )}
    </div>
  );
};

export default PublicList;
