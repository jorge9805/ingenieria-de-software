@echo off
echo 🚀 Iniciando TurismoApp en modo desarrollo...
echo 📍 Directorio actual: %CD%

REM Verificar que estamos en el directorio correcto
if not exist "package.json" (
    echo ❌ Error: No se encontro package.json. Asegurate de estar en el directorio del proyecto.
    pause
    exit /b 1
)

REM Verificar que existe el directorio frontend
if not exist "frontend" (
    echo ❌ Error: No se encontro el directorio frontend.
    pause
    exit /b 1
)

echo ✅ Estructura del proyecto verificada

echo 🔧 Iniciando Electron con Vite y Backend integrados...
npm start

pause
