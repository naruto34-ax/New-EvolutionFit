import { useCallback, useEffect, useState } from 'react';

// Carga datos asíncronos y entrega { data, loading, error, reload, setData }.
// `fetcher` debe ser estable: una función definida fuera del componente o envuelta en useCallback.
export default function useAsync(fetcher, { enabled = true } = {}) {
  const [state, setState] = useState({ data: null, loading: enabled, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) return undefined;
    let active = true;

    fetcher()
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (active) {
          setState({
            data: null,
            loading: false,
            error: err.userMessage || err.message || 'Ocurrió un error inesperado'
          });
        }
      });

    return () => {
      active = false;
    };
  }, [fetcher, enabled, attempt]);

  // silent: true vuelve a pedir los datos sin mostrar el "cargando" (útil para refrescar)
  const reload = useCallback(({ silent = false } = {}) => {
    setState((prev) => ({ ...prev, loading: silent ? prev.loading : true, error: null }));
    setAttempt((n) => n + 1);
  }, []);

  const setData = useCallback((updater) => {
    setState((prev) => ({
      ...prev,
      data: typeof updater === 'function' ? updater(prev.data) : updater
    }));
  }, []);

  return { data: state.data, loading: state.loading, error: state.error, reload, setData };
}