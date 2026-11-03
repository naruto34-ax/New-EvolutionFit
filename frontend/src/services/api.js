import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
});

// Agrega el token (cuando exista el login real) a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ef_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Deja un mensaje de error legible para mostrar en pantalla
api.interceptors.response.use(
  (response) => response,
  (error) => {
    error.userMessage = error.response?.data?.error || 'No se pudo conectar con el servidor';
    return Promise.reject(error);
  }
);

export default api;