import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppLayout from './components/layout/Applayout';
import { HOME_PATH } from './config/navigation';
import Store from './pages/Store';
import MyOrders from './pages/MyOrders';
import AdminOrders from './pages/AdminOrders';

function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1 className="section-title">Página no encontrada</h1>
      <p className="section-subtitle">La página que buscas no existe o fue movida.</p>
      <Link to={HOME_PATH} className="btn btn-primary">Volver al inicio</Link>
    </div>
  );
}

// TEMPORAL: se elimina cuando llegue el login real
function DevToolbar() {
  const { user, users, switchUser } = useAuth();

  return (
    <div
      style={{
        position: 'fixed', bottom: 12, left: 12, zIndex: 50, display: 'flex', gap: '0.9rem',
        alignItems: 'center', flexWrap: 'wrap', background: 'var(--card-bg2)', color: 'var(--text)',
        border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', fontSize: '0.75rem'
      }}
    >
      <label>
        Usuario de prueba:{' '}
        <select
          value={user.id}
          onChange={(e) => switchUser(Number(e.target.value))}
          style={{ color: 'var(--text)', background: 'var(--card-bg2)', border: '1px solid var(--border)', borderRadius: 4 }}
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
          ))}
        </select>
      </label>
      <span>⭐ {user.points} pts</span>
    </div>
  );
}

export default function App() {
  const { user } = useAuth();

  return (
    <CartProvider key={user.id} userId={user.id}>
      <div id="app" style={{ paddingBottom: import.meta.env.DEV ? '3.5rem' : undefined }}>
        <Routes>
          {/* Las páginas públicas (login, registro) van aquí, fuera de AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to={HOME_PATH} replace />} />
            <Route path="/tienda" element={<Store />} />
            <Route path="/mis-pedidos" element={<MyOrders />} />
            <Route path="/admin/pedidos" element={<AdminOrders />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        {import.meta.env.DEV && <DevToolbar />}
      </div>
    </CartProvider>
  );
}