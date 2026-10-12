// Public product list component
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService, getCoupleNames } from '../firebase/services.jsx';
import ProductCard from './ProductCard.jsx';
import ReserveModal from './ReserveModal.jsx';
import PayModal from './PayModal.jsx';
import CommentModal from './CommentModal.jsx';
import Header from './Header.jsx';
import { getPaletteStyle } from '../theme/palettes.js';
import { getProductStatus, STATUS } from '../utils/status.js';
import florDate from '../assets/img/flor-date.svg';
import './PublicList.css';

const PublicList = () => {
  const { uid: ownerUid } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [commentProduct, setCommentProduct] = useState(null);
  const [maxPrice, setMaxPrice] = useState('');
  const [coupleNames, setCoupleNames] = useState(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    loadProducts();
    loadCoupleNames();
  }, [ownerUid]);

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

  const loadProducts = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const productsData = await productService.getAllProducts(ownerUid);
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
      const names = await getCoupleNames(ownerUid);
      setCoupleNames(names);
    } catch (error) {
      // Silenciosamente falha - os nomes do casal são opcionais
      // Se não conseguir carregar, usa a mensagem padrão
      setCoupleNames(null);
    }
  };

  const handleReserveClick = (product) => {
    setSelectedProduct(product);
    setShowReserveModal(true);
  };

  const handlePayClick = (product) => {
    setSelectedProduct(product);
    setShowPayModal(true);
  };

  // Após reservar/pagar: fecha o modal, atualiza a lista e pede um comentário
  const handleActionSuccess = () => {
    setCommentProduct(selectedProduct);
    setShowReserveModal(false);
    setShowPayModal(false);
    setSelectedProduct(null);
    loadProducts(true);
  };

  const pixKey = coupleNames?.pixKey?.trim() || '';
  const max = maxPrice === '' ? null : Number(maxPrice);
  const hasPriceFilter = max !== null;

  // Mostrar apenas presentes disponíveis, respeitando o filtro de valor
  const filteredProducts = products.filter(product => {
    if (getProductStatus(product) !== STATUS.AVAILABLE) return false;
    if (!hasPriceFilter) return true;
    if (typeof product.price !== 'number') return false;
    return product.price <= max;
  });

  // Com o filtro de valor ativo, ordena do menor para o maior
  if (hasPriceFilter) filteredProducts.sort((a, b) => a.price - b.price);

  const paletteStyle = getPaletteStyle(coupleNames?.paletteId);

  if (loading) {
    return (
      <div className="public-list-container" style={paletteStyle}>
        <Header ownerUid={ownerUid} />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando lista de presentes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-list-container" style={paletteStyle}>
        <Header ownerUid={ownerUid} />
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => loadProducts()} className="retry-button">
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="public-list-container" style={paletteStyle}>
      <div className="flower-decoration-bg flower-bg-1"></div>
      <div className="flower-decoration-bg flower-bg-2"></div>
      <div className="flower-decoration-bg flower-bg-3"></div>
      <div className="flower-decoration-bg flower-bg-4"></div>
      
      <Header ownerUid={ownerUid} />
      
      <main className="public-main">
        
        <div className="welcome-section">          
          {coupleNames && coupleNames.brideName && coupleNames.groomName ? (
            <p className="couple-names">
              <strong>{coupleNames.brideName} & {coupleNames.groomName}.</strong>
            </p>
          ) : (
            <p>Escolha um presente especial para o casal!</p>
          )}

          {coupleNames && coupleNames.weddingDate && (
            <div className="countdown-section">
              <p className="countdown-title">Contagem regressiva para o grande dia</p>
              {coupleNames && coupleNames.weddingDate && (
                <p className="wedding-date">
                  <strong>{new Date(coupleNames.weddingDate).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'UTC' }).replace(/\//g, '.')}</strong>
                </p>
              )}
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

        <div className="price-filter">
          <label htmlFor="maxPrice" className="price-filter-label">Valor menor:</label>
          <input
            type="number"
            id="maxPrice"
            min="0"
            step="0.01"
            inputMode="decimal"
            placeholder="R$"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          {hasPriceFilter && (
            <button type="button" className="price-filter-clear" onClick={() => setMaxPrice('')}>
              Limpar
            </button>
          )}
        </div>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <p>
                {hasPriceFilter
                  ? 'Nenhum presente disponível nessa faixa de valor.'
                  : 'Nenhum presente pendente no momento.'}
              </p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                canPay={Boolean(pixKey) && typeof product.price === 'number' && product.price > 0}
                onReserveClick={handleReserveClick}
                onPayClick={handlePayClick}
              />
            ))
          )}
        </div>
      </main>

      {showReserveModal && selectedProduct && (
        <ReserveModal
          ownerUid={ownerUid}
          product={selectedProduct}
          onClose={() => setShowReserveModal(false)}
          onSuccess={handleActionSuccess}
        />
      )}

      {showPayModal && selectedProduct && (
        <PayModal
          ownerUid={ownerUid}
          product={selectedProduct}
          pixKey={pixKey}
          onClose={() => setShowPayModal(false)}
          onSuccess={handleActionSuccess}
        />
      )}

      {commentProduct && (
        <CommentModal
          ownerUid={ownerUid}
          product={commentProduct}
          onClose={() => setCommentProduct(null)}
        />
      )}
    </div>
  );
};

export default PublicList;
