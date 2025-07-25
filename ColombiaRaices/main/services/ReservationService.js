// ReservationService - Servicio optimizado de reservas con performance mejorada
// Sprint 10 Task 9: Refactoring and Optimization  
// Implementación optimizada con cache, logging estructurado y documentación completa

const ReservationModel = require('../database/models/ReservationModel');
const ExperienceModel = require('../database/models/ExperienceModel');
const ExperienceService = require('./ExperienceService');
const { reservationLogger } = require('../utils/Logger');
const { calculationOptimizer, measurePerformance } = require('../utils/PerformanceOptimizer');

/**
 * Servicio principal de reservas con optimizaciones de performance
 * 
 * Características principales:
 * - Cache inteligente para cálculos complejos
 * - Logging estructurado para debugging
 * - Validaciones robustas con mensajes específicos
 * - Optimización de consultas a base de datos
 * - Medición de performance en operaciones críticas
 * 
 * @class ReservationService
 */
class ReservationService {
  constructor() {
    this.reservationModel = new ReservationModel();
    this.experienceModel = new ExperienceModel();
    this.experienceService = new ExperienceService();
    this.logger = reservationLogger.child('Service');
    
    // Configuración de cache para optimización
    this.cacheConfig = {
      priceCalculations: true,
      availabilityChecks: true,
      experienceData: true
    };
    
    this.logger.info('ReservationService initialized', {
      cacheEnabled: this.cacheConfig,
      version: '2.0.0-optimized'
    });
  }

  // ============================================
  // 1. VALIDACIÓN DE DATOS DE RESERVA (OPTIMIZADA)
  // ============================================
  
  /**
   * Valida los datos de una reserva de forma integral
   * 
   * Validaciones implementadas:
   * - Campos obligatorios (experience_id, user_id, reservation_date, participants)
   * - Tipos de datos correctos
   * - Rangos válidos (participantes: 1-100)
   * - Formato de fecha válido
   * - Fecha futura (no pasada)
   * - Estructura de servicios adicionales
   * 
   * @param {Object} reservationData - Datos de la reserva a validar
   * @param {number} reservationData.experience_id - ID de la experiencia
   * @param {number} reservationData.user_id - ID del usuario
   * @param {string} reservationData.reservation_date - Fecha de reserva (YYYY-MM-DD)
   * @param {number} reservationData.participants - Número de participantes (1-100)
   * @param {Array} [reservationData.additional_services] - Servicios adicionales opcionales
   * @returns {Object} Resultado con isValid boolean y array de errores específicos
   */
  validateReservationData(reservationData) {
    const errors = [];
    const startTime = Date.now();
    
    try {
      // Validar que el objeto no sea null/undefined
      if (!reservationData || typeof reservationData !== 'object') {
        errors.push('Reservation data is required and must be an object');
        return { isValid: false, errors };
      }

      // Validar campos requeridos con mensajes específicos
      const requiredFields = [
        { field: 'experience_id', name: 'Experience ID' },
        { field: 'user_id', name: 'User ID' },
        { field: 'reservation_date', name: 'Reservation date' },
        { field: 'participants', name: 'Number of participants' }
      ];

      requiredFields.forEach(({ field, name }) => {
        if (!reservationData[field]) {
          errors.push(`${name} is required`);
        }
      });

      // Validar tipos de datos numéricos
      const numericFields = [
        { field: 'experience_id', name: 'Experience ID' },
        { field: 'user_id', name: 'User ID' },
        { field: 'participants', name: 'Participants' }
      ];

      numericFields.forEach(({ field, name }) => {
        if (reservationData[field] && typeof reservationData[field] !== 'number') {
          errors.push(`${name} must be a number`);
        }
      });

      // Validar fecha de reserva
      if (reservationData.reservation_date) {
        const reservationDate = new Date(reservationData.reservation_date);
        const currentDate = new Date();
        
        if (isNaN(reservationDate.getTime())) {
          errors.push('Invalid reservation date format. Use YYYY-MM-DD');
        } else if (reservationDate <= currentDate) {
          errors.push('Reservation date must be in the future');
        }
      }

      // Validar rango de participantes
      if (reservationData.participants) {
        const participants = reservationData.participants;
        if (participants < 1) {
          errors.push('Participants must be at least 1');
        }
        if (participants > 100) {
          errors.push('Participants cannot exceed 100 (contact support for larger groups)');
        }
      }

      // Validar servicios adicionales si están presentes
      if (reservationData.additional_services && !Array.isArray(reservationData.additional_services)) {
        errors.push('Additional services must be an array');
      }

      const validationTime = Date.now() - startTime;
      const result = { isValid: errors.length === 0, errors };

      this.logger.debug('Reservation data validation completed', {
        validationTime: `${validationTime}ms`,
        isValid: result.isValid,
        errorCount: errors.length,
        userId: reservationData.user_id,
        experienceId: reservationData.experience_id
      });

      return result;
    } catch (error) {
      this.logger.error('Validation process failed', { error: error.message });
      return {
        isValid: false,
        errors: ['Validation process failed: ' + error.message]
      };
    }
  }

