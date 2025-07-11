@echo off
setlocal EnableDelayedExpansion

rem ====================================
rem SCRIPT DE INSTALACIÓN AUTOMÁTICA
rem TurismoApp - Aplicación de Turismo
rem ====================================

echo 🌟 Iniciando instalación de TurismoApp...
echo ========================================
echo.

rem Verificar prerrequisitos
echo 🔍 Verificando prerrequisitos...

rem Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js no está instalado. Descárgalo desde https://nodejs.org/
    pause
    exit /b 1
)

rem Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm no está instalado. Viene incluido con Node.js.
    pause
    exit /b 1
)

rem Verificar Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Git no está instalado. Descárgalo desde https://git-scm.com/
    pause
    exit /b 1
)

echo ✅ Todos los prerrequisitos están instalados
echo.

rem Mostrar versiones
echo 📋 Versiones instaladas:
for /f "tokens=*" %%i in ('node --version') do echo Node.js: %%i
for /f "tokens=*" %%i in ('npm --version') do echo npm: %%i
for /f "tokens=1-3" %%i in ('git --version') do echo Git: %%i %%j %%k
echo Base de datos: SQLite (incluida automáticamente)
echo.

rem Instalar dependencias del proyecto principal
echo 📦 Instalando dependencias...

if not exist "package.json" (
    echo ❌ Error: No se encontró package.json. ¿Estás en el directorio correcto?
    pause
    exit /b 1
)

npm install
if errorlevel 1 (
    echo ❌ Error: Falló la instalación de dependencias del proyecto principal
    pause
    exit /b 1
)

echo ✅ Dependencias del proyecto principal instaladas
echo.

rem Instalar dependencias del frontend
echo 🎨 Instalando dependencias del frontend...
cd frontend

if not exist "package.json" (
    echo ❌ Error: No se encontró package.json en la carpeta frontend
    pause
    exit /b 1
)

npm install
if errorlevel 1 (
    echo ❌ Error: Falló la instalación de dependencias del frontend
    pause
    exit /b 1
)

echo ✅ Dependencias del frontend instaladas
echo.

rem Construir el frontend
echo 🏗️ Construyendo el frontend...
npm run build
if errorlevel 1 (
    echo ❌ Error: Falló la construcción del frontend
    pause
    exit /b 1
)

echo ✅ Frontend construido exitosamente
echo.

rem Volver al directorio raíz
cd ..

rem Instalar dependencias del backend
echo ⚙️ Instalando dependencias del backend...
cd backend

if not exist "package.json" (
    echo ❌ Error: No se encontró package.json en la carpeta backend
    pause
    exit /b 1
)

npm install
if errorlevel 1 (
    echo ❌ Error: Falló la instalación de dependencias del backend
    pause
    exit /b 1
)

echo ✅ Dependencias del backend instaladas
echo.

rem Volver al directorio raíz
cd ..

rem Configurar archivo .env
echo 🔧 Configurando variables de entorno...

if not exist "backend\.env" (
    if exist ".env.example" (
        copy ".env.example" "backend\.env" >nul
        echo ✅ Archivo .env creado desde .env.example
        echo ⚠️ IMPORTANTE: Edita backend\.env con tu JWT_SECRET personalizado
    ) else (
        echo ❌ Error: No se encontró .env.example para crear la configuración
        pause
        exit /b 1
    )
) else (
    echo ✅ El archivo .env ya existe
)
echo.

rem Configuración automática de SQLite
echo 🗄️ Configurando base de datos SQLite...
echo ✅ SQLite se configurará automáticamente al iniciar la aplicación
echo 📁 Base de datos se creará en: backend\database\turismo.db
echo 🌱 Datos de ejemplo se insertarán automáticamente
echo.

rem Resumen final
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
echo Características de SQLite:
echo ✅ Sin configuración adicional necesaria
echo ✅ Base de datos portable en un archivo
echo ✅ Datos de ejemplo incluidos automáticamente
echo.
echo Usuario demo disponible:
echo 📧 Email: demo@turismo.com
echo 🔑 Password: demo123
echo.
echo Si hay problemas:
echo 1. Verifica que Node.js esté actualizado (v18+)
echo 2. Edita backend\.env con tu JWT_SECRET personalizado
echo 3. La base de datos SQLite se crea automáticamente
echo.
echo 📚 Lee el README.md para más información
echo.
echo 🚀 ¡Disfruta usando TurismoApp!
echo.

pause
