// ===== STORE PAGE =====
const PRODUCTS = [
  { id:'prod1', name:'Mancuernas Ajustables 20kg', category:'equipment', price:189900, originalPrice:249900, emoji:'🏋️', description:'Par de mancuernas ajustables de 2 a 20kg. Perfectas para entrenar en casa.', rating:4.8, reviews:124, stock:15, badge:'Más vendido' },
  { id:'prod2', name:'Banda Elástica Set x5', category:'equipment', price:45900, originalPrice:null, emoji:'🔴', description:'Set de 5 bandas de resistencia de diferentes niveles. Ideales para gym y casa.', rating:4.6, reviews:89, stock:30, badge:null },
  { id:'prod3', name:'Proteína Whey 2kg', category:'supplements', price:129900, originalPrice:159900, emoji:'🥛', description:'Proteína de suero de leche de alta calidad. 24g de proteína por porción.', rating:4.9, reviews:256, stock:20, badge:'Oferta' },
  { id:'prod4', name:'Creatina Monohidrato 500g', category:'supplements', price:79900, originalPrice:null, emoji:'💊', description:'Creatina pura para mejorar el rendimiento y la recuperación muscular.', rating:4.7, reviews:178, stock:25, badge:null },
  { id:'prod5', name:'Camiseta Dry-Fit Evolution', category:'clothing', price:59900, originalPrice:79900, emoji:'👕', description:'Camiseta técnica de alto rendimiento. Transpirable y de secado rápido.', rating:4.5, reviews:67, stock:0, badge:'Nuevo' },
  { id:'prod6', name:'Leggins Compresión Pro', category:'clothing', price:89900, originalPrice:null, emoji:'🩱', description:'Leggins de compresión para máximo rendimiento. Disponible en varios colores.', rating:4.7, reviews:93, stock:35, badge:null },
  { id:'prod7', name:'Colchoneta Yoga 6mm', category:'equipment', price:69900, originalPrice:89900, emoji:'🧘', description:'Colchoneta antideslizante de 6mm. Perfecta para yoga, pilates y estiramientos.', rating:4.6, reviews:145, stock:20, badge:null },
  { id:'prod8', name:'Botella Térmica 1L', category:'accessories', price:39900, originalPrice:null, emoji:'💧', description:'Botella de acero inoxidable. Mantiene frío 24h y caliente 12h.', rating:4.8, reviews:312, stock:40, badge:'Popular' },
  { id:'prod9', name:'Guantes de Entrenamiento', category:'accessories', price:34900, originalPrice:44900, emoji:'🥊', description:'Guantes con soporte de muñeca. Protege tus manos durante el entrenamiento.', rating:4.4, reviews:78, stock:30, badge:null },
  { id:'prod10', name:'Cuerda para Saltar Pro', category:'equipment', price:29900, originalPrice:null, emoji:'🪢', description:'Cuerda de velocidad con rodamientos. Ideal para cardio y HIIT.', rating:4.7, reviews:201, stock:45, badge:null },
  { id:'prod11', name:'Multivitamínico Sport', category:'supplements', price:54900, originalPrice:69900, emoji:'🌟', description:'Complejo vitamínico especial para deportistas. 30 días de suministro.', rating:4.5, reviews:134, stock:20, badge:'Oferta' },
  { id:'prod12', name:'Foam Roller Masaje', category:'accessories', price:49900, originalPrice:null, emoji:'🔵', description:'Rodillo de espuma para recuperación muscular y masaje miofascial.', rating:4.6, reviews:89, stock:25, badge:null }
];

function renderStore(user) {
  const cart = DB.getCart();
  const cartCount = cart.reduce((s, c) => s + (c.qty || 1), 0);

  return `
  <div class="page">
    <div class="section-header" style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem">
      <div>
        <h1 class="section-title"><i class="fas fa-shopping-bag"></i> Tienda Fitness</h1>
        <p class="section-subtitle">Equipos, suplementos y ropa deportiva de calidad</p>
      </div>
      <button class="btn btn-primary" onclick="openCart()" style="position:relative">
        <i class="fas fa-shopping-cart"></i> Carrito
        ${cartCount > 0 ? `<span style="position:absolute;top:-8px;right:-8px;background:#FF6584;color:white;border-radius:50%;width:20px;height:20px;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:700">${cartCount}</span>` : ''}
      </button>
    </div>

    <!-- FILTROS -->
    <div class="filters-bar" style="margin-bottom:1.5rem">
      <div class="filter-group">
        <div class="filter-btns" id="store-filter">
          <button class="filter-btn active" onclick="filterStore('all',this)"><i class="fas fa-th"></i> Todo</button>
          <button class="filter-btn" onclick="filterStore('equipment',this)"><i class="fas fa-dumbbell"></i> Equipos</button>
          <button class="filter-btn" onclick="filterStore('supplements',this)"><i class="fas fa-pills"></i> Suplementos</button>
          <button class="filter-btn" onclick="filterStore('clothing',this)"><i class="fas fa-tshirt"></i> Ropa</button>
          <button class="filter-btn" onclick="filterStore('accessories',this)"><i class="fas fa-tag"></i> Accesorios</button>
        </div>
      </div>
      <div style="position:relative;max-width:300px">
        <i class="fas fa-search" style="position:absolute;left:1rem;top:50%;transform:translateY(-50%);color:var(--text-muted)"></i>
        <input type="text" class="form-control" style="padding-left:2.75rem" placeholder="Buscar productos..." oninput="searchProducts(this.value)"/>
      </div>
    </div>

    <!-- PRODUCTOS -->
    <div class="grid-auto" id="products-grid">
      ${PRODUCTS.map(p => renderProductCard(p, user)).join('')}
    </div>
  </div>`;
}

