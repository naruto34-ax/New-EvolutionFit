import { useMemo, useState } from 'react';
import { getProducts } from '../services/productService';
import useAsync from '../hooks/useAsync';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import CartModal from '../components/CartModal';
import CheckoutModal from '../components/CheckoutModal';
import { LoadingState, EmptyState, ErrorState } from '../components/StateViews';

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
  const { data, loading, error, reload } = useAsync(getProducts);

  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter(
      (p) => (category === 'all' || p.category === category) && p.name.toLowerCase().includes(term)
    );
  }, [data, category, search]);

  function handleAdd(product) {
    const result = addItem(product);
    if (result.ok) showToast('Agregado', `${product.name} en tu carrito`, 'success');
    else showToast('No se pudo agregar', result.error, 'error');
  }

  function handleCheckout() {
    setCartOpen(false);
    setCheckoutOpen(true);
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
        <button
          className="btn btn-primary"
          onClick={() => setCartOpen(true)}
          style={{ position: 'relative' }}
          aria-label={count > 0 ? `Abrir carrito, ${count} productos` : 'Abrir carrito'}
        >
          <i className="fas fa-shopping-cart"></i> Carrito
          {count > 0 && (
            <span
              aria-hidden="true"
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
                aria-pressed={category === c.id}
              >
                <i className={c.icon}></i> {c.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', maxWidth: 300 }}>
          <i
            className="fas fa-search"
            aria-hidden="true"
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          ></i>
          <input
            type="text"
            className="form-control"
            style={{ paddingLeft: '2.75rem' }}
            placeholder="Buscar productos..."
            aria-label="Buscar productos"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <p className="sr-only" role="status">
        {loading || error ? '' : `${visible.length} productos encontrados`}
      </p>

      {loading ? (
        <LoadingState label="Cargando productos..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => reload()} />
      ) : visible.length === 0 ? (
        <EmptyState icon="fas fa-search" title="Sin resultados" message="Prueba con otra búsqueda o categoría">
          {(search || category !== 'all') && (
            <button
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setSearch('');
                setCategory('all');
              }}
            >
              Limpiar filtros
            </button>
          )}
        </EmptyState>
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
      {checkoutOpen && (
        <CheckoutModal
          onClose={() => setCheckoutOpen(false)}
          onPaid={() => reload({ silent: true })}
        />
      )}
    </div>
  );
}