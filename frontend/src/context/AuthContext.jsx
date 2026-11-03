/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// TEMPORAL: usuarios de prueba hasta que llegue el login real (#3/#4)
const DEMO_USERS = [
  { id: 1, name: 'Admin', email: 'admin@evolutionfit.com', role: 'admin', points: 0 },
  { id: 2, name: 'Coach Carlos', email: 'coach@evolutionfit.com', role: 'coach', points: 0 },
  { id: 3, name: 'María García', email: 'maria@demo.com', role: 'user', points: 0 }
];

const USERS_KEY = 'ef_dev_users';
const CURRENT_KEY = 'ef_dev_user_id';

function readUsers() {
  try {
    const saved = JSON.parse(localStorage.getItem(USERS_KEY));
    return Array.isArray(saved) && saved.length ? saved : DEMO_USERS;
  } catch {
    return DEMO_USERS;
  }
}

function readCurrentId() {
  const id = Number(localStorage.getItem(CURRENT_KEY));
  return DEMO_USERS.some((u) => u.id === id) ? id : 3;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(readUsers);
  const [currentId, setCurrentId] = useState(readCurrentId);

  const user = users.find((u) => u.id === currentId) ?? users[0];

  const switchUser = useCallback((id) => {
    localStorage.setItem(CURRENT_KEY, String(id));
    setCurrentId(id);
  }, []);

  const addPoints = useCallback((userId, amount) => {
    setUsers((prev) => {
      const next = prev.map((u) => (u.id === userId ? { ...u, points: Math.max(0, u.points + amount) } : u));
      localStorage.setItem(USERS_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ user, users, switchUser, addPoints }),
    [user, users, switchUser, addPoints]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}