import { useEffect, useMemo, useState } from 'react';
import { getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CartModal from '../components/CartModal';
import CheckoutModal from '../components/CheckoutModal';


const CATEGORIES = [
  { id: 'all', label: 'Todo', icon: 'fas fa-th' },
  { id: 'equipment', label: 'Equipos', icon: 'fas fa-dumbbell' },
  { id: 'supplements', label: 'Suplementos', icon: 'fas fa-pills' },
  { id: 'clothing', label: 'Ropa', icon: 'fas fa-tshirt' },
  { id: 'accessories', label: 'Accesorios', icon: 'fas fa-tag' }
];

export default function Store() {
  const { count, addItem } = useCart();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getProducts().then((data) => {
      if (active) {
        setProducts(data);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter(
      (p) => (category === 'all' || p.category === category) && p.name.toLowerCase().includes(term)
    );
  }, [products, category, search]);

  function handleAdd(product) {
    const result = addItem(product);
    if (result.ok) showToast('Agregado', `${product.name} en tu carrito`, 'success');
    else showToast('No se pudo agregar', result.error, 'error');
  }

  function handleCheckout() {
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  function handlePaid() {
    getProducts().then(setProducts); // refresca el stock en pantalla
  }

  return (
    <div className="page">
      <div
        className="section-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <h1 className="section-title"><i className="fas fa-shopping-bag"></i> Tienda Fitness</h1>
          <p className="section-subtitle">Equipos, suplementos y ropa deportiva de calidad</p>
        </div>
        <button className="btn btn-primary" onClick={() => setCartOpen(true)} style={{ position: 'relative' }}>
          <i className="fas fa-shopping-cart"></i> Carrito
          {count > 0 && (
            <span
              style={{ position: 'absolute', top: -8, right: -8, background: '#FF6584', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}
            >
              {count}
            </span>
          )}
        </button>
      </div>

      <div className="filters-bar" style={{ marginBottom: '1.5rem' }}>
        <div className="filter-group">
          <div className="filter-btns">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`filter-btn ${category === c.id ? 'active' : ''}`}
                onClick={() => setCategory(c.id)}
              >
                <i className={c.icon}></i> {c.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', maxWidth: 300 }}>
          <i
            className="fas fa-search"
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          ></i>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.75rem' }}
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : visible.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-search"></i>
          <h3>Sin resultados</h3>
          <p>Prueba con otra búsqueda o categoría</p>
        </div>
      ) : (
        <div className="grid-auto">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} onView={setSelected} />
          ))}
        </div>
      )}

      {selected && (
        <ProductModal product={selected} onClose={() => setSelected(null)} onAdd={handleAdd} />
      )}
      {cartOpen && <CartModal onClose={() => setCartOpen(false)} onCheckout={handleCheckout} />}
      {checkoutOpen && <CheckoutModal onClose={() => setCheckoutOpen(false)} onPaid={handlePaid} />}
    </div>
  );
}