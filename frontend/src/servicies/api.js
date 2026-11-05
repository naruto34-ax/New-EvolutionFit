const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

/** Cliente único para hablar con el backend. Lo pueden reutilizar los demás módulos. */
export async function apiFetch(ruta, { token, headers, ...opciones } = {}) {
  const res = await fetch(`${BASE}${ruta}`, {
    ...opciones,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
  });
  if (!res.ok) {
    const cuerpo = await res.json().catch(() => ({}));
    throw new Error(cuerpo.error || `Error ${res.status}`);
  }
  return res.json();
}
