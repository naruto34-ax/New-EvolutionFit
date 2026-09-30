// ===== PROFILE PAGE =====
function renderProfile(user) {
  return `
  <div class="page">
    <div class="section-header">
      <h1 class="section-title"><i class="fas fa-user-circle"></i> Mi Perfil</h1>
      <p class="section-subtitle">Gestiona tu información personal y preferencias</p>
    </div>

    <div class="grid-2">
      <!-- PERFIL PRINCIPAL -->
      <div class="card">
        <div class="profile-header">
          <div class="profile-avatar-container">
            <div id="profile-avatar-display" style="width:100px;height:100px;border-radius:50%;overflow:hidden;border:4px solid var(--primary)">
              ${getAvatarHTML(user, 100)}
            </div>
            <button class="avatar-edit-btn" onclick="changeAvatar()"><i class="fas fa-camera"></i></button>
          </div>
          <div class="profile-name-section">
            <h2>${user.name}</h2>
            <p style="color:var(--text-muted)">${user.email}</p>
            <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.5rem">
              <span class="badge badge-${user.role==='admin'?'danger':user.role==='coach'?'success':'primary'}">${user.role}</span>
              <span class="badge badge-${user.plan==='premium'?'warning':'primary'}">${user.plan==='premium'?'👑 Premium':'Gratuito'}</span>
              ${getLevelBadge(user.level)}
            </div>
          </div>
        </div>

        <div class="profile-stats">
          <div class="ps-item"><strong>${user.points || 0}</strong><span>Puntos</span></div>
          <div class="ps-item"><strong>${user.streak || 0}</strong><span>Racha</span></div>
          <div class="ps-item"><strong>${DB.getUserAchievements(user.id).length}</strong><span>Logros</span></div>
          <div class="ps-item"><strong>${DB.getProgressByUser(user.id).filter(p=>p.type==='workout').length}</strong><span>Entrenos</span></div>
        </div>

        ${user.bio ? `<div class="profile-bio"><p>${user.bio}</p></div>` : ''}

        <div style="margin-top:1.5rem">
          <button class="btn btn-primary btn-block" onclick="showEditProfileModal()"><i class="fas fa-edit"></i> Editar Perfil</button>
        </div>
      </div>

      <!-- INFORMACIÓN PERSONAL -->
      <div class="card">
        <div class="card-header"><h3 class="card-title"><i class="fas fa-id-card" style="color:#6C63FF"></i> Información Personal</h3></div>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label"><i class="fas fa-calendar"></i> Edad</span>
            <span class="info-value">${user.age ? user.age + ' años' : 'No especificado'}</span>
          </div>
          <div class="info-item">
            <span class="info-label"><i class="fas fa-venus-mars"></i> Género</span>
            <span class="info-value">${user.gender === 'male' ? 'Masculino' : user.gender === 'female' ? 'Femenino' : 'No especificado'}</span>
          </div>
          <div class="info-item">
            <span class="info-label"><i class="fas fa-weight"></i> Peso</span>
            <span class="info-value">${user.weight ? user.weight + ' kg' : 'No especificado'}</span>
          </div>
          <div class="info-item">
            <span class="info-label"><i class="fas fa-ruler-vertical"></i> Altura</span>
            <span class="info-value">${user.height ? user.height + ' cm' : 'No especificado'}</span>
          </div>
          <div class="info-item">
            <span class="info-label"><i class="fas fa-users"></i> Población</span>
            <span class="info-value">${getPopulationLabel(user.population)}</span>
          </div>
          <div class="info-item">
            <span class="info-label"><i class="fas fa-map-marker-alt"></i> Espacio preferido</span>
            <span class="info-value">${getSpaceBadge(user.preferredSpace)}</span>
          </div>
          <div class="info-item">
            <span class="info-label"><i class="fas fa-bullseye"></i> Objetivo</span>
            <span class="info-value">${getGoalLabel(user.goal)}</span>
          </div>
          <div class="info-item">
            <span class="info-label"><i class="fas fa-phone"></i> Teléfono</span>
            <span class="info-value">${user.phone || 'No especificado'}</span>
          </div>
        </div>
        ${user.medicalConditions ? `
          <div style="margin-top:1rem;padding:1rem;background:rgba(255,101,132,0.1);border-radius:8px;border-left:3px solid #FF6584">
            <p style="font-size:0.85rem;font-weight:600;color:#FF6584"><i class="fas fa-heartbeat"></i> Condiciones médicas</p>
            <p style="font-size:0.85rem;color:var(--text-muted);margin-top:0.25rem">${user.medicalConditions}</p>
          </div>
        ` : ''}
      </div>
    </div>

    <!-- PREFERENCIAS Y SEGURIDAD -->
    <div class="grid-2" style="margin-top:1.5rem">
      <div class="card">
        <div class="card-header"><h3 class="card-title"><i class="fas fa-sliders-h" style="color:#43E97B"></i> Preferencias</h3></div>
        <div class="settings-toggle">
          <div class="st-item">
            <div><p>Notificaciones push</p><span>Recordatorios de entrenamiento</span></div>
            <label class="toggle"><input type="checkbox" ${user.notifications?'checked':''} onchange="toggleNotifPref(this)"/><span class="toggle-slider"></span></label>
          </div>
          <div class="st-item">
            <div><p>Perfil público</p><span>Visible en el ranking</span></div>
            <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
          </div>
          <div class="st-item">
            <div><p>Emails de progreso</p><span>Resumen semanal por email</span></div>
            <label class="toggle"><input type="checkbox"/><span class="toggle-slider"></span></label>
          </div>
        </div>
        <div style="margin-top:1.5rem">
          <h4 style="font-size:0.9rem;margin-bottom:1rem">Objetivo principal</h4>
          <div class="goal-selector">
            ${[
              {id:'weight_loss',icon:'fas fa-weight',label:'Perder peso'},
              {id:'muscle_gain',icon:'fas fa-dumbbell',label:'Ganar músculo'},
              {id:'fitness',icon:'fas fa-heartbeat',label:'Fitness general'},
              {id:'flexibility',icon:'fas fa-spa',label:'Flexibilidad'},
              {id:'endurance',icon:'fas fa-running',label:'Resistencia'}
            ].map(g => `
              <button class="goal-btn ${user.goal===g.id?'active':''}" onclick="setGoal('${g.id}',this)">
                <i class="${g.icon}"></i> ${g.label}
              </button>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header"><h3 class="card-title"><i class="fas fa-shield-alt" style="color:#FF6584"></i> Seguridad</h3></div>
        <form onsubmit="changePassword(event)">
          <div class="form-group">
            <label class="form-label">Contraseña actual</label>
            <div class="input-password">
              <input type="password" id="current-pass" class="form-control" placeholder="Tu contraseña actual"/>
              <button type="button" class="toggle-password" onclick="togglePassword('current-pass')"><i class="fas fa-eye"></i></button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Nueva contraseña</label>
            <div class="input-password">
              <input type="password" id="new-pass" class="form-control" placeholder="Mínimo 6 caracteres"/>
              <button type="button" class="toggle-password" onclick="togglePassword('new-pass')"><i class="fas fa-eye"></i></button>
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Confirmar nueva contraseña</label>
            <input type="password" id="confirm-pass" class="form-control" placeholder="Repite la nueva contraseña"/>
          </div>
          <button type="submit" class="btn btn-primary btn-block"><i class="fas fa-lock"></i> Cambiar Contraseña</button>
        </form>
        <div style="margin-top:1.5rem;padding-top:1.5rem;border-top:1px solid var(--border)">
          <button class="btn btn-danger btn-block" onclick="confirmDeleteAccount()">
            <i class="fas fa-user-times"></i> Eliminar cuenta
          </button>
        </div>
      </div>
    </div>

    <!-- PLAN ACTUAL -->
    <div class="card" style="margin-top:1.5rem">
      <div class="card-header">
        <h3 class="card-title"><i class="fas fa-crown" style="color:#F7971E"></i> Mi Plan</h3>
        ${user.plan !== 'premium' ? '<button class="btn btn-primary btn-sm" onclick="upgradePlan()"><i class="fas fa-arrow-up"></i> Mejorar Plan</button>' : ''}
      </div>
      <div class="plan-current">
        <div class="pc-info">
          <h3>${user.plan === 'premium' ? '👑 Plan Premium' : '🆓 Plan Gratuito'}</h3>
          <p>${user.plan === 'premium' ? 'Acceso completo a todas las funciones' : 'Acceso básico a la plataforma'}</p>
        </div>
        <div class="pc-features">
          ${user.plan === 'premium' ? `
            <span class="badge badge-success"><i class="fas fa-check"></i> Rutinas ilimitadas</span>
            <span class="badge badge-success"><i class="fas fa-check"></i> Coach personal</span>
            <span class="badge badge-success"><i class="fas fa-check"></i> Análisis avanzado</span>
            <span class="badge badge-success"><i class="fas fa-check"></i> Descuentos tienda</span>
          ` : `
            <span class="badge badge-primary"><i class="fas fa-check"></i> 10 rutinas</span>
            <span class="badge badge-primary"><i class="fas fa-check"></i> Seguimiento básico</span>
            <span class="badge badge-warning"><i class="fas fa-times"></i> Coach personal</span>
            <span class="badge badge-warning"><i class="fas fa-times"></i> Análisis avanzado</span>
          `}
        </div>
      </div>
    </div>
  </div>`;
}

function showEditProfileModal() {
  const user = Auth.getCurrentUser();
  showModal('Editar Perfil', `
    <div class="form-group">
      <label class="form-label">Nombre completo</label>
      <input type="text" id="ep-name" class="form-control" value="${user.name}"/>
    </div>
    <div class="form-group">
      <label class="form-label">Biografía</label>
      <textarea id="ep-bio" class="form-control" rows="2" placeholder="Cuéntanos sobre ti...">${user.bio || ''}</textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Peso (kg)</label>
        <input type="number" id="ep-weight" class="form-control" value="${user.weight || ''}" step="0.1"/>
      </div>
      <div class="form-group">
        <label class="form-label">Altura (cm)</label>
        <input type="number" id="ep-height" class="form-control" value="${user.height || ''}"/>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">Teléfono</label>
      <input type="tel" id="ep-phone" class="form-control" value="${user.phone || ''}" placeholder="+57 300 000 0000"/>
    </div>
    <div class="form-group">
      <label class="form-label">Condiciones médicas (opcional)</label>
      <textarea id="ep-medical" class="form-control" rows="2" placeholder="Ej: Hipertensión, diabetes...">${user.medicalConditions || ''}</textarea>
    </div>
    <div class="form-group">
      <label class="form-label">Espacio preferido</label>
      <select id="ep-space" class="form-select">
        <option value="gym" ${user.preferredSpace==='gym'?'selected':''}>Gimnasio</option>
        <option value="park" ${user.preferredSpace==='park'?'selected':''}>Parque</option>
        <option value="home" ${user.preferredSpace==='home'?'selected':''}>Casa</option>
      </select>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveProfile()"><i class="fas fa-save"></i> Guardar</button>
  `);
}

function saveProfile() {
  const user = Auth.getCurrentUser();
  DB.updateUser(user.id, {
    name: document.getElementById('ep-name').value,
    bio: document.getElementById('ep-bio').value,
    weight: parseFloat(document.getElementById('ep-weight').value) || user.weight,
    height: parseFloat(document.getElementById('ep-height').value) || user.height,
    phone: document.getElementById('ep-phone').value,
    medicalConditions: document.getElementById('ep-medical').value,
    preferredSpace: document.getElementById('ep-space').value
  });
  closeModal();
  showToast('Perfil actualizado', 'Tus datos han sido guardados', 'success');
  navigate('profile');
}

function changePassword(e) {
  e.preventDefault();
  const user = Auth.getCurrentUser();
  const current = document.getElementById('current-pass').value;
  const newPass = document.getElementById('new-pass').value;
  const confirm = document.getElementById('confirm-pass').value;
  if (current !== user.password) { showToast('Error', 'Contraseña actual incorrecta', 'error'); return; }
  if (newPass.length < 6) { showToast('Error', 'La nueva contraseña debe tener al menos 6 caracteres', 'error'); return; }
  if (newPass !== confirm) { showToast('Error', 'Las contraseñas no coinciden', 'error'); return; }
  DB.updateUser(user.id, { password: newPass });
  showToast('Contraseña cambiada', 'Tu contraseña ha sido actualizada', 'success');
}

function changeAvatar() {
  showModal('Cambiar Avatar', `
    <div style="text-align:center">
      <p style="margin-bottom:1.5rem;color:var(--text-muted)">Elige un color para tu avatar</p>
      <div style="display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;margin-bottom:1.5rem">
        ${['#6C63FF','#FF6584','#43E97B','#F7971E','#38BDF8','#A855F7','#EC4899','#EF4444'].map(c => `
          <div onclick="selectAvatarColor('${c}')" style="width:48px;height:48px;border-radius:50%;background:${c};cursor:pointer;display:flex;align-items:center;justify-content:center;font-weight:700;color:white;font-size:1.2rem;transition:transform 0.2s" onmouseover="this.style.transform='scale(1.2)'" onmouseout="this.style.transform='scale(1)'">
            ${Auth.getCurrentUser().name.charAt(0).toUpperCase()}
          </div>
        `).join('')}
      </div>
    </div>
  `);
}

function selectAvatarColor(color) {
  const user = Auth.getCurrentUser();
  DB.updateUser(user.id, { avatarColor: color });
  closeModal();
  showToast('Avatar actualizado', 'Tu avatar ha sido cambiado', 'success');
  navigate('profile');
}

function setGoal(goalId, btn) {
  const user = Auth.getCurrentUser();
  DB.updateUser(user.id, { goal: goalId });
  document.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast('Objetivo actualizado', 'Tu objetivo ha sido guardado', 'success');
}

function toggleNotifPref(checkbox) {
  const user = Auth.getCurrentUser();
  DB.updateUser(user.id, { notifications: checkbox.checked });
}

function upgradePlan() {
  showModal('Mejorar a Premium', `
    <div style="text-align:center;padding:1rem">
      <div style="font-size:3rem;margin-bottom:1rem">👑</div>
      <h3 style="margin-bottom:0.5rem">Plan Premium</h3>
      <div style="font-size:2rem;font-weight:800;color:var(--primary);margin-bottom:1rem">$29.900<small style="font-size:1rem;font-weight:400">/mes</small></div>
      <div style="text-align:left;margin-bottom:1.5rem">
        ${['Rutinas ilimitadas','Coach personal','Análisis avanzado','Fotos de progreso','Descuentos en tienda','Soporte prioritario'].map(f => `
          <div style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0;border-bottom:1px solid var(--border)">
            <i class="fas fa-check-circle" style="color:#43E97B"></i>
            <span>${f}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="activatePremium()"><i class="fas fa-crown"></i> Activar Premium</button>
  `);
}

function activatePremium() {
  const user = Auth.getCurrentUser();
  DB.updateUser(user.id, { plan: 'premium' });
  closeModal();
  showToast('¡Premium activado!', 'Ahora tienes acceso completo a Evolution Fit 🎉', 'success');
  navigate('profile');
}

function confirmDeleteAccount() {
  showModal('Eliminar cuenta', `
    <div style="text-align:center;padding:1rem">
      <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:#FF6584;margin-bottom:1rem"></i>
      <p>¿Estás seguro de que deseas eliminar tu cuenta?</p>
      <p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.5rem">Todos tus datos serán eliminados permanentemente.</p>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" onclick="deleteMyAccount()"><i class="fas fa-trash"></i> Eliminar mi cuenta</button>
  `);
}

function deleteMyAccount() {
  const user = Auth.getCurrentUser();
  DB.deleteUser(user.id);
  Auth.logout();
  closeModal();
  showToast('Cuenta eliminada', 'Tu cuenta ha sido eliminada', 'info');
  navigate('landing');
}

function getGoalLabel(goal) {
  const map = { weight_loss: 'Perder peso', muscle_gain: 'Ganar músculo', fitness: 'Fitness general', flexibility: 'Flexibilidad', endurance: 'Resistencia' };
  return map[goal] || 'No especificado';
}
