/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { loadCart, saveCart } from '../services/cartService';

const CartContext = createContext(null);

// Se monta con key={userId}: al cambiar de usuario se carga SU carrito
export function CartProvider({ userId, children }) {
  const [items, setItems] = useState(() => loadCart(userId));

  const commit = useCallback(
    (next) => {
      setItems(next);
      saveCart(userId, next);
    },
    [userId]
  );

  const addItem = useCallback(
    (product) => {
      if (product.stock <= 0) return { ok: false, error: 'Este producto está agotado' };
      const existing = items.find((i) => i.productId === product.id);
      const currentQty = existing ? existing.qty : 0;
      if (currentQty + 1 > product.stock) {
        return { ok: false, error: `Solo hay ${product.stock} unidades disponibles` };
      }
      const next = existing
        ? items.map((i) => (i.productId === product.id ? { ...i, qty: i.qty + 1 } : i))
        : [
            ...items,
            { productId: product.id, name: product.name, emoji: product.emoji, price: product.price, qty: 1 }
          ];
      commit(next);
      return { ok: true };
    },
    [items, commit]
  );

  const removeItem = useCallback(
    (productId) => commit(items.filter((i) => i.productId !== productId)),
    [items, commit]
  );

  const clearCart = useCallback(() => commit([]), [commit]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  const value = useMemo(
    () => ({ items, count, total, addItem, removeItem, clearCart }),
    [items, count, total, addItem, removeItem, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}