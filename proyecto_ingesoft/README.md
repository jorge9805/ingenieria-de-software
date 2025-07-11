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

## ⚡ Opción 1: Instalación Automática (Recomendada)

### Para Linux/macOS:
```bash
# Ejecutar script de instalación automática
./install.sh
```

### Para Windows:
```cmd
# Ejecutar script de instalación automática
install.bat
```

**¿Qué hace el script automático?**
- ✅ Instala todas las dependencias (frontend y backend)
- ✅ Construye el frontend automáticamente
- ✅ Configura variables de entorno
- ✅ Configura la base de datos SQLite automáticamente
- ✅ Inserta datos de ejemplo
- ✅ Verifica que todo esté listo para ejecutar

---

## 🔧 Opción 2: Instalación Manual

### 🗄️ Configurar Base de Datos

**¡No necesitas hacer nada!** SQLite se configura automáticamente cuando ejecutas la aplicación.

- 📁 **Ubicación**: `backend/database/turismo.db`
- 🌱 **Datos de ejemplo**: Se insertan automáticamente
- 👤 **Usuario demo**: `demo@turismo.com` / `demo123`

### ⚙️ Configurar Variables de Entorno

Crear archivo `backend/.env`:
```env
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_cambiala_en_produccion
PORT=4000
NODE_ENV=development
```

### 📦 Instalar Dependencias

```bash
# Instalar dependencias del proyecto
npm install

# Construir el frontend
npm run rebuild
```

### 🏃‍♂️ Ejecutar la Aplicación

Después de la instalación automática o manual:

```bash
npm start
```

La aplicación se abrirá automáticamente y estará disponible en tu navegador.

### 🆘 Problemas Comunes

**Si usaste la instalación automática y hay errores:**
```bash
# Ejecutar manualmente el script paso a paso
npm install
npm run rebuild
npm start
```

**La aplicación no inicia:**
```bash
# Verificar versión de Node.js
node --version  # Debe ser v18+

# Reinstalar dependencias
npm install
cd backend && npm install
```

**Puerto ocupado:**
Cambiar `PORT=4001` en `backend/.env`

**Problemas con SQLite:**
- La base de datos se crea automáticamente en `backend/database/turismo.db`
- Si hay problemas, elimina la carpeta `backend/database` y reinicia la app

## 🛠️ Comandos Útiles

```bash
# Ejecutar la aplicación
npm start

# Reconstruir frontend
npm run rebuild

# Desarrollo frontend
cd frontend && npm run dev

# Desarrollo backend
cd backend && npm start
```

## 📁 Estructura del Proyecto

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

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-feature`)
3. Commit cambios (`git commit -m 'Agrega feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

---

⭐ **¡Dale una estrella si te gusta el proyecto!** ⭐

Hecho con ❤️ por **Team Sobrecupo**
