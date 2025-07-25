// ReservationController - Controlador optimizado para gestión de reservas turísticas
// Sprint 10 Task 9: Refactoring and Optimization
// Eliminación de debug logging y optimización de performance

const ReservationService = require('../services/ReservationService');
const { AuthObserver, AUTH_EVENTS } = require('../utils/AuthObserver');
const { reservationLogger } = require('../utils/Logger');
const { measurePerformance } = require('../utils/PerformanceOptimizer');

/**
 * Controlador principal para operaciones de reservas
 * Implementa logging estructurado y medición de performance
 */
class ReservationController {
  constructor() {
    this.reservationService = new ReservationService();
    this.authObserver = new AuthObserver();
    this.logger = reservationLogger.child('Controller');
  }

  // ============================================
  // 1. VALIDACIÓN Y ESTIMACIÓN DE RESERVAS
  // ============================================

  /**
   * Valida los datos de una reserva con logging estructurado
   * @param {Object} reservationData - Datos de la reserva
   * @returns {Promise<Object>} - Resultado de validación
   */
  async validateReservationData(reservationData) {
    try {
      return await measurePerformance('validateReservationData', async () => {
        const validation = this.reservationService.validateReservationData(reservationData);
        
        this.logger.debug('Reservation data validation completed', {
          isValid: validation.isValid,
          errorCount: validation.errors?.length || 0
        });
        
        return {
          success: true,
          validation: validation
        };
      }, { userId: reservationData.user_id, experienceId: reservationData.experience_id });
    } catch (error) {
      this.logger.error('Reservation data validation failed', error);
      return {
        success: false,
        error: error.message,
        validation: { isValid: false, errors: [error.message] }
      };
    }
  }

