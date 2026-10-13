// ===== GAMIFICATION PAGE =====
const ACHIEVEMENTS_CATALOG = [
  { id:'first_workout', icon:'fas fa-dumbbell', emoji:'💪', name:'Primer Entrenamiento', description:'Completa tu primer entrenamiento', points:50, color:'#6C63FF', category:'workout' },
  { id:'streak_3', icon:'fas fa-fire', emoji:'🔥', name:'Racha de 3 días', description:'Entrena 3 días consecutivos', points:100, color:'#FF6584', category:'streak' },
  { id:'streak_7', icon:'fas fa-fire-alt', emoji:'🔥🔥', name:'Semana Perfecta', description:'Entrena 7 días consecutivos', points:250, color:'#FF6584', category:'streak' },
  { id:'streak_30', icon:'fas fa-crown', emoji:'👑', name:'Mes Imparable', description:'Entrena 30 días consecutivos', points:1000, color:'#F7971E', category:'streak' },
  { id:'weight_loss_5', icon:'fas fa-weight', emoji:'⚖️', name:'Primeros 5kg', description:'Pierde 5 kg de tu peso inicial', points:300, color:'#43E97B', category:'progress' },
  { id:'gym_10', icon:'fas fa-dumbbell', emoji:'🏋️', name:'Habitué del Gym', description:'Completa 10 rutinas en el gimnasio', points:200, color:'#FF6584', category:'space' },
  { id:'park_10', icon:'fas fa-tree', emoji:'🌳', name:'Atleta del Parque', description:'Completa 10 rutinas en el parque', points:200, color:'#43E97B', category:'space' },
  { id:'home_10', icon:'fas fa-home', emoji:'🏠', name:'Campeón en Casa', description:'Completa 10 rutinas en casa', points:200, color:'#6C63FF', category:'space' },
  { id:'nutrition_7', icon:'fas fa-apple-alt', emoji:'🥗', name:'Semana Saludable', description:'Registra tu alimentación 7 días seguidos', points:150, color:'#43E97B', category:'nutrition' },
  { id:'calories_10000', icon:'fas fa-fire', emoji:'🔥', name:'Quema Total', description:'Quema 10,000 calorías en total', points:500, color:'#FF6584', category:'calories' },
  { id:'profile_complete', icon:'fas fa-user-check', emoji:'✅', name:'Perfil Completo', description:'Completa todos los datos de tu perfil', points:75, color:'#38BDF8', category:'profile' },
  { id:'first_photo', icon:'fas fa-camera', emoji:'📸', name:'Primera Foto', description:'Sube tu primera foto de progreso', points:50, color:'#A855F7', category:'progress' },
  { id:'coach_message', icon:'fas fa-user-tie', emoji:'🎯', name:'Conectado con Coach', description:'Envía tu primer mensaje al coach', points:50, color:'#43E97B', category:'social' },
  { id:'store_first', icon:'fas fa-shopping-bag', emoji:'🛍️', name:'Primera Compra', description:'Realiza tu primera compra en la tienda', points:100, color:'#A855F7', category:'store' },
  { id:'workouts_50', icon:'fas fa-medal', emoji:'🥇', name:'50 Entrenamientos', description:'Completa 50 entrenamientos en total', points:750, color:'#F7971E', category:'workout' },
  { id:'workouts_100', icon:'fas fa-trophy', emoji:'🏆', name:'Centenario', description:'Completa 100 entrenamientos', points:2000, color:'#F7971E', category:'workout' }
];

