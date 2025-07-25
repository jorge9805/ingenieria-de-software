// Controlador simple para gestionar experiencias con datos reales
const { ipcMain } = require('electron');
const ExperienceServiceSimple = require('../services/ExperienceServiceSimple');

class ExperienceControllerSimple {  constructor() {
    this.experienceService = new ExperienceServiceSimple();
    // NO llamar setupEventHandlers aquí - se llamará después
  }

  // Método para obtener todas las experiencias (usado por electron.js)
  async getAllExperiences() {
    try {
      const experiences = await this.experienceService.findAll();
      return { success: true, data: experiences };
    } catch (error) {
      console.error('Error in getAllExperiences:', error);
      return { success: false, error: error.message };
    }
  }

  // Método para obtener experiencia por ID (usado por electron.js)
  async getExperienceById(id) {
    try {
      const experience = await this.experienceService.findById(id);
      return { success: true, data: experience };
    } catch (error) {
      console.error('Error in getExperienceById:', error);
      return { success: false, error: error.message };
    }
  }

  // Método para obtener experiencias por comunidad (usado por electron.js)
  async getExperiencesByCommunity(communityId) {
    try {
      const experiences = await this.experienceService.findByCommunity(communityId);
      return { success: true, data: experiences };
    } catch (error) {
      console.error('Error in getExperiencesByCommunity:', error);
      return { success: false, error: error.message };
    }
  }

  // Método para obtener experiencias por tipo (usado por electron.js)
  async getExperiencesByType(type) {
    try {
      const experiences = await this.experienceService.findByType(type);
      return { success: true, data: experiences };
    } catch (error) {
      console.error('Error in getExperiencesByType:', error);
      return { success: false, error: error.message };
    }
  }

  // Método para obtener tipos de experiencia (usado por electron.js)
  async getExperienceTypes() {
    try {
      const types = await this.experienceService.getTypes();
      return { success: true, data: types };
    } catch (error) {
      console.error('Error in getExperienceTypes:', error);
      return { success: false, error: error.message };
    }
  }

  // Método para obtener estadísticas de experiencias (usado por electron.js)
  async getExperienceStats() {
    try {
      const stats = await this.experienceService.getStats();
      return { success: true, data: stats };
    } catch (error) {
      console.error('Error in getExperienceStats:', error);
      return { success: false, error: error.message };
    }
  }
  setupEventHandlers() {
    // Obtener todas las experiencias
    ipcMain.handle('experiences-simple:all', async () => {
      try {
        const experiences = await this.experienceService.findAll();
        return { success: true, data: experiences };
      } catch (error) {
        console.error('Error in experiences-simple:all:', error);
        return { success: false, error: error.message };
      }
    });

    // Obtener experiencia por ID
    ipcMain.handle('experiences-simple:by-id', async (event, id) => {
      try {
        const experience = await this.experienceService.findById(id);
        return { success: true, data: experience };
      } catch (error) {
        console.error('Error in experiences-simple:by-id:', error);
        return { success: false, error: error.message };
      }
    });    // Obtener experiencias por comunidad
    ipcMain.handle('experiences-simple:by-community', async (event, communityId) => {
      try {
        const experiences = await this.experienceService.findByCommunity(communityId);
        return { success: true, data: experiences };
      } catch (error) {
        console.error('Error in experiences-simple:by-community:', error);
        return { success: false, error: error.message };
      }
    });

    // Obtener experiencias por tipo
    ipcMain.handle('experiences-simple:by-type', async (event, type) => {
      try {
        const experiences = await this.experienceService.findByType(type);
        return { success: true, data: experiences };
      } catch (error) {
        console.error('Error in experiences-simple:by-type:', error);
        return { success: false, error: error.message };
      }
    });

    // Obtener tipos de experiencia
    ipcMain.handle('experiences-simple:types', async () => {
      try {
        const types = await this.experienceService.getTypes();
        return { success: true, data: types };
      } catch (error) {
        console.error('Error in experiences-simple:types:', error);
        return { success: false, error: error.message };
      }
    });

    // Obtener estadísticas de experiencias
    ipcMain.handle('experiences-simple:stats', async () => {
      try {
        const stats = await this.experienceService.getStats();
        return { success: true, data: stats };
      } catch (error) {
        console.error('Error in experiences-simple:stats:', error);
        return { success: false, error: error.message };
      }
    });    // Formatear precio
    ipcMain.handle('experiences:formatPriceSimple', async (event, price) => {
      try {
        const formattedPrice = this.experienceService.formatPrice(price);
        return { success: true, data: formattedPrice };
      } catch (error) {
        console.error('Error in experiences:formatPriceSimple:', error);
        return { success: false, error: error.message };
      }
    });

    // Búsqueda filtrada de experiencias
    ipcMain.handle('experiences-simple:search', async (event, filters) => {
      try {
        const experiences = await this.experienceService.findFiltered(filters);
        return { success: true, data: experiences };
      } catch (error) {
        console.error('Error in experiences-simple:search:', error);
        return { success: false, error: error.message };
      }
    });    // Obtener regiones únicas
    ipcMain.handle('experiences-simple:regions', async () => {
      try {
        const regions = await this.experienceService.getRegions();
        return { success: true, data: regions };
      } catch (error) {
        console.error('Error in experiences-simple:regions:', error);
        return { success: false, error: error.message };
      }
    });

    // Obtener rangos de precios dinámicos
    ipcMain.handle('experiences-simple:price-ranges', async () => {
      try {
        const priceRanges = await this.experienceService.getPriceRanges();
        return { success: true, data: priceRanges };
      } catch (error) {
        console.error('Error in experiences-simple:price-ranges:', error);
        return { success: false, error: error.message };
      }
    });
  }
}

module.exports = ExperienceControllerSimple;
