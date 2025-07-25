// ExperienceController - Controlador para gestión de experiencias turísticas
// Integración con ExperienceService siguiendo TDD

const ExperienceService = require('../services/ExperienceService');
const { AuthObserver, AUTH_EVENTS } = require('../utils/AuthObserver');

class ExperienceController {
  constructor() {
    this.experienceService = new ExperienceService();
    this.authObserver = new AuthObserver();
  }

  // ============================================
  // 1. BÚSQUEDA Y LISTADO DE EXPERIENCIAS
  // ============================================

  /**
   * Buscar experiencias con filtros
   * @param {Object} filters - Filtros de búsqueda
   * @returns {Promise<Object>} - Resultado de búsqueda
   */
  async searchExperiences(filters = {}) {
    try {
      console.log('🔍 ExperienceController.searchExperiences called with:', filters);
      
      const experiences = await this.experienceService.searchExperiences(filters);
      console.log('✅ Search completed, found:', experiences.length, 'experiences');
      
      return {
        success: true,
        experiences: experiences,
        total: experiences.length
      };
    } catch (error) {
      console.error('❌ Search experiences failed:', error.message);
      return {
        success: false,
        error: error.message,
        experiences: []
      };
    }
  }

  /**
   * Obtener experiencias populares
   * @param {number} limit - Límite de resultados
   * @returns {Promise<Object>} - Experiencias populares
   */
  async getPopularExperiences(limit = 10) {
    try {
      console.log('🌟 ExperienceController.getPopularExperiences called with limit:', limit);
      
      const experiences = await this.experienceService.getPopularExperiences(limit);
      console.log('✅ Popular experiences retrieved:', experiences.length);
      
      return {
        success: true,
        experiences: experiences
      };
    } catch (error) {
      console.error('❌ Get popular experiences failed:', error.message);
      return {
        success: false,
        error: error.message,
        experiences: []
      };
    }
  }

  /**
   * Obtener experiencias recientes
   * @param {number} limit - Límite de resultados
   * @returns {Promise<Object>} - Experiencias recientes
   */
  async getRecentExperiences(limit = 10) {
    try {
      console.log('🆕 ExperienceController.getRecentExperiences called with limit:', limit);
      
      const experiences = await this.experienceService.getRecentExperiences(limit);
      console.log('✅ Recent experiences retrieved:', experiences.length);
      
      return {
        success: true,
        experiences: experiences
      };
    } catch (error) {
      console.error('❌ Get recent experiences failed:', error.message);
      return {
        success: false,
        error: error.message,
        experiences: []
      };
    }
  }

  /**
   * Obtener experiencias pendientes de aprobación (para administradores)
   * @returns {Promise<Object>} - Experiencias pendientes
   */
  async getPendingExperiences() {
    try {
      console.log('⏳ ExperienceController.getPendingExperiences called');
      
      const experiences = await this.experienceService.getPendingExperiences();
      console.log('✅ Pending experiences retrieved:', experiences.length);
      
      return {
        success: true,
        experiences: experiences
      };
    } catch (error) {
      console.error('❌ Get pending experiences failed:', error.message);
      return {
        success: false,
        error: error.message,
        experiences: []
      };
    }
  }

  // ============================================
  // 2. GESTIÓN DE EXPERIENCIAS
  // ============================================

