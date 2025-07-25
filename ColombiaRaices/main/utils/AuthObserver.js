
/**
 * Patrón Observer para eventos de autenticación
 * Permite a diferentes partes del sistema reaccionar a eventos de autenticación
 */
class AuthObserver {
  constructor() {
    this.observers = new Map();
  }

  /**
   * Suscribe un observer a un evento específico
   * @param {string} eventType - Tipo de evento
   * @param {function} callback - Función a ejecutar cuando ocurre el evento
   * @param {string} observerId - ID único del observer
   */
  subscribe(eventType, callback, observerId = null) {
    if (!this.observers.has(eventType)) {
      this.observers.set(eventType, new Map());
    }
    
    const id = observerId || this.generateObserverId();
    this.observers.get(eventType).set(id, callback);
    
    return id; // Retorna el ID para poder desuscribirse después
  }

  /**
   * Desuscribe un observer de un evento
   * @param {string} eventType - Tipo de evento
   * @param {string} observerId - ID del observer
   */
  unsubscribe(eventType, observerId) {
    if (this.observers.has(eventType)) {
      this.observers.get(eventType).delete(observerId);
    }
  }

  /**
   * Notifica a todos los observers de un evento
   * @param {string} eventType - Tipo de evento
   * @param {object} data - Datos del evento
   */
  notify(eventType, data) {
    if (this.observers.has(eventType)) {
      const eventObservers = this.observers.get(eventType);
      eventObservers.forEach((callback, observerId) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error en observer ${observerId} para evento ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Genera un ID único para un observer
   * @returns {string} - ID único
   */
  generateObserverId() {
    return 'observer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Obtiene la cantidad de observers para un evento
   * @param {string} eventType - Tipo de evento
   * @returns {number} - Cantidad de observers
   */
  getObserverCount(eventType) {
    return this.observers.has(eventType) ? this.observers.get(eventType).size : 0;
  }

  /**
   * Limpia todos los observers
   */
  clearAll() {
    this.observers.clear();
  }
}

// Eventos de autenticación disponibles
const AUTH_EVENTS = {
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_REGISTER: 'user_register',
  PASSWORD_CHANGE: 'password_change',
  LOGIN_ATTEMPT: 'login_attempt',
  LOGIN_FAILED: 'login_failed',
  SESSION_EXPIRED: 'session_expired'
};

// Instancia singleton del AuthObserver
let authObserverInstance = null;

/**
 * Obtiene la instancia singleton del AuthObserver
 * @returns {AuthObserver} - Instancia del observer
 */
function getAuthObserver() {
  if (!authObserverInstance) {
    authObserverInstance = new AuthObserver();
  }
  return authObserverInstance;
}

module.exports = {
  AuthObserver,
  AUTH_EVENTS,
  getAuthObserver
};
