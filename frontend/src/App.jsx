import { Routes, Route, Navigate, NavLink, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Store from './pages/Store';
import MyOrders from './pages/MyOrders';
import AdminOrders from './pages/AdminOrders';

function NotFound() {
  return(
    <div className="page" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1 className="section-title">Página no encontrada</h1>
      <p className="section-subtitle">La página que buscas no existe o fue movida.</p>
      <Link to="/tienda" className="btn btn-primary">Volver a la tienda</Link>
    </div>
  );
}

// TEMPORAL: se elimina cuando lleguen el login y el navbar reales
function DevToolbar() {
  const { user, users, switchUser } = useAuth();
  const linkStyle = ({ isActive }) => ({
    color: isActive ? 'var(--primary)' : 'inherit',
    fontWeight: isActive ? 700 : 400
  });

  return (
    <div
      style={{
        position: 'fixed', bottom: 12, left: 12, zIndex: 50, display: 'flex', gap: '0.9rem',
        alignItems: 'center', flexWrap: 'wrap', background: 'var(--card-bg2)',
        border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', fontSize: '0.75rem'
      }}
    >
      <NavLink to="/tienda" style={linkStyle}>Tienda</NavLink>
      <NavLink to="/mis-pedidos" style={linkStyle}>Mis pedidos</NavLink>
      <NavLink to="/admin/pedidos" style={linkStyle}>Pedidos (admin)</NavLink>
      <label>
        Usuario de prueba:{' '}
        <select value={user.id} onChange={(e) => switchUser(Number(e.target.value))}>
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
      <div id="app">
        <main id="main-content" className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/tienda" replace />} />
            <Route path="/tienda" element={<Store />} />
            <Route path="/mis-pedidos" element={<MyOrders />} />
            <Route path="/admin/pedidos" element={<AdminOrders />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {import.meta.env.DEV && <DevToolbar />}
      </div>
    </CartProvider>
  );
}
