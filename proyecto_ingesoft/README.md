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
```bash
# Opción 1: Con Git Bash
./install.sh

# Opción 2: Con Command Prompt/PowerShell
install.bat
```

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

```bash
npm start
```

La aplicación se abrirá automáticamente en una ventana de Electron.

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
