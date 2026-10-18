
import { useState } from "react";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    age: "",
    gender: "",
    population: "",
    preferredSpace: "",
    level: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    setMessage("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (Number(formData.age) < 13 || Number(formData.age) > 100) {
      setMessage("Ingresa una edad válida entre 13 y 100 años.");
      setMessageType("error");
      return;
    }

    if (formData.password.length < 8) {
      setMessage("La contraseña debe tener al menos 8 caracteres.");
      setMessageType("error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      setMessageType("error");
      return;
    }

    setMessage(
      "Validación correcta. El registro todavía debe conectarse con el servidor."
    );
    setMessageType("success");
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <header className="register-header">
          <img
            src="/logo.png"
            alt="Evolution Fit"
            className="register-logo"
          />

          <h1>Crear cuenta</h1>
          <p>Únete a Evolution Fit y comienza tu experiencia</p>
        </header>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Nombre completo</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ingresa tu nombre"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="age">Edad</label>
              <input
                id="age"
                name="age"
                type="number"
                min="13"
                max="100"
                placeholder="Tu edad"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Género</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
                <option value="Otro">Otro</option>
                <option value="Prefiero no decirlo">
                  Prefiero no decirlo
                </option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="population">Población o ciudad</label>
            <input
              id="population"
              name="population"
              type="text"
              placeholder="¿Dónde vives?"
              value={formData.population}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="preferredSpace">Espacio preferido</label>
            <select
              id="preferredSpace"
              name="preferredSpace"
              value={formData.preferredSpace}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona un espacio</option>
              <option value="Musculación">Musculación</option>
              <option value="Cardio">Cardio</option>
              <option value="Clases grupales">Clases grupales</option>
              <option value="Zona funcional">Zona funcional</option>
              <option value="Todos">Todos</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="level">Nivel de experiencia</label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona tu nivel</option>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-wrapper">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                value={formData.password}
                onChange={handleChange}
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <div className="password-wrapper">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                aria-label={
                  showConfirmPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showConfirmPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {message && (
            <p
              className={`register-message ${messageType}`}
              role="status"
            >
              {message}
            </p>
          )}

          <button type="submit" className="register-button">
            Crear cuenta
          </button>
        </form>

        <footer className="register-footer">
          <p>Evolution Fit · Tu bienestar, tu evolución</p>
        </footer>
      </section>
    </main>
  );
}

export default Register;
