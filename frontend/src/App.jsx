
import { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Routines from './components/Routines';
import './App.css';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function sendRequest(endpoint, body) {
  try {
    const response = await fetch(
      `${API_URL}/api/auth/${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

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
  if (page === 'routines' && user && token) {
  return (
    <Routines
      token={token}
      onBack={() => setPage('welcome')}
    />
  );
}

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
    const result = await sendRequest('login', {
      email,
      password,
    });

    if (!result.success) {
      return result;
    }

    // Verificar que el backend devuelva usuario y token.
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
        <h1>EvolutionFit</h1>
        <p>Tu bienestar, tu evolución.</p>

        <button onClick={() => setPage('login')}>
          Iniciar sesión
        </button>

        <button onClick={() => setPage('register')}>
          Crear cuenta
        </button>
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

          <p className="welcome-eyebrow">
            EVOLUTION FIT
          </p>

          <h1>
            ¡Bienvenido, {user.name}!
          </h1>

          <p>
            Has iniciado sesión correctamente.
          </p>

          <div className="welcome-user-info">
            <p>
              <strong>Nombre:</strong> {user.name}
            </p>
            <p>
              <strong>Correo:</strong> {user.email}
            </p>
            <p>
              <strong>Rol:</strong> {user.role}
            </p>
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
