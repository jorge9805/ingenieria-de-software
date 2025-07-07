// main.js
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let backendProcess;
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    show: false, // No mostrar hasta que esté listo
    webPreferences: {
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  // Abrir herramientas de desarrollador en modo desarrollo
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Mostrar ventana cuando esté lista para prevenir flash visual
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Cargar la aplicación
  const htmlPath = path.join(__dirname, 'frontend/dist/index.html');
  console.log('Cargando archivo:', htmlPath);
  
  mainWindow.loadFile(htmlPath).catch(err => {
    console.error('Error cargando la aplicación:', err);
  });

  // Manejar errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Error cargando página:', errorCode, errorDescription);
  });

  // Manejar cierre de ventana
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Crear menú de aplicación
function createMenu() {
  const template = [
    {
      label: 'Archivo',
      submenu: [
        {
          label: 'Salir',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Ver',
      submenu: [
        { role: 'reload', label: 'Recargar' },
        { role: 'forceReload', label: 'Forzar Recarga' },
        { role: 'toggleDevTools', label: 'Herramientas de Desarrollador' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom Normal' },
        { role: 'zoomIn', label: 'Acercar' },
        { role: 'zoomOut', label: 'Alejar' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Pantalla Completa' }
      ]
    },
    {
      label: 'Ventana',
      submenu: [
        { role: 'minimize', label: 'Minimizar' },
        { role: 'close', label: 'Cerrar' }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about', label: 'Acerca de' },
        { type: 'separator' },
        { role: 'services', label: 'Servicios' },
        { type: 'separator' },
        { role: 'hide', label: 'Ocultar' },
        { role: 'hideothers', label: 'Ocultar Otros' },
        { role: 'unhide', label: 'Mostrar Todo' },
        { type: 'separator' },
        { role: 'quit', label: 'Salir' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(() => {
  // 🚀 Lanza backend Express
  backendProcess = spawn('node', ['index.js'], {
    cwd: path.join(__dirname, 'backend'),
    shell: true,
    stdio: 'inherit',
  });

  // Crear menú
  createMenu();
  
  // Crear ventana principal
  createWindow();

  // En macOS, recrear ventana cuando se hace click en dock
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // Matar proceso del backend
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }
  
  // En macOS, mantener app activa hasta que usuario salga explícitamente
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Manejar cierre de aplicación
app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }
});
