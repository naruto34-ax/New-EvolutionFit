// ===== DASHBOARD PAGE =====

// ---- Enrutador principal ----
function renderDashboard(user) {
  if (!user) return renderLogin();
  // Verificación extra: leer rol directamente de DB
  const dbUser = DB.getUserById(user.id);
  const role = dbUser ? dbUser.role : user.role;
  if (role === 'admin') return renderAdminDashboard(dbUser || user);
  if (role === 'coach') return renderCoachDashboard(dbUser || user);
  return renderUserDashboard(dbUser || user);
}

// ============================================================
// PANEL DE ADMINISTRACIÓN
// ============================================================
function renderAdminDashboard(user) {
  const users    = DB.getUsers();
  const routines = DB.getRoutines();
  const orders   = DB.getOrders();
  const revenue  = orders.reduce((s, o) => s + (o.total || 0), 0);
  const lastUsers  = DB.getUsers().slice(-5).reverse();
  const lastOrders = DB.getOrders().slice(-3).reverse();

  return `
  <div class="page">
    <!-- HEADER -->
    <div class="section-header">
      <div>
        <h1 class="section-title"><i class="fas fa-cog" style="color:#6C63FF"></i> Panel de Administración</h1>
        <p class="section-subtitle">Bienvenido, <strong>${user.name}</strong> — Gestión completa de Evolution Fit</p>
      </div>
      <div style="display:flex;gap:0.75rem">
        <button class="btn btn-secondary btn-sm" onclick="navigate('admin')"><i class="fas fa-expand-alt"></i> Panel completo</button>
      </div>
    </div>

    <!-- STATS -->
    <div class="grid-4" style="margin-bottom:2rem">
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(108,99,255,0.15);color:#6C63FF"><i class="fas fa-users"></i></div>
        <div class="stat-info"><h3>${users.length}</h3><p>Usuarios totales</p><span class="stat-change up"><i class="fas fa-arrow-up"></i> +12% este mes</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(67,233,123,0.15);color:#43E97B"><i class="fas fa-dumbbell"></i></div>
        <div class="stat-info"><h3>${routines.length}</h3><p>Rutinas</p><span class="stat-change up"><i class="fas fa-arrow-up"></i> +5 nuevas</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(247,151,30,0.15);color:#F7971E"><i class="fas fa-shopping-bag"></i></div>
        <div class="stat-info"><h3>${orders.length}</h3><p>Pedidos</p><span class="stat-change up"><i class="fas fa-arrow-up"></i> +8% ventas</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(255,101,132,0.15);color:#FF6584"><i class="fas fa-dollar-sign"></i></div>
        <div class="stat-info"><h3>$${(revenue / 1000).toFixed(0)}K</h3><p>Ingresos</p><span class="stat-change up"><i class="fas fa-arrow-up"></i> +15%</span></div>
      </div>
    </div>

    <!-- ACCIONES RÁPIDAS -->
    <div class="card" style="margin-bottom:2rem">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-bolt" style="color:#F7971E"></i> Acciones rápidas</h3>
      </div>
      <div class="grid-4" style="gap:1rem">
        <button class="btn btn-primary" style="padding:1.25rem;flex-direction:column;gap:0.5rem;height:auto" onclick="navigate('admin')">
          <i class="fas fa-cog" style="font-size:1.5rem"></i>
          <span>Gestión completa</span>
        </button>
        <button class="btn btn-secondary" style="padding:1.25rem;flex-direction:column;gap:0.5rem;height:auto" onclick="navigate('routines')">
          <i class="fas fa-dumbbell" style="font-size:1.5rem"></i>
          <span>Rutinas</span>
        </button>
        <button class="btn btn-secondary" style="padding:1.25rem;flex-direction:column;gap:0.5rem;height:auto" onclick="navigate('store')">
          <i class="fas fa-shopping-bag" style="font-size:1.5rem"></i>
          <span>Tienda / Pedidos</span>
        </button>
        <button class="btn btn-secondary" style="padding:1.25rem;flex-direction:column;gap:0.5rem;height:auto" onclick="navigate('coach')">
          <i class="fas fa-user-tie" style="font-size:1.5rem"></i>
          <span>Coaches</span>
        </button>
      </div>
    </div>

    <!-- ÚLTIMOS USUARIOS + ACTIVIDAD RECIENTE -->
    <div class="grid-2">
      <!-- Últimos 5 usuarios -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-user-plus" style="color:#6C63FF"></i> Últimos registros</h3>
          <button class="btn btn-sm btn-secondary" onclick="navigate('admin')">Ver todos</button>
        </div>
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Plan</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              ${lastUsers.map(u => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:0.6rem">
                      ${getAvatarHTML(u, 32)}
                      <span style="font-weight:600;font-size:0.85rem">${u.name}</span>
                    </div>
                  </td>
                  <td><span class="badge badge-${u.role === 'admin' ? 'danger' : u.role === 'coach' ? 'success' : 'primary'}">${u.role}</span></td>
                  <td><span class="badge badge-${u.plan === 'premium' ? 'warning' : 'primary'}">${u.plan}</span></td>
                  <td style="color:var(--text-muted);font-size:0.8rem">${new Date(u.createdAt).toLocaleDateString('es-CO')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Actividad reciente (últimos 3 pedidos) -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-history" style="color:#F7971E"></i> Actividad reciente</h3>
          <button class="btn btn-sm btn-secondary" onclick="navigate('store')">Ver pedidos</button>
        </div>
        ${lastOrders.length === 0
          ? `<div class="empty-state" style="padding:2rem"><i class="fas fa-shopping-bag"></i><p>Sin pedidos recientes</p></div>`
          : lastOrders.map(o => {
              const orderUser = DB.getUserById(o.userId);
              return `
              <div class="activity-item">
                <div class="ai-icon" style="background:rgba(247,151,30,0.15);color:#F7971E"><i class="fas fa-shopping-bag"></i></div>
                <div class="ai-info">
                  <p>${orderUser ? orderUser.name : 'Usuario'}</p>
                  <span>${new Date(o.createdAt).toLocaleDateString('es-CO')}</span>
                </div>
                <div style="text-align:right">
                  <span class="ai-value">$${(o.total || 0).toLocaleString('es-CO')}</span>
                  <br/>
                  <span class="badge badge-${o.status === 'completed' ? 'success' : o.status === 'pending' ? 'warning' : 'danger'}" style="font-size:0.7rem">${o.status}</span>
                </div>
              </div>`;
            }).join('')
        }
      </div>
    </div>
  </div>`;
}

