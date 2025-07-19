// main.js
const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

let backendProcess;
let mainWindow;
let frontendServer;
let viteProcess;

// Función para iniciar el servidor Vite
function startViteServer() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Iniciando servidor Vite...');
    
    const isWindows = process.platform === 'win32';
    const command = isWindows ? 'npm.cmd' : 'npm';
    const args = ['run', 'dev'];
    
    const viteProc = spawn(command, args, {
      cwd: path.join(__dirname, 'frontend'),
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    let hasStarted = false;
    let startupOutput = '';
    
    // Timeout para evitar espera infinita
    const timeout = setTimeout(() => {
      if (!hasStarted) {
        hasStarted = true;
        reject(new Error('Timeout: Vite tardó demasiado en iniciar (30s)'));
      }
    }, 30000);
    
    viteProc.stdout.on('data', (data) => {
      const output = data.toString();
      startupOutput += output;
      console.log(`Vite: ${output}`);
      
      // Buscar señales de que Vite está listo
      if (output.includes('ready in') || output.includes('Local:   http://localhost:5173')) {
        if (!hasStarted) {
          hasStarted = true;
          clearTimeout(timeout);
          console.log('✅ Vite iniciado correctamente');
          resolve(viteProc);
        }
      }
    });
    
    viteProc.stderr.on('data', (data) => {
      const error = data.toString();
      console.error(`Vite Error: ${error}`);
      
      // Si hay errores críticos, rechazar
      if (error.includes('EADDRINUSE')) {
        if (!hasStarted) {
          hasStarted = true;
          clearTimeout(timeout);
          reject(new Error(`Puerto 5173 ocupado. Error: ${error}`));
        }
      }
    });
    
    viteProc.on('error', (error) => {
      if (!hasStarted) {
        hasStarted = true;
        clearTimeout(timeout);
        reject(new Error(`Error al ejecutar npm run dev: ${error.message}`));
      }
    });
    
    viteProc.on('exit', (code) => {
      if (!hasStarted && code !== 0) {
        hasStarted = true;
        clearTimeout(timeout);
        reject(new Error(`Vite salió con código ${code}. Output: ${startupOutput}`));
      }
    });
  });
}

// Función para verificar si Vite está ejecutándose
function checkViteHealth(maxRetries = 10, delay = 1000) {
  return new Promise((resolve, reject) => {
    let retries = 0;
    
    const check = () => {
      const req = http.get('http://localhost:5173', (res) => {
        console.log('✅ Vite está respondiendo');
        resolve(true);
      });
      
      req.on('error', () => {
        retries++;
        if (retries >= maxRetries) {
          console.error('❌ Vite no está respondiendo después de', maxRetries, 'intentos');
          reject(new Error('Vite no disponible'));
        } else {
          console.log(`🔄 Intento ${retries}/${maxRetries} - Esperando Vite...`);
          setTimeout(check, delay);
        }
      });
      
      req.setTimeout(2000, () => {
        req.destroy();
        retries++;
        if (retries >= maxRetries) {
          console.error('❌ Vite no está respondiendo después de', maxRetries, 'intentos');
          reject(new Error('Vite no disponible'));
        } else {
          console.log(`🔄 Intento ${retries}/${maxRetries} - Esperando Vite...`);
          setTimeout(check, delay);
        }
      });
    };
    
    check();
  });
}

