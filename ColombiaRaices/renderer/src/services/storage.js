// Gestión de localStorage para el renderer
class StorageService {
  constructor() {
    this.prefix = 'colombia_raices_';
  }

  // Obtener item del localStorage
  getItem(key) {
    try {
      const item = localStorage.getItem(this.prefix + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  }

  // Guardar item en localStorage
  setItem(key, value) {
    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
      return false;
    }
  }

  // Eliminar item del localStorage
  removeItem(key) {
    try {
      localStorage.removeItem(this.prefix + key);
      return true;
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
      return false;
    }
  }

  // Limpiar todo el localStorage de la aplicación
  clear() {
    try {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  }
}

export default new StorageService();
