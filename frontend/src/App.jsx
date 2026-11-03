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
        <main id="main-content" className="main-content" style={{ paddingBottom: import.meta.env.DEV ? '4rem' : undefined }}>
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
import { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Routines from './components/Routines';
import './App.css';

// URL forzada directamente al puerto 3001 para asegurar la conexión
const API_URL = 'http://localhost:3001';

async function sendRequest(endpoint, body) {
  try {
    const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        success: false,
        error: data.error || 'Ocurrió un error en la solicitud.',
      };
    }

    return {
      success: true,
      ...data,
    };
  } catch {
    return {
      success: false,
      error: 'No se pudo conectar con el servidor.',
    };
  }
}

function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleNavigate = (destination) => {
    if (['register', 'login', 'landing'].includes(destination)) {
      setPage(destination);
    }
  };

  const handleRegister = async (form) => {
    return sendRequest('register', {
      name: form.name,
      email: form.email,
      age: form.age || null,
      gender: form.gender || null,
      population: form.population,
      preferredSpace: form.preferredSpace,
      level: form.level,
      password: form.password,
    });
  };

  const handleLogin = async ({ email, password }) => {
    const result = await sendRequest('login', { email, password });

    if (!result.success) {
      return result;
    }

    if (!result.token || !result.user) {
      return {
        success: false,
        error: 'El servidor no devolvió los datos de autenticación.',
      };
    }

    setUser(result.user);
    setToken(result.token);
    setPage('welcome');

    return {
      success: true,
      user: result.user,
    };
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setPage('login');
  };

  if (page === 'routines' && user && token) {
    return (
      <Routines
        token={token}
        onBack={() => setPage('welcome')}
      />
    );
  }

  if (page === 'register') {
    return (
      <Register
        onRegister={handleRegister}
        onNavigate={handleNavigate}
      />
    );
  }

  if (page === 'landing') {
    return (
      <main className="welcome-page">
        <section className="welcome-card">
          <h1>EvolutionFit</h1>
          <p>Tu bienestar, tu evolución.</p>

          <button onClick={() => setPage('login')}>
            Iniciar sesión
          </button>

          <button onClick={() => setPage('register')}>
            Crear cuenta
          </button>
        </section>
      </main>
    );
  }

  if (page === 'welcome' && user && token) {
    return (
      <main className="welcome-page">
        <section className="welcome-card">
          <img
            src="/logo.png"
            alt="EvolutionFit"
            className="welcome-logo"
          />

          <p className="welcome-eyebrow">EVOLUTION FIT</p>

          <h1>¡Bienvenido, {user.name}!</h1>

          <p>Has iniciado sesión correctamente.</p>

          <div className="welcome-user-info">
            <p><strong>Nombre:</strong> {user.name}</p>
            <p><strong>Correo:</strong> {user.email}</p>
            <p><strong>Rol:</strong> {user.role}</p>
          </div>

          <p className="welcome-message">
            Tu evolución comienza hoy. ¡Vamos por tus objetivos!
          </p>

          <button
            type="button"
            className="welcome-routines"
            onClick={() => setPage('routines')}
          >
            Generar rutina
          </button>

          <button
            type="button"
            className="welcome-logout"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </section>
      </main>
    );
  }

  return (
    <Login
      onLogin={handleLogin}
      onNavigate={handleNavigate}
    />
  );
}

export default App;
