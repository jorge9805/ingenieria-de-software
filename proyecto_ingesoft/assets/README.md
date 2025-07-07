# Assets para TurismoApp

Este directorio contiene los recursos necesarios para el empaquetado de la aplicación:

## Iconos necesarios:

- `icon.png` - Icono principal (512x512 px) para Linux
- `icon.ico` - Icono para Windows (múltiples tamaños)
- `icon.icns` - Icono para macOS (múltiples tamaños)

## Cómo generar iconos:

1. Crear un icono base de 512x512 px en formato PNG
2. Usar herramientas como:
   - `electron-icon-builder` para generar todos los formatos
   - Convertidores online
   - Herramientas de diseño como GIMP, Photoshop, etc.

## Ejemplo de comando para generar iconos:

```bash
npm install -g electron-icon-builder
electron-icon-builder --input=./icon-source.png --output=./assets --flatten
```

Por ahora, la aplicación funcionará sin iconos personalizados usando los iconos por defecto de Electron.
