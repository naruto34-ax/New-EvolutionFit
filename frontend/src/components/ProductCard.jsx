import { formatCOP, discountPercent } from '../utils/format';

export default function ProductCard({ product: p, onAdd, onView }) {
  const discount = discountPercent(p.price, p.originalPrice);
  const soldOut = p.stock <= 0;
  const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');

  return (
    <div className="product-card" style={soldOut ? { opacity: 0.7 } : undefined}>
      {p.badge && <div className="product-badge">{p.badge}</div>}
      {discount > 0 && <div className="product-discount">-{discount}%</div>}
      <div className="product-emoji">{p.emoji}</div>
      <div className="product-body">
        <h3 className="product-name">{p.name}</h3>
        <p className="product-desc">{p.description}</p>
        <div className="product-rating">
          <span style={{ color: '#F7971E' }}>{stars}</span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {' '}{p.rating} ({p.reviews})
          </span>
        </div>
        <div className="product-price">
          <span className="price-current">{formatCOP(p.price)}</span>
          {p.originalPrice && <span className="price-original">{formatCOP(p.originalPrice)}</span>}
        </div>
        <p style={{ fontSize: '0.75rem', color: p.stock < 10 ? '#FF6584' : 'var(--text-muted)' }}>
          <i className="fas fa-box"></i>{' '}
          {soldOut ? 'Agotado' : p.stock < 10 ? `¡Solo ${p.stock} disponibles!` : 'En stock'}
        </p>
      </div>
      <div className="product-footer">
        <button className="btn btn-secondary btn-sm" onClick={() => onView(p)} aria-label={`Ver ${p.name}`}>
          <i className="fas fa-eye"></i>
        </button>
        <button className="btn btn-primary" style={{ flex: 1 }} disabled={soldOut} onClick={() => onAdd(p)}>
          <i className="fas fa-cart-plus"></i> {soldOut ? 'Agotado' : 'Agregar'}
        </button>
      </div>
    </div>
  );
}