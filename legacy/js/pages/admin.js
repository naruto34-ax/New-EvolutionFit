// ===== ADMIN PAGE =====
function renderAdmin(user) {
  if (!Auth.isAdmin()) return '<div class="page"><div class="empty-state"><i class="fas fa-lock"></i><h3>Acceso denegado</h3><p>Solo administradores</p></div></div>';

  const users = DB.getUsers();
  const routines = DB.getRoutines();
  const orders = DB.getOrders();
  const messages = DB.getMessages();

  return `
  <div class="page">
    <div class="section-header">
      <h1 class="section-title"><i class="fas fa-cog"></i> Panel de Administración</h1>
      <p class="section-subtitle">Gestión completa de la plataforma Evolution Fit</p>
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
        <div class="stat-info"><h3>$${(orders.reduce((s,o) => s+(o.total||0), 0)/1000).toFixed(0)}K</h3><p>Ingresos</p><span class="stat-change up"><i class="fas fa-arrow-up"></i> +15%</span></div>
      </div>
    </div>

    <!-- TABS -->
    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('tab-users','admin')">Usuarios</button>
      <button class="tab-btn" onclick="switchTab('tab-routines-admin','admin')">Rutinas</button>
      <button class="tab-btn" onclick="switchTab('tab-orders','admin')">Pedidos</button>
      <button class="tab-btn" onclick="switchTab('tab-analytics','admin')">Analíticas</button>
      <button class="tab-btn" onclick="switchTab('tab-settings','admin')">Configuración</button>
    </div>

    <!-- USUARIOS -->
    <div id="tab-users" class="tab-content active">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Gestión de Usuarios</h3>
          <div style="display:flex;gap:0.75rem">
            <input type="text" class="form-control" style="width:200px" placeholder="Buscar usuario..." oninput="searchUsers(this.value)"/>
            <button class="btn btn-primary btn-sm" onclick="showCreateUserModal()"><i class="fas fa-plus"></i> Nuevo</button>
          </div>
        </div>
        <div class="table-container">
          <table class="admin-table" id="users-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Nivel</th>
                <th>Plan</th>
                <th>Puntos</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr data-name="${u.name.toLowerCase()}" data-email="${u.email}">
                  <td>
                    <div style="display:flex;align-items:center;gap:0.75rem">
                      ${getAvatarHTML(u, 36)}
                      <span style="font-weight:600">${u.name}</span>
                    </div>
                  </td>
                  <td style="color:var(--text-muted)">${u.email}</td>
                  <td><span class="badge badge-${u.role==='admin'?'danger':u.role==='coach'?'success':'primary'}">${u.role}</span></td>
                  <td>${getLevelBadge(u.level)}</td>
                  <td><span class="badge badge-${u.plan==='premium'?'warning':'primary'}">${u.plan}</span></td>
                  <td><strong>${(u.points||0).toLocaleString()}</strong></td>
                  <td>
                    <div style="display:flex;gap:0.5rem">
                      <button class="btn btn-sm btn-secondary" onclick="editUser('${u.id}')"><i class="fas fa-edit"></i></button>
                      ${u.id !== user.id ? `<button class="btn btn-sm btn-danger" onclick="deleteUser('${u.id}','${u.name}')"><i class="fas fa-trash"></i></button>` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- RUTINAS ADMIN -->
    <div id="tab-routines-admin" class="tab-content">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Gestión de Rutinas</h3>
          <button class="btn btn-primary btn-sm" onclick="showCreateRoutineModal()"><i class="fas fa-plus"></i> Nueva Rutina</button>
        </div>
        <div class="table-container">
          <table class="admin-table">
            <thead>
              <tr><th>Nombre</th><th>Espacio</th><th>Nivel</th><th>Categoría</th><th>Duración</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              ${routines.map(r => `
                <tr>
                  <td><strong>${r.name}</strong></td>
                  <td>${getSpaceBadge(r.space)}</td>
                  <td>${getLevelBadge(r.level)}</td>
                  <td><span class="badge badge-primary">${r.category}</span></td>
                  <td>${r.duration} min</td>
                  <td><span class="badge badge-${r.isPublic?'success':'warning'}">${r.isPublic?'Pública':'Privada'}</span></td>
                  <td>
                    <div style="display:flex;gap:0.5rem">
                      <button class="btn btn-sm btn-secondary" onclick="openRoutineDetail('${r.id}')"><i class="fas fa-eye"></i></button>
                      <button class="btn btn-sm btn-danger" onclick="deleteRoutineAdmin('${r.id}')"><i class="fas fa-trash"></i></button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- PEDIDOS -->
    <div id="tab-orders" class="tab-content">
      <div class="card">
        <div class="card-header"><h3 class="card-title">Pedidos de la Tienda</h3></div>
        ${orders.length === 0 ? '<div class="empty-state"><i class="fas fa-shopping-bag"></i><h3>Sin pedidos</h3></div>' : `
        <div class="table-container">
          <table class="admin-table">
            <thead><tr><th>ID</th><th>Usuario</th><th>Total</th><th>Estado</th><th>Fecha</th><th>Acciones</th></tr></thead>
            <tbody>
              ${orders.map(o => {
                const orderUser = DB.getUserById(o.userId);
                return `
                <tr>
                  <td style="font-family:monospace;font-size:0.8rem">${o.id}</td>
                  <td>${orderUser ? orderUser.name : 'N/A'}</td>
                  <td><strong>$${(o.total||0).toLocaleString('es-CO')}</strong></td>
                  <td><span class="badge badge-${o.status==='completed'?'success':o.status==='pending'?'warning':'danger'}">${o.status}</span></td>
                  <td style="color:var(--text-muted);font-size:0.85rem">${new Date(o.createdAt).toLocaleDateString('es-CO')}</td>
                  <td>
                    <button class="btn btn-sm btn-success" onclick="updateOrderStatus('${o.id}','completed')"><i class="fas fa-check"></i></button>
                  </td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>`}
      </div>
    </div>

    <!-- ANALÍTICAS -->
    <div id="tab-analytics" class="tab-content">
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Usuarios por Rol</h3></div>
          <canvas id="admin-roles-chart" height="200"></canvas>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Distribución por Espacio</h3></div>
          <canvas id="admin-spaces-chart" height="200"></canvas>
        </div>
      </div>
      <div class="card" style="margin-top:1.5rem">
        <div class="card-header"><h3 class="card-title">Registros por Mes</h3></div>
        <canvas id="admin-registrations-chart" height="120"></canvas>
      </div>
    </div>

    <!-- CONFIGURACIÓN -->
    <div id="tab-settings" class="tab-content">
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3 class="card-title"><i class="fas fa-cog"></i> Configuración General</h3></div>
          <div class="form-group">
            <label class="form-label">Nombre de la plataforma</label>
            <input type="text" class="form-control" value="Evolution Fit"/>
          </div>
          <div class="form-group">
            <label class="form-label">Email de soporte</label>
            <input type="email" class="form-control" value="soporte@evolutionfit.com"/>
          </div>
          <div class="form-group">
            <label class="form-label">Máx. usuarios gratuitos</label>
            <input type="number" class="form-control" value="1000"/>
          </div>
          <button class="btn btn-primary" onclick="showToast('Guardado','Configuración actualizada','success')"><i class="fas fa-save"></i> Guardar</button>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title"><i class="fas fa-bell"></i> Notificaciones</h3></div>
          <div class="settings-toggle">
            <div class="st-item">
              <div><p>Notificaciones de registro</p><span>Alertar cuando se registre un usuario</span></div>
              <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
            </div>
            <div class="st-item">
              <div><p>Alertas de pedidos</p><span>Notificar nuevos pedidos</span></div>
              <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
            </div>
            <div class="st-item">
              <div><p>Reportes semanales</p><span>Resumen semanal por email</span></div>
              <label class="toggle"><input type="checkbox"/><span class="toggle-slider"></span></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function initAdminCharts() {
  setTimeout(() => {
    const users = DB.getUsers();
    const rolesCanvas = document.getElementById('admin-roles-chart');
    if (rolesCanvas) {
      const roles = { admin: users.filter(u=>u.role==='admin').length, coach: users.filter(u=>u.role==='coach').length, user: users.filter(u=>u.role==='user').length };
      drawDonutChart(rolesCanvas, [roles.admin, roles.coach, roles.user], ['Admin','Coach','Usuario'], ['#FF6584','#43E97B','#6C63FF']);
    }
    const spacesCanvas = document.getElementById('admin-spaces-chart');
    if (spacesCanvas) {
      const spaces = { gym: users.filter(u=>u.preferredSpace==='gym').length, park: users.filter(u=>u.preferredSpace==='park').length, home: users.filter(u=>u.preferredSpace==='home').length };
      drawDonutChart(spacesCanvas, [spaces.gym, spaces.park, spaces.home], ['Gym','Parque','Casa'], ['#FF6584','#43E97B','#6C63FF']);
    }
    const regCanvas = document.getElementById('admin-registrations-chart');
    if (regCanvas) {
      drawBarChart(regCanvas, [12,18,25,30,22,35,28], ['Ene','Feb','Mar','Abr','May','Jun','Jul'], '#6C63FF');
    }
  }, 100);
}

function drawDonutChart(canvas, data, labels, colors) {
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 300;
  const H = canvas.height || 200;
  canvas.width = W;
  ctx.clearRect(0, 0, W, H);

  const total = data.reduce((s, v) => s + v, 0);
  if (total === 0) return;

  const cx = W * 0.4, cy = H / 2, r = Math.min(cx, cy) * 0.8, innerR = r * 0.55;
  let startAngle = -Math.PI / 2;

  data.forEach((v, i) => {
    const angle = (v / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, startAngle, startAngle + angle);
    ctx.closePath();
    ctx.fillStyle = colors[i];
    ctx.fill();
    startAngle += angle;
  });

  // Inner circle
  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
  ctx.fillStyle = '#1E1E35';
  ctx.fill();

  // Center text
  ctx.fillStyle = '#E8E8F0';
  ctx.font = 'bold 20px Poppins';
  ctx.textAlign = 'center';
  ctx.fillText(total, cx, cy + 7);

  // Legend
  const lx = W * 0.75, ly = cy - (data.length * 20) / 2;
  data.forEach((v, i) => {
    ctx.fillStyle = colors[i];
    ctx.fillRect(lx, ly + i * 24, 12, 12);
    ctx.fillStyle = '#9090B0';
    ctx.font = '11px Poppins';
    ctx.textAlign = 'left';
    ctx.fillText(`${labels[i]} (${v})`, lx + 16, ly + i * 24 + 10);
  });
}

function searchUsers(val) {
  document.querySelectorAll('#users-table tbody tr').forEach(row => {
    const name = row.dataset.name || '';
    const email = row.dataset.email || '';
    row.style.display = (name.includes(val.toLowerCase()) || email.includes(val.toLowerCase())) ? '' : 'none';
  });
}

function editUser(userId) {
  const u = DB.getUserById(userId);
  if (!u) return;
  showModal(`Editar: ${u.name}`, `
    <div class="form-group">
      <label class="form-label">Nombre</label>
      <input type="text" id="edit-name" class="form-control" value="${u.name}"/>
    </div>
    <div class="form-group">
      <label class="form-label">Rol</label>
      <select id="edit-role" class="form-select">
        <option value="user" ${u.role==='user'?'selected':''}>Usuario</option>
        <option value="coach" ${u.role==='coach'?'selected':''}>Coach</option>
        <option value="admin" ${u.role==='admin'?'selected':''}>Admin</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">Plan</label>
      <select id="edit-plan" class="form-select">
        <option value="free" ${u.plan==='free'?'selected':''}>Gratuito</option>
        <option value="premium" ${u.plan==='premium'?'selected':''}>Premium</option>
      </select>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveUserEdit('${userId}')"><i class="fas fa-save"></i> Guardar</button>
  `);
}

function saveUserEdit(userId) {
  DB.updateUser(userId, {
    name: document.getElementById('edit-name').value,
    role: document.getElementById('edit-role').value,
    plan: document.getElementById('edit-plan').value
  });
  closeModal();
  showToast('Actualizado', 'Usuario actualizado correctamente', 'success');
  navigate('admin');
}

function deleteUser(userId, name) {
  showModal('Confirmar eliminación', `
    <div style="text-align:center;padding:1rem">
      <i class="fas fa-exclamation-triangle" style="font-size:3rem;color:#FF6584;margin-bottom:1rem"></i>
      <p>¿Estás seguro de eliminar a <strong>${name}</strong>?</p>
      <p style="color:var(--text-muted);font-size:0.85rem;margin-top:0.5rem">Esta acción no se puede deshacer.</p>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-danger" onclick="confirmDeleteUser('${userId}')"><i class="fas fa-trash"></i> Eliminar</button>
  `);
}

function confirmDeleteUser(userId) {
  DB.deleteUser(userId);
  closeModal();
  showToast('Eliminado', 'Usuario eliminado', 'success');
  navigate('admin');
}

function deleteRoutineAdmin(routineId) {
  DB.deleteRoutine(routineId);
  showToast('Eliminada', 'Rutina eliminada', 'success');
  navigate('admin');
}

function updateOrderStatus(orderId, status) {
  const orders = DB.getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx !== -1) { orders[idx].status = status; DB.saveOrders(orders); }
  showToast('Actualizado', 'Estado del pedido actualizado', 'success');
  navigate('admin');
}

function showCreateUserModal() {
  showModal('Crear Nuevo Usuario', `
    <div class="form-group">
      <label class="form-label">Nombre</label>
      <input type="text" id="new-name" class="form-control" placeholder="Nombre completo" required/>
    </div>
    <div class="form-group">
      <label class="form-label">Email</label>
      <input type="email" id="new-email" class="form-control" placeholder="email@ejemplo.com" required/>
    </div>
    <div class="form-group">
      <label class="form-label">Contraseña</label>
      <input type="password" id="new-pass" class="form-control" placeholder="Mínimo 6 caracteres" required/>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label class="form-label">Rol</label>
        <select id="new-role" class="form-select">
          <option value="user">Usuario</option>
          <option value="coach">Coach</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Plan</label>
        <select id="new-plan" class="form-select">
          <option value="free">Gratuito</option>
          <option value="premium">Premium</option>
        </select>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="createUserAdmin()"><i class="fas fa-plus"></i> Crear</button>
  `);
}

function createUserAdmin() {
  const name = document.getElementById('new-name').value;
  const email = document.getElementById('new-email').value;
  const password = document.getElementById('new-pass').value;
  const role = document.getElementById('new-role').value;
  const plan = document.getElementById('new-plan').value;
  if (!name || !email || !password) { showToast('Error', 'Completa todos los campos', 'error'); return; }
  if (DB.getUserByEmail(email)) { showToast('Error', 'Email ya registrado', 'error'); return; }
  DB.createUser({ name, email, password, role, plan });
  closeModal();
  showToast('Creado', 'Usuario creado exitosamente', 'success');
  navigate('admin');
}
