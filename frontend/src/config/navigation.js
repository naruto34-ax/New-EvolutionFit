// Un solo lugar para el menú: cada módulo agrega AQUÍ su enlace.
export const HOME_PATH = '/tienda'; // cambiar a '/dashboard' cuando exista

export const NAV_ITEMS = [
  { to: '/tienda', label: 'Tienda', icon: 'fas fa-shopping-bag', roles: ['user', 'coach', 'admin'] },
  { to: '/mis-pedidos', label: 'Mis pedidos', icon: 'fas fa-receipt', roles: ['user', 'coach', 'admin'] },
  { to: '/admin/pedidos', label: 'Pedidos', icon: 'fas fa-clipboard-list', roles: ['admin'] },
  { to: '/rutinas', label: 'Rutinas', icon: 'fas fa-dumbbell', roles: ['user', 'coach', 'admin'] },
  { to: '/logros', label: 'Logros', icon: 'fas fa-trophy', roles: ['user', 'coach', 'admin'] },
  { to: '/progreso', label: 'Progreso', icon: 'fas fa-camera', roles: ['user', 'coach', 'admin'] },
  { to: '/mi-coach', label: 'Mi Coach', icon: 'fas fa-user-ninja', roles: ['user', 'admin'] }
];



// Títulos de páginas que no están en el menú (por ejemplo, '/perfil': 'Mi perfil')
const EXTRA_TITLES = {};

export const itemsForRole = (role) => NAV_ITEMS.filter((item) => item.roles.includes(role));

export const titleFor = (pathname) =>
  NAV_ITEMS.find((item) => item.to === pathname)?.label ?? EXTRA_TITLES[pathname] ?? null;