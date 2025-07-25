// Servicio simple para gestionar experiencias con datos reales
const db = require('../database/database');

class ExperienceServiceSimple {
  constructor() {
    this.db = db;
  }

  // Obtener todas las experiencias con información de comunidad
  async findAll() {
    try {
      await this.db.connect();
      const result = await this.db.all(`
        SELECT 
          e.id, 
          e.title, 
          e.title as nombre,
          e.description, 
          e.description as descripcion,
          e.type, 
          e.type as tipo,
          e.price, 
          e.price as precio,
          e.duration_hours,
          e.duration_hours as duracion_horas,
          e.max_participants, 
          e.image_url,
          e.specific_location,
          e.latitude,
          e.longitude,
          c.name as community_name, 
          c.region as community_region,
          c.latitude as community_latitude,
          c.longitude as community_longitude,
          c.name as ubicacion,
          e.created_at, 
          e.updated_at, 
          e.is_active
        FROM experiences e
        JOIN communities c ON e.community_id = c.id
        WHERE e.is_active = 1
        ORDER BY e.title
      `);
      
      return result;
    } catch (error) {
      console.error('Error fetching experiences:', error);
      throw error;
    }
  }

  // Obtener experiencia por ID
  async findById(id) {
    try {
      await this.db.connect();
      const result = await this.db.all(`
        SELECT 
          e.id, 
          e.title, 
          e.title as nombre,
          e.description, 
          e.description as descripcion,
          e.type, 
          e.type as tipo,
          e.price, 
          e.price as precio,
          e.duration_hours,
          e.duration_hours as duracion_horas,
          e.max_participants, 
          e.image_url, 
          e.thumbnail_url, 
          e.image_alt,
          e.specific_location,
          e.latitude,
          e.longitude,
          c.name as community_name, 
          c.region as community_region,
          c.latitude as community_latitude,
          c.longitude as community_longitude,
          c.id as community_id,
          c.name as ubicacion,
          e.created_at, 
          e.updated_at, 
          e.is_active
        FROM experiences e
        JOIN communities c ON e.community_id = c.id
        WHERE e.id = ? AND e.is_active = 1
      `, [id]);
      
      return result;
    } catch (error) {
      console.error('Error fetching experience:', error);
      throw error;
    }
  }

  // Obtener experiencias por comunidad
  async findByCommunity(communityId) {
    try {
      await this.db.connect();
      const result = await this.db.all(`
        SELECT 
          e.id, 
          e.title, 
          e.title as nombre,
          e.description, 
          e.description as descripcion,
          e.type, 
          e.type as tipo,
          e.price, 
          e.price as precio,
          e.duration_hours,
          e.duration_horas as duracion_horas,
          e.max_participants, 
          e.image_url, 
          e.thumbnail_url, 
          e.image_alt,
          e.specific_location, 
          e.latitude, 
          e.longitude,
          c.name as community_name, 
          c.region as community_region,
          c.latitude as community_latitude,
          c.longitude as community_longitude,
          c.name as ubicacion,
          e.created_at, 
          e.updated_at, 
          e.is_active
        FROM experiences e
        JOIN communities c ON e.community_id = c.id
        WHERE e.community_id = ? AND e.is_active = 1
        ORDER BY e.title
      `, [communityId]);
      
      return result;
    } catch (error) {
      console.error('Error fetching experiences by community:', error);
      throw error;
    }
  }

  // Obtener experiencias por tipo
  async findByType(type) {
    try {
      await this.db.connect();
      const result = await this.db.all(`
        SELECT 
          e.id, 
          e.title, 
          e.title as nombre,
          e.description, 
          e.description as descripcion,
          e.type, 
          e.type as tipo,
          e.price, 
          e.price as precio,
          e.duration_hours,
          e.duration_hours as duracion_horas,
          e.max_participants, 
          e.image_url, 
          e.thumbnail_url, 
          e.image_alt,
          e.specific_location, 
          e.latitude, 
          e.longitude,
          c.name as community_name, 
          c.region as community_region,
          c.latitude as community_latitude,
          c.longitude as community_longitude,
          c.name as ubicacion,
          e.created_at, 
          e.updated_at, 
          e.is_active
        FROM experiences e
        JOIN communities c ON e.community_id = c.id
        WHERE e.type = ? AND e.is_active = 1
        ORDER BY e.title
      `, [type]);
      
      return result;
    } catch (error) {
      console.error('Error fetching experiences by type:', error);
      throw error;
    }
  }

