// Product card component for public view
import './ProductCard.css';

const ProductCard = ({ product, onReserveClick }) => {
  const isReserved = product.reservedBy !== null;

  return (
    <div className={`product-card ${isReserved ? 'reserved' : 'available'}`}>
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.title} />
        ) : (
          <div className="placeholder-image">
            <span>🎁</span>
          </div>
        )}
      </div>
      
      <div className="card-product-info">
        <h3 className="product-title">{product.title}</h3>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        
        <div className="product-status">
          {isReserved ? (
            <div className="reserved-info">
              <span className="reserved-by">
                Reservado por: <strong>{product.reservedBy}</strong>
              </span>
            </div>
          ) : (
            <button 
              className="reserve-button"
              onClick={() => onReserveClick(product)}
            >
              Reservar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
