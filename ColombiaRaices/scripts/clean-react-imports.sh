#!/bin/bash

# Script para limpiar imports de React innecesarios en Colombia Raíces
echo "🧹 Limpiando imports de React innecesarios..."

# Encontrar todos los archivos JSX y JS en renderer/src
find renderer/src -name "*.jsx" -o -name "*.js" | while read file; do
    # Verificar si el archivo tiene import React
    if grep -q "import React" "$file"; then
        echo "📄 Procesando: $file"
        
        # Reemplazar diferentes patrones de import React
        sed -i "s/import React, { \([^}]*\) } from 'react';/import { \1 } from 'react';/g" "$file"
        sed -i "s/import React from 'react';//g" "$file"
        sed -i "s/import React, { } from 'react';//g" "$file"
        sed -i "/^import React$/d" "$file"
        
        # Limpiar líneas vacías extra
        sed -i '/^$/N;/^\n$/d' "$file"
        
        echo "✅ Limpiado: $file"
    fi
done

echo "🎯 Limpieza de imports React completada"
echo "📊 Ejecutando lint para ver mejoras..."

npm run lint 2>/dev/null | tail -5
