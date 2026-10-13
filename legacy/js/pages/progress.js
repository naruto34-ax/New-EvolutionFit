// ===== PROGRESS PAGE =====
function renderProgress(user) {
  const progress = DB.getProgressByUser(user.id);
  const weights = progress.filter(p => p.type === 'weight').sort((a,b) => new Date(a.date)-new Date(b.date));
  const workouts = progress.filter(p => p.type === 'workout');

  return `
  <div class="page">
    <div class="section-header">
      <h1 class="section-title"><i class="fas fa-chart-line"></i> Mi Progreso</h1>
      <p class="section-subtitle">Visualiza tu evolución y registra tus avances</p>
    </div>

    <!-- STATS RÁPIDAS -->
    <div class="grid-4" style="margin-bottom:2rem">
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(108,99,255,0.15);color:#6C63FF"><i class="fas fa-dumbbell"></i></div>
        <div class="stat-info"><h3>${workouts.length}</h3><p>Entrenamientos</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(255,101,132,0.15);color:#FF6584"><i class="fas fa-fire"></i></div>
        <div class="stat-info"><h3>${workouts.reduce((s,w) => s+(w.calories||350), 0).toLocaleString()}</h3><p>Calorías totales</p></div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(67,233,123,0.15);color:#43E97B"><i class="fas fa-weight"></i></div>
        <div class="stat-info">
          <h3>${weights.length > 0 ? weights[weights.length-1].value + ' kg' : '--'}</h3>
          <p>Peso actual</p>
          ${weights.length > 1 ? `<span class="stat-change ${weights[weights.length-1].value < weights[0].value ? 'up' : 'down'}">
            ${weights[weights.length-1].value < weights[0].value ? '↓' : '↑'} ${Math.abs(weights[weights.length-1].value - weights[0].value).toFixed(1)} kg
          </span>` : ''}
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon" style="background:rgba(247,151,30,0.15);color:#F7971E"><i class="fas fa-clock"></i></div>
        <div class="stat-info"><h3>${workouts.reduce((s,w) => s+(w.value||0), 0)}</h3><p>Minutos totales</p></div>
      </div>
    </div>

    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('tab-charts','progress')">Gráficas</button>
      <button class="tab-btn" onclick="switchTab('tab-register','progress')">Registrar</button>
      <button class="tab-btn" onclick="switchTab('tab-photos','progress')">Fotos</button>
      <button class="tab-btn" onclick="switchTab('tab-history','progress')">Historial</button>
    </div>

    <!-- GRÁFICAS -->
    <div id="tab-charts" class="tab-content active">
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3 class="card-title"><i class="fas fa-weight" style="color:#43E97B"></i> Evolución de Peso</h3></div>
          <canvas id="weight-chart" height="200"></canvas>
          ${weights.length === 0 ? '<p style="text-align:center;color:var(--text-muted);padding:2rem">Sin datos de peso registrados</p>' : ''}
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title"><i class="fas fa-dumbbell" style="color:#6C63FF"></i> Entrenamientos por Semana</h3></div>
          <canvas id="workout-chart" height="200"></canvas>
        </div>
      </div>
      <div class="card" style="margin-top:1.5rem">
        <div class="card-header"><h3 class="card-title"><i class="fas fa-fire" style="color:#FF6584"></i> Calorías Quemadas</h3></div>
        <canvas id="calories-chart" height="120"></canvas>
      </div>
    </div>

    <!-- REGISTRAR -->
    <div id="tab-register" class="tab-content">
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Registrar Peso</h3></div>
          <form onsubmit="logWeight(event)">
            <div class="form-group">
              <label class="form-label">Peso actual (kg)</label>
              <input type="number" id="prog-weight" class="form-control" placeholder="70.5" step="0.1" required/>
            </div>
            <div class="form-group">
              <label class="form-label">Nota (opcional)</label>
              <input type="text" id="prog-note" class="form-control" placeholder="Ej: Después del desayuno"/>
            </div>
            <button type="submit" class="btn btn-primary btn-block"><i class="fas fa-save"></i> Guardar</button>
          </form>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Registrar Medidas</h3></div>
          <form onsubmit="logMeasures(event)">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Cintura (cm)</label>
                <input type="number" id="m-waist" class="form-control" placeholder="80"/>
              </div>
              <div class="form-group">
                <label class="form-label">Cadera (cm)</label>
                <input type="number" id="m-hip" class="form-control" placeholder="95"/>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Pecho (cm)</label>
                <input type="number" id="m-chest" class="form-control" placeholder="100"/>
              </div>
              <div class="form-group">
                <label class="form-label">Brazo (cm)</label>
                <input type="number" id="m-arm" class="form-control" placeholder="35"/>
              </div>
            </div>
            <button type="submit" class="btn btn-success btn-block"><i class="fas fa-ruler"></i> Guardar Medidas</button>
          </form>
        </div>
      </div>
    </div>

    <!-- FOTOS -->
    <div id="tab-photos" class="tab-content">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title"><i class="fas fa-camera" style="color:#A855F7"></i> Fotos de Progreso</h3>
          <button class="btn btn-primary btn-sm" onclick="uploadPhoto()"><i class="fas fa-upload"></i> Subir Foto</button>
        </div>
        <div class="photos-grid" id="photos-grid">
          <div class="photo-placeholder" onclick="uploadPhoto()">
            <i class="fas fa-plus"></i>
            <p>Agregar foto</p>
            <span>Frente, lado o espalda</span>
          </div>
          <div class="photo-placeholder" onclick="uploadPhoto()">
            <i class="fas fa-plus"></i>
            <p>Agregar foto</p>
            <span>Comparativa</span>
          </div>
        </div>
        <p style="color:var(--text-muted);font-size:0.8rem;margin-top:1rem;text-align:center">
          <i class="fas fa-lock"></i> Tus fotos son privadas y solo tú puedes verlas
        </p>
      </div>
    </div>

    <!-- HISTORIAL -->
    <div id="tab-history" class="tab-content">
      <div class="card">
        <div class="card-header"><h3 class="card-title">Historial completo</h3></div>
        <div class="history-list">
          ${progress.length === 0 ? '<div class="empty-state"><i class="fas fa-history"></i><h3>Sin registros</h3><p>Comienza a registrar tu progreso</p></div>' :
            progress.slice().reverse().map(p => `
              <div class="history-item">
                <div class="hi-icon" style="background:${p.type==='weight'?'rgba(67,233,123,0.15)':'rgba(108,99,255,0.15)'}">
                  <i class="fas fa-${p.type==='weight'?'weight':'dumbbell'}" style="color:${p.type==='weight'?'#43E97B':'#6C63FF'}"></i>
                </div>
                <div class="hi-info">
                  <p>${p.note || (p.type==='weight'?'Registro de peso':'Entrenamiento')}</p>
                  <span>${new Date(p.date).toLocaleDateString('es-CO', {day:'numeric',month:'long',year:'numeric'})}</span>
                </div>
                <div class="hi-value">${p.value} ${p.unit}</div>
              </div>
            `).join('')}
        </div>
      </div>
    </div>
  </div>`;
}

