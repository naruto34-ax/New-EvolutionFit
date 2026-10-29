import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { HOME_PATH, itemsForRole } from '../../config/navigation';

const ROLE_STYLE = {
  admin: { label: 'Admin', color: '#FF6584' },
  coach: { label: 'Coach', color: '#43E97B' },
  user: { label: 'Usuario', color: '#8F89FF' }
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const items = itemsForRole(user.role);
  const role = ROLE_STYLE[user.role] ?? ROLE_STYLE.user;
  const close = () => setOpen(false);

  return (
    <nav
      className="navbar"
      aria-label="Navegación principal"
      onKeyDown={(e) => {
        if (e.key === 'Escape') close();
      }}
    >
      <Link
        to={HOME_PATH}
        className="nav-brand"
        style={{ textDecoration: 'none' }}
        aria-label="Evolution Fit, ir al inicio"
        onClick={close}
      >
        <img src="/logoe.png.ico" alt="" className="nav-logo" />
        <span>Evolution<strong>Fit</strong></span>
      </Link>

      <div id="main-menu" className={`nav-links ${open ? 'open' : ''}`}>
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className="nav-link" onClick={close}>
            <i className={item.icon} aria-hidden="true"></i> {item.label}
          </NavLink>
        ))}
      </div>

      <div className="nav-user">
        <div className="nav-avatar">
          <span
            className="avatar-placeholder"
            aria-hidden="true"
            style={{ background: user.avatarColor || '#5a52e0', width: 32, height: 32, fontSize: '0.8rem' }}
          >
            {user.name.charAt(0).toUpperCase()}
          </span>
          <span>{user.name.split(' ')[0]}</span>
          <span
            style={{
              fontSize: '0.65rem', fontWeight: 700, padding: '2px 7px', borderRadius: 50, marginLeft: 4,
              background: `${role.color}22`, color: role.color, border: `1px solid ${role.color}44`
            }}
          >
            {role.label}
          </span>
        </div>
        {/* El botón aparece cuando el login real entregue la función logout */}
        {logout && (
          <button className="btn-logout" onClick={logout} aria-label="Cerrar sesión">
            <i className="fas fa-sign-out-alt" aria-hidden="true"></i>
          </button>
        )}
      </div>

      <button
        className="nav-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        aria-controls="main-menu"
      >
        <i className={open ? 'fas fa-times' : 'fas fa-bars'} aria-hidden="true"></i>
      </button>
    </nav>
  );
}