function renderGamification(user) {
  const userAchievements = DB.getUserAchievements(user.id);
  const unlockedIds = userAchievements.map(a => a.achievementId);
  const totalPoints = ACHIEVEMENTS_CATALOG.filter(a => unlockedIds.includes(a.id)).reduce((s, a) => s + a.points, 0);
  const level = getLevel(user.points || 0);
  const nextLevel = getNextLevel(user.points || 0);

  return `
  <div class="page">
    <div class="section-header">
      <h1 class="section-title"><i class="fas fa-trophy"></i> Logros y Gamificación</h1>
      <p class="section-subtitle">Gana puntos, desbloquea logros y sube de nivel</p>
    </div>

    <!-- PERFIL DE JUGADOR -->
    <div class="player-profile">
      <div class="pp-avatar">${getAvatarHTML(user, 80)}</div>
      <div class="pp-info">
        <h2>${user.name}</h2>
        <div class="pp-level">
          <span class="level-badge" style="background:${level.color}22;color:${level.color};border:1px solid ${level.color}44">
            <i class="${level.icon}"></i> ${level.name}
          </span>
        </div>
        <div class="pp-points">
          <span class="points-display"><i class="fas fa-star" style="color:#F7971E"></i> ${(user.points || 0).toLocaleString()} puntos</span>
          <span class="streak-display"><i class="fas fa-fire" style="color:#FF6584"></i> ${user.streak || 0} días de racha</span>
        </div>
        <div class="pp-progress">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem">
            <span style="font-size:0.8rem;color:var(--text-muted)">Progreso al siguiente nivel</span>
            <span style="font-size:0.8rem;color:var(--text-muted)">${user.points || 0} / ${nextLevel.threshold} pts</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${Math.min(100, ((user.points||0)/nextLevel.threshold)*100)}%;background:${level.color}"></div>
          </div>
          <p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.5rem">Próximo nivel: <strong style="color:${nextLevel.color}">${nextLevel.name}</strong></p>
        </div>
      </div>
      <div class="pp-stats">
        <div class="pp-stat"><strong>${unlockedIds.length}</strong><span>Logros</span></div>
        <div class="pp-stat"><strong>${ACHIEVEMENTS_CATALOG.length - unlockedIds.length}</strong><span>Pendientes</span></div>
        <div class="pp-stat"><strong>${totalPoints}</strong><span>Pts ganados</span></div>
      </div>
    </div>

    <!-- TABS -->
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('tab-achievements','gamification')">Logros</button>
      <button class="tab-btn" onclick="switchTab('tab-ranking','gamification')">Ranking</button>
      <button class="tab-btn" onclick="switchTab('tab-challenges','gamification')">Retos</button>
    </div>

    <!-- LOGROS -->
    <div id="tab-achievements" class="tab-content active">
      <div class="achievements-filter" style="margin-bottom:1.5rem">
        <button class="filter-btn active" onclick="filterAchievements('all',this)">Todos</button>
        <button class="filter-btn" onclick="filterAchievements('unlocked',this)">Desbloqueados</button>
        <button class="filter-btn" onclick="filterAchievements('locked',this)">Por desbloquear</button>
        <button class="filter-btn" onclick="filterAchievements('workout',this)">Entrenamiento</button>
        <button class="filter-btn" onclick="filterAchievements('streak',this)">Racha</button>
        <button class="filter-btn" onclick="filterAchievements('progress',this)">Progreso</button>
      </div>
      <div class="achievements-grid" id="achievements-grid">
        ${ACHIEVEMENTS_CATALOG.map(a => {
          const unlocked = unlockedIds.includes(a.id);
          return `
          <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}" data-category="${a.category}" data-status="${unlocked?'unlocked':'locked'}">
            <div class="ac-icon" style="background:${unlocked ? a.color+'22' : 'rgba(144,144,176,0.1)'};color:${unlocked ? a.color : 'var(--text-muted)'}">
              <span style="font-size:2rem">${a.emoji}</span>
            </div>
            <div class="ac-info">
              <h4>${a.name}</h4>
              <p>${a.description}</p>
              <div class="ac-points">
                <i class="fas fa-star" style="color:${unlocked?'#F7971E':'var(--text-muted)'}"></i>
                <span style="color:${unlocked?'#F7971E':'var(--text-muted)'}">${a.points} pts</span>
              </div>
            </div>
            ${unlocked ? '<div class="ac-check"><i class="fas fa-check-circle" style="color:#43E97B;font-size:1.5rem"></i></div>' : '<div class="ac-lock"><i class="fas fa-lock" style="color:var(--text-muted)"></i></div>'}
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- RANKING -->
    <div id="tab-ranking" class="tab-content">
      <div class="card">
        <div class="card-header"><h3 class="card-title"><i class="fas fa-medal" style="color:#F7971E"></i> Top Usuarios</h3></div>
        <div class="ranking-list">
          ${DB.getUsers().sort((a,b) => (b.points||0)-(a.points||0)).map((u, i) => `
            <div class="ranking-item ${u.id === user.id ? 'current-user' : ''}">
              <div class="rank-position ${i===0?'gold':i===1?'silver':i===2?'bronze':''}">
                ${i < 3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}
              </div>
              ${getAvatarHTML(u, 40)}
              <div class="rank-info">
                <p>${u.name} ${u.id === user.id ? '<span class="badge badge-primary">Tú</span>' : ''}</p>
                <span>${getLevelBadge(u.level)}</span>
              </div>
              <div class="rank-points">
                <strong>${(u.points||0).toLocaleString()}</strong>
                <span>pts</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- RETOS -->
    <div id="tab-challenges" class="tab-content">
      <div class="grid-auto">
        ${getChallenges().map(c => `
          <div class="challenge-card">
            <div class="cc-header" style="background:${c.color}22">
              <span style="font-size:2.5rem">${c.emoji}</span>
              <span class="badge" style="background:${c.color}22;color:${c.color}">${c.timeLeft}</span>
            </div>
            <div class="cc-body">
              <h3>${c.name}</h3>
              <p>${c.description}</p>
              <div class="cc-progress">
                <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem">
                  <span style="font-size:0.8rem">Progreso</span>
                  <span style="font-size:0.8rem">${c.current}/${c.goal}</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${(c.current/c.goal)*100}%;background:${c.color}"></div></div>
              </div>
              <div class="cc-reward"><i class="fas fa-star" style="color:#F7971E"></i> Recompensa: ${c.reward} pts</div>
            </div>
            <button class="btn btn-primary btn-block btn-sm" onclick="joinChallenge('${c.id}')">
              ${c.joined ? '<i class="fas fa-check"></i> Participando' : '<i class="fas fa-plus"></i> Unirse'}
            </button>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;
}

function getLevel(points) {
  if (points >= 5000) return { name: 'Élite', icon: 'fas fa-crown', color: '#F7971E' };
  if (points >= 2000) return { name: 'Avanzado', icon: 'fas fa-medal', color: '#FF6584' };
  if (points >= 500) return { name: 'Intermedio', icon: 'fas fa-star', color: '#6C63FF' };
  return { name: 'Principiante', icon: 'fas fa-seedling', color: '#43E97B' };
}

function getNextLevel(points) {
  if (points >= 5000) return { name: 'Máximo', threshold: 10000, color: '#F7971E' };
  if (points >= 2000) return { name: 'Élite', threshold: 5000, color: '#F7971E' };
  if (points >= 500) return { name: 'Avanzado', threshold: 2000, color: '#FF6584' };
  return { name: 'Intermedio', threshold: 500, color: '#6C63FF' };
}

function getChallenges() {
  return [
    { id:'c1', name:'Reto 30 días HIIT', emoji:'⚡', description:'Completa una sesión HIIT cada día durante 30 días', color:'#FF6584', timeLeft:'15 días', current:15, goal:30, reward:1000, joined:true },
    { id:'c2', name:'Maratón de Parque', emoji:'🌳', description:'Acumula 50km corriendo en el parque este mes', color:'#43E97B', timeLeft:'20 días', current:23, goal:50, reward:500, joined:true },
    { id:'c3', name:'Nutrición Perfecta', emoji:'🥗', description:'Registra tu alimentación 21 días consecutivos', color:'#F7971E', timeLeft:'10 días', current:8, goal:21, reward:300, joined:false },
    { id:'c4', name:'Fuerza Total', emoji:'💪', description:'Completa 20 rutinas de fuerza en el mes', color:'#6C63FF', timeLeft:'25 días', current:7, goal:20, reward:400, joined:false }
  ];
}

function filterAchievements(filter, btn) {
  document.querySelectorAll('.achievements-filter .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.achievement-card').forEach(card => {
    if (filter === 'all') { card.style.display = 'flex'; return; }
    if (filter === 'unlocked' || filter === 'locked') {
      card.style.display = card.dataset.status === filter ? 'flex' : 'none';
    } else {
      card.style.display = card.dataset.category === filter ? 'flex' : 'none';
    }
  });
}

function joinChallenge(id) {
  showToast('¡Unido al reto!', 'Ahora participas en este desafío', 'success');
}
