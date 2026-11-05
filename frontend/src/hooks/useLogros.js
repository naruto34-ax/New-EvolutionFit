import { useCallback, useEffect, useState } from "react";
import api from "../services/api";

export function useLogros() {
  const [logros, setLogros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async (signal) => {
    setCargando(true);
    setError(null);
    try {
      const { data } = await api.get("/logros", { signal });
      setLogros(data.logros);
    } catch (e) {
      if (e.code !== "ERR_CANCELED") setError(e.userMessage || e.message);
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, []);

  useEffect(() => {
    const control = new AbortController();
    cargar(control.signal);
    return () => control.abort();
  }, [cargar]);

  return { logros, cargando, error, recargar: () => cargar() };
}