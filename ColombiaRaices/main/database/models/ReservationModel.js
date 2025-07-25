// Modelo de Reserva
const BaseModel = require('./BaseModel');

class ReservationModel extends BaseModel {
  constructor() {
    super('reservations');
  }

  // Buscar reservas con información completa
  async findWithDetails(conditions = {}) {
    let sql = `
      SELECT r.*, 
             e.title as experience_title, 
             e.price as experience_price,
             e.duration_hours,
             c.name as community_name,
             c.region as community_region,
             u.name as user_name,
             u.email as user_email
      FROM ${this.tableName} r
      INNER JOIN experiences e ON r.experience_id = e.id
      INNER JOIN communities c ON e.community_id = c.id
      INNER JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (Object.keys(conditions).length > 0) {
      const whereClause = Object.keys(conditions).map(key => `r.${key} = ?`).join(' AND ');
      sql += ` AND ${whereClause}`;
      params.push(...Object.values(conditions));
    }
    
    sql += ` ORDER BY r.created_at DESC`;
    
    return await this.db.all(sql, params);
  }

  // Buscar reservas por usuario
  async findByUser(userId) {
    return await this.findWithDetails({ user_id: userId });
  }

  // Buscar reservas por experiencia
  async findByExperience(experienceId) {
    return await this.findWithDetails({ experience_id: experienceId });
  }

  // Buscar reservas por estado
  async findByStatus(status) {
    return await this.findWithDetails({ status });
  }

  // Buscar reservas por fecha
  async findByDate(date) {
    const sql = `
      SELECT r.*, 
             e.title as experience_title, 
             e.price as experience_price,
             e.duration_hours,
             c.name as community_name,
             c.region as community_region,
             u.name as user_name,
             u.email as user_email
      FROM ${this.tableName} r
      INNER JOIN experiences e ON r.experience_id = e.id
      INNER JOIN communities c ON e.community_id = c.id
      INNER JOIN users u ON r.user_id = u.id
      WHERE DATE(r.reservation_date) = DATE(?)
      ORDER BY r.reservation_date ASC
    `;
    
    return await this.db.all(sql, [date]);
  }

  // Buscar reservas de un operador
  async findByOperator(operatorId) {
    const sql = `
      SELECT r.*, 
             e.title as experience_title, 
             e.price as experience_price,
             e.duration_hours,
             c.name as community_name,
             c.region as community_region,
             u.name as user_name,
             u.email as user_email
      FROM ${this.tableName} r
      INNER JOIN experiences e ON r.experience_id = e.id
      INNER JOIN communities c ON e.community_id = c.id
      INNER JOIN users u ON r.user_id = u.id
      WHERE e.operator_id = ?
      ORDER BY r.created_at DESC
    `;
    
    return await this.db.all(sql, [operatorId]);
  }

  // Buscar reservas próximas
  async findUpcoming(days = 7) {
    const sql = `
      SELECT r.*, 
             e.title as experience_title, 
             e.price as experience_price,
             e.duration_hours,
             c.name as community_name,
             c.region as community_region,
             u.name as user_name,
             u.email as user_email
      FROM ${this.tableName} r
      INNER JOIN experiences e ON r.experience_id = e.id
      INNER JOIN communities c ON e.community_id = c.id
      INNER JOIN users u ON r.user_id = u.id
      WHERE r.reservation_date >= DATE('now') 
      AND r.reservation_date <= DATE('now', '+' || ? || ' days')
      AND r.status = 'confirmed'
      ORDER BY r.reservation_date ASC
    `;
    
    return await this.db.all(sql, [days]);
  }  // Verificar disponibilidad
  async checkAvailability(experienceId, date, participants) {
    // Ensure date is in consistent format (YYYY-MM-DD)
    const dateStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
    
    const sql = `
      SELECT e.max_participants,
             COALESCE(SUM(r.participants), 0) as reserved_participants
      FROM experiences e
      LEFT JOIN reservations r ON e.id = r.experience_id 
                               AND DATE(r.reservation_date) = DATE(?)
                               AND r.status = 'confirmed'
      WHERE e.id = ? AND e.is_active = 1
      GROUP BY e.id
    `;
    
    const result = await this.db.get(sql, [dateStr, experienceId]);
    
    if (!result) {
      return { available: false, reason: 'Experience not found' };
    }
    
    const availableSpots = result.max_participants - result.reserved_participants;
    const isAvailable = availableSpots >= participants;
    
    return {
      available: isAvailable,
      availableSpots,
      maxParticipants: result.max_participants,
      reservedParticipants: result.reserved_participants
    };
  }

  // Crear reserva con verificación de disponibilidad
  async createReservation(reservationData) {
    const { experience_id, reservation_date, participants } = reservationData;
    
    // Verificar disponibilidad
    const availability = await this.checkAvailability(experience_id, reservation_date, participants);
    
    if (!availability.available) {
      throw new Error('No hay suficientes espacios disponibles');
    }
    
    // Crear la reserva
    return await this.create(reservationData);
  }

  // Confirmar reserva
  async confirm(id) {
    return await this.update(id, { status: 'confirmed' });
  }

  // Cancelar reserva
  async cancel(id) {
    return await this.update(id, { status: 'cancelled' });
  }

  // Obtener estadísticas de reservas
  async getStats() {
    const totalSql = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const byStatusSql = `
      SELECT status, COUNT(*) as count 
      FROM ${this.tableName} 
      GROUP BY status
    `;
    const revenueSql = `
      SELECT SUM(total_price) as total_revenue 
      FROM ${this.tableName} 
      WHERE status = 'confirmed'
    `;
    
    const total = await this.db.get(totalSql);
    const byStatus = await this.db.all(byStatusSql);
    const revenue = await this.db.get(revenueSql);
    
    return {
      total: total.total,
      byStatus,
      totalRevenue: revenue.total_revenue || 0
    };
  }
  // Obtener reservas por mes
  async getMonthlyStats(year) {
    const sql = `
      SELECT strftime('%m', reservation_date) as month,
             COUNT(*) as reservations_count,
             SUM(total_price) as revenue
      FROM ${this.tableName}
      WHERE strftime('%Y', reservation_date) = ?
      AND status = 'confirmed'
      GROUP BY month
      ORDER BY month
    `;
    
    return await this.db.all(sql, [year.toString()]);
  }

  // Obtener estadísticas generales del sistema
  async getStats() {
    const sql = `
      SELECT 
        COUNT(*) as total_reservations,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_reservations,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_reservations,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_reservations,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_reservations,
        COALESCE(SUM(total_price), 0) as total_revenue,
        COALESCE(AVG(total_price), 0) as average_reservation_value,
        COALESCE(SUM(participants), 0) as total_participants
      FROM ${this.tableName}
    `;
    
    const result = await this.db.get(sql);
    return result || {
      total_reservations: 0,
      pending_reservations: 0,
      confirmed_reservations: 0,
      cancelled_reservations: 0,
      completed_reservations: 0,
      total_revenue: 0,
      average_reservation_value: 0,
      total_participants: 0
    };
  }
}

module.exports = ReservationModel;
