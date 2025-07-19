# Script para iniciar la aplicación en modo desarrollo
# Autor: Asistente
# Descripción: Inicia automáticamente todos los servicios necesarios

Write-Host "🚀 Iniciando TurismoApp en modo desarrollo..." -ForegroundColor Green
Write-Host "📍 Directorio actual: $PWD" -ForegroundColor Yellow

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Error: No se encontró package.json. Asegúrate de estar en el directorio del proyecto." -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

# Verificar que existe el directorio frontend
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Error: No se encontró el directorio frontend." -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "✅ Estructura del proyecto verificada" -ForegroundColor Green

try {
    # Iniciar la aplicación Electron (que ahora inicia todo automáticamente)
    Write-Host "🔧 Iniciando Electron con Vite y Backend integrados..." -ForegroundColor Cyan
    npm start
}
catch {
    Write-Host "❌ Error al iniciar la aplicación: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}
