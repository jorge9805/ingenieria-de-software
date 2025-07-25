// Logger - Sistema de logging centralizado para Colombia Raíces
// Sprint 10 Task 9: Refactoring and Optimization
// Logging estructurado para mejorar debugging y monitoreo de performance

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const LOG_COLORS = {
  DEBUG: '\x1b[36m', // Cyan
  INFO: '\x1b[32m',  // Green
  WARN: '\x1b[33m',  // Yellow
  ERROR: '\x1b[31m', // Red
  RESET: '\x1b[0m'
};

class Logger {
  constructor(context = 'APP') {
    this.context = context;
    this.level = process.env.LOG_LEVEL 
      ? LOG_LEVELS[process.env.LOG_LEVEL.toUpperCase()] || LOG_LEVELS.INFO
      : LOG_LEVELS.INFO;
  }

  /**
   * Formatea un mensaje de log con contexto y timestamp
   * @param {string} level - Nivel del log
   * @param {string} message - Mensaje principal
   * @param {Object} metadata - Datos adicionales
   * @returns {string} - Mensaje formateado
   */
  formatMessage(level, message, metadata = {}) {
    const timestamp = new Date().toISOString();
    const color = LOG_COLORS[level] || '';
    const reset = LOG_COLORS.RESET;
    
    let formattedMessage = `${color}[${timestamp}] [${level}] [${this.context}] ${message}${reset}`;
    
    if (Object.keys(metadata).length > 0) {
      formattedMessage += ` ${JSON.stringify(metadata)}`;
    }
    
    return formattedMessage;
  }

  /**
   * Log de debug - solo en desarrollo
   * @param {string} message - Mensaje
   * @param {Object} metadata - Datos adicionales
   */
  debug(message, metadata = {}) {
    if (this.level <= LOG_LEVELS.DEBUG) {
      console.log(this.formatMessage('DEBUG', message, metadata));
    }
  }

  /**
   * Log informativo
   * @param {string} message - Mensaje
   * @param {Object} metadata - Datos adicionales
   */
  info(message, metadata = {}) {
    if (this.level <= LOG_LEVELS.INFO) {
      console.log(this.formatMessage('INFO', message, metadata));
    }
  }

  /**
   * Log de advertencia
   * @param {string} message - Mensaje
   * @param {Object} metadata - Datos adicionales
   */
  warn(message, metadata = {}) {
    if (this.level <= LOG_LEVELS.WARN) {
      console.warn(this.formatMessage('WARN', message, metadata));
    }
  }

  /**
   * Log de error
   * @param {string} message - Mensaje
   * @param {Error|Object} error - Error o metadata
   */
  error(message, error = {}) {
    if (this.level <= LOG_LEVELS.ERROR) {
      const metadata = error instanceof Error 
        ? { 
            name: error.name,
            message: error.message,
            stack: error.stack
          }
        : error;
      
      console.error(this.formatMessage('ERROR', message, metadata));
    }
  }

  /**
   * Log de performance con medición de tiempo
   * @param {string} operation - Nombre de la operación
   * @param {Function} fn - Función a ejecutar
   * @param {Object} metadata - Datos adicionales
   * @returns {Promise<*>} - Resultado de la función
   */
  async performance(operation, fn, metadata = {}) {
    const startTime = Date.now();
    this.debug(`Starting ${operation}`, metadata);
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      
      this.info(`Completed ${operation}`, { 
        ...metadata, 
        duration: `${duration}ms`,
        status: 'success'
      });
      
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      
      this.error(`Failed ${operation}`, {
        ...metadata,
        duration: `${duration}ms`,
        status: 'error',
        error: error.message
      });
      
      throw error;
    }
  }

  /**
   * Crea un logger hijo con contexto específico
   * @param {string} childContext - Contexto del logger hijo
   * @returns {Logger} - Nueva instancia de logger
   */
  child(childContext) {
    return new Logger(`${this.context}.${childContext}`);
  }
}

// Logger por defecto para la aplicación
const logger = new Logger('ColombiaRaices');

// Loggers especializados
const reservationLogger = new Logger('Reservations');
const databaseLogger = new Logger('Database');
const performanceLogger = new Logger('Performance');

module.exports = {
  Logger,
  logger,
  reservationLogger,
  databaseLogger,
  performanceLogger,
  LOG_LEVELS
};
