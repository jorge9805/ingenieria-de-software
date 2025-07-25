// Configuración de desarrollo y buenas prácticas
export const DEV_CONFIG = {
  // Habilitar logs de debug en desarrollo
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  
  // Validar props en desarrollo
  VALIDATE_PROPS: true,
  
  // Mostrar warnings para prácticas no recomendadas
  SHOW_WARNINGS: true,
};

// Validador de páginas válidas para TravelerHeader
export const VALID_PAGES = ['experiences', 'communities', 'reservations'];

// Función para validar currentPage prop
export const validateCurrentPage = (currentPage) => {
  if (!VALID_PAGES.includes(currentPage)) {
    if (DEV_CONFIG.SHOW_WARNINGS) {
      console.warn(`Warning: Invalid currentPage '${currentPage}'. Valid options: ${VALID_PAGES.join(', ')}`);
    }
    return false;
  }
  return true;
};

// Función para validar rutas
export const validateRoute = (route) => {
  const validRoutes = Object.values(ROUTES);
  if (!validRoutes.includes(route)) {
    if (DEV_CONFIG.SHOW_WARNINGS) {
      console.warn(`Warning: Route '${route}' not found in ROUTES constants`);
    }
    return false;
  }
  return true;
};

// Import de ROUTES para validación
import { ROUTES } from './constants';
