import Modal from './Modal';
import { formatCOP, discountPercent } from '../utils/format';

export default function ProductModal({ product: p, onClose, onAdd }) {
  const discount = discountPercent(p.price, p.originalPrice);
  const soldOut = p.stock <= 0;

  return (
    <Modal
      title={p.name}
      onClose={onClose}
      actions={
        <>
          <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          <button
            className="btn btn-primary"
            disabled={soldOut}
            onClick={() => {
              onAdd(p);
              onClose();
            }}
          >
            <i className="fas fa-cart-plus"></i> {soldOut ? 'Agotado' : 'Agregar al carrito'}
          </button>
        </>
      }
    >
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>{p.emoji}</div>
        {p.badge && <span className="badge badge-warning">{p.badge}</span>}
        {discount > 0 && <span className="badge badge-danger" style={{ marginLeft: '0.5rem' }}>-{discount}%</span>}
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{p.description}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
        <span style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCOP(p.price)}</span>
        {p.originalPrice && (
          <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>{formatCOP(p.originalPrice)}</span>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <span style={{ color: '#F7971E' }}>{'★'.repeat(Math.round(p.rating))}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{p.rating}/5 · {p.reviews} reseñas</span>
      </div>
      <p style={{ fontSize: '0.85rem', color: p.stock < 10 ? '#FF6584' : '#43E97B' }}>
        <i className="fas fa-box"></i> {soldOut ? 'Agotado' : `${p.stock} unidades disponibles`}
      </p>
    </Modal>
  );
}