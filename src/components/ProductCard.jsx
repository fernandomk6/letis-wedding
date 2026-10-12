// Product card component for public view
import { formatPrice } from '../utils/status.js';
import './ProductCard.css';

const ProductCard = ({ product, canPay, onReserveClick, onPayClick }) => {
  const price = formatPrice(product.price);

  return (
    <div className="product-card available">
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
        {price && <p className="product-price">{price}</p>}

        <div className="product-status">
          <div className="product-actions">
            <button
              className="reserve-button"
              onClick={() => onReserveClick(product)}
            >
              Reservar
            </button>
            {canPay && (
              <button
                className="reserve-button pay-button"
                onClick={() => onPayClick(product)}
              >
                Pagar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
