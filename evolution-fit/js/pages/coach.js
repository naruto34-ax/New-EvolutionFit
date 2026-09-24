// ===== COACH PAGE =====
function renderCoach(user) {
  if (user.role === 'admin' || user.role === 'coach') return renderCoachPanel(user);
  return renderCoachClient(user);
}

function renderCoachClient(user) {
  const coaches = DB.getUsers().filter(u => u.role === 'coach');
  const messages = DB.getMessagesByUser(user.id);

  return `
  <div class="page">
    <div class="section-header">
      <h1 class="section-title"><i class="fas fa-user-tie"></i> Mi Coach</h1>
      <p class="section-subtitle">Conecta con tu entrenador personal para seguimiento y feedback</p>
    </div>

    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('tab-coaches','coach')">Coaches</button>
      <button class="tab-btn" onclick="switchTab('tab-messages','coach')">Mensajes</button>
      <button class="tab-btn" onclick="switchTab('tab-feedback','coach')">Mi Feedback</button>
    </div>

    <!-- COACHES -->
    <div id="tab-coaches" class="tab-content active">
      <div class="grid-auto">
        ${coaches.map(c => `
          <div class="coach-card">
            <div class="cc-avatar">${getAvatarHTML(c, 80)}</div>
            <div class="cc-info">
              <h3>${c.name}</h3>
              <p class="cc-bio">${c.bio || 'Coach certificado en Evolution Fit'}</p>
              <div class="cc-tags">
                <span class="badge badge-success"><i class="fas fa-check-circle"></i> Verificado</span>
                <span class="badge badge-primary">Premium</span>
              </div>
              <div class="cc-specialties">
                <span class="pop-tag">HIIT</span>
                <span class="pop-tag">Nutrición</span>
                <span class="pop-tag">Fuerza</span>
                <span class="pop-tag">Cardio</span>
              </div>
              <div class="cc-rating">
                <span style="color:#F7971E">★★★★★</span>
                <span style="color:var(--text-muted);font-size:0.8rem">4.9 · 128 clientes</span>
              </div>
            </div>
            <div class="cc-actions">
              <button class="btn btn-primary btn-block" onclick="openChat('${c.id}','${c.name}')">
                <i class="fas fa-comment"></i> Enviar Mensaje
              </button>
              <button class="btn btn-secondary btn-block" onclick="viewCoachProfile('${c.id}')">
                <i class="fas fa-eye"></i> Ver Perfil
              </button>
            </div>
          </div>
        `).join('')}
        ${coaches.length === 0 ? '<div class="empty-state"><i class="fas fa-user-tie"></i><h3>Sin coaches disponibles</h3></div>' : ''}
      </div>
    </div>

    <!-- MENSAJES -->
    <div id="tab-messages" class="tab-content">
      <div class="chat-container">
        <div class="chat-sidebar">
          <div class="chat-search">
            <input type="text" class="form-control" placeholder="Buscar conversación..."/>
          </div>
          ${coaches.map(c => `
            <div class="chat-contact active" onclick="loadChat('${c.id}','${c.name}')">
              ${getAvatarHTML(c, 44)}
              <div class="contact-info">
                <p>${c.name}</p>
                <span>Coach · En línea</span>
              </div>
              <div class="contact-status online"></div>
            </div>
          `).join('')}
        </div>
        <div class="chat-main" id="chat-main">
          ${coaches.length > 0 ? renderChatWindow(user, coaches[0]) : '<div class="empty-state"><i class="fas fa-comment"></i><h3>Selecciona un coach</h3></div>'}
        </div>
      </div>
    </div>

    <!-- FEEDBACK -->
    <div id="tab-feedback" class="tab-content">
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Feedback del Coach</h3></div>
          <div class="feedback-list">
            <div class="feedback-item">
              <div class="fi-header">
                <span class="badge badge-success">Progreso</span>
                <span style="color:var(--text-muted);font-size:0.8rem">Hace 2 días</span>
              </div>
              <p>"Excelente progreso esta semana. Tu técnica en sentadillas ha mejorado notablemente. Sigue así."</p>
              <div class="fi-coach">— Coach Carlos Ruiz</div>
            </div>
            <div class="feedback-item">
              <div class="fi-header">
                <span class="badge badge-warning">Nutrición</span>
                <span style="color:var(--text-muted);font-size:0.8rem">Hace 5 días</span>
              </div>
              <p>"Recuerda aumentar tu ingesta de proteína post-entrenamiento. Apunta a 30g en los primeros 30 minutos."</p>
              <div class="fi-coach">— Coach Carlos Ruiz</div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Enviar Reporte</h3></div>
          <form onsubmit="sendReport(event)">
            <div class="form-group">
              <label class="form-label">¿Cómo te sientes?</label>
              <div class="mood-selector">
                <button type="button" class="mood-btn active" onclick="selectMood(this,'😴')">😴</button>
                <button type="button" class="mood-btn" onclick="selectMood(this,'😐')">😐</button>
                <button type="button" class="mood-btn" onclick="selectMood(this,'🙂')">🙂</button>
                <button type="button" class="mood-btn" onclick="selectMood(this,'😄')">😄</button>
                <button type="button" class="mood-btn" onclick="selectMood(this,'🔥')">🔥</button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Nivel de energía (1-10)</label>
              <input type="range" id="energy-level" min="1" max="10" value="7" class="form-control" style="padding:0.5rem 0"/>
              <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:var(--text-muted)"><span>1</span><span id="energy-val">7</span><span>10</span></div>
            </div>
            <div class="form-group">
              <label class="form-label">Notas para el coach</label>
              <textarea id="report-notes" class="form-control" rows="3" placeholder="Cuéntale al coach cómo va tu entrenamiento..."></textarea>
            </div>
            <button type="submit" class="btn btn-primary btn-block"><i class="fas fa-paper-plane"></i> Enviar Reporte</button>
          </form>
        </div>
      </div>
    </div>
  </div>`;
}

