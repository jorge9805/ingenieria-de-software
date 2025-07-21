<div align="center">
  
<img src="./assets/osprey-logo.png" alt="OSPREY Logo" width="200">

# COLOMBIA RAÍCES

Explora, califica y comparte experiencias turísticas.
</div>

---


### 📝 Descripción 

Colombia Raíces es una aplicación moderna para descubrir, compartir y comentar lugares turísticos. Los usuarios pueden explorar destinos, calificar experiencias, guardar favoritos y compartir recomendaciones con la comunidad.

**Stack:** React, Node.js, Express, SQLite

---

### ✨ Características

- 🏞️ Explora destinos turísticos  
- ❤️ Guarda favoritos  
- ⭐ Califica y comenta  
- 🔐 Autenticación con JWT  
- 📱 Diseño responsivo 

---

### 🚀 Inicio rápido

#### Pre-requisitos
- **Node.js** (v18+) - [Descargar](https://nodejs.org/)
- **Git** - [Descargar](https://git-scm.com/)

*SQLite se incluye automáticamente - ¡no necesitas instalar nada más!*

### 📥 Clonar el repositorio

```bash
git clone https://github.com/jorge9805/ingenieria-de-software.git
cd ingenieria-de-software/proyecto_ingesoft
./install.sh

```

##### **¿Qué hace el script automático?**
- ✅ Verifica prerequisitos (Node.js, npm, Git)
- ✅ Instala todas las dependencias (proyecto principal, frontend, backend)
- ✅ Construye el frontend automáticamente
- ✅ Configura variables de entorno
- ✅ Configura la base de datos SQLite automáticamente
- ✅ Inserta datos de ejemplo
- ✅ Verifica que todo esté listo para ejecutar

---

#### **Instalación manual** 🔧

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

### 🗄️ Configuración de Base de Datos

**¡No necesitas hacer nada!** SQLite se configura automáticamente cuando ejecutas la aplicación.

- 📁 **Ubicación**: `backend/database/turismo.db`
- 🌱 **Datos de ejemplo**: Se insertan automáticamente al iniciar
- 👤 **Usuario demo**: `demo@turismo.com` / `demo123`

### ⚙️ Variables de entorno (opcional)

Si necesitas personalizar la configuración, crea el archivo `backend/.env`:
```env
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_cambiala_en_produccion
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

> � **Nota**: Los scripts automáticos crean este archivo por ti usando `.env.example`

### 🏃‍♂️ Ejecutar la aplicación

Una vez instalado (con cualquier método), ejecuta:

```bash
npm start
```

La aplicación se abrirá automáticamente en una ventana de Electron.

---

### 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-feature`)
3. Commit cambios (`git commit -m 'Agrega feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

---

⭐ **¡Dale una estrella si te gusta el proyecto!** ⭐

Hecho con ❤️ por **Team Sobrecupo**
