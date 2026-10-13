// ===== NUTRITION PAGE =====
function renderNutrition(user) {
  const logs = DB.getNutritionByUser(user.id);
  const plans = getNutritionPlans(user);

  return `
  <div class="page">
    <div class="section-header">
      <h1 class="section-title"><i class="fas fa-apple-alt"></i> Nutrición</h1>
      <p class="section-subtitle">Planes alimenticios personalizados para alcanzar tus metas</p>
    </div>

    <div class="tabs">
      <button class="tab-btn active" onclick="switchTab('tab-plans','nutrition')">Planes</button>
      <button class="tab-btn" onclick="switchTab('tab-log','nutrition')">Registro Diario</button>
      <button class="tab-btn" onclick="switchTab('tab-calculator','nutrition')">Calculadora</button>
      <button class="tab-btn" onclick="switchTab('tab-recipes','nutrition')">Recetas</button>
    </div>

    <!-- PLANES -->
    <div id="tab-plans" class="tab-content active">
      <div class="grid-auto">
        ${plans.map(p => `
          <div class="nutrition-card">
            <div class="nc-header" style="background:${p.color}22;border-bottom:2px solid ${p.color}44">
              <div class="nc-icon" style="background:${p.color}22;color:${p.color}"><i class="${p.icon}"></i></div>
              <span class="badge" style="background:${p.color}22;color:${p.color}">${p.tag}</span>
            </div>
            <div class="nc-body">
              <h3>${p.name}</h3>
              <p>${p.description}</p>
              <div class="nc-macros">
                <div class="macro"><span>${p.calories}</span><small>kcal/día</small></div>
                <div class="macro"><span>${p.protein}g</span><small>Proteína</small></div>
                <div class="macro"><span>${p.carbs}g</span><small>Carbos</small></div>
                <div class="macro"><span>${p.fat}g</span><small>Grasas</small></div>
              </div>
              <div class="nc-populations">
                ${p.populations.map(pop => `<span class="pop-tag">${getPopulationLabel(pop)}</span>`).join('')}
              </div>
            </div>
            <div class="nc-footer">
              <button class="btn btn-primary btn-block" onclick="viewNutritionPlan('${p.id}')"><i class="fas fa-eye"></i> Ver Plan Completo</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- REGISTRO DIARIO -->
    <div id="tab-log" class="tab-content">
      <div class="grid-2">
        <div class="card">
          <div class="card-header"><h3 class="card-title">Registrar comida</h3></div>
          <form onsubmit="logFood(event)">
            <div class="form-group">
              <label class="form-label">Comida</label>
              <select id="meal-type" class="form-select">
                <option value="desayuno">Desayuno</option>
                <option value="almuerzo">Almuerzo</option>
                <option value="cena">Cena</option>
                <option value="snack">Snack</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Alimento</label>
              <input type="text" id="food-name" class="form-control" placeholder="Ej: Arroz con pollo" required/>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">Calorías</label>
                <input type="number" id="food-cal" class="form-control" placeholder="350" min="0"/>
              </div>
              <div class="form-group">
                <label class="form-label">Proteína (g)</label>
                <input type="number" id="food-protein" class="form-control" placeholder="25" min="0"/>
              </div>
            </div>
            <button type="submit" class="btn btn-primary btn-block"><i class="fas fa-plus"></i> Registrar</button>
          </form>
        </div>
        <div class="card">
          <div class="card-header"><h3 class="card-title">Hoy</h3></div>
          <div class="daily-summary">
            <div class="ds-circle">
              <div class="ds-value">${logs.filter(l => l.date && l.date.startsWith(new Date().toISOString().split('T')[0])).reduce((s,l) => s+(l.calories||0), 0)}</div>
              <div class="ds-label">kcal hoy</div>
            </div>
            <div class="ds-macros">
              <div class="ds-macro"><span>Proteína</span><div class="progress-bar"><div class="progress-fill" style="width:65%"></div></div><small>65%</small></div>
              <div class="ds-macro"><span>Carbos</span><div class="progress-bar"><div class="progress-fill orange" style="width:45%"></div></div><small>45%</small></div>
              <div class="ds-macro"><span>Grasas</span><div class="progress-bar"><div class="progress-fill green" style="width:55%"></div></div><small>55%</small></div>
            </div>
          </div>
          <div id="food-log-list" style="margin-top:1rem">
            ${logs.slice(-5).reverse().map(l => `
              <div class="food-log-item">
                <div class="fli-icon"><i class="fas fa-utensils"></i></div>
                <div class="fli-info"><p>${l.food}</p><span>${l.mealType} · ${l.calories || 0} kcal</span></div>
              </div>
            `).join('') || '<p style="color:var(--text-muted);font-size:0.85rem;text-align:center;padding:1rem">Sin registros hoy</p>'}
          </div>
        </div>
      </div>
    </div>

    <!-- CALCULADORA -->
    <div id="tab-calculator" class="tab-content">
      <div class="card" style="max-width:600px;margin:0 auto">
        <div class="card-header"><h3 class="card-title"><i class="fas fa-calculator"></i> Calculadora de Calorías (TMB)</h3></div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Peso (kg)</label>
            <input type="number" id="calc-weight" class="form-control" value="${user.weight || 70}"/>
          </div>
          <div class="form-group">
            <label class="form-label">Altura (cm)</label>
            <input type="number" id="calc-height" class="form-control" value="${user.height || 170}"/>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Edad</label>
            <input type="number" id="calc-age" class="form-control" value="${user.age || 25}"/>
          </div>
          <div class="form-group">
            <label class="form-label">Género</label>
            <select id="calc-gender" class="form-select">
              <option value="male" ${user.gender==='male'?'selected':''}>Masculino</option>
              <option value="female" ${user.gender==='female'?'selected':''}>Femenino</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Nivel de actividad</label>
          <select id="calc-activity" class="form-select">
            <option value="1.2">Sedentario (sin ejercicio)</option>
            <option value="1.375">Ligero (1-3 días/semana)</option>
            <option value="1.55" selected>Moderado (3-5 días/semana)</option>
            <option value="1.725">Activo (6-7 días/semana)</option>
            <option value="1.9">Muy activo (2x/día)</option>
          </select>
        </div>
        <button class="btn btn-primary btn-block" onclick="calculateTMB()"><i class="fas fa-calculator"></i> Calcular</button>
        <div id="tmb-result" style="margin-top:1.5rem;display:none">
          <div class="tmb-cards">
            <div class="tmb-card"><span id="tmb-base">0</span><small>TMB (kcal base)</small></div>
            <div class="tmb-card"><span id="tmb-total">0</span><small>TDEE (kcal/día)</small></div>
            <div class="tmb-card"><span id="tmb-deficit">0</span><small>Déficit (-500)</small></div>
            <div class="tmb-card"><span id="tmb-surplus">0</span><small>Superávit (+300)</small></div>
          </div>
        </div>
      </div>
    </div>

    <!-- RECETAS -->
    <div id="tab-recipes" class="tab-content">
      <div class="grid-auto">
        ${getRecipes().map(r => `
          <div class="recipe-card" onclick="viewRecipe('${r.id}')">
            <div class="recipe-emoji">${r.emoji}</div>
            <h3>${r.name}</h3>
            <p>${r.description}</p>
            <div class="recipe-meta">
              <span><i class="fas fa-fire"></i> ${r.calories} kcal</span>
              <span><i class="fas fa-clock"></i> ${r.time} min</span>
              <span class="badge badge-${r.type==='proteico'?'danger':r.type==='vegano'?'success':'warning'}">${r.type}</span>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  </div>`;
}

function switchTab(tabId, page) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

function logFood(e) {
  e.preventDefault();
  const user = Auth.getCurrentUser();
  DB.addNutritionLog({
    userId: user.id,
    mealType: document.getElementById('meal-type').value,
    food: document.getElementById('food-name').value,
    calories: parseInt(document.getElementById('food-cal').value) || 0,
    protein: parseInt(document.getElementById('food-protein').value) || 0
  });
  showToast('Registrado', 'Alimento agregado al diario', 'success');
  navigate('nutrition');
}

function calculateTMB() {
  const w = parseFloat(document.getElementById('calc-weight').value);
  const h = parseFloat(document.getElementById('calc-height').value);
  const a = parseFloat(document.getElementById('calc-age').value);
  const g = document.getElementById('calc-gender').value;
  const act = parseFloat(document.getElementById('calc-activity').value);
  let tmb = g === 'male' ? (10*w + 6.25*h - 5*a + 5) : (10*w + 6.25*h - 5*a - 161);
  const tdee = Math.round(tmb * act);
  document.getElementById('tmb-base').textContent = Math.round(tmb);
  document.getElementById('tmb-total').textContent = tdee;
  document.getElementById('tmb-deficit').textContent = tdee - 500;
  document.getElementById('tmb-surplus').textContent = tdee + 300;
  document.getElementById('tmb-result').style.display = 'block';
}

function getNutritionPlans(user) {
  return [
    { id:'p1', name:'Pérdida de Peso', description:'Plan hipocalórico equilibrado para perder grasa de forma saludable', icon:'fas fa-weight', color:'#FF6584', tag:'Déficit calórico', calories:1600, protein:130, carbs:160, fat:55, populations:['general','adulto'] },
    { id:'p2', name:'Ganancia Muscular', description:'Plan hiperproteico para maximizar la ganancia de masa muscular', icon:'fas fa-dumbbell', color:'#6C63FF', tag:'Superávit', calories:2800, protein:200, carbs:320, fat:80, populations:['general','joven'] },
    { id:'p3', name:'Mantenimiento', description:'Plan equilibrado para mantener tu peso y composición corporal', icon:'fas fa-balance-scale', color:'#43E97B', tag:'Equilibrado', calories:2200, protein:150, carbs:250, fat:70, populations:['general','adulto'] },
    { id:'p4', name:'Adulto Mayor', description:'Plan adaptado con nutrientes esenciales para mayores de 60 años', icon:'fas fa-heart', color:'#38BDF8', tag:'Especial', calories:1800, protein:100, carbs:220, fat:60, populations:['adulto_mayor'] },
    { id:'p5', name:'Prenatal', description:'Nutrición segura y completa durante el embarazo', icon:'fas fa-baby', color:'#EC4899', tag:'Embarazo', calories:2100, protein:120, carbs:260, fat:70, populations:['embarazada'] },
    { id:'p6', name:'Vegano Fitness', description:'Plan 100% vegetal con todos los nutrientes para el rendimiento', icon:'fas fa-leaf', color:'#43E97B', tag:'Vegano', calories:2000, protein:110, carbs:280, fat:65, populations:['general','joven','adulto'] }
  ];
}

function getRecipes() {
  return [
    { id:'r1', name:'Bowl de Proteína', emoji:'🥗', description:'Arroz integral, pollo a la plancha, aguacate y vegetales', calories:520, time:20, type:'proteico' },
    { id:'r2', name:'Smoothie Verde', emoji:'🥤', description:'Espinaca, plátano, proteína en polvo y leche de almendras', calories:280, time:5, type:'vegano' },
    { id:'r3', name:'Avena Overnight', emoji:'🥣', description:'Avena, chía, frutas rojas y miel. Prepara la noche anterior', calories:380, time:5, type:'carbos' },
    { id:'r4', name:'Salmón al Horno', emoji:'🐟', description:'Salmón con limón, espárragos y batata al horno', calories:450, time:30, type:'proteico' },
    { id:'r5', name:'Tortilla de Claras', emoji:'🍳', description:'Claras de huevo, espinaca, tomate y queso bajo en grasa', calories:220, time:10, type:'proteico' },
    { id:'r6', name:'Ensalada Quinoa', emoji:'🥙', description:'Quinoa, garbanzos, pepino, tomate y aderezo de limón', calories:340, time:15, type:'vegano' }
  ];
}

function viewNutritionPlan(id) {
  const plans = getNutritionPlans({});
  const plan = plans.find(p => p.id === id);
  if (!plan) return;
  showModal(plan.name, `
    <div>
      <p style="color:var(--text-muted);margin-bottom:1.5rem">${plan.description}</p>
      <div class="tmb-cards" style="margin-bottom:1.5rem">
        <div class="tmb-card"><span>${plan.calories}</span><small>kcal/día</small></div>
        <div class="tmb-card"><span>${plan.protein}g</span><small>Proteína</small></div>
        <div class="tmb-card"><span>${plan.carbs}g</span><small>Carbos</small></div>
        <div class="tmb-card"><span>${plan.fat}g</span><small>Grasas</small></div>
      </div>
      <h4 style="margin-bottom:1rem">Ejemplo de menú diario</h4>
      <div style="display:flex;flex-direction:column;gap:0.75rem">
        ${['🌅 Desayuno: Avena con frutas y proteína (400 kcal)',
           '🌞 Almuerzo: Arroz integral, proteína magra y ensalada (600 kcal)',
           '🌆 Merienda: Fruta y nueces (200 kcal)',
           '🌙 Cena: Proteína a la plancha con vegetales (400 kcal)'].map(m => `
          <div style="padding:0.75rem;background:var(--card-bg2);border-radius:8px;font-size:0.9rem">${m}</div>
        `).join('')}
      </div>
    </div>
  `, `<button class="btn btn-primary" onclick="closeModal()"><i class="fas fa-check"></i> Adoptar Plan</button>`);
}

function viewRecipe(id) {
  const recipe = getRecipes().find(r => r.id === id);
  if (!recipe) return;
  showModal(`${recipe.emoji} ${recipe.name}`, `
    <p style="color:var(--text-muted);margin-bottom:1rem">${recipe.description}</p>
    <div style="display:flex;gap:1rem;margin-bottom:1.5rem">
      <span class="badge badge-warning"><i class="fas fa-fire"></i> ${recipe.calories} kcal</span>
      <span class="badge badge-info"><i class="fas fa-clock"></i> ${recipe.time} min</span>
    </div>
    <h4 style="margin-bottom:0.75rem">Preparación</h4>
    <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.6">
      1. Prepara todos los ingredientes.<br>
      2. Cocina según las instrucciones del ingrediente principal.<br>
      3. Combina todos los ingredientes.<br>
      4. Sazona al gusto y sirve inmediatamente.
    </p>
  `, `<button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>`);
}
