<div align="center">
  
<img src="https://raw.githubusercontent.com/jorge9805/ingenieria-de-software/proyecto_ingesoft/assets/osprey-logo.png" alt="OSPREY Logo" width="40">

# OSPREY - TurismoApp


</div>

## 👥 Team Sobrecupo

- **Jorge Cuadrado Velásquez**
- **Juan D'Aleman**
- **Juan Ladino** 
- **Smith Forero**

## 📝 Descripción del Proyecto

TurismoApp es una aplicación web moderna para descubrir, compartir y comentar lugares turísticos. Los usuarios pueden explorar destinos, calificar experiencias, guardar favoritos y compartir recomendaciones con la comunidad.

**Tecnologías:** React, Node.js, PostgreSQL, Express

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?style=for-the-badge&logo=postgresql)

## ✨ Características

- 🏞️ **Explorar Destinos**: Navega por una colección de lugares turísticos
- ❤️ **Sistema de Favoritos**: Guarda tus lugares preferidos
- ⭐ **Calificaciones y Comentarios**: Comparte tu experiencia y lee la de otros
- 🔐 **Autenticación Segura**: Sistema de registro y login con JWT
- 📱 **Diseño Responsivo**: Interfaz moderna y adaptable

## � Guía de Inicio Rápido

### Prerrequisitos
- **Node.js** (v18+) - [Descargar](https://nodejs.org/)
- **PostgreSQL** (v13+) - [Descargar](https://www.postgresql.org/download/)
- **Git** - [Descargar](https://git-scm.com/)

### 📥 Clonar el Repositorio

```bash
git clone https://github.com/jorge9805/ingenieria-de-software.git
cd ingenieria-de-software/proyecto_ingesoft
```

### 🗄️ Configurar Base de Datos

**Método Rápido:**
```bash
psql -U postgres -f database_setup.sql
```

**Método Manual:**
1. Abrir PostgreSQL: `psql -U postgres`
2. Crear base de datos: `CREATE DATABASE turismo_db;`
3. Conectarse: `\c turismo_db`
4. Ejecutar el contenido de `database_setup.sql`

### ⚙️ Configurar Variables de Entorno

Crear archivo `backend/.env`:
```env
DB_PASSWORD=tu_password_postgresql
JWT_SECRET=tu_clave_secreta_aqui
PORT=4000
```

### 🏃‍♂️ Ejecutar la Aplicación

#### Para Linux:
```bash
# Instalar dependencias
npm install

# Ejecutar aplicación
npm start
```

#### Para Windows:
```cmd
# Instalar dependencias
npm install

# Ejecutar aplicación
npm start
```

### 🆘 Problemas Comunes

**PostgreSQL no conecta:**
```bash
# Linux
sudo systemctl start postgresql

# Windows
net start postgresql-x64-13
```

**Pantalla en blanco:**
```bash
npm run rebuild
npm start
```

**Puerto ocupado:**
Cambiar `PORT=4001` en `backend/.env`

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
├──  frontend/              # Aplicación React
├── 📁 backend/               # API Express
├──  package.json           # Scripts principales
├── � database_setup.sql     # Setup de BD
└── 📄 README.md             # Esta guía
```

## 🎨 Tecnologías

**Frontend:** React, Vite, CSS3  
**Backend:** Node.js, Express, JWT  
**Base de Datos:** PostgreSQL  

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama (`git checkout -b feature/nueva-feature`)
3. Commit cambios (`git commit -m 'Agrega feature'`)
4. Push a la rama (`git push origin feature/nueva-feature`)
5. Abre un Pull Request

---

⭐ **¡Dale una estrella si te gusta el proyecto!** ⭐

Hecho con ❤️ por **Team Sobrecupo**
