import Modal from './Modal';
import { useCart } from '../context/CartContext';
import { formatCOP } from '../utils/format';

export default function CartModal({ onClose, onCheckout }) {
  const { items, total, removeItem } = useCart();
  const empty = items.length === 0;

  return (
    <Modal
      title="🛒 Mi Carrito"
      onClose={onClose}
      actions={
        empty ? (
          <button className="btn btn-primary" onClick={onClose}>Ir a la tienda</button>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={onClose}>Seguir comprando</button>
            <button className="btn btn-primary" onClick={onCheckout}>
              <i className="fas fa-credit-card"></i> Pagar
            </button>
          </>
        )
      }
    >
      {empty ? (
        <div className="empty-state">
          <i className="fas fa-shopping-cart"></i>
          <h3>Carrito vacío</h3>
          <p>Agrega productos para continuar</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: 350, overflowY: 'auto' }}>
            {items.map((item) => (
              <div
                key={item.productId}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem', background: 'var(--card-bg2)', borderRadius: 8 }}
              >
                <span style={{ fontSize: '2rem' }}>{item.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</p>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {formatCOP(item.price)} × {item.qty}
                  </span>
                </div>
                <strong>{formatCOP(item.price * item.qty)}</strong>
                <button
                  onClick={() => removeItem(item.productId)}
                  aria-label={`Quitar ${item.name}`}
                  style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid var(--border)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong>Total:</strong>
            <strong style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>{formatCOP(total)}</strong>
          </div>
        </>
      )}
    </Modal>
  );
}