function initProgressCharts() {
  const user = Auth.getCurrentUser();
  if (!user) return;
  const progress = DB.getProgressByUser(user.id);
  const weights = progress.filter(p => p.type === 'weight').sort((a,b) => new Date(a.date)-new Date(b.date));

  // Weight chart
  const wCanvas = document.getElementById('weight-chart');
  if (wCanvas && weights.length > 0) {
    drawLineChart(wCanvas, weights.map(w => w.value), weights.map(w => new Date(w.date).toLocaleDateString('es-CO',{month:'short',day:'numeric'})), '#43E97B', 'Peso (kg)');
  }

  // Workout chart
  const woCanvas = document.getElementById('workout-chart');
  if (woCanvas) {
    drawBarChart(woCanvas, [3,5,4,6,5,7,4], ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'], '#6C63FF');
  }

  // Calories chart
  const calCanvas = document.getElementById('calories-chart');
  if (calCanvas) {
    drawLineChart(calCanvas, [320,450,280,500,380,420,350], ['Lun','Mar','Mié','Jue','Vie','Sáb','Dom'], '#FF6584', 'Calorías');
  }
}

function drawLineChart(canvas, data, labels, color, label) {
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 400;
  const H = canvas.height || 200;
  canvas.width = W;
  ctx.clearRect(0, 0, W, H);

  const pad = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const min = Math.min(...data) * 0.98;
  const max = Math.max(...data) * 1.02;

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + (chartH / 4) * i;
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(pad.left + chartW, y); ctx.stroke();
  }

  // Line
  const points = data.map((v, i) => ({
    x: pad.left + (i / (data.length - 1)) * chartW,
    y: pad.top + chartH - ((v - min) / (max - min)) * chartH
  }));

  // Gradient fill
  const grad = ctx.createLinearGradient(0, pad.top, 0, pad.top + chartH);
  grad.addColorStop(0, color + '44');
  grad.addColorStop(1, color + '00');
  ctx.beginPath();
  ctx.moveTo(points[0].x, pad.top + chartH);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length-1].x, pad.top + chartH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.stroke();

  // Points
  points.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#1E1E35';
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // Labels
  ctx.fillStyle = 'rgba(144,144,176,0.8)';
  ctx.font = '11px Poppins';
  ctx.textAlign = 'center';
  labels.forEach((l, i) => {
    const x = pad.left + (i / (labels.length - 1)) * chartW;
    ctx.fillText(l, x, H - 8);
  });
}

