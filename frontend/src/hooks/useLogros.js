import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export function useLogros(token) {
  const [logros, setLogros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async (signal) => {
    setCargando(true);
    setError(null);
    try {
      const data = await apiFetch("/api/logros", { token, signal });
      setLogros(data.logros);
    } catch (e) {
      if (e.name !== "AbortError") setError(e.message);
    } finally {
      if (!signal?.aborted) setCargando(false);
    }
  }, [token]);

  useEffect(() => {
    const control = new AbortController();
    cargar(control.signal);
    return () => control.abort();
  }, [cargar]);

  return { logros, cargando, error, recargar: () => cargar() };
}
