// ===== LEARN PAGE — EVOLUTION FIT =====

const LEARN_ARTICLES = [
  {
    id: 'l1',
    category: 'nutricion',
    icon: 'fas fa-apple-alt',
    color: '#43E97B',
    title: 'Macronutrientes: qué son y cómo usarlos',
    summary: 'Proteínas, carbohidratos y grasas: aprende a distribuirlos según tu objetivo de entrenamiento.',
    readTime: 5,
    content: `Los macronutrientes son los tres pilares de la nutrición deportiva. Las proteínas (4 kcal/g) reparan y construyen músculo — apunta a 1.6–2.2 g por kg de peso corporal. Los carbohidratos (4 kcal/g) son tu combustible principal; consúmelos antes y después del entrenamiento. Las grasas saludables (9 kcal/g) regulan hormonas y absorben vitaminas. Una distribución típica para ganancia muscular es 40% carbs / 30% proteína / 30% grasa.`
  },
  {
    id: 'l2',
    category: 'entrenamiento',
    icon: 'fas fa-dumbbell',
    color: '#6C63FF',
    title: 'Principios del entrenamiento de fuerza',
    summary: 'Progresión de carga, volumen y frecuencia: los tres pilares para ganar músculo de forma sostenida.',
    readTime: 7,
    content: `La progresión de carga es el principio más importante: debes aumentar el estímulo gradualmente (más peso, más reps o menos descanso). El volumen semanal óptimo por grupo muscular es de 10–20 series. La frecuencia ideal es entrenar cada músculo 2 veces por semana. El descanso entre series para hipertrofia es de 60–90 segundos. Recuerda: la técnica correcta siempre va antes que el peso.`
  },
  {
    id: 'l3',
    category: 'recuperacion',
    icon: 'fas fa-bed',
    color: '#38BDF8',
    title: 'La importancia del sueño en el rendimiento',
    summary: 'Dormir bien no es opcional: el 80% de la recuperación muscular ocurre durante el sueño profundo.',
    readTime: 4,
    content: `Durante el sueño profundo (fase REM), el cuerpo libera hormona de crecimiento y repara el tejido muscular dañado. Dormir menos de 7 horas reduce la síntesis proteica hasta un 18% y aumenta el cortisol (hormona del estrés). Recomendaciones: mantén un horario fijo, evita pantallas 1 hora antes de dormir, y mantén la habitación fresca (18–20°C). La siesta de 20 minutos también mejora el rendimiento cognitivo y físico.`
  },
  {
    id: 'l4',
    category: 'nutricion',
    icon: 'fas fa-tint',
    color: '#F7971E',
    title: 'Hidratación y rendimiento deportivo',
    summary: 'Una deshidratación del 2% reduce tu rendimiento hasta un 20%. Aprende cuándo y cuánto beber.',
    readTime: 3,
    content: `El agua regula la temperatura corporal, transporta nutrientes y lubrica las articulaciones. Antes del ejercicio: bebe 500 ml en las 2 horas previas. Durante: 150–250 ml cada 15–20 minutos. Después: repón el 150% del peso perdido en sudor. Para sesiones de más de 60 minutos, considera bebidas con electrolitos (sodio, potasio). La orina de color amarillo claro indica buena hidratación.`
  },
  {
    id: 'l5',
    category: 'entrenamiento',
    icon: 'fas fa-heartbeat',
    color: '#FF6584',
    title: 'HIIT vs Cardio Moderado: ¿cuál elegir?',
    summary: 'Ambos tienen su lugar en un programa de entrenamiento. Descubre cuándo usar cada uno.',
    readTime: 6,
    content: `El HIIT (High Intensity Interval Training) quema más calorías en menos tiempo y genera un efecto EPOC (consumo de oxígeno post-ejercicio) que mantiene el metabolismo elevado hasta 24 horas. El cardio moderado (60–70% FCmax) es ideal para recuperación activa, principiantes y personas con condiciones articulares. Recomendación: 2 sesiones de HIIT + 1–2 de cardio moderado por semana para resultados óptimos.`
  },
  {
    id: 'l6',
    category: 'bienestar',
    icon: 'fas fa-brain',
    color: '#A855F7',
    title: 'Mindfulness y ejercicio: la conexión mente-cuerpo',
    summary: 'Entrenar con atención plena mejora la técnica, reduce lesiones y aumenta la motivación a largo plazo.',
    readTime: 5,
    content: `La conexión mente-músculo (mind-muscle connection) puede aumentar la activación muscular hasta un 22% según estudios de electromiografía. Practica: antes de cada serie, visualiza el músculo que vas a trabajar. Durante el movimiento, enfócate en la contracción y no en el peso. Incorpora 5 minutos de respiración diafragmática antes de entrenar para reducir el cortisol y mejorar el enfoque.`
  }
];

