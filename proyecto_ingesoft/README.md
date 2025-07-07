# 🌟 TurismoApp - Aplicación de Turismo de Escritorio

Una moderna aplicación de escritorio para descubrir, compartir y comentar lugares turísticos increíbles. Construida con React, Node.js, PostgreSQL y Electron.

![TurismoApp Preview](https://img.shields.io/badge/Platform-Desktop-blue?style=for-the-badge&logo=electron)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-336791?style=for-the-badge&logo=postgresql)
![Electron](https://img.shields.io/badge/Electron-28+-47848F?style=for-the-badge&logo=electron)

## ✨ Características

- 🏞️ **Explorar Destinos**: Navega por una colección de lugares turísticos
- ❤️ **Sistema de Favoritos**: Guarda tus lugares preferidos
- ⭐ **Calificaciones y Comentarios**: Comparte tu experiencia y lee la de otros
- 🔐 **Autenticación Segura**: Sistema de registro y login con JWT
- 📱 **Diseño Responsivo**: Interfaz moderna y adaptable
- 🖥️ **Aplicación de Escritorio**: Funciona como una app nativa
- 🎨 **UI/UX Moderno**: Diseño elegante con animaciones suaves

## 🚀 Instalación Rápida

### Prerrequisitos

Asegúrate de tener instalado en tu sistema:

- **Node.js** (v18 o superior) - [Descargar aquí](https://nodejs.org/)
- **PostgreSQL** (v13 o superior) - [Descargar aquí](https://www.postgresql.org/download/)
- **Git** - [Descargar aquí](https://git-scm.com/)

### 📥 Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/turismo-app.git
cd turismo-app
```

### 🗄️ Configurar Base de Datos

1. **Crear la base de datos en PostgreSQL:**

```sql
-- Conectarse a PostgreSQL como superusuario
psql -U postgres

-- Crear la base de datos
CREATE DATABASE turismo_db;

-- Crear usuario (opcional)
CREATE USER turismo_user WITH PASSWORD 'tu_password';
GRANT ALL PRIVILEGES ON DATABASE turismo_db TO turismo_user;

-- Salir de psql
\q
```

2. **Crear las tablas necesarias:**

```sql
-- Conectarse a la base de datos
psql -U postgres -d turismo_db

-- Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de posts
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de favoritos
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, post_id)
);

-- Crear tabla de comentarios
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar datos de ejemplo
INSERT INTO users (username, email, password) VALUES 
('demo_user', 'demo@example.com', '$2b$10$example_hashed_password'),
('turista1', 'turista1@example.com', '$2b$10$example_hashed_password');

INSERT INTO posts (title, description, image_url, user_id) VALUES 
('Machu Picchu, Perú', 'Una de las nuevas siete maravillas del mundo, esta antigua ciudad inca ofrece vistas espectaculares y una rica historia.', 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1),
('Torre Eiffel, París', 'El icónico símbolo de París ofrece vistas panorámicas de la ciudad luz desde sus diferentes niveles.', 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 1),
('Santorini, Grecia', 'Hermosas casas blancas con techos azules, atardeceres espectaculares y vistas al mar Egeo.', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80', 2);

\q
```

### ⚙️ Configurar Variables de Entorno

1. **Crear archivo `.env` en la carpeta `backend`:**

```bash
cd backend
touch .env
```

2. **Agregar la configuración de la base de datos:**

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=turismo_db
DB_USER=postgres
DB_PASSWORD=tu_password_postgresql

JWT_SECRET=tu_clave_secreta_muy_segura_aqui
PORT=4000
```

### 📦 Instalar Dependencias y Ejecutar

```bash
# Volver al directorio raíz
cd ..

# Instalar todas las dependencias automáticamente
npm install

# Ejecutar la aplicación
npm start
```

¡Eso es todo! 🎉 La aplicación se abrirá automáticamente en una ventana de Electron.

## 🛠️ Comandos Disponibles

```bash
# Ejecutar la aplicación
npm start

# Reconstruir solo el frontend (después de hacer cambios)
npm run rebuild

# Construir para distribución
npm run build               # Todas las plataformas
npm run build:linux        # Solo Linux
npm run build:win          # Solo Windows
npm run build:mac          # Solo macOS

# Desarrollo del frontend
cd frontend
npm run dev                 # Servidor de desarrollo Vite

# Desarrollo del backend
cd backend
npm start                   # Servidor Express
```

## 📁 Estructura del Proyecto

```
turismo-app/
├── 📄 main.js                    # Proceso principal de Electron
├── 📄 package.json               # Configuración principal y scripts
├── 📄 README.md                  # Este archivo
├── 📁 frontend/                  # Aplicación React (UI)
│   ├── 📁 src/
│   │   ├── 📁 components/        # Componentes reutilizables
│   │   ├── 📁 pages/             # Páginas de la aplicación
│   │   ├── 📄 App.jsx            # Componente principal
│   │   └── 📄 index.css          # Estilos globales
│   ├── 📁 dist/                  # Build de producción
│   └── 📄 vite.config.js         # Configuración de Vite
├── 📁 backend/                   # Servidor Express (API)
│   ├── 📁 routes/                # Rutas de la API
│   │   ├── 📄 auth.js            # Autenticación
│   │   ├── 📄 posts.js           # Posts turísticos
│   │   ├── 📄 comments.js        # Comentarios
│   │   └── 📄 favorites.js       # Sistema de favoritos
│   ├── 📁 middleware/            # Middleware personalizado
│   ├── 📄 db.js                  # Configuración de base de datos
│   ├── 📄 index.js               # Servidor principal
│   └── 📄 .env                   # Variables de entorno
└── 📁 assets/                    # Recursos para empaquetado
```

## 🔧 Solución de Problemas

### ❌ Error de Conexión a la Base de Datos

```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql   # Linux
brew services list | grep postgres # macOS

# Verificar conexión
psql -U postgres -d turismo_db -c "SELECT version();"
```

### ❌ Pantalla en Blanco

```bash
# Reconstruir el frontend
npm run rebuild
npm start
```

### ❌ Puerto 4000 en Uso

```bash
# Encontrar el proceso que usa el puerto
lsof -i :4000              # macOS/Linux
netstat -ano | findstr 4000   # Windows

# Cambiar el puerto en backend/.env
PORT=4001
```

### ❌ Error de Módulos

```bash
# Limpiar e instalar dependencias
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf backend/node_modules backend/package-lock.json

npm install
```

## 🎨 Tecnologías Utilizadas

### Frontend
- **React 18** - Biblioteca de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **CSS3** - Estilos modernos con variables CSS
- **Lucide React** - Iconos modernos
- **React Router** - Navegación entre páginas

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación segura
- **bcrypt** - Encriptación de contraseñas
- **CORS** - Política de origen cruzado

### Desktop
- **Electron** - Framework para aplicaciones de escritorio
- **Electron Builder** - Empaquetado y distribución

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva caracteristica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🙋‍♂️ Soporte

¿Tienes algún problema o pregunta? 

- 🐛 [Reportar un Bug](https://github.com/tu-usuario/turismo-app/issues)
- 💡 [Solicitar Feature](https://github.com/tu-usuario/turismo-app/issues)
- 📧 Email: tu-email@example.com

## 📸 Capturas de Pantalla

### 🏠 Página Principal
*Vista de todos los destinos turísticos disponibles*

### 🔐 Sistema de Autenticación
*Login y registro de usuarios*

### ❤️ Sistema de Favoritos
*Guarda tus lugares preferidos*

### ⭐ Comentarios y Calificaciones
*Comparte tu experiencia con otros usuarios*

---

⭐ **¡Si te gusta este proyecto, dale una estrella en GitHub!** ⭐

Hecho con ❤️ para la comunidad de desarrolladores