function renderProductCard(p, user) {
  const discount = p.originalPrice ? Math.round((1 - p.price/p.originalPrice)*100) : 0;
  const stars = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');

  return `
  <div class="product-card" data-category="${p.category}" data-name="${p.name.toLowerCase()}">
    ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
    ${discount > 0 ? `<div class="product-discount">-${discount}%</div>` : ''}
    <div class="product-emoji">${p.emoji}</div>
    <div class="product-body">
      <h3 class="product-name">${p.name}</h3>
      <p class="product-desc">${p.description}</p>
      <div class="product-rating">
        <span style="color:#F7971E">${stars}</span>
        <span style="color:var(--text-muted);font-size:0.8rem">${p.rating} (${p.reviews})</span>
      </div>
      <div class="product-price">
        <span class="price-current">$${p.price.toLocaleString('es-CO')}</span>
        ${p.originalPrice ? `<span class="price-original">$${p.originalPrice.toLocaleString('es-CO')}</span>` : ''}
      </div>
      <p style="font-size:0.75rem;color:${p.stock < 10 ? '#FF6584' : 'var(--text-muted)'}">
        <i class="fas fa-box"></i> ${p.stock < 10 ? `¡Solo ${p.stock} disponibles!` : 'En stock'}
      </p>
    </div>
    <div class="product-footer">
      <button class="btn btn-secondary btn-sm" onclick="viewProduct('${p.id}')"><i class="fas fa-eye"></i></button>
      <button class="btn btn-primary" style="flex:1" onclick="addToCart('${p.id}')"><i class="fas fa-cart-plus"></i> Agregar</button>
    </div>
  </div>`;
}

function filterStore(cat, btn) {
  document.querySelectorAll('#store-filter .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.product-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.category === cat) ? 'flex' : 'none';
  });
}

function searchProducts(val) {
  document.querySelectorAll('.product-card').forEach(card => {
    card.style.display = card.dataset.name.includes(val.toLowerCase()) ? 'flex' : 'none';
  });
}

function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  DB.addToCart(product);
  showToast('Agregado', `${product.name} en tu carrito`, 'success');
  // Actualizar badge
  const cart = DB.getCart();
  const count = cart.reduce((s, c) => s + (c.qty || 1), 0);
  const btn = event.target.closest('button').parentElement.parentElement;
  // Re-render store to update cart count
}

function viewProduct(productId) {
  const p = PRODUCTS.find(prod => prod.id === productId);
  if (!p) return;
  const discount = p.originalPrice ? Math.round((1 - p.price/p.originalPrice)*100) : 0;
  showModal(p.name, `
    <div style="text-align:center;margin-bottom:1.5rem">
      <div style="font-size:5rem;margin-bottom:1rem">${p.emoji}</div>
      ${p.badge ? `<span class="badge badge-warning">${p.badge}</span>` : ''}
      ${discount > 0 ? `<span class="badge badge-danger" style="margin-left:0.5rem">-${discount}%</span>` : ''}
    </div>
    <p style="color:var(--text-muted);margin-bottom:1.5rem;line-height:1.6">${p.description}</p>
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1rem">
      <span style="font-size:1.8rem;font-weight:800;color:var(--primary)">$${p.price.toLocaleString('es-CO')}</span>
      ${p.originalPrice ? `<span style="text-decoration:line-through;color:var(--text-muted)">$${p.originalPrice.toLocaleString('es-CO')}</span>` : ''}
    </div>
    <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:1rem">
      <span style="color:#F7971E">★★★★★</span>
      <span style="color:var(--text-muted);font-size:0.85rem">${p.rating}/5 · ${p.reviews} reseñas</span>
    </div>
    <p style="font-size:0.85rem;color:${p.stock < 10 ? '#FF6584' : '#43E97B'}">
      <i class="fas fa-box"></i> ${p.stock} unidades disponibles
    </p>
  `, `
    <button class="btn btn-secondary" onclick="closeModal()">Cerrar</button>
    <button class="btn btn-primary" onclick="closeModal();addToCart('${p.id}')"><i class="fas fa-cart-plus"></i> Agregar al carrito</button>
  `);
}

