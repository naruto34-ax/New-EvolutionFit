import { useState, useEffect } from 'react';

export const useMantenibilidad = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/usuarios')
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar datos:', err);
        setLoading(false);
      });
  }, []);

  return { usuarios, loading };
};