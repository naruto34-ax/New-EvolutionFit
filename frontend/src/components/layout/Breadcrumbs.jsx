import { Link, useLocation } from 'react-router-dom';
import { HOME_PATH, titleFor } from '../../config/navigation';

export default function Breadcrumbs() {
  const { pathname } = useLocation();
  const title = titleFor(pathname);

  // En la página de inicio no se muestra
  if (pathname === HOME_PATH || !title) return null;

  return (
    <nav className="breadcrumb" aria-label="Ruta de navegación" style={{ display: 'flex' }}>
      <Link to={HOME_PATH} className="bc-item">
        <i className="fas fa-home" aria-hidden="true"></i> Inicio
      </Link>
      <i className="fas fa-chevron-right bc-sep" aria-hidden="true"></i>
      <span className="bc-item bc-current" aria-current="page">{title}</span>
    </nav>
  );
}