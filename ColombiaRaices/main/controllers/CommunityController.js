// Controlador para gestionar comunidades a través de IPC
const { ipcMain } = require('electron');
const CommunityService = require('../services/CommunityService');

class CommunityController {
  constructor() {
    this.communityService = new CommunityService();
    // NO llamar setupEventHandlers aquí - se llamará después
  }

  // Método para obtener todas las comunidades (usado por electron.js)
  async getAllCommunities() {
    try {
      const communities = await this.communityService.findAll();
      return { success: true, data: communities };
    } catch (error) {
      console.error('Error in getAllCommunities:', error);
      return { success: false, error: error.message };
    }
  }

  // Método para obtener comunidad por ID (usado por electron.js)
  async getCommunityById(id) {
    try {
      const community = await this.communityService.findById(id);
      return { success: true, data: community };
    } catch (error) {
      console.error('Error in getCommunityById:', error);
      return { success: false, error: error.message };
    }
  }

  // Método para obtener comunidades por región (usado por electron.js)
  async getCommunitiesByRegion(region) {
    try {
      const communities = await this.communityService.findByRegion(region);
      return { success: true, data: communities };
    } catch (error) {
      console.error('Error in getCommunitiesByRegion:', error);
      return { success: false, error: error.message };
    }
  }

  // Método para obtener estadísticas de comunidades (usado por electron.js)
  async getCommunityStats() {
    try {
      const stats = await this.communityService.getStats();
      return { success: true, data: stats };
    } catch (error) {
      console.error('Error in getCommunityStats:', error);
      return { success: false, error: error.message };
    }
  }
  setupEventHandlers() {
    // Obtener todas las comunidades
    ipcMain.handle('communities:all', async () => {
      try {
        const communities = await this.communityService.findAll();
        return { success: true, data: communities };
      } catch (error) {
        console.error('Error in communities:all:', error);
        return { success: false, error: error.message };
      }
    });    // Obtener comunidad por ID
    ipcMain.handle('communities:by-id', async (event, id) => {
      try {
        const community = await this.communityService.findById(id);
        return { success: true, data: community };
      } catch (error) {
        console.error('Error in communities:by-id:', error);
        return { success: false, error: error.message };
      }
    });

    // Obtener comunidades por región
    ipcMain.handle('communities:by-region', async (event, region) => {
      try {
        const communities = await this.communityService.findByRegion(region);
        return { success: true, data: communities };
      } catch (error) {
        console.error('Error in communities:by-region:', error);
        return { success: false, error: error.message };
      }
    });

    // Obtener estadísticas de comunidades
    ipcMain.handle('communities:stats', async () => {
      try {
        const stats = await this.communityService.getStats();
        return { success: true, data: stats };
      } catch (error) {
        console.error('Error in communities:stats:', error);
        return { success: false, error: error.message };
      }
    });
  }
}

module.exports = CommunityController;