function renderChatWindow(user, coach) {
  const messages = DB.getMessages().filter(m => (m.userId === user.id && m.coachId === coach.id) || (m.userId === coach.id && m.coachId === user.id));
  const defaultMessages = [
    { from: 'coach', text: `¡Hola ${user.name.split(' ')[0]}! Soy ${coach.name}. ¿En qué puedo ayudarte hoy?`, time: '10:00' },
    { from: 'coach', text: 'Recuerda que estoy aquí para guiarte en tu proceso de entrenamiento y nutrición.', time: '10:01' }
  ];

  return `
  <div class="chat-window">
    <div class="chat-header">
      ${getAvatarHTML(coach, 40)}
      <div>
        <p style="font-weight:600">${coach.name}</p>
        <span style="font-size:0.8rem;color:#43E97B"><i class="fas fa-circle" style="font-size:0.5rem"></i> En línea</span>
      </div>
    </div>
    <div class="chat-messages" id="chat-messages">
      ${defaultMessages.map(m => `
        <div class="message ${m.from === 'coach' ? 'received' : 'sent'}">
          ${m.from === 'coach' ? getAvatarHTML(coach, 32) : ''}
          <div class="message-bubble">
            <p>${m.text}</p>
            <span>${m.time}</span>
          </div>
        </div>
      `).join('')}
      ${messages.map(m => `
        <div class="message ${m.senderId === user.id ? 'sent' : 'received'}">
          <div class="message-bubble">
            <p>${m.text}</p>
            <span>${new Date(m.timestamp).toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'})}</span>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="chat-input">
      <input type="text" id="chat-text" class="form-control" placeholder="Escribe un mensaje..." onkeypress="if(event.key==='Enter')sendChatMessage('${coach.id}')"/>
      <button class="btn btn-primary btn-icon" onclick="sendChatMessage('${coach.id}')"><i class="fas fa-paper-plane"></i></button>
    </div>
  </div>`;
}

function renderCoachPanel(user) {
  const allUsers = DB.getUsers().filter(u => u.role === 'user');
  return `
  <div class="page">
    <div class="section-header">
      <h1 class="section-title"><i class="fas fa-user-tie"></i> Panel del Coach</h1>
      <p class="section-subtitle">Gestiona tus clientes y su progreso</p>
    </div>

    <div class="grid-4" style="margin-bottom:2rem">
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(108,99,255,0.15);color:#6C63FF"><i class="fas fa-users"></i></div>
        <div class="stat-info"><h3>${allUsers.length}</h3><p>Clientes activos</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(67,233,123,0.15);color:#43E97B"><i class="fas fa-comment"></i></div>
        <div class="stat-info"><h3>${DB.getMessages().length}</h3><p>Mensajes</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(247,151,30,0.15);color:#F7971E"><i class="fas fa-star"></i></div>
        <div class="stat-info"><h3>4.9</h3><p>Calificación</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(255,101,132,0.15);color:#FF6584"><i class="fas fa-chart-line"></i></div>
        <div class="stat-info"><h3>92%</h3><p>Retención</p></div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-header"><h3 class="card-title">Mis Clientes</h3></div>
        <div style="display:flex;flex-direction:column;gap:1rem">
          ${allUsers.map(u => `
            <div style="display:flex;align-items:center;gap:1rem;padding:0.75rem;background:var(--card-bg2);border-radius:8px">
              ${getAvatarHTML(u, 44)}
              <div style="flex:1">
                <p style="font-weight:600">${u.name}</p>
                <span style="color:var(--text-muted);font-size:0.8rem">${getPopulationLabel(u.population)} · ${getLevelBadge(u.level)}</span>
              </div>
              <button class="btn btn-sm btn-primary" onclick="openChat('${u.id}','${u.name}')"><i class="fas fa-comment"></i></button>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="card">
        <div class="card-header"><h3 class="card-title">Mensajes Recientes</h3></div>
        <div style="display:flex;flex-direction:column;gap:0.75rem">
          ${DB.getMessages().slice(-5).reverse().map(m => {
            const sender = DB.getUserById(m.senderId);
            return sender ? `
              <div style="display:flex;gap:0.75rem;padding:0.75rem;background:var(--card-bg2);border-radius:8px">
                ${getAvatarHTML(sender, 36)}
                <div>
                  <p style="font-weight:600;font-size:0.85rem">${sender.name}</p>
                  <p style="color:var(--text-muted);font-size:0.8rem">${m.text.substring(0,60)}...</p>
                </div>
              </div>
            ` : '';
          }).join('') || '<p style="color:var(--text-muted);text-align:center;padding:1rem">Sin mensajes</p>'}
        </div>
      </div>
    </div>
  </div>`;
}

function openChat(coachId, coachName) {
  navigate('coach');
  setTimeout(() => {
    const tab = document.querySelector('.tab-btn:nth-child(2)');
    if (tab) { tab.click(); }
  }, 200);
}

function sendChatMessage(coachId) {
  const user = Auth.getCurrentUser();
  const input = document.getElementById('chat-text');
  const text = input?.value?.trim();
  if (!text) return;

  DB.sendMessage({ senderId: user.id, userId: user.id, coachId, text });
  const messagesDiv = document.getElementById('chat-messages');
  if (messagesDiv) {
    const msgEl = document.createElement('div');
    msgEl.className = 'message sent';
    msgEl.innerHTML = `<div class="message-bubble"><p>${text}</p><span>${new Date().toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'})}</span></div>`;
    messagesDiv.appendChild(msgEl);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
  input.value = '';

  // Auto-respuesta del coach
  setTimeout(() => {
    const responses = [
      '¡Excelente! Sigue así con tu entrenamiento.',
      'Recuerda hidratarte bien durante el ejercicio.',
      'Tu progreso es notable. ¡Continúa con la misma dedicación!',
      'Para tu próxima sesión, enfócate en la técnica correcta.',
      '¿Cómo te has sentido con la rutina esta semana?'
    ];
    const response = responses[Math.floor(Math.random() * responses.length)];
    const coach = DB.getUserById(coachId);
    if (messagesDiv && coach) {
      const replyEl = document.createElement('div');
      replyEl.className = 'message received';
      replyEl.innerHTML = `${getAvatarHTML(coach, 32)}<div class="message-bubble"><p>${response}</p><span>${new Date().toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit'})}</span></div>`;
      messagesDiv.appendChild(replyEl);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
  }, 1500);
}

function loadChat(coachId, coachName) {
  const user = Auth.getCurrentUser();
  const coach = DB.getUserById(coachId);
  if (!coach) return;
  document.getElementById('chat-main').innerHTML = renderChatWindow(user, coach);
}

function viewCoachProfile(coachId) {
  const coach = DB.getUserById(coachId);
  if (!coach) return;
  showModal(coach.name, `
    <div style="text-align:center;margin-bottom:1.5rem">
      ${getAvatarHTML(coach, 80)}
      <h3 style="margin-top:1rem">${coach.name}</h3>
      <p style="color:var(--text-muted)">${coach.bio || 'Coach certificado'}</p>
    </div>
    <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-bottom:1.5rem">
      <span class="badge badge-success"><i class="fas fa-check-circle"></i> Verificado</span>
      <span class="badge badge-warning"><i class="fas fa-star"></i> 4.9/5</span>
      <span class="badge badge-primary"><i class="fas fa-users"></i> 128 clientes</span>
    </div>
    <div>
      <h4 style="margin-bottom:0.75rem">Especialidades</h4>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
        ${['HIIT','Fuerza','Nutrición','Cardio','Calistenia','Yoga'].map(s => `<span class="pop-tag">${s}</span>`).join('')}
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-primary" onclick="closeModal();openChat('${coach.id}','${coach.name}')"><i class="fas fa-comment"></i> Contactar</button>
  `);
}

function selectMood(btn, mood) {
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function sendReport(e) {
  e.preventDefault();
  const user = Auth.getCurrentUser();
  DB.addNotification(user.id, { type: 'coach', icon: 'fas fa-user-tie', color: '#43E97B', title: 'Reporte enviado', message: 'Tu reporte ha sido enviado al coach.' });
  showToast('Reporte enviado', 'El coach revisará tu progreso pronto', 'success');
}

document.addEventListener('input', e => {
  if (e.target.id === 'energy-level') {
    document.getElementById('energy-val').textContent = e.target.value;
  }
});
