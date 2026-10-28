import { PRODUCTS } from '../data/products';

const STOCK_KEY = 'ef_stock';

function readStock() {
  try {
    return JSON.parse(localStorage.getItem(STOCK_KEY)) || {};
  } catch {
    return {};
  }
}

// Cuando exista el backend, esto pasa a: const { data } = await api.get('/products'); return data;

export async function getProducts() {  
  const stock = readStock();
  return PRODUCTS.map((p) => ({ ...p, stock: stock[p.id] ?? p.stock }));
}

// Descuenta el stock de varios productos a la vez. Si alguno no alcanza, no descuenta ninguno.
export async function reserveStock(items) {
  const stock = readStock();
  const catalog = new Map(PRODUCTS.map((p) => [p.id, p]));

  for (const item of items) {
    const product = catalog.get(item.productId);
    if (!product) throw new Error(`El producto "${item.name}" ya no existe`);
    const available = stock[item.productId] ?? product.stock;
    if (item.qty > available) {
      throw new Error(
        available === 0
          ? `"${product.name}" está agotado`
          : `De "${product.name}" solo quedan ${available} unidades`
      );
    }
  }

  const next = { ...stock };
  for (const item of items) {
    const product = catalog.get(item.productId);
    next[item.productId] = (stock[item.productId] ?? product.stock) - item.qty;
  }
  localStorage.setItem(STOCK_KEY, JSON.stringify(next));
}

// Devuelve stock (cuando se cancela un pedido)
export async function releaseStock(items) {
  const stock = readStock();
  const catalog = new Map(PRODUCTS.map((p) => [p.id, p]));
  const next = { ...stock };

  for (const item of items) {
    const product = catalog.get(item.productId);
    if (product) next[item.productId] = (stock[item.productId] ?? product.stock) + item.qty;
  }
  localStorage.setItem(STOCK_KEY, JSON.stringify(next));
}