  /**
   * Valida la disponibilidad de una experiencia con optimización de performance
   * @param {number} experienceId - ID de la experiencia
   * @param {string} date - Fecha de la reserva
   * @param {number} participants - Número de participantes
   * @returns {Promise<Object>} - Resultado de disponibilidad
   */
  async validateAvailability(experienceId, date, participants) {
    try {
      return await measurePerformance('validateAvailability', async () => {
        const availability = await this.reservationService.validateAvailability(experienceId, date, participants);
        
        this.logger.info('Availability validation completed', {
          experienceId,
          date,
          participants,
          isAvailable: availability.isAvailable,
          availableSpots: availability.availableSpots
        });
        
        return {
          success: true,
          availability: availability
        };
      }, { experienceId, date, participants });
    } catch (error) {
      this.logger.error('Availability validation failed', { experienceId, date, participants, error: error.message });
      return {
        success: false,
        error: error.message,
        availability: { 
          isAvailable: false, 
          errors: [error.message],
          availableSpots: 0,
          maxCapacity: 0
        }
      };
    }
  }  /**
   * Calcula la estimación de una reserva con performance optimizada
   * @param {Object} reservationData - Datos de la reserva
   * @returns {Promise<Object>} - Estimación de la reserva
   */
  async calculateReservationEstimate(reservationData) {
    try {
      return await measurePerformance('calculateReservationEstimate', async () => {
        this.logger.debug('Starting reservation estimate calculation', reservationData);
        
        // Transformar datos del frontend a estructura esperada por el servicio
        let adaptedData = { ...reservationData };
          // Si viene experience_id en lugar de experience, obtener los datos completos
        if (reservationData.experience_id && !reservationData.experience) {
          try {
            const ExperienceServiceSimple = require('../services/ExperienceServiceSimple');
            const experienceService = new ExperienceServiceSimple();
            const experienceData = await experienceService.findById(reservationData.experience_id);
              if (experienceData && experienceData.length > 0) {
              adaptedData.experience = experienceData[0];
              this.logger.debug('Experience data loaded', { 
                experienceId: reservationData.experience_id,
                experienceDataComplete: experienceData[0],
                price: experienceData[0].price,
                priceType: typeof experienceData[0].price,
                experienceTitle: experienceData[0].title,
                experienceKeys: Object.keys(experienceData[0])
              });
            } else {
              throw new Error(`Experience with ID ${reservationData.experience_id} not found`);
            }
          } catch (error) {
            this.logger.error('Failed to load experience data', error);
            throw new Error(`Could not load experience data: ${error.message}`);
          }
        }
        
        // Mapear num_personas a participants
        if (reservationData.num_personas && !reservationData.participants) {
          adaptedData.participants = parseInt(reservationData.num_personas);
        }
        
        // Mapear servicios_adicionales a additional_services
        if (reservationData.servicios_adicionales && !reservationData.additional_services) {
          adaptedData.additional_services = reservationData.servicios_adicionales;
        }
          this.logger.debug('Data adapted for service', { 
          adaptedData,
          experiencePrice: adaptedData.experience?.price,
          experiencePriceType: typeof adaptedData.experience?.price,
          participants: adaptedData.participants,
          participantsType: typeof adaptedData.participants
        });
        
        // Validar datos críticos antes de enviar al servicio
        if (!adaptedData.experience) {
          throw new Error('Experience data is missing after adaptation');
        }
        
        if (!adaptedData.experience.price) {
          this.logger.error('CRITICAL: Experience price is missing!', {
            experienceData: adaptedData.experience,
            originalReservationData: reservationData
          });
          throw new Error('Experience price is missing');
        }
        
        if (!adaptedData.participants) {
          throw new Error('Participants count is missing after adaptation');
        }
        
        const estimate = await this.reservationService.calculateReservationEstimate(adaptedData);
        
        this.logger.info('Reservation estimate calculated', {
          experienceId: adaptedData.experience?.id,
          participants: adaptedData.participants,
          finalTotal: estimate.finalTotal,
          discountApplied: estimate.discountAmount > 0
        });
        
        // Transformar respuesta para compatibilidad con frontend
        const frontendCompatibleEstimate = {
          precio_base: estimate.subtotal,
          servicios_adicionales: estimate.additionalServicesCost,
          total: estimate.finalTotal,
          num_personas: estimate.participants,
          experience_id: adaptedData.experience?.id,
          breakdown: {
            basePrice: estimate.basePrice,
            participants: estimate.participants,
            subtotal: estimate.subtotal,
            additionalServicesCost: estimate.additionalServicesCost,
            discountAmount: estimate.discountAmount,
            finalTotal: estimate.finalTotal
          },
          raw_estimate: estimate // Para debugging
        };
        
        return {
          success: true,
          data: frontendCompatibleEstimate
        };
      }, { experienceId: reservationData.experience_id, participants: reservationData.num_personas });
    } catch (error) {
      this.logger.error('Reservation estimate calculation failed', error);
      return {
        success: false,
        error: error.message,
        data: null
      };
    }
  }

  // ============================================
  // 2. OPERACIONES PRINCIPALES DE RESERVA
  // ============================================

  /**
   * Crea una estimación de reserva con validación completa
   * @param {Object} reservationData - Datos de la reserva
   * @returns {Promise<Object>} - Resultado de creación
   */
  async createReservationEstimate(reservationData) {
    try {
      return await measurePerformance('createReservationEstimate', async () => {
        const reservation = await this.reservationService.createReservationEstimate(reservationData);
        
        this.logger.info('Reservation estimate created', {
          reservationId: reservation.id,
          experienceId: reservationData.experience_id,
          userId: reservationData.user_id,
          totalPrice: reservation.total_price,
          status: reservation.status
        });
        
        return {
          success: true,
          reservation: reservation
        };
      }, { experienceId: reservationData.experience_id, userId: reservationData.user_id });
    } catch (error) {
      this.logger.error('Reservation estimate creation failed', {
        experienceId: reservationData.experience_id,
        userId: reservationData.user_id,
        error: error.message
      });
      return {
        success: false,
        error: error.message,
        reservation: null
      };
    }
  }

