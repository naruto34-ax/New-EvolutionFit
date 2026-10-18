const keyFor = (userId) => `ef_cart_${userId}`;

export function loadCart(userId) {
  try {
    const items = JSON.parse(localStorage.getItem(keyFor(userId)));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export function saveCart(userId, items) {
  localStorage.setItem(keyFor(userId), JSON.stringify(items));
}