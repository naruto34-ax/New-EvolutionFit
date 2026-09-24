// ===== EVOLUTION FIT — AUTENTICACIÓN =====
const Auth = {
  SESSION_KEY: 'ef_session',

  getCurrentUser() {
    const session = localStorage.getItem(this.SESSION_KEY);
    if (!session) return null;
    try {
      const { userId, expires } = JSON.parse(session);
      if (Date.now() > expires) { this.logout(); return null; }
      // Siempre leer desde DB para obtener el rol actualizado
      const user = DB.getUserById(userId);
      if (!user) { this.logout(); return null; } // usuario eliminado
      return user;
    } catch { return null; }
  },

  login(email, password) {
    const user = DB.getUserByEmail(email);
    if (!user) return { success: false, error: 'Correo electrónico no registrado.' };
    if (user.password !== password) return { success: false, error: 'Contraseña incorrecta.' };
    const session = { userId: user.id, expires: Date.now() + (7 * 24 * 60 * 60 * 1000) };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    DB.updateUser(user.id, { lastLogin: new Date().toISOString() });
    return { success: true, user: DB.getUserById(user.id) }; // retornar usuario fresco
  },

  register(data) {
    if (!data.name || data.name.trim().length < 2) return { success: false, error: 'El nombre debe tener al menos 2 caracteres.' };
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return { success: false, error: 'Correo electrónico inválido.' };
    if (DB.getUserByEmail(data.email)) return { success: false, error: 'Este correo ya está registrado.' };
    if (!data.password || data.password.length < 6) return { success: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
    if (data.password !== data.confirmPassword) return { success: false, error: 'Las contraseñas no coinciden.' };
    const colors = ['#6C63FF','#FF6584','#43E97B','#F7971E','#38BDF8','#A855F7','#EC4899'];
    data.avatarColor = colors[Math.floor(Math.random() * colors.length)];
    const user = DB.createUser(data);
    const session = { userId: user.id, expires: Date.now() + (7 * 24 * 60 * 60 * 1000) };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    DB.addNotification(user.id, { type: 'welcome', icon: 'fas fa-star', color: '#F7971E', title: '¡Bienvenido a Evolution Fit!', message: 'Tu cuenta ha sido creada. ¡Comienza tu transformación!' });
    return { success: true, user };
  },

  logout() {
    localStorage.removeItem(this.SESSION_KEY);
  },

  isLoggedIn() { return this.getCurrentUser() !== null; },
  isAdmin() { const u = this.getCurrentUser(); return u && u.role === 'admin'; },
  isCoach() { const u = this.getCurrentUser(); return u && (u.role === 'coach' || u.role === 'admin'); },

  requireAuth() {
    if (!this.isLoggedIn()) { navigate('login'); return false; }
    return true;
  },

  requireAdmin() {
    if (!this.isAdmin()) { showToast('Acceso restringido', 'No tienes permisos de administrador.', 'error'); navigate('dashboard'); return false; }
    return true;
  },

  requireCoach() {
    if (!this.isCoach()) { showToast('Acceso restringido', 'Solo coaches pueden acceder.', 'error'); navigate('dashboard'); return false; }
    return true;
  }
};
