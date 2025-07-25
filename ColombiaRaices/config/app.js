// Configuración de la aplicación
const APP_CONFIG = {
  name: 'Colombia Raíces',
  version: '1.0.0',
  description: 'Plataforma de Turismo Comunitario',
  window: {
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
  },
  isDevelopment: process.env.NODE_ENV === 'development',
  ports: {
    renderer: 3004,
  },
};

module.exports = APP_CONFIG;
