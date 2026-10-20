
import { useState } from "react";
import "./Login.css";

function Login({ onLogin, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const quickAccounts = [
    {
      label: "Admin",
      letter: "A",
      color: "#ff6584",
      email: "admin@evolutionfit.com",
      password: "Admin123!",
    },
    {
      label: "Coach",
      letter: "C",
      color: "#43e97b",
      email: "coach@evolutionfit.com",
      password: "Coach123!",
    },
    {
      label: "Usuario",
      letter: "M",
      color: "#6c63ff",
      email: "maria@demo.com",
      password: "Demo123!",
    },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Ingresa tu correo electrónico y contraseña.");
      return;
    }

    setLoading(true);

    try {
      if (onLogin) {
        const result = await onLogin({
          email: email.trim(),
          password,
        });

        if (result === false || result?.success === false) {
          setError(result?.error || "No se pudo iniciar sesión.");
        }
      } else {
        setError(
          "La interfaz está lista, pero falta conectar la autenticación."
        );
      }
    } catch {
      setError("No se pudo iniciar sesión. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const selectQuickAccount = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError("");
  };

  return (
    <main className="login-page">
      <section className="login-layout">
        <aside className="login-visual">
          <button
            type="button"
            className="login-brand"
            onClick={() => onNavigate?.("landing")}
          >
            <img src="/logo.png" alt="" />
            <span>
              Evolution<strong>Fit</strong>
            </span>
          </button>

          <div className="login-visual-content">
            <div className="login-circles" aria-hidden="true">
              <span className="login-circle circle-one" />
              <span className="login-circle circle-two" />
              <span className="login-circle circle-three" />
            </div>

            <div className="login-quote">
              <span className="quote-mark">“</span>
              <p>El único mal entrenamiento es el que no hiciste.</p>
            </div>

            <ul className="login-features">
              <li>✓ Rutinas para gym, parque y casa</li>
              <li>✓ Planes nutricionales personalizados</li>
              <li>✓ Seguimiento de progreso</li>
              <li>✓ Coach personal disponible</li>
            </ul>
          </div>

          <p className="login-visual-footer">
            Tu bienestar, tu evolución.
          </p>
        </aside>

        <section className="login-form-side">
          <div className="login-form-container">
            <div className="login-heading">
              <span className="login-eyebrow">EVOLUTION FIT</span>
              <h1>Bienvenido de vuelta</h1>
              <p>Ingresa a tu cuenta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="login-field">
                <label htmlFor="login-email">Correo electrónico</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>

              <div className="login-field">
                <label htmlFor="login-password">Contraseña</label>
                <div className="login-password-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Tu contraseña"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="login-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              {error && (
                <p className="login-error" role="alert">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? "Verificando..." : "Iniciar sesión"}
              </button>
            </form>

            <div className="login-divider">
              <span>o prueba una cuenta demo</span>
            </div>

            <div className="login-quick-accounts">
              {quickAccounts.map((account) => (
                <button
                  key={account.label}
                  type="button"
                  className="login-quick-button"
                  onClick={() => selectQuickAccount(account)}
                >
                  <span
                    className="login-avatar"
                    style={{ backgroundColor: account.color }}
                  >
                    {account.letter}
                  </span>
                  <span>{account.label}</span>
                </button>
              ))}
            </div>

            <p className="login-switch">
              ¿No tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => onNavigate?.("register")}
              >
                Regístrate gratis
              </button>
            </p>

            <button
              type="button"
              className="login-back"
              onClick={() => onNavigate?.("landing")}
            >
              ← Volver al inicio
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Login;
