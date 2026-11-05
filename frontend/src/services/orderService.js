import api from './api';

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

// Los errores de axios traen el texto del servidor en userMessage
const fail = (error) => {
  throw new Error(error.userMessage || error.message);
};

export async function createOrder({ items }) {
  if (!items.length) throw new Error('El carrito está vacío');
  try {
    const { data } = await api.post('/orders', {
      items: items.map((i) => ({ productId: i.productId, quantity: i.qty })),
      paymentMethod: 'card_simulated'
    });
    return data.order;
  } catch (error) {
    return fail(error);
  }
}

// El servidor identifica al usuario por el token; el parámetro se conserva por compatibilidad
export async function getOrdersByUser() {
  try {
    const { data } = await api.get('/orders/mine');
    return data.orders;
  } catch (error) {
    return fail(error);
  }
}

export async function getAllOrders() {
  try {
    const { data } = await api.get('/orders');
    return data.orders;
  } catch (error) {
    return fail(error);
  }
}

export async function updateOrderStatus(orderId, status) {
  try {
    const { data } = await api.patch(`/orders/${orderId}/status`, { status });
    return data.order;
  } catch (error) {
    return fail(error);
  }
}