  /**
   * Confirma una reserva con validación de estado
   * @param {number} reservationId - ID de la reserva
   * @returns {Promise<Object>} - Resultado de confirmación
   */
  async confirmReservation(reservationId) {
    try {
      return await measurePerformance('confirmReservation', async () => {
        const result = await this.reservationService.confirmReservation(reservationId);
        
        this.logger.info('Reservation confirmed', {
          reservationId,
          success: result.success
        });
        
        return result;
      }, { reservationId });
    } catch (error) {
      this.logger.error('Reservation confirmation failed', { reservationId, error: error.message });
      return {
        success: false,
        error: error.message,
        reservation: null
      };
    }
  }

  /**
   * Cancela una reserva con validación de políticas
   * @param {number} reservationId - ID de la reserva
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} - Resultado de cancelación
   */
  async cancelReservation(reservationId, userId) {
    try {
      return await measurePerformance('cancelReservation', async () => {
        const result = await this.reservationService.cancelReservation(reservationId, userId);
        
        this.logger.info('Reservation cancelled', {
          reservationId,
          userId,
          success: result.success
        });
        
        return {
          success: true,
          result: result
        };
      }, { reservationId, userId });
    } catch (error) {
      this.logger.error('Reservation cancellation failed', { reservationId, userId, error: error.message });
      return {
        success: false,
        error: error.message,
        result: null
      };
    }
  }

  /**
   * Valida si una reserva puede ser cancelada
   * @param {number} reservationId - ID de la reserva
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} - Resultado de validación
   */
  async validateCancellation(reservationId, userId) {
    try {
      const validation = await this.reservationService.validateCancellation(reservationId, userId);
      
      this.logger.debug('Cancellation validation completed', {
        reservationId,
        userId,
        canCancel: validation.canCancel
      });
      
      return {
        success: true,
        validation: validation
      };
    } catch (error) {
      this.logger.error('Cancellation validation failed', { reservationId, userId, error: error.message });
      return {
        success: false,
        error: error.message,
        validation: { canCancel: false, reason: error.message }
      };
    }
  }

  /**
   * Completa una reserva
   * @param {number} reservationId - ID de la reserva
   * @returns {Promise<Object>} - Resultado de completación
   */
  async completeReservation(reservationId) {
    try {
      return await measurePerformance('completeReservation', async () => {
        const reservation = await this.reservationService.completeReservation(reservationId);
        
        this.logger.info('Reservation completed', {
          reservationId,
          success: reservation.success
        });
        
        return {
          success: true,
          reservation: reservation
        };
      }, { reservationId });
    } catch (error) {
      this.logger.error('Reservation completion failed', { reservationId, error: error.message });
      return {
        success: false,
        error: error.message,
        reservation: null
      };
    }
  }

  // ============================================
  // 3. CONSULTAS Y LISTADOS (OPTIMIZADOS)
  // ============================================

  /**
   * Obtiene las reservas de un usuario con información detallada
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} - Lista de reservas
   */
  async getReservationsByUser(userId) {
    try {
      return await measurePerformance('getReservationsByUser', async () => {
        const reservations = await this.reservationService.getReservationsByUser(userId);
        
        this.logger.debug('User reservations retrieved', {
          userId,
          count: reservations.length
        });
        
        return {
          success: true,
          reservations: reservations,
          total: reservations.length
        };
      }, { userId });
    } catch (error) {
      this.logger.error('Failed to get user reservations', { userId, error: error.message });
      return {
        success: false,
        error: error.message,
        reservations: [],
        total: 0
      };
    }
  }

  /**
   * Obtiene los detalles completos de una reserva
   * @param {number} reservationId - ID de la reserva
   * @returns {Promise<Object>} - Detalles de la reserva
   */
  async getReservationDetails(reservationId) {
    try {
      return await measurePerformance('getReservationDetails', async () => {
        const reservation = await this.reservationService.getReservationDetails(reservationId);
        
        this.logger.debug('Reservation details retrieved', {
          reservationId,
          status: reservation.status,
          totalPrice: reservation.pricing?.total_price
        });
        
        return {
          success: true,
          reservation: reservation
        };
      }, { reservationId });
    } catch (error) {
      this.logger.error('Failed to get reservation details', { reservationId, error: error.message });
      return {
        success: false,
        error: error.message,
        reservation: null
      };
    }
  }

