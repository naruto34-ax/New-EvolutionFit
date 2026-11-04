import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { itemsForRole } from '../../config/navigation';

export default function Footer() {
  const { user } = useAuth();
  const items = itemsForRole(user.role);

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-brand-row">
            <img src="/logoe.png.ico" alt="" className="footer-logo" />
            <span className="footer-name">Evolution<strong>Fit</strong></span>
          </div>
          <p>Tu plataforma de entrenamiento personalizado</p>
        </div>
        <div className="footer-links">
          <h4>Plataforma</h4>
          {items.map((item) => (
            <Link key={item.to} to={item.to}>{item.label}</Link>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Evolution Fit — Tecnológico de Antioquia · Ingeniería de Software · Cuarto Semestre</p>
      </div>
    </footer>
  );
}