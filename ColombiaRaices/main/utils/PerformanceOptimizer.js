// PerformanceOptimizer - Utilidades para optimización de performance
// Sprint 10 Task 9: Refactoring and Optimization
// Herramientas para cache, memoization y optimización de cálculos

const { performanceLogger } = require('./Logger');

/**
 * Cache simple en memoria para resultados de cálculos
 */
class SimpleCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) { // 5 minutos por defecto
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }

  /**
   * Genera clave de cache basada en parámetros
   * @param {string} prefix - Prefijo de la clave
   * @param {...any} params - Parámetros para la clave
   * @returns {string} - Clave única
   */
  generateKey(prefix, ...params) {
    return `${prefix}:${JSON.stringify(params)}`;
  }

  /**
   * Obtiene un valor del cache
   * @param {string} key - Clave
   * @returns {any|null} - Valor o null si no existe/expiró
   */
  get(key) {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    // Verificar si expiró
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value;
  }

  /**
   * Almacena un valor en el cache
   * @param {string} key - Clave
   * @param {any} value - Valor
   */
  set(key, value) {
    // Si el cache está lleno, eliminar el más antiguo
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, {
      value,
      expiry: Date.now() + this.ttl
    });
  }

  /**
   * Limpia el cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Obtiene estadísticas del cache
   * @returns {Object} - Estadísticas
   */
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl
    };
  }
}

/**
 * Memoización con cache temporal para funciones
 */
class MemoizedFunction {
  constructor(fn, cacheInstance = null) {
    this.fn = fn;
    this.cache = cacheInstance || new SimpleCache();
    this.stats = {
      hits: 0,
      misses: 0
    };
  }

  /**
   * Ejecuta la función con memoización
   * @param {...any} args - Argumentos de la función
   * @returns {any} - Resultado de la función
   */
  async execute(...args) {
    const key = this.cache.generateKey('memoized', ...args);
    
    // Intentar obtener del cache
    const cached = this.cache.get(key);
    if (cached !== null) {
      this.stats.hits++;
      performanceLogger.debug('Cache hit', { key, hits: this.stats.hits });
      return cached;
    }

    // Ejecutar función y cachear resultado
    this.stats.misses++;
    const result = await this.fn(...args);
    this.cache.set(key, result);
    
    performanceLogger.debug('Cache miss', { key, misses: this.stats.misses });
    return result;
  }

  /**
   * Obtiene estadísticas de la función memoizada
   * @returns {Object} - Estadísticas
   */
  getStats() {
    const total = this.stats.hits + this.stats.misses;
    return {
      ...this.stats,
      total,
      hitRatio: total > 0 ? (this.stats.hits / total * 100).toFixed(2) + '%' : '0%'
    };
  }
}

/**
 * Optimizador de cálculos complejos
 */
class CalculationOptimizer {
  constructor() {
    this.cache = new SimpleCache(50, 10 * 60 * 1000); // 10 minutos para cálculos
  }

  /**
   * Optimiza cálculos de precios con cache
   * @param {Object} reservationData - Datos de la reserva
   * @param {Function} calculationFn - Función de cálculo
   * @returns {Promise<Object>} - Resultado optimizado
   */
  async optimizePriceCalculation(reservationData, calculationFn) {
    const cacheKey = this.cache.generateKey('price_calc', 
      reservationData.experience?.id,
      reservationData.participants,
      reservationData.additional_services
    );

    // Verificar cache
    const cached = this.cache.get(cacheKey);
    if (cached) {
      performanceLogger.debug('Price calculation cache hit', { cacheKey });
      return {
        ...cached,
        cached: true,
        calculationTime: 0
      };
    }

    // Ejecutar cálculo con medición de tiempo
    const startTime = Date.now();
    const result = await calculationFn(reservationData);
    const calculationTime = Date.now() - startTime;

    // Cachear resultado
    this.cache.set(cacheKey, result);
    
    performanceLogger.info('Price calculation completed', {
      cacheKey,
      calculationTime: `${calculationTime}ms`,
      cached: false
    });

    return {
      ...result,
      cached: false,
      calculationTime
    };
  }

  /**
   * Optimiza consultas de disponibilidad
   * @param {number} experienceId - ID de la experiencia
   * @param {string} date - Fecha
   * @param {Function} availabilityFn - Función de consulta
   * @returns {Promise<Object>} - Resultado optimizado
   */
  async optimizeAvailabilityCheck(experienceId, date, availabilityFn) {
    const cacheKey = this.cache.generateKey('availability', experienceId, date);
    
    const cached = this.cache.get(cacheKey);
    if (cached) {
      performanceLogger.debug('Availability check cache hit', { experienceId, date });
      return cached;
    }

    const result = await availabilityFn(experienceId, date);
    
    // Cache solo si hay disponibilidad (evitar cachear errores)
    if (result.isAvailable !== undefined) {
      this.cache.set(cacheKey, result);
      performanceLogger.debug('Availability cached', { experienceId, date });
    }

    return result;
  }

  /**
   * Limpia caches relacionados con una experiencia
   * @param {number} experienceId - ID de la experiencia
   */
  invalidateExperienceCache(experienceId) {
    const keys = Array.from(this.cache.cache.keys())
      .filter(key => key.includes(`experience_${experienceId}`) || key.includes(`:${experienceId}:`));
    
    keys.forEach(key => this.cache.cache.delete(key));
    
    performanceLogger.info('Experience cache invalidated', { 
      experienceId, 
      keysCleared: keys.length 
    });
  }
}

/**
 * Factory para crear funciones memoizadas
 */
const memoize = (fn, cache = null) => {
  return new MemoizedFunction(fn, cache);
};

/**
 * Medidor de performance para operaciones
 */
const measurePerformance = async (operationName, fn, metadata = {}) => {
  return performanceLogger.performance(operationName, fn, metadata);
};

// Instancia global del optimizador
const calculationOptimizer = new CalculationOptimizer();

module.exports = {
  SimpleCache,
  MemoizedFunction,
  CalculationOptimizer,
  calculationOptimizer,
  memoize,
  measurePerformance
};
