const { app, BrowserWindow, ipcMain, protocol } = require('electron');
const path = require('path');
const fs = require('fs');
const { initializeModels, closeModels } = require('./database/models');
const { EventObserver, APP_EVENTS } = require('./utils/observer');
const { setupEventListeners } = require('./utils/eventSetup');
const AuthController = require('./controllers/AuthController');
const ExperienceController = require('./controllers/ExperienceController');
const CommunityController = require('./controllers/CommunityController');
const ExperienceControllerSimple = require('./controllers/ExperienceControllerSimple');
const ReservationController = require('./controllers/ReservationController');

// Mantener una referencia global del objeto window
let mainWindow;

// Variables globales para los controladores (se inicializarán después)
let authController;
let experienceController;
let communityController;
let experienceControllerSimple;
let reservationController;

// Función para inicializar controladores después de que Electron esté listo
function initializeControllers() {
  console.log('🚀 Initializing controllers...');
  authController = new AuthController();
  experienceController = new ExperienceController();
  communityController = new CommunityController();
  experienceControllerSimple = new ExperienceControllerSimple();
  reservationController = new ReservationController();
  
  // Ahora configurar los event handlers después de que ipcMain esté disponible
  console.log('🔧 Setting up event handlers...');
  communityController.setupEventHandlers();
  experienceControllerSimple.setupEventHandlers();
  
  console.log('✅ Controllers and event handlers initialized');
}