  /**
   * Obtiene reservas por estado con conteo optimizado
   * @param {string} status - Estado de las reservas
   * @returns {Promise<Object>} - Lista de reservas
   */
  async getReservationsByStatus(status) {
    try {
      return await measurePerformance('getReservationsByStatus', async () => {
        const reservations = await this.reservationService.getReservationsByStatus(status);
        
        this.logger.debug('Reservations by status retrieved', {
          status,
          count: reservations.length
        });
        
        return {
          success: true,
          reservations: reservations,
          total: reservations.length
        };
      }, { status });
    } catch (error) {
      this.logger.error('Failed to get reservations by status', { status, error: error.message });
      return {
        success: false,
        error: error.message,
        reservations: [],
        total: 0
      };
    }
  }

  /**
   * Obtiene reservas por experiencia
   * @param {number} experienceId - ID de la experiencia
   * @returns {Promise<Object>} - Lista de reservas
   */
  async getReservationsByExperience(experienceId) {
    try {
      return await measurePerformance('getReservationsByExperience', async () => {
        const reservations = await this.reservationService.getReservationsByExperience(experienceId);
        
        this.logger.debug('Experience reservations retrieved', {
          experienceId,
          count: reservations.length
        });
        
        return {
          success: true,
          reservations: reservations,
          total: reservations.length
        };
      }, { experienceId });
    } catch (error) {
      this.logger.error('Failed to get experience reservations', { experienceId, error: error.message });
      return {
        success: false,
        error: error.message,
        reservations: [],
        total: 0
      };
    }
  }

  // ============================================
  // 4. ESTADÍSTICAS Y ANÁLISIS
  // ============================================

  /**
   * Obtiene estadísticas del sistema de reservas
   * @returns {Promise<Object>} - Estadísticas del sistema
   */
  async getReservationStats() {
    try {
      return await measurePerformance('getReservationStats', async () => {
        const stats = await this.reservationService.getReservationStats();
        
        this.logger.info('Reservation statistics retrieved', {
          totalReservations: stats.totalReservations,
          totalRevenue: stats.totalRevenue
        });
        
        return {
          success: true,
          stats: stats
        };
      });
    } catch (error) {
      this.logger.error('Failed to get reservation statistics', error);
      return {
        success: false,
        error: error.message,
        stats: null
      };
    }
  }

  // ============================================
  // 5. MÉTODOS DE UTILIDAD OPTIMIZADOS
  // ============================================

  /**
   * Calcula el precio de un servicio adicional (método optimizado con cache)
   * @param {string} serviceType - Tipo de servicio
   * @param {number} basePrice - Precio base
   * @returns {Promise<Object>} - Precio del servicio
   */
  async calculateServicePrice(serviceType, basePrice) {
    try {
      const price = this.reservationService.calculateServicePrice(serviceType, basePrice);
      
      this.logger.debug('Service price calculated', {
        serviceType,
        basePrice,
        calculatedPrice: price
      });
      
      return {
        success: true,
        price: price,
        serviceType: serviceType
      };
    } catch (error) {
      this.logger.error('Service price calculation failed', { serviceType, basePrice, error: error.message });
      return {
        success: false,
        error: error.message,
        price: 0
      };
    }
  }

  /**
   * Calcula el costo total de servicios adicionales (método optimizado)
   * @param {Array} services - Lista de servicios
   * @param {number} basePrice - Precio base
   * @returns {Promise<Object>} - Información de servicios
   */
  async calculateAdditionalServices(services, basePrice) {
    try {
      const servicesInfo = this.reservationService.calculateAdditionalServices(services, basePrice);
      
      this.logger.debug('Additional services calculated', {
        serviceCount: services.length,
        basePrice,
        totalCost: servicesInfo.totalAdditionalCost
      });
      
      return {
        success: true,
        servicesInfo: servicesInfo
      };
    } catch (error) {
      this.logger.error('Additional services calculation failed', { services, basePrice, error: error.message });
      return {
        success: false,
        error: error.message,
        servicesInfo: { totalAdditionalCost: 0, services: [] }
      };
    }
  }
}

module.exports = ReservationController;
