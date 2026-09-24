// ===== ROUTINES PAGE =====
function renderRoutines(user, params = {}) {
  const allRoutines = DB.getRoutines().filter(r => r.isPublic || r.userId === user.id);
  return `
  <div class="page">
    <div class="section-header">
      <h1 class="section-title"><i class="fas fa-dumbbell"></i> Rutinas de Entrenamiento</h1>
      <p class="section-subtitle">Encuentra la rutina perfecta para tu espacio, nivel y objetivo</p>
    </div>

    <!-- FILTROS -->
    <div class="filters-bar" id="filters-bar">
      <div class="filter-group">
        <label>Espacio</label>
        <div class="filter-btns" id="filter-space">
          <button class="filter-btn ${!params.space?'active':''}" onclick="filterRoutines('space','all')">Todos</button>
          <button class="filter-btn ${params.space==='gym'?'active':''}" onclick="filterRoutines('space','gym')"><i class="fas fa-dumbbell"></i> Gym</button>
          <button class="filter-btn ${params.space==='park'?'active':''}" onclick="filterRoutines('space','park')"><i class="fas fa-tree"></i> Parque</button>
          <button class="filter-btn ${params.space==='home'?'active':''}" onclick="filterRoutines('space','home')"><i class="fas fa-home"></i> Casa</button>
        </div>
      </div>
      <div class="filter-group">
        <label>Nivel</label>
        <div class="filter-btns" id="filter-level">
          <button class="filter-btn active" onclick="filterRoutines('level','all')">Todos</button>
          <button class="filter-btn" onclick="filterRoutines('level','beginner')">Principiante</button>
          <button class="filter-btn" onclick="filterRoutines('level','intermediate')">Intermedio</button>
          <button class="filter-btn" onclick="filterRoutines('level','advanced')">Avanzado</button>
        </div>
      </div>
      <div class="filter-group">
        <label>Categoría</label>
        <div class="filter-btns" id="filter-cat">
          <button class="filter-btn active" onclick="filterRoutines('cat','all')">Todas</button>
          <button class="filter-btn" onclick="filterRoutines('cat','hiit')">HIIT</button>
          <button class="filter-btn" onclick="filterRoutines('cat','strength')">Fuerza</button>
          <button class="filter-btn" onclick="filterRoutines('cat','cardio')">Cardio</button>
          <button class="filter-btn" onclick="filterRoutines('cat','flexibility')">Flexibilidad</button>
          <button class="filter-btn" onclick="filterRoutines('cat','calisthenics')">Calistenia</button>
        </div>
      </div>
      <div class="filter-group">
        <label>Población</label>
        <div class="filter-btns" id="filter-pop">
          <button class="filter-btn active" onclick="filterRoutines('pop','all')">Todas</button>
          <button class="filter-btn" onclick="filterRoutines('pop','adulto_mayor')">Adulto Mayor</button>
          <button class="filter-btn" onclick="filterRoutines('pop','embarazada')">Embarazada</button>
          <button class="filter-btn" onclick="filterRoutines('pop','joven')">Joven</button>
        </div>
      </div>
    </div>

    <!-- BUSCADOR -->
    <div class="search-bar" style="margin-bottom:1.5rem">
      <div style="position:relative">
        <i class="fas fa-search" style="position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--text-muted)"></i>
        <input type="text" id="routine-search" class="form-control" style="padding-left:2.75rem" placeholder="Buscar rutinas..." oninput="searchRoutines(this.value)"/>
      </div>
    </div>

    <!-- BOTÓN CREAR -->
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem">
      <p id="routines-count" style="color:var(--text-muted);font-size:0.9rem">${allRoutines.length} rutinas disponibles</p>
      <button class="btn btn-primary" onclick="showCreateRoutineModal()"><i class="fas fa-plus"></i> Crear Rutina</button>
    </div>

    <!-- GRID DE RUTINAS -->
    <div class="grid-auto" id="routines-grid">
      ${allRoutines.map(r => renderRoutineCard(r, user)).join('')}
    </div>
  </div>`;
}

