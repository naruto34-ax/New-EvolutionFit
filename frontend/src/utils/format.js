export const formatCOP = (value) => `$${Number(value).toLocaleString('es-CO')}`;

export const discountPercent = (price, original) =>
  original ? Math.round((1 - price / original) * 100) : 0;