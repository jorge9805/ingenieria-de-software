// Migración 006: Agregar campos de ubicación específica a experiences
const Database = require('../database');

class Migration006 {
  constructor() {
    this.db = Database;
  }

  async run() {
    try {
      await this.db.connect();
      
      // Agregar campos de ubicación específica a experiences
      await this.addLocationFieldsToExperiences();
      
      console.log('Migration 006 completed: location fields added to experiences');
    } catch (error) {
      console.error('Migration 006 failed:', error);
      throw error;
    }
  }

  async addLocationFieldsToExperiences() {
    try {
      // Ubicación específica (texto libre)
      await this.db.run('ALTER TABLE experiences ADD COLUMN specific_location TEXT');
      console.log('Added specific_location field to experiences table');
      
      // Coordenadas específicas para mapas futuros
      await this.db.run('ALTER TABLE experiences ADD COLUMN latitude REAL');
      await this.db.run('ALTER TABLE experiences ADD COLUMN longitude REAL');
      console.log('Added latitude/longitude fields to experiences table');
      
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('Location fields already exist in experiences table');
      } else {
        throw error;
      }
    }
  }
}

module.exports = Migration006;