function renderRoutineCard(r, user) {
  const spaceColors = { gym: '#FF6584', park: '#43E97B', home: '#6C63FF' };
  const spaceIcons = { gym: 'dumbbell', park: 'tree', home: 'home' };
  const catIcons = { hiit: 'bolt', strength: 'fist-raised', cardio: 'heartbeat', flexibility: 'spa', calisthenics: 'child', prenatal: 'heart' };
  const color = spaceColors[r.space] || '#6C63FF';
  const icon = spaceIcons[r.space] || 'dumbbell';
  const catIcon = catIcons[r.category] || 'dumbbell';
  const pops = Array.isArray(r.population) ? r.population : [r.population];

  return `
  <div class="routine-card" data-space="${r.space}" data-level="${r.level}" data-cat="${r.category}" data-pop="${pops.join(',')}" data-name="${r.name.toLowerCase()}">
    <div class="rc-header" style="background:linear-gradient(135deg,${color}22,${color}11);border-bottom:2px solid ${color}33">
      <div class="rc-icon" style="background:${color}22;color:${color}">
        <i class="fas fa-${icon}"></i>
      </div>
      <div class="rc-badges">
        ${getSpaceBadge(r.space)}
        ${getLevelBadge(r.level)}
      </div>
    </div>
    <div class="rc-body">
      <h3 class="rc-title">${r.name}</h3>
      <p class="rc-desc">${r.description}</p>
      <div class="rc-meta">
        <span><i class="fas fa-clock"></i> ${r.duration} min</span>
        <span><i class="fas fa-fire"></i> ${r.calories} kcal</span>
        <span><i class="fas fa-${catIcon}"></i> ${r.category}</span>
      </div>
      <div class="rc-populations">
        ${pops.map(p => `<span class="pop-tag">${getPopulationLabel(p)}</span>`).join('')}
      </div>
      <div class="rc-exercises">
        <i class="fas fa-list"></i> ${r.exercises?.length || 0} ejercicios
      </div>
    </div>
    <div class="rc-footer">
      <button class="btn btn-secondary btn-sm" onclick="openRoutineDetailFull('${r.id}')"><i class="fas fa-eye"></i> Ver</button>
      <button class="btn btn-primary btn-sm" onclick="startWorkout('${r.id}')"><i class="fas fa-play"></i> Iniciar</button>
    </div>
  </div>`;
}

let activeFilters = { space: 'all', level: 'all', cat: 'all', pop: 'all' };

function filterRoutines(type, value) {
  activeFilters[type] = value;
  // Actualizar botones activos
  const groupMap = { space: 'filter-space', level: 'filter-level', cat: 'filter-cat', pop: 'filter-pop' };
  const group = document.getElementById(groupMap[type]);
  if (group) {
    group.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
  }
  applyFilters();
}

function applyFilters() {
  const cards = document.querySelectorAll('.routine-card');
  let visible = 0;
  cards.forEach(card => {
    const space = card.dataset.space;
    const level = card.dataset.level;
    const cat = card.dataset.cat;
    const pop = card.dataset.pop;
    const name = card.dataset.name;
    const search = document.getElementById('routine-search')?.value.toLowerCase() || '';

    const matchSpace = activeFilters.space === 'all' || space === activeFilters.space;
    const matchLevel = activeFilters.level === 'all' || level === activeFilters.level;
    const matchCat = activeFilters.cat === 'all' || cat === activeFilters.cat;
    const matchPop = activeFilters.pop === 'all' || pop.includes(activeFilters.pop);
    const matchSearch = !search || name.includes(search);

    if (matchSpace && matchLevel && matchCat && matchPop && matchSearch) {
      card.style.display = 'block'; visible++;
    } else {
      card.style.display = 'none';
    }
  });
  const countEl = document.getElementById('routines-count');
  if (countEl) countEl.textContent = `${visible} rutinas encontradas`;
}

function searchRoutines(val) { applyFilters(); }

