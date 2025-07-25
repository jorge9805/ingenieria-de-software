// Servicio para comunicación con el proceso main
class ApiService {
  constructor() {
    this.electronAPI = window.electronAPI;
  }

  // Verificar si estamos en entorno Electron
  isElectron() {
    return !!this.electronAPI;
  }

  // Obtener versión de Electron
  getVersion() {
    return this.electronAPI?.getVersion() || 'Web';
  }

  // Placeholder para futuras APIs
  async callMainProcess(channel, data) {
    if (!this.isElectron()) {
      console.warn('Not in Electron environment');
      return null;
    }
    
    // Implementar comunicación IPC en futuros sprints
    return null;
  }
}

export default new ApiService();