// ============================================================
// PANEL DEL ENTRENADOR (COACH)
// ============================================================
function renderCoachDashboard(user) {
  const allUsers    = DB.getUsers().filter(u => u.role === 'user');
  const messages    = DB.getMessages();
  const recentClients  = allUsers.slice(-5).reverse();
  const recentMessages = messages.slice(-5).reverse();
  const today = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return `
  <div class="page">
    <!-- HEADER -->
    <div class="dashboard-header">
      <div class="dh-left">
        <div class="dh-greeting">¡Hola, <span>${user.name.split(' ')[0]}</span>! 💪</div>
        <p class="dh-date"><i class="fas fa-calendar-alt"></i> ${today}</p>
        <div class="dh-badges">
          <span class="badge badge-success"><i class="fas fa-user-tie"></i> Coach</span>
          <span class="badge badge-warning"><i class="fas fa-crown"></i> Premium</span>
          <span class="badge badge-primary"><i class="fas fa-check-circle"></i> Verificado</span>
        </div>
      </div>
      <div class="dh-right">
        <div class="streak-card">
          <div class="streak-fire">⭐</div>
          <div><strong>4.9</strong><span>calificación</span></div>
        </div>
      </div>
    </div>

    <!-- STATS -->
    <div class="grid-4" style="margin-bottom:2rem">
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(108,99,255,0.15);color:#6C63FF"><i class="fas fa-users"></i></div>
        <div class="stat-info"><h3>${allUsers.length}</h3><p>Clientes activos</p><span class="stat-change up"><i class="fas fa-arrow-up"></i> Este mes</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(67,233,123,0.15);color:#43E97B"><i class="fas fa-comment"></i></div>
        <div class="stat-info"><h3>${messages.length}</h3><p>Mensajes totales</p><span class="stat-change up"><i class="fas fa-arrow-up"></i> Acumulados</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(247,151,30,0.15);color:#F7971E"><i class="fas fa-star"></i></div>
        <div class="stat-info"><h3>4.9</h3><p>Calificación</p><span class="stat-change up"><i class="fas fa-star"></i> Excelente</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(255,101,132,0.15);color:#FF6584"><i class="fas fa-chart-line"></i></div>
        <div class="stat-info"><h3>92%</h3><p>Retención</p><span class="stat-change up"><i class="fas fa-arrow-up"></i> +3%</span></div>
      </div>
    </div>

    <!-- CLIENTES + MENSAJES -->
    <div class="grid-2" style="margin-bottom:2rem">
      <!-- Clientes recientes -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-users" style="color:#6C63FF"></i> Clientes recientes</h3>
          <button class="btn btn-sm btn-secondary" onclick="navigate('coach')">Ver todos</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.75rem">
          ${recentClients.length === 0
            ? `<div class="empty-state" style="padding:1.5rem"><i class="fas fa-users"></i><p>Sin clientes aún</p></div>`
            : recentClients.map(u => `
              <div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;background:var(--card-bg2);border-radius:8px">
                ${getAvatarHTML(u, 40)}
                <div style="flex:1">
                  <p style="font-weight:600;font-size:0.9rem">${u.name}</p>
                  <span style="color:var(--text-muted);font-size:0.78rem">${getPopulationLabel(u.population)} · ${getLevelBadge(u.level)}</span>
                </div>
                <button class="btn btn-sm btn-primary" onclick="navigate('coach')" title="Abrir chat">
                  <i class="fas fa-comment"></i>
                </button>
              </div>
            `).join('')
          }
        </div>
      </div>

      <!-- Mensajes recientes -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-comment-dots" style="color:#43E97B"></i> Mensajes recientes</h3>
          <button class="btn btn-sm btn-secondary" onclick="navigate('coach')">Ver todos</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:0.75rem">
          ${recentMessages.length === 0
            ? `<div class="empty-state" style="padding:1.5rem"><i class="fas fa-comment-slash"></i><p>Sin mensajes recientes</p></div>`
            : recentMessages.map(m => {
                const sender = DB.getUserById(m.senderId);
                return sender ? `
                  <div style="display:flex;gap:0.75rem;padding:0.75rem;background:var(--card-bg2);border-radius:8px;align-items:flex-start">
                    ${getAvatarHTML(sender, 36)}
                    <div style="flex:1;min-width:0">
                      <p style="font-weight:600;font-size:0.85rem;margin-bottom:0.2rem">${sender.name}</p>
                      <p style="color:var(--text-muted);font-size:0.8rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${(m.text || '').substring(0, 55)}${(m.text || '').length > 55 ? '…' : ''}</p>
                    </div>
                    <span style="color:var(--text-muted);font-size:0.75rem;flex-shrink:0">${new Date(m.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                ` : '';
              }).join('')
          }
        </div>
      </div>
    </div>

    <!-- ACCESOS RÁPIDOS COACH -->
    <div class="card">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-bolt" style="color:#F7971E"></i> Accesos rápidos</h3>
      </div>
      <div style="display:flex;gap:1rem;flex-wrap:wrap">
        <button class="btn btn-primary" onclick="navigate('coach')">
          <i class="fas fa-users"></i> Ver todos los clientes
        </button>
        <button class="btn btn-secondary" onclick="navigate('routines')">
          <i class="fas fa-dumbbell"></i> Crear rutina
        </button>
        <button class="btn btn-secondary" onclick="navigate('progress')">
          <i class="fas fa-chart-line"></i> Ver progreso clientes
        </button>
      </div>
    </div>
  </div>`;
}

// ============================================================
// HELPERS — IMC, PESO IDEAL Y META
// ============================================================

/**
 * Calcula el IMC y su categoría
 */
function calcIMC(weight, height) {
  if (!weight || !height) return null;
  const h = height / 100;
  const imc = weight / (h * h);
  let cat, color;
  if      (imc < 18.5) { cat = 'Bajo peso';      color = '#38BDF8'; }
  else if (imc < 25)   { cat = 'Normal';          color = '#43E97B'; }
  else if (imc < 30)   { cat = 'Sobrepeso';       color = '#F7971E'; }
  else                 { cat = 'Obesidad';         color = '#FF6584'; }
  return { value: imc.toFixed(1), cat, color };
}

/**
 * Peso ideal por fórmula de Devine (ajustada)
 * Hombre:  50 + 2.3 × (altura_cm/2.54 − 60)
 * Mujer:   45.5 + 2.3 × (altura_cm/2.54 − 60)
 * Rango saludable: ±10% del ideal
 */
function calcIdealWeight(height, gender) {
  if (!height) return null;
  const inches = height / 2.54;
  const base   = gender === 'female' ? 45.5 : 50;
  const ideal  = base + 2.3 * (inches - 60);
  return {
    ideal: Math.max(ideal, 40).toFixed(1),
    min:   Math.max(ideal * 0.9, 35).toFixed(1),
    max:   (ideal * 1.1).toFixed(1)
  };
}

/**
 * Genera la meta de peso según objetivo del usuario
 * Devuelve: { targetWeight, direction, weeklyRate, weeks, message }
 */
function calcWeightGoal(user) {
  const w = parseFloat(user.weight);
  const h = parseFloat(user.height);
  if (!w || !h) return null;

  const ideal = calcIdealWeight(h, user.gender);
  if (!ideal) return null;

  const idealW  = parseFloat(ideal.ideal);
  const minW    = parseFloat(ideal.min);
  const maxW    = parseFloat(ideal.max);
  const goal    = user.goal || 'fitness';

  let targetWeight, direction, weeklyRate, message;

  if (goal === 'weight_loss') {
    // Bajar hasta el rango saludable (mínimo del rango ideal)
    targetWeight = w > maxW ? maxW : (w > minW ? minW : w);
    direction    = 'bajar';
    weeklyRate   = 0.5; // kg/semana recomendado
    message      = w <= maxW
      ? '¡Ya estás en tu rango saludable! Mantén el peso.'
      : `Objetivo: bajar ${(w - targetWeight).toFixed(1)} kg para llegar a tu rango ideal.`;
  } else if (goal === 'muscle_gain') {
    // Subir hasta el máximo del rango ideal (o +5 kg si ya está en rango)
    targetWeight = w < minW ? minW : (w < maxW ? maxW : w + 3);
    direction    = 'subir';
    weeklyRate   = 0.25; // ganancia muscular limpia
    message      = w >= minW
      ? `Objetivo: ganar ${(targetWeight - w).toFixed(1)} kg de masa muscular.`
      : `Primero alcanza tu peso mínimo saludable: ${minW} kg.`;
  } else {
    // fitness / flexibility / endurance → llegar al peso ideal exacto
    targetWeight = idealW;
    direction    = w > idealW ? 'bajar' : (w < idealW ? 'subir' : 'mantener');
    weeklyRate   = 0.4;
    message      = Math.abs(w - idealW) < 1
      ? '¡Estás en tu peso ideal! Sigue así.'
      : `Objetivo: ${direction} ${Math.abs(w - idealW).toFixed(1)} kg para alcanzar tu peso ideal.`;
  }

  const diff  = Math.abs(w - targetWeight);
  const weeks = diff < 0.5 ? 0 : Math.ceil(diff / weeklyRate);

  return { targetWeight: targetWeight.toFixed(1), direction, weeklyRate, weeks, message, idealW: idealW.toFixed(1), minW, maxW };
}

// ============================================================
// DASHBOARD PERSONAL DEL USUARIO
// ============================================================
function renderUserDashboard(user) {
  const progress     = DB.getProgressByUser(user.id);
  const achievements = DB.getUserAchievements(user.id);
  const allPublic    = DB.getRoutines().filter(r => r.isPublic).slice(0, 4);
  const photos       = DB.getProgressPhotosByUser(user.id);
  const workouts     = progress.filter(p => p.type === 'workout').length;
  const totalCal     = progress.filter(p => p.type === 'workout').reduce((s, p) => s + (p.calories || 350), 0);

  // Historial de pesos registrados
  const weightLogs   = progress.filter(p => p.type === 'weight').sort((a, b) => new Date(a.date) - new Date(b.date));
  const lastWeight   = weightLogs.length ? weightLogs[weightLogs.length - 1].value : (user.weight || null);
  const firstWeight  = weightLogs.length ? weightLogs[0].value : lastWeight;

  // Cálculos corporales
  const imc          = calcIMC(lastWeight, user.height);
  const idealData    = calcIdealWeight(user.height, user.gender);
  const goalData     = calcWeightGoal({ ...user, weight: lastWeight || user.weight });

  const today = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const goalLabels = {
    weight_loss: { label: 'Bajar de peso',    icon: 'fas fa-arrow-down', color: '#38BDF8' },
    muscle_gain: { label: 'Ganar músculo',    icon: 'fas fa-arrow-up',   color: '#43E97B' },
    fitness:     { label: 'Fitness general',  icon: 'fas fa-heartbeat',  color: '#6C63FF' },
    flexibility: { label: 'Flexibilidad',     icon: 'fas fa-spa',        color: '#A855F7' },
    endurance:   { label: 'Resistencia',      icon: 'fas fa-running',    color: '#F7971E' }
  };
  const currentGoal = goalLabels[user.goal] || goalLabels.fitness;

  const categoryLabel = { general: 'General', front: 'Frente', back: 'Espalda', side: 'Lateral' };

  return `
  <div class="page">
    <!-- HEADER -->
    <div class="dashboard-header">
      <div class="dh-left">
        <div class="dh-greeting">${greeting()}, <span>${user.name.split(' ')[0]}</span> 👋</div>
        <p class="dh-date"><i class="fas fa-calendar-alt"></i> ${today}</p>
        <div class="dh-badges">
          ${getSpaceBadge(user.preferredSpace)}
          ${getLevelBadge(user.level)}
          <span class="badge badge-${user.plan === 'premium' ? 'warning' : 'primary'}">
            <i class="fas fa-${user.plan === 'premium' ? 'crown' : 'user'}"></i>
            ${user.plan === 'premium' ? 'Premium' : 'Gratuito'}
          </span>
        </div>
      </div>
      <div class="dh-right">
        <div class="streak-card">
          <div class="streak-fire">🔥</div>
          <div><strong>${user.streak || 0}</strong><span>días de racha</span></div>
        </div>
      </div>
    </div>

    <!-- STATS -->
    <div class="grid-4" style="margin-bottom:2rem">
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(108,99,255,0.15);color:#6C63FF"><i class="fas fa-dumbbell"></i></div>
        <div class="stat-info"><h3>${workouts}</h3><p>Entrenamientos</p><span class="stat-change up"><i class="fas fa-arrow-up"></i> Este mes</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(255,101,132,0.15);color:#FF6584"><i class="fas fa-fire"></i></div>
        <div class="stat-info"><h3>${totalCal.toLocaleString()}</h3><p>Calorías quemadas</p><span class="stat-change up"><i class="fas fa-arrow-up"></i> Total</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(67,233,123,0.15);color:#43E97B"><i class="fas fa-trophy"></i></div>
        <div class="stat-info"><h3>${achievements.length}</h3><p>Logros</p><span class="stat-change up"><i class="fas fa-star"></i> Desbloqueados</span></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(247,151,30,0.15);color:#F7971E"><i class="fas fa-star"></i></div>
        <div class="stat-info"><h3>${user.points || 0}</h3><p>Puntos EF</p><span class="stat-change up"><i class="fas fa-arrow-up"></i> Acumulados</span></div>
      </div>
    </div>

    <!-- PANEL CORPORAL: PESO + IMC + META -->
    <div class="grid-2" style="margin-bottom:2rem">

      <!-- REGISTRO DE PESO -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-weight" style="color:#38BDF8"></i> Mi Peso</h3>
          <button class="btn btn-sm btn-primary" onclick="showLogWeightModal()">
            <i class="fas fa-plus"></i> Registrar
          </button>
        </div>

        <!-- Peso actual grande -->
        <div style="display:flex;align-items:center;gap:1.5rem;margin-bottom:1.25rem">
          <div style="text-align:center;flex-shrink:0">
            <div style="font-size:2.8rem;font-weight:900;background:var(--gradient-main);-webkit-background-clip:text;-webkit-text-fill-color:transparent;line-height:1">
              ${lastWeight ? lastWeight + '' : '—'}
            </div>
            <div style="font-size:0.8rem;color:var(--text-muted);font-weight:600">kg actuales</div>
          </div>
          <div style="flex:1;display:flex;flex-direction:column;gap:0.5rem">
            ${imc ? `
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:0.82rem;color:var(--text-muted)">IMC</span>
                <span style="font-weight:700;color:${imc.color}">${imc.value} — ${imc.cat}</span>
              </div>
              <div style="height:8px;background:var(--card-bg2);border-radius:50px;overflow:hidden">
                <div style="height:100%;width:${Math.min((parseFloat(imc.value)/40)*100,100)}%;background:${imc.color};border-radius:50px;transition:width 0.6s ease"></div>
              </div>
            ` : '<p style="color:var(--text-muted);font-size:0.85rem">Completa tu perfil (peso y altura) para ver el IMC</p>'}
            ${idealData ? `
              <div style="font-size:0.8rem;color:var(--text-muted);margin-top:0.25rem">
                Peso ideal: <strong style="color:var(--text)">${idealData.min}–${idealData.max} kg</strong>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Mini gráfica de historial -->
        ${weightLogs.length >= 2 ? `
          <div style="margin-bottom:1rem">
            <p style="font-size:0.78rem;color:var(--text-muted);margin-bottom:0.5rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em">Historial de peso</p>
            <canvas id="weight-mini-chart" height="60" style="width:100%"></canvas>
          </div>
        ` : weightLogs.length === 1 ? `
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem">Registra más pesos para ver tu evolución</p>
        ` : `
          <p style="font-size:0.82rem;color:var(--text-muted);margin-bottom:1rem">Sin registros de peso aún. ¡Empieza hoy!</p>
        `}

        <!-- Últimos 3 registros -->
        ${weightLogs.slice(-3).reverse().map(w => `
          <div class="activity-item">
            <div class="ai-icon" style="background:rgba(56,189,248,0.15);color:#38BDF8"><i class="fas fa-weight"></i></div>
            <div class="ai-info">
              <p>${w.note || 'Registro de peso'}</p>
              <span>${new Date(w.date).toLocaleDateString('es-CO')}</span>
            </div>
            <span class="ai-value">${w.value} kg</span>
          </div>
        `).join('') || ''}
      </div>

      <!-- META INTELIGENTE -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="${currentGoal.icon}" style="color:${currentGoal.color}"></i> Mi Meta</h3>
          <span class="badge badge-primary" style="font-size:0.72rem">${currentGoal.label}</span>
        </div>

        ${goalData ? `
          <!-- Peso objetivo -->
          <div style="background:var(--card-bg2);border-radius:var(--radius-sm);padding:1rem;margin-bottom:1rem;border-left:3px solid ${currentGoal.color}">
            <p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:0.25rem">Peso objetivo</p>
            <div style="display:flex;align-items:baseline;gap:0.5rem">
              <span style="font-size:2rem;font-weight:800;color:${currentGoal.color}">${goalData.targetWeight}</span>
              <span style="color:var(--text-muted)">kg</span>
              ${lastWeight && goalData.direction !== 'mantener' ? `<span style="font-size:0.8rem;color:var(--text-muted);margin-left:auto">${goalData.direction === 'bajar' ? '↓' : '↑'} ${Math.abs(parseFloat(lastWeight) - parseFloat(goalData.targetWeight)).toFixed(1)} kg</span>` : goalData.direction === 'mantener' ? '<span style="font-size:0.8rem;color:#43E97B;margin-left:auto">✓ En meta</span>' : ''}
            </div>
          </div>

          <!-- Barra de progreso hacia la meta -->
          ${lastWeight && goalData.direction !== 'mantener' ? (() => {
            const start   = parseFloat(firstWeight || lastWeight);
            const current = parseFloat(lastWeight);
            const target  = parseFloat(goalData.targetWeight);
            const total   = Math.abs(target - start);
            const done    = Math.abs(current - start);
            const pct     = total > 0 ? Math.min(Math.round((done / total) * 100), 100) : 100;
            return `
              <div style="margin-bottom:1rem">
                <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:0.4rem">
                  <span style="color:var(--text-muted)">Progreso hacia la meta</span>
                  <span style="font-weight:700;color:${currentGoal.color}">${pct}%</span>
                </div>
                <div style="height:10px;background:var(--card-bg2);border-radius:50px;overflow:hidden">
                  <div style="height:100%;width:${pct}%;background:${currentGoal.color};border-radius:50px;transition:width 0.8s ease"></div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem">
                  <span>Inicio: ${start} kg</span>
                  <span>Meta: ${goalData.targetWeight} kg</span>
                </div>
              </div>`;
          })() : ''}

          <!-- Tiempo estimado -->
          ${goalData.weeks > 0 ? `
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.75rem;background:var(--card-bg2);border-radius:var(--radius-sm);margin-bottom:1rem">
              <i class="fas fa-calendar-check" style="color:${currentGoal.color};font-size:1.2rem"></i>
              <div>
                <p style="font-size:0.85rem;font-weight:600">Tiempo estimado</p>
                <span style="font-size:0.8rem;color:var(--text-muted)">${goalData.weeks} semanas · ${goalData.weeklyRate} kg/semana</span>
              </div>
            </div>
          ` : ''}

          <!-- Mensaje motivacional -->
          <div style="padding:0.75rem;background:${currentGoal.color}15;border-radius:var(--radius-sm);border:1px solid ${currentGoal.color}30">
            <p style="font-size:0.85rem;color:var(--text);line-height:1.5">
              <i class="${currentGoal.icon}" style="color:${currentGoal.color};margin-right:0.4rem"></i>
              ${goalData.message}
            </p>
          </div>

          <!-- Cambiar objetivo -->
          <button class="btn btn-secondary btn-sm" style="width:100%;margin-top:1rem" onclick="navigate('profile')">
            <i class="fas fa-edit"></i> Cambiar objetivo en mi perfil
          </button>

        ` : `
          <div class="empty-state" style="padding:1.5rem">
            <i class="fas fa-bullseye"></i>
            <h3>Completa tu perfil</h3>
            <p>Agrega tu peso y altura para ver tu meta personalizada</p>
            <button class="btn btn-primary" style="margin-top:1rem" onclick="navigate('profile')">
              <i class="fas fa-user-edit"></i> Completar perfil
            </button>
          </div>
        `}
      </div>
    </div>

    <!-- RUTINAS + PROGRESO -->
    <div class="grid-2" style="margin-bottom:2rem">
      <!-- Rutinas recomendadas -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-dumbbell" style="color:#6C63FF"></i> Rutinas para ti</h3>
          <button class="btn btn-sm btn-secondary" onclick="navigate('routines')">Ver todas</button>
        </div>
        ${allPublic.map(r => `
          <div class="routine-mini" onclick="openRoutineDetail('${r.id}')" role="button" tabindex="0" aria-label="Ver detalle de ${r.name}">
            <div class="rm-icon" style="background:${r.space === 'gym' ? 'rgba(255,101,132,0.15)' : r.space === 'park' ? 'rgba(67,233,123,0.15)' : 'rgba(108,99,255,0.15)'}">
              <i class="fas fa-${r.space === 'gym' ? 'dumbbell' : r.space === 'park' ? 'tree' : 'home'}"
                 style="color:${r.space === 'gym' ? '#FF6584' : r.space === 'park' ? '#43E97B' : '#6C63FF'}"></i>
            </div>
            <div class="rm-info">
              <p>${r.name}</p>
              <span>${r.duration} min · ${r.calories} kcal · ${getSpaceBadge(r.space)}</span>
            </div>
            <button class="btn btn-sm btn-primary" onclick="event.stopPropagation();startWorkout('${r.id}')" aria-label="Iniciar ${r.name}">
              <i class="fas fa-play"></i>
            </button>
          </div>
        `).join('')}
      </div>

      <!-- Progreso rápido -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-chart-line" style="color:#FF6584"></i> Mi progreso</h3>
          <button class="btn btn-sm btn-secondary" onclick="navigate('progress')">Ver detalle</button>
        </div>
        <div class="quick-progress">
          <div class="qp-item">
            <div class="qp-label"><span>Meta semanal</span><span>75%</span></div>
            <div class="progress-bar"><div class="progress-fill" style="width:75%"></div></div>
          </div>
          <div class="qp-item">
            <div class="qp-label"><span>Nutrición</span><span>60%</span></div>
            <div class="progress-bar"><div class="progress-fill green" style="width:60%"></div></div>
          </div>
          <div class="qp-item">
            <div class="qp-label"><span>Hidratación</span><span>80%</span></div>
            <div class="progress-bar"><div class="progress-fill orange" style="width:80%"></div></div>
          </div>
        </div>
        <div style="margin-top:1.5rem">
          <button class="btn btn-primary btn-block" onclick="navigate('progress')">
            <i class="fas fa-plus"></i> Registrar progreso
          </button>
        </div>
        <div style="margin-top:1rem">
          <h4 style="font-size:0.9rem;margin-bottom:1rem;color:var(--text-muted)">Actividad reciente</h4>
          ${progress.slice(-3).reverse().map(p => `
            <div class="activity-item">
              <div class="ai-icon"><i class="fas fa-${p.type === 'workout' ? 'dumbbell' : 'weight'}"></i></div>
              <div class="ai-info">
                <p>${p.note || p.type}</p>
                <span>${new Date(p.date).toLocaleDateString('es-CO')}</span>
              </div>
              <span class="ai-value">${p.value} ${p.unit}</span>
            </div>
          `).join('') || '<p style="color:var(--text-muted);font-size:0.85rem">Sin actividad registrada</p>'}
        </div>
      </div>
    </div>

    <!-- FOTOS DE PROGRESO -->
    <div class="card" style="margin-bottom:2rem">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-camera" style="color:#A855F7"></i> Fotos de Progreso</h3>
        <button class="btn btn-sm btn-primary" onclick="showAddProgressPhotoModal()">
          <i class="fas fa-plus"></i> Agregar Foto
        </button>
      </div>
      ${photos.length === 0
        ? `<div class="empty-state" style="padding:2.5rem">
             <i class="fas fa-camera" style="font-size:2.5rem;color:var(--text-muted);margin-bottom:1rem"></i>
             <h3>Sin fotos de progreso</h3>
             <p>Agrega tu primera foto para visualizar tu transformación</p>
             <button class="btn btn-primary" style="margin-top:1rem" onclick="showAddProgressPhotoModal()">
               <i class="fas fa-camera"></i> Agregar primera foto
             </button>
           </div>`
        : `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:1rem;margin-top:0.5rem">
             ${photos.map(ph => `
               <div style="position:relative;border-radius:10px;overflow:hidden;background:var(--card-bg2);border:1px solid var(--border)">
                 <img src="${ph.dataUrl}" alt="${ph.caption || 'Foto de progreso'}"
                      style="width:100%;height:160px;object-fit:cover;display:block"/>
                 <div style="padding:0.6rem">
                   <p style="font-size:0.8rem;font-weight:600;margin-bottom:0.2rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">
                     ${ph.caption || 'Sin descripción'}
                   </p>
                   <div style="display:flex;justify-content:space-between;align-items:center">
                     <span class="badge badge-primary" style="font-size:0.65rem">${categoryLabel[ph.category] || ph.category}</span>
                     <span style="color:var(--text-muted);font-size:0.72rem">${new Date(ph.date).toLocaleDateString('es-CO')}</span>
                   </div>
                   ${ph.weight ? `<p style="font-size:0.75rem;color:var(--text-muted);margin-top:0.3rem"><i class="fas fa-weight"></i> ${ph.weight} kg</p>` : ''}
                 </div>
                 <button class="btn btn-sm btn-danger"
                         style="position:absolute;top:6px;right:6px;padding:0.25rem 0.5rem;opacity:0.85"
                         onclick="deleteProgressPhoto('${ph.id}')"
                         aria-label="Eliminar foto">
                   <i class="fas fa-trash"></i>
                 </button>
               </div>
             `).join('')}
           </div>`
      }
    </div>

    <!-- ACCESOS RÁPIDOS -->
    <div class="quick-access" style="margin-bottom:2rem">
      <h3 class="section-title" style="font-size:1.2rem;margin-bottom:1rem">Accesos rápidos</h3>
      <div class="qa-grid">
        <div class="qa-card" onclick="navigate('routines',{space:'gym'})" role="button" tabindex="0" aria-label="Rutinas de Gimnasio">
          <i class="fas fa-dumbbell" style="color:#FF6584" aria-hidden="true"></i>
          <span>Gym</span>
        </div>
        <div class="qa-card" onclick="navigate('routines',{space:'park'})" role="button" tabindex="0" aria-label="Rutinas de Parque">
          <i class="fas fa-tree" style="color:#43E97B" aria-hidden="true"></i>
          <span>Parque</span>
        </div>
        <div class="qa-card" onclick="navigate('routines',{space:'home'})" role="button" tabindex="0" aria-label="Rutinas en Casa">
          <i class="fas fa-home" style="color:#6C63FF" aria-hidden="true"></i>
          <span>Casa</span>
        </div>
        <div class="qa-card" onclick="navigate('nutrition')" role="button" tabindex="0" aria-label="Nutrición">
          <i class="fas fa-apple-alt" style="color:#F7971E" aria-hidden="true"></i>
          <span>Nutrición</span>
        </div>
        <div class="qa-card" onclick="navigate('progress')" role="button" tabindex="0" aria-label="Mi Progreso">
          <i class="fas fa-chart-line" style="color:#38BDF8" aria-hidden="true"></i>
          <span>Progreso</span>
        </div>
        <div class="qa-card" onclick="navigate('gamification')" role="button" tabindex="0" aria-label="Logros">
          <i class="fas fa-trophy" style="color:#F7971E" aria-hidden="true"></i>
          <span>Logros</span>
        </div>
        <div class="qa-card" onclick="navigate('store')" role="button" tabindex="0" aria-label="Tienda Fitness">
          <i class="fas fa-shopping-bag" style="color:#A855F7" aria-hidden="true"></i>
          <span>Tienda</span>
        </div>
        <div class="qa-card" onclick="navigate('coach')" role="button" tabindex="0" aria-label="Mi Coach">
          <i class="fas fa-user-tie" style="color:#43E97B" aria-hidden="true"></i>
          <span>Coach</span>
        </div>
        <div class="qa-card" onclick="navigate('learn')" role="button" tabindex="0" aria-label="Módulo Aprende" style="position:relative">
          <i class="fas fa-book-open" style="color:#38BDF8" aria-hidden="true"></i>
          <span>Aprende</span>
          <span style="position:absolute;top:-6px;right:-6px;background:var(--accent);color:var(--dark);font-size:0.6rem;font-weight:800;padding:2px 6px;border-radius:50px">Nuevo</span>
        </div>
      </div>
    </div>

    <!-- CONSEJO DEL DÍA -->
    <div class="tip-card" style="display:flex;align-items:center;gap:1rem;background:linear-gradient(135deg,rgba(108,99,255,0.12),rgba(56,189,248,0.08));border:1px solid rgba(108,99,255,0.25);border-radius:var(--radius);padding:1.25rem 1.5rem">
      <div style="font-size:2rem;flex-shrink:0" aria-hidden="true">💡</div>
      <div style="flex:1">
        <p style="font-size:0.8rem;font-weight:700;color:var(--primary);margin-bottom:0.25rem;text-transform:uppercase;letter-spacing:0.05em">Consejo del día</p>
        <p id="daily-tip" style="font-size:0.9rem;color:var(--text);line-height:1.5;transition:opacity 0.2s">Cargando...</p>
      </div>
      <button class="btn btn-sm btn-secondary" onclick="refreshTip()" aria-label="Ver otro consejo" title="Nuevo consejo">
        <i class="fas fa-sync-alt" aria-hidden="true"></i>
      </button>
    </div>
  </div>`;
}

// ============================================================
// REGISTRO DE PESO — Modal y mini gráfica
// ============================================================
function showLogWeightModal() {
  const user = Auth.getCurrentUser();
  showModal('Registrar Peso', `
    <div style="text-align:center;margin-bottom:1.5rem">
      <div style="font-size:3rem;margin-bottom:0.5rem">⚖️</div>
      <p style="color:var(--text-muted);font-size:0.9rem">Registra tu peso de hoy para seguir tu evolución</p>
    </div>
    <div class="form-group">
      <label class="form-label">Peso actual (kg)</label>
      <input type="number" id="log-weight-val" class="form-control"
             placeholder="Ej: 72.5" step="0.1" min="20" max="300"
             value="${user.weight || ''}"
             style="font-size:1.5rem;text-align:center;font-weight:700"/>
    </div>
    <div class="form-group">
      <label class="form-label">Nota (opcional)</label>
      <input type="text" id="log-weight-note" class="form-control"
             placeholder="Ej: Después del desayuno, semana 3..."/>
    </div>
    <div id="log-weight-imc-preview" style="margin-top:0.5rem"></div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveWeightLog()"><i class="fas fa-save"></i> Guardar</button>
  `);

  // Preview de IMC en tiempo real
  setTimeout(() => {
    const input = document.getElementById('log-weight-val');
    if (input) input.addEventListener('input', () => {
      const w   = parseFloat(input.value);
      const imc = calcIMC(w, user.height);
      const div = document.getElementById('log-weight-imc-preview');
      if (div && imc) {
        div.innerHTML = `
          <div style="padding:0.75rem;background:${imc.color}15;border-radius:8px;border:1px solid ${imc.color}30;text-align:center">
            <span style="font-weight:700;color:${imc.color}">IMC: ${imc.value}</span>
            <span style="color:var(--text-muted);font-size:0.85rem"> — ${imc.cat}</span>
          </div>`;
      } else if (div) { div.innerHTML = ''; }
    });
  }, 100);
}

function saveWeightLog() {
  const user  = Auth.getCurrentUser();
  const val   = parseFloat(document.getElementById('log-weight-val').value);
  const note  = document.getElementById('log-weight-note').value.trim();
  if (!val || val < 20 || val > 300) {
    showToast('Error', 'Ingresa un peso válido (20–300 kg)', 'error');
    return;
  }
  // Guardar en progreso
  DB.addProgress({ userId: user.id, type: 'weight', value: val, unit: 'kg', note: note || 'Registro de peso' });
  // Actualizar peso en el perfil del usuario
  DB.updateUser(user.id, { weight: val });
  closeModal();
  showToast('Peso registrado', `${val} kg guardado correctamente`, 'success');
  navigate('dashboard');
}

function initWeightMiniChart() {
  const canvas = document.getElementById('weight-mini-chart');
  if (!canvas) return;
  const user     = Auth.getCurrentUser();
  if (!user) return;
  const logs     = DB.getProgressByUser(user.id)
                     .filter(p => p.type === 'weight')
                     .sort((a, b) => new Date(a.date) - new Date(b.date))
                     .slice(-8); // últimos 8 registros
  if (logs.length < 2) return;

  const values = logs.map(l => parseFloat(l.value));
  const labels = logs.map(l => new Date(l.date).toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit' }));
  const W      = canvas.offsetWidth || 300;
  const H      = 60;
  canvas.width  = W;
  canvas.height = H;
  const ctx    = canvas.getContext('2d');

  const min  = Math.min(...values) - 1;
  const max  = Math.max(...values) + 1;
  const padX = 8;
  const padY = 8;
  const xStep = (W - padX * 2) / (values.length - 1);

  const toX = i => padX + i * xStep;
  const toY = v => padY + (1 - (v - min) / (max - min)) * (H - padY * 2);

  // Línea de gradiente
  const grad = ctx.createLinearGradient(0, 0, W, 0);
  grad.addColorStop(0, '#6C63FF');
  grad.addColorStop(1, '#38BDF8');

  // Área rellena
  ctx.beginPath();
  ctx.moveTo(toX(0), H);
  values.forEach((v, i) => ctx.lineTo(toX(i), toY(v)));
  ctx.lineTo(toX(values.length - 1), H);
  ctx.closePath();
  ctx.fillStyle = 'rgba(108,99,255,0.12)';
  ctx.fill();

  // Línea
  ctx.beginPath();
  values.forEach((v, i) => i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v)));
  ctx.strokeStyle = grad;
  ctx.lineWidth   = 2.5;
  ctx.lineJoin    = 'round';
  ctx.stroke();

  // Puntos
  values.forEach((v, i) => {
    ctx.beginPath();
    ctx.arc(toX(i), toY(v), 3.5, 0, Math.PI * 2);
    ctx.fillStyle   = '#6C63FF';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth   = 1.5;
    ctx.fill();
    ctx.stroke();
  });

  // Etiqueta último valor
  const lastX = toX(values.length - 1);
  const lastY = toY(values[values.length - 1]);
  ctx.fillStyle = '#E8E8F0';
  ctx.font      = 'bold 10px Poppins, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(values[values.length - 1] + ' kg', lastX, lastY - 6);
}

// ============================================================
// FOTOS DE PROGRESO — Modal y acciones
// ============================================================
function showAddProgressPhotoModal() {
  showModal('Agregar Foto de Progreso', `
    <div class="form-group">
      <label class="form-label">Foto</label>
      <div id="photo-drop-zone" class="photo-drop-zone" onclick="document.getElementById('photo-file-input').click()" style="cursor:pointer;border:2px dashed var(--border);border-radius:10px;padding:2rem;text-align:center">
        <i class="fas fa-camera" style="font-size:2.5rem;color:var(--primary);margin-bottom:0.75rem"></i>
        <p>Haz clic o arrastra una foto aquí</p>
        <span style="font-size:0.8rem;color:var(--text-muted)">JPG, PNG o WEBP · Máx 5MB</span>
        <img id="photo-preview" style="display:none;max-width:100%;max-height:200px;border-radius:8px;margin-top:1rem" alt="Vista previa"/>
      </div>
      <input type="file" id="photo-file-input" accept="image/*" style="display:none" onchange="previewProgressPhoto(this)"/>
    </div>
    <div class="form-group">
      <label class="form-label">Categoría</label>
      <select id="photo-category" class="form-select">
        <option value="general">General</option>
        <option value="front">Frente</option>
        <option value="back">Espalda</option>
        <option value="side">Lateral</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Descripción (opcional)</label>
      <input type="text" id="photo-caption" class="form-control" placeholder="Ej: Semana 4 de entrenamiento"/>
    </div>
    <div class="form-group">
      <label class="form-label">Peso actual (kg, opcional)</label>
      <input type="number" id="photo-weight" class="form-control" placeholder="Ej: 72.5" step="0.1"/>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveProgressPhoto()"><i class="fas fa-save"></i> Guardar Foto</button>
  `);
}

function previewProgressPhoto(input) {
  const file = input.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) {
    showToast('Error', 'La foto no puede superar 5MB', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview  = document.getElementById('photo-preview');
    const dropZone = document.getElementById('photo-drop-zone');
    preview.src = e.target.result;
    preview.style.display = 'block';
    const icon = dropZone.querySelector('i');
    const p    = dropZone.querySelector('p');
    const span = dropZone.querySelector('span');
    if (icon) icon.style.display = 'none';
    if (p)    p.style.display    = 'none';
    if (span) span.style.display = 'none';
  };
  reader.readAsDataURL(file);
}

function saveProgressPhoto() {
  const user    = Auth.getCurrentUser();
  const input   = document.getElementById('photo-file-input');
  const preview = document.getElementById('photo-preview');
  if (!input.files[0] || preview.style.display === 'none') {
    showToast('Error', 'Selecciona una foto primero', 'error');
    return;
  }
  DB.addProgressPhoto({
    userId:   user.id,
    dataUrl:  preview.src,
    caption:  document.getElementById('photo-caption').value,
    category: document.getElementById('photo-category').value,
    weight:   parseFloat(document.getElementById('photo-weight').value) || null
  });
  closeModal();
  showToast('Foto guardada', 'Tu foto de progreso ha sido guardada', 'success');
  navigate('dashboard');
}

function deleteProgressPhoto(photoId) {
  showModal('Eliminar foto', `
    <div style="text-align:center;padding:1rem">
      <i class="fas fa-trash" style="font-size:2.5rem;color:#FF6584;margin-bottom:1rem"></i>
      <p>¿Eliminar esta foto de progreso?</p>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" onclick="confirmDeleteProgressPhoto('${photoId}')"><i class="fas fa-trash"></i> Eliminar</button>
  `);
}

function confirmDeleteProgressPhoto(photoId) {
  DB.deleteProgressPhoto(photoId);
  closeModal();
  showToast('Foto eliminada', 'La foto ha sido eliminada', 'info');
  navigate('dashboard');
}

// ============================================================
// WORKOUT — Iniciar, confirmar y ver detalle de rutina
// ============================================================
function startWorkout(routineId) {
  const routine = DB.getRoutines().find(r => r.id === routineId);
  if (!routine) return;

  showModal(`🏋️ ${routine.name}`, `
    <div style="text-align:center;padding:1rem">
      <div style="font-size:3rem;margin-bottom:1rem">💪</div>
      <p style="margin-bottom:1rem">¿Listo para comenzar este entrenamiento?</p>
      <div style="display:flex;gap:0.75rem;justify-content:center;flex-wrap:wrap;margin-bottom:1rem">
        ${getSpaceBadge(routine.space)}
        ${getLevelBadge(routine.level)}
        <span class="badge badge-primary"><i class="fas fa-clock"></i> ${routine.duration} min</span>
        <span class="badge badge-warning"><i class="fas fa-fire"></i> ${routine.calories} kcal</span>
      </div>
      <div id="workout-timer" style="font-size:2rem;font-weight:800;color:var(--primary);margin:1rem 0">00:00</div>
      <p style="color:var(--text-muted);font-size:0.85rem">El temporizador iniciará al confirmar</p>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="confirmWorkout('${routineId}')"><i class="fas fa-play"></i> ¡Comenzar!</button>
  `);
}

function confirmWorkout(routineId) {
  const user    = Auth.getCurrentUser();
  const routine = DB.getRoutines().find(r => r.id === routineId);
  if (!routine) return;
  closeModal();
  DB.addProgress({
    userId:   user.id,
    type:     'workout',
    value:    routine.duration,
    unit:     'min',
    calories: routine.calories,
    note:     routine.name
  });
  DB.updateUser(user.id, {
    points: (user.points || 0) + 50,
    streak: (user.streak || 0) + 1
  });
  DB.addNotification(user.id, {
    type:    'workout',
    icon:    'fas fa-dumbbell',
    color:   '#6C63FF',
    title:   '¡Entrenamiento completado!',
    message: `Completaste "${routine.name}" y ganaste 50 puntos.`
  });
  showToast('¡Excelente!', `Completaste "${routine.name}" +50 puntos 🎉`, 'success');
  navigate('dashboard');
}

function openRoutineDetail(routineId) {
  const routine = DB.getRoutines().find(r => r.id === routineId);
  if (!routine) return;
  showModal(routine.name, `
    <div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:1rem">
        ${getSpaceBadge(routine.space)}
        ${getLevelBadge(routine.level)}
        <span class="badge badge-primary"><i class="fas fa-clock"></i> ${routine.duration} min</span>
        <span class="badge badge-warning"><i class="fas fa-fire"></i> ${routine.calories} kcal</span>
      </div>
      <p style="color:var(--text-muted);margin-bottom:1.5rem;font-size:0.9rem">${routine.description}</p>
      <h4 style="margin-bottom:1rem;font-size:0.95rem">Ejercicios (${routine.exercises?.length || 0})</h4>
      <div style="display:flex;flex-direction:column;gap:0.75rem">
        ${(routine.exercises || []).map((ex, i) => `
          <div style="display:flex;align-items:center;gap:1rem;padding:0.75rem;background:var(--card-bg2);border-radius:8px">
            <div style="width:32px;height:32px;border-radius:50%;background:var(--gradient-main);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;color:white;flex-shrink:0">${i + 1}</div>
            <div style="flex:1">
              <p style="font-weight:600;font-size:0.9rem">${ex.name}</p>
              <span style="color:var(--text-muted);font-size:0.8rem">${ex.sets} series · ${ex.reps ? ex.reps + ' reps' : ex.duration} · Descanso: ${ex.rest}s · ${ex.muscle}</span>
            </div>
            ${ex.videoId ? `
              <button class="btn btn-sm" onclick="showExerciseVideo('${ex.videoId}','${ex.name.replace(/'/g,'')}')"
                style="background:rgba(255,0,0,0.15);color:#FF4444;border:1px solid rgba(255,0,0,0.3);flex-shrink:0;display:flex;align-items:center;gap:0.4rem;padding:0.35rem 0.75rem;border-radius:6px;font-size:0.8rem;font-weight:600;cursor:pointer">
                <i class="fab fa-youtube"></i> Ver
              </button>
            ` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-primary" onclick="closeModal();startWorkout('${routine.id}')"><i class="fas fa-play"></i> Iniciar</button>
  `);
}

// ============================================================
// CONSEJO DEL DÍA
// ============================================================
const DAILY_TIPS = [
  'La constancia supera al talento. 15 minutos de ejercicio diario son mejor que 2 horas una vez a la semana.',
  'Hidratación: bebe al menos 8 vasos de agua al día. Tu rendimiento mejora hasta un 20% bien hidratado.',
  'El descanso es parte del entrenamiento. Tus músculos crecen mientras duermes, no mientras entrenas.',
  'Diseño centrado en ti: elige rutinas que se adapten a tu espacio y tiempo real, no al ideal.',
  'La modularidad en el fitness: divide tu entrenamiento en bloques (calentamiento, trabajo, enfriamiento).',
  'Mejora continua: registra tu progreso cada semana. Lo que se mide, se mejora.',
  'Prevención de errores: calienta siempre antes de entrenar. El 80% de las lesiones son prevenibles.',
  'Arquitectura del fitness: construye una base sólida (movilidad + fuerza) antes de agregar intensidad.',
];

function refreshTip() {
  const el = document.getElementById('daily-tip');
  if (!el) return;
  const idx = Math.floor(Math.random() * DAILY_TIPS.length);
  el.style.opacity = '0';
  setTimeout(() => { el.textContent = DAILY_TIPS[idx]; el.style.opacity = '1'; }, 200);
}

// Inicializar consejo al cargar la página
setTimeout(() => {
  const el = document.getElementById('daily-tip');
  if (el) {
    const idx = new Date().getDate() % DAILY_TIPS.length;
    el.textContent = DAILY_TIPS[idx];
  }
}, 300);

// ============================================================
// VIDEO DE EJERCICIO — Modal con YouTube embed + fallback
// ============================================================
function showExerciseVideo(videoId, exerciseName) {
  closeModal();
  setTimeout(() => {
    const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;

    showModal(
      `<i class="fab fa-youtube" style="color:#FF4444"></i> ${exerciseName}`,
      `<div id="video-container">
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:10px;background:#000">
          <iframe
            id="yt-iframe"
            src="${embedUrl}"
            style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;border-radius:10px"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            title="Video: ${exerciseName}"
            onerror="showVideoFallback('${videoId}','${exerciseName.replace(/'/g,'')}')">
          </iframe>
        </div>
        <div id="video-fallback" style="display:none;text-align:center;padding:2rem;background:var(--card-bg2);border-radius:10px">
          <i class="fab fa-youtube" style="font-size:3rem;color:#FF4444;margin-bottom:1rem"></i>
          <p style="font-weight:600;margin-bottom:0.5rem">Este video no permite reproducción embebida</p>
          <p style="color:var(--text-muted);font-size:0.85rem;margin-bottom:1.5rem">Haz clic para verlo directamente en YouTube</p>
          <a href="${ytUrl}" target="_blank" rel="noopener"
             style="display:inline-flex;align-items:center;gap:0.5rem;background:#FF4444;color:white;padding:0.75rem 1.5rem;border-radius:8px;text-decoration:none;font-weight:700;font-size:0.9rem">
            <i class="fab fa-youtube"></i> Ver en YouTube
          </a>
        </div>
      </div>
      <p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.75rem;text-align:center">
        <i class="fas fa-info-circle"></i> Observa la técnica correcta antes de ejecutar el ejercicio
      </p>`,
      `<a href="${ytUrl}" target="_blank" rel="noopener" class="btn btn-secondary" style="text-decoration:none">
         <i class="fab fa-youtube"></i> Abrir en YouTube
       </a>
       <button class="btn btn-primary" onclick="closeModal()"><i class="fas fa-times"></i> Cerrar</button>`
    );

    // Detectar error del iframe después de 3 segundos
    setTimeout(() => {
      const iframe = document.getElementById('yt-iframe');
      if (!iframe) return;
      try {
        // Si el iframe no cargó contenido, mostrar fallback
        iframe.addEventListener('error', () => showVideoFallback(videoId, exerciseName));
      } catch(e) {}
    }, 500);

  }, 150);
}

function showVideoFallback(videoId, exerciseName) {
  const iframe = document.getElementById('yt-iframe');
  const fallback = document.getElementById('video-fallback');
  if (iframe) iframe.parentElement.style.display = 'none';
  if (fallback) fallback.style.display = 'block';
}
