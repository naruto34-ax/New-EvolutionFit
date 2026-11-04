import { useState } from "react";
import "../css/Register.css";

function Register({ onNavigate, onRegister }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    population: "general",
    preferredSpace: "gym",
    level: "beginner",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    // Validaciones personalizadas
    if (!form.name.trim()) {
      setError("Por favor, ingresa tu nombre completo.");
      return;
    }

    if (!form.email.trim()) {
      setError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email.trim())) {
      setError("Ingresa un correo electrónico válido (ejemplo: usuario@dominio.com).");
      return;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe contener al menos 6 caracteres.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden. Verifícalas.");
      return;
    }

    if (form.age && (Number(form.age) < 12 || Number(form.age) > 100)) {
      setError("Ingresa una edad válida (entre 12 y 100 años).");
      return;
    }

    setLoading(true);

    try {
      if (typeof onRegister === "function") {
        const result = await onRegister({
          name: form.name.trim(),
          email: form.email.trim(),
          age: form.age || null,
          gender: form.gender || null,
          population: form.population,
          preferredSpace: form.preferredSpace,
          level: form.level,
          password: form.password,
        });

        if (!result || result.success !== true) {
          setError(result?.error || "No se pudo registrar el usuario.");
          return;
        }

        setMessage("¡Registro exitoso! Redirigiendo al inicio de sesión...");
        setTimeout(() => onNavigate?.("login"), 1800);
      } else {
        setError("El servicio de registro no está disponible.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-layout">
        <aside className="register-visual">
          <button
            type="button"
            className="register-brand"
            onClick={() => onNavigate?.("landing")}
          >
            <img src="/logo.png" alt="EvolutionFit Logo" />
            <span>Evolution<strong>Fit</strong></span>
          </button>

          <div className="register-visual-content">
            <h2>Comienza tu evolución hoy</h2>
            <p>Únete a nuestra comunidad y diseña rutinas adaptadas a tu nivel, espacio y objetivos.</p>
            <ul className="register-benefits">
              <li> Rutinas automáticas para gym, casa o parque</li>
              <li> Seguimiento adaptado a tu nivel</li>
              <li> Acceso rápido a tu panel personalizado</li>
            </ul>
          </div>

          <p className="register-visual-footer">Tu bienestar, tu evolución.</p>
        </aside>

        <section className="register-form-side">
          <div className="register-form-container">
            <header className="register-heading">
              <span className="register-eyebrow">EVOLUTION FIT</span>
              <h1>Crear cuenta</h1>
              <p>Llena los campos para personalizar tu plan</p>
            </header>

            <form onSubmit={handleSubmit} className="register-form" noValidate>
              <div className="register-row">
                <div className="register-field">
                  <label htmlFor="reg-name">Nombre completo</label>
                  <input
                    id="reg-name"
                    name="name"
                    type="text"
                    placeholder="Tu nombre"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="register-field">
                  <label htmlFor="reg-email">Correo electrónico</label>
                  <input
                    id="reg-email"
                    name="email"
                    type="text"
                    placeholder="tu@correo.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="register-row">
                <div className="register-field">
                  <label htmlFor="reg-age">Edad</label>
                  <input
                    id="reg-age"
                    name="age"
                    type="number"
                    placeholder="Ej. 25"
                    value={form.age}
                    onChange={handleChange}
                  />
                </div>
                <div className="register-field">
                  <label htmlFor="reg-gender">Género</label>
                  <select id="reg-gender" name="gender" value={form.gender} onChange={handleChange}>
                    <option value="">Prefiero no decir</option>
                    <option value="femenino">Femenino</option>
                    <option value="masculino">Masculino</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="register-row triple">
                <div className="register-field">
                  <label htmlFor="reg-pop">Plan</label>
                  <select id="reg-pop" name="population" value={form.population} onChange={handleChange}>
                    <option value="general">General</option>
                    <option value="principiante">Principiante</option>
                    <option value="deportista">Deportista</option>
                  </select>
                </div>
                <div className="register-field">
                  <label htmlFor="reg-space">Lugar</label>
                  <select id="reg-space" name="preferredSpace" value={form.preferredSpace} onChange={handleChange}>
                    <option value="gym">Gimnasio</option>
                    <option value="home">Casa</option>
                    <option value="park">Parque</option>
                  </select>
                </div>
                <div className="register-field">
                  <label htmlFor="reg-level">Nivel</label>
                  <select id="reg-level" name="level" value={form.level} onChange={handleChange}>
                    <option value="beginner">Principiante</option>
                    <option value="intermediate">Intermedio</option>
                    <option value="advanced">Avanzado</option>
                  </select>
                </div>
              </div>

              <div className="register-row">
                <div className="register-field">
                  <label htmlFor="reg-pass">Contraseña</label>
                  <input
                    id="reg-pass"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 caracteres"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="register-field">
                  <label htmlFor="reg-confirm">Confirmar contraseña</label>
                  <input
                    id="reg-confirm"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Repite tu contraseña"
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="register-toggle-pass">
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🔒 Ocultar contraseñas" : "👁️ Mostrar contraseñas"}
                </button>
              </div>

              {error && (
                <div className="register-error" role="alert">
                  <span>⚠️</span> {error}
                </div>
              )}

              {message && (
                <div className="register-success" role="status">
                  <span>✅</span> {message}
                </div>
              )}

              <button type="submit" className="register-submit" disabled={loading}>
                {loading ? "Creando cuenta..." : "Crear cuenta"}
              </button>
            </form>

            <p className="register-switch">
              ¿Ya tienes cuenta?{" "}
              <button type="button" onClick={() => onNavigate?.("login")}>
                Inicia sesión
              </button>
            </p>

            <button type="button" className="register-back" onClick={() => window.location.href = "/"}>
              ← Volver al inicio
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

export default Register;