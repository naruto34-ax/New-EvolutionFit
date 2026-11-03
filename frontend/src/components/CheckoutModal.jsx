import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { createOrder } from '../services/orderService';
import { validateCard, formatCardNumber, formatExpiry } from '../utils/validators';
import { formatCOP } from '../utils/format';

const EMPTY_FORM = { name: '', number: '', expiry: '', cvv: '' };
const errorText = { color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.25rem', display: 'block' };

export default function CheckoutModal({ onClose, onPaid }) {
  const { user, addPoints } = useAuth();
  const { items, total, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ ...EMPTY_FORM, name: user.name });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [order, setOrder] = useState(null);

  const setField = (field, format = (v) => v) => (e) =>
    setForm((prev) => ({ ...prev, [field]: format(e.target.value) }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (processing) return;

    const found = validateCard(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setProcessing(true);
    setFormError('');
    try {
      await new Promise((resolve) => setTimeout(resolve, 800)); // simula la pasarela de pago
      const created = await createOrder({ user, items });
      addPoints(user.id, created.pointsEarned);
      clearCart();
      setForm(EMPTY_FORM); // los datos de la tarjeta no se conservan
      onPaid();
      setOrder(created);
      showToast('¡Compra exitosa!', `Pedido ${created.id} confirmado. +${created.pointsEarned} puntos 🎉`, 'success');
    } catch (error) {
      setFormError(error.message);
    } finally {
      setProcessing(false);
    }
  }

  // Vista de confirmación (el carrito ya quedó vacío)
  if (order) {
    return (
      <Modal
        title="✅ Pedido confirmado"
        onClose={onClose}
        actions={
          <>
            <button className="btn btn-secondary" onClick={onClose}>Seguir comprando</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                onClose();
                navigate('/mis-pedidos');
              }}
            >
              <i className="fas fa-receipt"></i> Ver mis pedidos
            </button>
          </>
        }
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🎉</div>
          <p style={{ marginBottom: '0.5rem' }}>
            Tu pedido <strong style={{ fontFamily: 'monospace' }}>{order.id}</strong> fue registrado.
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            Total pagado: <strong style={{ color: 'var(--primary)' }}>{formatCOP(order.total)}</strong>
          </p>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            <i className="fas fa-star" style={{ color: '#F7971E' }}></i> +{order.pointsEarned} puntos
          </p>
        </div>
      </Modal>
    );
  }

  if (items.length === 0) {
    return (
      <Modal
        title="💳 Pago"
        onClose={onClose}
        actions={<button className="btn btn-primary" onClick={onClose}>Volver a la tienda</button>}
      >
        <div className="empty-state">
          <i className="fas fa-shopping-cart"></i>
          <h3>Carrito vacío</h3>
          <p>Agrega productos para continuar</p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      title="💳 Pago"
      onClose={onClose}
      actions={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={processing}>Cancelar</button>
          <button type="submit" form="checkout-form" className="btn btn-primary" disabled={processing}>
            {processing ? (
              <><i className="fas fa-spinner fa-spin"></i> Procesando pago...</>
            ) : (
              <><i className="fas fa-lock"></i> Pagar {formatCOP(total)}</>
            )}
          </button>
        </>
      }
    >
      <form id="checkout-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label className="form-label" htmlFor="co-name">Nombre en la tarjeta</label>
          <input id="co-name" type="text" className="form-control" autoComplete="off"
            value={form.name} onChange={setField('name')} aria-invalid={Boolean(errors.name)} />
          {errors.name && <small style={errorText} role="alert">{errors.name}</small>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="co-number">Número de tarjeta</label>
          <input id="co-number" type="text" inputMode="numeric" className="form-control" autoComplete="off"
            placeholder="1234 5678 9012 3456" value={form.number}
            onChange={setField('number', formatCardNumber)} aria-invalid={Boolean(errors.number)} />
          {errors.number && <small style={errorText} role="alert">{errors.number}</small>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="co-expiry">Vencimiento</label>
            <input id="co-expiry" type="text" inputMode="numeric" className="form-control" autoComplete="off"
              placeholder="MM/AA" value={form.expiry}
              onChange={setField('expiry', formatExpiry)} aria-invalid={Boolean(errors.expiry)} />
            {errors.expiry && <small style={errorText} role="alert">{errors.expiry}</small>}
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="co-cvv">CVV</label>
            <input id="co-cvv" type="password" inputMode="numeric" className="form-control" autoComplete="off"
              placeholder="123" maxLength={4} value={form.cvv}
              onChange={setField('cvv', (v) => v.replace(/\D/g, ''))} aria-invalid={Boolean(errors.cvv)} />
            {errors.cvv && <small style={errorText} role="alert">{errors.cvv}</small>}
          </div>
        </div>

        <div style={{ background: 'var(--card-bg2)', padding: '1rem', borderRadius: 8, marginTop: '0.5rem' }}>
          {items.map((item) => (
            <div key={item.productId}
              style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
              <span>{item.emoji} {item.name} × {item.qty}</span>
              <span>{formatCOP(item.price * item.qty)}</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
            <strong>Total a pagar:</strong>
            <strong style={{ color: 'var(--primary)' }}>{formatCOP(total)}</strong>
          </div>
        </div>

        {formError && <div className="form-error" role="alert" style={{ marginTop: '1rem' }}>{formError}</div>}

        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '1rem', textAlign: 'center' }}>
          <i className="fas fa-lock"></i> Pago simulado: los datos de la tarjeta no se guardan ni se envían.
        </p>
      </form>
    </Modal>
  );
}