// Índice de modelos - Patrón Singleton para cada modelo
const UserModel = require('./UserModel');
const CommunityModel = require('./CommunityModel');
const ExperienceModel = require('./ExperienceModel');
const ReservationModel = require('./ReservationModel');

// Instancias singleton de los modelos
const models = {
  User: new UserModel(),
  Community: new CommunityModel(),
  Experience: new ExperienceModel(),
  Reservation: new ReservationModel(),
};

// Función para inicializar todos los modelos
async function initializeModels() {
  try {
    const Database = require('../database');
    const Migration = require('../migrations/migration');
    
    // Conectar a la base de datos
    await Database.connect();
    console.log('Database connected successfully');
    
    // Ejecutar migraciones
    const migration = new Migration();
    await migration.runMigrations();
    console.log('Migrations completed successfully');
    
    return models;
  } catch (error) {
    console.error('Failed to initialize models:', error);
    throw error;
  }
}

// Función para cerrar conexiones
async function closeModels() {
  try {
    const Database = require('../database');
    await Database.close();
    console.log('Database connections closed');
  } catch (error) {
    console.error('Error closing database connections:', error);
  }
}

module.exports = {
  models,
  initializeModels,
  closeModels
};
