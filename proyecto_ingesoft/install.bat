@echo off
setlocal EnableDelayedExpansion
chcp 65001 > nul

rem ====================================
rem SCRIPT DE INSTALACIÓN AUTOMÁTICA
rem TurismoApp - Aplicación de Turismo
rem ====================================

set SCRIPT_VERSION=2.0
set ERROR_COUNT=0

rem Colores para Windows (si es compatible)
set RED=[91m
set GREEN=[92m
set YELLOW=[93m
set BLUE=[94m
set RESET=[0m

echo.
echo %GREEN%*** TurismoApp - Instalador Automatico v%SCRIPT_VERSION%%RESET%
echo %BLUE%========================================%RESET%
echo.

rem Función para manejar errores
:HandleError
set /a ERROR_COUNT+=1
echo %RED%[ERROR #%ERROR_COUNT%] %1%RESET%
if "%2"=="fatal" (
    echo.
    echo %RED%*** Instalacion interrumpida debido a errores criticos%RESET%
    echo %YELLOW%*** Revisa los mensajes de error anteriores%RESET%
    echo.
    pause
    exit /b 1
)
goto :eof

rem Verificar prerrequisitos
echo %BLUE%[INFO] Verificando prerrequisitos...%RESET%

rem Verificar Node.js
node --version >nul 2>&1
if errorlevel 1 (
    call :HandleError "Node.js no esta instalado. Descargalo desde https://nodejs.org/" "fatal"
)

rem Verificar npm
npm --version >nul 2>&1
if errorlevel 1 (
    call :HandleError "npm no esta instalado. Viene incluido con Node.js" "fatal"
)

rem Verificar Git (opcional pero recomendado)
git --version >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%[ADVERTENCIA] Git no esta instalado (recomendado pero no requerido)%RESET%
    set /a ERROR_COUNT+=1
) else (
    echo %GREEN%[OK] Git encontrado%RESET%
)

echo %GREEN%[OK] Prerrequisitos verificados%RESET%
echo.

rem Mostrar versiones
echo %BLUE%[INFO] Informacion del sistema:%RESET%
for /f "tokens=*" %%i in ('node --version 2^>nul') do echo   Node.js: %%i
for /f "tokens=*" %%i in ('npm --version 2^>nul') do echo   npm: %%i
if errorlevel 0 (
    for /f "tokens=1-3" %%i in ('git --version 2^>nul') do echo   Git: %%i %%j %%k
)
echo   Base de datos: SQLite (incluida automaticamente)
echo   SO: Windows
echo.

rem Verificar estructura del proyecto
echo %BLUE%[INFO] Verificando estructura del proyecto...%RESET%

if not exist "package.json" (
    call :HandleError "No se encontro package.json. Estas en el directorio correcto?" "fatal"
)

if not exist "frontend" (
    call :HandleError "No se encontro la carpeta 'frontend'" "fatal"
)

if not exist "backend" (
    call :HandleError "No se encontro la carpeta 'backend'" "fatal"
)

if not exist "frontend\package.json" (
    call :HandleError "No se encontro package.json en frontend" "fatal"
)

if not exist "backend\package.json" (
    call :HandleError "No se encontro package.json en backend" "fatal"
)

echo %GREEN%[OK] Estructura del proyecto verificada%RESET%
echo.

rem Instalar dependencias del proyecto principal
echo %BLUE%[INFO] Instalando dependencias del proyecto principal...%RESET%

npm install
if errorlevel 1 (
    call :HandleError "Fallo la instalacion de dependencias del proyecto principal"
    echo %YELLOW%[TIP] Intenta ejecutar: npm cache clean --force%RESET%
    echo %YELLOW%[TIP] Y luego: npm install%RESET%
    echo.
    pause
    exit /b 1
)

echo %GREEN%[OK] Dependencias del proyecto principal instaladas%RESET%
echo.

rem Instalar dependencias del frontend
echo %BLUE%[INFO] Instalando dependencias del frontend...%RESET%
pushd frontend

npm install
if errorlevel 1 (
    popd
    call :HandleError "Fallo la instalacion de dependencias del frontend"
    echo %YELLOW%[TIP] Intenta: cd frontend ^&^& npm install%RESET%
    echo.
    pause
    exit /b 1
)

echo %GREEN%[OK] Dependencias del frontend instaladas%RESET%
echo.

rem Construir el frontend
echo %BLUE%[INFO] Construyendo el frontend para produccion...%RESET%
npm run build
if errorlevel 1 (
    popd
    call :HandleError "Fallo la construccion del frontend"
    echo %YELLOW%[TIP] Intenta: cd frontend ^&^& npm run build%RESET%
    echo.
    pause
    exit /b 1
)

echo %GREEN%[OK] Frontend construido exitosamente%RESET%
echo.

rem Volver al directorio raíz
popd

rem Instalar dependencias del backend
echo %BLUE%[INFO] Instalando dependencias del backend...%RESET%
pushd backend

npm install
if errorlevel 1 (
    popd
    call :HandleError "Fallo la instalacion de dependencias del backend"
    echo %YELLOW%[TIP] Intenta: cd backend ^&^& npm install%RESET%
    echo.
    pause
    exit /b 1
)

echo %GREEN%[OK] Dependencias del backend instaladas%RESET%
echo.

rem Volver al directorio raíz
popd

rem Configurar archivo .env
echo %BLUE%[INFO] Configurando variables de entorno...%RESET%

if not exist "backend\.env" (
    if exist ".env.example" (
        copy ".env.example" "backend\.env" >nul 2>&1
        if errorlevel 1 (
            call :HandleError "No se pudo copiar .env.example a backend\.env"
        ) else (
            echo %GREEN%[OK] Archivo .env creado desde .env.example%RESET%
            echo %YELLOW%[IMPORTANTE] Edita backend\.env con tu JWT_SECRET personalizado%RESET%
        )
    ) else (
        call :HandleError "No se encontro .env.example para crear la configuracion"
        echo %YELLOW%[TIP] Crea manualmente backend\.env con las variables necesarias%RESET%
    )
) else (
    echo %GREEN%[OK] El archivo .env ya existe%RESET%
)
echo.

rem Verificar configuración de CORS
echo %BLUE%[INFO] Verificando configuracion de CORS...%RESET%
if exist "backend\.env" (
    findstr /C:"CORS_ORIGIN=http://localhost:5173" "backend\.env" >nul 2>&1
    if errorlevel 1 (
        echo %YELLOW%[ADVERTENCIA] Verificar CORS_ORIGIN en backend\.env (deberia ser http://localhost:5173 para Vite)%RESET%
    ) else (
        echo %GREEN%[OK] Configuracion de CORS verificada%RESET%
    )
)
echo.

rem Configuración automática de SQLite
echo %BLUE%[INFO] Informacion de la base de datos SQLite...%RESET%
echo %GREEN%[OK] SQLite se configurara automaticamente al iniciar la aplicacion%RESET%
echo %BLUE%[INFO] Ubicacion: backend\database\turismo.db%RESET%
echo %BLUE%[INFO] Los datos de ejemplo se insertaran automaticamente%RESET%
echo %BLUE%[INFO] Usuario demo: demo@turismo.com / demo123%RESET%
echo.

rem Verificar puertos disponibles
echo %BLUE%[INFO] Verificando puertos...%RESET%
netstat -an | findstr ":4000" >nul 2>&1
if not errorlevel 1 (
    echo %YELLOW%[ADVERTENCIA] Puerto 4000 puede estar en uso (backend)%RESET%
)

netstat -an | findstr ":5173" >nul 2>&1
if not errorlevel 1 (
    echo %YELLOW%[ADVERTENCIA] Puerto 5173 puede estar en uso (frontend)%RESET%
)
echo.

rem Resumen final
if %ERROR_COUNT% GTR 0 (
    echo %YELLOW%[ADVERTENCIA] Instalacion completada con %ERROR_COUNT% advertencias%RESET%
) else (
    echo %GREEN%*** Instalacion completada exitosamente! ***%RESET%
)
echo %BLUE%===========================%RESET%
echo.
echo %GREEN%Para ejecutar la aplicacion:%RESET%
echo   %BLUE%npm start%RESET%                 (Ejecuta backend y frontend)
echo.
echo %GREEN%Comandos utiles:%RESET%
echo   %BLUE%npm run dev%RESET%               (Modo desarrollo)
echo   %BLUE%npm run rebuild%RESET%           (Reconstruir frontend)
echo   %BLUE%npm run backend%RESET%           (Solo backend)
echo   %BLUE%npm run frontend%RESET%          (Solo frontend)
echo.
echo %GREEN%URLs de la aplicacion:%RESET%
echo   %BLUE%Frontend: http://localhost:5173%RESET%
echo   %BLUE%Backend API: http://localhost:4000%RESET%
echo.
echo %GREEN%Base de datos SQLite:%RESET%
echo   %GREEN%[OK] Sin configuracion adicional necesaria%RESET%
echo   %GREEN%[OK] Base de datos portable en un archivo%RESET%
echo   %GREEN%[OK] Datos de ejemplo incluidos automaticamente%RESET%
echo.
echo %GREEN%Usuario demo:%RESET%
echo   %BLUE%Email: demo@turismo.com%RESET%
echo   %BLUE%Password: demo123%RESET%
echo.
echo %GREEN%Si encuentras problemas:%RESET%
echo   %YELLOW%1. Verifica que Node.js este actualizado (v18+)%RESET%
echo   %YELLOW%2. Edita backend\.env con tu JWT_SECRET personalizado%RESET%
echo   %YELLOW%3. Asegurate de que los puertos 4000 y 5173 esten libres%RESET%
echo   %YELLOW%4. La base de datos SQLite se crea automaticamente%RESET%
echo.
echo %BLUE%Lee el README.md para documentacion completa%RESET%
echo %BLUE%Reporta problemas en el repositorio del proyecto%RESET%
echo.
echo %GREEN%*** Listo para usar TurismoApp! ***%RESET%
echo.

if %ERROR_COUNT% GTR 0 (
    echo %YELLOW%[ADVERTENCIA] Se encontraron %ERROR_COUNT% advertencias durante la instalacion%RESET%
    echo %YELLOW%Revisa los mensajes anteriores si tienes problemas%RESET%
    echo.
)

echo Presiona cualquier tecla para continuar...
pause >nul
