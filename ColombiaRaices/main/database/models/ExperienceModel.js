// Modelo de Experiencia
const BaseModel = require('./BaseModel');

class ExperienceModel extends BaseModel {
  constructor() {
    super('experiences');
  }  // Buscar experiencias con información de comunidad
  async findWithCommunity(conditions = {}) {
    let sql = `
      SELECT e.*, 
             c.name as community_name, 
             c.region as community_region,
             c.latitude as community_latitude,
             c.longitude as community_longitude
      FROM ${this.tableName} e
      INNER JOIN communities c ON e.community_id = c.id
      WHERE e.is_active = 1 AND c.is_active = 1
    `;
    
    const params = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions).map(key => `e.${key} = ?`).join(' AND ');
      sql += ` AND ${whereClause}`;
      params.push(...Object.values(conditions));
    }
    
    sql += ` ORDER BY e.created_at DESC`;
    
    return await this.db.all(sql, params);
  }

  // Buscar experiencias por tipo
  async findByType(type) {
    return await this.findWithCommunity({ type });
  }
  // Buscar experiencias por operador
  async findByOperator(operatorId) {
    return await this.findWithCommunity({ operator_id: operatorId });
  }  // Buscar TODAS las experiencias por operador (incluyendo pendientes)
  async findAllByOperator(operatorId) {
    let sql = `
      SELECT e.*, 
             c.name as community_name, 
             c.region as community_region,
             c.latitude as community_latitude,
             c.longitude as community_longitude
      FROM ${this.tableName} e
      INNER JOIN communities c ON e.community_id = c.id
      WHERE e.operator_id = ? AND c.is_active = 1
      ORDER BY e.created_at DESC
    `;
    
    return await this.db.all(sql, [operatorId]);
  }

  // Buscar experiencias por comunidad
  async findByCommunity(communityId) {
    return await this.findWithCommunity({ community_id: communityId });
  }
  // Buscar experiencias por rango de precio
  async findByPriceRange(minPrice, maxPrice) {
    const sql = `
      SELECT e.*, 
             c.name as community_name, 
             c.region as community_region,
             c.latitude as community_latitude,
             c.longitude as community_longitude
      FROM ${this.tableName} e
      INNER JOIN communities c ON e.community_id = c.id
      WHERE e.is_active = 1 
      AND c.is_active = 1
      AND e.price >= ? 
      AND e.price <= ?
      ORDER BY e.price ASC
    `;
    
    return await this.db.all(sql, [minPrice, maxPrice]);
  }
  // Buscar experiencias por duración
  async findByDuration(minHours, maxHours) {
    const sql = `
      SELECT e.*, 
             c.name as community_name, 
             c.region as community_region,
             c.latitude as community_latitude,
             c.longitude as community_longitude
      FROM ${this.tableName} e
      INNER JOIN communities c ON e.community_id = c.id
      WHERE e.is_active = 1 
      AND c.is_active = 1
      AND e.duration_hours >= ? 
      AND e.duration_hours <= ?
      ORDER BY e.duration_hours ASC
    `;
    
    return await this.db.all(sql, [minHours, maxHours]);
  }
  // Buscar experiencias populares (con más reservas)
  async findPopular(limit = 10) {
    const sql = `
      SELECT e.*, 
             c.name as community_name, 
             c.region as community_region,
             c.latitude as community_latitude,
             c.longitude as community_longitude,
             COUNT(r.id) as reservations_count
      FROM ${this.tableName} e
      INNER JOIN communities c ON e.community_id = c.id
      LEFT JOIN reservations r ON e.id = r.experience_id AND r.status = 'confirmed'
      WHERE e.is_active = 1 AND c.is_active = 1
      GROUP BY e.id
      ORDER BY reservations_count DESC
      LIMIT ?
    `;
    
    return await this.db.all(sql, [limit]);
  }
  // Buscar experiencias recientes
  async findRecent(limit = 10) {
    const sql = `
      SELECT e.*, 
             c.name as community_name, 
             c.region as community_region,
             c.latitude as community_latitude,
             c.longitude as community_longitude
      FROM ${this.tableName} e
      INNER JOIN communities c ON e.community_id = c.id
      WHERE e.is_active = 1 AND c.is_active = 1
      ORDER BY e.created_at DESC
      LIMIT ?
    `;
    
    return await this.db.all(sql, [limit]);
  }
  // Buscar experiencias por región
  async findByRegion(region) {
    const sql = `
      SELECT e.*, 
             c.name as community_name, 
             c.region as community_region,
             c.latitude as community_latitude,
             c.longitude as community_longitude
      FROM ${this.tableName} e
      INNER JOIN communities c ON e.community_id = c.id
      WHERE e.is_active = 1 
      AND c.is_active = 1
      AND c.region = ?
      ORDER BY e.created_at DESC
    `;
    
    return await this.db.all(sql, [region]);
  }
  // Buscar experiencias disponibles en una fecha
  async findAvailableOn(date) {
    const sql = `
      SELECT e.*, 
             c.name as community_name, 
             c.region as community_region,
             c.latitude as community_latitude,
             c.longitude as community_longitude,
             COALESCE(SUM(r.participants), 0) as reserved_participants
      FROM ${this.tableName} e
      INNER JOIN communities c ON e.community_id = c.id
      LEFT JOIN reservations r ON e.id = r.experience_id 
                               AND DATE(r.reservation_date) = DATE(?)
                               AND r.status = 'confirmed'
      WHERE e.is_active = 1 AND c.is_active = 1
      GROUP BY e.id
      HAVING (e.max_participants - COALESCE(reserved_participants, 0)) > 0
      ORDER BY e.title
    `;
    
    return await this.db.all(sql, [date]);
  }

  // Obtener estadísticas de experiencias
  async getStats() {
    const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName} WHERE is_active = 1`;
    const byTypeSql = `
      SELECT type, COUNT(*) as count 
      FROM ${this.tableName} 
      WHERE is_active = 1 
      GROUP BY type
    `;
    const avgPriceSql = `SELECT AVG(price) as average_price FROM ${this.tableName} WHERE is_active = 1`;
    
    const total = await this.db.get(totalSql);
    const byType = await this.db.all(byTypeSql);
    const avgPrice = await this.db.get(avgPriceSql);
    
    return {
      total: total.total,
      byType,
      averagePrice: avgPrice.average_price
    };
  }  // Buscar experiencias pendientes (para aprobación de administrador)
  async findPendingExperiences() {
    const sql = `
      SELECT e.*, 
             c.name as community_name, 
             c.region as community_region,
             c.latitude as community_latitude,
             c.longitude as community_longitude,
             u.name as operator_name, 
             u.email as operator_email
      FROM ${this.tableName} e
      INNER JOIN communities c ON e.community_id = c.id
      INNER JOIN users u ON e.operator_id = u.id
      WHERE e.is_active = 0 AND c.is_active = 1 AND u.is_active = 1 AND u.user_type = 'operador'
      ORDER BY e.created_at DESC
    `;
    
    return await this.db.all(sql);
  }
}

module.exports = ExperienceModel;
