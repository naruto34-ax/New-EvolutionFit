import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppLayout from './components/layout/AppLayout';
import Login from './components/Login';
import Register from './components/Register';
import Routines from './components/Routines';
import { HOME_PATH } from './config/navigation';
import Store from './pages/Store';
import MyOrders from './pages/MyOrders';
import AdminOrders from './pages/AdminOrders';

// Los componentes de login y registro piden navegar a 'login', 'register' o 'landing'
const AUTH_PATHS = { login: '/login', register: '/registro', landing: '/login' };

function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1 className="section-title">Página no encontrada</h1>
      <p className="section-subtitle">La página que buscas no existe o fue movida.</p>
      <Link to={HOME_PATH} className="btn btn-primary">Volver al inicio</Link>
    </div>
  );
}

// Con sesión iniciada no se muestran login ni registro
function PublicOnly({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  if (user) return <Navigate to={location.state?.from?.pathname ?? HOME_PATH} replace />;
  return children;
}

// Sin sesión se manda al login; con sesión, cada usuario tiene su propio carrito
function ProtectedLayout() {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return (
    <CartProvider key={user.id} userId={user.id}>
      <AppLayout />
    </CartProvider>
  );
}

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  return <Login onLogin={login} onNavigate={(destination) => navigate(AUTH_PATHS[destination] ?? '/login')} />;
}

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  return <Register onRegister={register} onNavigate={(destination) => navigate(AUTH_PATHS[destination] ?? '/login')} />;
}

function RoutinesPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  return <Routines token={token} onBack={() => navigate(HOME_PATH)} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
      <Route path="/registro" element={<PublicOnly><RegisterPage /></PublicOnly>} />

      <Route element={<ProtectedLayout />}>
        <Route path="/" element={<Navigate to={HOME_PATH} replace />} />
        <Route path="/tienda" element={<Store />} />
        <Route path="/mis-pedidos" element={<MyOrders />} />
        <Route path="/admin/pedidos" element={<AdminOrders />} />
        <Route path="/rutinas" element={<RoutinesPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}