import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getAllOrders, updateOrderStatus, nextStatuses, ORDER_STATUS } from '../services/orderService';
import StatusBadge from '../components/StatusBadge';
import { formatCOP } from '../utils/format';

export default function AdminOrders() {
  const { user, addPoints } = useAuth();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const isAdmin = user.role === 'admin';

  useEffect(() => {
    if (!isAdmin) return undefined;
    let active = true;
    getAllOrders().then((data) => {
      if (active) {
        setOrders(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [isAdmin]);

  const visible = useMemo(
    () => (filter === 'all' ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter]
  );
  const revenue = useMemo(
    () => orders.filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
    [orders]
  );
  const toShip = orders.filter((o) => o.status === 'paid').length;

  async function handleChange(order, next) {
    if (next === 'cancelled' && !window.confirm('¿Cancelar este pedido? Se devolverá el stock y se restarán los puntos.')) {
      return;
    }
    try {
      const updated = await updateOrderStatus(order.id, next);
      if (next === 'cancelled') addPoints(order.userId, -order.pointsEarned);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      showToast('Pedido actualizado', `${order.id}: ${ORDER_STATUS[next].label}`, 'success');
    } catch (error) {
      showToast('No se pudo actualizar', error.message, 'error');
    }
  }

  if (!isAdmin) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
        <h1 className="section-title">Acceso restringido</h1>
        <p className="section-subtitle">Solo los administradores pueden ver los pedidos.</p>
        <Link to="/tienda" className="btn btn-primary">Volver a la tienda</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="section-header">
        <h1 className="section-title"><i className="fas fa-clipboard-list"></i> Pedidos de la tienda</h1>
        <p className="section-subtitle">Revisa las compras y actualiza su estado</p>
      </div>

      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(108,99,255,0.15)', color: '#6C63FF' }}><i className="fas fa-shopping-bag"></i></div>
          <div className="stat-info"><h3>{orders.length}</h3><p>Pedidos</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(67,233,123,0.15)', color: '#43E97B' }}><i className="fas fa-coins"></i></div>
          <div className="stat-info"><h3>{formatCOP(revenue)}</h3><p>Ingresos (sin cancelados)</p></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(247,151,30,0.15)', color: '#F7971E' }}><i className="fas fa-truck"></i></div>
          <div className="stat-info"><h3>{toShip}</h3><p>Por enviar</p></div>
        </div>
      </div>

      <div className="filters-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="filter-group">
          <div className="filter-btns">
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Todos</button>
            {Object.entries(ORDER_STATUS).map(([key, info]) => (
              <button key={key} className={`filter-btn ${filter === key ? 'active' : ''}`} onClick={() => setFilter(key)}>
                {info.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <div className="spinner"></div>
        ) : visible.length === 0 ? (
          <div className="empty-state"><i className="fas fa-shopping-bag"></i><h3>Sin pedidos</h3></div>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr><th>ID</th><th>Usuario</th><th>Total</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr>
              </thead>
              <tbody>
                {visible.map((o) => (
                  <tr key={o.id}>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{o.id}</td>
                    <td>{o.userName}</td>
                    <td><strong>{formatCOP(o.total)}</strong></td>
                    <td><StatusBadge status={o.status} /></td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(o.createdAt).toLocaleDateString('es-CO')}
                    </td>
                    <td style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {nextStatuses(o.status).length === 0 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>—</span>}
                      {nextStatuses(o.status).map((next) => (
                        <button
                          key={next}
                          className={`btn btn-sm ${next === 'cancelled' ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => handleChange(o, next)}
                        >
                          {ORDER_STATUS[next].action}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}