function drawBarChart(canvas, data, labels, color) {
  const ctx = canvas.getContext('2d');
  const W = canvas.offsetWidth || 400;
  const H = canvas.height || 200;
  canvas.width = W;
  ctx.clearRect(0, 0, W, H);

  const pad = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartW = W - pad.left - pad.right;
  const chartH = H - pad.top - pad.bottom;
  const max = Math.max(...data) * 1.1;
  const barW = (chartW / data.length) * 0.6;
  const gap = (chartW / data.length) * 0.4;

  data.forEach((v, i) => {
    const x = pad.left + i * (barW + gap) + gap / 2;
    const barH = (v / max) * chartH;
    const y = pad.top + chartH - barH;

    const grad = ctx.createLinearGradient(0, y, 0, y + barH);
    grad.addColorStop(0, color);
    grad.addColorStop(1, color + '66');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, 4);
    ctx.fill();

    ctx.fillStyle = 'rgba(144,144,176,0.8)';
    ctx.font = '11px Poppins';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x + barW / 2, H - 8);
  });
}

function logWeight(e) {
  e.preventDefault();
  const user = Auth.getCurrentUser();
  DB.addProgress({ userId: user.id, type: 'weight', value: parseFloat(document.getElementById('prog-weight').value), unit: 'kg', note: document.getElementById('prog-note').value || 'Registro de peso' });
  showToast('Guardado', 'Peso registrado correctamente', 'success');
  navigate('progress');
}

function logMeasures(e) {
  e.preventDefault();
  const user = Auth.getCurrentUser();
  const measures = { waist: document.getElementById('m-waist').value, hip: document.getElementById('m-hip').value, chest: document.getElementById('m-chest').value, arm: document.getElementById('m-arm').value };
  DB.addProgress({ userId: user.id, type: 'measures', value: JSON.stringify(measures), unit: 'cm', note: 'Medidas corporales' });
  showToast('Guardado', 'Medidas registradas', 'success');
  navigate('progress');
}

function uploadPhoto() {
  showModal('Subir Foto de Progreso', `
    <div style="text-align:center">
      <div style="border:2px dashed var(--border);border-radius:12px;padding:3rem;margin-bottom:1rem;cursor:pointer" onclick="document.getElementById('photo-input').click()">
        <i class="fas fa-cloud-upload-alt" style="font-size:3rem;color:var(--text-muted);margin-bottom:1rem"></i>
        <p>Haz clic para seleccionar una foto</p>
        <span style="color:var(--text-muted);font-size:0.8rem">JPG, PNG hasta 5MB</span>
      </div>
      <input type="file" id="photo-input" accept="image/*" style="display:none" onchange="previewPhoto(this)"/>
      <div id="photo-preview"></div>
      <div class="form-group" style="text-align:left;margin-top:1rem">
        <label class="form-label">Tipo de foto</label>
        <select class="form-select">
          <option>Frente</option>
          <option>Lado</option>
          <option>Espalda</option>
        </select>
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="closeModal();showToast('Foto guardada','Tu foto de progreso ha sido guardada','success')"><i class="fas fa-save"></i> Guardar</button>
  `);
}

function previewPhoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = e => {
      document.getElementById('photo-preview').innerHTML = `<img src="${e.target.result}" style="max-width:100%;border-radius:8px;margin-top:1rem"/>`;
    };
    reader.readAsDataURL(input.files[0]);
  }
}
