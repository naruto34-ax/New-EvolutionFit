/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../services/api';

const TOKEN_KEY = 'ef_token';
const USER_KEY = 'ef_user';

// Lee la fecha de vencimiento del token (sin verificarlo: eso lo hace el servidor)
function tokenIsValid(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return !payload.exp || payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

function readSession() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    if (token && user && tokenIsValid(token)) return { token, user };
  } catch {
    // sesión dañada: se descarta
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  return { token: null, user: null };
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const login = useCallback(async ({ email, password }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (!data.token || !data.user) {
        return { success: false, error: 'El servidor no devolvió los datos de la sesión.' };
      }
      localStorage.setItem(TOKEN_KEY, data.token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      setSession({ token: data.token, user: data.user });
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error: error.userMessage || 'No se pudo iniciar sesión.' };
    }
  }, []);

  const register = useCallback(async (form) => {
    try {
      const { data } = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        age: form.age || null,
        gender: form.gender || null,
        population: form.population,
        preferredSpace: form.preferredSpace,
        level: form.level,
        password: form.password
      });
      return { success: true, ...data };
    } catch (error) {
      return { success: false, error: error.userMessage || 'No se pudo registrar el usuario.' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setSession({ token: null, user: null });
  }, []);

  // TEMPORAL: mientras los pagos sigan en localStorage. Con el backend de pagos,
  // los puntos los suma el servidor y esta función se elimina.
  const addPoints = useCallback((userId, amount) => {
    setSession((prev) => {
      if (!prev.user || prev.user.id !== userId) return prev;
      const user = { ...prev.user, points: Math.max(0, (prev.user.points ?? 0) + amount) };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { ...prev, user };
    });
  }, []);

  const value = useMemo(
    () => ({ user: session.user, token: session.token, login, register, logout, addPoints }),
    [session, login, register, logout, addPoints]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}