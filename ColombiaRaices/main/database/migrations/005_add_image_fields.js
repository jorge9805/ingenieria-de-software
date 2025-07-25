// Migración 005: Agregar campos de imagen a communities y experiences
const Database = require('../database');

class Migration005 {
  constructor() {
    this.db = Database;
  }

  async run() {
    try {
      await this.db.connect();
      
      // Agregar campos de imagen a communities
      await this.addImageFieldsToCommunities();
      
      // Agregar campos de imagen a experiences
      await this.addImageFieldsToExperiences();
      
      console.log('Migration 005 completed: image fields added');
    } catch (error) {
      console.error('Migration 005 failed:', error);
      throw error;
    }
  }

  async addImageFieldsToCommunities() {
    try {
      await this.db.run('ALTER TABLE communities ADD COLUMN image_url TEXT');
      await this.db.run('ALTER TABLE communities ADD COLUMN image_alt TEXT');
      console.log('Image fields added to communities table');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('Image fields already exist in communities table');
      } else {
        throw error;
      }
    }
  }

  async addImageFieldsToExperiences() {
    try {
      await this.db.run('ALTER TABLE experiences ADD COLUMN image_url TEXT');
      await this.db.run('ALTER TABLE experiences ADD COLUMN thumbnail_url TEXT');
      await this.db.run('ALTER TABLE experiences ADD COLUMN image_alt TEXT');
      console.log('Image fields added to experiences table');
    } catch (error) {
      if (error.message.includes('duplicate column name')) {
        console.log('Image fields already exist in experiences table');
      } else {
        throw error;
      }
    }
  }
}

module.exports = Migration005;