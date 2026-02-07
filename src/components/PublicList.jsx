// Public product list component
import { useState, useEffect } from 'react';
import { productService, getCoupleNames } from '../firebase/services.jsx';
import ProductCard from './ProductCard.jsx';
import ReserveModal from './ReserveModal.jsx';
import Header from './Header.jsx';
import florDate from '../assets/img/flor-date.svg';
import './PublicList.css';

const PublicList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [coupleNames, setCoupleNames] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    loadProducts();
    loadCoupleNames();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!coupleNames?.weddingDate) return;

    const calculateCountdown = () => {
      const now = new Date();
      const weddingDate = new Date(coupleNames.weddingDate + 'T00:00:00');
      const difference = weddingDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown({ days, hours, minutes, seconds });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const timer = setInterval(calculateCountdown, 1000);

    return () => clearInterval(timer);
  }, [coupleNames]);

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

  // Mostrar apenas produtos pendentes (não reservados)
  const filteredProducts = products.filter(product => product.reservedBy === null);

  // Contar produtos pendentes
  const pendingCount = filteredProducts.length;

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
      <div className="flower-decoration-bg flower-bg-1"></div>
      <div className="flower-decoration-bg flower-bg-2"></div>
      <div className="flower-decoration-bg flower-bg-3"></div>
      <div className="flower-decoration-bg flower-bg-4"></div>
      
      <Header />
      
      <main className="public-main">
        
        <div className="welcome-section">          
          {coupleNames && coupleNames.brideName && coupleNames.groomName ? (
            <p className="couple-names">
              <strong>{coupleNames.brideName} & {coupleNames.groomName}.</strong>
            </p>
          ) : (
            <p>Escolha um presente especial para o casal!</p>
          )}

          {coupleNames.weddingDate && (
            <p className="wedding-date">
              <strong>{new Date(coupleNames.weddingDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).replace(/\//g, '.')}</strong>
            </p>
          )}

          {coupleNames && coupleNames.weddingDate && (
            <div className="countdown-section">
              <p className="countdown-title">Contagem regressiva para o grande dia</p>
              <div className="countdown-container">
                <div className="countdown-item">
                  <div className="countdown-box">
                    <div className="countdown-number">{countdown.days}</div>
                  </div>
                  <div className="countdown-label">Dias</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-box">
                    <div className="countdown-number">{countdown.hours}</div>
                  </div>
                  <div className="countdown-label">Horas</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-box">
                    <div className="countdown-number">{countdown.minutes}</div>
                  </div>
                  <div className="countdown-label">Minutos</div>
                </div>
                <div className="countdown-item">
                  <div className="countdown-box">
                    <div className="countdown-number">{countdown.seconds}</div>
                  </div>
                  <div className="countdown-label">Segundos</div>
                </div>
              </div>
            </div>
          )}
          
          {coupleNames && coupleNames.publicMessage && (
            <p className="public-message">
              {coupleNames.publicMessage}
            </p>
          )}
          
          <img src={florDate} alt="decoração" className="welcome-divider" />
        </div>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>
                Nenhum presente pendente no momento.
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
