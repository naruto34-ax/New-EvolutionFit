import React, { Suspense, lazy } from 'react';
import Fiabilidad from './components/Fiabilidad';

// Carga perezosa (Lazy loading)
const Dashboard = lazy(() => import('./components/Accesibilidad')); // O la vista principal de tu app

function TiempoRespuesta() {
  return (
    <Fiabilidad>
      <Suspense fallback={<div>Cargando Evolution Fit...</div>}>
        <Dashboard texto="Carga rápida completada" />
      </Suspense>
    </Fiabilidad>
  );
}

export default TiempoRespuesta;