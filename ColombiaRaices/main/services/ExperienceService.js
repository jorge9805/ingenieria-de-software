// ExperienceService - Lógica de negocio para experiencias turísticas
// Implementado siguiendo TDD - todos los tests deben pasar

const ExperienceModel = require('../database/models/ExperienceModel');

class ExperienceService {
  constructor() {
    this.experienceModel = new ExperienceModel();
    this.validTypes = ['cultural', 'historica', 'ecologica'];
  }

  // ============================================
  // 1. VALIDACIÓN DE DATOS
  // ============================================

  /**
   * Valida los datos de una experiencia
   * @param {Object} experienceData - Datos de la experiencia
   * @returns {Object} - Resultado de validación
   */
  validateExperienceData(experienceData) {
    const errors = [];

    // Validar campos requeridos
    if (!experienceData.title || typeof experienceData.title !== 'string') {
      errors.push('Title is required and must be a string');
    }

    if (!experienceData.description || typeof experienceData.description !== 'string') {
      errors.push('Description is required');
    }

    if (!experienceData.type) {
      errors.push('Type is required');
    } else if (!this.validTypes.includes(experienceData.type)) {
      errors.push(`Type must be one of: ${this.validTypes.join(', ')}`);
    }

    if (experienceData.price === undefined || experienceData.price === null) {
      errors.push('Price is required');
    } else if (typeof experienceData.price !== 'number' || experienceData.price <= 0) {
      errors.push('Price must be positive');
    }

    if (experienceData.duration_hours === undefined || experienceData.duration_hours === null) {
      errors.push('Duration is required');
    } else if (typeof experienceData.duration_hours !== 'number' || experienceData.duration_hours < 1) {
      errors.push('Duration must be at least 1 hour');
    }

    if (experienceData.max_participants === undefined || experienceData.max_participants === null) {
      errors.push('Max participants is required');
    } else if (typeof experienceData.max_participants !== 'number' || experienceData.max_participants < 1) {
      errors.push('Max participants must be at least 1');
    }

    if (!experienceData.community_id) {
      errors.push('Community ID is required');
    }

    if (!experienceData.operator_id) {
      errors.push('Operator ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // ============================================
  // 2. FILTROS DE BÚSQUEDA
  // ============================================

  /**
   * Construye filtros para búsqueda de experiencias
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Object} - Filtros procesados
   */
  buildSearchFilters(filters) {
    const processedFilters = {};

    // Filtro por rango de precio
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      processedFilters.priceRange = {
        min: filters.minPrice,
        max: filters.maxPrice
      };
    }

    // Filtro por rango de duración
    if (filters.minDuration !== undefined || filters.maxDuration !== undefined) {
      processedFilters.durationRange = {
        min: filters.minDuration,
        max: filters.maxDuration
      };
    }

    // Filtro por tipo de experiencia
    if (filters.type) {
      processedFilters.type = filters.type;
    }

    // Filtro por región
    if (filters.region) {
      processedFilters.region = filters.region;
    }

    // Filtro por fecha de disponibilidad
    if (filters.availableDate) {
      processedFilters.availableDate = filters.availableDate;
    }

    // Filtro por comunidad
    if (filters.communityId) {
      processedFilters.communityId = filters.communityId;
    }

    // Filtro por operador
    if (filters.operatorId) {
      processedFilters.operatorId = filters.operatorId;
    }

    return processedFilters;
  }

  // ============================================
  // 3. CÁLCULOS DE DISPONIBILIDAD
  // ============================================

  /**
   * Calcula la disponibilidad de una experiencia
   * @param {Object} experience - Datos de la experiencia
   * @param {number} reservedParticipants - Participantes ya reservados
   * @param {number} requestedParticipants - Participantes solicitados
   * @returns {Object} - Información de disponibilidad
   */
  calculateAvailability(experience, reservedParticipants, requestedParticipants) {
    const maxParticipants = experience.max_participants;
    const availableSpots = maxParticipants - reservedParticipants;
    const isAvailable = availableSpots > 0;
    const canAccommodate = availableSpots >= requestedParticipants;

    return {
      available: isAvailable,
      availableSpots: availableSpots,
      canAccommodate: canAccommodate,
      maxParticipants: maxParticipants,
      reservedParticipants: reservedParticipants,
      requestedParticipants: requestedParticipants
    };
  }

  // ============================================
  // 4. CÁLCULOS DE PRECIO
  // ============================================

  /**
   * Calcula el precio total de una experiencia
   * @param {Object} experience - Datos de la experiencia
   * @param {number} participants - Número de participantes
   * @returns {number} - Precio total
   */
  calculateTotalPrice(experience, participants) {
    if (participants <= 0) {
      return 0;
    }

    return experience.price * participants;
  }

  /**
   * Calcula descuentos por grupo (si aplica)
   * @param {Object} experience - Datos de la experiencia
   * @param {number} participants - Número de participantes
   * @returns {Object} - Información de descuentos
   */
  calculateGroupDiscounts(experience, participants) {
    const baseTotal = this.calculateTotalPrice(experience, participants);
    let discountPercentage = 0;
    let discountReason = '';

    // Descuento por grupo grande (más de 8 personas)
    if (participants >= 8) {
      discountPercentage = 0.1; // 10%
      discountReason = 'Descuento por grupo grande';
    }

    // Descuento por grupo muy grande (más de 15 personas)
    if (participants >= 15) {
      discountPercentage = 0.15; // 15%
      discountReason = 'Descuento por grupo muy grande';
    }

    const discountAmount = baseTotal * discountPercentage;
    const finalTotal = baseTotal - discountAmount;

    return {
      baseTotal: baseTotal,
      discountPercentage: discountPercentage,
      discountAmount: discountAmount,
      finalTotal: finalTotal,
      discountReason: discountReason
    };
  }
  // ============================================
  // 5. TRANSFORMACIÓN DE DATOS
  // ============================================
  
  /**
   * Formatea los datos de experiencia para respuesta de operadores (sin cambiar nombres de campos)
   * @param {Object} rawExperience - Datos raw de la base de datos
   * @returns {Object} - Datos formateados para operadores
   */
  formatExperienceForOperator(rawExperience) {    // Para operadores, mantener los nombres originales de los campos de la BD
    // const specificLocation = rawExperience.specific_location;
    // const communityLocation = rawExperience.community_name && rawExperience.community_region 
    //   ? `${rawExperience.community_name}, ${rawExperience.community_region}`
    //   : null;
    
    return {
      id: rawExperience.id,
      title: rawExperience.title,
      description: rawExperience.description,
      type: rawExperience.type,
      price: rawExperience.price,
      // Mantener nombres originales para compatibilidad con formularios
      duration_hours: rawExperience.duration_hours,
      max_participants: rawExperience.max_participants,
      specific_location: rawExperience.specific_location,
      latitude: rawExperience.latitude,
      longitude: rawExperience.longitude,
      image_url: rawExperience.image_url,
      // Información adicional
      community_id: rawExperience.community_id,
      operator_id: rawExperience.operator_id,
      is_active: rawExperience.is_active,
      created_at: rawExperience.created_at,
      updated_at: rawExperience.updated_at,
      // Información de comunidad para display
      community_name: rawExperience.community_name,
      community_region: rawExperience.community_region
    };
  }

  /**
   * Formatea múltiples experiencias para operadores
   * @param {Array} rawExperiences - Array de experiencias raw
   * @returns {Array} - Array de experiencias formateadas para operadores
   */
  formatMultipleExperiencesForOperator(rawExperiences) {
    return rawExperiences.map(experience => 
      this.formatExperienceForOperator(experience)
    );
  }
  /**
   * Formatea los datos de experiencia para la respuesta
   * @param {Object} rawExperience - Datos raw de la base de datos
   * @returns {Object} - Datos formateados
   */
  formatExperienceForResponse(rawExperience) {
    // Implementar lógica de ubicación híbrida
    const specificLocation = rawExperience.specific_location;
    const communityLocation = rawExperience.community_name && rawExperience.community_region 
      ? `${rawExperience.community_name}, ${rawExperience.community_region}`
      : null;
    
    return {
      id: rawExperience.id,
      title: rawExperience.title,
      description: rawExperience.description,
      type: rawExperience.type,
      price: rawExperience.price,
      duration: rawExperience.duration_hours,
      maxParticipants: rawExperience.max_participants,
      imageUrl: rawExperience.image_url,
      // Ubicación híbrida: usar específica si existe, sino usar comunidad
      location: specificLocation || communityLocation || 'Ubicación no especificada',
      specificLocation: specificLocation,
      latitude: rawExperience.latitude,
      longitude: rawExperience.longitude,
      community: {
        id: rawExperience.community_id,
        name: rawExperience.community_name,
        region: rawExperience.community_region
      },
      operatorId: rawExperience.operator_id,
      isActive: rawExperience.is_active === 1,
      status: rawExperience.is_active === 1 ? 'approved' : 'pending',
      createdAt: rawExperience.created_at,
      updatedAt: rawExperience.updated_at
    };
  }

  /**
   * Formatea múltiples experiencias para la respuesta
   * @param {Array} rawExperiences - Array de experiencias raw
   * @returns {Array} - Array de experiencias formateadas
   */
  formatMultipleExperiences(rawExperiences) {
    return rawExperiences.map(experience => 
      this.formatExperienceForResponse(experience)
    );
  }

  // ============================================
  // 6. VALIDACIÓN DE PERMISOS
  // ============================================

  /**
   * Valida permisos de operador para gestionar experiencias
   * @param {number} operatorId - ID del operador
   * @param {Object} experience - Datos de la experiencia
   * @param {boolean} isAdmin - Si el usuario es administrador
   * @returns {Object} - Resultado de validación
   */
  validateOperatorPermissions(operatorId, experience, isAdmin = false) {
    // Los administradores pueden gestionar cualquier experiencia
    if (isAdmin) {
      return {
        allowed: true,
        reason: 'Admin privileges'
      };
    }

    // Los operadores solo pueden gestionar sus propias experiencias
    if (experience.operator_id === operatorId) {
      return {
        allowed: true,
        reason: 'Owner permissions'
      };
    }

    return {
      allowed: false,
      reason: 'Operator can only manage own experiences'
    };
  }

  // ============================================
  // 7. MÉTODOS DE BÚSQUEDA (usando ExperienceModel)
  // ============================================

  /**
   * Busca experiencias con filtros aplicados
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Array>} - Experiencias encontradas
   */
  async searchExperiences(filters = {}) {
    try {
      const processedFilters = this.buildSearchFilters(filters);
      let experiences = [];

      // Buscar por tipo
      if (processedFilters.type) {
        experiences = await this.experienceModel.findByType(processedFilters.type);
      }
      // Buscar por región
      else if (processedFilters.region) {
        experiences = await this.experienceModel.findByRegion(processedFilters.region);
      }
      // Buscar por rango de precio
      else if (processedFilters.priceRange) {
        const { min, max } = processedFilters.priceRange;
        experiences = await this.experienceModel.findByPriceRange(min || 0, max || 999999999);
      }
      // Buscar por duración
      else if (processedFilters.durationRange) {
        const { min, max } = processedFilters.durationRange;
        experiences = await this.experienceModel.findByDuration(min || 1, max || 24);
      }
      // Buscar por comunidad
      else if (processedFilters.communityId) {
        experiences = await this.experienceModel.findByCommunity(processedFilters.communityId);
      }
      // Buscar por operador
      else if (processedFilters.operatorId) {
        experiences = await this.experienceModel.findByOperator(processedFilters.operatorId);
      }
      // Buscar por fecha disponible
      else if (processedFilters.availableDate) {
        experiences = await this.experienceModel.findAvailableOn(processedFilters.availableDate);
      }
      // Buscar todas las experiencias
      else {
        experiences = await this.experienceModel.findWithCommunity();
      }

      return this.formatMultipleExperiences(experiences);
    } catch (error) {
      throw new Error(`Error searching experiences: ${error.message}`);
    }
  }

  /**
   * Obtiene experiencias populares
   * @param {number} limit - Límite de resultados
   * @returns {Promise<Array>} - Experiencias populares
   */
  async getPopularExperiences(limit = 10) {
    try {
      const experiences = await this.experienceModel.findPopular(limit);
      return this.formatMultipleExperiences(experiences);
    } catch (error) {
      throw new Error(`Error getting popular experiences: ${error.message}`);
    }
  }

  /**
   * Obtiene experiencias recientes
   * @param {number} limit - Límite de resultados
   * @returns {Promise<Array>} - Experiencias recientes
   */
  async getRecentExperiences(limit = 10) {
    try {
      const experiences = await this.experienceModel.findRecent(limit);
      return this.formatMultipleExperiences(experiences);
    } catch (error) {
      throw new Error(`Error getting recent experiences: ${error.message}`);
    }
  }

  /**
   * Obtiene experiencias pendientes de aprobación (para administradores)
   * @returns {Promise<Array>} - Experiencias pendientes
   */
  async getPendingExperiences() {
    try {
      const experiences = await this.experienceModel.findPendingExperiences();
      return this.formatMultipleExperiences(experiences);
    } catch (error) {
      throw new Error(`Error getting pending experiences: ${error.message}`);
    }
  }

  // ============================================
  // 8. MÉTODOS DE GESTIÓN
  // ============================================
  /**
   * Crea una nueva experiencia
   * @param {Object} experienceData - Datos de la experiencia
   * @returns {Promise<Object>} - Experiencia creada
   */
  async createExperience(experienceData) {
    try {
      // Validar datos
      const validation = this.validateExperienceData(experienceData);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Preparar datos con flujo de aprobación
      const experienceToCreate = {
        ...experienceData,
        // Nuevas experiencias inician inactivas hasta aprobación del admin
        is_active: 0,
        // Asegurar timestamps
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Crear experiencia
      const experience = await this.experienceModel.create(experienceToCreate);
      return this.formatExperienceForResponse(experience);
    } catch (error) {
      throw new Error(`Error creating experience: ${error.message}`);
    }
  }

  /**
   * Actualiza una experiencia existente
   * @param {number} experienceId - ID de la experiencia
   * @param {Object} updateData - Datos a actualizar
   * @param {number} operatorId - ID del operador
   * @param {boolean} isAdmin - Si el usuario es administrador
   * @returns {Promise<Object>} - Experiencia actualizada
   */
  async updateExperience(experienceId, updateData, operatorId, isAdmin = false) {
    try {
      // Obtener experiencia existente
      const existingExperience = await this.experienceModel.findById(experienceId);
      if (!existingExperience) {
        throw new Error('Experience not found');
      }

      // Validar permisos
      const permissions = this.validateOperatorPermissions(operatorId, existingExperience, isAdmin);
      if (!permissions.allowed) {
        throw new Error(`Permission denied: ${permissions.reason}`);
      }

      // Validar datos de actualización
      const validation = this.validateExperienceData({ ...existingExperience, ...updateData });
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }

      // Actualizar experiencia
      const updatedExperience = await this.experienceModel.update(experienceId, updateData);
      return this.formatExperienceForResponse(updatedExperience);
    } catch (error) {
      throw new Error(`Error updating experience: ${error.message}`);
    }
  }
  /**
   * Calcula el precio con descuentos para una experiencia
   * @param {number} basePrice - Precio base
   * @param {number} participants - Número de participantes
   * @returns {Object} - Información del precio
   */
  calculatePrice(basePrice, participants) {
    if (!basePrice || basePrice <= 0) {
      throw new Error('Base price is required and must be positive');
    }
    
    if (!participants || participants <= 0) {
      throw new Error('Participants is required and must be positive');
    }

    const totalPrice = basePrice * participants;
    let discountPercentage = 0;
    let discountReason = '';

    // Aplicar descuentos por grupo
    if (participants >= 15) {
      discountPercentage = 15;
      discountReason = 'Descuento por grupo grande (15+ personas)';
    } else if (participants >= 8) {
      discountPercentage = 10;
      discountReason = 'Descuento por grupo mediano (8+ personas)';
    }

    const discountAmount = Math.round(totalPrice * discountPercentage / 100);
    const finalPrice = totalPrice - discountAmount;

    return {
      basePrice: basePrice,
      participants: participants,
      totalPrice: totalPrice,
      discountPercentage: discountPercentage,
      discountAmount: discountAmount,
      finalPrice: finalPrice,
      discountApplied: discountPercentage > 0,
      discountReason: discountReason
    };
  }
  /**
   * Obtiene estadísticas de experiencias
   * @returns {Promise<Object>} - Estadísticas
   */
  async getExperienceStats() {
    try {
      const stats = await this.experienceModel.getStats();
      return {
        total: stats.total,
        byType: stats.byType,
        averagePrice: Math.round(stats.averagePrice || 0)
      };
    } catch (error) {
      throw new Error(`Error getting experience stats: ${error.message}`);
    }
  }  /**
   * Obtiene todas las experiencias de un operador (incluyendo pendientes)
   * @param {number} operatorId - ID del operador
   * @returns {Promise<Array>} - Experiencias del operador
   */
  async getOperatorExperiences(operatorId) {
    try {
      const experiences = await this.experienceModel.findAllByOperator(operatorId);
      return this.formatMultipleExperiencesForOperator(experiences);
    } catch (error) {
      throw new Error(`Error getting operator experiences: ${error.message}`);
    }
  }

  /**
   * Elimina permanentemente una experiencia (hard delete)
   * @param {number} experienceId - ID de la experiencia
   * @param {number} operatorId - ID del operador
   * @param {boolean} isAdmin - Si el usuario es administrador
   * @returns {Promise<boolean>} - True si se eliminó correctamente
   */
  async deleteExperience(experienceId, operatorId, isAdmin = false) {
    try {
      // Obtener experiencia existente para validar permisos
      const existingExperience = await this.experienceModel.findById(experienceId);
      if (!existingExperience) {
        throw new Error('Experience not found');
      }

      // Validar permisos
      const permissions = this.validateOperatorPermissions(operatorId, existingExperience, isAdmin);
      if (!permissions.allowed) {
        throw new Error(`Permission denied: ${permissions.reason}`);
      }

      // Realizar hard delete
      const deleted = await this.experienceModel.hardDelete(experienceId);
      if (!deleted) {
        throw new Error('Failed to delete experience');
      }

      return true;
    } catch (error) {
      throw new Error(`Error deleting experience: ${error.message}`);
    }
  }
}

module.exports = ExperienceService;