function openCart() {
  const cart = DB.getCart();
  const total = cart.reduce((s, c) => s + (c.price * (c.qty || 1)), 0);

  showModal('🛒 Mi Carrito', `
    <div id="cart-content">
      ${cart.length === 0 ? `
        <div class="empty-state">
          <i class="fas fa-shopping-cart"></i>
          <h3>Carrito vacío</h3>
          <p>Agrega productos para continuar</p>
        </div>
      ` : `
        <div style="display:flex;flex-direction:column;gap:1rem;max-height:350px;overflow-y:auto">
          ${cart.map(item => `
            <div style="display:flex;align-items:center;gap:1rem;padding:0.75rem;background:var(--card-bg2);border-radius:8px">
              <span style="font-size:2rem">${item.emoji}</span>
              <div style="flex:1">
                <p style="font-weight:600;font-size:0.9rem">${item.name}</p>
                <span style="color:var(--text-muted);font-size:0.8rem">$${item.price.toLocaleString('es-CO')} × ${item.qty || 1}</span>
              </div>
              <strong>$${(item.price * (item.qty||1)).toLocaleString('es-CO')}</strong>
              <button onclick="removeFromCart('${item.id}')" style="background:none;border:none;color:var(--danger);cursor:pointer"><i class="fas fa-trash"></i></button>
            </div>
          `).join('')}
        </div>
        <div style="border-top:1px solid var(--border);margin-top:1rem;padding-top:1rem;display:flex;justify-content:space-between;align-items:center">
          <strong>Total:</strong>
          <strong style="font-size:1.2rem;color:var(--primary)">$${total.toLocaleString('es-CO')}</strong>
        </div>
      `}
    </div>
  `, cart.length > 0 ? `
    <button class="btn btn-secondary" onclick="closeModal()">Seguir comprando</button>
    <button class="btn btn-primary" onclick="checkout()"><i class="fas fa-credit-card"></i> Pagar</button>
  ` : `<button class="btn btn-primary" onclick="closeModal()">Ir a la tienda</button>`);
}

function removeFromCart(id) {
  DB.removeFromCart(id);
  closeModal();
  openCart();
}

function checkout() {
  const user = Auth.getCurrentUser();
  const cart = DB.getCart();
  const total = cart.reduce((s, c) => s + (c.price * (c.qty || 1)), 0);

  closeModal();
  showModal('💳 Pago', `
    <form onsubmit="processPayment(event)">
      <div class="form-group">
        <label class="form-label">Nombre en la tarjeta</label>
        <input type="text" class="form-control" value="${user.name}" required/>
      </div>
      <div class="form-group">
        <label class="form-label">Número de tarjeta</label>
        <input type="text" class="form-control" placeholder="1234 5678 9012 3456" maxlength="19" required/>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Vencimiento</label>
          <input type="text" class="form-control" placeholder="MM/AA" maxlength="5" required/>
        </div>
        <div class="form-group">
          <label class="form-label">CVV</label>
          <input type="text" class="form-control" placeholder="123" maxlength="3" required/>
        </div>
      </div>
      <div style="background:var(--card-bg2);padding:1rem;border-radius:8px;margin-top:1rem">
        <div style="display:flex;justify-content:space-between">
          <span>Total a pagar:</span>
          <strong style="color:var(--primary)">$${total.toLocaleString('es-CO')}</strong>
        </div>
      </div>
      <button type="submit" class="btn btn-primary btn-block" style="margin-top:1rem"><i class="fas fa-lock"></i> Pagar de forma segura</button>
    </form>
  `);
}

function processPayment(e) {
  e.preventDefault();
  const user = Auth.getCurrentUser();
  const cart = DB.getCart();
  DB.createOrder({ userId: user.id, items: cart, total: cart.reduce((s,c) => s+(c.price*(c.qty||1)), 0) });
  DB.clearCart();
  DB.updateUser(user.id, { points: (user.points||0) + 100 });
  closeModal();
  showToast('¡Compra exitosa!', 'Tu pedido ha sido procesado. +100 puntos 🎉', 'success');
  navigate('store');
}

function initCart() {
  // Cart initialization
}