  /**
   * Crear nueva experiencia
   * @param {Object} experienceData - Datos de la experiencia
   * @returns {Promise<Object>} - Resultado de creación
   */
  async createExperience(experienceData) {
    try {
      console.log('➕ ExperienceController.createExperience called with:', experienceData);
      
      const experience = await this.experienceService.createExperience(experienceData);
      console.log('✅ Experience created successfully:', experience.id);
      
      // Notificar evento de creación
      this.authObserver.notify(AUTH_EVENTS.EXPERIENCE_CREATED, {
        experienceId: experience.id,
        title: experience.title,
        operatorId: experience.operatorId,
        timestamp: new Date()
      });
      
      return {
        success: true,
        experience: experience,
        message: 'Experience created successfully'
      };
    } catch (error) {
      console.error('❌ Create experience failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Actualizar experiencia existente
   * @param {number} experienceId - ID de la experiencia
   * @param {Object} updateData - Datos a actualizar
   * @param {number} operatorId - ID del operador
   * @param {boolean} isAdmin - Si el usuario es administrador
   * @returns {Promise<Object>} - Resultado de actualización
   */
  async updateExperience(experienceId, updateData, operatorId, isAdmin = false) {
    try {
      console.log('✏️ ExperienceController.updateExperience called:', {
        experienceId,
        operatorId,
        isAdmin,
        updateData
      });
      
      const experience = await this.experienceService.updateExperience(
        experienceId,
        updateData,
        operatorId,
        isAdmin
      );
      console.log('✅ Experience updated successfully:', experience.id);
      
      // Notificar evento de actualización
      this.authObserver.notify(AUTH_EVENTS.EXPERIENCE_UPDATED, {
        experienceId: experience.id,
        title: experience.title,
        operatorId: operatorId,
        timestamp: new Date()
      });
      
      return {
        success: true,
        experience: experience,
        message: 'Experience updated successfully'
      };
    } catch (error) {
      console.error('❌ Update experience failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
  /**
   * Eliminar experiencia (hard delete)
   * @param {number} experienceId - ID de la experiencia
   * @param {number} operatorId - ID del operador
   * @param {boolean} isAdmin - Si el usuario es administrador
   * @returns {Promise<Object>} - Resultado de eliminación
   */
  async deleteExperience(experienceId, operatorId, isAdmin = false) {
    try {
      console.log('🗑️ ExperienceController.deleteExperience called:', {
        experienceId,
        operatorId,
        isAdmin
      });
      
      // Usar el nuevo método de hard delete
      const deleted = await this.experienceService.deleteExperience(
        experienceId,
        operatorId,
        isAdmin
      );
      console.log('✅ Experience permanently deleted:', experienceId);
      
      // Notificar evento de eliminación
      this.authObserver.notify(AUTH_EVENTS.EXPERIENCE_DELETED, {
        experienceId: experienceId,
        operatorId: operatorId,
        timestamp: new Date()
      });
      
      return {
        success: true,
        message: 'Experience permanently deleted'
      };
    } catch (error) {
      console.error('❌ Delete experience failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============================================
  // 3. CÁLCULOS Y DISPONIBILIDAD
  // ============================================

  /**
   * Calcular disponibilidad de una experiencia
   * @param {number} experienceId - ID de la experiencia
   * @param {string} date - Fecha de la experiencia
   * @param {number} participants - Número de participantes
   * @returns {Promise<Object>} - Información de disponibilidad
   */
  async calculateAvailability(experienceId, date, participants) {
    try {
      console.log('📊 ExperienceController.calculateAvailability called:', {
        experienceId,
        date,
        participants
      });
      
      // Obtener experiencia
      const experience = await this.experienceService.experienceModel.findById(experienceId);
      if (!experience) {
        throw new Error('Experience not found');
      }
      
      // Obtener reservas para esa fecha
      const reservations = await this.experienceService.experienceModel.db.all(
        `SELECT SUM(participants) as total_reserved 
         FROM reservations 
         WHERE experience_id = ? 
         AND DATE(reservation_date) = DATE(?) 
         AND status = 'confirmed'`,
        [experienceId, date]
      );
      
      const reservedParticipants = reservations[0]?.total_reserved || 0;
      
      // Calcular disponibilidad
      const availability = this.experienceService.calculateAvailability(
        experience,
        reservedParticipants,
        participants
      );
      
      console.log('✅ Availability calculated:', availability);
      
      return {
        success: true,
        availability: availability
      };
    } catch (error) {
      console.error('❌ Calculate availability failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calcular precio total con descuentos
   * @param {number} experienceId - ID de la experiencia
   * @param {number} participants - Número de participantes
   * @returns {Promise<Object>} - Información de precio
   */
  async calculateTotalPrice(experienceId, participants) {
    try {
      console.log('💰 ExperienceController.calculateTotalPrice called:', {
        experienceId,
        participants
      });
      
      // Obtener experiencia
      const experience = await this.experienceService.experienceModel.findById(experienceId);
      if (!experience) {
        throw new Error('Experience not found');
      }
      
      // Calcular precio con descuentos
      const priceInfo = this.experienceService.calculateGroupDiscounts(experience, participants);
      
      console.log('✅ Price calculated:', priceInfo);
      
      return {
        success: true,
        priceInfo: priceInfo
      };
    } catch (error) {
      console.error('❌ Calculate total price failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // ============================================
  // 4. ESTADÍSTICAS Y REPORTES
  // ============================================

  /**
   * Obtener estadísticas de experiencias
   * @returns {Promise<Object>} - Estadísticas
   */
  async getExperienceStats() {
    try {
      console.log('📈 ExperienceController.getExperienceStats called');
      
      const stats = await this.experienceService.getExperienceStats();
      console.log('✅ Stats retrieved:', stats);
      
      return {
        success: true,
        stats: stats
      };
    } catch (error) {
      console.error('❌ Get experience stats failed:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }
  /**
   * Obtener experiencias por operador
   * @param {number} operatorId - ID del operador
   * @returns {Promise<Object>} - Experiencias del operador
   */
  async getExperiencesByOperator(operatorId) {
    try {
      console.log('👤 ExperienceController.getExperiencesByOperator called with:', operatorId);
      
      // Usar el nuevo método que incluye experiencias pendientes
      const experiences = await this.experienceService.getOperatorExperiences(operatorId);
      console.log('✅ Operator experiences retrieved:', experiences.length);
      
      return {
        success: true,
        experiences: experiences
      };
    } catch (error) {
      console.error('❌ Get experiences by operator failed:', error.message);
      return {
        success: false,
        error: error.message,
        experiences: []
      };
    }
  }

  /**
   * Obtener experiencias por comunidad
   * @param {number} communityId - ID de la comunidad
   * @returns {Promise<Object>} - Experiencias de la comunidad
   */
  async getExperiencesByCommunity(communityId) {
    try {
      console.log('🏘️ ExperienceController.getExperiencesByCommunity called with:', communityId);
      
      const experiences = await this.experienceService.searchExperiences({
        communityId: communityId
      });
      console.log('✅ Community experiences retrieved:', experiences.length);
      
      return {
        success: true,
        experiences: experiences
      };
    } catch (error) {
      console.error('❌ Get experiences by community failed:', error.message);
      return {
        success: false,
        error: error.message,
        experiences: []
      };
    }
  }
}

module.exports = ExperienceController;
