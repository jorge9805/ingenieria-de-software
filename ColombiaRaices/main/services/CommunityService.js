// Servicio para gestionar comunidades
const db = require('../database/database');

class CommunityService {
  constructor() {
    this.db = db;
  }

  // Obtener todas las comunidades
  async findAll() {
    try {
      await this.db.connect();
      const result = await this.db.all(`
        SELECT id, name, region, description, contact_email, contact_phone, 
               address, image_url, 
               created_at, updated_at, is_active 
        FROM communities 
        WHERE is_active = 1
        ORDER BY name
      `);
      
      return result;
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw error;
    }
  }

  // Obtener una comunidad por ID
  async findById(id) {
    try {
      await this.db.connect();
      const result = await this.db.all(`
        SELECT id, name, region, description, contact_email, contact_phone, 
               address, image_url, 
               created_at, updated_at, is_active 
        FROM communities 
        WHERE id = ? AND is_active = 1
      `, [id]);
      
      return result[0] || null;
    } catch (error) {
      console.error('Error fetching community:', error);
      throw error;
    }
  }

  // Obtener comunidades por región
  async findByRegion(region) {
    try {
      await this.db.connect();
      const result = await this.db.all(`
        SELECT id, name, region, description, contact_email, contact_phone, 
               address, image_url, 
               created_at, updated_at, is_active 
        FROM communities 
        WHERE region LIKE ? AND is_active = 1
        ORDER BY name
      `, [`%${region}%`]);
      
      return result;
    } catch (error) {
      console.error('Error fetching communities by region:', error);
      throw error;
    }
  }

  // Obtener estadísticas de comunidades
  async getStats() {
    try {
      await this.db.connect();
      const result = await this.db.all(`
        SELECT 
          COUNT(*) as total_communities,
          COUNT(DISTINCT region) as total_regions,
          COUNT(CASE WHEN is_active = 1 THEN 1 END) as active_communities
        FROM communities
      `);
      
      return result[0];
    } catch (error) {
      console.error('Error fetching community stats:', error);
      throw error;
    }
  }
}

module.exports = CommunityService;