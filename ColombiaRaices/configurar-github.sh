#!/bin/bash

# ================================================================
# SCRIPT DE CONFIGURACIÓN DE GITHUB - COLOMBIA RAÍCES
# Script para ayudar con la autenticación y push a GitHub
# ================================================================

echo "================================================================"
echo "   🇨🇴 COLOMBIA RAÍCES - CONFIGURACIÓN DE GITHUB 🇨🇴"
echo "================================================================"
echo ""

# Verificar estado actual
echo "📊 Estado actual del repositorio:"
echo "Remote configurado: $(git remote get-url origin 2>/dev/null || echo 'No configurado')"
echo "Rama actual: $(git branch --show-current)"
echo "Archivos pendientes: $(git status --porcelain | wc -l)"
echo ""

# Verificar si hay cambios para subir
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Hay cambios pendientes. Necesitas hacer commit primero."
    echo ""
    echo "Ejecuta:"
    echo "git add ."
    echo "git commit -m 'Tu mensaje de commit'"
    echo ""
fi

echo "🔐 OPCIONES DE AUTENTICACIÓN:"
echo ""
echo "A) HTTPS con Token (Recomendado para principiantes)"
echo "   1. Ve a: https://github.com/settings/tokens"
echo "   2. Click 'Generate new token (classic)'"
echo "   3. Selecciona 'repo' permissions"
echo "   4. Copia el token generado"
echo "   5. Usa el token como contraseña cuando Git te lo pida"
echo ""
echo "B) SSH Keys (Más seguro y conveniente)"
echo "   1. Genera una SSH key: ssh-keygen -t ed25519 -C 'tu_email@ejemplo.com'"
echo "   2. Agrega la key a GitHub: https://github.com/settings/ssh"
echo "   3. Cambia el remote a SSH: git remote set-url origin git@github.com:JuanDaleman/colombiaRaices.git"
echo ""

echo "================================================================"
echo "🚀 COMANDOS PARA SUBIR EL PROYECTO:"
echo "================================================================"
echo ""
echo "# Si usas HTTPS:"
echo "git push -u origin master"
echo ""
echo "# Si configuraste SSH:"
echo "git remote set-url origin git@github.com:JuanDaleman/colombiaRaices.git"
echo "git push -u origin master"
echo ""

echo "================================================================"
echo "📁 ARCHIVOS QUE SE SUBIRÁN:"
echo "================================================================"

# Mostrar archivos principales que se van a subir
echo ""
echo "✅ Archivos principales:"
echo "   📄 README.md (con información del equipo)"
echo "   🚀 instalar-colombia-raices.bat (instalador automático)"
echo "   ⚡ ejecutar-colombia-raices.bat (ejecutor rápido)"
echo "   📖 INSTALACION.md (guía completa)"
echo "   📊 ESTADO_FINAL.md (documentación del estado)"
echo ""
echo "✅ Código fuente:"
echo "   📁 main/ (backend Electron + Node.js)"
echo "   📁 renderer/ (frontend React)"
echo "   📁 tests/ (16 archivos de pruebas)"
echo "   📁 docs/ (documentación técnica)"
echo ""
echo "✅ Configuración:"
echo "   ⚙️  package.json (dependencias y scripts)"
echo "   🧪 jest.config.js (configuración de testing)"
echo "   🎨 tailwind.config.js (estilos)"
echo ""

echo "================================================================"
echo "🎯 SIGUIENTE PASO:"
echo "================================================================"
echo ""
echo "1. Elige una opción de autenticación (A o B)"
echo "2. Ejecuta: git push -u origin master"
echo "3. ¡Tu proyecto estará en GitHub!"
echo ""
echo "📧 Desarrollado por: Juan Camilo D'Aleman Rodriguez"
echo "🌐 Repositorio: https://github.com/JuanDaleman/colombiaRaices"
echo ""