// Función para configurar todos los handlers IPC después de que Electron esté listo
function setupIpcHandlers() {
  console.log('🔧 Setting up IPC handlers...');
    // IPC Handlers para autenticación
  ipcMain.handle('auth:login', async (event, { email, password }) => {
    try {
      return await authController.login(email, password);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('auth:register', async (event, userData) => {
    try {
      return await authController.register(userData);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });  // TODO: Mover todos los demás handlers aquí
  
  // IPC Handlers para experiencias
  ipcMain.handle('experiences:search', async (event, filters) => {
    try {
      return await experienceController.searchExperiences(filters);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('experiences:popular', async (event, { limit = 10 }) => {
    try {
      return await experienceController.getPopularExperiences(limit);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('experiences:recent', async (event, { limit = 10 }) => {
    try {
      return await experienceController.getRecentExperiences(limit);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('experiences:pending', async (_event) => {
    try {
      return await experienceController.getPendingExperiences();
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('experiences:create', async (event, experienceData) => {
    try {
      return await experienceController.createExperience(experienceData);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('experiences:update', async (event, { experienceId, updateData, operatorId, isAdmin = false }) => {
    try {
      return await experienceController.updateExperience(experienceId, updateData, operatorId, isAdmin);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('experiences:delete', async (event, { experienceId, operatorId, isAdmin = false }) => {
    try {
      return await experienceController.deleteExperience(experienceId, operatorId, isAdmin);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('experiences:availability', async (event, { experienceId, date, participants }) => {
    try {
      return await experienceController.calculateAvailability(experienceId, date, participants);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('experiences:price', async (event, { experienceId, participants }) => {
    try {
      return await experienceController.calculateTotalPrice(experienceId, participants);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('experiences:stats', async (_event) => {
    try {
      return await experienceController.getExperienceStats();
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('experiences:by-operator', async (event, { operatorId }) => {
    try {
      return await experienceController.getExperiencesByOperator(operatorId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('experiences:by-community', async (event, { communityId }) => {
    try {
      return await experienceController.getExperiencesByCommunity(communityId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  // IPC Handlers para reservas
  ipcMain.handle('reservations:validate-data', async (event, reservationData) => {
    try {
      return await reservationController.validateReservationData(reservationData);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:validate-availability', async (event, { experienceId, date, participants }) => {
    try {
      return await reservationController.validateAvailability(experienceId, date, participants);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:calculate-estimate', async (event, reservationData) => {
    try {
      console.log('🔍 ELECTRON.JS: Received calculate-estimate request');
      console.log('📊 ELECTRON.JS: Data received:', JSON.stringify(reservationData, null, 2));
      
      const result = await reservationController.calculateReservationEstimate(reservationData);
      
      console.log('📦 ELECTRON.JS: Controller response:', JSON.stringify(result, null, 2));
      
      return result;
    } catch (error) {
      console.error('💥 ELECTRON.JS: Error in calculate-estimate:', error.message);
      console.error('📍 ELECTRON.JS: Stack trace:', error.stack);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:create-estimate', async (event, reservationData) => {
    try {
      return await reservationController.createReservationEstimate(reservationData);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:confirm', async (event, { reservationId }) => {
    try {
      return await reservationController.confirmReservation(reservationId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:cancel', async (event, { reservationId, userId }) => {
    try {
      return await reservationController.cancelReservation(reservationId, userId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:validate-cancellation', async (event, { reservationId, userId }) => {
    try {
      return await reservationController.validateCancellation(reservationId, userId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:complete', async (event, { reservationId }) => {
    try {
      return await reservationController.completeReservation(reservationId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:by-user', async (event, { userId }) => {
    try {
      return await reservationController.getReservationsByUser(userId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:details', async (event, { reservationId }) => {
    try {
      return await reservationController.getReservationDetails(reservationId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:by-status', async (event, { status }) => {
    try {
      return await reservationController.getReservationsByStatus(status);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:by-experience', async (event, { experienceId }) => {
    try {
      return await reservationController.getReservationsByExperience(experienceId);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:stats', async (_event) => {
    try {
      return await reservationController.getReservationStats();
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:calculate-service-price', async (event, { serviceType, basePrice }) => {
    try {
      return await reservationController.calculateServicePrice(serviceType, basePrice);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('reservations:calculate-additional-services', async (event, { services, basePrice }) => {
    try {
      return await reservationController.calculateAdditionalServices(services, basePrice);
    } catch (error) {
      return { success: false, error: error.message };
    }
  });
  
  console.log('✅ IPC handlers configured');
}

// Nota: Los handlers de comunidades están registrados automáticamente en CommunityController

function createWindow() {
  console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
    // Crear la ventana del navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: false, // Permitir acceso a archivos locales
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icons/icon.png'),
    title: 'Colombia Raíces',
    minWidth: 800,
    minHeight: 600,
    show: false, // No mostrar hasta que esté listo
  });// Cargar la aplicación
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Loading development URL: http://localhost:3006');
    mainWindow.loadURL('http://localhost:3006');
    mainWindow.webContents.openDevTools();
    console.log('🛠️ DevTools opened');
  } else {
    console.log('📦 Loading production file');
    mainWindow.loadFile(path.join(__dirname, '../renderer/dist/index.html'));
  }

  // Mostrar cuando esté listo
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Capturar errores de JavaScript y mostrarlos en terminal
    mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
      console.log(`[RENDERER ${level}] ${message}`);
      if (sourceId) {
        console.log(`    at ${sourceId}:${line}`);
      }
    });
    
    // Capturar errores de carga
    mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
      console.error('❌ Page failed to load:', errorDescription, 'URL:', validatedURL);
    });
    
    // Capturar cuando la página termine de cargar
    mainWindow.webContents.on('did-finish-load', () => {
      console.log('✅ Page finished loading');
    });
  });
  // Emitido cuando la ventana es cerrada
  mainWindow.on('closed', () => {
    mainWindow = null;
    
    // Notificar evento de cierre
    EventObserver.notify(APP_EVENTS.WINDOW_CLOSED);
  });
}

// Este método será llamado cuando Electron haya terminado
// la inicialización y esté listo para crear ventanas del navegador
app.whenReady().then(async () => {
  try {    console.log('🚀 Electron app ready - Initializing controllers...');
    
    // Inicializar controladores DESPUÉS de que Electron esté listo
    initializeControllers();
    
    // Configurar handlers IPC DESPUÉS de inicializar controladores
    setupIpcHandlers();
    
    // Configurar protocolo personalizado para imágenes
    protocol.registerHttpProtocol('local-image', (request, callback) => {
      const url = request.url.replace('local-image://', '');
      const imagePath = path.join(__dirname, '../renderer/public', url);
      
      if (fs.existsSync(imagePath)) {
        callback({ path: imagePath });
      } else {
        callback({ error: -6 }); // ENOENT
      }
    });
    
    // Configurar listeners de eventos
    setupEventListeners();
    
    // Inicializar base de datos y modelos
    await initializeModels();
    console.log('Database and models initialized successfully');
    
    // Notificar que la aplicación está lista
    EventObserver.notify(APP_EVENTS.APP_READY);
    
    // Crear ventana principal
    createWindow();
  } catch (error) {
    console.error('Failed to initialize application:', error);
    
    // Notificar error de base de datos
    EventObserver.notify(APP_EVENTS.DATABASE_ERROR, error);
    
    // Cerrar aplicación si falla la inicialización
    app.quit();
  }
});

// Salir cuando todas las ventanas estén cerradas
app.on('window-all-closed', async () => {
  if (process.platform !== 'darwin') {
    try {
      // Cerrar conexiones de base de datos
      await closeModels();
    } catch (error) {
      console.error('Error closing database connections:', error);
    }
    
    app.quit();
  }
});

app.on('activate', async () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Código de seguridad adicional
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});

// Prevenir navegación no deseada
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (parsedUrl.origin !== 'http://localhost:3000' && process.env.NODE_ENV === 'development') {
      event.preventDefault();
    }
  });
});