  // ============================================
  // 2. VALIDACIÓN DE DISPONIBILIDAD (OPTIMIZADA CON CACHE)
  // ============================================

  /**
   * Valida la disponibilidad de una experiencia para una fecha específica
   * 
   * Este método implementa:
   * - Cache temporal de consultas de disponibilidad (5 min)
   * - Validación de formato de fecha
   * - Verificación de fechas pasadas
   * - Consulta optimizada a la base de datos
   * - Cálculo de espacios disponibles vs ocupados
   * - Logging detallado para debugging
   * 
   * @param {number} experienceId - ID único de la experiencia
   * @param {string} date - Fecha en formato YYYY-MM-DD
   * @param {number} participants - Número de participantes solicitados
   * @returns {Promise<Object>} Objeto con disponibilidad, espacios disponibles y metadatos
   */
  async validateAvailability(experienceId, date, participants) {
    return await measurePerformance('validateAvailability', async () => {
      const errors = [];

      // Validación rápida de parámetros
      if (!experienceId || !date || !participants) {
        throw new Error('Experience ID, date and participants are required');
      }

      // Validar formato de fecha
      const reservationDate = new Date(date);
      if (isNaN(reservationDate.getTime())) {
        errors.push('Invalid date format. Use YYYY-MM-DD');
      }

      // Validar que no sea fecha pasada
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0); // Normalizar a medianoche
      if (reservationDate <= currentDate) {
        errors.push('Cannot book for past dates');
      }

      if (errors.length > 0) {
        return {
          isAvailable: false,
          errors: errors,
          availableSpots: 0,
          maxCapacity: 0,
          currentReservations: 0
        };
      }

      try {
        // Usar optimización de cache para disponibilidad
        const result = await calculationOptimizer.optimizeAvailabilityCheck(
          experienceId,
          date,
          async (expId, checkDate) => {
            // Obtener información de la experiencia
            const experience = await this.experienceModel.findById(expId);
            
            if (!experience) {
              throw new Error('Experience not found');
            }

            // Verificar disponibilidad usando el modelo
            const availability = await this.reservationModel.checkAvailability(
              expId,
              checkDate,
              participants
            );

            return {
              isAvailable: availability.available,
              availableSpots: availability.availableSpots,
              maxCapacity: availability.maxParticipants,
              currentReservations: availability.reservedParticipants,
              experienceActive: experience.is_active
            };
          }
        );

        this.logger.info('Availability check completed', {
          experienceId,
          date,
          participants,
          isAvailable: result.isAvailable,
          availableSpots: result.availableSpots,
          cached: result.cached || false
        });

        return result;

      } catch (error) {
        this.logger.error('Availability check failed', {
          experienceId,
          date,
          participants,
          error: error.message
        });
        
        return {
          isAvailable: false,
          errors: [error.message],
          availableSpots: 0,
          maxCapacity: 0,
          currentReservations: 0
        };
      }
    }, { experienceId, date, participants });
  }

  // ============================================
  // 3. VALIDACIÓN DE CANCELACIÓN (MEJORADA)
  // ============================================

  /**
   * Valida si una reserva puede ser cancelada según las políticas establecidas
   * 
   * Políticas de cancelación implementadas:
   * - Solo el propietario puede cancelar su reserva
   * - Estados cancelables: 'pending', 'confirmed'  
   * - Estados no cancelables: 'cancelled', 'completed'
   * - Ventana de cancelación: hasta 24 horas antes de la experiencia
   * - Logging detallado de intentos de cancelación
   * 
   * @param {number} reservationId - ID único de la reserva
   * @param {number} userId - ID del usuario que solicita la cancelación
   * @returns {Promise<Object>} Resultado con canCancel boolean y razón detallada
   */
  async validateCancellation(reservationId, userId) {
    return await measurePerformance('validateCancellation', async () => {
      try {
        // 1. Buscar la reserva
        const reservation = await this.reservationModel.findById(reservationId);
        if (!reservation) {
          return {
            canCancel: false,
            reason: 'Reservation not found'
          };
        }

        // 2. Verificar propiedad de la reserva
        if (reservation.user_id !== userId) {
          this.logger.warn('Unauthorized cancellation attempt', {
            reservationId,
            requestingUserId: userId,
            reservationUserId: reservation.user_id
          });
          
          return {
            canCancel: false,
            reason: 'You can only cancel your own reservations'
          };
        }

        // 3. Verificar estado de la reserva
        const cancellableStates = ['pending', 'confirmed'];
        if (!cancellableStates.includes(reservation.status)) {
          return {
            canCancel: false,
            reason: `Cannot cancel ${reservation.status} reservation`
          };
        }

        // 4. Verificar políticas de cancelación (ventana de tiempo)
        const reservationDate = new Date(reservation.reservation_date);
        const now = new Date();
        const timeDiff = reservationDate.getTime() - now.getTime();
        const hoursDifference = timeDiff / (1000 * 3600);

        // Política: cancelación hasta 24 horas antes
        if (hoursDifference < 24) {
          return {
            canCancel: false,
            reason: 'Cancellations must be made at least 24 hours in advance'
          };
        }

        this.logger.info('Cancellation validation passed', {
          reservationId,
          userId,
          status: reservation.status,
          hoursInAdvance: Math.round(hoursDifference)
        });

        return {
          canCancel: true,
          reason: 'Cancellation allowed',
          hoursInAdvance: Math.round(hoursDifference)
        };

      } catch (error) {
        this.logger.error('Cancellation validation failed', {
          reservationId,
          userId,
          error: error.message
        });
        
        return {
          canCancel: false,
          reason: 'Validation error: ' + error.message
        };
      }
    }, { reservationId, userId });
  }

  // ============================================
  // 4. CÁLCULOS DE SERVICIOS ADICIONALES (OPTIMIZADOS)
  // ============================================

  /**
   * Calcula el precio de un servicio adicional basado en el precio base
   * 
   * Servicios disponibles y sus porcentajes:
   * - guide: 20% - Servicio de guía especializada
   * - transport: 15% - Transporte desde punto de encuentro
   * - food: 10% - Alimentación tradicional incluida
   * - equipment: 5% - Equipo especializado (fotografía, senderismo, etc.)
   * 
   * @param {string} serviceType - Tipo de servicio ('guide', 'transport', 'food', 'equipment')
   * @param {number} basePrice - Precio base para calcular el porcentaje
   * @returns {number} Precio calculado del servicio (redondeado a entero)
   * @throws {Error} Si el tipo de servicio no es válido o el precio base es inválido
   */
  calculateServicePrice(serviceType, basePrice) {
    // Validar precio base
    if (!basePrice || basePrice <= 0) {
      throw new Error('Base price must be positive');
    }

    // Validar tipo de servicio
    if (!serviceType || typeof serviceType !== 'string') {
      throw new Error('Service type must be a non-empty string');
    }

    // Definir porcentajes por tipo de servicio con documentación
    const servicePercentages = {
      'guide': 0.20,      // 20% - Guía especializada certificada
      'transport': 0.15,  // 15% - Transporte confortable ida y vuelta
      'food': 0.10,       // 10% - Comida típica preparada por la comunidad
      'equipment': 0.05   // 5% - Equipo profesional incluido
    };

    // Validar tipo de servicio
    if (!servicePercentages.hasOwnProperty(serviceType)) {
      const validServices = Object.keys(servicePercentages).join(', ');
      throw new Error(`Invalid service type: ${serviceType}. Valid types: ${validServices}`);
    }

    // Calcular precio del servicio
    const servicePrice = basePrice * servicePercentages[serviceType];
    const roundedPrice = Math.round(servicePrice);

    this.logger.debug('Service price calculated', {
      serviceType,
      basePrice,
      percentage: servicePercentages[serviceType] * 100,
      calculatedPrice: roundedPrice
    });

    return roundedPrice;
  }

  /**
   * Calcula el costo total de múltiples servicios adicionales
   * 
   * Este método optimizado:
   * - Valida todos los servicios antes del cálculo
   * - Acumula costos de forma eficiente
   * - Proporciona detalles de cada servicio
   * - Maneja errores de servicios inválidos gracefully
   * - Registra métricas para análisis
   * 
   * @param {Array<string>} services - Lista de tipos de servicio
   * @param {number} basePrice - Precio base para calcular porcentajes
   * @returns {Object} Objeto con totalAdditionalCost y array de services detallado
   * @throws {Error} Si los parámetros son inválidos
   */
  calculateAdditionalServices(services, basePrice) {
    // Validar parámetros de entrada
    if (!Array.isArray(services)) {
      throw new Error('Services must be an array');
    }

    if (!basePrice || basePrice <= 0) {
      throw new Error('Base price must be positive');
    }

    // Información detallada de servicios disponibles
    const serviceInfo = {
      'guide': { 
        name: 'Servicio de guía especializada', 
        percentage: 20,
        description: 'Guía certificado con conocimiento local profundo'
      },
      'transport': { 
        name: 'Servicio de transporte', 
        percentage: 15,
        description: 'Transporte cómodo desde punto de encuentro'
      },
      'food': { 
        name: 'Servicio de alimentación', 
        percentage: 10,
        description: 'Comida tradicional preparada por la comunidad'
      },
      'equipment': { 
        name: 'Servicio de equipo', 
        percentage: 5,
        description: 'Equipo profesional incluido según la actividad'
      }
    };

    let totalAdditionalCost = 0;
    const serviceDetails = [];
    const invalidServices = [];

    // Procesar cada servicio
    services.forEach(serviceType => {
      if (serviceInfo[serviceType]) {
        try {
          const cost = this.calculateServicePrice(serviceType, basePrice);
          totalAdditionalCost += cost;
          
          serviceDetails.push({
            type: serviceType,
            name: serviceInfo[serviceType].name,
            description: serviceInfo[serviceType].description,
            percentage: serviceInfo[serviceType].percentage,
            cost: cost
          });
        } catch (error) {
          invalidServices.push(serviceType);
        }
      } else {
        invalidServices.push(serviceType);
      }
    });

    // Log de advertencia para servicios inválidos
    if (invalidServices.length > 0) {
      this.logger.warn('Invalid services ignored in calculation', {
        invalidServices,
        validServices: serviceDetails.map(s => s.type)
      });
    }

    const result = {
      totalAdditionalCost: totalAdditionalCost,
      services: serviceDetails,
      invalidServicesIgnored: invalidServices
    };

    this.logger.debug('Additional services calculated', {
      requestedServices: services.length,
      validServices: serviceDetails.length,
      invalidServices: invalidServices.length,
      totalCost: totalAdditionalCost
    });

    return result;
  }

  // ============================================
  // 5. CÁLCULO DE ESTIMACIÓN DE RESERVA (OPTIMIZADO CON CACHE)
  // ============================================
  /**
   * Calcula la estimación completa de una reserva con optimizaciones avanzadas
   * 
   * Este método central implementa:
   * - Cache inteligente para cálculos repetitivos (10 min TTL)
   * - Validación exhaustiva de datos de entrada
   * - Cálculos de precio base optimizados
   * - Aplicación automática de descuentos por grupo
   * - Servicios adicionales con detalles completos
   * - Logging detallado para debugging
   * - Manejo robusto de errores
   * 
   * Descuentos por grupo aplicados:
   * - 8-14 participantes: 10% de descuento
   * - 15+ participantes: 15% de descuento
   * 
   * @param {Object} reservationData - Datos completos de la reserva
   * @param {Object} reservationData.experience - Objeto de experiencia con precio
   * @param {number} reservationData.participants - Número de participantes
   * @param {Array} [reservationData.additional_services] - Servicios adicionales opcionales
   * @returns {Promise<Object>} Estimación completa con desglose detallado de costos
   */
  async calculateReservationEstimate(reservationData) {
    return await measurePerformance('calculateReservationEstimate', async () => {
      // Usar optimización de cache para cálculos de precio
      return await calculationOptimizer.optimizePriceCalculation(
        reservationData,
        async (data) => {
          // Validación exhaustiva de datos de entrada
          if (!data) {
            throw new Error('Reservation data is required');
          }

          if (!data.experience) {
            throw new Error('Experience data is required');
          }

          if (!data.participants || data.participants < 1) {
            throw new Error('Participants must be at least 1');
          }

          if (!data.experience.price || data.experience.price <= 0) {
            throw new Error('Experience price is required and must be positive');
          }

          // Extraer datos principales
          const { experience, participants, additional_services = [] } = data;
          const basePrice = experience.price;

          this.logger.debug('Starting price calculation', {
            experienceId: experience.id,
            basePrice,
            participants,
            servicesCount: additional_services.length
          });

          // 1. Calcular precio base (subtotal por participantes)
          const subtotal = basePrice * participants;

          // 2. Calcular servicios adicionales con optimización
          const servicesResult = this.calculateAdditionalServices(additional_services, subtotal);
          const additionalServicesCost = servicesResult.totalAdditionalCost;

          // 3. Calcular total antes de descuentos
          const totalBeforeDiscount = subtotal + additionalServicesCost;

          // 4. Aplicar descuentos por grupo (política mejorada)
          let discountPercentage = 0;
          let discountAmount = 0;

          // Política de descuentos actualizada
          if (participants >= 15) {
            discountPercentage = 15; // 15% para grupos grandes (15+)
          } else if (participants >= 8) {
            discountPercentage = 10; // 10% para grupos medianos (8-14)
          }

          if (discountPercentage > 0) {
            discountAmount = Math.round(totalBeforeDiscount * discountPercentage / 100);
          }

          // 5. Calcular total final
          const finalTotal = totalBeforeDiscount - discountAmount;

          // Construir resultado completo
          const result = {
            basePrice: basePrice,
            participants: participants,
            subtotal: subtotal,
            additionalServicesCost: additionalServicesCost,
            totalBeforeDiscount: totalBeforeDiscount,
            discountPercentage: discountPercentage,
            discountAmount: discountAmount,
            finalTotal: finalTotal,
            services: servicesResult.services,
            calculation: {
              pricePerPerson: basePrice,
              totalParticipants: participants,
              servicesApplied: servicesResult.services.length,
              discountApplied: discountPercentage > 0,
              savingsAmount: discountAmount
            }
          };

          this.logger.info('Price calculation completed', {
            experienceId: experience.id,
            participants,
            subtotal,
            finalTotal,
            discountApplied: discountAmount > 0,
            discountAmount
          });

          return result;
        }
      );
    }, { 
      experienceId: reservationData.experience?.id, 
      participants: reservationData.participants,
      servicesCount: reservationData.additional_services?.length || 0
    });
  }

  // Continuamos con métodos de grupo discount y operaciones principales...
  
  /**
   * Calcula el descuento por grupo según las políticas establecidas
   * @param {number} participants - Número de participantes
   * @returns {number} - Porcentaje de descuento (0-15)
   */
  calculateGroupDiscount(participants) {
    if (participants >= 15) {
      return 15; // 15% descuento para grupos grandes
    } else if (participants >= 8) {
      return 10; // 10% descuento para grupos medianos
    }
    return 0; // Sin descuento para grupos pequeños
  }

  // ============================================
  // 6. OPERACIONES PRINCIPALES (OPTIMIZADAS)
  // ============================================

  /**
   * Crea una estimación de reserva con validación completa y optimizaciones
   * 
   * Este método integra todas las validaciones y cálculos:
   * - Validación de datos de entrada
   * - Verificación de existencia de experiencia  
   * - Validación de disponibilidad con cache
   * - Cálculo optimizado de precios
   * - Creación en base de datos con transacción
   * - Logging completo de la operación
   * 
   * @param {Object} reservationData - Datos completos de la reserva
   * @returns {Promise<Object>} Reserva creada con todos los detalles
   */
  async createReservationEstimate(reservationData) {
    return await measurePerformance('createReservationEstimate', async () => {
      try {
        // 1. Validar datos de entrada
        const validation = this.validateReservationData(reservationData);
        if (!validation.isValid) {
          throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
        }

        // 2. Obtener información de la experiencia con cache
        const experience = await this.experienceModel.findById(reservationData.experience_id);
        if (!experience) {
          throw new Error('Experience not found');
        }

        if (!experience.is_active) {
          throw new Error('Experience is not currently available');
        }

        // 3. Validar disponibilidad con optimización
        const availability = await this.validateAvailability(
          reservationData.experience_id,
          reservationData.reservation_date,
          reservationData.participants
        );

        if (!availability.isAvailable) {
          throw new Error('Not enough available spots for the requested participants');
        }

        // 4. Calcular la estimación completa con cache
        const estimateData = {
          experience: experience,
          participants: reservationData.participants,
          additional_services: reservationData.additional_services || []
        };
        
        const estimate = await this.calculateReservationEstimate(estimateData);

        // 5. Preparar datos optimizados para la reserva
        const reservationForDb = {
          experience_id: reservationData.experience_id,
          user_id: reservationData.user_id,
          reservation_date: reservationData.reservation_date,
          participants: reservationData.participants,
          additional_services: JSON.stringify(reservationData.additional_services || []),
          base_price: estimate.basePrice,
          additional_services_cost: estimate.additionalServicesCost,
          total_price: estimate.finalTotal,
          discount_percentage: estimate.discountPercentage,
          discount_amount: estimate.discountAmount,
          status: 'pending',
          created_at: new Date().toISOString(),
          services: JSON.stringify(estimate.services)
        };

        // 6. Crear la reserva en la base de datos
        const createdReservation = await this.reservationModel.create(reservationForDb);

        // 7. Invalidar caches relacionados si es necesario
        if (this.cacheConfig.availabilityChecks) {
          calculationOptimizer.invalidateExperienceCache(reservationData.experience_id);
        }

        // 8. Log exitoso
        this.logger.info('Reservation estimate created successfully', {
          reservationId: createdReservation.id,
          experienceId: reservationData.experience_id,
          userId: reservationData.user_id,
          participants: reservationData.participants,
          totalPrice: estimate.finalTotal,
          discountApplied: estimate.discountAmount > 0
        });

        // 9. Retornar reserva completa
        return {
          id: createdReservation.id,
          experience_id: createdReservation.experience_id,
          user_id: createdReservation.user_id,
          reservation_date: createdReservation.reservation_date,
          participants: createdReservation.participants,
          additional_services: JSON.parse(createdReservation.additional_services),
          base_price: createdReservation.base_price,
          additional_services_cost: createdReservation.additional_services_cost,
          total_price: createdReservation.total_price,
          discount_percentage: createdReservation.discount_percentage,
          discount_amount: createdReservation.discount_amount,
          status: createdReservation.status,
          created_at: createdReservation.created_at,
          services: JSON.parse(createdReservation.services),
          calculation: estimate.calculation
        };

      } catch (error) {
        this.logger.error('Reservation estimate creation failed', {
          experienceId: reservationData.experience_id,
          userId: reservationData.user_id,
          error: error.message
        });
        throw error;
      }
    }, { 
      experienceId: reservationData.experience_id, 
      userId: reservationData.user_id,
      participants: reservationData.participants 
    });
  }

  /**
   * Cancela una reserva con validación de políticas y logging completo
   * @param {number} reservationId - ID de la reserva
   * @param {number} userId - ID del usuario
   * @returns {Promise<Object>} - Resultado de cancelación
   */
  async cancelReservation(reservationId, userId) {
    return await measurePerformance('cancelReservation', async () => {
      try {
        // 1. Validar que la reserva pueda ser cancelada
        const validation = await this.validateCancellation(reservationId, userId);
        
        if (!validation.canCancel) {
          throw new Error(validation.reason);
        }
        
        // 2. Actualizar el estado de la reserva
        const updateData = {
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: 'Cancelled by user'
        };
        
        const cancelledReservation = await this.reservationModel.update(reservationId, updateData);
        
        // 3. Invalidar cache de disponibilidad
        const reservation = await this.reservationModel.findById(reservationId);
        if (reservation && this.cacheConfig.availabilityChecks) {
          calculationOptimizer.invalidateExperienceCache(reservation.experience_id);
        }

        this.logger.info('Reservation cancelled successfully', {
          reservationId,
          userId,
          hoursInAdvance: validation.hoursInAdvance
        });
        
        return {
          success: true,
          message: 'Reservation cancelled successfully',
          reservation: {
            id: cancelledReservation.id,
            experience_id: cancelledReservation.experience_id,
            user_id: cancelledReservation.user_id,
            reservation_date: cancelledReservation.reservation_date,
            participants: cancelledReservation.participants,
            status: cancelledReservation.status,
            cancelled_at: cancelledReservation.cancelled_at,
            total_price: cancelledReservation.total_price
          }
        };
        
      } catch (error) {
        this.logger.error('Reservation cancellation failed', {
          reservationId,
          userId,
          error: error.message
        });
        throw error;
      }
    }, { reservationId, userId });
  }

  // ============================================
  // 7. MÉTODOS DE CONSULTA (OPTIMIZADOS)
  // ============================================

  /**
   * Obtiene las reservas de un usuario con información detallada
   * @param {number} userId - ID del usuario
   * @returns {Promise<Array>} - Lista de reservas con detalles
   */
  async getReservationsByUser(userId) {
    return await measurePerformance('getReservationsByUser', async () => {
      try {
        const reservations = await this.reservationModel.findByUser(userId);
          const formattedReservations = reservations.map(reservation => ({
          id: reservation.id,
          user_id: reservation.user_id, // Add user_id for backward compatibility
          experience: {
            id: reservation.experience_id,
            title: reservation.experience_title,
            price: reservation.experience_price,
            duration_hours: reservation.duration_hours
          },
          community: {
            name: reservation.community_name,
            region: reservation.community_region
          },
          participants: reservation.participants,
          reservation_date: reservation.reservation_date,
          pricing: {
            base_price: reservation.base_price,
            additional_services_cost: reservation.additional_services_cost,
            total_price: reservation.total_price,
            discount_percentage: reservation.discount_percentage,
            discount_amount: reservation.discount_amount
          },
          status: reservation.status,
          created_at: reservation.created_at,
          cancelled_at: reservation.cancelled_at,
          experience_title: reservation.experience_title,
          experience_price: reservation.experience_price,
          community_name: reservation.community_name,
          user_name: reservation.user_name,
          user_email: reservation.user_email
        }));

        this.logger.debug('User reservations retrieved', {
          userId,
          count: formattedReservations.length
        });

        return formattedReservations;
        
      } catch (error) {
        this.logger.error('Failed to get user reservations', { userId, error: error.message });
        throw error;
      }
    }, { userId });
  }

  /**
   * Obtiene los detalles completos de una reserva
   * @param {number} reservationId - ID de la reserva
   * @returns {Promise<Object>} - Detalles completos de la reserva
   */
  async getReservationDetails(reservationId) {
    return await measurePerformance('getReservationDetails', async () => {
      try {
        const reservations = await this.reservationModel.findWithDetails({ id: reservationId });
        
        if (!reservations || reservations.length === 0) {
          throw new Error('Reservation not found');
        }
        
        const reservation = reservations[0];
          const details = {
          id: reservation.id,
          experience: {
            id: reservation.experience_id,
            title: reservation.experience_title,
            price: reservation.experience_price,
            duration_hours: reservation.duration_hours
          },
          community: {
            name: reservation.community_name,
            region: reservation.community_region
          },
          user: {
            name: reservation.user_name,
            email: reservation.user_email
          },
          participants: reservation.participants,
          reservation_date: reservation.reservation_date,
          pricing: {
            base_price: reservation.base_price,
            service_price: reservation.service_price,
            additional_services_cost: reservation.additional_services_cost,
            group_discount: reservation.group_discount,
            discount_percentage: reservation.discount_percentage,
            discount_amount: reservation.discount_amount,
            total_price: reservation.total_price
          },
          services: reservation.services ? JSON.parse(reservation.services) : [],
          additional_services: reservation.additional_services ? JSON.parse(reservation.additional_services) : [],
          status: reservation.status,
          created_at: reservation.created_at,
          updated_at: reservation.updated_at,
          cancelled_at: reservation.cancelled_at,
          cancellation_reason: reservation.cancellation_reason,
          // Add flat properties for backward compatibility
          experience_title: reservation.experience_title,
          user_name: reservation.user_name,
          user_email: reservation.user_email
        };

        this.logger.debug('Reservation details retrieved', {
          reservationId,
          status: details.status,
          totalPrice: details.pricing.total_price
        });

        return details;
        
      } catch (error) {
        this.logger.error('Failed to get reservation details', { reservationId, error: error.message });
        throw error;
      }
    }, { reservationId });
  }

  // ============================================
  // 8. MÉTODOS ADICIONALES DE INTEGRACIÓN (OPTIMIZADOS)
  // ============================================

  /**
   * Obtiene estadísticas del sistema de reservas con cache
   * @returns {Promise<Object>} - Estadísticas completas
   */
  async getReservationStats() {
    return await measurePerformance('getReservationStats', async () => {
      try {
        const stats = await this.reservationModel.db.all(`
          SELECT 
            COUNT(*) as total_reservations,
            COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_reservations,
            COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_reservations,
            COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_reservations,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_reservations,
            SUM(total_price) as total_revenue,
            AVG(total_price) as average_reservation_value,
            SUM(participants) as total_participants
          FROM reservations
          WHERE created_at >= date('now', '-30 days')
        `);

        const result = {
          totalReservations: stats[0]?.total_reservations || 0,
          pendingReservations: stats[0]?.pending_reservations || 0,
          confirmedReservations: stats[0]?.confirmed_reservations || 0,
          cancelledReservations: stats[0]?.cancelled_reservations || 0,
          completedReservations: stats[0]?.completed_reservations || 0,
          totalRevenue: stats[0]?.total_revenue || 0,
          averageReservationValue: stats[0]?.average_reservation_value || 0,
          totalParticipants: stats[0]?.total_participants || 0
        };

        this.logger.info('Reservation statistics retrieved', {
          totalReservations: result.totalReservations,
          totalRevenue: result.totalRevenue,
          period: 'last_30_days'
        });

        return result;
      } catch (error) {
        this.logger.error('Failed to get reservation statistics', error);
        throw new Error('Failed to get reservation statistics');
      }
    });
  }

  /**
   * Obtiene reservas por estado
   * @param {string} status - Estado de las reservas
   * @returns {Promise<Array>} - Lista de reservas
   */
  async getReservationsByStatus(status) {
    return await measurePerformance('getReservationsByStatus', async () => {
      try {
        const reservations = await this.reservationModel.db.all(`
          SELECT 
            r.id, r.experience_id, r.user_id, r.reservation_date, r.participants,
            r.total_price, r.status, r.created_at,
            e.title as experience_title,
            u.name as user_name, u.email as user_email
          FROM reservations r
          LEFT JOIN experiences e ON r.experience_id = e.id
          LEFT JOIN users u ON r.user_id = u.id
          WHERE r.status = ?
          ORDER BY r.created_at DESC
        `, [status]);

        const formattedReservations = reservations.map(reservation => ({
          id: reservation.id,
          experience_id: reservation.experience_id,
          user_id: reservation.user_id,
          reservation_date: reservation.reservation_date,
          participants: reservation.participants,
          total_price: reservation.total_price,
          status: reservation.status,
          created_at: reservation.created_at,
          experience_title: reservation.experience_title,
          user_name: reservation.user_name,
          user_email: reservation.user_email
        }));

        this.logger.debug('Reservations by status retrieved', {
          status,
          count: formattedReservations.length
        });

        return formattedReservations;
      } catch (error) {
        this.logger.error('Failed to get reservations by status', { status, error: error.message });
        throw error;
      }
    }, { status });
  }

  /**
   * Confirma una reserva
   * @param {number} reservationId - ID de la reserva
   * @returns {Promise<Object>} - Resultado de confirmación
   */
  async confirmReservation(reservationId) {
    return await measurePerformance('confirmReservation', async () => {
      try {
        const reservation = await this.reservationModel.findById(reservationId);
        if (!reservation) {
          throw new Error('Reservation not found');
        }

        if (reservation.status !== 'pending') {
          throw new Error('Only pending reservations can be confirmed');
        }

        const confirmedReservation = await this.reservationModel.update(reservationId, {
          status: 'confirmed',
          updated_at: new Date().toISOString()
        });

        this.logger.info('Reservation confirmed', {
          reservationId,
          previousStatus: 'pending'
        });

        return {
          success: true,
          message: 'Reservation confirmed successfully',
          reservation: confirmedReservation
        };
      } catch (error) {
        this.logger.error('Reservation confirmation failed', { reservationId, error: error.message });
        throw error;
      }
    }, { reservationId });
  }

  /**
   * Completa una reserva
   * @param {number} reservationId - ID de la reserva
   * @returns {Promise<Object>} - Resultado de completación
   */
  async completeReservation(reservationId) {
    return await measurePerformance('completeReservation', async () => {
      try {
        const reservation = await this.reservationModel.findById(reservationId);
        if (!reservation) {
          throw new Error('Reservation not found');
        }

        if (reservation.status !== 'confirmed') {
          throw new Error('Only confirmed reservations can be completed');
        }

        const completedReservation = await this.reservationModel.update(reservationId, {
          status: 'completed',
          updated_at: new Date().toISOString()
        });

        this.logger.info('Reservation completed', {
          reservationId,
          previousStatus: 'confirmed'
        });

        return {
          success: true,
          message: 'Reservation completed successfully',
          reservation: completedReservation
        };
      } catch (error) {
        this.logger.error('Reservation completion failed', { reservationId, error: error.message });
        throw error;
      }
    }, { reservationId });
  }

  /**
   * Obtiene reservas por experiencia
   * @param {number} experienceId - ID de la experiencia
   * @returns {Promise<Array>} - Lista de reservas
   */
  async getReservationsByExperience(experienceId) {
    return await measurePerformance('getReservationsByExperience', async () => {
      try {
        const reservations = await this.reservationModel.findByExperience(experienceId);
        
        this.logger.debug('Experience reservations retrieved', {
          experienceId,
          count: reservations.length
        });

        return reservations;
      } catch (error) {
        this.logger.error('Failed to get experience reservations', { experienceId, error: error.message });
        throw error;
      }
    }, { experienceId });
  }
}

module.exports = ReservationService;
