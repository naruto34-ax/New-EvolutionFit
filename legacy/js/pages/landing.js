// ===== LANDING PAGE =====
function renderLanding() {
  return `
  <div class="landing">
    <!-- HERO -->
    <section class="hero-section">
      <div class="hero-bg"></div>
      <div class="hero-particles" id="particles"></div>
      <div class="hero-content">
        <div class="hero-badge"><img src="logoe.png.ico" alt="" style="width:20px;height:20px;object-fit:contain;border-radius:50%;vertical-align:middle;margin-right:4px"/> La plataforma fitness #1</div>
        <h1 class="hero-title">Transforma tu cuerpo.<br><span class="gradient-text">Evoluciona tu vida.</span></h1>
        <p class="hero-subtitle">Rutinas personalizadas para gym, parque o casa. Para toda la familia, sin importar tu nivel o condición física.</p>
        <div class="hero-actions">
          <button class="btn btn-primary btn-lg" onclick="navigate('register')"><i class="fas fa-rocket"></i> Comenzar Gratis</button>
          <button class="btn btn-secondary btn-lg" onclick="navigate('login')"><i class="fas fa-sign-in-alt"></i> Iniciar Sesión</button>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><span>2,500+</span><p>Usuarios activos</p></div>
          <div class="hero-stat"><span>150+</span><p>Rutinas disponibles</p></div>
          <div class="hero-stat"><span>98%</span><p>Satisfacción</p></div>
          <div class="hero-stat"><span>24/7</span><p>Acceso total</p></div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="hero-phone">
          <div class="phone-screen">
            <div class="phone-header"><img src="logoe.png.ico" alt="" style="width:16px;height:16px;object-fit:contain;border-radius:50%;vertical-align:middle"/> Evolution Fit</div>
            <div class="phone-card"><i class="fas fa-fire" style="color:#FF6584"></i><div><p>Calorías hoy</p><strong>485 kcal</strong></div></div>
            <div class="phone-card"><i class="fas fa-dumbbell" style="color:#6C63FF"></i><div><p>Rutina activa</p><strong>HIIT 45min</strong></div></div>
            <div class="phone-card"><i class="fas fa-trophy" style="color:#F7971E"></i><div><p>Racha actual</p><strong>12 días 🔥</strong></div></div>
            <div class="phone-progress">
              <p>Meta semanal</p>
              <div class="progress-bar"><div class="progress-fill" style="width:75%"></div></div>
              <span>75% completado</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ESPACIOS DE ENTRENAMIENTO -->
    <section class="spaces-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Entrena donde quieras</h2>
          <p class="section-subtitle">Rutinas adaptadas a tu espacio disponible</p>
        </div>
        <div class="spaces-grid">
          <div class="space-card gym-card" onclick="navigate('register')">
            <div class="space-icon"><i class="fas fa-dumbbell"></i></div>
            <h3>Gimnasio</h3>
            <p>Rutinas con equipos profesionales para máximos resultados</p>
            <ul>
              <li><i class="fas fa-check"></i> Máquinas y pesas</li>
              <li><i class="fas fa-check"></i> Cardio avanzado</li>
              <li><i class="fas fa-check"></i> Hipertrofia</li>
            </ul>
            <span class="space-count">45+ rutinas</span>
          </div>
          <div class="space-card park-card" onclick="navigate('register')">
            <div class="space-icon"><i class="fas fa-tree"></i></div>
            <h3>Parque</h3>
            <p>Aprovecha el aire libre con calistenia y ejercicio funcional</p>
            <ul>
              <li><i class="fas fa-check"></i> Barras y paralelas</li>
              <li><i class="fas fa-check"></i> Calistenia</li>
              <li><i class="fas fa-check"></i> Cardio al aire libre</li>
            </ul>
            <span class="space-count">38+ rutinas</span>
          </div>
          <div class="space-card home-card" onclick="navigate('register')">
            <div class="space-icon"><i class="fas fa-home"></i></div>
            <h3>Casa</h3>
            <p>Sin excusas. Entrena efectivamente desde la comodidad de tu hogar</p>
            <ul>
              <li><i class="fas fa-check"></i> Sin equipos</li>
              <li><i class="fas fa-check"></i> Peso corporal</li>
              <li><i class="fas fa-check"></i> Yoga y movilidad</li>
            </ul>
            <span class="space-count">67+ rutinas</span>
          </div>
        </div>
      </div>
    </section>

    <!-- POBLACIONES -->
    <section class="populations-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Para toda la familia</h2>
          <p class="section-subtitle">Programas especializados para cada etapa de la vida</p>
        </div>
        <div class="populations-grid">
          <div class="pop-card" onclick="navigate('register')">
            <div class="pop-emoji">🧒</div>
            <h4>Jóvenes</h4>
            <p>15-25 años</p>
          </div>
          <div class="pop-card" onclick="navigate('register')">
            <div class="pop-emoji">💪</div>
            <h4>Adultos</h4>
            <p>26-45 años</p>
          </div>
          <div class="pop-card" onclick="navigate('register')">
            <div class="pop-emoji">🧓</div>
            <h4>Adulto Mayor</h4>
            <p>60+ años</p>
          </div>
          <div class="pop-card" onclick="navigate('register')">
            <div class="pop-emoji">🤰</div>
            <h4>Embarazadas</h4>
            <p>Ejercicio seguro</p>
          </div>
          <div class="pop-card" onclick="navigate('register')">
            <div class="pop-emoji">🏥</div>
            <h4>Rehabilitación</h4>
            <p>Recuperación activa</p>
          </div>
          <div class="pop-card" onclick="navigate('register')">
            <div class="pop-emoji">🌟</div>
            <h4>Post-parto</h4>
            <p>Recuperación gradual</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CARACTERÍSTICAS -->
    <section class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Todo lo que necesitas</h2>
          <p class="section-subtitle">Una plataforma completa para tu transformación</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon" style="background:rgba(108,99,255,0.15);color:#6C63FF"><i class="fas fa-dumbbell"></i></div>
            <h3>Rutinas Personalizadas</h3>
            <p>HIIT, fuerza, cardio y más. Adaptadas a tu nivel, espacio y objetivos.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:rgba(67,233,123,0.15);color:#43E97B"><i class="fas fa-apple-alt"></i></div>
            <h3>Planes Nutricionales</h3>
            <p>Guías de alimentación personalizadas según tu meta y condición física.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:rgba(255,101,132,0.15);color:#FF6584"><i class="fas fa-chart-line"></i></div>
            <h3>Seguimiento de Progreso</h3>
            <p>Registra tu evolución con fotos, medidas y estadísticas detalladas.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:rgba(247,151,30,0.15);color:#F7971E"><i class="fas fa-trophy"></i></div>
            <h3>Gamificación</h3>
            <p>Gana puntos, desbloquea logros y mantén tu racha de entrenamiento.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:rgba(56,189,248,0.15);color:#38BDF8"><i class="fas fa-user-tie"></i></div>
            <h3>Coach Personal</h3>
            <p>Accede a coaches certificados para seguimiento y feedback personalizado.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon" style="background:rgba(168,85,247,0.15);color:#A855F7"><i class="fas fa-shopping-bag"></i></div>
            <h3>Tienda Fitness</h3>
            <p>Equipos, suplementos y ropa deportiva con envío a todo el país.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PLANES -->
    <section class="plans-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Elige tu plan</h2>
          <p class="section-subtitle">Comienza gratis, escala cuando quieras</p>
        </div>
        <div class="plans-grid">
          <div class="plan-card">
            <div class="plan-header">
              <h3>Gratuito</h3>
              <div class="plan-price"><span>$0</span><small>/mes</small></div>
            </div>
            <ul class="plan-features">
              <li><i class="fas fa-check"></i> 10 rutinas básicas</li>
              <li><i class="fas fa-check"></i> Seguimiento básico</li>
              <li><i class="fas fa-check"></i> Planes nutricionales básicos</li>
              <li class="disabled"><i class="fas fa-times"></i> Coach personal</li>
              <li class="disabled"><i class="fas fa-times"></i> Rutinas ilimitadas</li>
              <li class="disabled"><i class="fas fa-times"></i> Análisis avanzado</li>
            </ul>
            <button class="btn btn-outline btn-block" onclick="navigate('register')">Comenzar Gratis</button>
          </div>
          <div class="plan-card featured">
            <div class="plan-badge">Más Popular</div>
            <div class="plan-header">
              <h3>Premium</h3>
              <div class="plan-price"><span>$29.900</span><small>/mes</small></div>
            </div>
            <ul class="plan-features">
              <li><i class="fas fa-check"></i> Rutinas ilimitadas</li>
              <li><i class="fas fa-check"></i> Coach personal</li>
              <li><i class="fas fa-check"></i> Planes nutricionales completos</li>
              <li><i class="fas fa-check"></i> Análisis avanzado</li>
              <li><i class="fas fa-check"></i> Fotos de progreso</li>
              <li><i class="fas fa-check"></i> Descuentos en tienda</li>
            </ul>
            <button class="btn btn-primary btn-block" onclick="navigate('register')"><i class="fas fa-crown"></i> Obtener Premium</button>
          </div>
          <div class="plan-card">
            <div class="plan-header">
              <h3>Empresarial</h3>
              <div class="plan-price"><span>$89.900</span><small>/mes</small></div>
            </div>
            <ul class="plan-features">
              <li><i class="fas fa-check"></i> Todo lo de Premium</li>
              <li><i class="fas fa-check"></i> Hasta 50 usuarios</li>
              <li><i class="fas fa-check"></i> Panel corporativo</li>
              <li><i class="fas fa-check"></i> Reportes de equipo</li>
              <li><i class="fas fa-check"></i> Coach dedicado</li>
              <li><i class="fas fa-check"></i> Soporte prioritario</li>
            </ul>
            <button class="btn btn-outline btn-block" onclick="navigate('register')">Contactar Ventas</button>
          </div>
        </div>
      </div>
    </section>

    <!-- DEMO ACCOUNTS -->
    <section class="demo-section">
      <div class="container">
        <div class="demo-box">
          <h3><i class="fas fa-key"></i> Cuentas de demostración</h3>
          <p>Explora la plataforma con estas cuentas de prueba</p>
          <div class="demo-accounts">
            <div class="demo-account" onclick="quickLogin('admin@evolutionfit.com','Admin123!')">
              <div class="demo-avatar" style="background:#FF6584">A</div>
              <div><strong>Administrador</strong><span>admin@evolutionfit.com · Admin123!</span></div>
              <button class="btn btn-sm btn-danger">Ingresar</button>
            </div>
            <div class="demo-account" onclick="quickLogin('coach@evolutionfit.com','Coach123!')">
              <div class="demo-avatar" style="background:#43E97B">C</div>
              <div><strong>Coach Carlos</strong><span>coach@evolutionfit.com · Coach123!</span></div>
              <button class="btn btn-sm btn-success">Ingresar</button>
            </div>
            <div class="demo-account" onclick="quickLogin('maria@demo.com','Demo123!')">
              <div class="demo-avatar" style="background:#6C63FF">M</div>
              <div><strong>María García (Usuario)</strong><span>maria@demo.com · Demo123!</span></div>
              <button class="btn btn-sm btn-primary">Ingresar</button>
            </div>
          </div>
          <div style="margin-top:1rem;text-align:center">
            <button class="btn btn-secondary btn-sm" onclick="resetDemoData()" style="opacity:0.7;font-size:0.78rem">
              <i class="fas fa-redo"></i> Resetear datos demo
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA FINAL -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-box">
          <h2>¿Listo para evolucionar?</h2>
          <p>Únete a miles de personas que ya transformaron su vida con Evolution Fit</p>
          <button class="btn btn-primary btn-lg" onclick="navigate('register')"><i class="fas fa-rocket"></i> Crear cuenta gratis</button>
        </div>
      </div>
    </section>

    <!-- FOOTER LANDING -->
    <footer class="landing-footer">
      <div class="container">
        <div class="lf-brand"><img src="logoe.png.ico" alt="Evolution Fit" style="width:28px;height:28px;object-fit:contain;border-radius:50%;vertical-align:middle"/> Evolution<strong>Fit</strong></div>
        <p>© 2025 Evolution Fit — Tecnológico de Antioquia · Ingeniería de Software · Cuarto Semestre</p>
      </div>
    </footer>
  </div>`;
}

function quickLogin(email, password) {
  // 1. Cerrar sesión anterior completamente
  Auth.logout();
  // 2. Hacer login
  const result = Auth.login(email, password);
  if (!result.success) {
    showToast('Error', result.error, 'error');
    return;
  }
  // 3. Verificar que el usuario se guardó correctamente
  const check = Auth.getCurrentUser();
  if (!check) {
    showToast('Error', 'No se pudo iniciar sesión. Intenta de nuevo.', 'error');
    return;
  }
  showToast('¡Bienvenido!', `${check.name.split(' ')[0]} · ${check.role}`, 'success');
  // 4. Navegar con el usuario verificado
  navigate('dashboard');
}

function resetDemoData() {
  // Limpiar absolutamente todo
  Object.keys(localStorage).filter(k => k.startsWith('ef_')).forEach(k => localStorage.removeItem(k));
  // Re-correr seed
  DB.seed();
  showToast('Datos reseteados', 'Usa los botones de acceso rápido para ingresar', 'success');
  navigate('landing');
}
