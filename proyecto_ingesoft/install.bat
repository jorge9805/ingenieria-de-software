@echo off
setlocal EnableDelayedExpansion
chcp 65001 > nul

rem ====================================
rem SCRIPT DE INSTALACIÓN AUTOMÁTICA
rem TurismoApp - Aplicación de Turismo  
rem ====================================

set SCRIPT_VERSION=3.0
set ERROR_COUNT=0

rem Colores para Windows (funciona en Windows 10+)
for /F %%a in ('echo prompt $E ^| cmd') do set "ESC=%%a"
set RED=%ESC%[91m
set GREEN=%ESC%[92m
set YELLOW=%ESC%[93m
set BLUE=%ESC%[94m
set RESET=%ESC%[0m

echo.
echo %GREEN%🌟 TurismoApp - Instalador Automático v%SCRIPT_VERSION%%RESET%
echo %BLUE%===============================================%RESET%
echo.

rem Función para manejar errores
goto :MAIN

:HandleError
set /a ERROR_COUNT+=1
echo %RED%❌ [ERROR #%ERROR_COUNT%] %~1%RESET%
if "%~2"=="fatal" (
    echo.
    echo %RED%💥 Instalación interrumpida debido a errores críticos%RESET%
    echo %YELLOW%📋 Revisa los mensajes de error anteriores%RESET%
    echo.
    pause
    exit /b 1
)
goto :eof

:MAIN

echo %BLUE%🔍 Verificando prerequisitos del sistema...%RESET%
echo.

rem Verificar si estamos en la carpeta correcta
if not exist "package.json" (
    call :HandleError "package.json no encontrado. Ejecuta este script desde la carpeta raíz del proyecto" "fatal"
)

rem Verificar Node.js con mejor detección
echo %YELLOW%🔧 Verificando Node.js...%RESET%
where node >nul 2>nul
if errorlevel 1 (
    call :HandleError "Node.js no está instalado o no está en el PATH. Descargalo desde https://nodejs.org/" "fatal"
)

for /f "tokens=*" %%a in ('node --version 2^>nul') do set NODE_VERSION=%%a
if "%NODE_VERSION%"=="" (
    call :HandleError "No se pudo obtener la versión de Node.js" "fatal"
)
echo   ✅ Node.js %NODE_VERSION% detectado

rem Verificar npm con mejor detección
echo %YELLOW%🔧 Verificando npm...%RESET%
where npm >nul 2>nul
if errorlevel 1 (
    call :HandleError "npm no está instalado o no está en el PATH. Viene incluido con Node.js" "fatal"
)

for /f "tokens=*" %%a in ('npm --version 2^>nul') do set NPM_VERSION=%%a
if "%NPM_VERSION%"=="" (
    call :HandleError "No se pudo obtener la versión de npm" "fatal"
)
echo   ✅ npm v%NPM_VERSION% detectado

rem Verificar git (opcional pero recomendado)
echo %YELLOW%🔧 Verificando Git...%RESET%
where git >nul 2>nul
if errorlevel 1 (
    echo   %YELLOW%⚠️  Git no detectado ^(opcional pero recomendado^)%RESET%
    set GIT_DETECTED=NO
) else (
    echo   ✅ Git detectado
    set GIT_DETECTED=YES
)

echo.
echo %GREEN%✅ Prerequisitos verificados correctamente%RESET%
echo.

rem Mostrar información del sistema
echo %BLUE%📋 Información del sistema:%RESET%
echo   🟢 Node.js: %NODE_VERSION%
echo   📦 npm: v%NPM_VERSION%
if "%GIT_DETECTED%"=="YES" (
    echo   🔗 Git detectado
) else (
    echo   ⚠️  Git no detectado
)
echo   🗄️  Base de datos: SQLite ^(incluida automáticamente^)
echo   💻 SO: Windows
echo.

rem Verificar estructura del proyecto
echo %BLUE%🏗️  Verificando estructura del proyecto...%RESET%

if not exist "package.json" (
    call :HandleError "No se encontró package.json. ¿Estás en el directorio correcto?" "fatal"
)

if not exist "frontend" (
    call :HandleError "No se encontró la carpeta 'frontend'" "fatal"
)

if not exist "backend" (
    call :HandleError "No se encontró la carpeta 'backend'" "fatal"
)

if not exist "frontend\package.json" (
    call :HandleError "No se encontró package.json en frontend" "fatal"
)

if not exist "backend\package.json" (
    call :HandleError "No se encontró package.json en backend" "fatal"
)

echo %GREEN%✅ Estructura del proyecto verificada%RESET%
echo.

rem Instalar dependencias del proyecto principal
echo %BLUE%📦 Instalando dependencias del proyecto principal...%RESET%

call npm install
if errorlevel 1 (
    call :HandleError "Falló la instalación de dependencias del proyecto principal"
    echo %YELLOW%💡 Posibles soluciones:%RESET%
    echo   - npm cache clean --force
    echo   - npm install --legacy-peer-deps
    echo   - Verificar conexión a internet
    echo.
    pause
    exit /b 1
)

echo %GREEN%✅ Dependencias del proyecto principal instaladas%RESET%
echo.

rem Instalar dependencias del frontend
echo %BLUE%🎨 Instalando dependencias del frontend...%RESET%
cd /d frontend

call npm install
if errorlevel 1 (
    cd /d ..
    call :HandleError "Falló la instalación de dependencias del frontend"
    echo %YELLOW%💡 Posibles soluciones:%RESET%
    echo   - cd frontend ^&^& npm install --legacy-peer-deps
    echo   - Verificar espacio en disco
    echo.
    pause
    exit /b 1
)

echo %GREEN%✅ Dependencias del frontend instaladas%RESET%
echo.

rem Construir el frontend
echo %BLUE%🔨 Construyendo el frontend para producción...%RESET%
call npm run build
if errorlevel 1 (
    cd /d ..
    call :HandleError "Falló la construcción del frontend"
    echo %YELLOW%💡 Posible solución:%RESET%
    echo   - cd frontend ^&^& npm run build
    echo.
    pause
    exit /b 1
)

echo %GREEN%✅ Frontend construido exitosamente%RESET%
echo.

rem Volver al directorio raíz
cd /d ..

rem Instalar dependencias del backend
echo %BLUE%🔧 Instalando dependencias del backend...%RESET%
cd /d backend

call npm install
if errorlevel 1 (
    cd /d ..
    call :HandleError "Falló la instalación de dependencias del backend"
    echo %YELLOW%💡 Posible solución:%RESET%
    echo   - cd backend ^&^& npm install --legacy-peer-deps
    echo.
    pause
    exit /b 1
)

echo %GREEN%✅ Dependencias del backend instaladas%RESET%
echo.

rem Volver al directorio raíz
cd /d ..

rem Configurar archivo .env
echo %BLUE%⚙️  Configurando variables de entorno...%RESET%

if not exist "backend\.env" (
    if exist ".env.example" (
        copy ".env.example" "backend\.env" >nul 2>&1
        if errorlevel 1 (
            call :HandleError "No se pudo copiar .env.example a backend\.env"
        ) else (
            echo %GREEN%✅ Archivo .env creado desde .env.example%RESET%
            echo %YELLOW%⚠️  IMPORTANTE: Edita backend\.env con tu JWT_SECRET personalizado%RESET%
        )
    ) else (
        call :HandleError "No se encontró .env.example para crear la configuración"
        echo %YELLOW%💡 Crea manualmente backend\.env con las variables necesarias%RESET%
    )
) else (
    echo %GREEN%✅ El archivo .env ya existe%RESET%
)
echo.

rem Verificar configuración de CORS
echo %BLUE%ℹ️  Verificando configuración de CORS...%RESET%
if exist "backend\.env" (
    findstr /C:"CORS_ORIGIN=http://localhost:5173" "backend\.env" >nul 2>&1
    if errorlevel 1 (
        echo %YELLOW%⚠️  Verificar CORS_ORIGIN en backend\.env ^(debería ser http://localhost:5173 para Vite^)%RESET%
    ) else (
        echo %GREEN%✅ Configuración de CORS verificada%RESET%
    )
)
echo.

rem Configuración automática de SQLite
echo %BLUE%ℹ️  Información de la base de datos SQLite...%RESET%
echo %GREEN%✅ SQLite se configurará automáticamente al iniciar la aplicación%RESET%
echo %BLUE%📍 Ubicación: backend\database\turismo.db%RESET%
echo %BLUE%📊 Los datos de ejemplo se insertarán automáticamente%RESET%
echo %BLUE%👤 Usuario demo: demo@turismo.com / demo123%RESET%
echo.

rem Verificar puertos disponibles
echo %BLUE%🔍 Verificando puertos...%RESET%
netstat -an | findstr ":4000" >nul 2>&1
if not errorlevel 1 (
    echo %YELLOW%⚠️  Puerto 4000 puede estar en uso ^(backend^)%RESET%
)

netstat -an | findstr ":5173" >nul 2>&1
if not errorlevel 1 (
    echo %YELLOW%⚠️  Puerto 5173 puede estar en uso ^(frontend^)%RESET%
)
echo.

rem Resumen final con mejor formato
echo.
echo %GREEN%════════════════════════════════════════════════════════%RESET%
if %ERROR_COUNT% GTR 0 (
    echo %YELLOW%🎯 Instalación completada con %ERROR_COUNT% advertencias%RESET%
) else (
    echo %GREEN%🎉 ¡Instalación completada exitosamente!%RESET%
)
echo %GREEN%════════════════════════════════════════════════════════%RESET%
echo.

echo %GREEN%🚀 Para ejecutar la aplicación:%RESET%
echo   %BLUE%npm start%RESET%                    🔥 Ejecuta backend y frontend
echo.

echo %GREEN%🛠️  Comandos útiles:%RESET%
echo   %BLUE%npm run dev%RESET%                  🔧 Modo desarrollo
echo   %BLUE%npm run rebuild%RESET%              🔨 Reconstruir frontend
echo   %BLUE%npm run backend%RESET%              ⚙️  Solo backend
echo   %BLUE%npm run frontend%RESET%             🎨 Solo frontend
echo.

echo %GREEN%🌐 URLs de la aplicación:%RESET%
echo   %BLUE%Frontend: http://localhost:5173%RESET%     🎨 Interfaz web
echo   %BLUE%Backend API: http://localhost:4000%RESET%  ⚙️  Servicios API
echo.

echo %GREEN%🗄️  Base de datos SQLite:%RESET%
echo   ✅ Sin configuración adicional necesaria
echo   ✅ Base de datos portable en un archivo
echo   ✅ Datos de ejemplo incluidos automáticamente
echo.

echo %GREEN%👤 Usuario demo:%RESET%
echo   📧 Email: %BLUE%demo@turismo.com%RESET%
echo   🔑 Password: %BLUE%demo123%RESET%
echo.

echo %GREEN%🔧 Si encuentras problemas:%RESET%
echo   1️⃣  Verifica que Node.js esté actualizado (v18+)
echo   2️⃣  Edita backend\.env con tu JWT_SECRET personalizado
echo   3️⃣  Asegúrate de que los puertos 4000 y 5173 estén libres
echo   4️⃣  La base de datos SQLite se crea automáticamente
echo   5️⃣  Usa Git Bash si hay problemas con Command Prompt
echo.

echo %BLUE%📖 Lee el README.md para documentación completa%RESET%
echo %BLUE%🐛 Reporta problemas en el repositorio del proyecto%RESET%
echo.

echo %GREEN%🎉 ¡Listo para usar TurismoApp! 🌟%RESET%
echo.

if %ERROR_COUNT% GTR 0 (
    echo %YELLOW%⚠️  Se encontraron %ERROR_COUNT% advertencias durante la instalación%RESET%
    echo %YELLOW%💡 Revisa los mensajes anteriores si tienes problemas%RESET%
    echo.
)

echo %BLUE%════════════════════════════════════════════════════════%RESET%
echo %BLUE%💻 TurismoApp Installer v%SCRIPT_VERSION% - Instalación completada%RESET%
echo %BLUE%════════════════════════════════════════════════════════%RESET%
echo.
echo %GREEN%Presiona cualquier tecla para continuar...%RESET%
pause >nul

rem Limpiar variables al final
set NODE_VERSION=
set NPM_VERSION=
set GIT_DETECTED=
set ERROR_COUNT=

endlocal
