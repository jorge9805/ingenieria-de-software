@echo off
chcp 65001 >nul
title Colombia Raices - Instalador

cls
echo ================================================================
echo        COLOMBIA RAICES - TURISMO COMUNITARIO
echo ================================================================
echo.
echo Instalador automatico del sistema Colombia Raices
echo.

if not exist "package.json" (
    echo ERROR: No se encontro package.json
    pause
    exit /b 1
)

echo [1/4] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js no esta instalado
    echo Descarga desde: https://nodejs.org
    pause
    exit /b 1
)

echo [2/4] Instalando dependencias...
call npm install
if errorlevel 1 (
    echo ERROR: Fallo instalacion
    pause
    exit /b 1
)

echo [3/4] Construyendo aplicacion...
call npm run build:renderer
if errorlevel 1 (
    echo ERROR: Fallo construccion
    pause
    exit /b 1
)

echo [4/4] Verificando...
if not exist "renderer\dist" (
    echo ERROR: Build no encontrado
    pause
    exit /b 1
)

echo.
echo ===============================================
echo     INSTALACION COMPLETADA EXITOSAMENTE
echo ===============================================
echo.
echo Para ejecutar: ejecutar-colombia-raices.bat
echo.
echo Presiona cualquier tecla para probar...
pause >nul

echo Iniciando Colombia Raices...
start "" npm start

echo Si no se abrio, ejecuta: npm start
pause
