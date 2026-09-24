// ===== EVOLUTION FIT — APP INIT =====
document.addEventListener('DOMContentLoaded', () => {
  const splash = document.getElementById('splash-screen');
  setTimeout(() => {
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.display = 'none';
      // Leer usuario DESPUÉS del seed (el seed puede haber limpiado la sesión)
      const user = Auth.getCurrentUser();
      if (user) {
        navigate('dashboard');
      } else {
        navigate('landing');
      }
    }, 500);
  }, 2200);
});

// Cerrar notificaciones al hacer clic fuera
document.addEventListener('click', (e) => {
  const panel = document.getElementById('notifications-panel');
  const bell = document.querySelector('.nav-notifications');
  if (panel && !panel.classList.contains('hidden') && !panel.contains(e.target) && !bell?.contains(e.target)) {
    panel.classList.add('hidden');
  }
});

// Cerrar menú móvil al hacer clic en un link
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('nav-link')) {
    document.getElementById('nav-links-user')?.classList.remove('open');
    document.getElementById('nav-links-coach')?.classList.remove('open');
    document.getElementById('nav-links-admin')?.classList.remove('open');
  }
});
