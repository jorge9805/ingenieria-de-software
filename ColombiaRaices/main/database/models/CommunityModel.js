// Modelo de Comunidad
const BaseModel = require('./BaseModel');

class CommunityModel extends BaseModel {
  constructor() {
    super('communities');
  }

  // Buscar comunidades por región
  async findByRegion(region) {
    return await this.findAll({ region, is_active: 1 });
  }

  // Buscar comunidades activas
  async findActive() {
    return await this.findAll({ is_active: 1 });
  }

  // Buscar comunidades con coordenadas
  async findWithLocation() {
    const sql = `
      SELECT * FROM ${this.tableName} 
      WHERE latitude IS NOT NULL 
      AND longitude IS NOT NULL 
      AND is_active = 1
    `;
    return await this.db.all(sql);
  }

  // Buscar comunidades cercanas a una ubicación
  async findNearby(latitude, longitude, radiusKm = 50) {
    const sql = `
      SELECT *,
        (6371 * acos(
          cos(radians(?)) * cos(radians(latitude)) * 
          cos(radians(longitude) - radians(?)) + 
          sin(radians(?)) * sin(radians(latitude))
        )) AS distance
      FROM ${this.tableName}
      WHERE latitude IS NOT NULL 
      AND longitude IS NOT NULL 
      AND is_active = 1
      HAVING distance < ?
      ORDER BY distance
    `;
    
    return await this.db.all(sql, [latitude, longitude, latitude, radiusKm]);
  }

  // Buscar comunidades con experiencias
  async findWithExperiences() {
    const sql = `
      SELECT c.*, COUNT(e.id) as experiences_count
      FROM ${this.tableName} c
      LEFT JOIN experiences e ON c.id = e.community_id AND e.is_active = 1
      WHERE c.is_active = 1
      GROUP BY c.id
      ORDER BY experiences_count DESC
    `;
    return await this.db.all(sql);
  }

  // Actualizar coordenadas
  async updateLocation(id, latitude, longitude) {
    return await this.update(id, { latitude, longitude });
  }

  // Buscar por nombre (búsqueda parcial)
  async searchByName(searchTerm) {
    const sql = `
      SELECT * FROM ${this.tableName} 
      WHERE name LIKE ? 
      AND is_active = 1
      ORDER BY name
    `;
    return await this.db.all(sql, [`%${searchTerm}%`]);
  }

  // Obtener estadísticas de comunidades
  async getStats() {
    const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE is_active = 1`;
    const regionsSql = `
      SELECT region, COUNT(*) as count 
      FROM ${this.tableName} 
      WHERE is_active = 1 
      GROUP BY region
    `;
    
    const total = await this.db.get(totalSql);
    const byRegion = await this.db.all(regionsSql);
    
    return {
      total: total.total,
      byRegion
    };
  }
}

module.exports = CommunityModel;
