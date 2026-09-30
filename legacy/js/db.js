// ===== EVOLUTION FIT — BASE DE DATOS (localStorage) =====
const DB = {
  // ---- USUARIOS ----
  getUsers() { return JSON.parse(localStorage.getItem('ef_users') || '[]'); },
  saveUsers(u) { localStorage.setItem('ef_users', JSON.stringify(u)); },
  getUserById(id) { return this.getUsers().find(u => u.id === id) || null; },
  getUserByEmail(email) { return this.getUsers().find(u => u.email === email.toLowerCase()) || null; },
  createUser(data) {
    const users = this.getUsers();
    const user = {
      id: 'u_' + Date.now(),
      name: data.name,
      email: data.email.toLowerCase(),
      password: data.password,
      role: data.role || 'user',
      avatar: data.avatar || '',
      avatarColor: data.avatarColor || '#6C63FF',
      age: data.age || '',
      gender: data.gender || '',
      weight: data.weight || '',
      height: data.height || '',
      population: data.population || 'general',
      goal: data.goal || 'fitness',
      preferredSpace: data.preferredSpace || 'gym',
      level: data.level || 'beginner',
      plan: data.plan || 'free',
      points: 0,
      streak: 0,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      notifications: true,
      bio: data.bio || '',
      phone: data.phone || '',
      medicalConditions: data.medicalConditions || '',
      emergencyContact: data.emergencyContact || ''
    };
    users.push(user);
    this.saveUsers(users);
    return user;
  },
  updateUser(id, data) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === id);
    if (idx !== -1) { users[idx] = { ...users[idx], ...data }; this.saveUsers(users); return users[idx]; }
    return null;
  },
  deleteUser(id) {
    const users = this.getUsers().filter(u => u.id !== id);
    this.saveUsers(users);
  },

  // ---- RUTINAS ----
  getRoutines() { return JSON.parse(localStorage.getItem('ef_routines') || '[]'); },
  saveRoutines(r) { localStorage.setItem('ef_routines', JSON.stringify(r)); },
  getRoutinesByUser(uid) { return this.getRoutines().filter(r => r.userId === uid || r.isPublic); },
  createRoutine(data) {
    const routines = this.getRoutines();
    const r = { id: 'r_' + Date.now(), ...data, createdAt: new Date().toISOString() };
    routines.push(r);
    this.saveRoutines(routines);
    return r;
  },
  updateRoutine(id, data) {
    const routines = this.getRoutines();
    const idx = routines.findIndex(r => r.id === id);
    if (idx !== -1) { routines[idx] = { ...routines[idx], ...data }; this.saveRoutines(routines); return routines[idx]; }
    return null;
  },
  deleteRoutine(id) { this.saveRoutines(this.getRoutines().filter(r => r.id !== id)); },

  // ---- PROGRESO ----
  getProgress() { return JSON.parse(localStorage.getItem('ef_progress') || '[]'); },
  saveProgress(p) { localStorage.setItem('ef_progress', JSON.stringify(p)); },
  getProgressByUser(uid) { return this.getProgress().filter(p => p.userId === uid); },
  addProgress(data) {
    const progress = this.getProgress();
    const p = { id: 'p_' + Date.now(), ...data, date: new Date().toISOString() };
    progress.push(p);
    this.saveProgress(progress);
    return p;
  },

  // ---- NUTRICIÓN ----
  getNutrition() { return JSON.parse(localStorage.getItem('ef_nutrition') || '[]'); },
  saveNutrition(n) { localStorage.setItem('ef_nutrition', JSON.stringify(n)); },
  getNutritionByUser(uid) { return this.getNutrition().filter(n => n.userId === uid); },
  addNutritionLog(data) {
    const logs = this.getNutrition();
    const n = { id: 'n_' + Date.now(), ...data, date: new Date().toISOString() };
    logs.push(n);
    this.saveNutrition(logs);
    return n;
  },

  // ---- LOGROS ----
  getAchievements() { return JSON.parse(localStorage.getItem('ef_achievements') || '[]'); },
  saveAchievements(a) { localStorage.setItem('ef_achievements', JSON.stringify(a)); },
  getUserAchievements(uid) { return this.getAchievements().filter(a => a.userId === uid); },
  unlockAchievement(uid, achievementId) {
    const achievements = this.getAchievements();
    if (!achievements.find(a => a.userId === uid && a.achievementId === achievementId)) {
      achievements.push({ id: 'a_' + Date.now(), userId: uid, achievementId, unlockedAt: new Date().toISOString() });
      this.saveAchievements(achievements);
      return true;
    }
    return false;
  },

  // ---- TIENDA / PEDIDOS ----
  getOrders() { return JSON.parse(localStorage.getItem('ef_orders') || '[]'); },
  saveOrders(o) { localStorage.setItem('ef_orders', JSON.stringify(o)); },
  getOrdersByUser(uid) { return this.getOrders().filter(o => o.userId === uid); },
  createOrder(data) {
    const orders = this.getOrders();
    const o = { id: 'ord_' + Date.now(), ...data, status: 'pending', createdAt: new Date().toISOString() };
    orders.push(o);
    this.saveOrders(orders);
    return o;
  },

  // ---- MENSAJES COACH ----
  getMessages() { return JSON.parse(localStorage.getItem('ef_messages') || '[]'); },
  saveMessages(m) { localStorage.setItem('ef_messages', JSON.stringify(m)); },
  getMessagesByUser(uid) { return this.getMessages().filter(m => m.userId === uid || m.coachId === uid); },
  sendMessage(data) {
    const msgs = this.getMessages();
    const m = { id: 'm_' + Date.now(), ...data, timestamp: new Date().toISOString(), read: false };
    msgs.push(m);
    this.saveMessages(msgs);
    return m;
  },

  // ---- NOTIFICACIONES ----
  getNotifications(uid) { return JSON.parse(localStorage.getItem('ef_notif_' + uid) || '[]'); },
  addNotification(uid, notif) {
    const notifs = this.getNotifications(uid);
    notifs.unshift({ id: 'nf_' + Date.now(), ...notif, read: false, time: new Date().toISOString() });
    localStorage.setItem('ef_notif_' + uid, JSON.stringify(notifs.slice(0, 20)));
  },

  // ---- FOTOS DE PROGRESO ----
  getProgressPhotos() { return JSON.parse(localStorage.getItem('ef_progress_photos') || '[]'); },
  saveProgressPhotos(p) { localStorage.setItem('ef_progress_photos', JSON.stringify(p)); },
  getProgressPhotosByUser(uid) { return this.getProgressPhotos().filter(p => p.userId === uid); },
  addProgressPhoto(data) {
    const photos = this.getProgressPhotos();
    const p = {
      id: 'ph_' + Date.now(),
      userId: data.userId,
      dataUrl: data.dataUrl,
      caption: data.caption || '',
      category: data.category || 'general', // front, back, side, general
      weight: data.weight || null,
      date: new Date().toISOString()
    };
    photos.push(p);
    this.saveProgressPhotos(photos);
    return p;
  },
  deleteProgressPhoto(id) {
    this.saveProgressPhotos(this.getProgressPhotos().filter(p => p.id !== id));
  },

  // ---- CARRITO ----
  getCart() { return JSON.parse(localStorage.getItem('ef_cart') || '[]'); },
  saveCart(c) { localStorage.setItem('ef_cart', JSON.stringify(c)); },
  addToCart(item) {
    const cart = this.getCart();
    const existing = cart.find(c => c.id === item.id);
    if (existing) { existing.qty = (existing.qty || 1) + 1; }
    else { cart.push({ ...item, qty: 1 }); }
    this.saveCart(cart);
  },
  removeFromCart(id) { this.saveCart(this.getCart().filter(c => c.id !== id)); },
  clearCart() { localStorage.removeItem('ef_cart'); },

  // ---- SEED DATA ----
  SEED_VERSION: 'ef_seed_v6',

  seed() {
    if (localStorage.getItem(this.SEED_VERSION)) return;

    // Limpiar datos pero NO la sesión activa
    const sessionBackup = localStorage.getItem('ef_session');
    const keysToRemove = Object.keys(localStorage).filter(k => k.startsWith('ef_') && k !== 'ef_session');
    keysToRemove.forEach(k => localStorage.removeItem(k));
    // La sesión vieja apuntará a IDs que ya no existen — Auth.getCurrentUser() retornará null automáticamente

    this.createUser({ name: 'Admin Evolution', email: 'admin@evolutionfit.com', password: 'Admin123!', role: 'admin', avatarColor: '#FF6584', population: 'general', level: 'advanced', plan: 'premium' });
    this.createUser({ name: 'Coach Carlos Ruiz', email: 'coach@evolutionfit.com', password: 'Coach123!', role: 'coach', avatarColor: '#43E97B', population: 'general', level: 'advanced', plan: 'premium', bio: 'Entrenador certificado con 10 años de experiencia en fitness funcional y nutrición deportiva.' });
    this.createUser({ name: 'María García', email: 'maria@demo.com', password: 'Demo123!', role: 'user', avatarColor: '#6C63FF', age: 28, gender: 'female', weight: 62, height: 165, population: 'general', goal: 'weight_loss', preferredSpace: 'gym', level: 'intermediate', plan: 'premium' });
    this.createUser({ name: 'Juan Pérez', email: 'juan@demo.com', password: 'Demo123!', role: 'user', avatarColor: '#F7971E', age: 35, gender: 'male', weight: 80, height: 178, population: 'general', goal: 'muscle_gain', preferredSpace: 'home', level: 'beginner', plan: 'free' });
    this.createUser({ name: 'Ana Martínez', email: 'ana@demo.com', password: 'Demo123!', role: 'user', avatarColor: '#38BDF8', age: 45, gender: 'female', weight: 70, height: 160, population: 'adulto_mayor', goal: 'flexibility', preferredSpace: 'park', level: 'beginner', plan: 'free' });

    const routinesData = [
      { name: 'HIIT Quema Grasa Total', description: 'Rutina de alta intensidad para quemar grasa rápidamente', space: 'gym', level: 'intermediate', population: ['general','adulto'], duration: 45, calories: 450, category: 'hiit', isPublic: true, userId: 'system', exercises: [
        { name: 'Burpees',            sets: 4, reps: 15,       rest: 30, muscle: 'Full Body', videoId: 'TU8QYVW0gDU' },
        { name: 'Mountain Climbers',  sets: 4, reps: 20,       rest: 30, muscle: 'Core',      videoId: 'nmwgirgXLYM' },
        { name: 'Jump Squats',        sets: 4, reps: 15,       rest: 45, muscle: 'Piernas',   videoId: 'CVaEhXotL7M' },
        { name: 'Push-ups explosivos',sets: 3, reps: 12,       rest: 45, muscle: 'Pecho',     videoId: 'IODxDxX7oi4' },
        { name: 'High Knees',         sets: 4, duration: '30s',rest: 30, muscle: 'Cardio',    videoId: 'ZZZoCNMU48U' }
      ]},
      { name: 'Fuerza en Casa — Sin Equipos', description: 'Entrenamiento de fuerza completo usando solo tu peso corporal', space: 'home', level: 'beginner', population: ['general','embarazada_post'], duration: 40, calories: 280, category: 'strength', isPublic: true, userId: 'system', exercises: [
        { name: 'Sentadillas',  sets: 4, reps: 20,       rest: 60, muscle: 'Piernas',  videoId: 'aclHkVaku9U' },
        { name: 'Flexiones',    sets: 3, reps: 10,       rest: 60, muscle: 'Pecho',    videoId: 'IODxDxX7oi4' },
        { name: 'Zancadas',     sets: 3, reps: 12,       rest: 60, muscle: 'Glúteos',  videoId: 'QOVaHwm-Q6U' },
        { name: 'Plancha',      sets: 3, duration: '45s',rest: 45, muscle: 'Core',     videoId: 'pSHjTRCQxIw' },
        { name: 'Glute Bridge', sets: 4, reps: 15,       rest: 45, muscle: 'Glúteos',  videoId: 'OUgsJ8-Vi0E' }
      ]},
      { name: 'Cardio Parque — Funcional', description: 'Aprovecha el parque para un entrenamiento funcional completo', space: 'park', level: 'beginner', population: ['general','adulto_mayor'], duration: 50, calories: 320, category: 'cardio', isPublic: true, userId: 'system', exercises: [
        { name: 'Trote suave',          sets: 1, duration: '10min',rest: 0,  muscle: 'Cardio',   videoId: 'wFPBDMBMFgQ' },
        { name: 'Sentadillas en banco', sets: 3, reps: 15,         rest: 60, muscle: 'Piernas',  videoId: 'aclHkVaku9U' },
        { name: 'Dips en banco',        sets: 3, reps: 10,         rest: 60, muscle: 'Tríceps',  videoId: '2z8JmcrW-As' },
        { name: 'Estocadas caminando',  sets: 3, reps: 20,         rest: 60, muscle: 'Piernas',  videoId: 'QOVaHwm-Q6U' },
        { name: 'Abdominales',          sets: 3, reps: 20,         rest: 45, muscle: 'Core',     videoId: 'Xyd_fa5zoEU' }
      ]},
      { name: 'Gym — Hipertrofia Tren Superior', description: 'Rutina de gimnasio enfocada en ganar masa muscular en la parte superior', space: 'gym', level: 'advanced', population: ['general'], duration: 60, calories: 380, category: 'strength', isPublic: true, userId: 'system', exercises: [
        { name: 'Press de banca',    sets: 4, reps: 8,  rest: 90, muscle: 'Pecho',    videoId: 'rT7DgCr-3pg' },
        { name: 'Remo con barra',    sets: 4, reps: 8,  rest: 90, muscle: 'Espalda',  videoId: '9efgcAjQe7E' },
        { name: 'Press militar',     sets: 3, reps: 10, rest: 75, muscle: 'Hombros',  videoId: '2yjwXTZQDDI' },
        { name: 'Curl de bíceps',    sets: 3, reps: 12, rest: 60, muscle: 'Bíceps',   videoId: 'ykJmrZ5v0Oo' },
        { name: 'Extensión tríceps', sets: 3, reps: 12, rest: 60, muscle: 'Tríceps',  videoId: 'nRiJVZDpdL0' }
      ]},
      { name: 'Yoga & Movilidad — Adulto Mayor', description: 'Rutina suave de movilidad y flexibilidad para adultos mayores', space: 'home', level: 'beginner', population: ['adulto_mayor'], duration: 35, calories: 120, category: 'flexibility', isPublic: true, userId: 'system', exercises: [
        { name: 'Respiración profunda',   sets: 1, duration: '5min',rest: 0,  muscle: 'Respiratorio', videoId: 'tybOi4hjZFQ' },
        { name: 'Rotación de cuello',     sets: 2, reps: 10,        rest: 30, muscle: 'Cuello',       videoId: 'kNFsdGsaB2s' },
        { name: 'Estiramiento de cadera', sets: 3, duration: '30s', rest: 30, muscle: 'Cadera',       videoId: 'sTxC3J3gQEU' },
        { name: 'Postura gato-vaca',      sets: 3, reps: 10,        rest: 30, muscle: 'Columna',      videoId: 'kqnua4rHVVA' },
        { name: 'Equilibrio en un pie',   sets: 3, duration: '20s', rest: 30, muscle: 'Equilibrio',   videoId: 'L8fvypPrzzs' }
      ]},
      { name: 'Prenatal — Ejercicio Seguro', description: 'Rutina especialmente diseñada para mujeres embarazadas', space: 'home', level: 'beginner', population: ['embarazada'], duration: 30, calories: 150, category: 'prenatal', isPublic: true, userId: 'system', exercises: [
        { name: 'Caminata suave',      sets: 1, duration: '10min',rest: 0,  muscle: 'Cardio',          videoId: 'wFPBDMBMFgQ' },
        { name: 'Sentadillas suaves',  sets: 3, reps: 10,         rest: 60, muscle: 'Piernas',         videoId: 'aclHkVaku9U' },
        { name: 'Kegel',               sets: 3, reps: 15,         rest: 30, muscle: 'Suelo pélvico',   videoId: 'GsH6_oVFHoI' },
        { name: 'Estiramiento lateral',sets: 2, duration: '30s',  rest: 30, muscle: 'Costados',        videoId: 'sTxC3J3gQEU' },
        { name: 'Respiración prenatal',sets: 1, duration: '5min', rest: 0,  muscle: 'Respiratorio',    videoId: 'tybOi4hjZFQ' }
      ]},
      { name: 'Cardio Funcional Gym', description: 'Combina cardio y fuerza en el gimnasio para máximos resultados', space: 'gym', level: 'intermediate', population: ['general','adulto'], duration: 55, calories: 500, category: 'hiit', isPublic: true, userId: 'system', exercises: [
        { name: 'Remo en máquina',  sets: 3, duration: '5min',rest: 60, muscle: 'Espalda/Cardio', videoId: 'H0r_QGBqBQ0' },
        { name: 'Kettlebell Swing', sets: 4, reps: 20,         rest: 45, muscle: 'Full Body',     videoId: 'sSESeQAir2M' },
        { name: 'Box Jumps',        sets: 4, reps: 10,         rest: 60, muscle: 'Piernas',       videoId: 'hxldG9BIRdA' },
        { name: 'Battle Ropes',     sets: 4, duration: '30s',  rest: 45, muscle: 'Full Body',     videoId: 'roHCTikMUkE' },
        { name: 'Sled Push',        sets: 3, duration: '20m',  rest: 90, muscle: 'Full Body',     videoId: 'sSESeQAir2M' }
      ]},
      { name: 'Parque — Calistenia Básica', description: 'Domina tu peso corporal en las barras del parque', space: 'park', level: 'intermediate', population: ['general','joven'], duration: 45, calories: 300, category: 'calisthenics', isPublic: true, userId: 'system', exercises: [
        { name: 'Dominadas',           sets: 4, reps: 8,         rest: 90,  muscle: 'Espalda',        videoId: 'eGo4IYlbE5g' },
        { name: 'Fondos en paralelas', sets: 4, reps: 10,        rest: 90,  muscle: 'Pecho/Tríceps',  videoId: '2z8JmcrW-As' },
        { name: 'L-sit',               sets: 3, duration: '15s', rest: 60,  muscle: 'Core',           videoId: 'IUZJoSP66HI' },
        { name: 'Muscle-up negativo',  sets: 3, reps: 5,         rest: 120, muscle: 'Full Body',      videoId: 'A_4SRBMCsGg' },
        { name: 'Pistol Squat',        sets: 3, reps: 8,         rest: 60,  muscle: 'Piernas',        videoId: 'vq5-vdgJc0I' }
      ]}
    ];
    routinesData.forEach(r => this.createRoutine(r));

    // Progreso demo
    const demoUser = this.getUserByEmail('maria@demo.com');
    if (demoUser) {
      const months = ['2025-01','2025-02','2025-03','2025-04','2025-05'];
      const weights = [68, 66.5, 65, 63.5, 62];
      months.forEach((m, i) => {
        this.addProgress({ userId: demoUser.id, type: 'weight', value: weights[i], unit: 'kg', note: 'Registro mensual', date: m + '-01' });
      });
      this.addProgress({ userId: demoUser.id, type: 'workout', value: 45, unit: 'min', note: 'HIIT completado', date: '2025-05-28' });
      this.addProgress({ userId: demoUser.id, type: 'workout', value: 60, unit: 'min', note: 'Fuerza tren superior', date: '2025-05-26' });
    }

    // Notificaciones demo
    const users = this.getUsers();
    users.forEach(u => {
      this.addNotification(u.id, { type: 'achievement', icon: 'fas fa-trophy', color: '#F7971E', title: '¡Bienvenido a Evolution Fit!', message: 'Tu cuenta ha sido creada exitosamente.' });
      this.addNotification(u.id, { type: 'workout', icon: 'fas fa-dumbbell', color: '#6C63FF', title: 'Rutina recomendada', message: 'Tienes una nueva rutina disponible según tu perfil.' });
      this.addNotification(u.id, { type: 'coach', icon: 'fas fa-user-tie', color: '#43E97B', title: 'Mensaje del Coach', message: 'El Coach Carlos ha revisado tu progreso.' });
    });

    // Marcar esta versión del seed como completada
    localStorage.setItem(this.SEED_VERSION, 'true');
  }
};

// Inicializar datos
DB.seed();