function showCreateRoutineModal() {
  showModal('Crear Nueva Rutina', `
    <form id="create-routine-form">
      <div class="form-group">
        <label class="form-label">Nombre de la rutina</label>
        <input type="text" id="cr-name" class="form-control" placeholder="Ej: HIIT Mañanero" required/>
      </div>
      <div class="form-group">
        <label class="form-label">Descripción</label>
        <textarea id="cr-desc" class="form-control" rows="2" placeholder="Describe tu rutina..."></textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Espacio</label>
          <select id="cr-space" class="form-select">
            <option value="gym">Gimnasio</option>
            <option value="park">Parque</option>
            <option value="home">Casa</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Nivel</label>
          <select id="cr-level" class="form-select">
            <option value="beginner">Principiante</option>
            <option value="intermediate">Intermedio</option>
            <option value="advanced">Avanzado</option>
          </select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Duración (min)</label>
          <input type="number" id="cr-duration" class="form-control" value="45" min="10" max="180"/>
        </div>
        <div class="form-group">
          <label class="form-label">Calorías aprox.</label>
          <input type="number" id="cr-calories" class="form-control" value="300" min="50" max="1000"/>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Categoría</label>
        <select id="cr-cat" class="form-select">
          <option value="hiit">HIIT</option>
          <option value="strength">Fuerza</option>
          <option value="cardio">Cardio</option>
          <option value="flexibility">Flexibilidad</option>
          <option value="calisthenics">Calistenia</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Población objetivo</label>
        <select id="cr-pop" class="form-select">
          <option value="general">General</option>
          <option value="joven">Joven</option>
          <option value="adulto">Adulto</option>
          <option value="adulto_mayor">Adulto Mayor</option>
          <option value="embarazada">Embarazada</option>
        </select>
      </div>
    </form>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cancelar</button>
    <button class="btn btn-primary" onclick="saveNewRoutine()"><i class="fas fa-save"></i> Guardar</button>
  `);
}

function saveNewRoutine() {
  const user = Auth.getCurrentUser();
  const name = document.getElementById('cr-name').value;
  if (!name) { showToast('Error', 'El nombre es requerido', 'error'); return; }
  DB.createRoutine({
    name, description: document.getElementById('cr-desc').value,
    space: document.getElementById('cr-space').value,
    level: document.getElementById('cr-level').value,
    duration: parseInt(document.getElementById('cr-duration').value),
    calories: parseInt(document.getElementById('cr-calories').value),
    category: document.getElementById('cr-cat').value,
    population: [document.getElementById('cr-pop').value],
    userId: user.id, isPublic: false, exercises: []
  });
  closeModal();
  showToast('¡Rutina creada!', 'Tu rutina ha sido guardada', 'success');
  navigate('routines');
}

// ============================================================
// DETALLE DE RUTINA CON VIDEOS — desde página de rutinas
// ============================================================
function openRoutineDetailFull(routineId) {
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
      <h4 style="margin-bottom:1rem;font-size:0.95rem">
        <i class="fas fa-list" style="color:var(--primary)"></i>
        Ejercicios (${routine.exercises?.length || 0})
        <span style="font-size:0.75rem;color:var(--text-muted);font-weight:400;margin-left:0.5rem">
          — Haz clic en <i class="fab fa-youtube" style="color:#FF4444"></i> para ver el video
        </span>
      </h4>
      <div style="display:flex;flex-direction:column;gap:0.75rem">
        ${(routine.exercises || []).map((ex, i) => `
          <div style="display:flex;align-items:center;gap:1rem;padding:0.75rem;background:var(--card-bg2);border-radius:8px">
            <div style="width:32px;height:32px;border-radius:50%;background:var(--gradient-main);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;color:white;flex-shrink:0">${i + 1}</div>
            <div style="flex:1">
              <p style="font-weight:600;font-size:0.9rem">${ex.name}</p>
              <span style="color:var(--text-muted);font-size:0.8rem">
                ${ex.sets} series · ${ex.reps ? ex.reps + ' reps' : ex.duration} · Descanso: ${ex.rest}s
                <span style="margin-left:0.5rem;background:rgba(108,99,255,0.15);color:var(--primary);padding:1px 6px;border-radius:4px;font-size:0.72rem">${ex.muscle}</span>
              </span>
            </div>
            ${ex.videoId ? `
              <button onclick="showExerciseVideo('${ex.videoId}','${ex.name.replace(/'/g,'')}')"
                style="background:rgba(255,0,0,0.12);color:#FF4444;border:1px solid rgba(255,0,0,0.25);flex-shrink:0;display:flex;align-items:center;gap:0.4rem;padding:0.4rem 0.8rem;border-radius:6px;font-size:0.8rem;font-weight:600;cursor:pointer;transition:all 0.2s"
                onmouseover="this.style.background='rgba(255,0,0,0.25)'"
                onmouseout="this.style.background='rgba(255,0,0,0.12)'">
                <i class="fab fa-youtube"></i> Ver
              </button>
            ` : `<span style="font-size:0.75rem;color:var(--text-muted);flex-shrink:0">Sin video</span>`}
          </div>
        `).join('')}
      </div>
    </div>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-primary" onclick="closeModal();startWorkout('${routine.id}')"><i class="fas fa-play"></i> Iniciar rutina</button>
  `);
}
