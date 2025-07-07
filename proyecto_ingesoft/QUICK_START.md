# Guía de Inicio Rápido - TurismoApp

## 🚀 Opción 1: Instalación Automática (Recomendada)

### Para Linux/macOS:
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/turismo-app.git
cd turismo-app

# Ejecutar instalación automática
./install.sh
```

### Para Windows:
```cmd
# Clonar el repositorio
git clone https://github.com/tu-usuario/turismo-app.git
cd turismo-app

# Ejecutar instalación automática
install.bat
```

## 🗄️ Configuración de Base de Datos

### Método Rápido:
```bash
# Configurar base de datos automáticamente
psql -U postgres -f database_setup.sql
```

### Método Manual:
1. Abrir PostgreSQL: `psql -U postgres`
2. Crear base de datos: `CREATE DATABASE turismo_db;`
3. Conectarse: `\c turismo_db`
4. Ejecutar el contenido de `database_setup.sql`

## ⚙️ Configuración de Variables

1. Copiar archivo de ejemplo:
```bash
cp .env.example backend/.env
```

2. Editar `backend/.env` con tus datos:
```env
DB_PASSWORD=tu_password_postgresql
JWT_SECRET=tu_clave_secreta_aqui
```

## 🏃‍♂️ Ejecutar la Aplicación

```bash
npm start
```

## 🆘 Problemas Comunes

### PostgreSQL no conecta:
```bash
# Linux
sudo systemctl start postgresql

# macOS
brew services start postgresql
```

### Pantalla en blanco:
```bash
npm run rebuild
npm start
```

### Puerto ocupado:
Cambiar `PORT=4001` en `backend/.env`

## 📞 Soporte

- 📖 README completo: [README.md](README.md)
- 🐛 Reportar bug: [Issues](https://github.com/tu-usuario/turismo-app/issues)
- 💬 Preguntas: [Discussions](https://github.com/tu-usuario/turismo-app/discussions)

¡Listo para explorar! 🌟