  // Formatear precio en pesos colombianos
  formatPrice(price) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  }

  // Obtener tipos de experiencia únicos
  async getTypes() {
    try {
      await this.db.connect();
      const result = await this.db.all(`
        SELECT DISTINCT type 
        FROM experiences 
        WHERE is_active = 1
        ORDER BY type
      `);
      
      return result.map(t => t.type);
    } catch (error) {
      console.error('Error fetching experience types:', error);
      throw error;
    }
  }

  // Obtener estadísticas de experiencias
  async getStats() {
    try {
      await this.db.connect();
      const result = await this.db.all(`
        SELECT 
          COUNT(*) as total_experiences,
          COUNT(DISTINCT type) as total_types,
          COUNT(DISTINCT community_id) as communities_with_experiences,
          AVG(price) as average_price,
          AVG(duration_hours) as average_duration
        FROM experiences
        WHERE is_active = 1
      `);
      
      return result[0];
    } catch (error) {
      console.error('Error fetching experience stats:', error);
      throw error;
    }
  }

  // Búsqueda filtrada de experiencias
  async findFiltered(filters = {}) {
    try {
      await this.db.connect();
      
      let query = `
        SELECT 
          e.id, 
          e.title, 
          e.title as nombre,
          e.description, 
          e.description as descripcion,
          e.type, 
          e.type as tipo,
          e.price, 
          e.price as precio,
          e.duration_hours,
          e.duration_hours as duracion_horas,
          e.max_participants, 
          e.image_url,
          e.specific_location,
          e.latitude,
          e.longitude,
          c.name as community_name, 
          c.region as community_region,
          c.latitude as community_latitude,
          c.longitude as community_longitude,
          c.name as ubicacion,
          e.created_at, 
          e.updated_at, 
          e.is_active
        FROM experiences e
        JOIN communities c ON e.community_id = c.id
        WHERE e.is_active = 1
      `;
      
      const params = [];
      
      // Filtro por tipo
      if (filters.tipo && filters.tipo !== 'all') {
        query += ` AND e.type = ?`;
        params.push(filters.tipo);
      }
      
      // Filtro por región
      if (filters.region && filters.region !== 'all') {
        query += ` AND c.region = ?`;
        params.push(filters.region);
      }
      
      // Filtro por rango de precio
      if (filters.priceRange && filters.priceRange !== 'all') {
        const [minPrice, maxPrice] = filters.priceRange.split('-');
        if (minPrice) {
          query += ` AND e.price >= ?`;
          params.push(parseFloat(minPrice));
        }
        if (maxPrice) {
          query += ` AND e.price <= ?`;
          params.push(parseFloat(maxPrice));
        }
      }
      
      query += ` ORDER BY e.title`;
      
      const result = await this.db.all(query, params);
      return result;
    } catch (error) {
      console.error('Error filtering experiences:', error);
      throw error;
    }
  }

  // Obtener tipos únicos de experiencias
  async getTypes() {
    try {
      await this.db.connect();
      const result = await this.db.all(`
        SELECT DISTINCT type
        FROM experiences 
        WHERE is_active = 1 AND type IS NOT NULL
        ORDER BY type
      `);
      return result;
    } catch (error) {
      console.error('Error fetching experience types:', error);
      throw error;
    }
  }

  // Obtener regiones únicas
  async getRegions() {
    try {
      await this.db.connect();
      const result = await this.db.all(`
        SELECT DISTINCT region
        FROM communities 
        WHERE region IS NOT NULL
        ORDER BY region
      `);
      return result;
    } catch (error) {
      console.error('Error fetching regions:', error);
      throw error;
    }
  }

  // Obtener rangos de precios dinámicos
  async getPriceRanges() {
    try {
      await this.db.connect();
      const result = await this.db.all(`
        SELECT 
          MIN(price) as min_price,
          MAX(price) as max_price,
          COUNT(*) as total_experiences
        FROM experiences 
        WHERE is_active = 1 AND price IS NOT NULL AND price > 0
      `);
      
      if (result.length === 0 || !result[0].min_price || !result[0].max_price) {
        return {
          ranges: [
            { label: 'Económico', min: 0, max: 100000 },
            { label: 'Medio', min: 100001, max: 200000 },
            { label: 'Premium', min: 200001, max: 500000 }
          ]
        };
      }
      
      const minPrice = parseFloat(result[0].min_price);
      const maxPrice = parseFloat(result[0].max_price);
      const range = maxPrice - minPrice;
      
      // Calcular los 3 rangos equitativos
      const firstRangeMax = Math.floor(minPrice + (range * 0.33));
      const secondRangeMax = Math.floor(minPrice + (range * 0.66));
      
      const ranges = [
        {
          label: 'Económico',
          min: minPrice,
          max: firstRangeMax,
          displayMin: this.formatPriceSimple(minPrice),
          displayMax: this.formatPriceSimple(firstRangeMax)
        },
        {
          label: 'Medio',
          min: firstRangeMax + 1,
          max: secondRangeMax,
          displayMin: this.formatPriceSimple(firstRangeMax + 1),
          displayMax: this.formatPriceSimple(secondRangeMax)
        },
        {
          label: 'Premium',
          min: secondRangeMax + 1,
          max: maxPrice,
          displayMin: this.formatPriceSimple(secondRangeMax + 1),
          displayMax: this.formatPriceSimple(maxPrice)
        }
      ];
      
      return { ranges, minPrice, maxPrice };
    } catch (error) {
      console.error('Error fetching price ranges:', error);
      throw error;
    }
  }

  // Formatear precio simple
  formatPriceSimple(price) {
    if (!price) return '0';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }
}

module.exports = ExperienceServiceSimple;
