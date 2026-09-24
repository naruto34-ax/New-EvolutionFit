// ===== LOGIN PAGE =====
function renderLogin() {
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
          <p>"El único mal entrenamiento es el que no hiciste."</p>
        </div>
        <div class="auth-features">
          <div class="af-item"><i class="fas fa-check-circle"></i> Rutinas para gym, parque y casa</div>
          <div class="af-item"><i class="fas fa-check-circle"></i> Planes nutricionales personalizados</div>
          <div class="af-item"><i class="fas fa-check-circle"></i> Seguimiento de progreso</div>
          <div class="af-item"><i class="fas fa-check-circle"></i> Coach personal disponible</div>
        </div>
      </div>
    </div>
    <div class="auth-right">
      <div class="auth-form-container">
        <h2>Bienvenido de vuelta</h2>
        <p class="auth-subtitle">Ingresa a tu cuenta para continuar</p>
        <form id="login-form" onsubmit="handleLogin(event)">
          <div class="form-group">
            <label class="form-label"><i class="fas fa-envelope"></i> Correo electrónico</label>
            <input type="email" id="login-email" class="form-control" placeholder="tu@correo.com" required/>
          </div>
          <div class="form-group">
            <label class="form-label"><i class="fas fa-lock"></i> Contraseña</label>
            <div class="input-password">
              <input type="password" id="login-password" class="form-control" placeholder="Tu contraseña" required/>
              <button type="button" class="toggle-password" onclick="togglePassword('login-password')"><i class="fas fa-eye"></i></button>
            </div>
          </div>
          <div id="login-error" class="form-error" style="display:none"></div>
          <button type="submit" class="btn btn-primary btn-block btn-lg" id="login-btn">
            <i class="fas fa-sign-in-alt"></i> Iniciar Sesión
          </button>
        </form>
        <div class="auth-divider"><span>o ingresa rápido con</span></div>
        <div class="quick-logins">
          <button class="quick-btn" onclick="quickLogin('admin@evolutionfit.com','Admin123!')">
            <div class="qb-avatar" style="background:#FF6584">A</div>
            <span>Admin</span>
          </button>
          <button class="quick-btn" onclick="quickLogin('coach@evolutionfit.com','Coach123!')">
            <div class="qb-avatar" style="background:#43E97B">C</div>
            <span>Coach</span>
          </button>
          <button class="quick-btn" onclick="quickLogin('maria@demo.com','Demo123!')">
            <div class="qb-avatar" style="background:#6C63FF">M</div>
            <span>Usuario</span>
          </button>
        </div>
        <p class="auth-switch">¿No tienes cuenta? <a href="#" onclick="navigate('register')">Regístrate gratis</a></p>
        <p class="auth-switch"><a href="#" onclick="navigate('landing')"><i class="fas fa-arrow-left"></i> Volver al inicio</a></p>
      </div>
    </div>
  </div>`;
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  const btn = document.getElementById('login-btn');

  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verificando...';
  btn.disabled = true;

  setTimeout(() => {
    Auth.logout();
    const result = Auth.login(email, password);
    if (result.success) {
      const check = Auth.getCurrentUser();
      showToast('¡Bienvenido!', `Hola ${check.name.split(' ')[0]}, ¡a entrenar!`, 'success');
      navigate('dashboard');
    } else {
      errorEl.textContent = result.error;
      errorEl.style.display = 'block';
      btn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
      btn.disabled = false;
    }
  }, 600);
}

function togglePassword(id) {
  const input = document.getElementById(id);
  const btn = input.nextElementSibling.querySelector('i');
  if (input.type === 'password') { input.type = 'text'; btn.className = 'fas fa-eye-slash'; }
  else { input.type = 'password'; btn.className = 'fas fa-eye'; }
}
