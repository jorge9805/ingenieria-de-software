#!/bin/bash

# ====================================
# SCRIPT DE INSTALACIÓN AUTOMÁTICA
# TurismoApp - Aplicación de Turismo
# ====================================

echo "🌟 Iniciando instalación de TurismoApp..."
echo "========================================"

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para mostrar errores
show_error() {
    echo "❌ Error: $1"
    exit 1
}

# Función para mostrar éxito
show_success() {
    echo "✅ $1"
}

# Verificar prerrequisitos
echo "🔍 Verificando prerrequisitos..."

if ! command_exists node; then
    show_error "Node.js no está instalado. Descárgalo desde https://nodejs.org/"
fi

if ! command_exists npm; then
    show_error "npm no está instalado. Viene incluido con Node.js."
fi

if ! command_exists git; then
    show_error "Git no está instalado. Descárgalo desde https://git-scm.com/"
fi

show_success "Todos los prerrequisitos están instalados"

# Verificar versiones
echo ""
echo "📋 Versiones instaladas:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Git: $(git --version)"
echo "Base de datos: SQLite (incluida automáticamente)"

# Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."

if [ ! -f "package.json" ]; then
    show_error "No se encontró package.json. ¿Estás en el directorio correcto?"
fi

npm install

if [ $? -ne 0 ]; then
    show_error "Falló la instalación de dependencias del proyecto principal"
fi

show_success "Dependencias del proyecto principal instaladas"

# Instalar dependencias del frontend
echo ""
echo "🎨 Instalando dependencias del frontend..."
cd frontend

if [ ! -f "package.json" ]; then
    show_error "No se encontró package.json en la carpeta frontend"
fi

npm install

if [ $? -ne 0 ]; then
    show_error "Falló la instalación de dependencias del frontend"
fi

show_success "Dependencias del frontend instaladas"

# Construir el frontend
echo ""
echo "🏗️ Construyendo el frontend..."
npm run build

if [ $? -ne 0 ]; then
    show_error "Falló la construcción del frontend"
fi

show_success "Frontend construido exitosamente"

# Volver al directorio raíz
cd ..

# Instalar dependencias del backend
echo ""
echo "⚙️ Instalando dependencias del backend..."
cd backend

if [ ! -f "package.json" ]; then
    show_error "No se encontró package.json en la carpeta backend"
fi

npm install

if [ $? -ne 0 ]; then
    show_error "Falló la instalación de dependencias del backend"
fi

show_success "Dependencias del backend instaladas"

# Volver al directorio raíz
cd ..

# Configurar archivo .env
echo ""
echo "🔧 Configurando variables de entorno..."

if [ ! -f "backend/.env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example backend/.env
        show_success "Archivo .env creado desde .env.example"
        echo "⚠️ IMPORTANTE: Edita backend/.env con tu JWT_SECRET personalizado"
    else
        show_error "No se encontró .env.example para crear la configuración"
    fi
else
    show_success "El archivo .env ya existe"
fi

# Configuración automática de SQLite
echo ""
echo "🗄️ Configurando base de datos SQLite..."
show_success "SQLite se configurará automáticamente al iniciar la aplicación"
echo "📁 Base de datos se creará en: backend/database/turismo.db"
echo "🌱 Datos de ejemplo se insertarán automáticamente"

# Resumen final
echo ""
echo "🎉 ¡Instalación completada!"
echo "=========================="
echo ""
echo "Para ejecutar la aplicación:"
echo "npm start"
echo ""
echo "Comandos útiles:"
echo "npm run rebuild    # Reconstruir frontend"
echo "npm run build      # Empaquetar para distribución"
echo ""
echo "Características de SQLite:"
echo "✅ Sin configuración adicional necesaria"
echo "✅ Base de datos portable en un archivo"
echo "✅ Datos de ejemplo incluidos automáticamente"
echo ""
echo "Usuario demo disponible:"
echo "📧 Email: demo@turismo.com"
echo "🔑 Password: demo123"
echo ""
echo "Si hay problemas:"
echo "1. Verifica que Node.js esté actualizado (v18+)"
echo "2. Edita backend/.env con tu JWT_SECRET personalizado"
echo "3. La base de datos SQLite se crea automáticamente"
echo ""
echo "📚 Lee el README.md para más información"
echo ""
echo "🚀 ¡Disfruta usando TurismoApp!"
