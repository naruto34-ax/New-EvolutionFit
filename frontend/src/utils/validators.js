function passesLuhn(digits) {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (double) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    double = !double;
  }
  return sum % 10 === 0;
}

export const formatCardNumber = (value) =>
  value.replace(/\D/g, '').slice(0, 19).replace(/(.{4})/g, '$1 ').trim();

export const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
};

export function validateCard({ name, number, expiry, cvv }) {
  const errors = {};

  if (name.trim().length < 3) errors.name = 'Escribe el nombre como aparece en la tarjeta';

  const digits = number.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(digits) || !passesLuhn(digits)) errors.number = 'Número de tarjeta inválido';

  const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(expiry);
  if (!match) {
    errors.expiry = 'Usa el formato MM/AA';
  } else {
    // La tarjeta vale hasta el último día del mes indicado
    const expiresAt = new Date(2000 + Number(match[2]), Number(match[1]), 1);
    if (expiresAt <= new Date()) errors.expiry = 'La tarjeta está vencida';
  }

  const cvvLength = /^3[47]/.test(digits) ? 4 : 3;
  if (!new RegExp(`^\\d{${cvvLength}}$`).test(cvv)) errors.cvv = `El CVV debe tener ${cvvLength} dígitos`;

  return errors;
}