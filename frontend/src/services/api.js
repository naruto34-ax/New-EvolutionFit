import axios from 'axios';

// 1. Unificamos la URL base tomando la variable de entorno de Vite o el localhost
// Nota: Si tu backend requiere el '/api' al final, asegúrate de que VITE_API_URL lo incluya,
// o déjalo directamente en el fallback como está aquí abajo.
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api';

// 2. Creamos la instancia principal de Axios
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// 3. Interceptor de peticiones (Request)
// Inyecta automáticamente el token de localStorage en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ef_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// 4. Interceptor de respuestas (Response)
// Estandariza los errores para que sean legibles en el frontend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el backend envía un mensaje en error.response.data.error, lo usamos.
    error.userMessage = error.response?.data?.error || 'No se pudo conectar con el servidor';
    return Promise.reject(error);
  }
);

/** 
 * 5. Wrapper de compatibilidad (Opcional)
 * Mantenemos `apiFetch` por si tienes componentes que ya usan esta sintaxis.
 * Internamente ahora utiliza Axios para aprovechar los interceptores.
 */
export async function apiFetch(ruta, { token, headers, body, method = 'GET', ...opciones } = {}) {
  try {
    const res = await api({
      url: ruta,
      method,
      // Axios usa 'data' en lugar de 'body', y maneja objetos nativos (no requiere JSON.stringify)
      data: body ? (typeof body === 'string' ? JSON.parse(body) : body) : undefined,
      headers: {
        ...headers,
        ...(token && { Authorization: `Bearer ${token}` }) // Por si se envía un token manual
      },
      ...opciones
    });
    return res.data;
  } catch (error) {
    // Lanzamos el error estandarizado del interceptor
    throw new Error(error.userMessage || error.message);
  }
}

// Exportamos la instancia de Axios por defecto para el uso general
export default api;