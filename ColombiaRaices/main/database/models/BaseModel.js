// Modelo base con funcionalidades comunes
const Database = require('../database');

class BaseModel {
  constructor(tableName) {
    this.db = Database;
    this.tableName = tableName;
  }

  // Crear un nuevo registro
  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`;
    const result = await this.db.run(sql, values);
    
    return await this.findById(result.id);
  }

  // Buscar por ID
  async findById(id) {
    const sql = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    return await this.db.get(sql, [id]);
  }

  // Buscar todos los registros
  async findAll(conditions = {}) {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
      sql += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }
    
    return await this.db.all(sql, params);
  }

  // Actualizar registro
  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    
    const sql = `UPDATE ${this.tableName} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    await this.db.run(sql, [...values, id]);
    
    return await this.findById(id);
  }

  // Eliminar registro (soft delete)
  async delete(id) {
    const sql = `UPDATE ${this.tableName} SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    const result = await this.db.run(sql, [id]);
    return result.changes > 0;
  }

  // Eliminar registro permanentemente
  async hardDelete(id) {
    const sql = `DELETE FROM ${this.tableName} WHERE id = ?`;
    const result = await this.db.run(sql, [id]);
    return result.changes > 0;
  }

  // Buscar con paginación
  async findWithPagination(page = 1, limit = 10, conditions = {}) {
    const offset = (page - 1) * limit;
    
    let sql = `SELECT * FROM ${this.tableName}`;
    const params = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
      sql += ` WHERE ${whereClause}`;
      params.push(...Object.values(conditions));
    }
    
    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);
    
    const records = await this.db.all(sql, params);
    
    // Contar total de registros
    let countSql = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const countParams = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions).map(key => `${key} = ?`).join(' AND ');
      countSql += ` WHERE ${whereClause}`;
      countParams.push(...Object.values(conditions));
    }
    
    const totalResult = await this.db.get(countSql, countParams);
    const total = totalResult.total;
    
    return {
      records,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  }
}

module.exports = BaseModel;
