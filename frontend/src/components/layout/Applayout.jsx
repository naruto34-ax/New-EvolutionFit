import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Breadcrumbs from './Breadcrumbs';
import Footer from './Footer';
import { titleFor } from '../../config/navigation';

export default function AppLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef(null);
  const lastPath = useRef(pathname);

  // El título de la pestaña cambia según la página
  useEffect(() => {
    const title = titleFor(pathname);
    document.title = title ? `${title} — Evolution Fit` : 'Evolution Fit';
  }, [pathname]);

  // Al navegar, el foco pasa al contenido: teclado y lectores de pantalla no se quedan en el menú
  useEffect(() => {
    if (lastPath.current !== pathname) {
      lastPath.current = pathname;
      mainRef.current?.focus();
    }
  }, [pathname]);

  return (
    <>
      <a href="#main-content" className="skip-link">Saltar al contenido</a>
      <Navbar />
      <Breadcrumbs />
      <main id="main-content" ref={mainRef} tabIndex={-1} className="main-content">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}