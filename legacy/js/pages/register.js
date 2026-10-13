// ===== REGISTER PAGE =====
function renderRegister(params = {}) {
  return `
  <div class="auth-page">
    <div class="auth-left">
      <div class="auth-brand" onclick="navigate('landing')">
        <img src="logoe.png.ico" alt="Evolution Fit" style="width:36px;height:36px;object-fit:contain;border-radius:50%"/> Evolution<strong>Fit</strong>
      </div>
      <div class="auth-visual">
        <div class="auth-circles">
          <div class="circle c1"></div>
          <div class="circle c2"></div>
          <div class="circle c3"></div>
        </div>
        <div class="auth-quote">
          <i class="fas fa-quote-left"></i>
          <p>"Tu cuerpo puede hacer cualquier cosa. Es tu mente la que debes convencer."</p>
        </div>
        <div class="auth-stats">
          <div class="as-item"><strong>2,500+</strong><span>Usuarios</span></div>
          <div class="as-item"><strong>150+</strong><span>Rutinas</span></div>
          <div class="as-item"><strong>98%</strong><span>Satisfacción</span></div>
        </div>
      </div>
    </div>
    <div class="auth-right">
      <div class="auth-form-container">
        <h2>Crea tu cuenta</h2>
        <p class="auth-subtitle">Comienza tu transformación hoy</p>
        <form id="register-form" onsubmit="handleRegister(event)">
          <div class="form-group">
            <label class="form-label"><i class="fas fa-user"></i> Nombre completo</label>
            <input type="text" id="reg-name" class="form-control" placeholder="Juan Pérez" required/>
          </div>
          <div class="form-group">
            <label class="form-label"><i class="fas fa-envelope"></i> Correo electrónico</label>
            <input type="email" id="reg-email" class="form-control" placeholder="tu@correo.com" required/>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label class="form-label"><i class="fas fa-calendar"></i> Edad</label>
              <input type="number" id="reg-age" class="form-control" placeholder="25" min="10" max="100"/>
            </div>
            <div class="form-group">
              <label class="form-label"><i class="fas fa-venus-mars"></i> Género</label>
              <select id="reg-gender" class="form-select">
                <option value="">Seleccionar</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label"><i class="fas fa-users"></i> Población</label>
            <select id="reg-population" class="form-select">
              <option value="general">General</option>
              <option value="joven">Joven (15-25 años)</option>
              <option value="adulto">Adulto (26-45 años)</option>
              <option value="adulto_mayor">Adulto Mayor (60+ años)</option>
              <option value="embarazada">Embarazada</option>
              <option value="embarazada_post">Post-parto</option>
              <option value="rehabilitacion">Rehabilitación</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label"><i class="fas fa-map-marker-alt"></i> Espacio preferido</label>
            <select id="reg-space" class="form-select">
              <option value="gym">Gimnasio</option>
              <option value="park">Parque</option>
              <option value="home">Casa</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label"><i class="fas fa-signal"></i> Nivel</label>
            <select id="reg-level" class="form-select">
              <option value="beginner">Principiante</option>
              <option value="intermediate">Intermedio</option>
              <option value="advanced">Avanzado</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label"><i class="fas fa-lock"></i> Contraseña</label>
            <div class="input-password">
              <input type="password" id="reg-password" class="form-control" placeholder="Mínimo 6 caracteres" required/>
              <button type="button" class="toggle-password" onclick="togglePassword('reg-password')"><i class="fas fa-eye"></i></button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label"><i class="fas fa-lock"></i> Confirmar contraseña</label>
            <div class="input-password">
              <input type="password" id="reg-confirm" class="form-control" placeholder="Repite tu contraseña" required/>
              <button type="button" class="toggle-password" onclick="togglePassword('reg-confirm')"><i class="fas fa-eye"></i></button>
            </div>
          </div>
          <div id="register-error" class="form-error" style="display:none"></div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="register-btn">
            <i class="fas fa-rocket"></i> Crear Cuenta
          </button>
        </form>
        <p class="auth-switch">¿Ya tienes cuenta? <a href="#" onclick="navigate('login')">Inicia sesión</a></p>
        <p class="auth-switch"><a href="#" onclick="navigate('landing')"><i class="fas fa-arrow-left"></i> Volver al inicio</a></p>
      </div>
    </div>
  </div>`;
}

function handleRegister(e) {
  e.preventDefault();
  const data = {
    name: document.getElementById('reg-name').value,
    email: document.getElementById('reg-email').value,
    age: document.getElementById('reg-age').value,
    gender: document.getElementById('reg-gender').value,
    population: document.getElementById('reg-population').value,
    preferredSpace: document.getElementById('reg-space').value,
    level: document.getElementById('reg-level').value,
    password: document.getElementById('reg-password').value,
    confirmPassword: document.getElementById('reg-confirm').value
  };
  const errorEl = document.getElementById('register-error');
  const btn = document.getElementById('register-btn');

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando cuenta...';
  btn.disabled = true;

  setTimeout(() => {
    const result = Auth.register(data);
    if (result.success) {
      showToast('¡Cuenta creada!', 'Bienvenido a Evolution Fit', 'success');
      navigate('dashboard');
    } else {
      errorEl.textContent = result.error;
      errorEl.style.display = 'block';
      btn.innerHTML = '<i class="fas fa-rocket"></i> Crear Cuenta';
      btn.disabled = false;
    }
  }, 800);
}
