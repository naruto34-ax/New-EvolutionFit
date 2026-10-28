import { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrdersByUser } from '../services/orderService';
import useAsync from '../hooks/useAsync';
import StatusBadge from '../components/StatusBadge';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';
import { formatCOP } from '../utils/format';

export default function MyOrders() {
  const { user } = useAuth();
  const fetchOrders = useCallback(() => getOrdersByUser(user.id), [user.id]);
  const { data: orders, loading, error, reload } = useAsync(fetchOrders);

  return (
    <div className="page">
      <div className="section-header">
        <h1 className="section-title"><i className="fas fa-receipt"></i> Mis pedidos</h1>
        <p className="section-subtitle">Historial de tus compras en la tienda</p>
      </div>

      {loading ? (
        <LoadingState label="Cargando tus pedidos..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : !orders || orders.length === 0 ? (
        <EmptyState icon="fas fa-shopping-bag" title="Aún no tienes pedidos" message="Cuando compres algo, aparecerá aquí">
          <Link to="/tienda" className="btn btn-primary" style={{ marginTop: '1rem' }}>Ir a la tienda</Link>
        </EmptyState>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((o) => (
            <div key={o.id} className="card">
              <div className="card-header" style={{ flexWrap: 'wrap', gap: '0.75rem' }}>
                <div>
                  <h3 className="card-title" style={{ fontFamily: 'monospace' }}>{o.id}</h3>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    {new Date(o.createdAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <StatusBadge status={o.status} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {o.items.map((item) => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span>{item.emoji} {item.name} × {item.qty}</span>
                    <span>{formatCOP(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border)', marginTop: '1rem', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <i className="fas fa-star" style={{ color: '#F7971E' }}></i> +{o.pointsEarned} puntos
                </span>
                <strong style={{ color: 'var(--primary)' }}>Total: {formatCOP(o.total)}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}