const LEARN_CATEGORIES = [
  { id: 'all',          label: 'Todo',          icon: 'fas fa-th' },
  { id: 'entrenamiento', label: 'Entrenamiento', icon: 'fas fa-dumbbell' },
  { id: 'nutricion',    label: 'Nutrición',      icon: 'fas fa-apple-alt' },
  { id: 'recuperacion', label: 'Recuperación',   icon: 'fas fa-bed' },
  { id: 'bienestar',    label: 'Bienestar',      icon: 'fas fa-brain' }
];

let learnActiveCategory = 'all';

function renderLearn(user) {
  return `
  <div class="page">
    <div class="section-header">
      <div>
        <h1 class="section-title"><i class="fas fa-book-open" style="color:#38BDF8"></i> Aprende</h1>
        <p class="section-subtitle">Conocimiento basado en evidencia para potenciar tu entrenamiento</p>
      </div>
    </div>

    <!-- CATEGORÍAS -->
    <div class="filters-bar" style="margin-bottom:1.5rem">
      <div class="filter-group">
        <label class="form-label" style="min-width:auto">Categoría:</label>
        <div class="filter-btns" id="learn-category-btns">
          ${LEARN_CATEGORIES.map(c => `
            <button class="filter-btn ${c.id === 'all' ? 'active' : ''}"
                    onclick="filterLearnCategory('${c.id}', this)">
              <i class="${c.icon}"></i> ${c.label}
            </button>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- ARTÍCULOS -->
    <div class="grid-3" id="learn-articles-grid">
      ${renderLearnArticles('all')}
    </div>
  </div>`;
}

function renderLearnArticles(category) {
  const filtered = category === 'all'
    ? LEARN_ARTICLES
    : LEARN_ARTICLES.filter(a => a.category === category);

  if (filtered.length === 0) {
    return `<div class="empty-state" style="grid-column:1/-1;padding:3rem">
      <i class="fas fa-book-open"></i>
      <h3>Sin artículos en esta categoría</h3>
    </div>`;
  }

  return filtered.map(a => `
    <div class="card learn-card" style="cursor:pointer;transition:var(--transition)" onclick="openLearnArticle('${a.id}')"
         onmouseover="this.style.transform='translateY(-4px)';this.style.boxShadow='var(--shadow)';this.style.borderColor='var(--primary)'"
         onmouseout="this.style.transform='';this.style.boxShadow='';this.style.borderColor=''">
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
        <div style="width:48px;height:48px;border-radius:var(--radius-sm);background:${a.color}22;display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:${a.color};flex-shrink:0">
          <i class="${a.icon}"></i>
        </div>
        <div>
          <span class="badge badge-primary" style="font-size:0.7rem;text-transform:capitalize">${a.category}</span>
          <p style="font-size:0.75rem;color:var(--text-muted);margin-top:0.2rem"><i class="fas fa-clock"></i> ${a.readTime} min de lectura</p>
        </div>
      </div>
      <h3 style="font-size:1rem;font-weight:700;margin-bottom:0.5rem;line-height:1.4">${a.title}</h3>
      <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.6;margin-bottom:1rem">${a.summary}</p>
      <button class="btn btn-sm btn-secondary" style="width:100%">
        <i class="fas fa-book-open"></i> Leer artículo
      </button>
    </div>
  `).join('');
}

function filterLearnCategory(category, btn) {
  learnActiveCategory = category;
  document.querySelectorAll('#learn-category-btns .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const grid = document.getElementById('learn-articles-grid');
  if (grid) grid.innerHTML = renderLearnArticles(category);
}

function openLearnArticle(articleId) {
  const article = LEARN_ARTICLES.find(a => a.id === articleId);
  if (!article) return;
  showModal(article.title, `
    <div>
      <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
        <div style="width:40px;height:40px;border-radius:8px;background:${article.color}22;display:flex;align-items:center;justify-content:center;color:${article.color}">
          <i class="${article.icon}"></i>
        </div>
        <div>
          <span class="badge badge-primary" style="text-transform:capitalize">${article.category}</span>
          <p style="font-size:0.8rem;color:var(--text-muted);margin-top:0.2rem"><i class="fas fa-clock"></i> ${article.readTime} min de lectura</p>
        </div>
      </div>
      <p style="font-size:0.9rem;color:var(--text-muted);font-style:italic;margin-bottom:1.25rem;padding-bottom:1rem;border-bottom:1px solid var(--border)">${article.summary}</p>
      <p style="font-size:0.92rem;line-height:1.8;color:var(--text)">${article.content}</p>
    </div>
  `, `<button class="btn btn-primary" onclick="closeModal()"><i class="fas fa-check"></i> Entendido</button>`);
}

function initLearnPage() {
  // Nada que inicializar con charts, la página es estática
}
