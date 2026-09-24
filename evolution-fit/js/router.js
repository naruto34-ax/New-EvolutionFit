// ===== EVOLUTION FIT — ROUTER =====
let currentPage = null;

function navigate(page, params = {}) {
  const user = Auth.getCurrentUser();
  const publicPages = ['landing', 'login', 'register'];

  if (!publicPages.includes(page) && !user) {
    page = 'login';
  }

  // Restricciones de rol
  if (page === 'admin' && user && user.role !== 'admin') {
    showToast('Acceso denegado', 'Solo administradores pueden acceder al panel.', 'error');
    page = 'dashboard';
  }

  currentPage = page;
  const main = document.getElementById('main-content');
  const navbar = document.getElementById('navbar');
  const footer = document.getElementById('app-footer');

  // Mostrar/ocultar navbar y footer
  if (publicPages.includes(page)) {
    navbar.classList.add('hidden');
    footer.classList.add('hidden');
  } else {
    navbar.classList.remove('hidden');
    footer.classList.remove('hidden');
    // Usar usuario fresco para el navbar
    const navUser = Auth.getCurrentUser();
    if (navUser) updateNavbar(navUser);
  }

  // Actualizar links activos (busca en los 3 navbars)
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  document.querySelectorAll(`.nav-link[onclick*="'${page}'"]`).forEach(l => l.classList.add('active'));

  // Actualizar breadcrumb
  updateBreadcrumb(page);

  // Renderizar página
  main.classList.remove('hidden');
  main.innerHTML = '<div class="spinner"></div>';

  setTimeout(() => {
    // Re-leer usuario fresco en el momento del render para evitar datos cacheados
    const freshUser = Auth.getCurrentUser();

    switch (page) {
      case 'landing':      main.innerHTML = renderLanding(); break;
      case 'login':        main.innerHTML = renderLogin(); break;
      case 'register':     main.innerHTML = renderRegister(params); break;
      case 'dashboard':    main.innerHTML = freshUser ? renderDashboard(freshUser) : renderLogin(); break;
      case 'routines':     main.innerHTML = freshUser ? renderRoutines(freshUser, params) : renderLogin(); break;
      case 'nutrition':    main.innerHTML = freshUser ? renderNutrition(freshUser) : renderLogin(); break;
      case 'progress':     main.innerHTML = freshUser ? renderProgress(freshUser) : renderLogin(); break;
      case 'gamification': main.innerHTML = freshUser ? renderGamification(freshUser) : renderLogin(); break;
      case 'store':        main.innerHTML = freshUser ? renderStore(freshUser) : renderLogin(); break;
      case 'coach':        main.innerHTML = freshUser ? renderCoach(freshUser) : renderLogin(); break;
      case 'admin':        main.innerHTML = freshUser ? renderAdmin(freshUser) : renderLogin(); break;
      case 'profile':      main.innerHTML = freshUser ? renderProfile(freshUser) : renderLogin(); break;
      case 'learn':        main.innerHTML = freshUser ? renderLearn(freshUser) : renderLogin(); break;
      default:             main.innerHTML = render404(); break;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    initPageEvents(page);
  }, 150);
}

// ===== BREADCRUMB — Usabilidad: el usuario siempre sabe dónde está =====
const PAGE_LABELS = {
  dashboard: 'Inicio', routines: 'Rutinas', nutrition: 'Nutrición',
  progress: 'Progreso', gamification: 'Logros', store: 'Tienda',
  coach: 'Coach', admin: 'Administración', profile: 'Mi Perfil', learn: 'Aprende'
};

function updateBreadcrumb(page) {
  let bc = document.getElementById('breadcrumb');
  if (!bc) {
    bc = document.createElement('div');
    bc.id = 'breadcrumb';
    bc.className = 'breadcrumb';
    bc.setAttribute('aria-label', 'Ruta de navegación');
    const navbar = document.getElementById('navbar');
    if (navbar) navbar.insertAdjacentElement('afterend', bc);
  }
  const publicPages = ['landing', 'login', 'register'];
  if (publicPages.includes(page)) { bc.style.display = 'none'; return; }
  bc.style.display = 'flex';
  const label = PAGE_LABELS[page] || page;
  bc.innerHTML = `
    <span class="bc-item" onclick="navigate('dashboard')" role="link" tabindex="0" aria-label="Ir a Inicio">
      <i class="fas fa-home"></i> Inicio
    </span>
    <i class="fas fa-chevron-right bc-sep" aria-hidden="true"></i>
    <span class="bc-item bc-current" aria-current="page">${label}</span>
  `;
}

function updateNavbar(user) {
  if (!user) return;
  const img  = document.getElementById('nav-avatar-img');
  const name = document.getElementById('nav-username');

  // Ocultar todos los navbars y mostrar el del rol actual
  const navUser  = document.getElementById('nav-links-user');
  const navCoach = document.getElementById('nav-links-coach');
  const navAdmin = document.getElementById('nav-links-admin');
  if (navUser)  navUser.classList.add('hidden');
  if (navCoach) navCoach.classList.add('hidden');
  if (navAdmin) navAdmin.classList.add('hidden');

  if (user.role === 'admin' && navAdmin)       navAdmin.classList.remove('hidden');
  else if (user.role === 'coach' && navCoach)  navCoach.classList.remove('hidden');
  else if (navUser)                            navUser.classList.remove('hidden');

  // Limpiar avatares duplicados
  document.querySelectorAll('.avatar-placeholder').forEach(el => el.remove());

  img.src = user.avatar || '';
  img.style.display = user.avatar ? 'block' : 'none';
  if (!user.avatar) {
    img.style.display = 'none';
    img.insertAdjacentHTML('afterend', `<div class="avatar-placeholder" style="background:${user.avatarColor};width:32px;height:32px;font-size:0.8rem;" aria-hidden="true">${user.name.charAt(0).toUpperCase()}</div>`);
  }
  name.textContent = user.name.split(' ')[0];

  // Badge de rol junto al nombre
  const existingRoleBadge = document.getElementById('nav-role-badge');
  if (existingRoleBadge) existingRoleBadge.remove();
  const roleColors = { admin: '#FF6584', coach: '#43E97B', user: '#6C63FF' };
  const roleLabels = { admin: 'Admin', coach: 'Coach', user: 'Usuario' };
  const roleBadge = document.createElement('span');
  roleBadge.id = 'nav-role-badge';
  roleBadge.style.cssText = `font-size:0.65rem;font-weight:700;padding:2px 7px;border-radius:50px;background:${roleColors[user.role] || '#6C63FF'}22;color:${roleColors[user.role] || '#6C63FF'};border:1px solid ${roleColors[user.role] || '#6C63FF'}44;margin-left:4px;`;
  roleBadge.textContent = roleLabels[user.role] || user.role;
  name.insertAdjacentElement('afterend', roleBadge);

  // Notificaciones
  const notifs = DB.getNotifications(user.id);
  const unread = notifs.filter(n => !n.read).length;
  const badge  = document.getElementById('notif-badge');
  badge.textContent = unread;
  badge.style.display = unread > 0 ? 'flex' : 'none';
}

function toggleNotifications() {
  const panel = document.getElementById('notifications-panel');
  panel.classList.toggle('hidden');
  const user = Auth.getCurrentUser();
  if (!panel.classList.contains('hidden') && user) {
    const notifs = DB.getNotifications(user.id);
    const list = document.getElementById('notif-list');
    if (notifs.length === 0) {
      list.innerHTML = '<div class="empty-state" style="padding:2rem"><i class="fas fa-bell-slash"></i><p>Sin notificaciones</p></div>';
    } else {
      list.innerHTML = notifs.map(n => `
        <div class="notif-item" role="listitem">
          <div class="notif-icon" style="background:${n.color}22;color:${n.color}" aria-hidden="true"><i class="${n.icon}"></i></div>
          <div class="notif-text">
            <p>${n.title}</p>
            <span>${n.message}</span>
          </div>
        </div>
      `).join('');
    }
    const allNotifs = DB.getNotifications(user.id).map(n => ({ ...n, read: true }));
    localStorage.setItem('ef_notif_' + user.id, JSON.stringify(allNotifs));
    const badge = document.getElementById('notif-badge');
    badge.style.display = 'none';
  }
}

function toggleMobileMenu() {
  const user = Auth.getCurrentUser();
  const navId = user?.role === 'admin' ? 'nav-links-admin'
              : user?.role === 'coach' ? 'nav-links-coach'
              : 'nav-links-user';
  const links = document.getElementById(navId);
  if (!links) return;
  links.classList.toggle('open');
  const toggle = document.querySelector('.nav-toggle');
  if (toggle) toggle.setAttribute('aria-expanded', links.classList.contains('open'));
}

function logout() {
  Auth.logout();
  showToast('Sesión cerrada', 'Hasta pronto. ¡Sigue entrenando!', 'info');
  navigate('landing');
}

function filterBySpace(space) {
  navigate('routines', { space });
}

function render404() {
  return `<div class="page" style="text-align:center;padding:6rem 2rem" role="main">
    <div style="font-size:6rem;margin-bottom:1rem" aria-hidden="true">🏋️</div>
    <h1 class="section-title">Página no encontrada</h1>
    <p class="section-subtitle">La página que buscas no existe o fue movida.</p>
    <button class="btn btn-primary" onclick="navigate('dashboard')"><i class="fas fa-home"></i> Volver al inicio</button>
  </div>`;
}

function initPageEvents(page) {
  if (page === 'progress') initProgressCharts();
  if (page === 'store') initCart();
  if (page === 'admin') initAdminCharts();
  if (page === 'learn') initLearnPage();
  if (page === 'dashboard') setTimeout(initWeightMiniChart, 200);
}

// ===== TOAST SYSTEM =====
function showToast(title, message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  const icons = { success: 'fas fa-check-circle', error: 'fas fa-times-circle', warning: 'fas fa-exclamation-triangle', info: 'fas fa-info-circle' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.setAttribute('role', 'alert');
  toast.innerHTML = `<i class="toast-icon ${icons[type] || icons.info}" aria-hidden="true"></i><div class="toast-text"><p>${title}</p><span>${message}</span></div>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100%)'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ===== MODAL SYSTEM =====
function showModal(title, content, actions = '') {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'modal-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'modal-title');
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title" id="modal-title">${title}</h3>
        <button class="modal-close" onclick="closeModal()" aria-label="Cerrar modal"><i class="fas fa-times" aria-hidden="true"></i></button>
      </div>
      <div class="modal-body">${content}</div>
      ${actions ? `<div class="modal-footer" style="margin-top:1.5rem;display:flex;gap:1rem;justify-content:flex-end">${actions}</div>` : ''}
    </div>`;
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  // Cerrar con Escape
  overlay.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
  document.body.appendChild(overlay);
  // Foco al modal para accesibilidad
  setTimeout(() => overlay.querySelector('.modal-close')?.focus(), 50);
}

function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  if (overlay) overlay.remove();
}

// ===== AVATAR HELPER =====
function getAvatarHTML(user, size = 40) {
  if (user.avatar) return `<img src="${user.avatar}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover" alt="Foto de ${user.name}"/>`;
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${user.avatarColor};display:flex;align-items:center;justify-content:center;font-weight:700;font-size:${size*0.4}px;color:white;flex-shrink:0" aria-label="Avatar de ${user.name}" role="img">${user.name.charAt(0).toUpperCase()}</div>`;
}

function getSpaceBadge(space) {
  const map = { gym: ['space-gym','fas fa-dumbbell','Gimnasio'], park: ['space-park','fas fa-tree','Parque'], home: ['space-home','fas fa-home','Casa'] };
  const [cls, icon, label] = map[space] || ['badge-primary','fas fa-map-marker-alt', space];
  return `<span class="space-badge ${cls}"><i class="${icon}" aria-hidden="true"></i>${label}</span>`;
}

function getLevelBadge(level) {
  const map = { beginner: ['badge-success','Principiante'], intermediate: ['badge-warning','Intermedio'], advanced: ['badge-danger','Avanzado'] };
  const [cls, label] = map[level] || ['badge-primary', level];
  return `<span class="badge ${cls}">${label}</span>`;
}

function getPopulationLabel(pop) {
  const map = { general: 'General', adulto_mayor: 'Adulto Mayor', embarazada: 'Embarazada', joven: 'Joven', adulto: 'Adulto', rehabilitacion: 'Rehabilitación', embarazada_post: 'Post-parto' };
  return map[pop] || pop;
}
