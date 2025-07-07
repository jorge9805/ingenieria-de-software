@echo off
REM ====================================
REM SCRIPT DE INSTALACIÓN PARA WINDOWS
REM TurismoApp - Aplicación de Turismo
REM ====================================

echo 🌟 Iniciando instalación de TurismoApp...
echo ========================================

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: Node.js no está instalado. Descárgalo desde https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: npm no está instalado. Viene incluido con Node.js.
    pause
    exit /b 1
)

REM Verificar PostgreSQL
psql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Error: PostgreSQL no está instalado. Descárgalo desde https://www.postgresql.org/download/
    pause
    exit /b 1
)

echo ✅ Todos los prerrequisitos están instalados

REM Mostrar versiones
echo.
echo 📋 Versiones instaladas:
node --version
npm --version
psql --version

REM Instalar dependencias principales
echo.
echo 📦 Instalando dependencias principales...
npm install
if %errorlevel% neq 0 (
    echo ❌ Error: Falló la instalación de dependencias
    pause
    exit /b 1
)
echo ✅ Dependencias principales instaladas

REM Instalar dependencias del frontend
echo.
echo 🎨 Instalando dependencias del frontend...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ Error: Falló la instalación de dependencias del frontend
    pause
    exit /b 1
)

REM Construir frontend
echo 🏗️ Construyendo frontend...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Error: Falló la construcción del frontend
    pause
    exit /b 1
)
echo ✅ Frontend construido exitosamente

cd ..

REM Instalar dependencias del backend
echo.
echo ⚙️ Instalando dependencias del backend...
cd backend
npm install
if %errorlevel% neq 0 (
    echo ❌ Error: Falló la instalación de dependencias del backend
    pause
    exit /b 1
)
echo ✅ Dependencias del backend instaladas

cd ..

REM Configurar .env
echo.
echo 🔧 Configurando variables de entorno...
if not exist "backend\.env" (
    if exist ".env.example" (
        copy .env.example backend\.env
        echo ✅ Archivo .env creado desde .env.example
        echo ⚠️ IMPORTANTE: Edita backend\.env con tu configuración de PostgreSQL
    ) else (
        echo ❌ No se encontró .env.example
    )
) else (
    echo ✅ El archivo .env ya existe
)

REM Resumen
echo.
echo 🎉 ¡Instalación completada!
echo ==========================
echo.
echo Para ejecutar la aplicación:
echo npm start
echo.
echo Comandos útiles:
echo npm run rebuild    # Reconstruir frontend
echo npm run build      # Empaquetar para distribución
echo.
echo Si hay problemas:
echo 1. Verifica que PostgreSQL esté corriendo
echo 2. Edita backend\.env con tu configuración
echo 3. Ejecuta database_setup.sql manualmente
echo.
echo 📚 Lee el README.md para más información
echo 🚀 ¡Disfruta usando TurismoApp!

pause
