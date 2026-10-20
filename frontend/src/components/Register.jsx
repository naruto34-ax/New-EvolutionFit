
import { useState } from "react";
import "./Register.css";

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

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim() || !form.email.trim()) {
      setError("Completa tu nombre y correo electrónico.");
      return;
    }

    if (form.password.length < 6) {
      setError("La contraseña debe tener mínimo 6 caracteres.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (
      form.age &&
      (!Number.isInteger(Number(form.age)) ||
        Number(form.age) < 1 ||
        Number(form.age) > 120)
    ) {
      setError("Ingresa una edad válida.");
      return;
    }

    if (typeof onRegister !== "function") {
      setError("El registro todavía no está conectado al servidor.");
      return;
    }

    setLoading(true);

    try {
      const result = await onRegister({
        name: form.name.trim(),
        email: form.email.trim(),
        age: form.age,
        gender: form.gender,
        population: form.population,
        preferredSpace: form.preferredSpace,
        level: form.level,
        password: form.password,
      });

      if (!result || result.success !== true) {
        setError(
          result?.error || "No se pudo completar el registro."
        );
        return;
      }

      setMessage(
        "¡Registro exitoso! Ya puedes iniciar sesión."
      );

      setForm((previous) => ({
        ...previous,
        name: "",
        email: "",
        age: "",
        gender: "",
        password: "",
        confirmPassword: "",
      }));
    } catch (err) {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-left">
        <button
          type="button"
          className="auth-brand"
          onClick={() => onNavigate?.("landing")}
        >
          <img src="/logo.png" alt="" />
          <span>
            Evolution<strong>Fit</strong>
          </span>
        </button>

        <div className="auth-left-content">
          <h1>Comienza tu evolución</h1>
          <p>
            Crea tu cuenta y empieza a construir una versión más
            saludable de ti.
          </p>
        </div>
      </section>

      <section className="auth-right">
        <div className="auth-form-container">
          <header className="auth-heading">
            <span className="auth-eyebrow">EVOLUTION FIT</span>
            <h2>Crear cuenta</h2>
            <p>Completa tus datos para registrarte</p>
          </header>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="register-name">Nombre completo</label>
              <input
                id="register-name"
                name="name"
                type="text"
                placeholder="Tu nombre"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                maxLength={120}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">
                Correo electrónico
              </label>
              <input
                id="register-email"
                name="email"
                type="email"
                placeholder="tu@correo.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                maxLength={190}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-age">Edad</label>
              <input
                id="register-age"
                name="age"
                type="number"
                placeholder="Tu edad (opcional)"
                min="1"
                max="120"
                value={form.age}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-gender">Género (opcional)</label>
              <select
                id="register-gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="">Prefiero no indicarlo</option>
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="auth-field">
              <label htmlFor="register-population">
                Tipo de plan
              </label>
              <select
                id="register-population"
                name="population"
                value={form.population}
                onChange={handleChange}
              >
                <option value="general">General</option>
                <option value="principiante">Principiante</option>
                <option value="deportista">Deportista</option>
              </select>
            </div>

            <div className="auth-field">
              <label htmlFor="register-space">
                Lugar de entrenamiento
              </label>
              <select
                id="register-space"
                name="preferredSpace"
                value={form.preferredSpace}
                onChange={handleChange}
              >
                <option value="gym">Gimnasio</option>
                <option value="home">Casa</option>
                <option value="park">Parque</option>
              </select>
            </div>

            <div className="auth-field">
              <label htmlFor="register-level">Nivel</label>
              <select
                id="register-level"
                name="level"
                value={form.level}
                onChange={handleChange}
              >
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
              </select>
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">Contraseña</label>
              <input
                id="register-password"
                name="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                minLength={6}
                maxLength={72}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-confirm-password">
                Confirmar contraseña
              </label>
              <input
                id="register-confirm-password"
                name="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                minLength={6}
                maxLength={72}
                required
              />
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            {message && (
              <p className="form-success" role="status">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <p className="auth-switch">
            ¿Ya tienes una cuenta?{" "}
            <button
              type="button"
              onClick={() => onNavigate?.("login")}
            >
              Inicia sesión
            </button>
          </p>

          <button
            type="button"
            className="auth-back"
            onClick={() => onNavigate?.("landing")}
          >
            ← Volver al inicio
          </button>
        </div>
      </section>
    </main>
  );
}

export default Register;
