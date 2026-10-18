import { getProducts, reserveStock, releaseStock } from './productService';

const ORDERS_KEY = 'ef_orders';
const SEQ_KEY = 'ef_order_seq';

export const POINTS_PER_ORDER = 100;

export const ORDER_STATUS = {
  pending:   { label: 'Pendiente',  badge: 'badge-warning', action: 'Marcar pendiente' },
  paid:      { label: 'Pagado',     badge: 'badge-primary', action: 'Marcar pagado' },
  shipped:   { label: 'Enviado',    badge: 'badge-info',    action: 'Marcar enviado' },
  completed: { label: 'Completado', badge: 'badge-success', action: 'Completar' },
  cancelled: { label: 'Cancelado',  badge: 'badge-danger',  action: 'Cancelar' }
};

const TRANSITIONS = {
  pending: ['paid', 'cancelled'],
  paid: ['shipped', 'cancelled'],
  shipped: ['completed', 'cancelled'],
  completed: [],
  cancelled: []
};

export const nextStatuses = (status) => TRANSITIONS[status] ?? [];

function readOrders() {
  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY));
    return Array.isArray(orders) ? orders : [];
  } catch {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

function nextOrderId() {
  const seq = Number(localStorage.getItem(SEQ_KEY) || 0) + 1;
  localStorage.setItem(SEQ_KEY, String(seq));
  return `EF-${String(seq).padStart(6, '0')}`;
}

// Con backend: const { data } = await api.post('/orders', { items }); return data;
export async function createOrder({ user, items }) {
  if (!items.length) throw new Error('El carrito está vacío');

  const catalog = new Map((await getProducts()).map((p) => [p.id, p]));

  // El precio SIEMPRE sale del catálogo, nunca del carrito
  const lines = items.map((item) => {
    const product = catalog.get(item.productId);
    if (!product) throw new Error(`El producto "${item.name}" ya no existe`);
    if (!Number.isInteger(item.qty) || item.qty < 1) throw new Error('Cantidad inválida en el carrito');
    return { productId: product.id, name: product.name, emoji: product.emoji, price: product.price, qty: item.qty };
  });

  await reserveStock(lines);

  const order = {
    id: nextOrderId(),
    userId: user.id,
    userName: user.name,
    items: lines,
    total: lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    status: 'paid',                 // el pago es simulado: nace pagado
    paymentMethod: 'card_simulated',
    pointsEarned: POINTS_PER_ORDER,
    createdAt: new Date().toISOString()
  };

  saveOrders([order, ...readOrders()]);
  return order;
}

export async function getOrdersByUser(userId) {
  return readOrders().filter((o) => o.userId === userId);
}

export async function getAllOrders() {
  return readOrders();
}

export async function updateOrderStatus(orderId, status) {
  const orders = readOrders();
  const index = orders.findIndex((o) => o.id === orderId);
  if (index === -1) throw new Error('Pedido no encontrado');

  const order = orders[index];
  if (!nextStatuses(order.status).includes(status)) {
    throw new Error(`No se puede pasar de "${ORDER_STATUS[order.status].label}" a "${ORDER_STATUS[status]?.label ?? status}"`);
  }

  if (status === 'cancelled') await releaseStock(order.items);

  const updated = { ...order, status, updatedAt: new Date().toISOString() };
  orders[index] = updated;
  saveOrders(orders);
  return updated;
}