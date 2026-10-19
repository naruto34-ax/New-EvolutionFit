import React from 'react';

const Accesibilidad = ({ texto, onClick, ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || texto}
      className="btn-evolution"
    >
      {texto}
    </button>
  );
};

export default Accesibilidad;