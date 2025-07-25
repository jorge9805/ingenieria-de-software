// Patrón Observer para gestión de eventos de aplicación
class EventObserver {
  constructor() {
    if (EventObserver.instance) {
      return EventObserver.instance;
    }
    
    this.observers = new Map();
    EventObserver.instance = this;
  }

  // Suscribir un observer a un evento
  subscribe(event, callback) {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    
    this.observers.get(event).push(callback);
    
    // Retornar función para desuscribir
    return () => {
      this.unsubscribe(event, callback);
    };
  }

  // Desuscribir un observer de un evento
  unsubscribe(event, callback) {
    if (this.observers.has(event)) {
      const callbacks = this.observers.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
      
      // Si no quedan callbacks, eliminar el evento
      if (callbacks.length === 0) {
        this.observers.delete(event);
      }
    }
  }

  // Notificar a todos los observers de un evento
  notify(event, data) {
    if (this.observers.has(event)) {
      this.observers.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in observer for event ${event}:`, error);
        }
      });
    }
  }

  // Obtener lista de eventos suscritos
  getEvents() {
    return Array.from(this.observers.keys());
  }

  // Obtener número de observers para un evento
  getObserverCount(event) {
    return this.observers.has(event) ? this.observers.get(event).length : 0;
  }

  // Limpiar todos los observers
  clear() {
    this.observers.clear();
  }
}

// Eventos predefinidos de la aplicación
const APP_EVENTS = {
  USER_LOGIN: 'user:login',
  USER_LOGOUT: 'user:logout',
  USER_REGISTER: 'user:register',
  EXPERIENCE_CREATED: 'experience:created',
  EXPERIENCE_UPDATED: 'experience:updated',
  EXPERIENCE_DELETED: 'experience:deleted',
  RESERVATION_CREATED: 'reservation:created',
  RESERVATION_UPDATED: 'reservation:updated',
  RESERVATION_CANCELLED: 'reservation:cancelled',
  COMMUNITY_UPDATED: 'community:updated',
  DATABASE_CONNECTED: 'database:connected',
  DATABASE_ERROR: 'database:error',
  APP_READY: 'app:ready',
  WINDOW_CLOSED: 'window:closed',
};

// Exportar instancia singleton y constantes
module.exports = {
  EventObserver: new EventObserver(),
  APP_EVENTS,
};
