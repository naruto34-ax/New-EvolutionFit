import { useState } from "react";
import "../css/Login.css";


function Login({ onLogin, onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const quickAccounts = [
    { label: "Admin", letter: "A", color: "#ff6584", email: "admin@evolutionfit.com", password: "Admin123!" },
    { label: "Coach", letter: "C", color: "#43e97b", email: "coach@evolutionfit.com", password: "Coach123!" },
    { label: "Usuario", letter: "M", color: "#6c63ff", email: "maria@demo.com", password: "Demo123!" },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");


    // Validaciones personalizadas sin alertas HTML5 nativas
    if (!email.trim()) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("El correo electrónico no tiene un formato válido (ejemplo: usuario@dominio.com).");
      return;
    }

    if (!password) {
      setError("Por favor, ingresa tu contraseña.");
      return;
    }

    setLoading(true);

    try {
      if (onLogin) {
        const result = await onLogin({ email: email.trim(), password });
        if (result === false || result?.success === false) {
          setError(result?.error || "Credenciales incorrectas. Inténtalo de nuevo.");
        }
      } else {
        setError("Servicio de autenticación no disponible.");
      }
    } catch {
      setError("Error al conectar con el servidor. Revisa tu conexión.");
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
            <img src="/logo.png" alt="EvolutionFit Logo" />
            <span>Evolution<strong>Fit</strong></span>
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

          <p className="login-visual-footer">Tu bienestar, tu evolución.</p>
        </aside>

        <section className="login-form-side">
          <div className="login-form-container">
            <div className="login-heading">
              <span className="login-eyebrow">EVOLUTION FIT</span>
              <h1>Bienvenido de vuelta</h1>
              <p>Ingresa a tu cuenta para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div className="login-field">
                <label htmlFor="login-email">Correo electrónico</label>
                <input
                  id="login-email"
                  type="text"
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  className={error && !email ? "input-error" : ""}
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
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    className={error && !password ? "input-error" : ""}
                  />
                  <button
                    type="button"
                    className="login-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </div>

              {error && (
                <div className="login-error" role="alert">
                  <span className="error-icon">⚠️</span> {error}
                </div>
              )}

              <button type="submit" className="login-submit" disabled={loading}>
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
                  <span className="login-avatar" style={{ backgroundColor: account.color }}>
                    {account.letter}
                  </span>
                  <span>{account.label}</span>
                </button>
              ))}
            </div>

            <p className="login-switch">
              ¿No tienes cuenta?{" "}
              <button type="button" onClick={() => onNavigate?.("register")}>
                Regístrate gratis
              </button>
            </p>

            <button type="button" className="login-back" onClick={() => window.location.href = "/"}>
              ← Volver al inicio
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Login;