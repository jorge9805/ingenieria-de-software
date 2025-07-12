<div align="center">
  
<img src="https://raw.githubusercontent.com/jorge9805/ingenieria-de-software/refs/heads/main/proyecto_ingesoft/assets/osprey-logo.png" alt="OSPREY Logo" width="40">

# OSPREY - TurismoApp

</div>

## 👥 Team Sobrecupo

- **Jorge Cuadrado Velásquez**
- **Juan D'Aleman**
- **Juan Ladino** 
- **Smith Forero**

## 📝 Descripción del Proyecto

Osprey es una aplicación web moderna para descubrir, compartir y comentar lugares turísticos. Los usuarios pueden explorar destinos, calificar experiencias, guardar favoritos y compartir recomendaciones con la comunidad.

**Tecnologías:** React, Node.js, SQLite, Express

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![SQLite](https://img.shields.io/badge/SQLite-3.36+-003B57?style=for-the-badge&logo=sqlite)

## ✨ Características

- 🏞️ **Explorar Destinos**: Navega por una colección de lugares turísticos
- ❤️ **Sistema de Favoritos**: Guarda tus lugares preferidos
- ⭐ **Calificaciones y Comentarios**: Comparte tu experiencia y lee la de otros
- 🔐 **Autenticación Segura**: Sistema de registro y login con JWT
- 📱 **Diseño Responsivo**: Interfaz moderna y adaptable

## 🚀 Guía de Inicio Rápido

### Prerrequisitos
- **Node.js** (v18+) - [Descargar](https://nodejs.org/)
- **Git** - [Descargar](https://git-scm.com/)

*SQLite se incluye automáticamente - ¡no necesitas instalar nada más!*

### 📥 Clonar el Repositorio

```bash
git clone https://github.com/jorge9805/ingenieria-de-software.git
cd ingenieria-de-software/proyecto_ingesoft
```

## ⚡ Instalación

TurismoApp ofrece **múltiples métodos de instalación** para adaptarse a diferentes sistemas operativos y preferencias de terminal:

### 📋 Requisitos Previos

- **Node.js** v18 o superior ([Descargar aquí](https://nodejs.org/))
- **npm** (incluido con Node.js)
- **Git** (recomendado) ([Descargar aquí](https://git-scm.com/))

*SQLite se incluye automáticamente - ¡no necesitas instalar nada más!*

### 🛠️ Métodos de Instalación

#### **Método 1: Script Automático** ⭐ *Recomendado*

| Sistema | Terminal | Comando |
|---------|----------|---------|
| **Linux/macOS** | Terminal nativo | `./install.sh` |
| **Windows** | Git Bash | `./install.sh` |
| **Windows** | Command Prompt/PowerShell | `install.bat` |

#### **Para Linux/macOS:**
```bash
# Ejecutar script de instalación automática
./install.sh
```

#### **Para Windows:**

##### 🥇 **Opción Recomendada - Git Bash:**
```bash
# 1. Instalar Git for Windows (si no lo tienes): https://git-scm.com/download/win
# 2. Abrir Git Bash en la carpeta del proyecto
# 3. Ejecutar:
./install.sh
```

**Configurar Git Bash en VS Code** (opcional):
1. `Ctrl + Shift + P` → "Terminal: Select Default Profile"
2. Seleccionar **"Git Bash"**

##### 🥈 **Opción Alternativa - Windows Nativo:**
```cmd
# En Command Prompt o PowerShell de Windows
install.bat
```

> 💡 **Recomendación**: Git Bash ofrece mejor compatibilidad y experiencia más consistente entre plataformas.

#### **¿Qué hace el script automático?**
- ✅ Verifica prerequisitos (Node.js, npm, Git)
- ✅ Instala todas las dependencias (proyecto principal, frontend, backend)
- ✅ Construye el frontend automáticamente
- ✅ Configura variables de entorno
- ✅ Configura la base de datos SQLite automáticamente
- ✅ Inserta datos de ejemplo
- ✅ Verifica que todo esté listo para ejecutar

---

#### **Método 2: Instalación Manual** 🔧

Si los scripts automáticos no funcionan en tu sistema:

```bash
# 1. Instalar dependencias del proyecto principal
npm install

# 2. Instalar y construir el frontend
cd frontend
npm install
npm run build
cd ..

# 3. Instalar dependencias del backend
cd backend
npm install
cd ..

# 4. Configurar variables de entorno (opcional)
# Copia .env.example a backend/.env y edita JWT_SECRET
```

---

## 🗄️ Configuración de Base de Datos

**¡No necesitas hacer nada!** SQLite se configura automáticamente cuando ejecutas la aplicación.

- 📁 **Ubicación**: `backend/database/turismo.db`
- 🌱 **Datos de ejemplo**: Se insertan automáticamente al iniciar
- 👤 **Usuario demo**: `demo@turismo.com` / `demo123`

## ⚙️ Variables de Entorno (Opcional)

Si necesitas personalizar la configuración, crea el archivo `backend/.env`:
```env
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_cambiala_en_produccion
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

> � **Nota**: Los scripts automáticos crean este archivo por ti usando `.env.example`

## 🏃‍♂️ Ejecutar la Aplicación

Una vez instalado (con cualquier método), ejecuta:

Después de la instalación automática o manual:

#### En Linux/macOS o Windows con Git Bash:
```bash
npm start
```

#### En Windows CMD/PowerShell:
```cmd
npm start
```

> 💡 **Recomendación para Windows**: Usar Git Bash proporciona una experiencia más consistente y mejor compatibilidad con herramientas de desarrollo.

La aplicación se abrirá automáticamente en una ventana de Electron.

### 🆘 Solución de Problemas por Plataforma

#### **Problemas con Scripts Automáticos:**

**Linux/macOS:**
```bash
# Si ./install.sh no funciona:
chmod +x install.sh
./install.sh

# O instalación manual:
npm install && cd frontend && npm install && npm run build && cd ../backend && npm install && cd ..
```

**Windows - Git Bash:**
```bash
# Si ./install.sh no funciona en Git Bash:
# 1. Verificar que tengas Git for Windows instalado
# 2. Probar con:
bash install.sh

# O usar instalación manual
```

**Windows - Command Prompt:**
```cmd
# Si install.bat no funciona:
# 1. Ejecutar como administrador
# 2. Verificar que Node.js esté en PATH
# 3. Probar instalación manual paso a paso:
npm install
cd frontend
npm install
npm run build
cd ..
cd backend
npm install
cd ..
```

#### **Problemas Generales:**

**La aplicación no inicia:**
```bash
# Verificar versión de Node.js
node --version  # Debe ser v18+

# Reinstalar dependencias
npm clean-install
cd backend && npm clean-install && cd ..
cd frontend && npm clean-install && cd ..
```

**Puerto ocupado:**
- Cambiar `PORT=4001` en `backend/.env`
- O cerrar otras aplicaciones que usen el puerto 4000

**Problemas con SQLite:**
- La base de datos se crea automáticamente en `backend/database/turismo.db`
- Si hay problemas, elimina la carpeta `backend/database` y reinicia la app

**Problemas de permisos (Windows):**
- Ejecutar terminal como administrador
- Verificar que Windows Defender no esté bloqueando la instalación

### 🐧 Configuración de Git Bash en Windows

**¿Por qué Git Bash?**
- ✅ Comandos consistentes entre Windows y Linux
- ✅ Mejor compatibilidad con scripts de desarrollo
- ✅ Soporte completo para herramientas modernas
- ✅ Menos problemas con paths y comandos

**Configuración en VS Code:**
1. Instalar [Git for Windows](https://git-scm.com/download/win)
2. En VS Code: `Ctrl + Shift + P`
3. Buscar: "Terminal: Select Default Profile"
4. Seleccionar: **"Git Bash"**
5. Reiniciar VS Code

**Verificar instalación:**
```bash
# En Git Bash, estos comandos deben funcionar:
node --version
npm --version
git --version
```

##  Estructura del Proyecto

```
proyecto_ingesoft/
├── 📁 frontend/              # Aplicación React
├── 📁 backend/               # API Express
├── 📄 package.json           # Scripts principales
├── 📄 database_setup.sql     # Setup de BD
├── 📄 install.sh             # Instalación automática (Linux/macOS)
├── 📄 install.bat            # Instalación automática (Windows)
└── 📄 README.md              # Esta guía
```

## 🎨 Tecnologías

**Frontend:** React, Vite, CSS3  
**Backend:** Node.js, Express, JWT  
**Base de Datos:** SQLite (automática y portable)  

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-feature`)
3. Commit cambios (`git commit -m 'Agrega feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

---

⭐ **¡Dale una estrella si te gusta el proyecto!** ⭐

Hecho con ❤️ por **Team Sobrecupo**
