import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { getAllOrders, updateOrderStatus, nextStatuses, ORDER_STATUS } from '../services/orderService';
import useAsync from '../hooks/useAsync';
import StatusBadge from '../components/StatusBadge';
import ConfirmModal from '../components/ConfirmModal';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';
import { formatCOP } from '../utils/format';

export default function AdminOrders() {
  const { user, addPoints } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user.role === 'admin';

  const { data, setData, loading, error, reload } = useAsync(getAllOrders, { enabled: isAdmin });
  const [filter, setFilter] = useState('all');
  const [pendingCancel, setPendingCancel] = useState(null);

  const visible = useMemo(() => {
    const list = data ?? [];
    return filter === 'all' ? list : list.filter((o) => o.status === filter);
  }, [data, filter]);

  const revenue = useMemo(
    () => (data ?? []).filter((o) => o.status !== 'cancelled').reduce((sum, o) => sum + o.total, 0),
    [data]
  );
  const totalOrders = data ? data.length : 0;
  const toShip = data ? data.filter((o) => o.status === 'paid').length : 0;

  async function applyChange(order, next) {
    try {
      const updated = await updateOrderStatus(order.id, next);
      if (next === 'cancelled') addPoints(order.userId, -order.pointsEarned);
      setData((prev) => (prev ?? []).map((o) => (o.id === updated.id ? updated : o)));
      showToast('Pedido actualizado', `${order.id}: ${ORDER_STATUS[next].label}`, 'success');
    } catch (err) {
      showToast('No se pudo actualizar', err.message, 'error');
    }
  }

  function handleChange(order, next) {
    if (next === 'cancelled') setPendingCancel(order);
    else applyChange(order, next);
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
          <div className="stat-info"><h3>{totalOrders}</h3><p>Pedidos</p></div>
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
            <button
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
              aria-pressed={filter === 'all'}
            >
              Todos
            </button>
            {Object.entries(ORDER_STATUS).map(([key, info]) => (
              <button
                key={key}
                className={`filter-btn ${filter === key ? 'active' : ''}`}
                onClick={() => setFilter(key)}
                aria-pressed={filter === key}
              >
                {info.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        {loading ? (
          <LoadingState label="Cargando pedidos..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => reload()} />
        ) : visible.length === 0 ? (
          <EmptyState
            icon="fas fa-shopping-bag"
            title="Sin pedidos"
            message={filter === 'all' ? 'Todavía no hay compras registradas' : 'No hay pedidos con este estado'}
          >
            {filter !== 'all' && (
              <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => setFilter('all')}>
                Ver todos
              </button>
            )}
          </EmptyState>
        ) : (
          <div className="table-container">
            <table className="admin-table">
              <caption className="sr-only">Pedidos de la tienda</caption>
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Usuario</th>
                  <th scope="col">Total</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Acciones</th>
                </tr>
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
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        {nextStatuses(o.status).length === 0 && (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Sin acciones</span>
                        )}
                        {nextStatuses(o.status).map((next) => (
                          <button
                            key={next}
                            className={`btn btn-sm ${next === 'cancelled' ? 'btn-danger' : 'btn-success'}`}
                            onClick={() => handleChange(o, next)}
                          >
                            {ORDER_STATUS[next].action}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pendingCancel && (
        <ConfirmModal
          title="Cancelar pedido"
          message={`¿Cancelar el pedido ${pendingCancel.id} de ${pendingCancel.userName}? Se devolverá el stock y se restarán ${pendingCancel.pointsEarned} puntos. Esta acción no se puede deshacer.`}
          confirmLabel="Sí, cancelar pedido"
          danger
          onCancel={() => setPendingCancel(null)}
          onConfirm={() => {
            const order = pendingCancel;
            setPendingCancel(null);
            applyChange(order, 'cancelled');
          }}
        />
      )}
    </div>
  );
}