// Función para iniciar el backend
function startBackend() {
  return new Promise((resolve, reject) => {
    console.log('🚀 Iniciando servidor backend...');
    
    const isWindows = process.platform === 'win32';
    const command = isWindows ? 'npm.cmd' : 'npm';
    const args = ['start'];
    
    const backendProc = spawn(command, args, {
      cwd: path.join(__dirname, 'backend'),
      shell: true,
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    let hasStarted = false;
    let startupOutput = '';
    
    // Timeout para evitar espera infinita
    const timeout = setTimeout(() => {
      if (!hasStarted) {
        hasStarted = true;
        reject(new Error('Timeout: El backend tardó demasiado en iniciar (30s)'));
      }
    }, 30000);
    
    backendProc.stdout.on('data', (data) => {
      const output = data.toString();
      startupOutput += output;
      console.log(`Backend: ${output}`);
      
      // Buscar señales de que el servidor está listo
      if (output.includes('Servidor ejecutándose') || output.includes('🚀')) {
        if (!hasStarted) {
          hasStarted = true;
          clearTimeout(timeout);
          console.log('✅ Backend iniciado correctamente');
          resolve(backendProc);
        }
      }
    });
    
    backendProc.stderr.on('data', (data) => {
      const error = data.toString();
      console.error(`Backend Error: ${error}`);
      
      // Si hay errores críticos, rechazar
      if (error.includes('EADDRINUSE')) {
        if (!hasStarted) {
          hasStarted = true;
          clearTimeout(timeout);
          reject(new Error(`Puerto 4000 ocupado. Error: ${error}`));
        }
      } else if (error.includes('Cannot find module') || error.includes('MODULE_NOT_FOUND')) {
        if (!hasStarted) {
          hasStarted = true;
          clearTimeout(timeout);
          reject(new Error(`Dependencias faltantes: ${error}`));
        }
      }
    });
    
    backendProc.on('error', (error) => {
      if (!hasStarted) {
        hasStarted = true;
        clearTimeout(timeout);
        reject(new Error(`Error al ejecutar npm: ${error.message}`));
      }
    });
    
    backendProc.on('exit', (code) => {
      if (!hasStarted && code !== 0) {
        hasStarted = true;
        clearTimeout(timeout);
        reject(new Error(`Backend salió con código ${code}. Output: ${startupOutput}`));
      }
    });
  });
}

// Función para verificar si el backend está ejecutándose
function checkBackendHealth(maxRetries = 10, delay = 1000) {
  return new Promise((resolve, reject) => {
    let retries = 0;
    
    const check = () => {
      const req = http.get('http://localhost:4000', (res) => {
        console.log('✅ Backend está respondiendo');
        resolve(true);
      });
      
      req.on('error', () => {
        retries++;
        if (retries >= maxRetries) {
          console.error('❌ Backend no está respondiendo después de', maxRetries, 'intentos');
          reject(new Error('Backend no disponible'));
        } else {
          console.log(`🔄 Intento ${retries}/${maxRetries} - Esperando backend...`);
          setTimeout(check, delay);
        }
      });
      
      req.setTimeout(2000, () => {
        req.destroy();
        retries++;
        if (retries >= maxRetries) {
          console.error('❌ Backend no está respondiendo después de', maxRetries, 'intentos');
          reject(new Error('Backend no disponible'));
        } else {
          console.log(`🔄 Intento ${retries}/${maxRetries} - Esperando backend...`);
          setTimeout(check, delay);
        }
      });
    };
    
    check();
  });
}

// Función para iniciar servidor web para el frontend
function startFrontendServer() {
  return new Promise((resolve, reject) => {
    const frontendDistPath = path.join(__dirname, 'frontend/dist');
    const indexPath = path.join(frontendDistPath, 'index.html');
    
    // Leer el archivo index.html una vez
    if (!fs.existsSync(indexPath)) {
      reject(new Error(`No se encontró index.html en: ${indexPath}`));
      return;
    }
    
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Función para obtener el MIME type correcto
    const getMimeType = (filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        '.html': 'text/html',
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon'
      };
      return mimeTypes[ext] || 'text/plain';
    };
    
    frontendServer = http.createServer((req, res) => {
      let requestPath = req.url === '/' ? '/index.html' : req.url;
      const filePath = path.join(frontendDistPath, requestPath);
      
      // Si el archivo existe, servirlo
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const mimeType = getMimeType(filePath);
        const content = fs.readFileSync(filePath);
        
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(content);
      } else {
        // Para React Router - rutas no encontradas sirven index.html
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(indexContent);
      }
    });
    
    frontendServer.listen(3000, 'localhost', (err) => {
      if (err) {
        console.error('❌ Error iniciando servidor frontend:', err);
        reject(err);
      } else {
        console.log('🚀 Servidor frontend ejecutándose en http://localhost:3000');
        resolve();
      }
    });
  });
}

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
      webSecurity: false, // Permite conexiones localhost
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

  // Cargar la aplicación desde el servidor web local
  const frontendUrl = 'http://localhost:5173';
  mainWindow.loadURL(frontendUrl).catch(err => {
    console.error('Error cargando la aplicación:', err);
  });

  // Manejar errores de carga
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Error de carga:', { errorCode, errorDescription, validatedURL });
  });

  // Interceptar errores de consola del frontend para debugging
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    if (level >= 2) { // Solo mostrar warnings y errores
      console.log(`Frontend Console [${level}]:`, message);
    }
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

app.whenReady().then(async () => {
  try {
    console.log('Iniciando aplicación TurismoApp...');
    
    // Iniciar Vite primero
    viteProcess = await startViteServer();
    await checkViteHealth();
    
    // Luego iniciar backend
    backendProcess = await startBackend();
    await checkBackendHealth();

    createMenu();
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
    
    console.log('✅ Aplicación TurismoApp iniciada correctamente');
  } catch (error) {
    console.error('❌ Error al inicializar la aplicación:', error);
    
    const { dialog } = require('electron');
    dialog.showErrorBox('Error de Inicialización', `No se pudo inicializar la aplicación: ${error.message}`);
    app.quit();
  }
});

// Función para limpiar procesos al cerrar
function cleanup() {
  if (backendProcess) {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', backendProcess.pid, '/f', '/t'], { shell: true });
    } else {
      backendProcess.kill('SIGTERM');
    }
  }
  
  if (viteProcess) {
    if (process.platform === 'win32') {
      spawn('taskkill', ['/pid', viteProcess.pid, '/f', '/t'], { shell: true });
    } else {
      viteProcess.kill('SIGTERM');
    }
  }
  
  if (frontendServer) {
    frontendServer.close();
  }
}

app.on('window-all-closed', () => {
  cleanup();
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', cleanup);
