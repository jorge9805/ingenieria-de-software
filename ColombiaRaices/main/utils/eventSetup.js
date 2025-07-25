// Ejemplo de uso del patrón Observer en la aplicación
const { EventObserver, APP_EVENTS } = require('./observer');

// Configurar listeners para eventos de aplicación
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Listener para eventos de usuario
  EventObserver.subscribe(APP_EVENTS.USER_LOGIN, (data) => {
    console.log(`Usuario ${data.email} ha iniciado sesión`);
  });

  EventObserver.subscribe(APP_EVENTS.USER_LOGOUT, (data) => {
    console.log(`Usuario ${data.userId} ha cerrado sesión`);
  });

  EventObserver.subscribe(APP_EVENTS.USER_REGISTER, (data) => {
    console.log(`Nuevo usuario registrado: ${data.email} (${data.userType})`);
  });

  // Listener para eventos de experiencias
  EventObserver.subscribe(APP_EVENTS.EXPERIENCE_CREATED, (data) => {
    console.log(`Nueva experiencia creada: ${data.title}`);
  });

  EventObserver.subscribe(APP_EVENTS.EXPERIENCE_UPDATED, (data) => {
    console.log(`Experiencia actualizada: ${data.title}`);
  });

  EventObserver.subscribe(APP_EVENTS.EXPERIENCE_DELETED, (data) => {
    console.log(`Experiencia eliminada: ${data.title}`);
  });

  // Listener para eventos de reservas
  EventObserver.subscribe(APP_EVENTS.RESERVATION_CREATED, (data) => {
    console.log(`Nueva reserva creada: ${data.experienceTitle} para ${data.participants} personas`);
  });

  EventObserver.subscribe(APP_EVENTS.RESERVATION_UPDATED, (data) => {
    console.log(`Reserva actualizada: ${data.id} - Status: ${data.status}`);
  });

  EventObserver.subscribe(APP_EVENTS.RESERVATION_CANCELLED, (data) => {
    console.log(`Reserva cancelada: ${data.id}`);
  });

  // Listener para eventos de base de datos
  EventObserver.subscribe(APP_EVENTS.DATABASE_CONNECTED, () => {
    console.log('Base de datos conectada exitosamente');
  });

  EventObserver.subscribe(APP_EVENTS.DATABASE_ERROR, (error) => {
    console.error('Error en la base de datos:', error);
  });

  // Listener para eventos de aplicación
  EventObserver.subscribe(APP_EVENTS.APP_READY, () => {
    console.log('Aplicación Colombia Raíces lista para usar');
  });

  EventObserver.subscribe(APP_EVENTS.WINDOW_CLOSED, () => {
    console.log('Ventana principal cerrada');
  });
  
  console.log('Event listeners configured successfully');
}

module.exports = {
  setupEventListeners
};
